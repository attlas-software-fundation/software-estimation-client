import { useMutation, useQueryClient } from "@tanstack/react-query"
import { invalidateProjectCosts } from "@/features/costs/hooks/query-keys"
import { invalidateReportQueries } from "@/features/reports/hooks/query-keys"
import { profilesService } from "../services/profiles-service"
import type { UpdateProfilePayload } from "../types"
import { PROFILES_QUERY_KEY } from "./use-profiles"

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      profilesService.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILES_QUERY_KEY })
      invalidateReportQueries(queryClient)
      return invalidateProjectCosts(queryClient)
    },
  })
}
