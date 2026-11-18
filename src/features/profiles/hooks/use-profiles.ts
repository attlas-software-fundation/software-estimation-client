import { useQuery } from "@tanstack/react-query"
import type { QueryRequest } from "@/types/api"
import { profilesService } from "../services/profiles-service"
import type { ProfileSearchResponse } from "../types"

export const PROFILES_QUERY_KEY = ["profiles"] as const

export const profileQueryKeys = {
  all: PROFILES_QUERY_KEY,
  list: (query: QueryRequest) => ["profiles", query] as const,
  detail: (id: string) => ["profiles", id] as const,
}

export const useProfiles = (query: QueryRequest) => {
  return useQuery<ProfileSearchResponse>({
    queryKey: profileQueryKeys.list(query),
    queryFn: () => profilesService.getProfiles(query),
    placeholderData: (previousData) => previousData,
  })
}
