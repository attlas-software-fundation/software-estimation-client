import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { projectQueryKeys } from "@/features/projects/hooks/use-projects"
import { reportsService } from "../services/reports-service"
import { downloadBlob } from "../utils/download-blob"
import { REPORTS_QUERY_KEY, invalidateReportQueries } from "./query-keys"

export const useLatestEstimate = (projectId: string) => {
  return useQuery({
    queryKey: [...REPORTS_QUERY_KEY, "latest", projectId],
    queryFn: () => reportsService.getEstimationSummary(projectId),
    enabled: Boolean(projectId),
    staleTime: 0,
    refetchOnMount: "always",
  })
}

export const useReportsHistory = (projectId: string) => {
  return useQuery({
    queryKey: [...REPORTS_QUERY_KEY, "history", projectId],
    queryFn: () => reportsService.getEstimations(projectId),
    enabled: Boolean(projectId),
    staleTime: 0,
    refetchOnMount: "always",
  })
}

export const useSaveReportSnapshot = (projectId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => reportsService.createEstimation(projectId),
    onSuccess: () => {
      invalidateReportQueries(queryClient)
      void queryClient.invalidateQueries({
        queryKey: projectQueryKeys.detail(projectId),
      })
      void queryClient.invalidateQueries({
        queryKey: projectQueryKeys.all,
      })
    },
  })
}

const pdfFileName = (projectName: string) => {
  const cleaned = projectName
    .trim()
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, " ")
  return `${cleaned.length > 0 ? cleaned : "reporte"}.pdf`
}

export const useExportProjectReportPdf = (
  projectId: string,
  projectName: string
) => {
  return useMutation({
    mutationFn: async (estimationId?: string) => {
      let targetEstimationId = estimationId
      if (!targetEstimationId) {
        const created = await reportsService.createEstimation(projectId)
        if (!created.id) {
          throw new Error("No se pudo registrar la estimación para exportar.")
        }
        targetEstimationId = created.id
      }

      await reportsService.generateEstimationPdf(projectId, targetEstimationId)
      const blob = await reportsService.downloadEstimationPdf(
        projectId,
        targetEstimationId
      )
      downloadBlob(blob, pdfFileName(projectName))
    },
  })
}
