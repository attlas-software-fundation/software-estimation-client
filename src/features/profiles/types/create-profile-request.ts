import type {
  CurrencyCode,
  ExperienceLevelValue,
  TechnicalRoleValue,
} from "@/enumeration"

export type CreateTechnicalProfileRequest = {
  name: string
  email: string
  role: TechnicalRoleValue
  experienceLevel: ExperienceLevelValue
  hourlyRate: number
  currency: CurrencyCode
  isActive: boolean
}

export type CreateProfilePayload = CreateTechnicalProfileRequest
