import type { StoryPriority } from "@/enumeration/story-priority"
import type { StoryStatus } from "@/enumeration/story-status"

export type UserStoryResponse = {
  id: string
  projectId: string
  code: string
  title: string
  description: string
  acceptanceCriteria: string
  priority: StoryPriority
  status: StoryStatus
  storyPoints: number | null
  position: number
  createdAt: string
  updatedAt: string | null
}

export type UserStory = UserStoryResponse
