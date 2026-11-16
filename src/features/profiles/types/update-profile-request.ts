import type { CurrencyCode } from "@/lib/format"
import type {
  TechnicalProfileApiExperienceLevel,
  TechnicalProfileApiRole,
} from "./technical-profile-response"

export interface UpdateTechnicalProfileRequest {
  name?: string
  email?: string
  role?: TechnicalProfileApiRole
  experienceLevel?: TechnicalProfileApiExperienceLevel
  hourlyRate?: number
  currency?: CurrencyCode | string
  isActive?: boolean
}
