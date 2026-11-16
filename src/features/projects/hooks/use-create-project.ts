import { useMutation, useQueryClient } from "@tanstack/react-query"
import { projectService } from "../services/project-service"
import { projectQueryKeys } from "./use-projects"
import type { ProjectFormValues } from "../schemas/project-schema"
import type { CreateProjectRequest } from "../types"

export const useCreateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ProjectFormValues | CreateProjectRequest) =>
      projectService.createProject(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectQueryKeys.all })
    },
  })
}
