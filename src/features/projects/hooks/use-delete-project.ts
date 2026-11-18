import { useMutation, useQueryClient } from "@tanstack/react-query"
import { invalidateReportQueries } from "@/features/reports/hooks/query-keys"
import { projectService } from "../services/project-service"
import { projectQueryKeys } from "./use-projects"

export const useDeleteProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: projectService.deleteProject,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectQueryKeys.all })
      invalidateReportQueries(queryClient)
    },
  })
}
