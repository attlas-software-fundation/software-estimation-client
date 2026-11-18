import { useMutation, useQueryClient } from "@tanstack/react-query"
import { invalidateProjectCosts } from "@/features/costs/hooks/query-keys"
import { invalidateReportQueries } from "@/features/reports/hooks/query-keys"
import { profilesService } from "../services/profiles-service"
import type { ToggleProfileStatusPayload } from "../types"
import { PROFILES_QUERY_KEY } from "./use-profiles"

export const useUpdateProfileStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ToggleProfileStatusPayload) =>
      profilesService.updateProfileStatus(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILES_QUERY_KEY })
      invalidateProjectCosts(queryClient)
      invalidateReportQueries(queryClient)
    },
  })
}
