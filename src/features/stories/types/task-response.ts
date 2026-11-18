import type { TaskStatus } from "@/enumeration/task-status"

export type TaskResponse = {
  id: string
  projectId: string
  userStoryId: string
  title: string
  description: string
  estimateHours: number
  status: TaskStatus
  position: number
  responsibleProfileIds: string[]
  createdAt: string
  updatedAt: string | null
}

export type BacklogTask = TaskResponse
