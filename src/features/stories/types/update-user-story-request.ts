import type { StoryStatus } from "@/enumeration/story-status"
import type { CreateUserStoryRequest } from "./create-user-story-request"

export type UpdateUserStoryRequest = CreateUserStoryRequest & {
  status?: StoryStatus
}

export type UpdateUserStoryPayload = UpdateUserStoryRequest & {
  id: string
}
