export type PermissionCode =
  | "user:read"
  | "user:write"
  | "user:delete"
  | "profile:read"
  | "profile:write"
  | "profile:delete"
  | "project:read"
  | "project:write"
  | "project:delete"
  | "backlog:read"
  | "backlog:write"
  | "backlog:delete"
  | "estimation:read"
  | "estimation:write"
  | "estimation:delete"
  | "cost:read"
  | "cost:write"
  | "risk:read"
  | "risk:write"
  | "report:read"
  | "history:read"
  | "dashboard:read"

export const Permission = {
  USER_READ: {
    value: "user:read" as PermissionCode,
    label: "Ver usuarios",
  },
  USER_WRITE: {
    value: "user:write" as PermissionCode,
    label: "Crear y editar usuarios",
  },
  USER_DELETE: {
    value: "user:delete" as PermissionCode,
    label: "Eliminar usuarios",
  },
  PROFILE_READ: {
    value: "profile:read" as PermissionCode,
    label: "Ver perfiles técnicos",
  },
  PROFILE_WRITE: {
    value: "profile:write" as PermissionCode,
    label: "Crear y editar perfiles técnicos",
  },
  PROFILE_DELETE: {
    value: "profile:delete" as PermissionCode,
    label: "Eliminar perfiles técnicos",
  },
  PROJECT_READ: {
    value: "project:read" as PermissionCode,
    label: "Ver proyectos",
  },
  PROJECT_WRITE: {
    value: "project:write" as PermissionCode,
    label: "Crear y editar proyectos",
  },
  PROJECT_DELETE: {
    value: "project:delete" as PermissionCode,
    label: "Eliminar proyectos",
  },
  BACKLOG_READ: {
    value: "backlog:read" as PermissionCode,
    label: "Ver historias y tareas",
  },
  BACKLOG_WRITE: {
    value: "backlog:write" as PermissionCode,
    label: "Crear y actualizar historias y tareas",
  },
  BACKLOG_DELETE: {
    value: "backlog:delete" as PermissionCode,
    label: "Eliminar historias y tareas",
  },
  ESTIMATION_READ: {
    value: "estimation:read" as PermissionCode,
    label: "Ver estimación",
  },
  ESTIMATION_WRITE: {
    value: "estimation:write" as PermissionCode,
    label: "Editar estimación",
  },
  ESTIMATION_DELETE: {
    value: "estimation:delete" as PermissionCode,
    label: "Eliminar estimaciones",
  },
  COST_READ: {
    value: "cost:read" as PermissionCode,
    label: "Ver costos",
  },
  COST_WRITE: {
    value: "cost:write" as PermissionCode,
    label: "Editar costos",
  },
  RISK_READ: {
    value: "risk:read" as PermissionCode,
    label: "Ver riesgos",
  },
  RISK_WRITE: {
    value: "risk:write" as PermissionCode,
    label: "Editar riesgos",
  },
  REPORT_READ: {
    value: "report:read" as PermissionCode,
    label: "Ver reportes",
  },
  HISTORY_READ: {
    value: "history:read" as PermissionCode,
    label: "Ver historial",
  },
  DASHBOARD_READ: {
    value: "dashboard:read" as PermissionCode,
    label: "Ver dashboard",
  },
} as const

export const PERMISSIONS = {
  USER_READ: Permission.USER_READ.value,
  USER_WRITE: Permission.USER_WRITE.value,
  USER_DELETE: Permission.USER_DELETE.value,
  PROFILE_READ: Permission.PROFILE_READ.value,
  PROFILE_WRITE: Permission.PROFILE_WRITE.value,
  PROFILE_DELETE: Permission.PROFILE_DELETE.value,
  PROJECT_READ: Permission.PROJECT_READ.value,
  PROJECT_WRITE: Permission.PROJECT_WRITE.value,
  PROJECT_DELETE: Permission.PROJECT_DELETE.value,
  BACKLOG_READ: Permission.BACKLOG_READ.value,
  BACKLOG_WRITE: Permission.BACKLOG_WRITE.value,
  BACKLOG_DELETE: Permission.BACKLOG_DELETE.value,
  ESTIMATION_READ: Permission.ESTIMATION_READ.value,
  ESTIMATION_WRITE: Permission.ESTIMATION_WRITE.value,
  ESTIMATION_DELETE: Permission.ESTIMATION_DELETE.value,
  COST_READ: Permission.COST_READ.value,
  COST_WRITE: Permission.COST_WRITE.value,
  RISK_READ: Permission.RISK_READ.value,
  RISK_WRITE: Permission.RISK_WRITE.value,
  REPORT_READ: Permission.REPORT_READ.value,
  HISTORY_READ: Permission.HISTORY_READ.value,
  DASHBOARD_READ: Permission.DASHBOARD_READ.value,
} as const

export const PATH_PERMISSIONS: {
  prefix: string
  permission: PermissionCode
}[] = [
  { prefix: "/users", permission: PERMISSIONS.USER_READ },
  { prefix: "/profiles", permission: PERMISSIONS.PROFILE_READ },
  { prefix: "/projects", permission: PERMISSIONS.PROJECT_READ },
  { prefix: "/reports", permission: PERMISSIONS.REPORT_READ },
]
