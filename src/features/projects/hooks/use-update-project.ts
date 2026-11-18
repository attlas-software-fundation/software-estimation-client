import { useMutation, useQueryClient } from "@tanstack/react-query"
import { projectService } from "../services/project-service"
import { projectQueryKeys } from "./use-projects"

export const useUpdateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: projectService.updateProject,
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: projectQueryKeys.all })
      void queryClient.invalidateQueries({
        queryKey: projectQueryKeys.detail(variables.projectId),
      })
    },
  })
}
