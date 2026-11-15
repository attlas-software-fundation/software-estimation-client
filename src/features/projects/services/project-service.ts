import { apiClient } from "@/lib/api"
import type { QueryRequest } from "@/types/api"
import { removeJson } from "@/lib/storage"
import type {
  CreateProjectRequest,
  Project,
  ProjectResponse,
  ProjectSearchResponse,
  ProjectStatusHistoryResponse,
  UpdateProjectPayload,
  UpdateProjectRequest,
  UpdateProjectStatusPayload,
} from "../types"
import {
  projectStatusToApi,
  projectTypeToApi,
  toProject,
} from "../types/project-response"
import type { ProjectFormValues } from "../schemas/project-schema"

const toIsoDateString = (date: Date | string | undefined): string => {
  if (!date) return ""
  if (typeof date === "string") {
    return date.includes("T") ? date.split("T")[0] : date
  }
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const toCreatePayload = (
  data: CreateProjectRequest | ProjectFormValues | Record<string, unknown>
): CreateProjectRequest => {
  const d = data as Record<string, unknown>
  const name = String(d.name ?? d.nombre ?? "").trim()
  const description = String(d.description ?? d.descripcion ?? "").trim()
  const rawType = String(d.type ?? d.tipo ?? "MONITORING")
  const type = projectTypeToApi[rawType] ?? rawType.toUpperCase()
  const startDate = toIsoDateString(
    (d.startDate ?? d.fecha_inicio) as Date | string | undefined
  )
  const plannedDate = toIsoDateString(
    (d.plannedDate ?? d.fecha_fin) as Date | string | undefined
  )
  const responsibleId = String(d.responsibleId ?? d.responsable ?? "")

  return {
    name,
    description,
    type,
    startDate,
    plannedDate,
    responsibleId,
  }
}

const toUpdatePayload = (
  data: UpdateProjectRequest | ProjectFormValues | Record<string, unknown>
): UpdateProjectRequest => {
  const d = data as Record<string, unknown>
  const name = String(d.name ?? d.nombre ?? "").trim()
  const description = String(d.description ?? d.descripcion ?? "").trim()
  const rawType = String(d.type ?? d.tipo ?? "MONITORING")
  const type = projectTypeToApi[rawType] ?? rawType.toUpperCase()
  const startDate = toIsoDateString(
    (d.startDate ?? d.fecha_inicio) as Date | string | undefined
  )
  const plannedDate = toIsoDateString(
    (d.plannedDate ?? d.fecha_fin) as Date | string | undefined
  )
  const responsibleId = String(d.responsibleId ?? d.responsable ?? "")

  return {
    name,
    description,
    type,
    startDate,
    plannedDate,
    responsibleId,
  }
}

const searchProjects = (query?: QueryRequest) =>
  apiClient.post<ProjectSearchResponse>(
    "/api/v1/projects/search",
    query ?? {
      filters: [],
      pagination: {
        pageNumber: 0,
        pageSize: 20,
        orderBy: "createdAt",
        sortDirection: "DESC",
      },
    }
  )

const getProjects = async (): Promise<Project[]> => {
  const response = await searchProjects({
    filters: [],
    pagination: {
      pageNumber: 0,
      pageSize: 1000,
      orderBy: "createdAt",
      sortDirection: "DESC",
    },
  })
  return (response.projectResponse ?? []).map((item) => toProject(item))
}

const getProject = async (id: string): Promise<Project> => {
  const data = await apiClient.get<ProjectResponse>(`/api/v1/projects/${id}`)
  return toProject(data)
}

const createProject = async (
  data: CreateProjectRequest | ProjectFormValues
): Promise<Project> => {
  const payload = toCreatePayload(data)
  const response = await apiClient.post<ProjectResponse>(
    "/api/v1/projects",
    payload
  )
  return toProject(response)
}

const updateProject = async (
  idOrPayload: string | UpdateProjectPayload,
  data?: UpdateProjectRequest | (ProjectFormValues & { estado?: string })
): Promise<Project> => {
  if (typeof idOrPayload === "object") {
    const response = await apiClient.put<ProjectResponse>(
      `/api/v1/projects/${idOrPayload.projectId}`,
      idOrPayload.data
    )
    return toProject(response)
  }

  if (!data) {
    throw new Error("Datos de actualización requeridos")
  }

  const payload = toUpdatePayload(data)
  const response = await apiClient.put<ProjectResponse>(
    `/api/v1/projects/${idOrPayload}`,
    payload
  )
  return toProject(response)
}

const updateProjectStatus = async (
  idOrPayload: string | UpdateProjectStatusPayload,
  status?: string
): Promise<Project> => {
  if (typeof idOrPayload === "object") {
    const rawStatus = idOrPayload.status
    const apiStatus = projectStatusToApi[rawStatus] ?? rawStatus.toUpperCase()
    const response = await apiClient.patch<ProjectResponse>(
      `/api/v1/projects/${idOrPayload.projectId}/status`,
      { status: apiStatus }
    )
    return toProject(response)
  }

  if (!status) {
    throw new Error("Estado requerido")
  }

  const apiStatus = projectStatusToApi[status] ?? status.toUpperCase()
  const response = await apiClient.patch<ProjectResponse>(
    `/api/v1/projects/${idOrPayload}/status`,
    { status: apiStatus }
  )
  return toProject(response)
}

const getStatusHistory = (projectId: string) =>
  apiClient.get<ProjectStatusHistoryResponse[]>(
    `/api/v1/projects/${projectId}/status-history`
  )

const deleteProject = async (projectId: string): Promise<void> => {
  await apiClient.delete(`/api/v1/projects/${projectId}`)
  removeJson(`software-estimation:backlog:${projectId}`)
  removeJson(`software-estimation:task-hours:${projectId}`)
  removeJson(`software-estimation:story-points:${projectId}`)
  removeJson(`software-estimation:sprint-config:${projectId}`)
  removeJson(`risk_config_${projectId}`)
  removeJson(`reports_history_${projectId}`)
}

const deleteEstimation = (projectId: string, estimationId: string) =>
  apiClient.delete(`/api/v1/projects/${projectId}/estimations/${estimationId}`)

export const projectService = {
  searchProjects,
  getProjects,
  getProject,
  createProject,
  updateProject,
  updateProjectStatus,
  getStatusHistory,
  deleteProject,
  deleteEstimation,
}
