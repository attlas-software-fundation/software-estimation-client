export {
  PROJECT_STATUSES,
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_OPTIONS,
  PROJECT_STATUS_VARIANTS,
  ProjectStatusEnum,
  isProjectStatus,
  type ProjectStatus,
  type ProjectStatusBadgeVariant,
  type ProjectStatusDefinition,
} from "@/enumeration/project-status"

export type ProjectAction =
  | "editGeneral"
  | "editBacklog"
  | "editEstimation"
  | "editRisks"
  | "saveReport"
  | "deleteProject"
