import assert from "node:assert/strict"
import test from "node:test"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { createSourceLoader } from "./helpers/load-source.mjs"

const load = createSourceLoader()
const { CostsErrorState } = load("src/features/costs/ui/costs-error-state.tsx")
const { ApiError } = load("src/lib/api/api-error.ts")

test("shows the backend validation message for invalid task hours", () => {
  const message = "Las horas ajustadas no pueden ser negativas"
  const html = renderToStaticMarkup(
    React.createElement(CostsErrorState, {
      error: new ApiError(400, message),
      isFetching: false,
      onRetry: () => {},
    })
  )

  assert.ok(html.includes(message))
  assert.doesNotMatch(html, /Comprueba el identificador/)
})

test("preserves the backend explanation for unassigned profiles", () => {
  const message = "La tarea debe tener perfiles asignados"
  const html = renderToStaticMarkup(
    React.createElement(CostsErrorState, {
      error: new ApiError(400, message),
      isFetching: false,
      onRetry: () => {},
    })
  )

  assert.ok(html.includes(message))
})

test("keeps server internals out of the displayed 500 error", () => {
  const html = renderToStaticMarkup(
    React.createElement(CostsErrorState, {
      error: new ApiError(500, "Private database failure"),
      isFetching: false,
      onRetry: () => {},
    })
  )

  assert.doesNotMatch(html, /Private database failure/)
})
