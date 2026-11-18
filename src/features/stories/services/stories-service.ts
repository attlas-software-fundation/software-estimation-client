import { apiClient } from "@/lib/api"
import type { TaskStatus } from "@/enumeration"
import type {
  BacklogFilters,
  CreateTaskPayload,
  CreateUserStoryPayload,
  TaskResponse,
  UpdateTaskPayload,
  UpdateUserStoryPayload,
  UserStoryResponse,
} from "../types"

const buildStoryQueryString = (filters?: BacklogFilters) => {
  if (!filters) {
    return ""
  }

  const params = new URLSearchParams()
  if (filters.search && filters.search.trim().length > 0) {
    params.set("search", filters.search.trim())
  }
  if (filters.priority) {
    params.set("priority", filters.priority)
  }
  if (filters.status) {
    params.set("status", filters.status)
  }

  const qs = params.toString()
  return qs ? `?${qs}` : ""
}

const buildTaskQueryString = (filters?: {
  search?: string
  status?: TaskStatus | ""
}) => {
  if (!filters) {
    return ""
  }

  const params = new URLSearchParams()
  if (filters.search && filters.search.trim().length > 0) {
    params.set("search", filters.search.trim())
  }
  if (filters.status) {
    params.set("status", filters.status)
  }

  const qs = params.toString()
  return qs ? `?${qs}` : ""
}

const getStories = (projectId: string, filters?: BacklogFilters) =>
  apiClient.get<UserStoryResponse[]>(
    `/api/v1/projects/${projectId}/user-stories${buildStoryQueryString(filters)}`
  )

const getStory = (id: string) =>
  apiClient.get<UserStoryResponse>(`/api/v1/user-stories/${id}`)

const createStory = ({ projectId, ...body }: CreateUserStoryPayload) =>
  apiClient.post<UserStoryResponse>(
    `/api/v1/projects/${projectId}/user-stories`,
    body
  )

const updateStory = ({ id, ...body }: UpdateUserStoryPayload) =>
  apiClient.put<UserStoryResponse>(`/api/v1/user-stories/${id}`, body)

const reorderStories = (projectId: string, storyIds: string[]) =>
  apiClient.put<void>(`/api/v1/projects/${projectId}/user-stories/reorder`, {
    storyIds,
  })

const deleteStory = (id: string) =>
  apiClient.delete(`/api/v1/user-stories/${id}`)

const getProjectTasks = (
  projectId: string,
  filters?: { search?: string; status?: TaskStatus | "" }
) =>
  apiClient.get<TaskResponse[]>(
    `/api/v1/projects/${projectId}/tasks${buildTaskQueryString(filters)}`
  )

const getStoryTasks = (
  storyId: string,
  filters?: { search?: string; status?: TaskStatus | "" }
) =>
  apiClient.get<TaskResponse[]>(
    `/api/v1/user-stories/${storyId}/tasks${buildTaskQueryString(filters)}`
  )

const getTask = (id: string) =>
  apiClient.get<TaskResponse>(`/api/v1/tasks/${id}`)

const createTask = ({ storyId, ...body }: CreateTaskPayload) =>
  apiClient.post<TaskResponse>(`/api/v1/user-stories/${storyId}/tasks`, body)

const updateTask = ({ id, ...body }: UpdateTaskPayload) =>
  apiClient.put<TaskResponse>(`/api/v1/tasks/${id}`, body)

const reorderTasks = (storyId: string, taskIds: string[]) =>
  apiClient.put<void>(`/api/v1/user-stories/${storyId}/tasks/reorder`, {
    taskIds,
  })

const deleteTask = (id: string) => apiClient.delete(`/api/v1/tasks/${id}`)

export const storiesService = {
  getStories,
  getStory,
  createStory,
  updateStory,
  reorderStories,
  deleteStory,
  getProjectTasks,
  getStoryTasks,
  getTask,
  createTask,
  updateTask,
  reorderTasks,
  deleteTask,
}
