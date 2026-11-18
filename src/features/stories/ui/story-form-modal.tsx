"use client"

import { useForm } from "@tanstack/react-form"
import { SaveIcon, UserRound, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DescriptionHint } from "@/components/ui/description-hint"
import { FormSubmitButton } from "@/components/ui/form-submit-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NumberInput } from "@/components/ui/number-input"
import { Textarea } from "@/components/ui/textarea"
import { TECHNICAL_ROLE_BY_VALUE } from "@/enumeration/technical-role"
import type { Profile } from "@/features/profiles/types"
import { getFieldError } from "@/lib/form-errors"
import { cn } from "@/lib/utils"
import { TaskProfileInfo } from "./task-profile-info"
import { StoryPrioritySelect } from "./story-priority-select"
import { StoryStatusSelect } from "./story-status-select"
import { TaskStatusSelect } from "./task-status-select"
import {
  storySchema,
  taskSchema,
  type StoryFormValues,
  type TaskFormValues,
} from "../schemas/story-schema"
import { type StoryPriority, type StoryStatus, type TaskStatus } from "../types"

type StoryFormProps = {
  initial: StoryFormValues | null
  onSubmit: (values: StoryFormValues) => Promise<void>
  onCancel: () => void
}

type TaskFormProps = {
  profiles: Profile[]
  initial: TaskFormValues | null
  onSubmit: (values: TaskFormValues) => Promise<void>
  onCancel: () => void
}

const RequiredMark = () => <span className="text-destructive">*</span>

const FieldError = ({ error }: { error: string }) =>
  error ? <p className="text-destructive text-xs">{error}</p> : null

export const StoryForm = ({ initial, onSubmit, onCancel }: StoryFormProps) => {
  const defaultValues: StoryFormValues = initial || {
    title: "",
    description: "",
    priority: "MEDIUM",
    status: "DRAFT",
  }

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: storySchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  return (
    <form
      className="flex min-h-0 flex-1 flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto pr-1">
        <form.Field name="title">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="story-title">
                Título <RequiredMark />
              </Label>
              <Input
                id="story-title"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              />
              <FieldError error={getFieldError(field.state.meta.errors)} />
            </div>
          )}
        </form.Field>
        <form.Field
          name="description"
          validators={{
            onChange: storySchema.shape.description,
            onBlur: storySchema.shape.description,
          }}
        >
          {(field) => {
            const error = getFieldError(field.state.meta.errors)

            return (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="story-description">
                  Descripción <RequiredMark />
                </Label>
                <Textarea
                  id="story-description"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={Boolean(error)}
                />
                <DescriptionHint
                  error={error}
                  hint="Describe la necesidad con al menos 10 caracteres."
                />
              </div>
            )
          }}
        </form.Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="priority">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="story-priority">
                  Prioridad <RequiredMark />
                </Label>
                <StoryPrioritySelect
                  id="story-priority"
                  value={field.state.value}
                  includeAll={false}
                  placeholder="Selecciona una prioridad"
                  onValueChange={(v) => {
                    if (v) field.handleChange(v as StoryPriority)
                  }}
                />
                <FieldError error={getFieldError(field.state.meta.errors)} />
              </div>
            )}
          </form.Field>
          <form.Field name="status">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="story-status">
                  Estado <RequiredMark />
                </Label>
                <StoryStatusSelect
                  id="story-status"
                  value={field.state.value}
                  includeAll={false}
                  placeholder="Selecciona un estado"
                  onValueChange={(v) => {
                    if (v) field.handleChange(v as StoryStatus)
                  }}
                />
                <FieldError error={getFieldError(field.state.meta.errors)} />
              </div>
            )}
          </form.Field>
        </div>
      </div>
      <div className="flex shrink-0 justify-end gap-2 border-t pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          <XIcon />
          Cancelar
        </Button>
        <FormSubmitButton form={form} schema={storySchema}>
          <SaveIcon />
          Guardar historia
        </FormSubmitButton>
      </div>
    </form>
  )
}

export const TaskForm = ({
  profiles,
  initial,
  onSubmit,
  onCancel,
}: TaskFormProps) => {
  const defaultValues: TaskFormValues = initial || {
    title: "",
    description: "",
    estimateHours: 0,
    status: "TODO",
    responsibleProfileIds: [],
  }

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: taskSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-4">
        <form.Field name="title">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="task-title">
                Título <RequiredMark />
              </Label>
              <Input
                id="task-title"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              />
              <FieldError error={getFieldError(field.state.meta.errors)} />
            </div>
          )}
        </form.Field>
        <form.Field
          name="description"
          validators={{
            onChange: taskSchema.shape.description,
            onBlur: taskSchema.shape.description,
          }}
        >
          {(field) => {
            const error = getFieldError(field.state.meta.errors)

            return (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="task-description">
                  Descripción <RequiredMark />
                </Label>
                <Textarea
                  id="task-description"
                  rows={2}
                  className="min-h-14 resize-none"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={Boolean(error)}
                />
                <DescriptionHint
                  error={error}
                  hint="Describe la tarea con al menos 10 caracteres."
                />
              </div>
            )
          }}
        </form.Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="estimateHours">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="task-estimate">
                  Horas estimadas <RequiredMark />
                </Label>
                <NumberInput
                  id="task-estimate"
                  value={field.state.value}
                  min={0}
                  max={9999}
                  step={1}
                  disabled={false}
                  invalid={Boolean(getFieldError(field.state.meta.errors))}
                  className=""
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                />
                <FieldError error={getFieldError(field.state.meta.errors)} />
              </div>
            )}
          </form.Field>
          <form.Field name="status">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="task-status">
                  Estado <RequiredMark />
                </Label>
                <TaskStatusSelect
                  id="task-status"
                  value={field.state.value}
                  includeAll={false}
                  placeholder="Selecciona un estado"
                  onValueChange={(v) => {
                    if (v) field.handleChange(v as TaskStatus)
                  }}
                />
                <FieldError error={getFieldError(field.state.meta.errors)} />
              </div>
            )}
          </form.Field>
        </div>
        <form.Field name="responsibleProfileIds">
          {(field) => {
            const assignableProfiles = profiles.filter(
              (profile) => profile.isActive
            )

            return (
              <div className="flex flex-col gap-1.5">
                <Label>
                  Perfil técnico <RequiredMark />
                </Label>
                {assignableProfiles.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No hay perfiles activos. Créalos en Gestión de perfiles
                    técnicos y CER.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {assignableProfiles.map((profile) => {
                      const roleOption = TECHNICAL_ROLE_BY_VALUE[profile.role]
                      const Icon = roleOption ? roleOption.icon : UserRound
                      const color = roleOption
                        ? roleOption.color
                        : "text-muted-foreground"
                      const roleLabel = roleOption
                        ? roleOption.label
                        : profile.role
                      const selected = field.state.value.includes(profile.id)
                      const checkboxId = `task-profile-${profile.id}`

                      return (
                        <label
                          key={profile.id}
                          htmlFor={checkboxId}
                          title={profile.email}
                          className={cn(
                            "flex cursor-pointer items-center gap-2.5 rounded-md border px-3 py-2 text-sm transition-colors",
                            selected
                              ? "border-primary bg-primary/5"
                              : "border-input bg-background hover:bg-muted/50"
                          )}
                        >
                          <Checkbox
                            id={checkboxId}
                            checked={selected}
                            onCheckedChange={(checked) =>
                              field.handleChange(
                                checked === true
                                  ? [...field.state.value, profile.id]
                                  : field.state.value.filter(
                                      (id) => id !== profile.id
                                    )
                              )
                            }
                          />
                          <TaskProfileInfo
                            name={profile.name}
                            roleLabel={roleLabel}
                            email={profile.email}
                            hourlyRate={profile.hourlyRate}
                            icon={Icon}
                            color={color}
                          />
                        </label>
                      )
                    })}
                  </div>
                )}
                <FieldError error={getFieldError(field.state.meta.errors)} />
              </div>
            )
          }}
        </form.Field>
      </div>
      <div className="flex shrink-0 justify-between border-t px-6 py-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          <XIcon />
          Cancelar
        </Button>
        <FormSubmitButton form={form} schema={taskSchema}>
          <SaveIcon />
          Guardar tarea
        </FormSubmitButton>
      </div>
    </form>
  )
}
