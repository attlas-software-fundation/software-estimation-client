"use client"

import { CircleDot, type LucideIcon } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { STORY_STATUS_OPTIONS, type StoryStatus } from "../types"

type StoryStatusSelectProps = {
  id?: string
  value: string
  includeAll?: boolean
  placeholder?: string
  onValueChange: (value: StoryStatus | "") => void
  className?: string
  disabled?: boolean
}

const AllStatusesIcon = CircleDot
const ALL_STATUSES_COLOR = "text-muted-foreground"

const statusOptionLabel = (label: string, Icon: LucideIcon, color: string) => {
  return (
    <span className="flex items-center gap-2">
      <Icon className={cn("size-4 shrink-0", color)} />
      {label}
    </span>
  )
}

export const StoryStatusSelect = ({
  id = "story-status-filter",
  value,
  includeAll = true,
  placeholder,
  onValueChange,
  className,
  disabled = false,
}: StoryStatusSelectProps) => {
  const defaultPlaceholder = includeAll
    ? "Todos los estados"
    : "Selecciona un estado"
  const resolvedPlaceholder = placeholder ?? defaultPlaceholder

  const selectedOption = STORY_STATUS_OPTIONS.find((opt) => opt.value === value)

  const items = [
    ...(includeAll
      ? [
          {
            value: "",
            label: statusOptionLabel(
              "Todos los estados",
              AllStatusesIcon,
              ALL_STATUSES_COLOR
            ),
          },
        ]
      : []),
    ...STORY_STATUS_OPTIONS.map((opt) => ({
      value: opt.value,
      label: statusOptionLabel(opt.label, opt.icon, opt.color),
    })),
  ]

  const displayLabel = selectedOption
    ? statusOptionLabel(
        selectedOption.label,
        selectedOption.icon,
        selectedOption.color
      )
    : statusOptionLabel(
        resolvedPlaceholder,
        AllStatusesIcon,
        ALL_STATUSES_COLOR
      )

  return (
    <Select
      value={value === "ALL" || value === "all" ? "" : value}
      items={items}
      disabled={disabled}
      onValueChange={(nextValue) => {
        onValueChange((nextValue as StoryStatus) ?? "")
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
            {statusOptionLabel(
              "Todos los estados",
              AllStatusesIcon,
              ALL_STATUSES_COLOR
            )}
          </SelectItem>
        ) : null}
        {STORY_STATUS_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {statusOptionLabel(opt.label, opt.icon, opt.color)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
