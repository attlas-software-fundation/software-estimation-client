import type { ComponentProps, ReactNode } from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StoryDetailProps extends ComponentProps<typeof Card> {
  children: ReactNode
}

export const StoryDetail = ({
  className,
  children,
  ...props
}: StoryDetailProps) => (
  <Card className={cn(className)} {...props}>
    {children}
  </Card>
)
