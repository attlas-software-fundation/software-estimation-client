import type { ProjectStatus } from "@/enumeration/project-status"

export type ProjectType =
  | "MONITORING"
  | "AUTOMATION"
  | "TELEMETRY"
  | "CONTROL_SUPERVISION"
  | "PREDICTIVE_MAINTENANCE"
  | "INTEGRATION"

export interface ProjectEstimationResponse {
  id: string
  estimationNumber?: number
  [key: string]: unknown
}

export interface ProjectHistoryEntry {
  id: string
  previousState: string | null
  newState: string
  changedAt: string
  changedBy: {
    id: string
    name: string
  }
}

export interface ProjectResponse {
  id: string
  name: string
  description?: string | null
  type: ProjectType | string
  startDate: string
  plannedDate: string
  responsibleId: string
  status: ProjectStatus | string
  createdAt: string
  updatedAt?: string | null
  estimations?: ProjectEstimationResponse[]

  // Optional aliases for backward compatibility
  nombre?: string
  descripcion?: string
  tipo?: string
  fecha_inicio?: string
  fecha_fin?: string
  responsable?: string
  estado?: string
  history?: ProjectHistoryEntry[]
}

export interface Project extends ProjectResponse {
  name: string
  description: string
  type: string
  startDate: string
  plannedDate: string
  responsibleId: string
  status: string
  createdAt: string
  updatedAt: string | null
  responsibleName?: string

  // Aliases for backward compatibility
  nombre: string
  descripcion: string
  tipo: string
  fecha_inicio: string
  fecha_fin: string
  responsable: string
  estado: string
  history?: ProjectHistoryEntry[]
}

export const projectStatusToApi: Record<string, string> = {
  borrador: "DRAFT",
  en_evaluacion: "UNDER_REVIEW",
  estimado: "ESTIMATED",
  aprobado: "APPROVED",
  rechazado: "REJECTED",
  en_ejecucion: "IN_PROGRESS",
  finalizado: "COMPLETED",
  DRAFT: "DRAFT",
  UNDER_REVIEW: "UNDER_REVIEW",
  ESTIMATED: "ESTIMATED",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
}

export const projectStatusFromApi: Record<string, string> = {
  DRAFT: "borrador",
  UNDER_REVIEW: "en_evaluacion",
  ESTIMATED: "estimado",
  APPROVED: "aprobado",
  REJECTED: "rechazado",
  IN_PROGRESS: "en_ejecucion",
  COMPLETED: "finalizado",
  borrador: "borrador",
  en_evaluacion: "en_evaluacion",
  estimado: "estimado",
  aprobado: "aprobado",
  rechazado: "rechazado",
  en_ejecucion: "en_ejecucion",
  finalizado: "finalizado",
}

export const projectTypeToApi: Record<string, string> = {
  monitoreo: "MONITORING",
  automatizacion: "AUTOMATION",
  telemetria: "TELEMETRY",
  control_supervision: "CONTROL_SUPERVISION",
  mantenimiento_predictivo: "PREDICTIVE_MAINTENANCE",
  integracion: "INTEGRATION",
  MONITORING: "MONITORING",
  AUTOMATION: "AUTOMATION",
  TELEMETRY: "TELEMETRY",
  CONTROL_SUPERVISION: "CONTROL_SUPERVISION",
  PREDICTIVE_MAINTENANCE: "PREDICTIVE_MAINTENANCE",
  INTEGRATION: "INTEGRATION",
}

export const projectTypeFromApi: Record<string, string> = {
  MONITORING: "monitoreo",
  AUTOMATION: "automatizacion",
  TELEMETRY: "telemetria",
  CONTROL_SUPERVISION: "control_supervision",
  PREDICTIVE_MAINTENANCE: "mantenimiento_predictivo",
  INTEGRATION: "integracion",
  monitoreo: "monitoreo",
  automatizacion: "automatizacion",
  telemetria: "telemetria",
  control_supervision: "control_supervision",
  mantenimiento_predictivo: "mantenimiento_predictivo",
  integracion: "integracion",
}

export const toProject = (
  response: ProjectResponse,
  responsibleName?: string
): Project => {
  const statusKey = (response.status || response.estado || "").toUpperCase()
  const estado =
    projectStatusFromApi[statusKey] ??
    response.status?.toLowerCase() ??
    "borrador"
  const apiStatus =
    projectStatusToApi[statusKey] ??
    projectStatusToApi[estado] ??
    response.status ??
    "DRAFT"

  const typeKey = (response.type || response.tipo || "").toUpperCase()
  const tipo =
    projectTypeFromApi[typeKey] ?? response.type?.toLowerCase() ?? "monitoreo"
  const apiType =
    projectTypeToApi[typeKey] ??
    projectTypeToApi[tipo] ??
    response.type ??
    "MONITORING"

  const name = response.name ?? response.nombre ?? ""
  const description = response.description ?? response.descripcion ?? ""
  const startDate = response.startDate ?? response.fecha_inicio ?? ""
  const plannedDate = response.plannedDate ?? response.fecha_fin ?? ""
  const responsibleId = response.responsibleId ?? ""
  const finalResponsibleName =
    responsibleName ??
    response.responsable ??
    (responsibleId ? "Sin asignar" : "")

  return {
    ...response,
    id: response.id,
    name,
    description,
    type: apiType,
    startDate,
    plannedDate,
    responsibleId,
    status: apiStatus,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt ?? null,
    estimations: response.estimations ?? [],
    responsibleName: finalResponsibleName,

    // Aliases
    nombre: name,
    descripcion: description,
    tipo,
    fecha_inicio: startDate,
    fecha_fin: plannedDate,
    responsable: finalResponsibleName,
    estado,
    history: response.history ?? [],
  }
}
