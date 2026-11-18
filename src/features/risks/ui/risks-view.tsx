"use client"

import { useState } from "react"
import { CheckIcon, SparklesIcon, XIcon } from "lucide-react"
import { useProjectCosts } from "@/features/costs/hooks/use-project-costs"
import { useSprintCalculation } from "@/features/estimates/hooks/use-sprint-calculation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { NumberInput } from "@/components/ui/number-input"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/toast"
import { RISK_LEVEL_LABELS } from "@/enumeration/risk-level"
import { getErrorMessage } from "@/lib/form-errors"
import { toCalendarDays } from "@/lib/calendar-time"
import { isSchemaValid } from "@/lib/form-valid"
import { useRiskManager } from "../hooks/use-risk-manager"
import type { AiRiskPredictionResponse } from "../types"
import { riskConfigSchema } from "../schemas/risk-schema"
import { AiEstimationPanel } from "./ai-estimation-panel"
import { ContingencyImpactCard } from "./contingency-impact-card"
import { RiskLevelSelector } from "./risk-level-selector"
import { useProjectAccess } from "@/features/projects/hooks/use-project-access"

type RisksViewProps = {
  projectId: string
}

export const RisksView = ({ projectId }: RisksViewProps) => {
  const { calculation, isLoading: isLoadingTime } =
    useSprintCalculation(projectId)
  const { data: costs, isLoading: isLoadingCosts } = useProjectCosts(projectId)
  const baseTime = toCalendarDays(
    calculation.totalBaseTime,
    calculation.sprintUnit
  )
  const baseCost = costs ? costs.totalCost : 0
  const {
    level,
    margin,
    impact,
    isLoading: isLoadingConfig,
    hasSavedConfig,
    isSaving,
    isPredicting,
    handleLevelChange,
    handleMarginChange,
    saveConfig,
    predictRisk,
    handleCancel,
  } = useRiskManager({ projectId, baseTime, baseCost })
  const access = useProjectAccess(projectId)
  const canWrite = access.canEditRisks
  const [prediction, setPrediction] = useState<AiRiskPredictionResponse | null>(
    null
  )

  const onSave = async () => {
    try {
      await saveConfig.mutateAsync()
      toast.add({
        title: "Configuración guardada",
        description: "El margen de contingencia se actualizó.",
        type: "success",
      })
    } catch (error) {
      toast.add({
        title: "No se pudo guardar",
        description: getErrorMessage(error, "Inténtalo de nuevo."),
        type: "error",
      })
    }
  }

  const onPredict = async () => {
    try {
      const predicted = await predictRisk.mutateAsync()
      setPrediction(predicted)
      toast.add({
        title: "Predicción IA aplicada",
        description: `Riesgo sugerido: ${RISK_LEVEL_LABELS[predicted.predicted_risk_level]} (${predicted.recommended_contingency_margin}%). Guarda para confirmar.`,
        type: "info",
      })
    } catch (error) {
      toast.add({
        title: "No se pudo predecir con IA",
        description: getErrorMessage(error, "Inténtalo de nuevo."),
        type: "error",
      })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Riesgo y contingencia
          </h1>
          <p className="text-muted-foreground text-sm">
            {!isLoadingConfig && !hasSavedConfig
              ? "Sin guardar"
              : `${RISK_LEVEL_LABELS[level]} ${margin}%`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isLoadingConfig || isPredicting || isSaving || !canWrite}
            onClick={() => {
              void onPredict()
            }}
          >
            <SparklesIcon />
            {isPredicting ? "Prediciendo..." : "Sugerir con IA"}
          </Button>
          <Button
            type="button"
            disabled={
              isLoadingConfig ||
              isSaving ||
              !canWrite ||
              !isSchemaValid(riskConfigSchema, {
                level,
                contingencyMargin: margin,
              })
            }
            onClick={() => {
              void onSave()
            }}
          >
            <CheckIcon />
            Guardar
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isLoadingConfig || isSaving || !canWrite}
            onClick={handleCancel}
          >
            <XIcon />
            Cancelar
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="min-w-0 flex-1">
          <Label className="mb-2 block text-sm font-medium">Nivel</Label>
          {isLoadingConfig ? (
            <Skeleton className="h-9 w-full" />
          ) : (
            <RiskLevelSelector
              currentLevel={level}
              disabled={!canWrite}
              onLevelChange={handleLevelChange}
            />
          )}
        </div>
        <div className="flex items-end gap-2">
          <div>
            <Label htmlFor="margin" className="mb-2 block text-sm font-medium">
              Margen %
            </Label>
            {isLoadingConfig ? (
              <Skeleton className="h-9 w-28" />
            ) : (
              <NumberInput
                id="margin"
                value={margin}
                min={0}
                max={100}
                step={1}
                disabled={isSaving || !canWrite}
                invalid={false}
                className="w-28"
                onBlur={() => undefined}
                onChange={handleMarginChange}
              />
            )}
          </div>
          <Button
            type="button"
            variant="secondary"
            disabled={isLoadingConfig || isSaving || !canWrite}
            onClick={() => handleLevelChange(level)}
          >
            Predeterminado
          </Button>
        </div>
      </div>

      {isLoadingTime || isLoadingCosts ? (
        <Skeleton className="h-12 w-full" />
      ) : (
        <ContingencyImpactCard impact={impact} />
      )}

      <AiEstimationPanel projectId={projectId} prediction={prediction} />
    </div>
  )
}
