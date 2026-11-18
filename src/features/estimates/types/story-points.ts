export type StoryPoints = 1 | 2 | 3 | 5 | 8 | 13 | 20

export const STORY_POINTS_OPTIONS: readonly StoryPoints[] = [
  1, 2, 3, 5, 8, 13, 20,
]

export const isStoryPoints = (value: number): value is StoryPoints =>
  STORY_POINTS_OPTIONS.includes(value as StoryPoints)
