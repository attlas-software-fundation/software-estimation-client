export type ToggleProfileStatusRequest = {
  isActive: boolean
}

export type ToggleProfileStatusPayload = ToggleProfileStatusRequest & {
  id: string
}
