export type SprintUnit = "DAYS" | "WEEKS"

export type SprintUnitDefinition = {
  value: SprintUnit
  label: string
}

export const SprintUnitEnum = {
  DAYS: {
    value: "DAYS",
    label: "días",
  },
  WEEKS: {
    value: "WEEKS",
    label: "semanas",
  },
} as const satisfies Record<SprintUnit, SprintUnitDefinition>

export const SPRINT_UNITS: readonly [SprintUnit, ...SprintUnit[]] = [
  SprintUnitEnum.DAYS.value,
  SprintUnitEnum.WEEKS.value,
]

export const SPRINT_UNIT_OPTIONS: SprintUnitDefinition[] = [
  SprintUnitEnum.DAYS,
  SprintUnitEnum.WEEKS,
]

export const SPRINT_UNIT_LABELS: Record<SprintUnit, string> = {
  DAYS: SprintUnitEnum.DAYS.label,
  WEEKS: SprintUnitEnum.WEEKS.label,
}
