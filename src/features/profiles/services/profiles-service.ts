import { apiClient } from "@/lib/api"
import type { PaginatedResponse, QueryRequest } from "@/types/api"
import type {
  CreateProfilePayload,
  CreateTechnicalProfileRequest,
  Profile,
  ProfileSearchResponse,
  TechnicalProfileResponse,
  ToggleProfileStatusPayload,
  UpdateCerRequest,
  UpdateProfilePayload,
  UpdateTechnicalProfileRequest,
} from "../types"
import { experienceLevelToApi, technicalRoleToApi, toProfile } from "../types"

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
  payload: CreateProfilePayload
): Promise<Profile> => {
  const body: CreateTechnicalProfileRequest = {
    name: payload.name.trim(),
    email: payload.email.trim(),
    role: technicalRoleToApi[payload.role] ?? "OTHER",
    experienceLevel: experienceLevelToApi[payload.experienceLevel] ?? "MID",
    hourlyRate: payload.hourlyRate,
    currency: "PEN",
    isActive: payload.isActive,
  }
  const response = await apiClient.post<TechnicalProfileResponse>(
    "/api/v1/profiles",
    body
  )
  return toProfile(response)
}

const updateProfile = async (
  payload: UpdateProfilePayload
): Promise<Profile> => {
  const body: UpdateTechnicalProfileRequest = {
    name: payload.name?.trim(),
    email: payload.email?.trim(),
    role: payload.role ? technicalRoleToApi[payload.role] : undefined,
    experienceLevel: payload.experienceLevel
      ? experienceLevelToApi[payload.experienceLevel]
      : undefined,
    hourlyRate: payload.hourlyRate,
    currency: payload.currency || "PEN",
    isActive: payload.isActive,
  }
  const response = await apiClient.put<TechnicalProfileResponse>(
    `/api/v1/profiles/${payload.id}`,
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
    {
      hourlyRate: payload.hourlyRate,
      currency: payload.currency || "PEN",
    }
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
