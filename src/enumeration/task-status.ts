import {
  CheckCircle2Icon,
  Clock3Icon,
  ListTodoIcon,
  type LucideIcon,
} from "lucide-react"

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE"

export type TaskStatusDefinition = {
  value: TaskStatus
  label: string
  icon: LucideIcon
  color: string
  variant: "muted" | "warning" | "success"
}

export const TaskStatusEnum = {
  TODO: {
    value: "TODO",
    label: "Pendiente",
    icon: ListTodoIcon,
    color: "text-muted-foreground",
    variant: "muted",
  },
  IN_PROGRESS: {
    value: "IN_PROGRESS",
    label: "En progreso",
    icon: Clock3Icon,
    color: "text-amber-500",
    variant: "warning",
  },
  DONE: {
    value: "DONE",
    label: "Completada",
    icon: CheckCircle2Icon,
    color: "text-emerald-500",
    variant: "success",
  },
} as const satisfies Record<TaskStatus, TaskStatusDefinition>

export const TASK_STATUSES: readonly [TaskStatus, ...TaskStatus[]] = [
  TaskStatusEnum.TODO.value,
  TaskStatusEnum.IN_PROGRESS.value,
  TaskStatusEnum.DONE.value,
]

export const TASK_STATUS_OPTIONS: TaskStatusDefinition[] = [
  TaskStatusEnum.TODO,
  TaskStatusEnum.IN_PROGRESS,
  TaskStatusEnum.DONE,
]
