import type { CurrencyCode } from "@/enumeration"

export type UpdateCerRequest = {
  hourlyRate: number
  currency?: CurrencyCode
}

export type UpdateCerPayload = UpdateCerRequest & {
  id: string
}
