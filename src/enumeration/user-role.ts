import {
  CalculatorIcon,
  EyeIcon,
  ShieldIcon,
  type LucideIcon,
} from "lucide-react"

export type UserRoleValue = "admin" | "estimator" | "viewer"

export type UserRoleDefinition = {
  value: UserRoleValue
  label: string
  icon: LucideIcon
  color: string
}

export const UserRole = {
  ADMIN: {
    value: "admin",
    label: "ADMINISTRADOR",
    icon: ShieldIcon,
    color: "text-violet-600",
  },
  ESTIMATOR: {
    value: "estimator",
    label: "ESTIMADOR",
    icon: CalculatorIcon,
    color: "text-sky-600",
  },
  VIEWER: {
    value: "viewer",
    label: "CONSULTOR",
    icon: EyeIcon,
    color: "text-slate-600",
  },
} as const satisfies Record<string, UserRoleDefinition>

export const USER_ROLES: readonly [UserRoleValue, ...UserRoleValue[]] = [
  UserRole.ADMIN.value,
  UserRole.ESTIMATOR.value,
  UserRole.VIEWER.value,
]

export const ROLE_BY_VALUE: Record<UserRoleValue, UserRoleDefinition> = {
  admin: UserRole.ADMIN,
  estimator: UserRole.ESTIMATOR,
  viewer: UserRole.VIEWER,
}

export const ROLE_OPTIONS: UserRoleDefinition[] = [
  UserRole.ADMIN,
  UserRole.ESTIMATOR,
  UserRole.VIEWER,
]

export const ROLE_ITEM_ICON = UserRole.ADMIN.icon

export const ROLE_LABELS: Record<UserRoleValue, string> = {
  admin: UserRole.ADMIN.label,
  estimator: UserRole.ESTIMATOR.label,
  viewer: UserRole.VIEWER.label,
}

export const DEFAULT_USER_ROLE: UserRoleValue = UserRole.ESTIMATOR.value

export const isUserRole = (value: string): value is UserRoleValue =>
  USER_ROLES.some((role) => role === value)
