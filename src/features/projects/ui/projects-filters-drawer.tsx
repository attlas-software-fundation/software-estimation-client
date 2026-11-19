"use client"

import { useForm } from "@tanstack/react-form"
import {
  CheckIcon,
  RotateCcwIcon,
  UserRound,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DateRangeFields } from "@/components/ui/date-range-fields"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { FormSubmitButton } from "@/components/ui/form-submit-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ALL_PROJECT_FILTER_VALUE,
  projectFiltersSchema,
} from "../schemas/project-filters-schema"
import {
  PROJECT_STATUS_OPTIONS,
  PROJECT_TYPE_OPTIONS,
  type ProjectFilters,
} from "../types"
import { useResponsibleUsers } from "@/features/users/hooks/use-users"
import { getFullName } from "@/features/auth/types"
import { getFieldError } from "@/lib/form-errors"
import { cn } from "@/lib/utils"

const emptyFilters: ProjectFilters = {
  name: "",
  type: "",
  responsibleId: "",
  status: "",
  startDate: "",
  plannedDate: "",
}

type ProjectsFiltersDrawerProps = {
  open: boolean
  filters: ProjectFilters
  onOpenChange: (open: boolean) => void
  onApply: (filters: ProjectFilters) => void
}

const ProjectsFiltersForm = ({
  filters,
  onOpenChange,
  onApply,
}: Omit<ProjectsFiltersDrawerProps, "open">) => {
  const { data: responsibles = [] } = useResponsibleUsers()

  const form = useForm({
    defaultValues: {
      ...filters,
      type: filters.type || ALL_PROJECT_FILTER_VALUE,
      responsibleId: filters.responsibleId || ALL_PROJECT_FILTER_VALUE,
      status: filters.status || ALL_PROJECT_FILTER_VALUE,
      startDate: filters.startDate ? new Date(filters.startDate) : undefined,
      plannedDate: filters.plannedDate
        ? new Date(filters.plannedDate)
        : undefined,
    },
    validators: { onSubmit: projectFiltersSchema },
    onSubmit: ({ value }) => {
      onApply({
        name: value.name.trim(),
        type: value.type === ALL_PROJECT_FILTER_VALUE ? "" : value.type,
        responsibleId:
          value.responsibleId === ALL_PROJECT_FILTER_VALUE
            ? ""
            : value.responsibleId,
        status: value.status === ALL_PROJECT_FILTER_VALUE ? "" : value.status,
        startDate: value.startDate ? value.startDate.toISOString() : "",
        plannedDate: value.plannedDate ? value.plannedDate.toISOString() : "",
      })
      onOpenChange(false)
    },
  })

  const renderSelect = (
    name: "type" | "responsibleId" | "status",
    label: string,
    options: {
      value: string
      label: string
      icon?: LucideIcon
      color?: string
    }[]
  ) => {
    return (
      <form.Field name={name}>
        {(field) => {
          const selectedOption = options.find(
            (opt) => opt.value === field.state.value
          )
          const isAllSelected = field.state.value === ALL_PROJECT_FILTER_VALUE

          return (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`projects-filter-${name}`}>{label}</Label>
              <Select
                value={field.state.value}
                onValueChange={(value) => field.handleChange(String(value))}
              >
                <SelectTrigger
                  id={`projects-filter-${name}`}
                  className="w-full"
                >
                  <SelectValue>
                    <span className="flex items-center gap-2">
                      {isAllSelected && name === "responsibleId" && (
                        <UserRound className="text-muted-foreground h-4 w-4" />
                      )}
                      {selectedOption?.icon ? (
                        <selectedOption.icon
                          className={cn(
                            "h-4 w-4",
                            selectedOption.color || "text-muted-foreground"
                          )}
                        />
                      ) : null}
                      {isAllSelected ? "Todos" : selectedOption?.label}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_PROJECT_FILTER_VALUE}>
                    <span className="flex items-center gap-2">
                      {name === "responsibleId" && (
                        <UserRound className="text-muted-foreground h-4 w-4" />
                      )}
                      <span>Todos</span>
                    </span>
                  </SelectItem>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="flex items-center gap-2">
                        {option.icon ? (
                          <option.icon
                            className={cn(
                              "h-4 w-4",
                              option.color || "text-muted-foreground"
                            )}
                          />
                        ) : null}
                        <span>{option.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )
        }}
      </form.Field>
    )
  }

  return (
    <form
      className="flex h-full flex-col"
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <DrawerHeader>
        <DrawerTitle>Filtros</DrawerTitle>
        <DrawerDescription>
          Selecciona los criterios para filtrar.
        </DrawerDescription>
      </DrawerHeader>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <form.Field name="name">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="projects-filter-name">Nombre</Label>
              <Input
                id="projects-filter-name"
                value={field.state.value}
                placeholder="Ej. Plataforma web"
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </div>
          )}
        </form.Field>
        {renderSelect("type", "Tipo", PROJECT_TYPE_OPTIONS)}
        {renderSelect(
          "responsibleId",
          "Responsable",
          responsibles.map((user) => {
            const fullName = getFullName(user)

            return {
              value: user.id,
              label: `${fullName} (${user.email})`,
              icon: UserRound,
            }
          })
        )}
        {renderSelect("status", "Estado", PROJECT_STATUS_OPTIONS)}
        <form.Subscribe
          selector={(state) => ({
            startDate: state.values.startDate,
            plannedDate: state.values.plannedDate,
          })}
        >
          {({ startDate, plannedDate }) => (
            <form.Field name="startDate">
              {(startField) => (
                <form.Field name="plannedDate">
                  {(endField) => (
                    <DateRangeFields
                      startId="projects-filter-start-date"
                      endId="projects-filter-planned-date"
                      startLabel="Fecha de inicio"
                      endLabel="Fecha de entrega"
                      required={false}
                      startValue={startDate}
                      endValue={plannedDate}
                      startError={getFieldError(startField.state.meta.errors)}
                      endError={getFieldError(endField.state.meta.errors)}
                      onStartSelect={startField.handleChange}
                      onEndSelect={endField.handleChange}
                    />
                  )}
                </form.Field>
              )}
            </form.Field>
          )}
        </form.Subscribe>
      </div>

      <DrawerFooter className="flex-row">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => {
            onApply(emptyFilters)
            onOpenChange(false)
          }}
        >
          <RotateCcwIcon />
          Limpiar filtros
        </Button>
        <FormSubmitButton
          form={form}
          schema={projectFiltersSchema}
          className="flex-1"
        >
          <CheckIcon />
          Aplicar filtros
        </FormSubmitButton>
      </DrawerFooter>
    </form>
  )
}

export const ProjectsFiltersDrawer = ({
  open,
  filters,
  onOpenChange,
  onApply,
}: ProjectsFiltersDrawerProps) => {
  if (!open) {
    return null
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
      <DrawerContent className="data-[swipe-axis=x]:[--drawer-content-width:88%] data-[swipe-axis=x]:sm:[--drawer-content-width:32rem]">
        <ProjectsFiltersForm
          key={`${filters.name}|${filters.type}|${filters.responsibleId}|${filters.status}|${filters.startDate}|${filters.plannedDate}`}
          filters={filters}
          onOpenChange={onOpenChange}
          onApply={onApply}
        />
      </DrawerContent>
    </Drawer>
  )
}
