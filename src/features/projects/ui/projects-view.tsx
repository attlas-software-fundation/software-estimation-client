"use client"

import { useMemo, useState } from "react"
import { FolderKanbanIcon, PlusIcon } from "lucide-react"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { useDebounce, usePagination } from "@/hooks"
import { TABLE_PAGE_SIZE } from "@/lib/pagination"
import { useUsers } from "@/features/users/hooks/use-users"
import { getFullName } from "@/features/auth/types"
import {
  FilterOperator,
  type FilterRequest,
  type QueryRequest,
} from "@/types/api"
import { useProjects } from "@/features/projects"
import type { Project, ProjectFilters, ProjectSearchResponse } from "../types"
import { ProjectsTable } from "./projects-table"
import { ProjectDialog } from "./project-dialog"
import { ProjectToolbar } from "./project-toolbar"
import { ProjectsFiltersDrawer } from "@/features/projects"

const emptyPage: ProjectSearchResponse = {
  projectResponse: [],
  pageSize: TABLE_PAGE_SIZE,
  pageNumber: 0,
  totalPages: 0,
  totalElements: 0,
  hasNext: false,
  hasPrevious: false,
}

export const ProjectsView = () => {
  const { pageNumber, pageSize, setPageNumber, resetPage } = usePagination()

  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 500)

  const [filters, setFilters] = useState<ProjectFilters>({
    name: "",
    type: "",
    responsibleId: "",
    status: "",
    startDate: "",
    plannedDate: "",
  })

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  const { data: usersData } = useUsers({
    filters: [],
    pagination: {
      orderBy: "createdAt",
      pageSize: TABLE_PAGE_SIZE,
      pageNumber: 0,
      sortDirection: "ASC",
    },
  })

  const usersMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const user of usersData?.userResponse || []) {
      map.set(user.id, getFullName(user))
    }
    return map
  }, [usersData])

  const activeFilters =
    (search.length > 0 ? 1 : 0) +
    (filters.name.length > 0 ? 1 : 0) +
    (filters.type.length > 0 ? 1 : 0) +
    (filters.responsibleId.length > 0 ? 1 : 0) +
    (filters.status.length > 0 ? 1 : 0) +
    (filters.startDate.length > 0 ? 1 : 0) +
    (filters.plannedDate.length > 0 ? 1 : 0)

  const apiFilters: FilterRequest[] = []

  if (debouncedSearch.trim().length > 0) {
    apiFilters.push({
      key: "search",
      operator: FilterOperator.LK,
      values: [debouncedSearch.trim()],
    })
  }

  if (filters.name.trim().length > 0) {
    apiFilters.push({
      key: "name",
      operator: FilterOperator.LK,
      values: [filters.name.trim()],
    })
  }

  if (filters.type) {
    apiFilters.push({
      key: "type",
      operator: FilterOperator.EQ,
      values: [filters.type],
    })
  }

  if (filters.responsibleId) {
    apiFilters.push({
      key: "responsibleId",
      operator: FilterOperator.EQ,
      values: [filters.responsibleId],
    })
  }

  if (filters.status) {
    apiFilters.push({
      key: "status",
      operator: FilterOperator.EQ,
      values: [filters.status],
    })
  }

  if (filters.startDate) {
    const dateValue = filters.startDate.includes("T")
      ? filters.startDate.split("T")[0]
      : filters.startDate
    apiFilters.push({
      key: "startDate",
      operator: FilterOperator.GE,
      values: [dateValue],
    })
  }

  if (filters.plannedDate) {
    const dateValue = filters.plannedDate.includes("T")
      ? filters.plannedDate.split("T")[0]
      : filters.plannedDate
    apiFilters.push({
      key: "plannedDate",
      operator: FilterOperator.LE,
      values: [dateValue],
    })
  }

  const query: QueryRequest = {
    filters: apiFilters,
    pagination: {
      pageNumber,
      pageSize,
      orderBy: "createdAt",
      sortDirection: "DESC",
    },
  }

  const { data, isLoading, isError } = useProjects(query)
  const pagination = data || emptyPage

  const handleOpenCreate = () => {
    setEditingProject(null)
    setDialogOpen(true)
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <ProjectToolbar
          search={search}
          activeFilters={activeFilters}
          filters={filters}
          responsibleLabel={
            filters.responsibleId
              ? usersMap.get(filters.responsibleId)
              : undefined
          }
          onSearchChange={(value) => {
            setSearch(value)
            resetPage()
          }}
          onOpenFilters={() => setFiltersOpen(true)}
          onRemoveFilter={(key) => {
            setFilters((prev) => ({ ...prev, [key]: "" }))
            resetPage()
          }}
          actions={
            <Button
              type="button"
              onClick={handleOpenCreate}
              className="shrink-0"
            >
              <PlusIcon />
              Nuevo proyecto
            </Button>
          }
        />

        <DataTable
          isLoading={isLoading}
          isError={isError}
          errorMessage="No se pudieron cargar los proyectos."
          isEmpty={pagination.projectResponse.length === 0}
          emptyIcon={FolderKanbanIcon}
          emptyMessage={
            activeFilters > 0
              ? "No hay proyectos que coincidan con los filtros."
              : "Aún no hay proyectos registrados."
          }
          pagination={pagination}
          onPageChange={setPageNumber}
        >
          <ProjectsTable
            projects={pagination.projectResponse}
            usersMap={usersMap}
            onEdit={handleEdit}
          />
        </DataTable>
      </div>

      <ProjectsFiltersDrawer
        open={filtersOpen}
        filters={filters}
        onOpenChange={setFiltersOpen}
        onApply={(nextFilters) => {
          setFilters(nextFilters)
          resetPage()
        }}
      />

      <ProjectDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) {
            setEditingProject(null)
          }
        }}
        project={editingProject}
      />
    </div>
  )
}
