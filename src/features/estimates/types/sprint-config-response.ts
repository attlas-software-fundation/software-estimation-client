import type { SprintUnit } from "@/enumeration"

export type SprintConfigResponse = {
  velocity: number
  duration: number
  unit: SprintUnit
}

export type SprintConfig = SprintConfigResponse
