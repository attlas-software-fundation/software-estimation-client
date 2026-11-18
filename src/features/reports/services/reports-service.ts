import { apiClient, apiFetchBlob } from "@/lib/api"
import type { FileAttachmentResponse } from "@/features/auth/types"
import type { ProjectEstimationResponse } from "@/features/projects/types"
import type { ReportSnapshotDetailResponse } from "../types"

export const reportsService = {
  getEstimationSummary: (projectId: string) =>
    apiClient.get<ReportSnapshotDetailResponse>(
      `/api/v1/projects/${projectId}/estimation-summary`
    ),

  getEstimations: (projectId: string) =>
    apiClient.get<ProjectEstimationResponse[]>(
      `/api/v1/projects/${projectId}/estimations`
    ),

  getEstimation: (projectId: string, estimationId: string) =>
    apiClient.get<ReportSnapshotDetailResponse>(
      `/api/v1/projects/${projectId}/estimations/${estimationId}`
    ),

  createEstimation: (projectId: string) =>
    apiClient.post<ReportSnapshotDetailResponse>(
      `/api/v1/projects/${projectId}/estimations`
    ),

  generateEstimationPdf: (projectId: string, estimationId: string) =>
    apiClient.post<FileAttachmentResponse>(
      `/api/v1/reports/projects/${projectId}/estimations/${estimationId}/pdf`
    ),

  downloadEstimationPdf: (projectId: string, estimationId: string) =>
    apiFetchBlob(
      `/api/v1/reports/projects/${projectId}/estimations/${estimationId}/pdf`
    ),

  downloadProjectsExcel: () => apiFetchBlob("/api/v1/reports/projects/excel"),
}
