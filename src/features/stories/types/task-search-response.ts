import type { PaginatedResponse } from "@/types/api"
import type { TaskResponse } from "./task-response"

export type TaskSearchResponse = PaginatedResponse<TaskResponse, "taskResponse">
