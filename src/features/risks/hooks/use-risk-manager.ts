"use client"

import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { invalidateReportQueries } from "@/features/reports/hooks/query-keys"
import {
  DEFAULT_RISK_LEVEL,
  getRiskDefaultMargin,
  type RiskLevel,
} from "@/enumeration"
import { riskService } from "../services/risk-service"
import type {
  AiRiskPredictionResponse,
  EstimationImpact,
  RiskConfigResponse,
} from "../types"

type UseRiskManagerProps = {
  projectId: string
  baseTime: number
  baseCost: number
}

export const RISK_CONFIG_QUERY_KEY = ["risk-config"]

const DEFAULT_LEVEL: RiskLevel = DEFAULT_RISK_LEVEL
const DEFAULT_MARGIN = getRiskDefaultMargin(DEFAULT_RISK_LEVEL)

const calculateImpact = (
  baseTime: number,
  baseCost: number,
  margin: number
): EstimationImpact => {
  const factor = margin / 100
  const contingencyTime = baseTime * factor
  const contingencyCost = baseCost * factor

  return {
    originalTime: baseTime,
    originalCost: baseCost,
    contingencyTime,
    contingencyCost,
    totalTime: baseTime + contingencyTime,
    totalCost: baseCost + contingencyCost,
  }
}

export const useRiskManager = ({
  projectId,
  baseTime,
  baseCost,
}: UseRiskManagerProps) => {
  const queryClient = useQueryClient()
  const { data: savedConfig, isLoading } = useQuery({
    queryKey: [...RISK_CONFIG_QUERY_KEY, projectId],
    queryFn: () => riskService.getConfig(projectId),
    enabled: Boolean(projectId),
    retry: false,
  })
  const [isDirty, setIsDirty] = useState(false)
  const [draftLevel, setDraftLevel] = useState<RiskLevel>(DEFAULT_LEVEL)
  const [draftMargin, setDraftMargin] = useState(DEFAULT_MARGIN)

  const savedLevel = savedConfig ? savedConfig.level : DEFAULT_LEVEL
  const savedMargin = savedConfig
    ? savedConfig.contingencyMargin
    : DEFAULT_MARGIN
  const level = isDirty ? draftLevel : savedLevel
  const margin = isDirty ? draftMargin : savedMargin

  const saveConfig = useMutation({
    mutationFn: () =>
      riskService.updateConfig({
        projectId,
        level,
        contingencyMargin: margin,
      }),
    onSuccess: (config) => {
      queryClient.setQueryData([...RISK_CONFIG_QUERY_KEY, projectId], config)
      setDraftLevel(config.level)
      setDraftMargin(config.contingencyMargin)
      setIsDirty(false)
      invalidateReportQueries(queryClient)
    },
  })

  const predictRisk = useMutation({
    mutationFn: () => riskService.predictRisk(projectId),
    onSuccess: (predicted: AiRiskPredictionResponse) => {
      setDraftLevel(predicted.predicted_risk_level)
      setDraftMargin(
        Number(predicted.recommended_contingency_margin.toFixed(2))
      )
      setIsDirty(true)
    },
  })

  const impact = useMemo(() => {
    return calculateImpact(baseTime, baseCost, margin)
  }, [baseTime, baseCost, margin])

  const handleLevelChange = (newLevel: RiskLevel) => {
    setDraftLevel(newLevel)
    setDraftMargin(getRiskDefaultMargin(newLevel))
    setIsDirty(true)
  }

  const handleMarginChange = (newMargin: number) => {
    setDraftLevel(level)
    setDraftMargin(Math.max(0, Math.min(100, newMargin)))
    setIsDirty(true)
  }

  const handleCancel = () => {
    setDraftLevel(savedLevel)
    setDraftMargin(savedMargin)
    setIsDirty(false)
  }

  return {
    level,
    margin,
    impact,
    isLoading,
    hasSavedConfig: savedConfig?.saved === true,
    isSaving: saveConfig.isPending,
    isPredicting: predictRisk.isPending,
    handleLevelChange,
    handleMarginChange,
    saveConfig,
    predictRisk,
    handleCancel,
  }
}
