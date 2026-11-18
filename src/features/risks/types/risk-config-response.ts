import type { RiskLevel } from "@/enumeration"

export type RiskConfigResponse = {
  level: RiskLevel
  contingencyMargin: number
  saved: boolean
}

export type RiskConfig = RiskConfigResponse
