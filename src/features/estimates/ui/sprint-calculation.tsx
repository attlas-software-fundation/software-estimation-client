"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { SPRINT_UNIT_LABELS } from "@/enumeration"
import { useSprintCalculation } from "../hooks/use-sprint-calculation"

type SprintCalculationProps = {
  projectId: string
}

export const SprintCalculation = ({ projectId }: SprintCalculationProps) => {
  const { calculation, isLoading } = useSprintCalculation(projectId)

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  const missingPoints =
    calculation.storiesTotal > 0 &&
    calculation.storiesWithPoints < calculation.storiesTotal
  const missingHours =
    calculation.tasksTotal > 0 &&
    calculation.tasksWithHours < calculation.tasksTotal

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Datos base</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Historias con SP</span>
            <span className="font-medium tabular-nums">
              {calculation.storiesWithPoints} / {calculation.storiesTotal}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Backlog total</span>
            <span className="font-medium tabular-nums">
              {calculation.totalStoryPoints} SP
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Velocidad del equipo</span>
            <span className="font-medium tabular-nums">
              {calculation.velocity} SP / sprint
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Duración del sprint</span>
            <span className="font-medium tabular-nums">
              {calculation.sprintDuration}{" "}
              {SPRINT_UNIT_LABELS[calculation.sprintUnit]}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Tareas con horas</span>
            <span className="font-medium tabular-nums">
              {calculation.tasksWithHours} / {calculation.tasksTotal}
            </span>
          </div>
          {missingPoints ? (
            <p className="text-xs text-amber-600">
              Historias pendientes de Story Points.
            </p>
          ) : null}
          {missingHours ? (
            <p className="text-xs text-amber-600">
              Tareas con 0 horas registradas.
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Estimación consolidada
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-muted-foreground font-medium">
              Sprints estimados
            </span>
            <span className="text-primary font-mono text-xl font-bold tabular-nums">
              {calculation.totalSprints}
            </span>
          </div>
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-muted-foreground font-medium">
              Tiempo calendario
            </span>
            <span className="text-primary font-mono text-xl font-bold tabular-nums">
              {calculation.totalBaseTime}{" "}
              {SPRINT_UNIT_LABELS[calculation.sprintUnit]}
            </span>
          </div>
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-muted-foreground font-medium">
              Esfuerzo total
            </span>
            <span className="text-primary font-mono text-xl font-bold tabular-nums">
              {calculation.totalEffortHours} h
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
