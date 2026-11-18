"use client"

import {
  PieChartIcon,
  ReceiptIcon,
  RefreshCwIcon,
  UsersIcon,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useProjectCosts } from "../hooks/use-project-costs"
import { CostsEmptyState } from "./costs-empty-state"
import { CostsErrorState } from "./costs-error-state"
import { ProfileCostBreakdownTable } from "./profile-cost-breakdown-table"
import { ProfileCostDistributionChart } from "./profile-cost-distribution-chart"
import { ProjectCostSummaryCard } from "./project-cost-summary-card"
import { TaskCostsTable } from "./task-costs-table"

type CostsViewProps = {
  projectId: string
}

const tabClass = cn(
  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-all cursor-pointer border border-transparent",
  "text-muted-foreground hover:bg-background/80 hover:text-foreground font-medium",
  "data-active:!bg-primary data-active:!text-primary-foreground data-active:font-semibold data-active:shadow-xs"
)

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
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Cálculo de costos
          </h1>
          <p className="text-muted-foreground text-sm">
            Consulta el costo base y las contribuciones de cada perfil técnico.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={isFetching || !projectId.trim()}
          onClick={() => {
            void refetch()
          }}
        >
          <RefreshCwIcon
            data-icon="inline-start"
            className={isFetching ? "size-4 animate-spin" : "size-4"}
          />
          Actualizar costos
        </Button>
      </div>
      {isFetching && !isPending && (
        <p role="status" className="text-muted-foreground text-sm">
          Actualizando costos…
        </p>
      )}

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
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : summary ? (
        <>
          {hasCosts ? (
            <Tabs defaultValue="tareas" className="flex w-full flex-col gap-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="overflow-x-auto pb-1">
                  <TabsList className="bg-muted/40 inline-flex h-auto items-center gap-1.5 rounded-xl border p-1.5 shadow-xs">
                    <TabsTrigger value="tareas" className={tabClass}>
                      <ReceiptIcon className="size-4 shrink-0" />
                      <span>Costos por tarea</span>
                    </TabsTrigger>
                    <TabsTrigger value="perfiles" className={tabClass}>
                      <UsersIcon className="size-4 shrink-0" />
                      <span>Desglose por perfil</span>
                    </TabsTrigger>
                    <TabsTrigger value="distribucion" className={tabClass}>
                      <PieChartIcon className="size-4 shrink-0" />
                      <span>Distribución</span>
                    </TabsTrigger>
                  </TabsList>
                </div>
                <div className="w-full sm:w-auto sm:min-w-72">
                  <ProjectCostSummaryCard
                    totalCost={summary.totalCost}
                    currency={summary.currency}
                  />
                </div>
              </div>
              <TabsContent value="tareas" className="mt-0 outline-none">
                <TaskCostsTable taskCosts={summary.taskCosts} />
              </TabsContent>
              <TabsContent value="perfiles" className="mt-0 outline-none">
                <ProfileCostBreakdownTable
                  profileBreakdown={summary.profileBreakdown}
                />
              </TabsContent>
              <TabsContent value="distribucion" className="mt-0 outline-none">
                <ProfileCostDistributionChart
                  profileBreakdown={summary.profileBreakdown}
                  totalCost={summary.totalCost}
                />
              </TabsContent>
            </Tabs>
          ) : (
            <>
              <ProjectCostSummaryCard
                totalCost={summary.totalCost}
                currency={summary.currency}
              />
              <CostsEmptyState />
            </>
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
