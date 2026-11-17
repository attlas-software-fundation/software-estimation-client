import { z } from "zod"
import { SPRINT_UNITS } from "@/enumeration"

export const sprintConfigSchema = z.object({
  velocity: z.coerce.number().int().min(1),
  duration: z.coerce.number().int().min(1),
  unit: z.enum(SPRINT_UNITS),
})
