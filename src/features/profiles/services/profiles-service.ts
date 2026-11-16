import { apiClient } from "@/lib/api"
import type { PaginatedResponse, QueryRequest } from "@/types/api"
import type {
  CreateTechnicalProfileRequest,
  Profile,
  ProfileSearchResponse,
  TechnicalProfileResponse,
  ToggleProfileStatusPayload,
  UpdateCerRequest,
  UpdateProfilePayload,
} from "../types"
import { technicalRoleToApi, toProfile } from "../types"

const searchProfiles = (query?: QueryRequest) => {
  const transformedQuery: QueryRequest = query
    ? {
        ...query,
        filters: query.filters.map((filter) => {
          if (filter.key === "role" && filter.values.length > 0) {
            return {
              ...filter,
              values: filter.values.map(
                (v) => technicalRoleToApi[v] ?? v.toUpperCase()
              ),
            }
          }
          return filter
        }),
      }
    : {
        filters: [],
        pagination: {
          pageNumber: 0,
          pageSize: 20,
          orderBy: "createdAt",
          sortDirection: "DESC",
        },
      }

  return apiClient.post<ProfileSearchResponse>(
    "/api/v1/profiles/search",
    transformedQuery
  )
}

const getProfiles = async (
  query?: QueryRequest
): Promise<PaginatedResponse<Profile, "profilesResponse">> => {
  const response = await searchProfiles(query)
  const items =
    response.technicalProfileResponse ?? response.profilesResponse ?? []
  const profiles = items.map((item) => toProfile(item))

  return {
    profilesResponse: profiles,
    pageNumber: response.pageNumber,
    pageSize: response.pageSize,
    totalElements: response.totalElements,
    totalPages: response.totalPages,
    hasNext: response.hasNext,
    hasPrevious: response.hasPrevious,
  }
}

const getActiveProfiles = async (): Promise<Profile[]> => {
  const response = await searchProfiles({
    filters: [
      {
        key: "isActive",
        operator: "EQ",
        values: ["true"],
      },
    ],
    pagination: {
      pageNumber: 0,
      pageSize: 100,
      orderBy: "name",
      sortDirection: "ASC",
    },
  })

  const items =
    response.technicalProfileResponse ?? response.profilesResponse ?? []
  return items.map((item) => toProfile(item)).filter((p) => p.isActive)
}

const getProfile = async (id: string): Promise<Profile> => {
  const response = await apiClient.get<TechnicalProfileResponse>(
    `/api/v1/profiles/${id}`
  )
  return toProfile(response)
}

const createProfile = async (
  input: CreateTechnicalProfileRequest
): Promise<Profile> => {
  const response = await apiClient.post<TechnicalProfileResponse>(
    "/api/v1/profiles",
    input
  )
  return toProfile(response)
}

const updateProfile = async ({
  id,
  ...body
}: UpdateProfilePayload): Promise<Profile> => {
  const response = await apiClient.put<TechnicalProfileResponse>(
    `/api/v1/profiles/${id}`,
    body
  )
  return toProfile(response)
}

const updateProfileCer = async (
  id: string,
  payload: UpdateCerRequest
): Promise<Profile> => {
  const response = await apiClient.patch<TechnicalProfileResponse>(
    `/api/v1/profiles/${id}/cer`,
    payload
  )
  return toProfile(response)
}

const deleteProfile = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/v1/profiles/${id}`)
}

const updateProfileStatus = async ({
  id,
  isActive,
}: ToggleProfileStatusPayload): Promise<Profile> => {
  const response = await apiClient.patch<TechnicalProfileResponse>(
    `/api/v1/profiles/${id}/status`,
    { isActive }
  )
  return toProfile(response)
}

export const profilesService = {
  searchProfiles,
  getProfiles,
  getActiveProfiles,
  getProfile,
  createProfile,
  updateProfile,
  updateProfileCer,
  deleteProfile,
  updateProfileStatus,
}
