"use client"

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { STORAGE_KEYS } from "@/lib/storage"
import { invalidateProjectCosts } from "./query-keys"

export const useCostSynchronization = (projectId: string) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!projectId.trim()) {
      return
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.storageArea !== window.localStorage) {
        return
      }

      if (
        event.key === null ||
        event.key === STORAGE_KEYS.PROFILES ||
        event.key === `software-estimation:task-hours:${projectId}`
      ) {
        void invalidateProjectCosts(queryClient, projectId)
      }
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [projectId, queryClient])
}
