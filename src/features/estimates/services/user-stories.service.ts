import { requireProjectAction } from "@/features/projects/utils/require-project-action"
import { STORY_POINTS_OPTIONS, type StoryPoints } from "../types"
import { estimationApi, type StoryApiResponse } from "./estimation-api"

export type UserStoryItem = {
  id: string
  code: string
  title: string
  storyPoints: StoryPoints | 0
}

const isStoryPoints = (value: number): value is StoryPoints =>
  STORY_POINTS_OPTIONS.includes(value as StoryPoints)

const toStoryPoints = (value: number | null): StoryPoints | 0 => {
  const points = Number(value ?? 0)
  return isStoryPoints(points) ? points : 0
}

export const getUserStories = async (
  projectId: string
): Promise<UserStoryItem[]> => {
  const stories = await estimationApi.listStories(projectId)

  return stories.map((story) => ({
    id: story.id,
    code: story.code,
    title: story.title,
    storyPoints: toStoryPoints(story.storyPoints),
  }))
}

export const getStoryPointsAssignments = async (
  projectId: string
): Promise<Record<string, StoryPoints>> => {
  const stories = await getUserStories(projectId)
  const assignments: Record<string, StoryPoints> = {}

  stories.forEach((story) => {
    if (story.storyPoints > 0) {
      assignments[story.id] = story.storyPoints as StoryPoints
    }
  })

  return assignments
}

// PUT /user-stories/{id} exige code, title y description, por eso se lee la
// historia actual y se reenvía completa con los nuevos puntos.
const toStoryUpdate = (story: StoryApiResponse, storyPoints: number) => ({
  code: story.code,
  title: story.title,
  description: story.description,
  acceptanceCriteria: story.acceptanceCriteria ?? undefined,
  priority: story.priority,
  status: story.status,
  storyPoints,
})

export const assignStoryPoints = async (
  projectId: string,
  storyId: string,
  storyPoints: StoryPoints
): Promise<void> => {
  await requireProjectAction(projectId, "editEstimation")
  const story = await estimationApi.getStory(storyId)
  await estimationApi.updateStory(storyId, toStoryUpdate(story, storyPoints))
}

export const userStoriesService = {
  getUserStories,
  getAssignments: getStoryPointsAssignments,
  assignStoryPoints,
  isStoryPoints,
}
