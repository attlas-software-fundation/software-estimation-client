"use client"

import Link from "next/link"
import {
  ArrowRightLeftIcon,
  FolderKanbanIcon,
  HistoryIcon,
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { Project } from "../types/project-types"

type ProjectsRowActionsProps = {
  project: Project
  onDelete: (project: Project) => void
  onChangeStatus?: (project: Project) => void
  onViewHistory?: (project: Project) => void
}

export const ProjectsRowActions = ({
  project,
  onDelete,
  onChangeStatus,
  onViewHistory,
}: ProjectsRowActionsProps) => {
  return (
    <div className="flex items-center justify-end gap-1">
      <Tooltip>
        <TooltipTrigger
          render={
            <Link
              href={`/projects/${project.id}/backlog`}
              className={buttonVariants({
                variant: "ghost",
                size: "icon-sm",
              })}
            />
          }
        >
          <FolderKanbanIcon />
          <span className="sr-only">Gestionar proyecto</span>
        </TooltipTrigger>
        <TooltipContent>Gestionar proyecto</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger
          render={
            <Link
              href={`/projects/${project.id}/edit`}
              className={buttonVariants({
                variant: "ghost",
                size: "icon-sm",
              })}
            />
          }
        >
          <PencilIcon />
          <span className="sr-only">Editar proyecto</span>
        </TooltipTrigger>
        <TooltipContent>Editar proyecto</TooltipContent>
      </Tooltip>

      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger
            render={
              <DropdownMenuTrigger
                className={buttonVariants({
                  variant: "ghost",
                  size: "icon-sm",
                })}
                aria-label="Más acciones"
              />
            }
          >
            <MoreHorizontalIcon />
            <span className="sr-only">Más acciones</span>
          </TooltipTrigger>
          <TooltipContent>Más acciones</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end" className="min-w-48">
          {onChangeStatus ? (
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onChangeStatus(project)
              }}
            >
              <ArrowRightLeftIcon />
              Cambiar estado
            </DropdownMenuItem>
          ) : null}
          {onViewHistory ? (
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onViewHistory(project)
              }}
            >
              <HistoryIcon />
              Historial de estados
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(project)
            }}
          >
            <TrashIcon />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
