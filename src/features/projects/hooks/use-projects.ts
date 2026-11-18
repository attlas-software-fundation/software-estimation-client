import { useQuery } from "@tanstack/react-query"
import type { QueryRequest } from "@/types/api"
import { projectService } from "../services/project-service"
import type { ProjectSearchResponse } from "../types"

export { useProject } from "./use-project"

export const projectQueryKeys = {
  all: ["projects"] as const,
  list: (query: QueryRequest) => ["projects", query] as const,
  detail: (projectId: string) => ["projects", projectId] as const,
  statusHistory: (projectId: string) =>
    ["projects", "status-history", projectId] as const,
}

export const useProjects = (query: QueryRequest) => {
  return useQuery<ProjectSearchResponse>({
    queryKey: projectQueryKeys.list(query),
    queryFn: () => projectService.getProjects(query),
    placeholderData: (previousData) => previousData,
  })
}
