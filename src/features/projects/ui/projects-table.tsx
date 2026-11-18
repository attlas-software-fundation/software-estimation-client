"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/format"
import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_VARIANTS,
  PROJECT_TYPE_BY_VALUE,
  type Project,
} from "../types"
import { ProjectDeleteDialog } from "./project-delete-dialog"
import { ProjectStatusDialog } from "./project-status-dialog"
import { ProjectHistoryDialog } from "./project-history-dialog"
import { ProjectsRowActions } from "./projects-row-actions"

interface ProjectsTableProps {
  projects: Project[]
  usersMap: Map<string, string>
  onEdit?: (project: Project) => void
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

export const ProjectsTable = ({
  projects,
  usersMap,
  onEdit,
}: ProjectsTableProps) => {
  const [deletingProject, setDeletingProject] = useState<Project | null>(null)
  const [transitioningProject, setTransitioningProject] =
    useState<Project | null>(null)
  const [historyProject, setHistoryProject] = useState<Project | null>(null)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Responsable</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Fecha Inicio</TableHead>
          <TableHead>Fecha Fin</TableHead>
          <TableHead className="w-32 text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => {
          const typeInfo = PROJECT_TYPE_BY_VALUE[project.type]
          const TypeIcon = typeInfo.icon
          const responsibleName =
            usersMap.get(project.responsibleId) || "Sin asignar"

          return (
            <TableRow
              key={project.id}
              className="hover:bg-muted/50 transition-colors"
            >
              <TableCell className="font-medium">
                <Link
                  href={`/projects/${project.id}/backlog`}
                  className="hover:text-primary transition-colors hover:underline"
                >
                  {project.name}
                </Link>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <TypeIcon className={cn("size-4", typeInfo.color)} />
                  <span>{typeInfo.label}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar size="sm">
                    <AvatarFallback className="bg-primary text-xs font-medium text-blue-100">
                      {getInitials(responsibleName)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{responsibleName}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={PROJECT_STATUS_VARIANTS[project.status]}>
                  {PROJECT_STATUS_LABELS[project.status]}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(project.startDate)}</TableCell>
              <TableCell>{formatDate(project.plannedDate)}</TableCell>
              <TableCell>
                <ProjectsRowActions
                  project={project}
                  onEdit={onEdit}
                  onDelete={setDeletingProject}
                  onChangeStatus={setTransitioningProject}
                  onViewHistory={setHistoryProject}
                />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
      <ProjectDeleteDialog
        isOpen={deletingProject !== null}
        project={deletingProject}
        onClose={() => setDeletingProject(null)}
        onSuccess={() => setDeletingProject(null)}
      />
      <ProjectStatusDialog
        open={transitioningProject !== null}
        project={transitioningProject}
        onOpenChange={(open) => {
          if (!open) setTransitioningProject(null)
        }}
      />
      <ProjectHistoryDialog
        open={historyProject !== null}
        project={historyProject}
        onOpenChange={(open) => {
          if (!open) setHistoryProject(null)
        }}
      />
    </Table>
  )
}
