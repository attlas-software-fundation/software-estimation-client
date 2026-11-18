"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Project } from "../types"
import { ProjectForm } from "./project-form"

type ProjectDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: Project | null
}

export const ProjectDialog = ({
  open,
  onOpenChange,
  project,
}: ProjectDialogProps) => {
  const isEditing = Boolean(project)

  if (!open) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[680px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar proyecto" : "Registrar nuevo proyecto"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos generales, responsable y estado del proyecto."
              : "Completa los datos para registrar un nuevo proyecto en estado Borrador."}
          </DialogDescription>
        </DialogHeader>
        <ProjectForm
          project={project ?? null}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
