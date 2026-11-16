import { z } from "zod"
import { RISK_LEVELS } from "@/enumeration/risk-level"

export const riskConfigSchema = z.object({
  level: z.enum(RISK_LEVELS),
  percentage: z.number().min(0, 'El porcentaje no puede ser negativo').max(100, 'El porcentaje máximo es 100'),
}).refine((data) => {
  if (data.level === 'BAJO' && data.percentage > 10) return false;
  if (data.level === 'MEDIO' && (data.percentage < 10 || data.percentage > 25)) return false;
  if (data.level === 'ALTO' && data.percentage < 25) return false;
  return true;
}, {
  message: 'El porcentaje no corresponde al nivel de riesgo seleccionado',
  path: ['percentage'],
})

export type RiskConfigSchema = z.infer<typeof riskConfigSchema>
