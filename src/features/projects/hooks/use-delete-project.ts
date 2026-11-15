import { useMutation, useQueryClient } from "@tanstack/react-query"
import { projectService } from "../services/project-service"
import { projectQueryKeys } from "./use-projects"
import { invalidateReportQueries } from "@/features/reports/hooks/query-keys"

export const useDeleteProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => projectService.deleteProject(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectQueryKeys.all })
      invalidateReportQueries(queryClient)
    },
  })
}
