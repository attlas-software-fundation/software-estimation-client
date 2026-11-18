"use client"

import { useState } from "react"
import { FileDownIcon, SaveIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/toast"
import { getErrorMessage } from "@/lib/form-errors"
import {
  useExportProjectReportPdf,
  useLatestEstimate,
  useReportsHistory,
  useSaveReportSnapshot,
} from "../hooks/use-reports"
import { useProjectAccess } from "@/features/projects/hooks/use-project-access"
import { ReportHistoryTable } from "./report-history-table"
import { ReportSummaryCards } from "./report-summary-cards"

type ReportsViewProps = {
  projectId: string
}

export const ReportsView = ({ projectId }: ReportsViewProps) => {
  const { data: latest, isLoading: latestLoading } =
    useLatestEstimate(projectId)
  const { data: history, isLoading: historyLoading } =
    useReportsHistory(projectId)
  const saveSnapshot = useSaveReportSnapshot(projectId)
  const access = useProjectAccess(projectId)
  const exportPdf = useExportProjectReportPdf(
    projectId,
    access.project ? access.project.name : ""
  )
  const [exportingId, setExportingId] = useState("")

  const handleSave = async () => {
    if (!latest || !access.canSaveReport) {
      return
    }
    try {
      await saveSnapshot.mutateAsync()
      toast.add({
        title: "Estimación guardada",
        description: "Se registró la estimación en el historial del proyecto.",
        type: "success",
      })
    } catch (error) {
      toast.add({
        title: "No se pudo guardar",
        description: getErrorMessage(error, "Inténtalo de nuevo."),
        type: "error",
      })
    }
  }

  const handleExport = async (estimationId?: string) => {
    const rowId = estimationId || "latest"
    setExportingId(rowId)
    try {
      await exportPdf.mutateAsync(estimationId)
      toast.add({
        title: "PDF generado",
        description: "El PDF se descargó.",
        type: "success",
      })
    } catch (error) {
      toast.add({
        title: "No se pudo generar el PDF",
        description: getErrorMessage(error, "Inténtalo de nuevo."),
        type: "error",
      })
    } finally {
      setExportingId("")
    }
  }

  if (latestLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (!latest) {
    return (
      <p className="text-muted-foreground text-sm">
        No se pudo cargar el reporte del proyecto.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reportes</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={exportingId.length > 0}
            onClick={() => {
              void handleExport(
                latest.id || (history && history[0] ? history[0].id : undefined)
              )
            }}
          >
            <FileDownIcon />
            Descargar PDF
          </Button>
          <Button
            type="button"
            disabled={saveSnapshot.isPending || !access.canSaveReport}
            onClick={() => {
              void handleSave()
            }}
          >
            <SaveIcon />
            Guardar en historial
          </Button>
        </div>
      </div>

      <ReportSummaryCards snapshot={latest} />

      <Card>
        <CardHeader>
          <CardTitle>Historial</CardTitle>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <ReportHistoryTable
              estimations={history || []}
              emptyLabel="Sin estimaciones guardadas."
              exportingId={exportingId}
              onExport={(estimation) => {
                void handleExport(estimation.id)
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
