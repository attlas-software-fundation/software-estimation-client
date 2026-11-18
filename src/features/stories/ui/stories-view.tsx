"use client"

import { useState } from "react"
import {
  ChevronDown,
  Clock3Icon,
  GripVertical,
  ListTodo,
  ListTodoIcon,
  PencilIcon,
  PlusIcon,
  Search,
  SearchXIcon,
  TrashIcon,
  UserRound,
  X,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet"
import { toast } from "@/components/ui/toast"
import { TECHNICAL_ROLE_BY_VALUE } from "@/enumeration/technical-role"
import { useDebounce } from "@/hooks"
import { getErrorMessage } from "@/lib/form-errors"
import { formatCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"
import { StoryForm } from "./story-form-modal"
import { StoryDetail } from "./story-detail"
import { StoryList } from "./story-list"
import { TaskForm } from "./task-form"
import { BacklogDeleteDialog } from "./backlog-delete-dialog"
import { IconTooltipButton } from "./icon-tooltip-button"
import { StoryPrioritySelect } from "./story-priority-select"
import { StoryStatusSelect } from "./story-status-select"
import { useStories } from "../hooks/use-stories"
import { useProjectAccess } from "@/features/projects/hooks/use-project-access"
import {
  STORY_PRIORITY_OPTIONS,
  STORY_STATUS_OPTIONS,
  TASK_STATUS_OPTIONS,
  type BacklogTask,
  type StoryPriority,
  type StoryStatus,
  type UserStory,
} from "../types"
import type { StoryFormValues, TaskFormValues } from "../schemas/story-schema"

export const StoriesView = ({ projectId }: { projectId: string }) => {
  const [searchInput, setSearchInput] = useState("")
  const search = useDebounce(searchInput, 300)
  const [priorityFilter, setPriorityFilter] = useState<StoryPriority | "">("")
  const [statusFilter, setStatusFilter] = useState<StoryStatus | "">("")

  const backlog = useStories(projectId, {
    search,
    priority: priorityFilter,
    status: statusFilter,
  })
  const access = useProjectAccess(projectId)
  const canWrite = access.canEditBacklog
  const hasActiveFilters = Boolean(search || priorityFilter || statusFilter)
  const canReorder = canWrite && !hasActiveFilters

  const [draggedStoryId, setDraggedStoryId] = useState<string | null>(null)
  const [dragOverStoryId, setDragOverStoryId] = useState<string | null>(null)
  const [draggedTaskId, setDraggedTaskId] = useState<{
    storyId: string
    taskId: string
  } | null>(null)
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null)

  const [storyDialog, setStoryDialog] = useState<UserStory | "new" | null>(null)
  const [taskDialog, setTaskDialog] = useState<{
    storyId: string
    task: BacklogTask | null
  } | null>(null)
  const [storyToDelete, setStoryToDelete] = useState<UserStory | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<BacklogTask | null>(null)
  const [collapsedStoryIds, setCollapsedStoryIds] = useState<Set<string>>(
    new Set()
  )
  const stories = backlog.stories
  const tasks = backlog.tasks

  const toggleStory = (storyId: string) => {
    setCollapsedStoryIds((prev) => {
      const next = new Set(prev)
      if (next.has(storyId)) {
        next.delete(storyId)
      } else {
        next.add(storyId)
      }
      return next
    })
  }

  const handleStoryDragStart = (e: React.DragEvent, storyId: string) => {
    e.dataTransfer.setData("text/plain", storyId)
    e.dataTransfer.effectAllowed = "move"
    setDraggedStoryId(storyId)
  }

  const handleStoryDragEnd = () => {
    setDraggedStoryId(null)
    setDragOverStoryId(null)
  }

  const handleStoryDragOver = (e: React.DragEvent, storyId: string) => {
    if (!canReorder || !draggedStoryId || draggedStoryId === storyId) return
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (dragOverStoryId !== storyId) {
      setDragOverStoryId(storyId)
    }
  }

  const handleStoryDragLeave = (e: React.DragEvent) => {
    const currentTarget = e.currentTarget as HTMLElement
    const relatedTarget = e.relatedTarget as Node | null
    if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
      setDragOverStoryId(null)
    }
  }

  const handleStoryDrop = async (e: React.DragEvent, targetStoryId: string) => {
    e.preventDefault()
    setDragOverStoryId(null)
    const sourceId = draggedStoryId
    setDraggedStoryId(null)

    if (!canReorder || !sourceId || sourceId === targetStoryId) return

    const storyIds = stories.map((s) => s.id)
    const fromIndex = storyIds.indexOf(sourceId)
    const toIndex = storyIds.indexOf(targetStoryId)

    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return

    const newOrder = [...storyIds]
    const [moved] = newOrder.splice(fromIndex, 1)
    newOrder.splice(toIndex, 0, moved)

    try {
      await backlog.reorderStories.mutateAsync(newOrder)
      toast.add({
        title: "Historias reordenadas",
        description: "El nuevo orden de las historias se guardó correctamente.",
        type: "success",
      })
    } catch (error) {
      toast.add({
        title: "No se pudo reordenar",
        description: getErrorMessage(error, "Inténtalo de nuevo."),
        type: "error",
      })
    }
  }

  const handleTaskDragStart = (
    e: React.DragEvent,
    storyId: string,
    taskId: string
  ) => {
    e.stopPropagation()
    e.dataTransfer.setData("text/plain", taskId)
    e.dataTransfer.effectAllowed = "move"
    setDraggedTaskId({ storyId, taskId })
  }

  const handleTaskDragEnd = () => {
    setDraggedTaskId(null)
    setDragOverTaskId(null)
  }

  const handleTaskDragOver = (e: React.DragEvent, taskId: string) => {
    if (!canReorder || !draggedTaskId || draggedTaskId.taskId === taskId) return
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = "move"
    if (dragOverTaskId !== taskId) {
      setDragOverTaskId(taskId)
    }
  }

  const handleTaskDragLeave = (e: React.DragEvent) => {
    e.stopPropagation()
    const currentTarget = e.currentTarget as HTMLElement
    const relatedTarget = e.relatedTarget as Node | null
    if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
      setDragOverTaskId(null)
    }
  }

  const handleTaskDrop = async (
    e: React.DragEvent,
    targetStoryId: string,
    targetTaskId: string
  ) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOverTaskId(null)
    const source = draggedTaskId
    setDraggedTaskId(null)

    if (!canReorder || !source || source.taskId === targetTaskId) return

    const storyTasks = tasks.filter((t) => t.userStoryId === targetStoryId)
    const taskIds = storyTasks.map((t) => t.id)
    const toIndex = taskIds.indexOf(targetTaskId)

    if (source.storyId === targetStoryId) {
      const fromIndex = taskIds.indexOf(source.taskId)
      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return

      const newOrder = [...taskIds]
      const [moved] = newOrder.splice(fromIndex, 1)
      newOrder.splice(toIndex, 0, moved)

      try {
        await backlog.reorderTasks.mutateAsync({
          storyId: targetStoryId,
          taskIds: newOrder,
        })
        toast.add({
          title: "Tareas reordenadas",
          description: "El nuevo orden de las tareas se guardó correctamente.",
          type: "success",
        })
      } catch (error) {
        toast.add({
          title: "No se pudo reordenar",
          description: getErrorMessage(error, "Inténtalo de nuevo."),
          type: "error",
        })
      }
    }
  }

  const saveStory = async (values: StoryFormValues) => {
    try {
      if (storyDialog === "new") {
        await backlog.createStory.mutateAsync(values)
        toast.add({
          title: "Historia creada",
          description: `${values.title} se registró correctamente.`,
          type: "success",
        })
      } else if (storyDialog) {
        await backlog.updateStory.mutateAsync({
          story: storyDialog,
          values,
        })
        toast.add({
          title: "Historia actualizada",
          description: `Los datos de ${values.title} se guardaron correctamente.`,
          type: "success",
        })
      }
      setStoryDialog(null)
    } catch (error) {
      toast.add({
        title: "No se pudo guardar la historia",
        description: getErrorMessage(error, "Inténtalo de nuevo."),
        type: "error",
      })
    }
  }

  const saveTask = async (values: TaskFormValues) => {
    try {
      if (!taskDialog) {
        return
      }
      if (taskDialog.task) {
        await backlog.updateTask.mutateAsync({
          id: taskDialog.task.id,
          values,
        })
        toast.add({
          title: "Tarea actualizada",
          description: `Los datos de ${values.title} se guardaron correctamente.`,
          type: "success",
        })
      } else {
        await backlog.createTask.mutateAsync({
          storyId: taskDialog.storyId,
          values,
        })
        toast.add({
          title: "Tarea creada",
          description: `${values.title} se registró correctamente.`,
          type: "success",
        })
      }
      setTaskDialog(null)
    } catch (error) {
      toast.add({
        title: "No se pudo guardar la tarea",
        description: getErrorMessage(error, "Inténtalo de nuevo."),
        type: "error",
      })
    }
  }

  const confirmDeleteStory = async () => {
    if (!storyToDelete) return
    try {
      await backlog.deleteStory.mutateAsync(storyToDelete.id)
      toast.add({
        title: "Historia eliminada",
        description: `${storyToDelete.title} se eliminó correctamente.`,
        type: "success",
      })
      setStoryToDelete(null)
    } catch (error) {
      toast.add({
        title: "No se pudo eliminar la historia",
        description: getErrorMessage(error, "Inténtalo de nuevo."),
        type: "error",
      })
    }
  }

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return
    try {
      await backlog.deleteTask.mutateAsync(taskToDelete.id)
      toast.add({
        title: "Tarea eliminada",
        description: `${taskToDelete.title} se eliminó correctamente.`,
        type: "success",
      })
      setTaskToDelete(null)
    } catch (error) {
      toast.add({
        title: "No se pudo eliminar la tarea",
        description: getErrorMessage(error, "Inténtalo de nuevo."),
        type: "error",
      })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Historias y tareas
        </h1>
        <Button
          disabled={!canWrite}
          onClick={() => {
            if (!canWrite) return
            setStoryDialog("new")
          }}
        >
          <PlusIcon className="mr-1.5 h-4 w-4" />
          Nueva historia
        </Button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            id="backlog-search"
            type="search"
            value={searchInput}
            onChange={(event) => {
              setSearchInput(event.target.value)
            }}
            placeholder="Buscar por código, título o descripción..."
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-[210px] shrink-0">
            <StoryPrioritySelect
              id="backlog-priority"
              value={priorityFilter}
              includeAll
              onValueChange={setPriorityFilter}
            />
          </div>
          <div className="w-[200px] shrink-0">
            <StoryStatusSelect
              id="backlog-status"
              value={statusFilter}
              includeAll
              onValueChange={setStatusFilter}
            />
          </div>
          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchInput("")
                setPriorityFilter("")
                setStatusFilter("")
              }}
              className="text-muted-foreground hover:text-foreground h-8 shrink-0 px-2"
            >
              <X className="mr-1 h-4 w-4" />
              Limpiar
            </Button>
          )}
        </div>
      </div>

      {/* ERROR STATE */}
      {backlog.isError ? (
        <div
          className="border-destructive/40 bg-destructive/5 flex items-center justify-between gap-4 rounded-md border p-4"
          role="alert"
        >
          <p className="text-sm">
            No se pudo cargar el backlog:{" "}
            {getErrorMessage(backlog.error, "Error de comunicación")}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => void backlog.refetch()}
          >
            Reintentar
          </Button>
        </div>
      ) : null}

      {/* STORY LIST */}
      {backlog.isError ? null : backlog.isLoading ? (
        <p className="text-muted-foreground">Cargando backlog...</p>
      ) : stories.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="flex flex-col items-center gap-3">
              {search || priorityFilter || statusFilter ? (
                <SearchXIcon className="text-muted-foreground h-10 w-10" />
              ) : (
                <ListTodoIcon className="text-muted-foreground h-10 w-10" />
              )}
              <p className="text-muted-foreground text-sm">
                {search || priorityFilter || statusFilter
                  ? "Sin resultados para estos filtros."
                  : "Aún no hay historias de usuario en este proyecto."}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <StoryList>
          {stories.map((story, index) => {
            const storyTasks = tasks.filter((t) => t.userStoryId === story.id)
            const totalHours = storyTasks.reduce(
              (sum, t) => sum + t.estimateHours,
              0
            )
            const isCollapsed = collapsedStoryIds.has(story.id)
            const status = STORY_STATUS_OPTIONS.find(
              (item) => item.value === story.status
            )
            const priority = STORY_PRIORITY_OPTIONS.find(
              (item) => item.value === story.priority
            )
            const StatusIcon = status?.icon
            const PriorityIcon = priority?.icon

            return (
              <StoryDetail
                key={story.id}
                className={cn(
                  "bg-card overflow-hidden rounded-lg border shadow-xs transition-colors",
                  draggedStoryId === story.id && "border-dashed opacity-30",
                  dragOverStoryId === story.id &&
                    "border-primary ring-primary/30 ring-2"
                )}
                onDragOver={(e) => handleStoryDragOver(e, story.id)}
                onDragLeave={handleStoryDragLeave}
                onDrop={(e) => void handleStoryDrop(e, story.id)}
              >
                {/* STORY HEADER */}
                <div
                  className={cn(
                    "bg-muted/40 flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 sm:flex-nowrap",
                    !isCollapsed && "border-b"
                  )}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    {canReorder ? (
                      <div
                        draggable
                        onDragStart={(e) => handleStoryDragStart(e, story.id)}
                        onDragEnd={handleStoryDragEnd}
                        className="text-muted-foreground/40 hover:text-primary hover:bg-primary/10 shrink-0 cursor-grab rounded p-1 transition-colors active:cursor-grabbing"
                        title="Arrastrar para reordenar prioridad"
                      >
                        <GripVertical className="h-4 w-4" />
                      </div>
                    ) : null}
                    <span
                      className="text-muted-foreground/60 w-5 shrink-0 text-center font-mono text-xs select-none"
                      title={`Prioridad #${index + 1}`}
                    >
                      #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleStory(story.id)}
                      className="text-muted-foreground/60 hover:text-foreground shrink-0 rounded p-0.5 transition-colors"
                      title={isCollapsed ? "Expandir" : "Colapsar"}
                    >
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          isCollapsed && "-rotate-90"
                        )}
                      />
                    </button>
                    <span className="bg-background text-muted-foreground shrink-0 rounded border px-1.5 py-0.5 font-mono text-xs leading-none font-semibold">
                      {story.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleStory(story.id)}
                      title={story.title}
                      className="hover:text-primary min-w-0 truncate text-left text-sm font-medium transition-colors"
                    >
                      {story.title}
                    </button>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {status && StatusIcon ? (
                      <Badge
                        variant={status.variant}
                        className="gap-1 text-xs font-normal"
                      >
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    ) : null}
                    {priority && PriorityIcon ? (
                      <Badge
                        variant={priority.variant}
                        className="gap-1 text-xs font-normal"
                      >
                        <PriorityIcon className="h-3 w-3" />
                        {priority.label}
                      </Badge>
                    ) : null}
                    <Badge
                      variant="outline"
                      className="gap-2 text-xs font-normal"
                    >
                      <span className="inline-flex items-center gap-1">
                        <ListTodo className="h-3 w-3" />
                        {storyTasks.length}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock3Icon className="h-3 w-3" />
                        {totalHours} h
                      </span>
                    </Badge>
                    <div className="flex items-center gap-0.5 border-l pl-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 gap-1 px-2 text-xs"
                        disabled={!canWrite}
                        onClick={() => {
                          if (!canWrite) return
                          setTaskDialog({ storyId: story.id, task: null })
                        }}
                      >
                        <PlusIcon className="h-3.5 w-3.5" />
                        Tarea
                      </Button>
                      <IconTooltipButton
                        label={
                          canWrite
                            ? "Editar historia"
                            : "No se puede modificar el backlog en este estado"
                        }
                        disabled={!canWrite}
                        onClick={() => setStoryDialog(story)}
                      >
                        <PencilIcon />
                      </IconTooltipButton>
                      <IconTooltipButton
                        label={
                          canWrite
                            ? "Eliminar historia"
                            : "No se puede modificar el backlog en este estado"
                        }
                        disabled={!canWrite}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setStoryToDelete(story)}
                      >
                        <TrashIcon />
                      </IconTooltipButton>
                    </div>
                  </div>
                </div>

                {/* TASK ROWS */}
                {!isCollapsed && (
                  <div className="divide-border/50 bg-background divide-y">
                    {storyTasks.length === 0 ? (
                      <div className="text-muted-foreground flex items-center gap-3 px-5 py-3 text-sm">
                        <ListTodo className="h-4 w-4 shrink-0 opacity-40" />
                        <span>Sin tareas.</span>
                        {canWrite ? (
                          <Button
                            size="sm"
                            variant="link"
                            className="h-auto p-0 text-xs"
                            onClick={() =>
                              setTaskDialog({ storyId: story.id, task: null })
                            }
                          >
                            Agregar primera tarea
                          </Button>
                        ) : null}
                      </div>
                    ) : (
                      storyTasks.map((task) => {
                        const taskStatus = TASK_STATUS_OPTIONS.find(
                          (item) => item.value === task.status
                        )
                        const TaskStatusIcon = taskStatus?.icon
                        const visibleProfileIds =
                          task.responsibleProfileIds.slice(0, 2)
                        const remainingCount =
                          task.responsibleProfileIds.length - 2
                        const remainingTooltip =
                          remainingCount > 0
                            ? `Otros perfiles asignados:\n${task.responsibleProfileIds
                                .slice(2)
                                .map((id) => {
                                  const assigned = backlog.profiles.find(
                                    (p) => p.id === id
                                  )
                                  const roleOption = assigned
                                    ? TECHNICAL_ROLE_BY_VALUE[assigned.role]
                                    : undefined
                                  const roleName = roleOption
                                    ? roleOption.label
                                    : id
                                  return assigned
                                    ? `• ${assigned.name} (${roleName})`
                                    : `• ${roleName}`
                                })
                                .join("\n")}`
                            : undefined

                        return (
                          <div
                            key={task.id}
                            className={cn(
                              "group flex flex-col gap-2 px-4 py-2.5 transition-colors sm:flex-row sm:items-center",
                              draggedTaskId?.taskId === task.id
                                ? "opacity-30"
                                : dragOverTaskId === task.id
                                  ? "bg-accent/60"
                                  : "hover:bg-muted/30"
                            )}
                            onDragOver={(e) => handleTaskDragOver(e, task.id)}
                            onDragLeave={handleTaskDragLeave}
                            onDrop={(e) =>
                              void handleTaskDrop(e, story.id, task.id)
                            }
                          >
                            {/* LEFT: grip + indent bar + icon + title */}
                            <div className="flex min-w-0 flex-1 items-center gap-2">
                              {canReorder ? (
                                <div
                                  draggable
                                  onDragStart={(e) =>
                                    handleTaskDragStart(e, story.id, task.id)
                                  }
                                  onDragEnd={handleTaskDragEnd}
                                  className="text-muted-foreground/30 hover:text-primary hover:bg-primary/10 shrink-0 cursor-grab rounded p-1 transition-colors active:cursor-grabbing"
                                  title="Arrastrar para reordenar tarea"
                                >
                                  <GripVertical className="h-3.5 w-3.5" />
                                </div>
                              ) : null}
                              <div className="border-border/60 flex min-w-0 flex-1 items-start gap-2 border-l-2 pl-3">
                                <ListTodo className="text-muted-foreground/50 mt-0.5 h-4 w-4 shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <button
                                    type="button"
                                    className="hover:text-primary w-full truncate text-left text-sm font-medium transition-colors hover:underline"
                                    title={task.title}
                                    onClick={() =>
                                      setTaskDialog({ storyId: story.id, task })
                                    }
                                  >
                                    {task.title}
                                  </button>
                                  {task.description ? (
                                    <p
                                      className="text-muted-foreground mt-0.5 line-clamp-1 text-xs"
                                      title={task.description}
                                    >
                                      {task.description}
                                    </p>
                                  ) : null}
                                </div>
                              </div>
                            </div>

                            {/* RIGHT: profiles, hours, status, actions */}
                            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                              {/* Profile chips */}
                              {visibleProfileIds.map((id) => {
                                const assigned = backlog.profiles.find(
                                  (p) => p.id === id
                                )
                                const roleOption = assigned
                                  ? TECHNICAL_ROLE_BY_VALUE[assigned.role]
                                  : undefined
                                const RoleIcon = roleOption
                                  ? roleOption.icon
                                  : UserRound
                                const roleName = roleOption
                                  ? roleOption.label
                                  : id
                                const displayName = assigned
                                  ? assigned.name
                                  : roleName
                                const tooltipText = assigned
                                  ? `${assigned.email}\n${roleName}\nCER ${formatCurrency(assigned.hourlyRate)}/h`
                                  : roleName

                                return (
                                  <Badge
                                    key={id}
                                    variant="outline"
                                    className="h-6 max-w-[130px] gap-1 px-2 text-xs font-normal"
                                    title={tooltipText}
                                  >
                                    <RoleIcon
                                      className={cn(
                                        "h-3 w-3 shrink-0",
                                        roleOption
                                          ? roleOption.color
                                          : "text-muted-foreground"
                                      )}
                                    />
                                    <span className="truncate">
                                      {displayName}
                                    </span>
                                  </Badge>
                                )
                              })}
                              {remainingCount > 0 ? (
                                <Badge
                                  variant="outline"
                                  className="text-muted-foreground h-6 px-1.5 font-mono text-xs font-normal"
                                  title={remainingTooltip}
                                >
                                  +{remainingCount}
                                </Badge>
                              ) : null}
                              <Badge
                                variant="secondary"
                                className="h-6 gap-1 font-mono text-xs font-normal"
                              >
                                <Clock3Icon className="h-3 w-3" />
                                {task.estimateHours}h
                              </Badge>
                              {taskStatus && TaskStatusIcon ? (
                                <Badge
                                  variant={taskStatus.variant}
                                  className="gap-1 text-xs font-normal"
                                >
                                  <TaskStatusIcon className="h-3 w-3" />
                                  {taskStatus.label}
                                </Badge>
                              ) : null}
                              <div className="flex items-center gap-0.5 border-l pl-1.5">
                                <IconTooltipButton
                                  label={
                                    canWrite
                                      ? "Editar tarea"
                                      : "No se puede modificar el backlog en este estado"
                                  }
                                  disabled={!canWrite}
                                  onClick={() =>
                                    setTaskDialog({ storyId: story.id, task })
                                  }
                                >
                                  <PencilIcon />
                                </IconTooltipButton>
                                <IconTooltipButton
                                  label={
                                    canWrite
                                      ? "Eliminar tarea"
                                      : "No se puede modificar el backlog en este estado"
                                  }
                                  disabled={!canWrite}
                                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                  onClick={() => setTaskToDelete(task)}
                                >
                                  <TrashIcon />
                                </IconTooltipButton>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                )}
              </StoryDetail>
            )
          })}
        </StoryList>
      )}

      {/* STORY DIALOG (create / edit) */}
      {storyDialog !== null ? (
        <Dialog
          open={storyDialog !== null}
          onOpenChange={(dialogOpen) => {
            if (!dialogOpen) {
              setStoryDialog(null)
            }
          }}
        >
          <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden sm:max-w-xl">
            <DialogHeader className="shrink-0">
              <DialogTitle>
                {storyDialog === "new"
                  ? "Nueva historia de usuario"
                  : "Editar historia"}
              </DialogTitle>
              <DialogDescription>
                Registra la necesidad y su prioridad dentro del alcance.
              </DialogDescription>
            </DialogHeader>
            <StoryForm
              initial={
                storyDialog && storyDialog !== "new"
                  ? {
                      title: storyDialog.title,
                      description: storyDialog.description,
                      priority: storyDialog.priority,
                      status: storyDialog.status,
                    }
                  : null
              }
              onSubmit={saveStory}
              onCancel={() => setStoryDialog(null)}
            />
          </DialogContent>
        </Dialog>
      ) : null}

      {/* TASK SHEET (create / edit) */}
      <Sheet
        open={taskDialog !== null}
        onOpenChange={(open) => {
          if (!open) setTaskDialog(null)
        }}
      >
        <SheetContent
          side="right"
          className="flex !w-[600px] !max-w-[90vw] flex-col p-0"
        >
          <div className="flex shrink-0 flex-col gap-1 border-b px-6 py-4">
            <SheetTitle>
              {taskDialog?.task ? "Editar tarea" : "Nueva tarea"}
            </SheetTitle>
            <SheetDescription>
              Desglosa el trabajo y asigna uno o más perfiles técnicos.
            </SheetDescription>
          </div>
          <div className="flex min-h-0 flex-1 flex-col">
            {taskDialog ? (
              <TaskForm
                profiles={backlog.profiles}
                initial={
                  taskDialog.task
                    ? {
                        title: taskDialog.task.title,
                        description: taskDialog.task.description,
                        estimateHours: taskDialog.task.estimateHours,
                        status: taskDialog.task.status,
                        responsibleProfileIds:
                          taskDialog.task.responsibleProfileIds,
                      }
                    : null
                }
                onSubmit={saveTask}
                onCancel={() => setTaskDialog(null)}
              />
            ) : null}
          </div>
        </SheetContent>
      </Sheet>

      {/* DELETE DIALOGS */}
      <BacklogDeleteDialog
        open={storyToDelete !== null}
        title="Eliminar historia"
        itemName={
          storyToDelete ? `${storyToDelete.code} ${storyToDelete.title}` : ""
        }
        confirmLabel="Eliminar historia"
        isPending={backlog.deleteStory.isPending}
        onClose={() => setStoryToDelete(null)}
        onConfirm={confirmDeleteStory}
      />
      <BacklogDeleteDialog
        open={taskToDelete !== null}
        title="Eliminar tarea"
        itemName={taskToDelete ? taskToDelete.title : ""}
        confirmLabel="Eliminar tarea"
        isPending={backlog.deleteTask.isPending}
        onClose={() => setTaskToDelete(null)}
        onConfirm={confirmDeleteTask}
      />
    </div>
  )
}
