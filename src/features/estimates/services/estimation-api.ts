import { apiClient } from "@/lib/api"
import type { PaginatedResponse, QueryRequest } from "@/types/api"

const PAGE_SIZE = 100

export type StoryApiResponse = {
  id: string
  projectId: string
  code: string
  title: string
  description: string
  acceptanceCriteria?: string | null
  priority: "LOW" | "MEDIUM" | "HIGH"
  status: "DRAFT" | "READY" | "IN_PROGRESS" | "DONE"
  storyPoints: number | null
  position: number
}

export type TaskApiResponse = {
  id: string
  projectId: string
  userStoryId: string
  title: string
  description: string
  estimateHours: number | null
  status: "TODO" | "IN_PROGRESS" | "DONE"
  position: number
  responsibleProfileIds: string[] | null
  updatedAt: string | null
  createdAt: string
}

export type EstimationSummaryApiResponse = {
  baseEffortPoints: number | null
  totalSprints: number | null
  totalEffortHours: number | null
  storiesTotal: number | null
  storiesWithPoints: number | null
  tasksTotal: number | null
  tasksWithHours: number | null
  baseTime: number | null
  timeUnit: "DAYS" | "WEEKS" | null
}

const firstPage = (orderBy: string): QueryRequest => ({
  filters: [],
  pagination: {
    pageNumber: 0,
    pageSize: PAGE_SIZE,
    orderBy,
    sortDirection: "ASC",
  },
})

const fetchAllPages = async <T, K extends string>(
  path: string,
  key: K,
  orderBy: string
): Promise<T[]> => {
  const items: T[] = []
  let request = firstPage(orderBy)
  let hasNext = true

  while (hasNext) {
    const page = await apiClient.post<PaginatedResponse<T, K>>(path, request)
    items.push(...page[key])
    hasNext = page.hasNext
    request = {
      ...request,
      pagination: {
        ...request.pagination,
        pageNumber: request.pagination.pageNumber + 1,
      },
    }
  }

  return items
}

export const estimationApi = {
  listStories: (projectId: string) =>
    fetchAllPages<StoryApiResponse, "userStoryResponse">(
      `/api/v1/projects/${projectId}/user-stories/search`,
      "userStoryResponse",
      "position"
    ),

  listTasks: (projectId: string) =>
    fetchAllPages<TaskApiResponse, "taskResponse">(
      `/api/v1/projects/${projectId}/tasks/search`,
      "taskResponse",
      "position"
    ),

  getStory: (storyId: string) =>
    apiClient.get<StoryApiResponse>(`/api/v1/user-stories/${storyId}`),

  getTask: (taskId: string) =>
    apiClient.get<TaskApiResponse>(`/api/v1/tasks/${taskId}`),

  updateStory: (storyId: string, body: Record<string, unknown>) =>
    apiClient.put<StoryApiResponse>(`/api/v1/user-stories/${storyId}`, body),

  updateTask: (taskId: string, body: Record<string, unknown>) =>
    apiClient.put<TaskApiResponse>(`/api/v1/tasks/${taskId}`, body),

  getSummary: (projectId: string) =>
    apiClient.get<EstimationSummaryApiResponse>(
      `/api/v1/projects/${projectId}/estimation-summary`
    ),
}
