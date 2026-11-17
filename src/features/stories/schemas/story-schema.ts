import { z } from "zod"
import {
  STORY_PRIORITIES,
  STORY_STATUSES,
  TASK_STATUSES,
  type StoryPriority,
  type StoryStatus,
  type TaskStatus,
} from "../types"

export const storySchema = z.object({
  title: z.string().trim().min(3, "El título debe tener al menos 3 caracteres"),
  description: z
    .string()
    .trim()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  priority: z.enum(STORY_PRIORITIES),
  status: z.enum(STORY_STATUSES),
})

export const taskSchema = z.object({
  title: z.string().trim().min(3, "El título debe tener al menos 3 caracteres"),
  description: z
    .string()
    .trim()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  estimateHours: z.number().int().min(1, "La estimación mínima es 1 hora"),
  status: z.enum(TASK_STATUSES),
  responsibleProfileIds: z
    .array(z.string())
    .min(1, "Selecciona al menos un perfil técnico"),
})

export type StoryFormValues = {
  title: string
  description: string
  priority: StoryPriority
  status: StoryStatus
}

export type TaskFormValues = {
  title: string
  description: string
  estimateHours: number
  status: TaskStatus
  responsibleProfileIds: string[]
}
