"use client"

import { ChartColumnIcon, FileSpreadsheetIcon } from "lucide-react"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "@/components/ui/toast"
import { usePagination } from "@/hooks"
import { getErrorMessage } from "@/lib/form-errors"
import { TABLE_PAGE_SIZE } from "@/lib/pagination"
import { useProjects } from "@/features/projects/hooks/use-projects"
import type { ProjectSearchResponse } from "@/features/projects/types"
import type { QueryRequest } from "@/types/api"
import { useExportProjectsExcel } from "../hooks/use-global-reports"
import { GlobalProjectsTable } from "./global-projects-table"

const emptyPage: ProjectSearchResponse = {
  projectResponse: [],
  pageSize: TABLE_PAGE_SIZE,
  pageNumber: 0,
  totalPages: 0,
  totalElements: 0,
  hasNext: false,
  hasPrevious: false,
}

export const GlobalReportsView = () => {
  const { pageNumber, pageSize, setPageNumber } = usePagination()

  const query: QueryRequest = {
    filters: [],
    pagination: {
      pageNumber,
      pageSize,
      orderBy: "createdAt",
      sortDirection: "DESC",
    },
  }

  const { data, isLoading, isError } = useProjects(query)
  const pagination = data || emptyPage
  const projects = pagination.projectResponse
  const exportExcel = useExportProjectsExcel()

  const handleExportExcel = async () => {
    try {
      await exportExcel.mutateAsync()
      toast.add({
        title: "Excel generado",
        description: "El archivo proyectos.xlsx se descargó.",
        type: "success",
      })
    } catch (error) {
      toast.add({
        title: "No se pudo exportar a Excel",
        description: getErrorMessage(error, "Inténtalo de nuevo."),
        type: "error",
      })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Reportes del sistema
          </h1>
          <p className="text-muted-foreground text-sm">
            Listado de proyectos y exportación a Excel.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={exportExcel.isPending}
            onClick={() => {
              void handleExportExcel()
            }}
          >
            <FileSpreadsheetIcon />
            Exportar Excel
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Proyectos</CardTitle>
          <CardDescription>
            Estimación vigente de cada proyecto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            isLoading={isLoading}
            isError={isError}
            errorMessage="No se pudieron cargar los proyectos."
            isEmpty={projects.length === 0}
            emptyIcon={ChartColumnIcon}
            emptyMessage="No hay proyectos registrados."
            pagination={pagination}
            onPageChange={setPageNumber}
          >
            <GlobalProjectsTable projects={projects} />
          </DataTable>
        </CardContent>
      </Card>
    </div>
  )
}
