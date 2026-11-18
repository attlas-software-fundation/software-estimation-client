"use client"

import { AlertTriangleIcon, CheckIcon, TrashIcon } from "lucide-react"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { toast } from "@/components/ui/toast"
import { getErrorMessage } from "@/lib/form-errors"
import { useDeleteProject } from "../hooks/use-delete-project"
import { canDeleteProject } from "../utils/project-permissions"
import { PROJECT_STATUS_LABELS } from "../types/project-status"
import type { Project } from "../types"

type ProjectDeleteDialogProps = {
  project: Project | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const ASSOCIATED_DATA_WARNINGS = [
  "Backlog de historias y tareas",
  "Horas estimadas por tarea",
  "Story points asignados",
  "Configuración de sprints",
  "Configuración de riesgos",
  "Historial de estimaciones y reportes",
]

export const ProjectDeleteDialog = ({
  project,
  isOpen,
  onClose,
  onSuccess,
}: ProjectDeleteDialogProps) => {
  const deleteProject = useDeleteProject()

  const status = project ? project.status : "DRAFT"
  const canDelete = canDeleteProject(status)
  const statusLabel = PROJECT_STATUS_LABELS[status]

  const handleConfirm = async () => {
    if (!project) return

    try {
      await deleteProject.mutateAsync(project.id)
      toast.add({
        title: "Proyecto eliminado",
        description: `"${project.name}" se eliminó correctamente.`,
        type: "success",
      })
      onClose()
      onSuccess()
    } catch (error) {
      toast.add({
        title: "No se pudo eliminar el proyecto",
        description: getErrorMessage(error, "Inténtalo de nuevo."),
        type: "error",
      })
    }
  }

  if (project && !canDelete) {
    return (
      <ConfirmDialog
        open={isOpen && Boolean(project)}
        onOpenChange={(open) => {
          if (!open) onClose()
        }}
        title="No se puede eliminar"
        icon={<AlertTriangleIcon className="size-6" />}
        tone="warning"
        confirmText="Entendido"
        confirmIcon={<CheckIcon />}
        confirmVariant="default"
        onConfirm={onClose}
        description={
          <span>
            El proyecto{" "}
            <span className="text-foreground font-semibold">
              {project.name}
            </span>{" "}
            está en estado <span className="font-semibold">{statusLabel}</span>.
            Solo se pueden eliminar proyectos en estado{" "}
            <span className="font-semibold">Borrador</span> o{" "}
            <span className="font-semibold">Rechazado</span>.
          </span>
        }
      />
    )
  }

  return (
    <ConfirmDialog
      open={isOpen && Boolean(project)}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      title="Eliminar proyecto"
      icon={<TrashIcon className="size-6" />}
      tone="destructive"
      confirmText="Eliminar proyecto"
      confirmLoadingText="Eliminando..."
      confirmIcon={<TrashIcon />}
      confirmVariant="destructive"
      isLoading={deleteProject.isPending}
      onConfirm={handleConfirm}
      description={
        <div className="flex flex-col gap-3">
          <p>
            ¿Seguro que quieres eliminar el proyecto{" "}
            <span className="text-foreground font-semibold">
              {project?.name}
            </span>
            ? Esta acción{" "}
            <span className="font-semibold">no se puede deshacer</span>.
          </p>
          <div className="bg-destructive/10 rounded-md p-3">
            <p className="text-destructive mb-2 text-sm font-medium">
              También se eliminará la información asociada:
            </p>
            <ul className="text-muted-foreground space-y-0.5 text-sm">
              {ASSOCIATED_DATA_WARNINGS.map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <span className="text-destructive">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      }
    />
  )
}
