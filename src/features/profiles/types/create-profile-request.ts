import type {
  TechnicalProfileApiExperienceLevel,
  TechnicalProfileApiRole,
} from "./technical-profile-response"

export interface CreateTechnicalProfileRequest {
  name: string
  email: string
  role: TechnicalProfileApiRole
  experienceLevel: TechnicalProfileApiExperienceLevel
  hourlyRate: number
  currency: "PEN"
  isActive: boolean
}
