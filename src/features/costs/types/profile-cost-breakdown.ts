import type { CurrencyCode } from "@/enumeration/currency-code"

export type ProfileCostBreakdown = {
  profileId: string
  profileName: string
  profileRole: string
  profileEmail: string
  totalHours: number
  cer: number | null
  totalCost: number
  currency?: CurrencyCode | null
}
