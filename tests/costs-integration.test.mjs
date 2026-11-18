import assert from "node:assert/strict"
import test from "node:test"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { QueryClient, QueryObserver, focusManager } from "@tanstack/react-query"
import { createSourceLoader } from "./helpers/load-source.mjs"

const load = createSourceLoader()
const { projectCostQueryOptions } = load(
  "src/features/costs/hooks/project-cost-query-options.ts"
)
const { invalidateProjectCosts } = load(
  "src/features/costs/hooks/query-keys.ts"
)
const { ApiError } = load("src/lib/api/api-error.ts")
const { getProjectCosts, getProjectCostSummary } = load(
  "src/features/costs/services/costs-service.ts"
)
const { ProjectCostSummaryCard } = load(
  "src/features/costs/ui/project-cost-summary-card.tsx"
)
const { ProfileCostDistributionChart } = load(
  "src/features/costs/ui/profile-cost-distribution-chart.tsx"
)
const { ProfileCostBreakdownTable } = load(
  "src/features/costs/ui/profile-cost-breakdown-table.tsx"
)
const { TaskCostsTable } = load("src/features/costs/ui/task-costs-table.tsx")

const response = {
  projectId: "project-1",
  total: { amount: 600, currency: "PEN" },
  tasks: [
    {
      taskId: "task-1",
      taskTitle: "Definir alcance",
      total: { amount: 600, currency: "PEN" },
      contributions: [
        {
          technicalProfileId: "profile-1",
          profileName: "Ana Ruiz",
          profileEmail: "ana@example.com",
          profileRole: "DEVELOPER",
          hours: 10,
          hourlyRate: 60,
          cost: { amount: 600, currency: "PEN" },
        },
      ],
    },
  ],
  profiles: [
    {
      technicalProfileId: "profile-1",
      profileName: "Ana Ruiz",
      profileEmail: "ana@example.com",
      profileRole: "DEVELOPER",
      subtotal: { amount: 600, currency: "PEN" },
    },
  ],
}

const mockFetch = (context, implementation) => {
  const original = globalThis.fetch
  globalThis.fetch = implementation
  context.after(() => {
    globalThis.fetch = original
  })
}

test("cost requests reuse JWT, URL encoding and the abort signal", async (context) => {
  const original = globalThis.window
  const tokens = JSON.stringify({ accessToken: "isolated-test-token" })
  globalThis.window = { localStorage: { getItem: () => tokens } }
  context.after(() => {
    globalThis.window = original
  })
  const signal = new AbortController().signal

  mockFetch(context, async (url, options) => {
    assert.ok(url.endsWith("/api/v1/project-costs/project%2F1"))
    assert.equal(
      options.headers.get("Authorization"),
      "Bearer isolated-test-token"
    )
    assert.equal(options.signal, signal)
    return Response.json(response)
  })

  assert.deepEqual(await getProjectCosts("project/1", signal), response)
})

test("HTTP errors preserve their status and never become zero-cost summaries", async (context) => {
  const original = globalThis.window
  globalThis.window = {
    localStorage: { getItem: () => null, removeItem: () => {} },
  }
  context.after(() => {
    globalThis.window = original
  })
  let status = 400
  mockFetch(context, async () =>
    Response.json({ message: "Test error" }, { status })
  )
  for (status of [400, 401, 403, 404, 409, 500]) {
    await assert.rejects(
      getProjectCostSummary("project-1"),
      (error) => error instanceof ApiError && error.status === status
    )
  }
})

test("an expired access token is refreshed once before retrying costs", async (context) => {
  const original = globalThis.window
  const storage = new Map([
    [
      "software-estimation:auth-tokens",
      JSON.stringify({
        accessToken: "expired-test-token",
        refreshToken: "test-refresh-token",
      }),
    ],
  ])
  globalThis.window = {
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: (key) => storage.delete(key),
    },
  }
  context.after(() => {
    globalThis.window = original
  })
  let costsRequests = 0
  let refreshRequests = 0
  mockFetch(context, async (url, options) => {
    if (url.endsWith("/auth/refresh-token")) {
      refreshRequests++
      return Response.json({
        token: "renewed-test-token",
        refreshToken: "new-test-refresh",
        tokenType: "Bearer",
        expiresInSeconds: 60,
      })
    }
    costsRequests++
    if (costsRequests === 1)
      return Response.json({ message: "Expired" }, { status: 401 })
    assert.equal(
      options.headers.get("Authorization"),
      "Bearer renewed-test-token"
    )
    return Response.json(response)
  })

  assert.deepEqual(await getProjectCosts("project-1"), response)
  assert.equal(refreshRequests, 1)
  assert.equal(costsRequests, 2)
})

test("empty HTTP responses stay distinct from valid empty projects", async (context) => {
  mockFetch(context, async () => new Response(null, { status: 204 }))
  const options = projectCostQueryOptions("project-1")
  assert.equal(
    await options.queryFn({ signal: new AbortController().signal }),
    null
  )
  await assert.rejects(getProjectCostSummary("project-1"), /no devolvi/)
  assert.equal(options.select(null), null)
  assert.equal(projectCostQueryOptions(" ").enabled, false)
})

test("client errors are not retried and server errors have one retry", () => {
  const { retry } = projectCostQueryOptions("project-1")
  for (const status of [400, 401, 403, 404, 409]) {
    assert.equal(retry(0, new ApiError(status, "Test error")), false)
  }
  assert.equal(retry(0, new ApiError(500, "Test error")), true)
  assert.equal(retry(1, new ApiError(500, "Test error")), false)
})

test("cancelling the cost query aborts its pending HTTP request", async (context) => {
  let aborted = false
  mockFetch(
    context,
    (url, options) =>
      new Promise((resolve, reject) => {
        options.signal.addEventListener(
          "abort",
          () => {
            aborted = true
            reject(new DOMException("Aborted test request", "AbortError"))
          },
          { once: true }
        )
      })
  )
  const client = new QueryClient()
  context.after(() => client.clear())
  const pending = client.fetchQuery(projectCostQueryOptions("project-1"))
  const rejection = assert.rejects(pending)
  await client.cancelQueries({ queryKey: ["project-costs", "project-1"] })
  await rejection
  assert.equal(aborted, true)
})

test("concurrent cost observers share one request and fresh cached data", async (context) => {
  let requests = 0
  mockFetch(context, async () => {
    requests++
    return Response.json(response)
  })
  const client = new QueryClient()
  context.after(() => client.clear())
  const options = projectCostQueryOptions("project-1")

  await Promise.all([client.fetchQuery(options), client.fetchQuery(options)])
  await client.fetchQuery(options)
  assert.equal(requests, 1)
})

test("invalidation refreshes active costs after hours, CER or assignments change", async (context) => {
  let hours = 9
  let rate = 50
  let amount = 450
  let profile = "profile-1"
  mockFetch(context, async () =>
    Response.json({
      projectId: "project-1",
      total: { amount, currency: "PEN" },
      tasks: [
        {
          taskId: "task-1",
          taskTitle: "Definir alcance",
          total: { amount, currency: "PEN" },
          contributions: [
            {
              technicalProfileId: profile,
              profileName: "Ana Ruiz",
              profileEmail: "ana@example.com",
              profileRole: "DEVELOPER",
              hours,
              hourlyRate: rate,
              cost: { amount, currency: "PEN" },
            },
          ],
        },
      ],
      profiles: [
        {
          technicalProfileId: profile,
          profileName: "Ana Ruiz",
          profileEmail: "ana@example.com",
          profileRole: "DEVELOPER",
          subtotal: { amount, currency: "PEN" },
        },
      ],
    })
  )
  const client = new QueryClient()
  const observer = new QueryObserver(
    client,
    projectCostQueryOptions("project-1")
  )
  const unsubscribe = observer.subscribe(() => {})
  context.after(() => {
    unsubscribe()
    client.clear()
  })
  await observer.refetch()
  assert.equal(observer.getCurrentResult().data.totalCost, 450)
  hours = 10
  amount = 500
  await invalidateProjectCosts(client, "project-1")
  assert.equal(observer.getCurrentResult().data.totalCost, 500)
  rate = 60
  amount = 600
  await invalidateProjectCosts(client)
  assert.equal(observer.getCurrentResult().data.totalCost, 600)
  profile = "profile-2"
  await invalidateProjectCosts(client, "project-1")
  assert.equal(
    observer.getCurrentResult().data.profileBreakdown[0].profileId,
    "profile-2"
  )
})

test("project invalidation leaves unrelated cached costs fresh", async (context) => {
  const client = new QueryClient()
  context.after(() => client.clear())
  client.setQueryData(["project-costs", "project-1"], response)
  client.setQueryData(["project-costs", "project-2"], response)
  await invalidateProjectCosts(client, "project-1")
  assert.equal(
    client.getQueryState(["project-costs", "project-1"]).isInvalidated,
    true
  )
  assert.equal(
    client.getQueryState(["project-costs", "project-2"]).isInvalidated,
    false
  )
})

test("focus refreshes costs even within the stale time after an external save", async (context) => {
  let requests = 0
  mockFetch(context, async () => {
    requests++
    return Response.json(response)
  })
  const client = new QueryClient()
  client.mount()
  focusManager.setFocused(false)
  const observer = new QueryObserver(
    client,
    projectCostQueryOptions("project-1")
  )
  const unsubscribe = observer.subscribe(() => {})
  context.after(() => {
    unsubscribe()
    client.unmount()
    client.clear()
    focusManager.setFocused(undefined)
  })
  await observer.refetch()
  const initialRequests = requests
  focusManager.setFocused(true)
  await new Promise((resolve) => setTimeout(resolve, 0))
  assert.equal(requests, initialRequests + 1)
})

test("background refetch errors reach observers instead of a valid empty state", async (context) => {
  mockFetch(context, async () => Response.json(response))
  const client = new QueryClient()
  const observer = new QueryObserver(client, {
    ...projectCostQueryOptions("project-1"),
    retry: false,
  })
  const unsubscribe = observer.subscribe(() => {})
  context.after(() => {
    unsubscribe()
    client.clear()
  })
  await observer.refetch()
  globalThis.fetch = async () =>
    Response.json({ message: "Profile inactive" }, { status: 409 })
  await invalidateProjectCosts(client, "project-1")
  assert.equal(observer.getCurrentResult().isError, true)
  assert.equal(observer.getCurrentResult().error.status, 409)
})

test("summary renders the base cost and preserves an undefined project currency", () => {
  const html = renderToStaticMarkup(
    React.createElement(ProjectCostSummaryCard, {
      totalCost: 0,
      currency: null,
    })
  )
  assert.match(html, /Costo base total/)
  assert.match(html, /contingencias/)
  assert.match(html, /moneda definida/)
  assert.doesNotMatch(html, /S\//)
})

test("profile table and chart render backend subtotals and distribution", () => {
  const profileBreakdown =
    projectCostQueryOptions("project-1").select(response).profileBreakdown
  const html = renderToStaticMarkup(
    React.createElement(ProfileCostBreakdownTable, { profileBreakdown })
  )
  assert.match(html, /Ana Ruiz/)
  assert.doesNotMatch(html, /profile-1/)
  assert.match(html, /600\.00/)
  assert.match(html, /60\.00/)
  assert.match(html, /overflow-x-auto/)
  assert.equal((html.match(/scope="col"/g) ?? []).length, 4)
  const chart = renderToStaticMarkup(
    React.createElement(ProfileCostDistributionChart, {
      profileBreakdown,
      totalCost: 600,
    })
  )
  assert.match(chart, /100\s*%/)
  assert.match(chart, /width:100%/)
  assert.doesNotMatch(chart, /NaN|Infinity/)
  const empty = renderToStaticMarkup(
    React.createElement(ProfileCostDistributionChart, {
      profileBreakdown,
      totalCost: 0,
    })
  )
  assert.match(empty, /role="status"/)
  assert.doesNotMatch(empty, /NaN|Infinity/)
})

test("task table renders contributions while displaying the task total once", () => {
  const taskCosts =
    projectCostQueryOptions("project-1").select(response).taskCosts
  const html = renderToStaticMarkup(
    React.createElement(TaskCostsTable, { taskCosts })
  )
  assert.match(html, /CER por hora/)
  assert.match(html, /Costo por contribuci/)
  assert.match(html, /60\.00/)
  assert.equal((html.match(/600\.00/g) ?? []).length, 2)
})

test("costs view distinguishes loading, errors, empty projects and missing responses", () => {
  let state
  let refreshes = 0
  const refetch = () => {
    refreshes++
    return Promise.resolve()
  }
  const viewLoad = createSourceLoader({
    "../hooks/use-project-costs": { useProjectCosts: () => state },
  })
  const { CostsView } = viewLoad("src/features/costs/ui/costs-view.tsx")
  const render = (input) => {
    state = {
      isPending: false,
      isFetching: false,
      isError: false,
      refetch,
      ...input,
    }
    return renderToStaticMarkup(
      React.createElement(CostsView, { projectId: "project-1" })
    )
  }

  assert.match(render({ isPending: true }), /aria-label="Cargando costos"/)
  for (const status of [400, 401, 403, 404, 409, 500]) {
    const html = render({
      isError: true,
      error: new ApiError(status, "Test error"),
    })
    assert.match(html, /role="alert"/)
    assert.match(html, /Reintentar/)
    assert.doesNotMatch(html, /Aún no hay costos/)
  }
  assert.match(render({ data: null }), /no devolvió datos/)
  const empty = render({
    data: { totalCost: 0, currency: null, taskCosts: [], profileBreakdown: [] },
  })
  assert.match(empty, /Aún no hay costos calculados/)
  assert.doesNotMatch(empty, /S\//)
  const success = render({
    data: projectCostQueryOptions("project-1").select(response),
  })
  assert.match(success, /Costos por tarea/)
  assert.match(success, /Desglose por perfil/)
  assert.match(success, /Distribución/)
  assert.doesNotMatch(success, /Desglose por perfil técnico/)
  const view = CostsView({ projectId: "project-1" })
  view.props.children[0].props.children[1].props.onClick()
  assert.equal(refreshes, 1)
  const refreshing = render({
    data: projectCostQueryOptions("project-1").select(response),
    isFetching: true,
  })
  assert.match(refreshing, /Actualizando costos/)
  assert.match(refreshing, /disabled/)
})

test("existing hours and CER mutation callbacks invalidate costs after saving", async (context) => {
  const client = new QueryClient()
  context.after(() => client.clear())
  const hooksLoad = createSourceLoader({
    "@tanstack/react-query": {
      useQueryClient: () => client,
      useMutation: (options) => options,
    },
    "../services/task-hours-service": { taskHoursService: {} },
    "../services/profiles-service": { profilesService: {} },
  })
  const { useUpdateTaskHours } = hooksLoad(
    "src/features/estimates/hooks/use-task-hours.ts"
  )
  const { useUpdateProfile } = hooksLoad(
    "src/features/profiles/hooks/use-update-profile.ts"
  )
  const key = ["project-costs", "project-1"]
  client.setQueryData(key, response)
  await useUpdateTaskHours("project-1").onSuccess()
  assert.equal(client.getQueryState(key).isInvalidated, true)
  client.setQueryData(key, response)
  await useUpdateProfile().onSuccess()
  assert.equal(client.getQueryState(key).isInvalidated, true)
})

test("existing backlog callbacks invalidate costs after task assignment changes", async (context) => {
  const client = new QueryClient()
  context.after(() => client.clear())
  const hooksLoad = createSourceLoader({
    "@tanstack/react-query": {
      useQueryClient: () => client,
      useMutation: (options) => options,
      useQuery: () => ({ data: [] }),
    },
    "../services/stories-service": { storiesService: {} },
  })
  const { useStories } = hooksLoad("src/features/stories/hooks/use-stories.ts")
  const key = ["project-costs", "project-1"]
  client.setQueryData(key, response)
  await useStories("project-1").updateTask.onSettled()
  assert.equal(client.getQueryState(key).isInvalidated, true)
})
