import type { PaginatedResponse } from "@/types/api"
import type { ProjectResponse } from "./project-response"

export type ProjectSearchResponse = PaginatedResponse<
  ProjectResponse,
  "projectResponse"
>
