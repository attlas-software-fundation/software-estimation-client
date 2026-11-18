import type { CreateTaskRequest } from "./create-task-request"

export type UpdateTaskRequest = CreateTaskRequest

export type UpdateTaskPayload = UpdateTaskRequest & {
  id: string
}
