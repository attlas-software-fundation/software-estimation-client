import { apiClient } from "@/lib/api"
import type { QueryRequest } from "@/types/api"
import type {
  CreateProjectRequest,
  ProjectResponse,
  ProjectSearchResponse,
  ProjectStatusHistoryResponse,
  UpdateProjectPayload,
  UpdateProjectStatusPayload,
} from "../types"

const getProjects = (query: QueryRequest) =>
  apiClient.post<ProjectSearchResponse>("/api/v1/projects/search", query)

const getProject = (projectId: string) =>
  apiClient.get<ProjectResponse>(`/api/v1/projects/${projectId}`)

const createProject = (input: CreateProjectRequest) =>
  apiClient.post<ProjectResponse>("/api/v1/projects", input)

const updateProject = ({ projectId, ...body }: UpdateProjectPayload) =>
  apiClient.put<ProjectResponse>(`/api/v1/projects/${projectId}`, body)

const updateProjectStatus = ({
  projectId,
  status,
}: UpdateProjectStatusPayload) =>
  apiClient.patch<ProjectResponse>(`/api/v1/projects/${projectId}/status`, {
    status,
  })

const getStatusHistory = (projectId: string) =>
  apiClient.get<ProjectStatusHistoryResponse[]>(
    `/api/v1/projects/${projectId}/status-history`
  )

const deleteProject = (projectId: string) =>
  apiClient.delete(`/api/v1/projects/${projectId}`)

export const projectService = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  updateProjectStatus,
  getStatusHistory,
  deleteProject,
}
