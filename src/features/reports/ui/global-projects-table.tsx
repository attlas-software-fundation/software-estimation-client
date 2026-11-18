"use client"

import Link from "next/link"
import { ChartColumnIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/lib/format"
import { timeUnitLabel } from "@/lib/calendar-time"
import { TableEmptyState } from "@/components/table-empty-state"
import { PROJECT_TYPE_BY_VALUE } from "@/enumeration/project-type"
import type { Project } from "@/features/projects/types"
import { cn } from "@/lib/utils"
import {
  projectStatusLabel,
  projectStatusVariant,
} from "../utils/report-labels"

type GlobalProjectsTableProps = {
  projects: Project[]
}

export const GlobalProjectsTable = ({ projects }: GlobalProjectsTableProps) => {
  if (projects.length === 0) {
    return (
      <TableEmptyState
        message="No hay proyectos registrados."
        icon={ChartColumnIcon}
      />
    )
  }

  return (
    <Table>
      <TableHeader className="bg-slate-100 [&_th]:border-b-2 [&_th]:border-slate-300 [&_tr]:border-b-2 [&_tr]:border-slate-300">
        <TableRow className="hover:bg-transparent">
          <TableHead>Proyecto</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Puntos</TableHead>
          <TableHead>Esfuerzo</TableHead>
          <TableHead>Tiempo total</TableHead>
          <TableHead>Costo total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => {
          const estimate = project.estimations[0] || null

          return (
            <TableRow
              key={project.id}
              className="border-0 [&_td]:border-b [&_td]:border-slate-300"
            >
              <TableCell>
                <div className="flex flex-col items-start gap-1">
                  <Link
                    href={`/projects/${project.id}/reports`}
                    className="hover:text-primary font-medium transition-colors hover:underline"
                  >
                    {project.name}
                  </Link>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      PROJECT_TYPE_BY_VALUE[project.type].color
                    )}
                  >
                    {PROJECT_TYPE_BY_VALUE[project.type].label}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={projectStatusVariant(project.status)}>
                  {projectStatusLabel(project.status)}
                </Badge>
              </TableCell>
              {estimate !== null ? (
                <>
                  <TableCell>{estimate.baseEffortPoints} SP</TableCell>
                  <TableCell>{estimate.totalEffortHours} h</TableCell>
                  <TableCell>
                    {estimate.totalTime} {timeUnitLabel(estimate.timeUnit)}
                  </TableCell>
                  <TableCell>{formatCurrency(estimate.totalCost)}</TableCell>
                </>
              ) : (
                <TableCell colSpan={4} className="text-muted-foreground">
                  Sin estimación
                </TableCell>
              )}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
