"use client"

import { useState } from "react"
import { CheckIcon, ClockIcon, PencilIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NumberInput } from "@/components/ui/number-input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/toast"
import { getErrorMessage } from "@/lib/form-errors"
import { TableEmptyState } from "@/components/table-empty-state"
import { useTaskHours } from "../hooks/use-task-hours"
import type { TaskHourEntry } from "../types"
import { useProjectAccess } from "@/features/projects/hooks/use-project-access"

type TaskHoursTableProps = {
  projectId: string
}

type StoryGroup = {
  storyId: string
  storyCode: string
  storyTitle: string
  entries: TaskHourEntry[]
}

const groupByStory = (entries: TaskHourEntry[]): StoryGroup[] => {
  const groups: StoryGroup[] = []

  entries.forEach((entry) => {
    const current = groups.find((group) => group.storyId === entry.storyId)
    if (current) {
      current.entries.push(entry)
      return
    }

    groups.push({
      storyId: entry.storyId,
      storyCode: entry.storyCode,
      storyTitle: entry.storyTitle,
      entries: [entry],
    })
  })

  return groups
}

export const TaskHoursTable = ({ projectId }: TaskHoursTableProps) => {
  const { data, isLoading, updateTaskHours, isUpdating } =
    useTaskHours(projectId)
  const entries: TaskHourEntry[] = Array.isArray(data) ? data : []
  const access = useProjectAccess(projectId)
  const canWrite = access.canEditEstimation
  const [editingId, setEditingId] = useState("")
  const [editHours, setEditHours] = useState(0)

  const groups = groupByStory(entries)
  const totalHours = entries.reduce(
    (sum, entry) => sum + entry.estimatedHours,
    0
  )

  const handleStartEdit = (entry: TaskHourEntry) => {
    setEditingId(entry.id)
    setEditHours(entry.estimatedHours)
  }

  const handleSave = async (entry: TaskHourEntry) => {
    try {
      await updateTaskHours({
        taskId: entry.taskId,
        data: {
          estimatedHours: editHours,
        },
      })
      toast.add({
        title: "Horas actualizadas",
        description: `${entry.taskTitle} se actualizó correctamente.`,
        type: "success",
      })
      setEditingId("")
    } catch (error) {
      toast.add({
        title: "No se pudieron guardar las horas",
        description: getErrorMessage(error, "Inténtalo de nuevo."),
        type: "error",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <TableEmptyState
        message="No hay tareas registradas en el backlog."
        icon={ClockIcon}
      />
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <Table>
        <TableHeader className="bg-slate-100 [&_tr]:border-b-2 [&_tr]:border-slate-300 [&_tr]:hover:bg-transparent">
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-slate-700">Tarea</TableHead>
            <TableHead className="text-slate-700">Perfiles</TableHead>
            <TableHead className="w-28 text-right text-slate-700">
              Horas
            </TableHead>
            <TableHead className="w-24 text-right text-slate-700">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.map((group, groupIndex) => {
            const storyTotal = group.entries.reduce(
              (sum, entry) => sum + entry.estimatedHours,
              0
            )

            return [
              <TableRow
                key={group.storyId}
                className={
                  groupIndex === 0
                    ? "border-0 bg-slate-50 hover:bg-slate-50 [&_td]:border-b [&_td]:border-slate-300"
                    : "border-0 bg-slate-50 hover:bg-slate-50 [&_td]:border-y-2 [&_td]:border-slate-400"
                }
              >
                <TableCell colSpan={4} className="font-semibold">
                  <div className="flex items-center justify-between gap-3">
                    <span>
                      {group.storyCode} - {group.storyTitle}
                    </span>
                    <span className="tabular-nums">{storyTotal} h</span>
                  </div>
                </TableCell>
              </TableRow>,
              ...group.entries.map((entry) => {
                const isEditing = editingId === entry.id

                return (
                  <TableRow
                    key={entry.id}
                    className="border-0 [&_td]:border-b [&_td]:border-slate-300"
                  >
                    <TableCell className="font-medium">
                      {entry.taskTitle}
                    </TableCell>
                    <TableCell>{entry.profileNames}</TableCell>
                    <TableCell className="text-right">
                      {isEditing ? (
                        <NumberInput
                          id={`hours-${entry.id}`}
                          value={editHours}
                          min={1}
                          max={9999}
                          step={1}
                          disabled={isUpdating}
                          invalid={false}
                          className="ml-auto w-28"
                          onBlur={() => undefined}
                          onChange={setEditHours}
                        />
                      ) : (
                        <span className="tabular-nums">
                          {entry.estimatedHours} h
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            disabled={isUpdating}
                            onClick={() => void handleSave(entry)}
                          >
                            <CheckIcon className="h-4 w-4" />
                            <span className="sr-only">Guardar</span>
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            disabled={isUpdating}
                            onClick={() => setEditingId("")}
                          >
                            <XIcon className="h-4 w-4" />
                            <span className="sr-only">Cancelar</span>
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={!canWrite}
                          onClick={() => handleStartEdit(entry)}
                        >
                          <PencilIcon className="h-4 w-4" />
                          <span className="sr-only">Ajustar horas</span>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              }),
            ]
          })}
        </TableBody>
      </Table>
      <div className="flex justify-end border-t pt-3 text-sm font-semibold">
        <span>
          Esfuerzo total:{" "}
          <span className="text-primary tabular-nums">{totalHours} h</span>
        </span>
      </div>
    </div>
  )
}
