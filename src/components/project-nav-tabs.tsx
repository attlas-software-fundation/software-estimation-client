"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import {
  ArrowLeftIcon,
  ArrowRightLeftIcon,
  BanknoteIcon,
  CalculatorIcon,
  ChartColumnIcon,
  HistoryIcon,
  ListTodoIcon,
  ShieldAlertIcon,
} from "lucide-react"
import { useProject } from "@/features/projects/hooks/use-project"
import { useProjectAccess } from "@/features/projects/hooks/use-project-access"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ProjectStatusDialog } from "@/features/projects/ui/project-status-dialog"
import { ProjectHistoryDialog } from "@/features/projects/ui/project-history-dialog"
import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_VARIANTS,
} from "@/enumeration/project-status"
import { cn } from "@/lib/utils"

export const ProjectNavTabs = () => {
  const pathname = usePathname()
  const params = useParams<{ projectId: string }>()
  const projectId = params.projectId

  const { data: project } = useProject(projectId)
  const access = useProjectAccess(projectId)

  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false)

  const canChangeStatus = access.allowedTransitions.length > 0

  const tabs = [
    {
      title: "Historias y tareas",
      href: `/projects/${projectId}/backlog`,
      icon: ListTodoIcon,
    },
    {
      title: "Estimación",
      href: `/projects/${projectId}/estimation`,
      icon: CalculatorIcon,
    },
    {
      title: "Cálculo de costos",
      href: `/projects/${projectId}/costs`,
      icon: BanknoteIcon,
    },
    {
      title: "Riesgo y contingencia",
      href: `/projects/${projectId}/risks`,
      icon: ShieldAlertIcon,
    },
    {
      title: "Reportes",
      href: `/projects/${projectId}/reports`,
      icon: ChartColumnIcon,
    },
  ]

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <Tooltip>
            <TooltipTrigger
              render={
                <Link
                  href="/projects"
                  className={cn(
                    buttonVariants({
                      variant: "secondary",
                      size: "icon",
                    }),
                    "shrink-0 rounded-md"
                  )}
                />
              }
            >
              <ArrowLeftIcon />
              <span className="sr-only">Volver a proyectos</span>
            </TooltipTrigger>
            <TooltipContent>Volver a proyectos</TooltipContent>
          </Tooltip>

          {/* Title + description */}
          <div className="min-w-0 flex-1">
            {project ? (
              <>
                <h1 className="text-2xl font-bold tracking-tight">
                  {project.name}
                </h1>
                <p className="text-muted-foreground text-sm">
                  Gestiona el backlog, la estimación, los costos y los riesgos
                  de este proyecto.
                </p>
              </>
            ) : (
              <div className="space-y-2">
                <div className="bg-muted h-8 w-64 animate-pulse rounded-md" />
                <div className="bg-muted h-4 w-80 animate-pulse rounded-md" />
              </div>
            )}
          </div>

          {/* Status badge + divided actions */}
          {!access.isLoading && access.project && (
            <div className="flex shrink-0 items-center gap-2.5">
              <Badge variant={PROJECT_STATUS_VARIANTS[access.status]}>
                {PROJECT_STATUS_LABELS[access.status]}
              </Badge>

              <div className="bg-background inline-flex items-center rounded-md border shadow-xs">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsHistoryDialogOpen(true)}
                  className={cn(
                    "text-muted-foreground hover:text-foreground h-8 gap-1.5 px-2.5 text-xs",
                    canChangeStatus ? "rounded-none rounded-l-md" : "rounded-md"
                  )}
                >
                  <HistoryIcon className="size-3.5" />
                  <span>Historial</span>
                </Button>
                {canChangeStatus ? (
                  <>
                    <div className="bg-border h-4 w-px" />
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsStatusDialogOpen(true)}
                      className="text-muted-foreground hover:text-foreground h-8 gap-1.5 rounded-none rounded-r-md px-2.5 text-xs"
                    >
                      <ArrowRightLeftIcon className="size-3.5" />
                      <span>Cambiar estado</span>
                    </Button>
                  </>
                ) : null}
              </div>
            </div>
          )}
        </div>

        <nav className="flex flex-wrap items-center gap-1 border-b pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive =
              pathname === tab.href || pathname.startsWith(`${tab.href}/`)

            return (
              <Link
                key={tab.title}
                href={tab.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                <span>{tab.title}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {access.project && (
        <>
          <ProjectStatusDialog
            project={access.project}
            open={isStatusDialogOpen}
            onOpenChange={setIsStatusDialogOpen}
          />
          <ProjectHistoryDialog
            project={access.project}
            open={isHistoryDialogOpen}
            onOpenChange={setIsHistoryDialogOpen}
          />
        </>
      )}
    </>
  )
}
