import { z } from "zod"
import {
  EXPERIENCE_LEVELS,
  TECHNICAL_ROLES,
  experienceLevelToApi,
  technicalRoleToApi,
  type CreateTechnicalProfileRequest,
  type UpdateTechnicalProfileRequest,
} from "../types"

export const technicalRoles = TECHNICAL_ROLES
export const experienceLevels = EXPERIENCE_LEVELS

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
  currency: z.literal("PEN"),
  experienceLevel: z.enum(EXPERIENCE_LEVELS, {
    message: "Por favor selecciona un nivel de experiencia válido.",
  }),
  email: z
    .string()
    .trim()
    .email({ message: "Por favor ingresa un correo electrónico válido." }),
  isActive: z.boolean(),
})

export type ProfileFormValues = z.infer<typeof profileSchema>

export const createProfileRequestSchema = profileSchema.transform(
  (data): CreateTechnicalProfileRequest => ({
    name: data.name,
    email: data.email,
    role: technicalRoleToApi[data.role] ?? "OTHER",
    experienceLevel: experienceLevelToApi[data.experienceLevel] ?? "MID",
    hourlyRate: data.hourlyRate,
    currency: "PEN",
    isActive: data.isActive,
  })
)

export const updateProfileRequestSchema = profileSchema
  .partial()
  .transform((data): UpdateTechnicalProfileRequest => ({
    name: data.name,
    email: data.email,
    role: data.role ? technicalRoleToApi[data.role] : undefined,
    experienceLevel: data.experienceLevel
      ? experienceLevelToApi[data.experienceLevel]
      : undefined,
    hourlyRate: data.hourlyRate,
    currency: data.currency ?? "PEN",
    isActive: data.isActive,
  }))
