import assert from "node:assert/strict"
import { readFileSync, writeFileSync } from "node:fs"
import { createRequire } from "node:module"
import { randomUUID } from "node:crypto"
import { parseArgs } from "node:util"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { createSourceLoader } from "../tests/helpers/load-source.mjs"

const require = createRequire(import.meta.url)
const {
  QueryClient,
  QueryClientProvider,
  QueryObserver,
  focusManager,
} = require("@tanstack/react-query")
const { values } = parseArgs({
  options: {
    "seed-account": { type: "boolean", default: false },
    "create-fixture": { type: "boolean", default: false },
    project: { type: "string" },
    report: { type: "string" },
  },
})
const load = createSourceLoader()
const { apiClient } = load("src/lib/api/api-client.ts")
const { API_BASE_URL } = load("src/lib/api/config.ts")
const { ApiError } = load("src/lib/api/api-error.ts")
const { authService } = load("src/features/auth/services/auth-service.ts")
const { getProjectCosts } = load("src/features/costs/services/costs-service.ts")
const { projectCostQueryOptions } = load(
  "src/features/costs/hooks/project-cost-query-options.ts"
)
const { invalidateProjectCosts } = load(
  "src/features/costs/hooks/query-keys.ts"
)
const { CostsView } = load("src/features/costs/ui/costs-view.tsx")
const { CostsErrorState } = load("src/features/costs/ui/costs-error-state.tsx")
const evidence = { api: new URL(API_BASE_URL).origin, fixture: {}, checks: [] }

const report = () => {
  if (values.report)
    writeFileSync(
      values.report,
      `${JSON.stringify(evidence, null, 2)}\n`,
      "utf8"
    )
}
const passed = (name, details = {}) => {
  evidence.checks.push({ name, status: "passed", ...details })
  report()
  console.log(JSON.stringify(evidence.checks.at(-1)))
}
const request = (path, method, body) =>
  apiClient.request(path, {
    method,
    body,
    signal: AbortSignal.timeout(15_000),
  })
const credentials = () => {
  if (process.env.COSTS_TEST_EMAIL && process.env.COSTS_TEST_PASSWORD) {
    return {
      email: process.env.COSTS_TEST_EMAIL,
      password: process.env.COSTS_TEST_PASSWORD,
    }
  }
  if (!values["seed-account"])
    throw new Error(
      "Define COSTS_TEST_EMAIL y COSTS_TEST_PASSWORD, o utiliza --seed-account."
    )
  const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8")
  const email = readme.match(/\|\s*Correo\s*\|\s*`([^`]+)`/)?.[1]
  const password = readme.match(/\|\s*Contraseña\s*\|\s*`([^`]+)`/)?.[1]
  if (!email || !password)
    throw new Error("El README no contiene la cuenta inicial esperada.")
  return { email, password }
}

const run = async () => {
  if (!values.project && !values["create-fixture"])
    throw new Error("Indica --project o --create-fixture.")
  const storage = new Map()
  const originalWindow = globalThis.window
  globalThis.window = {
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: (key) => storage.delete(key),
    },
  }
  const client = new QueryClient()
  client.mount()
  let unsubscribe
  try {
    const specificationResponse = await fetch(`${API_BASE_URL}/v3/api-docs`, {
      signal: AbortSignal.timeout(10_000),
    })
    assert.equal(
      specificationResponse.status,
      200,
      "La API debe exponer su contrato OpenAPI."
    )
    const specification = await specificationResponse.json()
    assert.ok(specification.paths["/api/v1/project-costs/{projectId}"]?.get)
    passed("Contrato OpenAPI real disponible")

    const preflight = await fetch(
      `${API_BASE_URL}/api/v1/project-costs/${randomUUID()}`,
      {
        method: "OPTIONS",
        headers: {
          Origin: "http://localhost:3000",
          "Access-Control-Request-Method": "GET",
          "Access-Control-Request-Headers": "authorization",
        },
        signal: AbortSignal.timeout(10_000),
      }
    )
    assert.ok(preflight.ok, "El preflight CORS debe aceptar el frontend local.")
    assert.equal(
      preflight.headers.get("access-control-allow-origin"),
      "http://localhost:3000"
    )
    passed("CORS real para localhost:3000 y Authorization")

    const auth = await authService.login(credentials())
    assert.ok(auth.permissions.includes("cost:read"))
    apiClient.storeAuthTokens(auth)
    passed("Autenticación real y permiso cost:read")
    const renewed = await authService.refreshToken({
      refreshToken: auth.refreshToken,
    })
    assert.ok(renewed.token)
    apiClient.storeAuthTokens(renewed)
    passed("Renovación real del JWT")

    let projectId = values.project
    if (values["create-fixture"]) {
      const tag = `COSTS-${Date.now()}`
      const today = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Lima",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date())
      const project = await request("/api/v1/projects", "POST", {
        name: `PRUEBA ${tag}`,
        description: "Datos nuevos para verificar PMGT-143 a PMGT-147",
        type: "INTEGRATION",
        startDate: today,
        plannedDate: today,
        responsibleId: auth.user.id,
      })
      projectId = project.id
      evidence.fixture = { tag, projectId, profileIds: [] }
      report()
    }
    evidence.fixture.projectId = projectId

    const observer = new QueryObserver(
      client,
      projectCostQueryOptions(projectId)
    )
    unsubscribe = observer.subscribe(() => {})
    assert.equal(observer.getCurrentResult().isPending, true)
    passed("Estado de carga durante la consulta HTTP real")
    await observer.refetch()
    const currentSummary = () => {
      const result = observer.getCurrentResult()
      if (result.isError) throw result.error
      assert.ok(result.data, "La API debe devolver un resumen de costos.")
      return result.data
    }
    const refresh = async (expected) => {
      await invalidateProjectCosts(client, projectId)
      const summary = currentSummary()
      assert.equal(summary.totalCost, expected)
      return summary
    }

    if (values["create-fixture"]) {
      const empty = currentSummary()
      assert.equal(empty.totalCost, 0)
      assert.equal(empty.currency, null)
      assert.equal(empty.taskCosts.length, 0)
      passed("Proyecto vacío real", { total: 0, currency: null })

      const createProfile = (suffix, hourlyRate, role) =>
        request("/api/v1/profiles", "POST", {
          name: `${evidence.fixture.tag} ${suffix}`,
          email: `${evidence.fixture.tag.toLowerCase()}.${suffix}@example.com`,
          role,
          experienceLevel: "MID",
          hourlyRate,
          currency: "PEN",
          isActive: true,
        })
      const profile = await createProfile("principal", 50, "BACKEND")
      evidence.fixture.profileIds.push(profile.id)
      report()
      const story = await request(
        `/api/v1/projects/${projectId}/user-stories`,
        "POST",
        {
          code: "COST-001",
          title: evidence.fixture.tag,
          description: "Historia exclusiva de prueba de costos",
          acceptanceCriteria: "Validar montos reales",
          priority: "MEDIUM",
          storyPoints: 1,
        }
      )
      evidence.fixture.storyId = story.id
      report()
      const taskBody = {
        title: evidence.fixture.tag,
        description: "Tarea exclusiva de prueba de costos",
        estimateHours: 9,
        status: "TODO",
        responsibleProfileIds: [],
      }
      const taskPath = `/api/v1/user-stories/${story.id}/tasks`
      assert.ok(
        specification.paths["/api/v1/user-stories/{storyId}/tasks"]?.post,
        "El contrato debe incluir creación de tareas por historia."
      )
      const task = await request(taskPath, "POST", taskBody)
      evidence.fixture.taskId = task.id
      report()

      await assert.rejects(getProjectCosts(projectId), (error) => {
        assert.ok(error instanceof ApiError)
        assert.equal(error.status, 400)
        const html = renderToStaticMarkup(
          React.createElement(CostsErrorState, {
            error,
            isFetching: false,
            onRetry: () => {},
          })
        )
        assert.ok(html.includes(error.message))
        assert.doesNotMatch(html, /Comprueba el identificador/)
        passed("Validación real de tarea sin perfiles", {
          http: 400,
          message: error.message,
        })
        return true
      })

      const assign = (ids) =>
        request(`/api/v1/tasks/${task.id}/responsibles`, "PUT", {
          responsibleProfileIds: ids,
        })
      await assign([profile.id])
      let summary = await refresh(450)
      assert.equal(summary.taskCosts[0].contributions[0].hours, 9)
      assert.equal(summary.taskCosts[0].contributions[0].cost.amount, 450)
      passed("Costo real de 9 horas y CER 50", {
        total: 450,
        currency: summary.currency,
      })

      taskBody.estimateHours = 10
      taskBody.responsibleProfileIds = [profile.id]
      await request(`/api/v1/tasks/${task.id}`, "PUT", taskBody)
      await refresh(500)
      passed("Recálculo real al guardar 10 horas", { total: 500 })

      await request(`/api/v1/profiles/${profile.id}/cer`, "PATCH", {
        hourlyRate: 60,
        currency: "PEN",
      })
      summary = await refresh(600)
      assert.equal(summary.profileBreakdown[0].cer, 60)
      passed("Recálculo real al guardar CER 60", { total: 600 })

      focusManager.setFocused(false)
      await request(`/api/v1/profiles/${profile.id}/cer`, "PATCH", {
        hourlyRate: 65,
        currency: "PEN",
      })
      const focusRefresh = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          stop()
          reject(
            new Error("Los costos no se actualizaron al recuperar el foco.")
          )
        }, 15_000)
        const stop = observer.subscribe((result) => {
          if (result.data?.totalCost === 650) {
            clearTimeout(timeout)
            stop()
            resolve()
          }
        })
      })
      focusManager.setFocused(true)
      await focusRefresh
      passed("Recarga de la API real al recuperar el foco", { total: 650 })
      await request(`/api/v1/profiles/${profile.id}/cer`, "PATCH", {
        hourlyRate: 60,
        currency: "PEN",
      })
      await refresh(600)

      const second = await createProfile("secundario", 40, "QA")
      evidence.fixture.profileIds.push(second.id)
      report()
      await assign([profile.id, second.id])
      summary = await refresh(500)
      assert.equal(summary.taskCosts[0].contributions.length, 2)
      assert.deepEqual(
        summary.profileBreakdown
          .map((item) => item.totalCost)
          .sort((a, b) => a - b),
        [200, 300]
      )
      passed("Desglose real de dos perfiles", {
        total: 500,
        subtotals: [200, 300],
      })

      await assign([second.id])
      summary = await refresh(400)
      assert.equal(summary.profileBreakdown[0].profileId, second.id)
      passed("Recálculo real al cambiar responsables", { total: 400 })
      await assign([profile.id])
      await refresh(600)

      await assert.rejects(
        request(`/api/v1/profiles/${profile.id}/cer`, "PATCH", {
          hourlyRate: -1,
          currency: "PEN",
        }),
        (error) => error instanceof ApiError && error.status === 400
      )
      await assert.rejects(
        request(`/api/v1/tasks/${task.id}`, "PUT", {
          ...taskBody,
          estimateHours: -1,
        }),
        (error) => error instanceof ApiError && error.status === 400
      )
      await refresh(600)
      passed("Horas y CER negativos rechazados por la API", {
        http: 400,
        preservedTotal: 600,
      })
    }

    const unknownId = randomUUID()
    await assert.rejects(
      getProjectCosts(unknownId),
      (error) => error instanceof ApiError && error.status === 404
    )
    passed("Proyecto inexistente real", { http: 404 })
    await assert.rejects(
      apiClient.get(`/api/v1/project-costs/${projectId}`, { auth: false }),
      (error) => {
        assert.ok(
          error instanceof ApiError && [401, 403].includes(error.status)
        )
        passed("Consulta sin autenticación rechazada", { http: error.status })
        return true
      }
    )

    const summary = currentSummary()
    const html = renderToStaticMarkup(
      React.createElement(
        QueryClientProvider,
        { client },
        React.createElement(CostsView, { projectId })
      )
    )
    assert.match(html, /Costo base total del proyecto/)
    if (summary.profileBreakdown.length)
      assert.match(html, /Distribución de costos por perfil/)
    passed("Vista de costos renderizada con datos de la API real", {
      total: summary.totalCost,
      tasks: summary.taskCosts.length,
      profiles: summary.profileBreakdown.length,
    })
    evidence.result = "passed"
    report()
  } finally {
    unsubscribe?.()
    client.unmount()
    client.clear()
    focusManager.setFocused(undefined)
    globalThis.window = originalWindow
  }
}

run().catch((error) => {
  evidence.result = "failed"
  evidence.error = {
    name: error.name,
    status: error.status,
    message: error.message,
  }
  report()
  console.error(
    JSON.stringify({
      result: evidence.result,
      error: evidence.error,
      fixture: evidence.fixture,
    })
  )
  process.exitCode = 1
})
