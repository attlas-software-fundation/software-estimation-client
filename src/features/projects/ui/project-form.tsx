"use client"

import { useForm } from "@tanstack/react-form"
import { useRouter } from "next/navigation"
import { Loader2, SaveIcon, UserRound, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/datepicker"
import { DescriptionHint } from "@/components/ui/description-hint"
import { FormSubmitButton } from "@/components/ui/form-submit-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
import { TABLE_PAGE_SIZE } from "@/lib/pagination"
import { getErrorMessage, getFieldError } from "@/lib/form-errors"
import { cn } from "@/lib/utils"
import {
  projectSchema,
  type ProjectFormValues,
} from "../schemas/project-schema"
import { useCreateProject } from "../hooks/use-create-project"
import { useProjectAccess } from "../hooks/use-project-access"
import { useUpdateProject } from "../hooks/use-update-project"
import { useUpdateProjectStatus } from "../hooks/use-update-project-status"
import {
  PROJECT_STATUS_OPTIONS,
  PROJECT_TYPE_OPTIONS,
  type Project,
  type ProjectStatus,
  type ProjectType,
} from "../types"
import { useUsers } from "@/features/users/hooks/use-users"
import { getFullName } from "@/features/auth/types"

type ProjectFormProps = {
  project: Project | null
  onSuccess?: () => void
  onCancel?: () => void
}

const formatIsoDate = (date: Date | undefined): string => {
  if (!date) return ""
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export const ProjectForm = ({
  project,
  onSuccess,
  onCancel,
}: ProjectFormProps) => {
  const router = useRouter()
  const createProject = useCreateProject()
  const updateProject = useUpdateProject()
  const updateProjectStatus = useUpdateProjectStatus()
  const access = useProjectAccess(project ? project.id : "")
  const fieldsLocked = Boolean(project) && !access.canEditGeneral
  const canChangeStatus = access.allowedTransitions.length > 0
  const canSave = !project || access.canEditGeneral || canChangeStatus

  const currentStatus: ProjectStatus = project ? project.status : "DRAFT"

  const statusOptions = PROJECT_STATUS_OPTIONS.filter((item) => {
    if (!project) {
      return item.value === "DRAFT"
    }
    if (item.value === currentStatus) {
      return true
    }
    return access.allowedTransitions.includes(item.value)
  })

  const { data: usersData } = useUsers({
    filters: [],
    pagination: {
      orderBy: "createdAt",
      pageSize: TABLE_PAGE_SIZE,
      pageNumber: 0,
      sortDirection: "ASC",
    },
  })

  const isEditing = Boolean(project)
  const isPending =
    createProject.isPending ||
    updateProject.isPending ||
    updateProjectStatus.isPending

  const defaultValues: ProjectFormValues = {
    name: project ? project.name : "",
    description: project ? project.description : "",
    type: project ? project.type : "MONITORING",
    startDate: project ? new Date(project.startDate) : undefined,
    plannedDate: project ? new Date(project.plannedDate) : undefined,
    responsibleId: project ? project.responsibleId : "",
    status: project ? project.status : "DRAFT",
  }

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: projectSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        if (project) {
          const statusChanged = value.status !== project.status

          if (access.canEditGeneral) {
            await updateProject.mutateAsync({
              projectId: project.id,
              name: value.name.trim(),
              description: value.description.trim(),
              type: value.type,
              startDate: formatIsoDate(value.startDate),
              plannedDate: formatIsoDate(value.plannedDate),
              responsibleId: value.responsibleId,
            })
          }

          if (statusChanged) {
            await updateProjectStatus.mutateAsync({
              projectId: project.id,
              status: value.status,
            })
          }

          toast.add({
            title: "Proyecto actualizado",
            description: `Los datos de ${value.name} se guardaron correctamente.`,
            type: "success",
          })
        } else {
          await createProject.mutateAsync({
            name: value.name.trim(),
            description: value.description.trim(),
            type: value.type,
            startDate: formatIsoDate(value.startDate),
            plannedDate: formatIsoDate(value.plannedDate),
            responsibleId: value.responsibleId,
          })
          toast.add({
            title: "Proyecto creado",
            description: `${value.name} se registró correctamente en estado Borrador.`,
            type: "success",
          })
        }
        if (onSuccess) {
          onSuccess()
        } else {
          router.push("/projects")
        }
      } catch (error) {
        toast.add({
          title: "No se pudo guardar el proyecto",
          description: getErrorMessage(error, "Inténtalo de nuevo."),
          type: "error",
        })
      }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
      className="flex w-full flex-col gap-6"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <form.Field name="name">
          {(field) => (
            <div className="col-span-1 flex flex-col gap-1.5 md:col-span-2">
              <Label htmlFor={field.name}>
                Nombre del proyecto <span className="text-destructive">*</span>
              </Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                disabled={fieldsLocked}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Ingresa el nombre del proyecto"
                aria-invalid={field.state.meta.errors.length > 0}
              />
              {getFieldError(field.state.meta.errors) ? (
                <p className="text-destructive text-xs">
                  {getFieldError(field.state.meta.errors)}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>

        <form.Field name="type">
          {(field) => {
            const selected = PROJECT_TYPE_OPTIONS.find(
              (t) => t.value === field.state.value
            )

            return (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={field.name}>
                  Tipo de proyecto <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={field.state.value}
                  disabled={fieldsLocked}
                  onValueChange={(value) => {
                    if (value) field.handleChange(value as ProjectType)
                  }}
                >
                  <SelectTrigger id={field.name} className="w-full">
                    {selected ? (
                      <div className="flex items-center gap-2">
                        <selected.icon
                          className={cn("h-4 w-4", selected.color)}
                        />
                        <span>{selected.label}</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Selecciona el tipo de proyecto" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_TYPE_OPTIONS.map((tipo) => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        <div className="flex items-center gap-2">
                          <tipo.icon className={cn("h-4 w-4", tipo.color)} />
                          <span>{tipo.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getFieldError(field.state.meta.errors) ? (
                  <p className="text-destructive text-xs">
                    {getFieldError(field.state.meta.errors)}
                  </p>
                ) : null}
              </div>
            )
          }}
        </form.Field>

        <form.Field name="responsibleId">
          {(field) => {
            const selected = usersData?.userResponse.find(
              (user) => user.id === field.state.value
            )

            return (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={field.name}>
                  Responsable del proyecto{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={field.state.value}
                  disabled={fieldsLocked}
                  onValueChange={(value) => field.handleChange(value ?? "")}
                >
                  <SelectTrigger id={field.name} className="w-full">
                    {selected ? (
                      <div className="flex items-center gap-2">
                        <UserRound className="text-muted-foreground h-4 w-4" />
                        <span className="truncate">
                          {getFullName(selected)}
                        </span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Selecciona un responsable" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {usersData?.userResponse.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          <UserRound className="text-muted-foreground h-4 w-4" />
                          <span>
                            {getFullName(user)} - {`(${user.email})`}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getFieldError(field.state.meta.errors) ? (
                  <p className="text-destructive text-xs">
                    {getFieldError(field.state.meta.errors)}
                  </p>
                ) : null}
              </div>
            )
          }}
        </form.Field>

        <form.Field name="startDate">
          {(startField) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={startField.name}>
                Fecha prevista de inicio{" "}
                <span className="text-destructive">*</span>
              </Label>
              <DatePicker
                id={startField.name}
                value={startField.state.value}
                disabled={fieldsLocked}
                maxDate={form.getFieldValue("plannedDate")}
                invalid={Boolean(getFieldError(startField.state.meta.errors))}
                placeholder="Selecciona fecha de inicio"
                onSelect={startField.handleChange}
              />
              {getFieldError(startField.state.meta.errors) ? (
                <p className="text-destructive text-xs">
                  {getFieldError(startField.state.meta.errors)}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>

        <form.Field name="plannedDate">
          {(endField) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={endField.name}>
                Fecha prevista de entrega{" "}
                <span className="text-destructive">*</span>
              </Label>
              <DatePicker
                id={endField.name}
                value={endField.state.value}
                disabled={fieldsLocked}
                minDate={form.getFieldValue("startDate")}
                invalid={Boolean(getFieldError(endField.state.meta.errors))}
                placeholder="Selecciona fecha de entrega"
                onSelect={endField.handleChange}
              />
              {getFieldError(endField.state.meta.errors) ? (
                <p className="text-destructive text-xs">
                  {getFieldError(endField.state.meta.errors)}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>

        <form.Field name="status">
          {(field) => {
            const selected = PROJECT_STATUS_OPTIONS.find(
              (e) => e.value === field.state.value
            )

            return (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={field.name}>
                  Estado del proyecto{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={field.state.value}
                  disabled={!isEditing || !canChangeStatus}
                  onValueChange={(value) => {
                    if (value) field.handleChange(value as ProjectStatus)
                  }}
                >
                  <SelectTrigger id={field.name} className="w-full">
                    {selected ? (
                      <div className="flex items-center gap-2">
                        <selected.icon
                          className={cn("h-4 w-4", selected.color)}
                        />
                        <span>{selected.label}</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Selecciona el estado" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((estado) => (
                      <SelectItem key={estado.value} value={estado.value}>
                        <div className="flex items-center gap-2">
                          <estado.icon
                            className={cn("h-4 w-4", estado.color)}
                          />
                          <span>{estado.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getFieldError(field.state.meta.errors) ? (
                  <p className="text-destructive text-xs">
                    {getFieldError(field.state.meta.errors)}
                  </p>
                ) : null}
              </div>
            )
          }}
        </form.Field>

        <div className="col-span-1 md:col-span-2">
          <form.Field
            name="description"
            validators={{
              onChange: projectSchema.shape.description,
              onBlur: projectSchema.shape.description,
            }}
          >
            {(field) => {
              const error = getFieldError(field.state.meta.errors)
              const length = field.state.value.trim().length

              return (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={field.name}>Descripción</Label>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    disabled={fieldsLocked}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    maxLength={500}
                    rows={3}
                    placeholder="Ingresa una descripción del proyecto (opcional)"
                    aria-invalid={Boolean(error)}
                  />
                  <DescriptionHint
                    error={error}
                    hint="Opcional. Si la escribes, usa al menos 10 caracteres."
                    length={length}
                    max={500}
                  />
                </div>
              )
            }}
          </form.Field>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() => {
            if (onCancel) {
              onCancel()
            } else {
              router.push("/projects")
            }
          }}
        >
          <XIcon className="mr-2 h-4 w-4" />
          Cancelar
        </Button>
        {canSave ? (
          <FormSubmitButton
            form={form}
            schema={projectSchema}
            isPending={isPending}
          >
            {({ isBusy }) => (
              <>
                {isBusy ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <SaveIcon className="mr-2 h-4 w-4" />
                )}
                {isEditing ? "Guardar Cambios" : "Guardar Proyecto"}
              </>
            )}
          </FormSubmitButton>
        ) : null}
      </div>
    </form>
  )
}
