"use client"

import { FileDownIcon, HistoryIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/lib/format"
import { timeUnitLabel } from "@/lib/calendar-time"
import { TableEmptyState } from "@/components/table-empty-state"
import type { ProjectEstimationResponse } from "../types"

type ReportHistoryTableProps = {
  estimations: ProjectEstimationResponse[]
  emptyLabel: string
  exportingId: string
  onExport: (estimation: ProjectEstimationResponse) => void
}

export const ReportHistoryTable = ({
  estimations,
  emptyLabel,
  exportingId,
  onExport,
}: ReportHistoryTableProps) => {
  if (estimations.length === 0) {
    return <TableEmptyState message={emptyLabel} icon={HistoryIcon} />
  }

  return (
    <Table>
      <TableHeader className="bg-slate-100 [&_th]:border-b-2 [&_th]:border-slate-300 [&_tr]:border-b-2 [&_tr]:border-slate-300">
        <TableRow className="hover:bg-transparent">
          <TableHead>Fecha</TableHead>
          <TableHead>Puntos</TableHead>
          <TableHead>Esfuerzo</TableHead>
          <TableHead>Tiempo total</TableHead>
          <TableHead>Costo total</TableHead>
          <TableHead className="w-28 text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {estimations.map((estimation) => (
          <TableRow
            key={estimation.id}
            className="border-0 [&_td]:border-b [&_td]:border-slate-300"
          >
            <TableCell className="font-medium">
              {estimation.createdAt.length > 0
                ? formatDate(estimation.createdAt)
                : "—"}
            </TableCell>
            <TableCell>{estimation.baseEffortPoints} SP</TableCell>
            <TableCell>{estimation.totalEffortHours} h</TableCell>
            <TableCell>
              {estimation.totalTime} {timeUnitLabel(estimation.timeUnit)}
            </TableCell>
            <TableCell>{formatCurrency(estimation.totalCost)}</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  disabled={exportingId.length > 0}
                  onClick={() => onExport(estimation)}
                >
                  <FileDownIcon />
                  <span className="sr-only">
                    Descargar PDF de esta estimación
                  </span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
