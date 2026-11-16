import { useMutation, useQueryClient } from "@tanstack/react-query"
import { invalidateProjectCosts } from "@/features/costs/hooks/query-keys"
import { invalidateReportQueries } from "@/features/reports/hooks/query-keys"
import { profilesService } from "../services/profiles-service"
import type { UpdateCerRequest } from "../types"
import { PROFILES_QUERY_KEY } from "./use-profiles"

export const useUpdateProfileCer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateCerRequest & { id: string }) =>
      profilesService.updateProfileCer(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILES_QUERY_KEY })
      invalidateProjectCosts(queryClient)
      invalidateReportQueries(queryClient)
    },
  })
}
