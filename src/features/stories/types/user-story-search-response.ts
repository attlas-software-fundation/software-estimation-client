import type { PaginatedResponse } from "@/types/api"
import type { UserStoryResponse } from "./user-story-response"

export type UserStorySearchResponse = PaginatedResponse<
  UserStoryResponse,
  "userStoryResponse"
>
