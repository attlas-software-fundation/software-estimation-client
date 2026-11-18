import type { CurrencyCode } from "@/enumeration/currency-code"

export type CostAmountResponse = {
  amount: number
  currency: CurrencyCode | null
}

export type TaskProfileCostResponse = {
  technicalProfileId: string
  profileName: string
  profileEmail: string
  profileRole: string
  hours: number
  hourlyRate: number
  cost: CostAmountResponse
}

export type TaskCostResponse = {
  taskId: string
  taskTitle: string
  total: CostAmountResponse
  contributions: TaskProfileCostResponse[]
}

export type ProfileCostResponse = {
  technicalProfileId: string
  profileName: string
  profileEmail: string
  profileRole: string
  subtotal: CostAmountResponse
}

export type ProjectCostResponse = {
  projectId: string
  total: CostAmountResponse
  tasks: TaskCostResponse[]
  profiles: ProfileCostResponse[]
}
