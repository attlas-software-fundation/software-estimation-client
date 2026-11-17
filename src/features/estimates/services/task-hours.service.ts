import { apiClient } from "@/lib/api"

export interface UpdateTaskHoursRequest {
  estimatedHours: number
}

/**
 * Obtiene el listado de horas de las tareas de un proyecto.
 * Exportado individualmente para otros servicios.
 */
export const getTaskHourEntries = async (projectId: string) => {
  return await apiClient.get(`/api/v1/projects/${projectId}/tasks/hours`)
}

/**
 * Actualiza las horas de esfuerzo de una tarea específica en el proyecto.
 */
export const updateTaskHours = async (
  projectId: string,
  taskId: string,
  data: UpdateTaskHoursRequest
) => {
  return await apiClient.patch(
    `/api/v1/projects/${projectId}/tasks/${taskId}/hours`,
    data
  )
}

// Objeto agrupado por si algún componente lo consume de esta forma
export const taskHoursService = {
  getTaskHourEntries,
  updateTaskHours,
  getTaskHoursByProject: getTaskHourEntries,
  updateTaskHoursByProject: updateTaskHours,
}
