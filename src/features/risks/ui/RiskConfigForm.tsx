"use client"

import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { RiskLevelSelector } from "./risk-level-selector"
import {
  getRiskConfig,
  updateRiskConfig,
} from "../services/risk-config.service"
import type { RiskConfig } from "../types/risk-config.types"
import { riskConfigSchema } from "../schemas/risk-schema"
import ContingencyInput from "./ContingencyInput"
import type { RiskLevel } from "@/enumeration/risk-level"

const LEVEL_MAP: Record<RiskConfig["level"], RiskLevel> = {
  BAJO: "low",
  MEDIO: "medium",
  ALTO: "high",
}

const REVERSE_LEVEL_MAP: Record<RiskLevel, RiskConfig["level"]> = {
  low: "BAJO",
  medium: "MEDIO",
  high: "ALTO",
}

const RiskConfigForm = () => {
  const [config, setConfig] = useState<RiskConfig>({
    level: "BAJO",
    percentage: 0,
  })
  const [loading, setLoading] = useState<boolean>(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    getRiskConfig()
      .then(setConfig)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const validation = riskConfigSchema.safeParse(config)

    if (!validation.success) {
      setErrorMsg(validation.error.issues[0]?.message ?? "Error de validación")
      return
    }
    setErrorMsg(null)

    try {
      await updateRiskConfig(config)
      alert("Configuración guardada exitosamente")
    } catch {
      alert("Error al guardar la configuración")
    }
  }

  if (loading) return <div>Cargando configuración...</div>

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow"
    >
      <h2 className="text-xl font-bold">Configuración de riesgo</h2>

      <RiskLevelSelector
        currentLevel={LEVEL_MAP[config.level] ?? "low"}
        onLevelChange={(level: RiskLevel) =>
          setConfig({ ...config, level: REVERSE_LEVEL_MAP[level] })
        }
        disabled={false}
      />

      <ContingencyInput
        value={config.percentage}
        onChange={(percentage: number) => setConfig({ ...config, percentage })}
      />

      {errorMsg && (
        <p className="text-sm font-semibold text-red-500">{errorMsg}</p>
      )}

      <button
        type="submit"
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Guardar configuración
      </button>
    </form>
  )
}

export default RiskConfigForm
