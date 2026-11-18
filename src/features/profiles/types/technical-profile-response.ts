import type {
  CurrencyCode,
  ExperienceLevelValue,
  TechnicalRoleValue,
} from "@/enumeration"

export type TechnicalProfileResponse = {
  id: string
  name: string
  email: string
  role: TechnicalRoleValue
  experienceLevel: ExperienceLevelValue
  hourlyRate: number
  currency: CurrencyCode
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export type Profile = TechnicalProfileResponse
