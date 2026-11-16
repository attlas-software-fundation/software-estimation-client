import type { PaginatedResponse } from "@/types/api"
import type { TechnicalProfileResponse } from "./technical-profile-response"

export type ProfileSearchResponse = PaginatedResponse<
  TechnicalProfileResponse,
  "technicalProfileResponse"
> & {
  profilesResponse?: TechnicalProfileResponse[]
}
