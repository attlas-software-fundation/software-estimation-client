import { z } from "zod"
import { RISK_LEVELS, type RiskLevel } from "@/enumeration"

export const riskConfigSchema = z.object({
  level: z.enum(RISK_LEVELS),
  contingencyMargin: z
    .number()
    .min(0, "El porcentaje no puede ser negativo")
    .max(100, "El porcentaje máximo es 100"),
})

export type RiskConfigSchema = {
  level: RiskLevel
  contingencyMargin: number
}
