import assert from "node:assert/strict"
import test from "node:test"
import { createSourceLoader } from "./helpers/load-source.mjs"

const { adaptProjectCostResponse } = createSourceLoader()(
  "src/features/costs/adapters/adapt-project-cost-response.ts"
)

const createResponse = () => ({
  projectId: "project-1",
  total: { amount: 700, currency: "PEN" },
  tasks: [
    {
      taskId: "task-1",
      total: { amount: 700, currency: "PEN" },
      contributions: [
        {
          technicalProfileId: "profile-1",
          hours: 9,
          hourlyRate: 50,
          cost: { amount: 450, currency: "PEN" },
        },
        {
          technicalProfileId: "profile-2",
          hours: 5,
          hourlyRate: 50,
          cost: { amount: 250, currency: "PEN" },
        },
      ],
    },
  ],
  profiles: [
    {
      technicalProfileId: "profile-1",
      subtotal: { amount: 450, currency: "PEN" },
    },
    {
      technicalProfileId: "profile-2",
      subtotal: { amount: 250, currency: "PEN" },
    },
  ],
})

test("preserves every task contribution and its currency from the API", () => {
  const response = createResponse()
  const summary = adaptProjectCostResponse(response)

  assert.deepEqual(
    summary.taskCosts[0].contributions,
    response.tasks[0].contributions
  )
  assert.equal(summary.taskCosts[0].currency, "PEN")
  assert.equal(summary.taskCosts[0].totalHours, 14)
  assert.equal(summary.taskCosts[0].taskName, "task-1")
})

test("uses supplied costs even when they differ from hours multiplied by CER", () => {
  const response = createResponse()
  response.total.amount = 999
  response.tasks[0].total.amount = 888
  response.tasks[0].contributions[0].cost.amount = 777
  response.profiles[0].subtotal.amount = 666

  const summary = adaptProjectCostResponse(response)

  assert.equal(summary.totalCost, 999)
  assert.equal(summary.taskCosts[0].totalCost, 888)
  assert.equal(summary.taskCosts[0].contributions[0].cost.amount, 777)
  assert.equal(summary.profileBreakdown[0].totalCost, 666)
})

test("keeps zero-hour and zero-cost contributions", () => {
  const response = createResponse()
  response.tasks[0].contributions[0].hours = 0
  response.tasks[0].contributions[0].hourlyRate = 0
  response.tasks[0].contributions[0].cost.amount = 0

  const task = adaptProjectCostResponse(response).taskCosts[0]

  assert.equal(task.contributions.length, 2)
  assert.equal(task.contributions[0].hours, 0)
  assert.equal(task.contributions[0].hourlyRate, 0)
  assert.equal(task.contributions[0].cost.amount, 0)
})

test("accepts a project without tasks or a defined currency", () => {
  const summary = adaptProjectCostResponse({
    projectId: "empty-project",
    total: { amount: 0, currency: null },
    tasks: [],
    profiles: [],
  })

  assert.equal(summary.totalCost, 0)
  assert.equal(summary.currency, null)
  assert.deepEqual(summary.taskCosts, [])
  assert.deepEqual(summary.profileBreakdown, [])
})

test("preserves project and profile currencies", () => {
  const response = createResponse()
  const summary = adaptProjectCostResponse(response)

  assert.equal(summary.currency, response.total.currency)
  assert.equal(
    summary.profileBreakdown[0].currency,
    response.profiles[0].subtotal.currency
  )
})

test("does not present a single CER when profile contributions have different rates", () => {
  const response = createResponse()
  response.tasks.push({
    taskId: "task-2",
    total: { amount: 60, currency: "PEN" },
    contributions: [
      {
        technicalProfileId: "profile-1",
        hours: 1,
        hourlyRate: 60,
        cost: { amount: 60, currency: "PEN" },
      },
    ],
  })

  const profile = adaptProjectCostResponse(response).profileBreakdown[0]

  assert.equal(profile.totalHours, 10)
  assert.equal(profile.cer, null)
  assert.equal(profile.totalCost, response.profiles[0].subtotal.amount)
})
