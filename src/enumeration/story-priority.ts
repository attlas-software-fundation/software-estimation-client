import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  type LucideIcon,
} from "lucide-react"

export type StoryPriority = "LOW" | "MEDIUM" | "HIGH"

export type StoryPriorityDefinition = {
  value: StoryPriority
  label: string
  icon: LucideIcon
  color: string
  variant: "info" | "warning" | "destructive"
}

export const StoryPriorityEnum = {
  LOW: {
    value: "LOW",
    label: "Baja",
    icon: ArrowDownIcon,
    color: "text-blue-500",
    variant: "info",
  },
  MEDIUM: {
    value: "MEDIUM",
    label: "Media",
    icon: ArrowRightIcon,
    color: "text-amber-500",
    variant: "warning",
  },
  HIGH: {
    value: "HIGH",
    label: "Alta",
    icon: ArrowUpIcon,
    color: "text-rose-500",
    variant: "destructive",
  },
} as const satisfies Record<StoryPriority, StoryPriorityDefinition>

export const STORY_PRIORITIES: readonly [StoryPriority, ...StoryPriority[]] = [
  StoryPriorityEnum.LOW.value,
  StoryPriorityEnum.MEDIUM.value,
  StoryPriorityEnum.HIGH.value,
]

export const STORY_PRIORITY_OPTIONS: StoryPriorityDefinition[] = [
  StoryPriorityEnum.LOW,
  StoryPriorityEnum.MEDIUM,
  StoryPriorityEnum.HIGH,
]

export const STORY_PRIORITY_BY_VALUE: Record<
  StoryPriority,
  StoryPriorityDefinition
> = {
  LOW: StoryPriorityEnum.LOW,
  MEDIUM: StoryPriorityEnum.MEDIUM,
  HIGH: StoryPriorityEnum.HIGH,
}

export const STORY_PRIORITY_LABELS: Record<StoryPriority, string> = {
  LOW: StoryPriorityEnum.LOW.label,
  MEDIUM: StoryPriorityEnum.MEDIUM.label,
  HIGH: StoryPriorityEnum.HIGH.label,
}
