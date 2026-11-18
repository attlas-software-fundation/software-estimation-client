import type { CurrencyCode } from "@/enumeration/currency-code"
import type { TaskProfileCostResponse } from "./project-cost-response"

export type TaskCostProfile = {
  profileId: string
  profileName: string
  profileRole: string
  profileEmail: string
}

export type TaskCost = {
  taskId: string
  taskName: string
  totalHours: number
  profiles: TaskCostProfile[]
  totalCost: number
  currency?: CurrencyCode | null
  contributions?: readonly TaskProfileCostResponse[]
}
