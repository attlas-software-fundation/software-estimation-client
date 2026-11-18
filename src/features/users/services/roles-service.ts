import { apiClient } from "@/lib/api"
import type { RoleResponse } from "@/features/auth/types"

const getRoles = async (activeOnly = true): Promise<RoleResponse[]> => {
  const query = activeOnly ? "?activeOnly=true" : ""
  return apiClient.get<RoleResponse[]>(`/api/v1/roles${query}`)
}

export const rolesService = {
  getRoles,
}
