import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  taskHoursService,
  UpdateTaskHoursRequest,
} from "../services/task-hours.service"

export const useTaskHours = (projectId: string) => {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ["project-task-hours", projectId],
    queryFn: () => taskHoursService.getTaskHourEntries(projectId),
    enabled: !!projectId,
  })

  const updateHoursMutation = useMutation({
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: string
      data: UpdateTaskHoursRequest
    }) => taskHoursService.updateTaskHours(projectId, taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project-task-hours", projectId],
      })
      queryClient.invalidateQueries({ queryKey: ["project-costs", projectId] })
    },
  })

  return {
    data,
    isLoading,
    error,
    updateTaskHours: updateHoursMutation.mutateAsync,
    isUpdating: updateHoursMutation.isPending,
  }
}
