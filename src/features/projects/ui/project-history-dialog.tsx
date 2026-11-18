"use client"

import { HistoryIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProjectHistoryView } from "./project-history-view"
import type { Project } from "../types"

type ProjectHistoryDialogProps = {
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const ProjectHistoryDialog = ({
  project,
  open,
  onOpenChange,
}: ProjectHistoryDialogProps) => {
  if (!project) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-full">
              <HistoryIcon className="size-4" />
            </div>
            <div>
              <DialogTitle>Historial de cambios de estado</DialogTitle>
              <DialogDescription>
                Registro cronológico de transiciones para{" "}
                <span className="text-foreground font-semibold">
                  {project.name}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-2">
          <ProjectHistoryView projectId={project.id} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
