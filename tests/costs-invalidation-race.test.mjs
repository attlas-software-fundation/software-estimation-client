import assert from "node:assert/strict"
import test from "node:test"
import { QueryClient, QueryObserver } from "@tanstack/react-query"
import { createSourceLoader } from "./helpers/load-source.mjs"

const load = createSourceLoader()
const { projectCostQueryOptions } = load(
  "src/features/costs/hooks/project-cost-query-options.ts"
)
const { invalidateProjectCosts } = load(
  "src/features/costs/hooks/query-keys.ts"
)

const costResponse = (amount) => ({
  projectId: "project-1",
  total: { amount, currency: "PEN" },
  tasks: [],
  profiles: [],
})

test("a save during the first cost load replaces the earlier pending snapshot", async (context) => {
  const original = globalThis.fetch
  let finishFirstRequest
  let requests = 0
  globalThis.fetch = (url, options) => {
    requests++
    if (requests > 1) return Promise.resolve(Response.json(costResponse(600)))
    return new Promise((resolve, reject) => {
      finishFirstRequest = () => resolve(Response.json(costResponse(450)))
      options.signal.addEventListener(
        "abort",
        () => reject(new DOMException("Cancelled", "AbortError")),
        { once: true }
      )
    })
  }
  const client = new QueryClient()
  const observer = new QueryObserver(
    client,
    projectCostQueryOptions("project-1")
  )
  const unsubscribe = observer.subscribe(() => {})
  context.after(() => {
    globalThis.fetch = original
    unsubscribe()
    client.clear()
  })

  assert.equal(requests, 1)
  const refreshAfterSave = invalidateProjectCosts(client, "project-1")
  finishFirstRequest()
  await refreshAfterSave

  assert.equal(observer.getCurrentResult().data.totalCost, 600)
  assert.equal(requests, 2)
})
