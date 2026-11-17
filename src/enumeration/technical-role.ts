import {
  Activity,
  CheckCircle2Icon,
  Cpu,
  FileTextIcon,
  Flag,
  Layers,
  Server,
  Sliders,
  SparklesIcon,
  UserRound,
  type LucideIcon,
} from "lucide-react"

export type TechnicalRoleValue =
  | "FRONTEND"
  | "BACKEND"
  | "FULLSTACK"
  | "QA"
  | "DEVOPS"
  | "UI_UX_DESIGNER"
  | "PRODUCT_MANAGER"
  | "TECH_LEAD"
  | "FUNCTIONAL_ANALYST"
  | "OTHER"

export type TechnicalRoleType = TechnicalRoleValue

export type TechnicalRoleDefinition = {
  value: TechnicalRoleValue
  label: string
  icon: LucideIcon
  color: string
  variant:
    "info" | "success" | "warning" | "secondary" | "destructive" | "muted"
}

export const TechnicalRole = {
  FRONTEND: {
    value: "FRONTEND",
    label: "Frontend",
    icon: Cpu,
    color: "text-blue-500",
    variant: "info",
  },
  BACKEND: {
    value: "BACKEND",
    label: "Backend",
    icon: Server,
    color: "text-emerald-500",
    variant: "success",
  },
  FULLSTACK: {
    value: "FULLSTACK",
    label: "Fullstack",
    icon: Layers,
    color: "text-cyan-500",
    variant: "info",
  },
  QA: {
    value: "QA",
    label: "QA / Testing",
    icon: CheckCircle2Icon,
    color: "text-amber-500",
    variant: "warning",
  },
  DEVOPS: {
    value: "DEVOPS",
    label: "DevOps / Infraestructura",
    icon: Activity,
    color: "text-purple-500",
    variant: "secondary",
  },
  UI_UX_DESIGNER: {
    value: "UI_UX_DESIGNER",
    label: "Diseñador UI/UX",
    icon: SparklesIcon,
    color: "text-rose-500",
    variant: "destructive",
  },
  PRODUCT_MANAGER: {
    value: "PRODUCT_MANAGER",
    label: "Product Manager",
    icon: UserRound,
    color: "text-blue-500",
    variant: "info",
  },
  TECH_LEAD: {
    value: "TECH_LEAD",
    label: "Líder Técnico",
    icon: Flag,
    color: "text-purple-500",
    variant: "secondary",
  },
  FUNCTIONAL_ANALYST: {
    value: "FUNCTIONAL_ANALYST",
    label: "Analista Funcional",
    icon: FileTextIcon,
    color: "text-amber-500",
    variant: "warning",
  },
  OTHER: {
    value: "OTHER",
    label: "Otro",
    icon: Sliders,
    color: "text-muted-foreground",
    variant: "muted",
  },
} as const satisfies Record<TechnicalRoleValue, TechnicalRoleDefinition>

export const TECHNICAL_ROLES: readonly [
  TechnicalRoleValue,
  ...TechnicalRoleValue[],
] = [
  TechnicalRole.FRONTEND.value,
  TechnicalRole.BACKEND.value,
  TechnicalRole.FULLSTACK.value,
  TechnicalRole.QA.value,
  TechnicalRole.DEVOPS.value,
  TechnicalRole.UI_UX_DESIGNER.value,
  TechnicalRole.PRODUCT_MANAGER.value,
  TechnicalRole.TECH_LEAD.value,
  TechnicalRole.FUNCTIONAL_ANALYST.value,
  TechnicalRole.OTHER.value,
]

export const TECHNICAL_ROLE_OPTIONS: TechnicalRoleDefinition[] = [
  TechnicalRole.FRONTEND,
  TechnicalRole.BACKEND,
  TechnicalRole.FULLSTACK,
  TechnicalRole.QA,
  TechnicalRole.DEVOPS,
  TechnicalRole.UI_UX_DESIGNER,
  TechnicalRole.PRODUCT_MANAGER,
  TechnicalRole.TECH_LEAD,
  TechnicalRole.FUNCTIONAL_ANALYST,
  TechnicalRole.OTHER,
]

export const TECHNICAL_ROLE_BY_VALUE: Record<
  TechnicalRoleValue,
  TechnicalRoleDefinition
> = {
  FRONTEND: TechnicalRole.FRONTEND,
  BACKEND: TechnicalRole.BACKEND,
  FULLSTACK: TechnicalRole.FULLSTACK,
  QA: TechnicalRole.QA,
  DEVOPS: TechnicalRole.DEVOPS,
  UI_UX_DESIGNER: TechnicalRole.UI_UX_DESIGNER,
  PRODUCT_MANAGER: TechnicalRole.PRODUCT_MANAGER,
  TECH_LEAD: TechnicalRole.TECH_LEAD,
  FUNCTIONAL_ANALYST: TechnicalRole.FUNCTIONAL_ANALYST,
  OTHER: TechnicalRole.OTHER,
}

export const TECHNICAL_ROLE_LABELS: Record<TechnicalRoleValue, string> = {
  FRONTEND: TechnicalRole.FRONTEND.label,
  BACKEND: TechnicalRole.BACKEND.label,
  FULLSTACK: TechnicalRole.FULLSTACK.label,
  QA: TechnicalRole.QA.label,
  DEVOPS: TechnicalRole.DEVOPS.label,
  UI_UX_DESIGNER: TechnicalRole.UI_UX_DESIGNER.label,
  PRODUCT_MANAGER: TechnicalRole.PRODUCT_MANAGER.label,
  TECH_LEAD: TechnicalRole.TECH_LEAD.label,
  FUNCTIONAL_ANALYST: TechnicalRole.FUNCTIONAL_ANALYST.label,
  OTHER: TechnicalRole.OTHER.label,
}
