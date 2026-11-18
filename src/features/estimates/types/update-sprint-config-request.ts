import type { SprintUnit } from "@/enumeration"

export type UpdateSprintConfigRequest = {
  velocity: number
  duration: number
  unit: SprintUnit
}

export type UpdateSprintConfigPayload = UpdateSprintConfigRequest & {
  projectId: string
}
