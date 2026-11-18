import type { TaskStatus } from "@/enumeration/task-status"

export type CreateTaskRequest = {
  title: string
  description: string
  estimateHours: number
  status?: TaskStatus
  responsibleProfileIds?: string[]
}

export type CreateTaskPayload = CreateTaskRequest & {
  storyId: string
}
