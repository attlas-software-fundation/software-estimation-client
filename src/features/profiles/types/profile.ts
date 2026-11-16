import type { CurrencyCode } from "@/lib/format"
import type { ExperienceLevelValue, TechnicalRoleValue } from "@/enumeration"
import type { UpdateTechnicalProfileRequest } from "./update-profile-request"

export type Profile = {
  id: string
  name: string
  role: TechnicalRoleValue
  hourlyRate: number
  currency: CurrencyCode
  experienceLevel: ExperienceLevelValue
  email: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type CreateProfilePayload = {
  name: string
  role: TechnicalRoleValue
  hourlyRate: number
  currency: CurrencyCode
  experienceLevel: ExperienceLevelValue
  email: string
  isActive: boolean
}

export interface UpdateProfilePayload extends UpdateTechnicalProfileRequest {
  id: string
}
