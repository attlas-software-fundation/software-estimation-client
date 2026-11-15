import { useMutation, useQueryClient } from "@tanstack/react-query"
import { projectService } from "../services/project-service"
import { projectQueryKeys } from "./use-projects"
import type { ProjectFormValues } from "../schemas/project-schema"
import type { UpdateProjectRequest } from "../types"

export const useUpdateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data:
        | UpdateProjectRequest
        | ProjectFormValues
        | (ProjectFormValues & { status?: string; estado?: string })
    }) => projectService.updateProject(id, data),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: projectQueryKeys.all })
      void queryClient.invalidateQueries({
        queryKey: projectQueryKeys.detail(variables.id),
      })
    },
  })
}
