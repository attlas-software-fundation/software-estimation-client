import type { SprintUnit } from "@/enumeration/sprint-unit"

export type ProjectEstimationResponse = {
  id: string
  baseEffortPoints: number
  totalEffortHours: number
  totalTime: number
  timeUnit: SprintUnit
  totalCost: number
  createdAt: string
}
