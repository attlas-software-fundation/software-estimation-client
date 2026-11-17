import { SPRINT_UNIT_LABELS, type SprintUnit } from "@/enumeration/sprint-unit"

export const DAYS_PER_WEEK = 7

export const toCalendarDays = (value: number, unit: SprintUnit) => {
  if (unit === "WEEKS") {
    return value * DAYS_PER_WEEK
  }
  return value
}

export const timeUnitLabel = (unit: SprintUnit) => SPRINT_UNIT_LABELS[unit]
