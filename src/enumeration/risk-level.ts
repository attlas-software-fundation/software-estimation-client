import {
  AlertTriangleIcon,
  FlameIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  type LucideIcon,
} from "lucide-react"

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

export type RiskLevelDefinition = {
  value: RiskLevel
  label: string
  icon: LucideIcon
  color: string
  buttonClassName: string
  defaultMargin: number
  variant: "success" | "warning" | "destructive"
}

export const RiskLevelEnum = {
  LOW: {
    value: "LOW",
    label: "Bajo",
    icon: ShieldCheckIcon,
    color: "text-emerald-600",
    buttonClassName: "bg-emerald-500 hover:bg-emerald-600 text-white",
    defaultMargin: 5,
    variant: "success",
  },
  MEDIUM: {
    value: "MEDIUM",
    label: "Medio",
    icon: AlertTriangleIcon,
    color: "text-amber-600",
    buttonClassName: "bg-yellow-500 hover:bg-yellow-600 text-white",
    defaultMargin: 15,
    variant: "warning",
  },
  HIGH: {
    value: "HIGH",
    label: "Alto",
    icon: ShieldAlertIcon,
    color: "text-red-600",
    buttonClassName: "bg-red-500 hover:bg-red-600 text-white",
    defaultMargin: 25,
    variant: "destructive",
  },
  CRITICAL: {
    value: "CRITICAL",
    label: "Crítico",
    icon: FlameIcon,
    color: "text-rose-700",
    buttonClassName: "bg-rose-700 hover:bg-rose-800 text-white",
    defaultMargin: 35,
    variant: "destructive",
  },
} as const satisfies Record<RiskLevel, RiskLevelDefinition>

export const RISK_LEVELS: readonly [RiskLevel, ...RiskLevel[]] = [
  RiskLevelEnum.LOW.value,
  RiskLevelEnum.MEDIUM.value,
  RiskLevelEnum.HIGH.value,
  RiskLevelEnum.CRITICAL.value,
]

export const RISK_LEVEL_OPTIONS: RiskLevelDefinition[] = [
  RiskLevelEnum.LOW,
  RiskLevelEnum.MEDIUM,
  RiskLevelEnum.HIGH,
  RiskLevelEnum.CRITICAL,
]

export const RISK_LEVEL_BY_VALUE: Record<RiskLevel, RiskLevelDefinition> = {
  LOW: RiskLevelEnum.LOW,
  MEDIUM: RiskLevelEnum.MEDIUM,
  HIGH: RiskLevelEnum.HIGH,
  CRITICAL: RiskLevelEnum.CRITICAL,
}

export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  LOW: RiskLevelEnum.LOW.label,
  MEDIUM: RiskLevelEnum.MEDIUM.label,
  HIGH: RiskLevelEnum.HIGH.label,
  CRITICAL: RiskLevelEnum.CRITICAL.label,
}

export const DEFAULT_RISK_LEVEL: RiskLevel = RiskLevelEnum.MEDIUM.value

export const isRiskLevel = (value: string): value is RiskLevel =>
  RISK_LEVELS.some((level) => level === value)

export const getRiskDefaultMargin = (level: RiskLevel): number =>
  RISK_LEVEL_BY_VALUE[level].defaultMargin
