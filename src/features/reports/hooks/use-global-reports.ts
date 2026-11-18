import { useMutation } from "@tanstack/react-query"
import { reportsService } from "../services/reports-service"
import { downloadBlob } from "../utils/download-blob"

export const useExportProjectsExcel = () => {
  return useMutation({
    mutationFn: async () => {
      const blob = await reportsService.downloadProjectsExcel()
      downloadBlob(blob, "proyectos.xlsx")
    },
  })
}
