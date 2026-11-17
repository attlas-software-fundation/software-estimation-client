import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { invalidateProjectCosts } from "@/features/costs/hooks/query-keys"
import { invalidateReportQueries } from "@/features/reports/hooks/query-keys"
import { profilesService } from "@/features/profiles/services/profiles-service"
import type { Profile } from "@/features/profiles/types"
import { storiesService } from "@/features/stories/services/stories-service"
import type { TaskHourEntry, UpdateTaskHoursRequest } from "../types"

const UNASSIGNED_PROFILE_NAME = "Sin perfil técnico"

const resolveProfileNames = (profileIds: string[], profiles: Profile[]) => {
  if (profileIds.length === 0) {
    return UNASSIGNED_PROFILE_NAME
  }

  return profileIds
    .map((profileId) => {
      const byId = profiles.find((profile) => profile.id === profileId)
      return byId ? byId.name : profileId
    })
    .join(", ")
}

export const useUpdateTaskHours = (projectId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      taskId,
      data,
    }: {
      taskId: string
      data: UpdateTaskHoursRequest
    }) => {
      const task = await storiesService.getTask(taskId)
      const nextTotal = Math.max(1, Math.round(data.estimatedHours))

      return storiesService.updateTask({
        id: taskId,
        title: task.title,
        description: task.description,
        estimateHours: nextTotal,
        status: task.status,
        responsibleProfileIds: task.responsibleProfileIds,
      })
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["project-task-hours", projectId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["backlog", projectId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["sprint-calculation", projectId],
        }),
        invalidateProjectCosts(queryClient, projectId),
      ])
      invalidateReportQueries(queryClient)
    },
  })
}

export const useTaskHours = (projectId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["project-task-hours", projectId],
    queryFn: async (): Promise<TaskHourEntry[]> => {
      const [stories, tasks, profiles] = await Promise.all([
        storiesService.getStories(projectId),
        storiesService.getProjectTasks(projectId),
        profilesService.getActiveProfiles(),
      ])

      const entries: TaskHourEntry[] = []

      for (const story of stories) {
        const storyTasks = tasks.filter((task) => task.userStoryId === story.id)

        for (const task of storyTasks) {
          entries.push({
            id: task.id,
            projectId,
            storyId: story.id,
            storyCode: story.code,
            storyTitle: story.title,
            taskId: task.id,
            taskTitle: task.title,
            profileNames: resolveProfileNames(
              task.responsibleProfileIds,
              profiles
            ),
            estimatedHours: task.estimateHours ?? 0,
            updatedAt: task.updatedAt || task.createdAt,
          })
        }
      }

      return entries
    },
    enabled: Boolean(projectId),
  })

  const updateHoursMutation = useUpdateTaskHours(projectId)

  return {
    data,
    isLoading,
    error,
    updateTaskHours: updateHoursMutation.mutateAsync,
    isUpdating: updateHoursMutation.isPending,
  }
}
