import type { CurrencyCode } from "@/enumeration/currency-code"

export type CostAmountResponse = {
  amount: number
  currency: CurrencyCode | null
}

export type TaskProfileCostResponse = {
  technicalProfileId: string
  hours: number
  hourlyRate: number
  cost: CostAmountResponse
}

export type TaskCostResponse = {
  taskId: string
  total: CostAmountResponse
  contributions: TaskProfileCostResponse[]
}

export type ProfileCostResponse = {
  technicalProfileId: string
  subtotal: CostAmountResponse
}

export type ProjectCostResponse = {
  projectId: string
  total: CostAmountResponse
  tasks: TaskCostResponse[]
  profiles: ProfileCostResponse[]
}
