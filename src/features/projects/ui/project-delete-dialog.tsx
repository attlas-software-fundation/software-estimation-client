"use client"

import { AlertTriangleIcon, TrashIcon } from "lucide-react"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { toast } from "@/components/ui/toast"
import { getErrorMessage } from "@/lib/form-errors"
import { useProjects } from "../hooks/use-projects"
import { canDeleteProject } from "../utils/project-permissions"
import { PROJECT_STATUS_LABELS, toProjectStatus } from "../types/project-status"
import type { Project } from "../types/project-types"

type ProjectDeleteDialogProps = {
  project: Project | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

/** Datos locales que se eliminan junto al proyecto (localStorage). */
const LOCAL_DATA_WARNINGS = [
  "Backlog de historias y tareas",
  "Horas estimadas por tarea",
  "Story points asignados",
  "Configuración de sprints",
  "Configuración de riesgos",
  "Historial de reportes",
]

export const ProjectDeleteDialog = ({
  project,
  isOpen,
  onClose,
  onSuccess,
}: ProjectDeleteDialogProps) => {
  const { deleteProject, isDeleting } = useProjects()

  const status = project ? toProjectStatus(project.estado) : "borrador"
  const canDelete = canDeleteProject(status)
  const statusLabel = PROJECT_STATUS_LABELS[status] ?? status

  const handleConfirm = async () => {
    if (!project) return

    try {
      await deleteProject(project.id)
      toast.add({
        title: "Proyecto eliminado",
        description: `"${project.nombre}" se eliminó correctamente.`,
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

  // Proyecto en estado que no permite eliminación
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
        confirmVariant="default"
        onConfirm={onClose}
        description={
          <span>
            El proyecto{" "}
            <span className="text-foreground font-semibold">
              {project.nombre}
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

  // Confirmación de eliminación real
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
      isLoading={isDeleting}
      onConfirm={handleConfirm}
      description={
        <div className="flex flex-col gap-3">
          <p>
            ¿Seguro que quieres eliminar el proyecto{" "}
            <span className="text-foreground font-semibold">
              {project?.nombre}
            </span>
            ? Esta acción{" "}
            <span className="font-semibold">no se puede deshacer</span>.
          </p>
          <div className="bg-destructive/10 rounded-md p-3">
            <p className="text-destructive mb-2 text-sm font-medium">
              También se eliminarán los datos locales:
            </p>
            <ul className="text-muted-foreground space-y-0.5 text-sm">
              {LOCAL_DATA_WARNINGS.map((item) => (
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
