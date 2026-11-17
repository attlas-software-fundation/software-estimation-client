import type { StoryPriority } from "@/enumeration/story-priority"

export type CreateUserStoryRequest = {
  code?: string
  title: string
  description: string
  acceptanceCriteria?: string
  priority?: StoryPriority
  storyPoints?: number | null
}

export type CreateUserStoryPayload = CreateUserStoryRequest & {
  projectId: string
}
