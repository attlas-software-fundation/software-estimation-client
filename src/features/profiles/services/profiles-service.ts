import { apiClient } from "@/lib/api"
import type { PaginatedResponse, QueryRequest } from "@/types/api"
import { CURRENCY_CODE } from "@/lib/format"
import { readJson, STORAGE_KEYS, writeJson } from "@/lib/storage"
import type {
  CreateProfilePayload,
  Profile,
  ProfileSearchResponse,
  TechnicalProfileResponse,
  UpdateProfilePayload,
  UpdateProfileStatus,
} from "../types"
import { technicalRoleToApi, toProfile } from "../types"

const PROFILES_STORAGE_KEY = STORAGE_KEYS.PROFILES
const SIMULATED_DELAY_MS = 250

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

const getStoredProfiles = (): Profile[] => {
  const data = readJson<Profile[]>(PROFILES_STORAGE_KEY)
  if (!Array.isArray(data)) {
    return []
  }
  return data.map((profile) => ({
    ...profile,
    email: typeof profile.email === "string" ? profile.email : "",
    hourlyRate: typeof profile.hourlyRate === "number" ? profile.hourlyRate : 0,
    currency: CURRENCY_CODE,
    isActive: profile.isActive === false ? false : true,
  }))
}

const saveStoredProfiles = (profiles: Profile[]): void => {
  writeJson(PROFILES_STORAGE_KEY, profiles)
}

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

const getProfile = async (id: string): Promise<Profile> => {
  await delay(SIMULATED_DELAY_MS)
  const profiles = getStoredProfiles()
  const profile = profiles.find((p) => p.id === id)
  if (!profile) {
    throw new Error(`Perfil con ID "${id}" no encontrado.`)
  }
  return profile
}

const createProfile = async (
  payload: CreateProfilePayload
): Promise<Profile> => {
  await delay(SIMULATED_DELAY_MS)
  const profiles = getStoredProfiles()
  const now = new Date().toISOString()
  const newProfile: Profile = {
    ...payload,
    currency: CURRENCY_CODE,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  }
  profiles.unshift(newProfile)
  saveStoredProfiles(profiles)
  return newProfile
}

const updateProfile = async (
  payload: UpdateProfilePayload
): Promise<Profile> => {
  await delay(SIMULATED_DELAY_MS)
  const profiles = getStoredProfiles()
  const index = profiles.findIndex((p) => p.id === payload.id)
  if (index === -1) {
    throw new Error(`Perfil con ID "${payload.id}" no encontrado.`)
  }
  const updated: Profile = {
    ...profiles[index],
    ...payload,
    currency: CURRENCY_CODE,
    updatedAt: new Date().toISOString(),
  }
  profiles[index] = updated
  saveStoredProfiles(profiles)
  return updated
}

const deleteProfile = async (id: string): Promise<{ success: boolean }> => {
  await delay(SIMULATED_DELAY_MS)
  const profiles = getStoredProfiles()
  const filtered = profiles.filter((p) => p.id !== id)
  saveStoredProfiles(filtered)
  return { success: true }
}

const updateProfileStatus = async (
  input: UpdateProfileStatus
): Promise<Profile> => {
  return updateProfile({
    id: input.id,
    isActive: input.isActive,
  })
}

export const profilesService = {
  searchProfiles,
  getProfiles,
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
  updateProfileStatus,
}
