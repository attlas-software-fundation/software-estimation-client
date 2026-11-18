"use client"

import { ArrowRightIcon, ClockIcon, HistoryIcon, UserIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_VARIANTS,
} from "../types/project-status"
import { useProjectStatusHistory } from "../hooks/use-project-status-history"

interface ProjectHistoryViewProps {
  projectId: string
}

export const ProjectHistoryView = ({ projectId }: ProjectHistoryViewProps) => {
  const {
    data: history = [],
    isLoading,
    error,
  } = useProjectStatusHistory(projectId)

  if (isLoading) {
    return (
      <div className="space-y-4 py-2">
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-destructive py-8 text-center text-sm">
          Error al cargar el historial cronológico de cambios de estado.
        </CardContent>
      </Card>
    )
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="text-muted-foreground flex flex-col items-center justify-center gap-2 py-12 text-center">
          <HistoryIcon className="text-muted-foreground/40 size-10" />
          <p className="text-foreground font-medium">
            Sin cambios de estado registrados
          </p>
          <p className="text-sm">
            Aún no se han registrado transiciones de estado para este proyecto.
          </p>
        </CardContent>
      </Card>
    )
  }

  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
  )

  return (
    <div className="space-y-6">
      <div className="border-border relative ml-3 space-y-6 border-l pl-6">
        {sortedHistory.map((entry) => {
          const prevStatus = entry.previousStatus
          const nextStatus = entry.newStatus
          const isInitial = !entry.previousStatus

          const authorName =
            `${entry.changedByFirstName} ${entry.changedByLastName}`.trim() ||
            entry.changedByEmail

          return (
            <div key={entry.id} className="relative">
              <span className="bg-primary ring-background absolute top-1.5 -left-[31px] size-3 rounded-full ring-4" />

              <Card className="shadow-xs transition-shadow hover:shadow-sm">
                <CardHeader className="space-y-3 py-3.5">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <CardTitle className="text-sm font-semibold">
                      {isInitial
                        ? "Creación del proyecto"
                        : "Transición de estado"}
                    </CardTitle>

                    <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                      <ClockIcon className="size-3.5" />
                      <span>
                        {new Date(entry.changedAt).toLocaleString("es-ES", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between gap-3 pt-1 sm:flex-row sm:items-center">
                    <div className="flex flex-wrap items-center gap-2">
                      {isInitial ? (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-xs">
                            Estado inicial:
                          </span>
                          <Badge variant={PROJECT_STATUS_VARIANTS[nextStatus]}>
                            {PROJECT_STATUS_LABELS[nextStatus]}
                          </Badge>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {prevStatus ? (
                            <Badge
                              variant={PROJECT_STATUS_VARIANTS[prevStatus]}
                            >
                              {PROJECT_STATUS_LABELS[prevStatus]}
                            </Badge>
                          ) : null}
                          <ArrowRightIcon className="text-muted-foreground size-3.5" />
                          <Badge variant={PROJECT_STATUS_VARIANTS[nextStatus]}>
                            {PROJECT_STATUS_LABELS[nextStatus]}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      <div className="bg-muted flex size-6 items-center justify-center rounded-full">
                        <UserIcon className="text-muted-foreground size-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-foreground font-medium">
                          {authorName}
                        </span>
                        {entry.changedByEmail &&
                        entry.changedByEmail !== authorName ? (
                          <span className="text-muted-foreground text-[11px]">
                            {entry.changedByEmail}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
