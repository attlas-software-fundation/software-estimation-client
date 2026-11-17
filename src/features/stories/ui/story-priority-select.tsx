"use client"

import { Flag, type LucideIcon } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { STORY_PRIORITY_OPTIONS, type StoryPriority } from "../types"

type StoryPrioritySelectProps = {
  id?: string
  value: string
  includeAll?: boolean
  placeholder?: string
  onValueChange: (value: StoryPriority | "") => void
  className?: string
  disabled?: boolean
}

const AllPrioritiesIcon = Flag
const ALL_PRIORITIES_COLOR = "text-muted-foreground"

const priorityOptionLabel = (
  label: string,
  Icon: LucideIcon,
  color: string
) => {
  return (
    <span className="flex items-center gap-2">
      <Icon className={cn("size-4 shrink-0", color)} />
      {label}
    </span>
  )
}

export const StoryPrioritySelect = ({
  id = "story-priority-filter",
  value,
  includeAll = true,
  placeholder,
  onValueChange,
  className,
  disabled = false,
}: StoryPrioritySelectProps) => {
  const defaultPlaceholder = includeAll
    ? "Todas las prioridades"
    : "Selecciona una prioridad"
  const resolvedPlaceholder = placeholder ?? defaultPlaceholder

  const selectedOption = STORY_PRIORITY_OPTIONS.find(
    (opt) => opt.value === value
  )

  const items = [
    ...(includeAll
      ? [
          {
            value: "",
            label: priorityOptionLabel(
              "Todas las prioridades",
              AllPrioritiesIcon,
              ALL_PRIORITIES_COLOR
            ),
          },
        ]
      : []),
    ...STORY_PRIORITY_OPTIONS.map((opt) => ({
      value: opt.value,
      label: priorityOptionLabel(opt.label, opt.icon, opt.color),
    })),
  ]

  const displayLabel = selectedOption
    ? priorityOptionLabel(
        selectedOption.label,
        selectedOption.icon,
        selectedOption.color
      )
    : priorityOptionLabel(
        resolvedPlaceholder,
        AllPrioritiesIcon,
        ALL_PRIORITIES_COLOR
      )

  return (
    <Select
      value={value === "ALL" || value === "all" ? "" : value}
      items={items}
      disabled={disabled}
      onValueChange={(nextValue) => {
        onValueChange((nextValue as StoryPriority) ?? "")
      }}
    >
      <SelectTrigger id={id} className={cn("w-full", className)}>
        <SelectValue placeholder={resolvedPlaceholder}>
          {displayLabel}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {includeAll ? (
          <SelectItem value="">
            {priorityOptionLabel(
              "Todas las prioridades",
              AllPrioritiesIcon,
              ALL_PRIORITIES_COLOR
            )}
          </SelectItem>
        ) : null}
        {STORY_PRIORITY_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {priorityOptionLabel(opt.label, opt.icon, opt.color)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
