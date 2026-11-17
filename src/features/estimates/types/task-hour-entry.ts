export type TaskHourEntry = {
  id: string
  projectId: string
  storyId: string
  storyCode: string
  storyTitle: string
  taskId: string
  taskTitle: string
  profileNames: string
  estimatedHours: number
  updatedAt: string
}

export type UpdateTaskHoursRequest = {
  estimatedHours: number
}
