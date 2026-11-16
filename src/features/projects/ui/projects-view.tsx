"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { FolderKanbanIcon, PlusIcon } from "lucide-react"

import { DataTable } from "@/components/data-table"
import { buttonVariants } from "@/components/ui/button"

import { useDebounce, usePagination } from "@/hooks"
import { TABLE_PAGE_SIZE } from "@/lib/pagination"
import { useUsers } from "@/features/users/hooks/use-users"
import { getFullName } from "@/features/auth/types"

import {
  FilterOperator,
  type FilterRequest,
  type QueryRequest,
} from "@/types/api"

import { useProjects } from "../hooks/use-projects"
import type { ProjectFilters, ProjectSearchResponse } from "../types"
import {
  projectStatusToApi,
  projectTypeToApi,
  toProject,
} from "../types/project-response"

import { ProjectsTable } from "./projects-table"
import { ProjectToolbar } from "./project-toolbar"
import { ProjectsFiltersDrawer } from "./projects-filters-drawer"

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
    nombre: "",
    tipo: "",
    responsable: "",
    estado: "",
    fecha_inicio: "",
    fecha_fin: "",
  })

  const [filtersOpen, setFiltersOpen] = useState(false)

  const { data: usersData } = useUsers({
    filters: [],
    pagination: {
      orderBy: "createdAt",
      pageSize: 1000,
      pageNumber: 0,
      sortDirection: "ASC",
    },
  })

  const usersMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const user of usersData?.userResponse ?? []) {
      map.set(user.id, getFullName(user))
    }
    return map
  }, [usersData])

  const activeFilters =
    (search.length > 0 ? 1 : 0) +
    (filters.nombre.length > 0 ? 1 : 0) +
    (filters.tipo.length > 0 ? 1 : 0) +
    (filters.responsable.length > 0 ? 1 : 0) +
    (filters.estado.length > 0 ? 1 : 0) +
    (filters.fecha_inicio.length > 0 ? 1 : 0) +
    (filters.fecha_fin.length > 0 ? 1 : 0)

  const apiFilters: FilterRequest[] = []

  if (debouncedSearch.trim().length > 0) {
    apiFilters.push({
      key: "search",
      operator: FilterOperator.LK,
      values: [debouncedSearch.trim()],
    })
  }

  if (filters.nombre.trim().length > 0) {
    apiFilters.push({
      key: "name",
      operator: FilterOperator.LK,
      values: [filters.nombre.trim()],
    })
  }

  if (filters.tipo) {
    const apiType = projectTypeToApi[filters.tipo] ?? filters.tipo.toUpperCase()
    apiFilters.push({
      key: "type",
      operator: FilterOperator.EQ,
      values: [apiType],
    })
  }

  if (filters.responsable) {
    apiFilters.push({
      key: "responsibleId",
      operator: FilterOperator.EQ,
      values: [filters.responsable],
    })
  }

  if (filters.estado) {
    const apiStatus =
      projectStatusToApi[filters.estado] ?? filters.estado.toUpperCase()
    apiFilters.push({
      key: "status",
      operator: FilterOperator.EQ,
      values: [apiStatus],
    })
  }

  if (filters.fecha_inicio) {
    const dateValue = filters.fecha_inicio.includes("T")
      ? filters.fecha_inicio.split("T")[0]
      : filters.fecha_inicio
    apiFilters.push({
      key: "startDate",
      operator: FilterOperator.GE,
      values: [dateValue],
    })
  }

  if (filters.fecha_fin) {
    const dateValue = filters.fecha_fin.includes("T")
      ? filters.fecha_fin.split("T")[0]
      : filters.fecha_fin
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

  const pagination = data ?? emptyPage

  const projects = useMemo(() => {
    return (pagination.projectResponse ?? []).map((project) =>
      toProject(project, usersMap.get(project.responsibleId))
    )
  }, [pagination.projectResponse, usersMap])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <ProjectToolbar
          search={search}
          activeFilters={activeFilters}
          filters={filters}
          responsibleLabel={
            filters.responsable ? usersMap.get(filters.responsable) : undefined
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
            <Link
              href="/projects/new"
              className={buttonVariants({ className: "shrink-0" })}
            >
              <PlusIcon />
              Nuevo proyecto
            </Link>
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
          <ProjectsTable projects={projects} />
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
    </div>
  )
}
