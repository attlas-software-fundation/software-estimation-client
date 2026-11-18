"use client"

import type { LucideIcon } from "lucide-react"
import { formatCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"

type TaskProfileInfoProps = {
  name: string
  roleLabel: string
  email: string
  hourlyRate: number
  icon: LucideIcon
  color: string
}

export const TaskProfileInfo = ({
  name,
  roleLabel,
  email,
  hourlyRate,
  icon: Icon,
  color,
}: TaskProfileInfoProps) => {
  return (
    <span
      className="flex min-w-0 flex-1 items-center justify-between gap-2"
      title={email || undefined}
    >
      <span className="flex min-w-0 items-center gap-2">
        <Icon className={cn("h-4 w-4 shrink-0", color)} />
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="truncate font-medium">{name}</span>
          <span className="text-muted-foreground truncate text-xs">
            {roleLabel}
          </span>
        </span>
      </span>
      <span className="text-muted-foreground shrink-0 text-xs font-medium tabular-nums">
        CER {formatCurrency(hourlyRate)}/h
      </span>
    </span>
  )
}
