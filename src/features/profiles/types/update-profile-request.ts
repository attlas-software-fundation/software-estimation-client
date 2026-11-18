import type { CreateTechnicalProfileRequest } from "./create-profile-request"

export type UpdateTechnicalProfileRequest = CreateTechnicalProfileRequest

export type UpdateProfilePayload = UpdateTechnicalProfileRequest & {
  id: string
}
