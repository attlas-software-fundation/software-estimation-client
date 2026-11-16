import type { CurrencyCode } from "@/lib/format"
import {
  ExperienceLevel,
  TechnicalRole,
  type ExperienceLevelValue,
  type TechnicalRoleValue,
} from "@/enumeration"
import type { Profile } from "./profile"

export type TechnicalProfileApiRole =
  | "FRONTEND"
  | "BACKEND"
  | "FULLSTACK"
  | "QA"
  | "DEVOPS"
  | "UI_UX_DESIGNER"
  | "PRODUCT_MANAGER"
  | "TECH_LEAD"
  | "FUNCTIONAL_ANALYST"
  | "OTHER"

export type TechnicalProfileApiExperienceLevel =
  "JUNIOR" | "MID" | "SENIOR" | "LEAD"

export interface TechnicalProfileResponse {
  id: string
  name: string
  email: string
  role: TechnicalProfileApiRole | string
  experienceLevel: TechnicalProfileApiExperienceLevel | string
  hourlyRate: number
  currency: CurrencyCode | string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export const technicalRoleToApi: Record<string, TechnicalProfileApiRole> = {
  Frontend: "FRONTEND",
  Backend: "BACKEND",
  Fullstack: "FULLSTACK",
  QA: "QA",
  DevOps: "DEVOPS",
  "UI/UX Designer": "UI_UX_DESIGNER",
  "Product Manager": "PRODUCT_MANAGER",
  "Tech Lead": "TECH_LEAD",
  "Functional Analyst": "FUNCTIONAL_ANALYST",
  Other: "OTHER",
  FRONTEND: "FRONTEND",
  BACKEND: "BACKEND",
  FULLSTACK: "FULLSTACK",
  DEVOPS: "DEVOPS",
  UI_UX_DESIGNER: "UI_UX_DESIGNER",
  PRODUCT_MANAGER: "PRODUCT_MANAGER",
  TECH_LEAD: "TECH_LEAD",
  FUNCTIONAL_ANALYST: "FUNCTIONAL_ANALYST",
  OTHER: "OTHER",
}

export const technicalRoleFromApi: Record<string, TechnicalRoleValue> = {
  FRONTEND: TechnicalRole.FRONTEND.value,
  BACKEND: TechnicalRole.BACKEND.value,
  FULLSTACK: TechnicalRole.FULLSTACK.value,
  QA: TechnicalRole.QA.value,
  DEVOPS: TechnicalRole.DEVOPS.value,
  UI_UX_DESIGNER: TechnicalRole.UI_UX_DESIGNER.value,
  PRODUCT_MANAGER: TechnicalRole.PRODUCT_MANAGER.value,
  TECH_LEAD: TechnicalRole.TECH_LEAD.value,
  FUNCTIONAL_ANALYST: TechnicalRole.FUNCTIONAL_ANALYST.value,
  OTHER: TechnicalRole.OTHER.value,
  Frontend: TechnicalRole.FRONTEND.value,
  Backend: TechnicalRole.BACKEND.value,
  Fullstack: TechnicalRole.FULLSTACK.value,
  DevOps: TechnicalRole.DEVOPS.value,
  "UI/UX Designer": TechnicalRole.UI_UX_DESIGNER.value,
  "Product Manager": TechnicalRole.PRODUCT_MANAGER.value,
  "Tech Lead": TechnicalRole.TECH_LEAD.value,
  "Functional Analyst": TechnicalRole.FUNCTIONAL_ANALYST.value,
  Other: TechnicalRole.OTHER.value,
}

export const experienceLevelToApi: Record<
  string,
  TechnicalProfileApiExperienceLevel
> = {
  Junior: "JUNIOR",
  Mid: "MID",
  Senior: "SENIOR",
  Lead: "LEAD",
  JUNIOR: "JUNIOR",
  MID: "MID",
  SENIOR: "SENIOR",
  LEAD: "LEAD",
}

export const experienceLevelFromApi: Record<string, ExperienceLevelValue> = {
  JUNIOR: ExperienceLevel.JUNIOR.value,
  MID: ExperienceLevel.MID.value,
  SENIOR: ExperienceLevel.SENIOR.value,
  LEAD: ExperienceLevel.LEAD.value,
  Junior: ExperienceLevel.JUNIOR.value,
  Mid: ExperienceLevel.MID.value,
  Senior: ExperienceLevel.SENIOR.value,
  Lead: ExperienceLevel.LEAD.value,
}

export const toProfile = (response: TechnicalProfileResponse): Profile => ({
  id: response.id,
  name: response.name,
  role: technicalRoleFromApi[response.role] ?? TechnicalRole.OTHER.value,
  experienceLevel:
    experienceLevelFromApi[response.experienceLevel] ??
    ExperienceLevel.MID.value,
  hourlyRate: typeof response.hourlyRate === "number" ? response.hourlyRate : 0,
  currency: (response.currency as CurrencyCode) || "PEN",
  email: response.email ?? "",
  isActive: response.isActive !== false,
  createdAt: response.createdAt ?? "",
  updatedAt: response.updatedAt ?? "",
})
