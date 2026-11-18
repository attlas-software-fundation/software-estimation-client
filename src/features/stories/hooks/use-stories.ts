import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { invalidateProjectCosts } from "@/features/costs/hooks/query-keys"
import { PROFILES_QUERY_KEY } from "@/features/profiles/hooks"
import { profilesService } from "@/features/profiles/services/profiles-service"
import { invalidateReportQueries } from "@/features/reports/hooks/query-keys"
import type { StoryFormValues, TaskFormValues } from "../schemas/story-schema"
import { storiesService } from "../services/stories-service"
import type { BacklogFilters, UserStoryResponse } from "../types"

export const useStories = (projectId: string, filters: BacklogFilters = {}) => {
  const queryClient = useQueryClient()
  const queryKey = ["backlog", projectId]

  const refresh = async () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey }),
      queryClient.invalidateQueries({ queryKey: ["user-stories", projectId] }),
      queryClient.invalidateQueries({
        queryKey: ["sprint-calculation", projectId],
      }),
      queryClient.invalidateQueries({
        queryKey: ["project-task-hours", projectId],
      }),
      invalidateProjectCosts(queryClient, projectId),
      invalidateReportQueries(queryClient),
    ])

  const storiesQuery = useQuery({
    queryKey: [...queryKey, "stories", filters],
    queryFn: () => storiesService.getStories(projectId, filters),
    enabled: Boolean(projectId),
  })

  const tasksQuery = useQuery({
    queryKey: [...queryKey, "tasks"],
    queryFn: () => storiesService.getProjectTasks(projectId),
    enabled: Boolean(projectId),
  })

  const profilesQuery = useQuery({
    queryKey: [...PROFILES_QUERY_KEY, "active"],
    queryFn: () => profilesService.getActiveProfiles(),
  })

  const useMutationAction = <TVariables>(
    mutationFn: (variables: TVariables) => Promise<unknown>
  ) => useMutation({ mutationFn, onSettled: refresh })

  return {
    stories: storiesQuery.data || [],
    tasks: tasksQuery.data || [],
    profiles: profilesQuery.data || [],
    isLoading: storiesQuery.isLoading || tasksQuery.isLoading,
    isError: storiesQuery.isError || tasksQuery.isError,
    error: storiesQuery.error || tasksQuery.error,
    refetch: () => Promise.all([storiesQuery.refetch(), tasksQuery.refetch()]),
    createStory: useMutationAction(async (values: StoryFormValues) => {
      const created = await storiesService.createStory({
        projectId,
        title: values.title,
        description: values.description,
        priority: values.priority,
      })
      if (values.status !== "DRAFT") {
        return storiesService.updateStory({
          id: created.id,
          code: created.code,
          title: values.title,
          description: values.description,
          acceptanceCriteria: created.acceptanceCriteria,
          priority: values.priority,
          status: values.status,
          storyPoints: created.storyPoints,
        })
      }
      return created
    }),
    updateStory: useMutationAction(
      ({
        story,
        values,
      }: {
        story: UserStoryResponse
        values: StoryFormValues
      }) =>
        storiesService.updateStory({
          id: story.id,
          code: story.code,
          title: values.title,
          description: values.description,
          acceptanceCriteria: story.acceptanceCriteria,
          priority: values.priority,
          status: values.status,
          storyPoints: story.storyPoints,
        })
    ),
    deleteStory: useMutationAction((id: string) =>
      storiesService.deleteStory(id)
    ),
    reorderStories: useMutationAction((storyIds: string[]) =>
      storiesService.reorderStories(projectId, storyIds)
    ),
    createTask: useMutationAction(
      ({ storyId, values }: { storyId: string; values: TaskFormValues }) =>
        storiesService.createTask({
          storyId,
          ...values,
        })
    ),
    updateTask: useMutationAction(
      ({ id, values }: { id: string; values: TaskFormValues }) =>
        storiesService.updateTask({
          id,
          ...values,
        })
    ),
    reorderTasks: useMutationAction(
      ({ storyId, taskIds }: { storyId: string; taskIds: string[] }) =>
        storiesService.reorderTasks(storyId, taskIds)
    ),
    deleteTask: useMutationAction((id: string) =>
      storiesService.deleteTask(id)
    ),
  }
}
