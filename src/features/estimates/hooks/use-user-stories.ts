"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { invalidateReportQueries } from "@/features/reports/hooks/query-keys"
import { invalidateProjectCosts } from "@/features/costs/hooks/query-keys"
import { storiesService } from "@/features/stories/services/stories-service"
import type { UserStory } from "@/features/stories/types"
import { isStoryPoints, type StoryPoints } from "../types"

export const useUserStories = (projectId: string) => {
  return useQuery<UserStory[]>({
    queryKey: ["user-stories", projectId],
    queryFn: () => storiesService.getStories(projectId),
    enabled: Boolean(projectId),
  })
}

export const useStoryPointsAssignments = (projectId: string) => {
  const { data: stories = [] } = useUserStories(projectId)
  const assignments: Record<string, StoryPoints> = {}

  stories.forEach((story) => {
    if (story.storyPoints !== null && isStoryPoints(story.storyPoints)) {
      assignments[story.id] = story.storyPoints
    }
  })

  return {
    data: assignments,
  }
}

export const useAssignStoryPoints = (projectId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      storyId,
      points,
    }: {
      storyId: string
      points: StoryPoints
    }) => {
      const story = await storiesService.getStory(storyId)
      return storiesService.updateStory({
        id: storyId,
        code: story.code,
        title: story.title,
        description: story.description,
        acceptanceCriteria: story.acceptanceCriteria ?? undefined,
        priority: story.priority,
        status: story.status,
        storyPoints: points,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-stories", projectId] })
      queryClient.invalidateQueries({ queryKey: ["backlog", projectId] })
      queryClient.invalidateQueries({
        queryKey: ["sprint-calculation", projectId],
      })
      queryClient.invalidateQueries({
        queryKey: ["project-task-hours", projectId],
      })
      void invalidateProjectCosts(queryClient, projectId)
      invalidateReportQueries(queryClient)
    },
  })
}
