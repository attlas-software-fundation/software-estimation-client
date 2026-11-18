import { apiClient, getAccessToken } from "@/lib/api"
import type { AuthResponse, Session, UserResponse } from "../types"

type JwtAccessPayload = {
  permissions?: string[]
}

const decodeJwtPayload = (token: string): JwtAccessPayload | null => {
  try {
    const parts = token.split(".")
    if (parts.length < 2 || !parts[1]) {
      return null
    }
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/")
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")
    const decoded =
      "atob" in globalThis
        ? globalThis.atob(padded)
        : Buffer.from(padded, "base64").toString("utf-8")
    return JSON.parse(decoded) as JwtAccessPayload
  } catch {
    return null
  }
}

export const getTokenPermissions = (token: string | null): string[] => {
  if (!token) {
    return []
  }
  const payload = decodeJwtPayload(token)
  if (!payload || !Array.isArray(payload.permissions)) {
    return []
  }
  return payload.permissions
}

export const clearSession = () => {
  apiClient.clearAuthTokens()
}

export const sessionFromUser = (
  user: UserResponse,
  permissions: string[]
): Session => ({
  userId: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.roleCode,
  roleId: user.roleId,
  roleName: user.roleName,
  permissions,
})

export const saveAuth = (payload: AuthResponse): Session => {
  apiClient.storeAuthTokens(payload)
  return sessionFromUser(payload.user, payload.permissions)
}

export const hasAccessToken = () => Boolean(getAccessToken())
