"use client"

import { BookOpenIcon } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
import { getErrorMessage } from "@/lib/form-errors"
import { TableEmptyState } from "@/components/table-empty-state"
import type { UserStory } from "@/features/stories/types"
import { useAssignStoryPoints, useUserStories } from "../hooks/use-user-stories"
import { STORY_POINTS_OPTIONS, isStoryPoints } from "../types"
import { useProjectAccess } from "@/features/projects/hooks/use-project-access"

type UserStoryTableProps = {
  projectId: string
}

export const UserStoryTable = ({ projectId }: UserStoryTableProps) => {
  const { data: stories = [], isLoading } = useUserStories(projectId)
  const assignPoints = useAssignStoryPoints(projectId)
  const access = useProjectAccess(projectId)
  const canWrite = access.canEditEstimation

  const handleAssign = async (story: UserStory, value: string) => {
    const points = Number(value)
    if (!isStoryPoints(points)) return
    if (story.storyPoints === points) return

    try {
      await assignPoints.mutateAsync({
        storyId: story.id,
        points,
      })
      toast.add({
        title: "Story Points actualizados",
        description: `${story.code} se actualizó.`,
        type: "success",
      })
    } catch (error) {
      toast.add({
        title: "No se pudieron asignar los puntos",
        description: getErrorMessage(error, "Inténtalo de nuevo."),
        type: "error",
      })
    }
  }

  const totalPoints = stories.reduce(
    (sum, story) => sum + Number(story.storyPoints ?? 0),
    0
  )
  const assignedCount = stories.filter(
    (story) => story.storyPoints !== null && story.storyPoints > 0
  ).length

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
    )
  }

  if (stories.length === 0) {
    return (
      <TableEmptyState
        message="No hay historias de usuario en el backlog."
        icon={BookOpenIcon}
      />
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {assignedCount} de {stories.length} historias estimadas
        </span>
        <span className="font-semibold tabular-nums">
          Total: {totalPoints} SP
        </span>
      </div>
      <Table>
        <TableHeader className="bg-slate-100 [&_tr]:border-b-2 [&_tr]:border-slate-300 [&_tr]:hover:bg-transparent">
          <TableRow className="border-0 hover:bg-transparent [&_th]:border-b-2 [&_th]:border-slate-300">
            <TableHead className="text-slate-700">
              Historia de usuario
            </TableHead>
            <TableHead className="w-40 text-slate-700">Story Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stories.map((story) => (
            <TableRow
              key={story.id}
              className="border-0 [&_td]:border-b [&_td]:border-slate-300"
            >
              <TableCell>
                <span className="text-sm font-medium">
                  {story.code} - {story.title}
                </span>
              </TableCell>
              <TableCell>
                <Select
                  disabled={!canWrite}
                  value={
                    story.storyPoints !== null && story.storyPoints > 0
                      ? String(story.storyPoints)
                      : ""
                  }
                  onValueChange={(value) => {
                    if (value) {
                      void handleAssign(story, value)
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sin asignar" />
                  </SelectTrigger>
                  <SelectContent>
                    {STORY_POINTS_OPTIONS.map((points) => (
                      <SelectItem key={points} value={String(points)}>
                        {points} SP
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
