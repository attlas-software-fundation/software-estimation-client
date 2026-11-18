import { useQuery } from "@tanstack/react-query"
import { projectService } from "../services/project-service"
import { projectQueryKeys } from "./use-projects"

export const useProjectStatusHistory = (projectId: string) => {
  return useQuery({
    queryKey: projectQueryKeys.statusHistory(projectId),
    queryFn: () => projectService.getStatusHistory(projectId),
    enabled: Boolean(projectId),
  })
}
