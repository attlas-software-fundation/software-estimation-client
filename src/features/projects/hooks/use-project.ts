import { useQuery } from "@tanstack/react-query"
import { projectService } from "../services/project-service"
import type { ProjectResponse } from "../types"
import { projectQueryKeys } from "./use-projects"

export const useProject = (projectId: string) => {
  return useQuery<ProjectResponse>({
    queryKey: projectQueryKeys.detail(projectId),
    queryFn: () => projectService.getProject(projectId),
    enabled: Boolean(projectId),
  })
}
