import { z } from "zod"
import {
  CurrencyCode,
  EXPERIENCE_LEVELS,
  TECHNICAL_ROLES,
  type CreateTechnicalProfileRequest,
} from "../types"

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
    .max(100, { message: "El nombre no debe exceder los 100 caracteres." }),
  role: z.enum(TECHNICAL_ROLES, {
    message: "Por favor selecciona un rol técnico válido.",
  }),
  hourlyRate: z
    .number({ message: "El costo horario (CER) debe ser un número válido." })
    .positive({ message: "El costo horario (CER) debe ser mayor a 0." }),
  currency: z.nativeEnum(CurrencyCode),
  experienceLevel: z.enum(EXPERIENCE_LEVELS, {
    message: "Por favor selecciona un nivel de experiencia válido.",
  }),
  email: z
    .string()
    .trim()
    .email({ message: "Por favor ingresa un correo electrónico válido." }),
  isActive: z.boolean(),
})

export type ProfileFormValues = CreateTechnicalProfileRequest
