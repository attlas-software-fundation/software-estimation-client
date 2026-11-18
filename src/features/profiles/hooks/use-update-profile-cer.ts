import { useMutation, useQueryClient } from "@tanstack/react-query"
import { invalidateProjectCosts } from "@/features/costs/hooks/query-keys"
import { invalidateReportQueries } from "@/features/reports/hooks/query-keys"
import { profilesService } from "../services/profiles-service"
import type { UpdateCerPayload } from "../types"
import { PROFILES_QUERY_KEY } from "./use-profiles"

export const useUpdateProfileCer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateCerPayload) =>
      profilesService.updateProfileCer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILES_QUERY_KEY })
      void invalidateProjectCosts(queryClient)
      invalidateReportQueries(queryClient)
    },
  })
}
