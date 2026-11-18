import {
  Activity,
  Bot,
  Cpu,
  Layers,
  Sliders,
  TrendingUp,
  type LucideIcon,
} from "lucide-react"

export type ProjectType =
  | "MONITORING"
  | "AUTOMATION"
  | "TELEMETRY"
  | "CONTROL_SUPERVISION"
  | "PREDICTIVE_MAINTENANCE"
  | "INTEGRATION"

export type ProjectTypeDefinition = {
  value: ProjectType
  label: string
  icon: LucideIcon
  color: string
}

export const ProjectTypeEnum = {
  MONITORING: {
    value: "MONITORING",
    label: "Monitoreo IoT",
    icon: Cpu,
    color: "text-blue-500",
  },
  AUTOMATION: {
    value: "AUTOMATION",
    label: "Automatización IoT",
    icon: Bot,
    color: "text-emerald-500",
  },
  TELEMETRY: {
    value: "TELEMETRY",
    label: "Telemetría IoT",
    icon: Activity,
    color: "text-amber-500",
  },
  CONTROL_SUPERVISION: {
    value: "CONTROL_SUPERVISION",
    label: "Control y supervisión IoT",
    icon: Sliders,
    color: "text-purple-500",
  },
  PREDICTIVE_MAINTENANCE: {
    value: "PREDICTIVE_MAINTENANCE",
    label: "Mantenimiento predictivo IoT",
    icon: TrendingUp,
    color: "text-rose-500",
  },
  INTEGRATION: {
    value: "INTEGRATION",
    label: "Integración IoT",
    icon: Layers,
    color: "text-cyan-500",
  },
} as const satisfies Record<ProjectType, ProjectTypeDefinition>

export const PROJECT_TYPES: readonly [ProjectType, ...ProjectType[]] = [
  ProjectTypeEnum.MONITORING.value,
  ProjectTypeEnum.AUTOMATION.value,
  ProjectTypeEnum.TELEMETRY.value,
  ProjectTypeEnum.CONTROL_SUPERVISION.value,
  ProjectTypeEnum.PREDICTIVE_MAINTENANCE.value,
  ProjectTypeEnum.INTEGRATION.value,
]

export const PROJECT_TYPE_OPTIONS: ProjectTypeDefinition[] = [
  ProjectTypeEnum.MONITORING,
  ProjectTypeEnum.AUTOMATION,
  ProjectTypeEnum.TELEMETRY,
  ProjectTypeEnum.CONTROL_SUPERVISION,
  ProjectTypeEnum.PREDICTIVE_MAINTENANCE,
  ProjectTypeEnum.INTEGRATION,
]

export const PROJECT_TYPE_BY_VALUE: Record<ProjectType, ProjectTypeDefinition> =
  {
    MONITORING: ProjectTypeEnum.MONITORING,
    AUTOMATION: ProjectTypeEnum.AUTOMATION,
    TELEMETRY: ProjectTypeEnum.TELEMETRY,
    CONTROL_SUPERVISION: ProjectTypeEnum.CONTROL_SUPERVISION,
    PREDICTIVE_MAINTENANCE: ProjectTypeEnum.PREDICTIVE_MAINTENANCE,
    INTEGRATION: ProjectTypeEnum.INTEGRATION,
  }

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  MONITORING: ProjectTypeEnum.MONITORING.label,
  AUTOMATION: ProjectTypeEnum.AUTOMATION.label,
  TELEMETRY: ProjectTypeEnum.TELEMETRY.label,
  CONTROL_SUPERVISION: ProjectTypeEnum.CONTROL_SUPERVISION.label,
  PREDICTIVE_MAINTENANCE: ProjectTypeEnum.PREDICTIVE_MAINTENANCE.label,
  INTEGRATION: ProjectTypeEnum.INTEGRATION.label,
}
