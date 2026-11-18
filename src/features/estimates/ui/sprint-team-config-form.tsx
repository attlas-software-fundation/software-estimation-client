"use client"

import { useState } from "react"
import { SaveIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { NumberInput } from "@/components/ui/number-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
import { SPRINT_UNIT_OPTIONS, type SprintUnit } from "@/enumeration"
import { getErrorMessage } from "@/lib/form-errors"
import { isSchemaValid } from "@/lib/form-valid"
import {
  useSaveSprintConfig,
  useSprintConfig,
} from "../hooks/use-sprint-config"
import { sprintConfigSchema } from "../schemas/sprint-config-schema"
import type { SprintConfig } from "../types"
import { useProjectAccess } from "@/features/projects/hooks/use-project-access"

type SprintTeamConfigFormProps = {
  projectId: string
}

export const SprintTeamConfigForm = ({
  projectId,
}: SprintTeamConfigFormProps) => {
  const { data: config, isLoading } = useSprintConfig(projectId)

  if (isLoading || !config) {
    return (
      <p className="text-muted-foreground text-sm">Cargando configuración...</p>
    )
  }

  return <SprintTeamConfigFields projectId={projectId} initialConfig={config} />
}

const SprintTeamConfigFields = ({
  projectId,
  initialConfig,
}: {
  projectId: string
  initialConfig: SprintConfig
}) => {
  const saveConfig = useSaveSprintConfig(projectId)
  const access = useProjectAccess(projectId)
  const canWrite = access.canEditEstimation
  const [velocity, setVelocity] = useState(initialConfig.velocity)
  const [duration, setDuration] = useState(initialConfig.duration)
  const [unit, setUnit] = useState<SprintUnit>(initialConfig.unit)
  const canSubmit = isSchemaValid(sprintConfigSchema, {
    velocity,
    duration,
    unit,
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!canSubmit || !canWrite) return

    try {
      await saveConfig.mutateAsync({
        velocity,
        duration,
        unit,
      })
      toast.add({
        title: "Configuración guardada",
        description: "Los parámetros del sprint se actualizaron.",
        type: "success",
      })
    } catch (error) {
      toast.add({
        title: "No se pudo guardar la configuración",
        description: getErrorMessage(error, "Inténtalo de nuevo."),
        type: "error",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="velocity">Velocidad del equipo (SP/sprint)</Label>
        <NumberInput
          id="velocity"
          value={velocity}
          min={0}
          max={9999}
          step={1}
          disabled={!canWrite}
          invalid={false}
          className=""
          onBlur={() => undefined}
          onChange={setVelocity}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="duration">Duración del sprint</Label>
        <div className="flex gap-2">
          <NumberInput
            id="duration"
            value={duration}
            min={0}
            max={9999}
            step={1}
            disabled={!canWrite}
            invalid={false}
            className="w-36"
            onBlur={() => undefined}
            onChange={setDuration}
          />
          <Select
            value={unit}
            disabled={!canWrite}
            onValueChange={(value) => {
              if (value) {
                setUnit(value as SprintUnit)
              }
            }}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Unidad" />
            </SelectTrigger>
            <SelectContent>
              {SPRINT_UNIT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label === "días"
                    ? "Días"
                    : option.label === "semanas"
                      ? "Semanas"
                      : option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={!canWrite || !canSubmit || saveConfig.isPending}
        >
          <SaveIcon data-icon="inline-start" className="size-4" />
          {saveConfig.isPending ? "Guardando..." : "Guardar configuración"}
        </Button>
      </div>
    </form>
  )
}
