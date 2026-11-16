import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { projectService } from "../services/project-service"
import type { QueryRequest } from "@/types/api"
import type {
  ProjectSearchResponse,
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../types"
import type { ProjectFormValues } from "../schemas/project-schema"
import { invalidateReportQueries } from "@/features/reports/hooks/query-keys"

export { useProject } from "./use-project"

export const projectQueryKeys = {
  all: ["projects"] as const,
  lists: () => [...projectQueryKeys.all, "list"] as const,
  list: (query?: QueryRequest) =>
    [...projectQueryKeys.all, "list", query] as const,
  details: () => [...projectQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...projectQueryKeys.all, "detail", id] as const,
  statusHistories: () => [...projectQueryKeys.all, "status-history"] as const,
  statusHistory: (id: string) =>
    [...projectQueryKeys.all, "status-history", id] as const,
}

export const useProjects = (query?: QueryRequest) => {
  const queryClient = useQueryClient()

  const projectsQuery = useQuery<ProjectSearchResponse>({
    queryKey: projectQueryKeys.list(query),
    queryFn: () => projectService.searchProjects(query),
    placeholderData: (previousData) => previousData,
    enabled: !!query,
  })

  const allProjectsQuery = useQuery<Project[]>({
    queryKey: projectQueryKeys.lists(),
    queryFn: projectService.getProjects,
    enabled: !query,
  })

  const createProjectMutation = useMutation({
    mutationFn: (data: ProjectFormValues | CreateProjectRequest) =>
      projectService.createProject(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectQueryKeys.all })
    },
  })

  const updateProjectMutation = useMutation({
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

  const updateProjectStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
      estado,
    }: {
      id: string
      status?: string
      estado?: string
    }) => projectService.updateProjectStatus(id, (status ?? estado)!),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: projectQueryKeys.all })
      void queryClient.invalidateQueries({
        queryKey: projectQueryKeys.detail(variables.id),
      })
    },
  })

  const deleteProjectMutation = useMutation({
    mutationFn: (id: string) => projectService.deleteProject(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectQueryKeys.all })
      invalidateReportQueries(queryClient)
    },
  })

  return {
    data: projectsQuery.data,
    paginatedProjects: projectsQuery.data,
    projects: allProjectsQuery.data ?? [],
    isLoading: projectsQuery.isLoading || allProjectsQuery.isLoading,
    isError: projectsQuery.isError || allProjectsQuery.isError,
    error: projectsQuery.error || allProjectsQuery.error,
    createProject: createProjectMutation.mutateAsync,
    isCreating: createProjectMutation.isPending,
    updateProject: updateProjectMutation.mutateAsync,
    isUpdating: updateProjectMutation.isPending,
    updateProjectStatus: updateProjectStatusMutation.mutateAsync,
    isUpdatingStatus: updateProjectStatusMutation.isPending,
    deleteProject: deleteProjectMutation.mutateAsync,
    isDeleting: deleteProjectMutation.isPending,
  }
}
