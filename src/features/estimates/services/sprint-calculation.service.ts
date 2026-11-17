import type { SprintCalculationResult } from "../types"
import { estimationApi } from "./estimation-api"
import { sprintConfigService } from "./sprint-config.service"

const EMPTY_CALCULATION: SprintCalculationResult = {
  totalStoryPoints: 0,
  storiesTotal: 0,
  storiesWithPoints: 0,
  velocity: 5,
  sprintDuration: 2,
  sprintUnit: "dias",
  totalSprints: 0,
  totalBaseTime: 0,
  totalEffortHours: 0,
  tasksTotal: 0,
  tasksWithHours: 0,
}

export const calculateSprintsAndProjectTime = async (
  projectId: string
): Promise<SprintCalculationResult> => {
  if (typeof window === "undefined") {
    return EMPTY_CALCULATION
  }

  const [summary, config] = await Promise.all([
    estimationApi.getSummary(projectId),
    sprintConfigService.get(projectId),
  ])

  return {
    totalStoryPoints: summary.baseEffortPoints ?? 0,
    storiesTotal: summary.storiesTotal ?? 0,
    storiesWithPoints: summary.storiesWithPoints ?? 0,
    velocity: Math.max(config.velocity, 1),
    sprintDuration: Math.max(config.duration, 1),
    sprintUnit: summary.timeUnit === "WEEKS" ? "semanas" : "dias",
    totalSprints: summary.totalSprints ?? 0,
    totalBaseTime: summary.baseTime ?? 0,
    totalEffortHours: Number((summary.totalEffortHours ?? 0).toFixed(2)),
    tasksTotal: summary.tasksTotal ?? 0,
    tasksWithHours: summary.tasksWithHours ?? 0,
  }
}
