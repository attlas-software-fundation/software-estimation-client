import type { RiskLevel } from "@/enumeration"

export type ProjectContingencyResponse = {
  riskLevel: RiskLevel
  contingencyMarginPercentage: number
  baseTime: number
  contingencyTime: number
  totalTime: number
  baseCost: number
  contingencyCost: number
  totalCost: number
}
