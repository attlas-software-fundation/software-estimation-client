"use client"

import { useState } from "react"
import {
  ArrowRightIcon,
  ArrowRightLeftIcon,
  CheckCircle2Icon,
  Loader2Icon,
  AlertCircleIcon,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import { getErrorMessage } from "@/lib/form-errors"

import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_VARIANTS,
  toProjectStatus,
  type ProjectStatus,
} from "../types/project-status"
import {
  getAllowedTransitions,
  getProjectStatusHint,
} from "../utils/project-permissions"
import { projectStatusToApi } from "../types/project-response"
import { useUpdateProjectStatus } from "../hooks/use-update-project-status"
import type { Project } from "../types/project-types"

type ProjectStatusDialogProps = {
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export const ProjectStatusDialog = ({
  project,
  open,
  onOpenChange,
  onSuccess,
}: ProjectStatusDialogProps) => {
  const updateStatus = useUpdateProjectStatus()

  const currentStatus = project
    ? toProjectStatus(project.status ?? project.estado ?? "borrador")
    : "borrador"

  const allowedTransitions = getAllowedTransitions(currentStatus)

  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | null>(
    null
  )

  const effectiveStatus =
    selectedStatus && allowedTransitions.includes(selectedStatus)
      ? selectedStatus
      : (allowedTransitions[0] ?? null)

  if (!project) {
    return null
  }

  const handleConfirm = async () => {
    if (!effectiveStatus) return

    const apiStatus =
      projectStatusToApi[effectiveStatus] ?? effectiveStatus.toUpperCase()

    try {
      await updateStatus.mutateAsync({
        id: project.id,
        status: apiStatus,
        estado: apiStatus,
      })

      toast.add({
        title: "Estado actualizado",
        description: `"${project.name || project.nombre}" pasó a estado ${PROJECT_STATUS_LABELS[effectiveStatus]}.`,
        type: "success",
      })

      setSelectedStatus(null)
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      toast.add({
        title: "No se pudo cambiar el estado",
        description: getErrorMessage(
          error,
          "Ocurrió un error al actualizar el estado del proyecto."
        ),
        type: "error",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-full">
              <ArrowRightLeftIcon className="size-4" />
            </div>
            <div>
              <DialogTitle>Transición de estado</DialogTitle>
              <DialogDescription>
                Proyecto:{" "}
                <span className="text-foreground font-semibold">
                  {project.name || project.nombre}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Estado actual */}
          <div className="bg-muted/30 flex flex-col gap-1.5 rounded-lg border p-3">
            <span className="text-muted-foreground text-xs font-medium">
              Estado actual
            </span>
            <div className="flex items-center gap-2">
              <Badge variant={PROJECT_STATUS_VARIANTS[currentStatus]}>
                {PROJECT_STATUS_LABELS[currentStatus]}
              </Badge>
              <span className="text-muted-foreground text-xs">
                {getProjectStatusHint(currentStatus)}
              </span>
            </div>
          </div>

          {/* Opciones de transición */}
          {allowedTransitions.length === 0 ? (
            <div className="border-muted bg-muted/40 text-muted-foreground flex items-start gap-2 rounded-lg border p-3 text-sm">
              <AlertCircleIcon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
              <span>
                Este proyecto se encuentra en estado{" "}
                <strong className="text-foreground">
                  {PROJECT_STATUS_LABELS[currentStatus]}
                </strong>{" "}
                y no admite más transiciones de estado.
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Selecciona el nuevo estado
              </label>

              <div className="space-y-2">
                {allowedTransitions.map((status) => {
                  const isSelected = effectiveStatus === status
                  return (
                    <button
                      key={status}
                      type="button"
                      disabled={updateStatus.isPending}
                      onClick={() => setSelectedStatus(status)}
                      className={cn(
                        "flex w-full items-start justify-between rounded-lg border p-3 text-left transition-all",
                        isSelected
                          ? "border-primary bg-primary/5 ring-primary shadow-xs ring-1"
                          : "border-border hover:border-muted-foreground/30 hover:bg-muted/30"
                      )}
                    >
                      <div className="flex flex-col gap-1 pr-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={PROJECT_STATUS_VARIANTS[status]}>
                            {PROJECT_STATUS_LABELS[status]}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          {getProjectStatusHint(status)}
                        </p>
                      </div>

                      {isSelected ? (
                        <CheckCircle2Icon className="text-primary mt-0.5 size-4 shrink-0" />
                      ) : null}
                    </button>
                  )
                })}
              </div>

              {/* Vista previa de transición */}
              {effectiveStatus ? (
                <div className="text-muted-foreground mt-3 flex items-center justify-center gap-2 rounded-md border border-dashed py-2 text-xs">
                  <span>{PROJECT_STATUS_LABELS[currentStatus]}</span>
                  <ArrowRightIcon className="text-primary size-3.5" />
                  <span className="text-foreground font-semibold">
                    {PROJECT_STATUS_LABELS[effectiveStatus]}
                  </span>
                </div>
              ) : null}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            disabled={updateStatus.isPending}
            onClick={() => onOpenChange(false)}
          >
            {allowedTransitions.length === 0 ? "Cerrar" : "Cancelar"}
          </Button>

          {allowedTransitions.length > 0 ? (
            <Button
              type="button"
              disabled={!effectiveStatus || updateStatus.isPending}
              onClick={handleConfirm}
            >
              {updateStatus.isPending ? (
                <>
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                "Cambiar estado"
              )}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
