import {
  CheckCircle2Icon,
  CircleDashedIcon,
  Clock3Icon,
  FileTextIcon,
  type LucideIcon,
} from "lucide-react"

export type StoryStatus = "DRAFT" | "READY" | "IN_PROGRESS" | "DONE"

export type StoryStatusDefinition = {
  value: StoryStatus
  label: string
  icon: LucideIcon
  color: string
  variant: "muted" | "info" | "warning" | "success"
}

export const StoryStatusEnum = {
  DRAFT: {
    value: "DRAFT",
    label: "Borrador",
    icon: FileTextIcon,
    color: "text-muted-foreground",
    variant: "muted",
  },
  READY: {
    value: "READY",
    label: "Lista",
    icon: CircleDashedIcon,
    color: "text-sky-500",
    variant: "info",
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
} as const satisfies Record<StoryStatus, StoryStatusDefinition>

export const STORY_STATUSES: readonly [StoryStatus, ...StoryStatus[]] = [
  StoryStatusEnum.DRAFT.value,
  StoryStatusEnum.READY.value,
  StoryStatusEnum.IN_PROGRESS.value,
  StoryStatusEnum.DONE.value,
]

export const STORY_STATUS_OPTIONS: StoryStatusDefinition[] = [
  StoryStatusEnum.DRAFT,
  StoryStatusEnum.READY,
  StoryStatusEnum.IN_PROGRESS,
  StoryStatusEnum.DONE,
]

export const STORY_STATUS_BY_VALUE: Record<StoryStatus, StoryStatusDefinition> =
  {
    DRAFT: StoryStatusEnum.DRAFT,
    READY: StoryStatusEnum.READY,
    IN_PROGRESS: StoryStatusEnum.IN_PROGRESS,
    DONE: StoryStatusEnum.DONE,
  }

export const STORY_STATUS_LABELS: Record<StoryStatus, string> = {
  DRAFT: StoryStatusEnum.DRAFT.label,
  READY: StoryStatusEnum.READY.label,
  IN_PROGRESS: StoryStatusEnum.IN_PROGRESS.label,
  DONE: StoryStatusEnum.DONE.label,
}
