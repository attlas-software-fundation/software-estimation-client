import type { ProjectStatus } from "../types/project-status"
import {
  canDeleteProject,
  canEditBacklog,
  canEditEstimation,
  canEditGeneral,
  canEditRisks,
  canSaveReport,
  getAllowedTransitions,
  getProjectStatusHint,
} from "../utils/project-permissions"
import { useProject } from "./use-project"

export const useProjectAccess = (projectId: string) => {
  const query = useProject(projectId)
  const status: ProjectStatus = query.data ? query.data.status : "DRAFT"

  return {
    project: query.data,
    isLoading: query.isLoading,
    status,
    hint: getProjectStatusHint(status),
    allowedTransitions: getAllowedTransitions(status),
    canEditGeneral: canEditGeneral(status),
    canEditBacklog: canEditBacklog(status),
    canEditEstimation: canEditEstimation(status),
    canEditRisks: canEditRisks(status),
    canSaveReport: canSaveReport(status),
    canDeleteProject: canDeleteProject(status),
  }
}
