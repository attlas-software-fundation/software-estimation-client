"use client"

import { useQuery } from "@tanstack/react-query"
import { reportsService } from "@/features/reports/services/reports-service"
import { sprintConfigService } from "../services/sprint-config-service"
import type { SprintCalculationResult } from "../types"

const EMPTY_CALCULATION: SprintCalculationResult = {
  totalStoryPoints: 0,
  storiesTotal: 0,
  storiesWithPoints: 0,
  velocity: 5,
  sprintDuration: 2,
  sprintUnit: "DAYS",
  totalSprints: 0,
  totalBaseTime: 0,
  totalEffortHours: 0,
  tasksTotal: 0,
  tasksWithHours: 0,
}

export const useSprintCalculation = (projectId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["sprint-calculation", projectId],
    queryFn: async (): Promise<SprintCalculationResult> => {
      const [summary, config] = await Promise.all([
        reportsService.getEstimationSummary(projectId),
        sprintConfigService.getSprintConfig(projectId),
      ])

      return {
        totalStoryPoints: summary.baseEffortPoints ?? 0,
        storiesTotal: summary.storiesTotal ?? 0,
        storiesWithPoints: summary.storiesWithPoints ?? 0,
        velocity: Math.max(config.velocity, 1),
        sprintDuration: Math.max(config.duration, 1),
        sprintUnit: summary.timeUnit ?? config.unit,
        totalSprints: summary.totalSprints ?? 0,
        totalBaseTime: summary.baseTime ?? 0,
        totalEffortHours: Number((summary.totalEffortHours ?? 0).toFixed(2)),
        tasksTotal: summary.tasksTotal ?? 0,
        tasksWithHours: summary.tasksWithHours ?? 0,
      }
    },
    enabled: Boolean(projectId),
    staleTime: 0,
    refetchOnMount: "always",
  })

  return {
    calculation: data ?? EMPTY_CALCULATION,
    isLoading,
  }
}
