"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useProjectCosts } from "../hooks/use-project-costs"
import { CostsEmptyState } from "./costs-empty-state"
import { CostsErrorState } from "./costs-error-state"
import { ProfileCostBreakdownTable } from "./profile-cost-breakdown-table"
import { ProjectCostSummaryCard } from "./project-cost-summary-card"
import { TaskCostsTable } from "./task-costs-table"

type CostsViewProps = {
  projectId: string
}

export const CostsView = ({ projectId }: CostsViewProps) => {
  const {
    data: summary,
    isPending,
    isError,
    error,
    isFetching,
    refetch,
  } = useProjectCosts(projectId)
  const hasCosts = Boolean(
    summary &&
    (summary.taskCosts.length > 0 || summary.profileBreakdown.length > 0)
  )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cálculo de costos</h1>
        <p className="text-muted-foreground text-sm">
          El costo en soles es horas de la tarea × CER horario del perfil
          técnico.
        </p>
      </div>

      {!projectId.trim() ? (
        <p role="alert">Selecciona un proyecto para consultar sus costos.</p>
      ) : isError ? (
        <CostsErrorState
          error={error}
          isFetching={isFetching}
          onRetry={() => {
            void refetch()
          }}
        />
      ) : isPending ? (
        <div
          className="flex flex-col gap-4"
          role="status"
          aria-label="Cargando costos"
          aria-busy="true"
        >
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : summary ? (
        <>
          <ProjectCostSummaryCard
            totalCost={summary.totalCost}
            currency={summary.currency}
          />
          {hasCosts ? (
            <>
              <TaskCostsTable taskCosts={summary.taskCosts} />
              <ProfileCostBreakdownTable
                profileBreakdown={summary.profileBreakdown}
              />
            </>
          ) : (
            <CostsEmptyState />
          )}
        </>
      ) : (
        <p role="status">
          El servidor no devolvió datos de costos para este proyecto.
        </p>
      )}
    </div>
  )
}
