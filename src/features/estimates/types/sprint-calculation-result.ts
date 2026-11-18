import type { SprintUnit } from "@/enumeration"

export type SprintCalculationResult = {
  totalStoryPoints: number
  storiesTotal: number
  storiesWithPoints: number
  velocity: number
  sprintDuration: number
  sprintUnit: SprintUnit
  totalSprints: number
  totalBaseTime: number
  totalEffortHours: number
  tasksTotal: number
  tasksWithHours: number
}
