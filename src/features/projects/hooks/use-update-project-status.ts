import { useMutation, useQueryClient } from "@tanstack/react-query"
import { projectService } from "../services/project-service"
import { projectQueryKeys } from "./use-projects"

export const useUpdateProjectStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: projectService.updateProjectStatus,
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: projectQueryKeys.all })
      void queryClient.invalidateQueries({
        queryKey: projectQueryKeys.detail(variables.projectId),
      })
      void queryClient.invalidateQueries({
        queryKey: projectQueryKeys.statusHistory(variables.projectId),
      })
    },
  })
}
