import { apiClient } from "@/lib/api"
import type { QueryRequest } from "@/types/api"
import type {
  CreateTechnicalProfileRequest,
  ProfileSearchResponse,
  TechnicalProfileResponse,
  ToggleProfileStatusPayload,
  UpdateCerPayload,
  UpdateProfilePayload,
} from "../types"

const getProfiles = (query: QueryRequest) =>
  apiClient.post<ProfileSearchResponse>("/api/v1/profiles/search", query)

const getActiveProfiles = () =>
  apiClient.get<TechnicalProfileResponse[]>("/api/v1/profiles/active")

const getProfile = (id: string) =>
  apiClient.get<TechnicalProfileResponse>(`/api/v1/profiles/${id}`)

const createProfile = (input: CreateTechnicalProfileRequest) =>
  apiClient.post<TechnicalProfileResponse>("/api/v1/profiles", input)

const updateProfile = ({ id, ...body }: UpdateProfilePayload) =>
  apiClient.put<TechnicalProfileResponse>(`/api/v1/profiles/${id}`, body)

const updateProfileCer = ({ id, ...payload }: UpdateCerPayload) =>
  apiClient.patch<TechnicalProfileResponse>(
    `/api/v1/profiles/${id}/cer`,
    payload
  )

const updateProfileStatus = ({ id, isActive }: ToggleProfileStatusPayload) =>
  apiClient.patch<TechnicalProfileResponse>(`/api/v1/profiles/${id}/status`, {
    isActive,
  })

const deleteProfile = (id: string) => apiClient.delete(`/api/v1/profiles/${id}`)

export const profilesService = {
  getProfiles,
  getActiveProfiles,
  getProfile,
  createProfile,
  updateProfile,
  updateProfileCer,
  updateProfileStatus,
  deleteProfile,
}
