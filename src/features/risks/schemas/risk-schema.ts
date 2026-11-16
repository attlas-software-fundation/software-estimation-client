import { z } from "zod"
import { RISK_LEVELS } from "@/enumeration/risk-level"

const ALL_RISK_LEVELS = [...RISK_LEVELS, "BAJO", "MEDIO", "ALTO"] as const

export const riskConfigSchema = z
  .object({
    level: z.enum(ALL_RISK_LEVELS),
    percentage: z
      .number()
      .min(0, "El porcentaje no puede ser negativo")
      .max(100, "El porcentaje máximo es 100")
      .optional(),
    contingencyMargin: z
      .number()
      .min(0, "El porcentaje no puede ser negativo")
      .max(100, "El porcentaje máximo es 100")
      .optional(),
  })
  .refine(
    (data) =>
      data.percentage !== undefined || data.contingencyMargin !== undefined,
    {
      message: "Debe ingresar el porcentaje o margen de contingencia",
      path: ["percentage"],
    }
  )
  .refine(
    (data) => {
      const margin = data.percentage ?? data.contingencyMargin ?? 0
      const isLow = data.level === "BAJO" || data.level === "low"
      const isMedium = data.level === "MEDIO" || data.level === "medium"
      const isHigh = data.level === "ALTO" || data.level === "high"

      if (isLow && margin > 10) return false
      if (isMedium && (margin < 10 || margin > 25)) return false
      if (isHigh && margin < 25) return false
      return true
    },
    {
      message: "El porcentaje no corresponde al nivel de riesgo seleccionado",
      path: ["percentage"],
    }
  )

export type RiskConfigSchema = z.infer<typeof riskConfigSchema>
