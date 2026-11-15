"use client"

import { useState } from "react"
import { ArrowRightLeftIcon, HistoryIcon, InfoIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_VARIANTS,
} from "../types/project-status"
import { useProjectAccess } from "../hooks/use-project-access"
import { ProjectStatusDialog } from "./project-status-dialog"
import { ProjectHistoryDialog } from "./project-history-dialog"

type ProjectStatusBannerProps = {
  projectId: string
}

export const ProjectStatusBanner = ({
  projectId,
}: ProjectStatusBannerProps) => {
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false)
  const access = useProjectAccess(projectId)

  if (access.isLoading || !access.project) {
    return null
  }

  const canChangeStatus = access.allowedTransitions.length > 0

  return (
    <>
      <Alert className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <InfoIcon className="mt-0.5 size-4 shrink-0" />
          <div className="flex flex-col gap-1">
            <AlertTitle className="flex items-center gap-2">
              Estado
              <Badge variant={PROJECT_STATUS_VARIANTS[access.status]}>
                {PROJECT_STATUS_LABELS[access.status]}
              </Badge>
            </AlertTitle>
            <AlertDescription>{access.hint}</AlertDescription>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsHistoryDialogOpen(true)}
          >
            <HistoryIcon className="mr-1.5 size-3.5" />
            Historial
          </Button>

          {canChangeStatus ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsStatusDialogOpen(true)}
            >
              <ArrowRightLeftIcon className="mr-1.5 size-3.5" />
              Cambiar estado
            </Button>
          ) : null}
        </div>
      </Alert>

      <ProjectStatusDialog
        project={access.project}
        open={isStatusDialogOpen}
        onOpenChange={setIsStatusDialogOpen}
      />

      <ProjectHistoryDialog
        project={access.project}
        open={isHistoryDialogOpen}
        onOpenChange={setIsHistoryDialogOpen}
      />
    </>
  )
}
