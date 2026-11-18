"use client"

import { type ReactNode } from "react"
import { FilterIcon, SearchIcon, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatDate } from "@/lib/format"
import {
  PROJECT_STATUS_LABELS,
  PROJECT_TYPE_LABELS,
  type ProjectFilters,
  type ProjectStatus,
  type ProjectType,
} from "../types"

type ProjectToolbarProps = {
  search: string
  activeFilters: number
  filters: ProjectFilters
  responsibleLabel?: string
  onSearchChange: (search: string) => void
  onOpenFilters: () => void
  onRemoveFilter: (key: keyof ProjectFilters) => void
  actions?: ReactNode
}

export const ProjectToolbar = ({
  search,
  activeFilters,
  filters,
  responsibleLabel,
  onSearchChange,
  onOpenFilters,
  onRemoveFilter,
  actions,
}: ProjectToolbarProps) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex w-full items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />

          <Input
            value={search}
            placeholder="Buscar por nombre o descripción"
            className="w-full pl-8"
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>

        <Button
          type="button"
          variant="outline"
          className="shrink-0"
          onClick={onOpenFilters}
        >
          <FilterIcon className="mr-2 h-4 w-4" />
          <span>Filtros</span>

          {activeFilters > 0 && (
            <Badge variant="secondary" size="sm" className="ml-2">
              {activeFilters}
            </Badge>
          )}
        </Button>

        {actions}
      </div>

      {activeFilters > (search ? 1 : 0) && (
        <div className="flex flex-wrap items-center gap-2">
          {filters.name && (
            <Badge
              variant="outline"
              className="bg-primary/5 text-primary gap-1 px-2 py-1"
            >
              Nombre: {filters.name}
              <button
                onClick={() => onRemoveFilter("name")}
                className="text-primary hover:text-primary/80"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}
          {filters.type && (
            <Badge
              variant="outline"
              className="gap-1 border-blue-200 bg-blue-50 px-2 py-1 text-blue-700"
            >
              Tipo: {PROJECT_TYPE_LABELS[filters.type as ProjectType]}
              <button
                onClick={() => onRemoveFilter("type")}
                className="text-blue-700 hover:text-blue-900"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}
          {filters.responsibleId && (
            <Badge
              variant="outline"
              className="gap-1 border-purple-200 bg-purple-50 px-2 py-1 text-purple-700"
            >
              Responsable: {responsibleLabel || filters.responsibleId}
              <button
                onClick={() => onRemoveFilter("responsibleId")}
                className="text-purple-700 hover:text-purple-900"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}
          {filters.status && (
            <Badge
              variant="outline"
              className="gap-1 border-amber-200 bg-amber-50 px-2 py-1 text-amber-700"
            >
              Estado: {PROJECT_STATUS_LABELS[filters.status as ProjectStatus]}
              <button
                onClick={() => onRemoveFilter("status")}
                className="text-amber-700 hover:text-amber-900"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}
          {filters.startDate && (
            <Badge
              variant="outline"
              className="bg-primary/5 text-primary gap-1 px-2 py-1"
            >
              Inicio: {formatDate(filters.startDate)}
              <button
                onClick={() => onRemoveFilter("startDate")}
                className="text-primary hover:text-primary/80"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}
          {filters.plannedDate && (
            <Badge
              variant="outline"
              className="bg-primary/5 text-primary gap-1 px-2 py-1"
            >
              Entrega: {formatDate(filters.plannedDate)}
              <button
                onClick={() => onRemoveFilter("plannedDate")}
                className="text-primary hover:text-primary/80"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
