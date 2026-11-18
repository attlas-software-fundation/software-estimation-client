import type { StoryPriority } from "@/enumeration/story-priority"
import type { StoryStatus } from "@/enumeration/story-status"

export type BacklogFilters = {
  search?: string
  priority?: StoryPriority | ""
  status?: StoryStatus | ""
}
