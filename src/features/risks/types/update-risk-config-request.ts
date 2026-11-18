import type { RiskLevel } from "@/enumeration"

export type UpdateRiskConfigRequest = {
  level: RiskLevel
  contingencyMargin: number
}

export type UpdateRiskConfigPayload = UpdateRiskConfigRequest & {
  projectId: string
}
