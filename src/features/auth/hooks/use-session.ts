import { useQuery } from "@tanstack/react-query"
import { getAccessToken } from "@/lib/api"
import { authService } from "../services/auth-service"
import {
  clearSession,
  getTokenPermissions,
  hasAccessToken,
  sessionFromUser,
} from "../utils/session"

export const authQueryKeys = {
  session: ["auth", "session"] as const,
}

const loadSession = async () => {
  if (!hasAccessToken()) {
    clearSession()
    return null
  }

  try {
    const user = await authService.getProfile()
    const permissions = getTokenPermissions(getAccessToken())
    return sessionFromUser(user, permissions)
  } catch {
    clearSession()
    return null
  }
}

export const useSession = () => {
  return useQuery({
    queryKey: authQueryKeys.session,
    queryFn: loadSession,
  })
}
