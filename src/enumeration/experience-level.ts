export type ExperienceLevelValue = "JUNIOR" | "MID" | "SENIOR" | "LEAD"

export type ExperienceLevelType = ExperienceLevelValue

export type ExperienceLevelDefinition = {
  value: ExperienceLevelValue
  label: string
}

export const ExperienceLevel = {
  JUNIOR: {
    value: "JUNIOR",
    label: "Junior (0-2 años)",
  },
  MID: {
    value: "MID",
    label: "Semi-Senior (2-5 años)",
  },
  SENIOR: {
    value: "SENIOR",
    label: "Senior (5+ años)",
  },
  LEAD: {
    value: "LEAD",
    label: "Líder / Principal",
  },
} as const satisfies Record<ExperienceLevelValue, ExperienceLevelDefinition>

export const EXPERIENCE_LEVELS: readonly [
  ExperienceLevelValue,
  ...ExperienceLevelValue[],
] = [
  ExperienceLevel.JUNIOR.value,
  ExperienceLevel.MID.value,
  ExperienceLevel.SENIOR.value,
  ExperienceLevel.LEAD.value,
]

export const EXPERIENCE_LEVEL_OPTIONS: ExperienceLevelDefinition[] = [
  ExperienceLevel.JUNIOR,
  ExperienceLevel.MID,
  ExperienceLevel.SENIOR,
  ExperienceLevel.LEAD,
]

export const EXPERIENCE_LEVEL_LABELS: Record<ExperienceLevelValue, string> = {
  JUNIOR: ExperienceLevel.JUNIOR.label,
  MID: ExperienceLevel.MID.label,
  SENIOR: ExperienceLevel.SENIOR.label,
  LEAD: ExperienceLevel.LEAD.label,
}
