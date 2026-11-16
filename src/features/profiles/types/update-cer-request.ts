import type { CurrencyCode } from "@/lib/format"

export interface UpdateCerRequest {
  hourlyRate: number
  currency?: CurrencyCode | string
}
