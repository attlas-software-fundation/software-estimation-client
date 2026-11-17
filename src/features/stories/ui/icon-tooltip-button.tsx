"use client"

import type { ComponentProps, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type IconTooltipButtonProps = {
  label: string
  disabled: boolean
  onClick: () => void
  children: ReactNode
  variant?: ComponentProps<typeof Button>["variant"]
  className?: string
}

export const IconTooltipButton = ({
  label,
  disabled,
  onClick,
  children,
  variant = "ghost",
  className,
}: IconTooltipButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger render={<span className="inline-flex" />}>
        <Button
          type="button"
          variant={variant}
          size="icon-sm"
          disabled={disabled}
          onClick={onClick}
          className={cn(className)}
        >
          {children}
          <span className="sr-only">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
