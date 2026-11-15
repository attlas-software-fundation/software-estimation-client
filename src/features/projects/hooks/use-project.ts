import { useQuery } from "@tanstack/react-query"
import { projectService } from "../services/project-service"
import { projectQueryKeys } from "./use-projects"
import type { Project } from "../types"

export const useProject = (id: string) => {
  return useQuery<Project>({
    queryKey: projectQueryKeys.detail(id),
    queryFn: () => projectService.getProject(id),
    enabled: Boolean(id),
  })
}
