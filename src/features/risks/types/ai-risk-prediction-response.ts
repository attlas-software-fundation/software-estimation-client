import type { RiskLevel } from "@/enumeration"

export type AiRiskPredictionResponse = {
  recommended_contingency_margin: number
  predicted_risk_level: RiskLevel
  risk_probabilities: Record<string, number>
  regression_model_used: string
  classification_model_used: string
}
