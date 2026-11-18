"use client"

import { useState } from "react"
import {
  ChartColumnIcon,
  Clock3Icon,
  ShuffleIcon,
  UserIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/toast"
import { RISK_LEVEL_LABELS, isRiskLevel } from "@/enumeration/risk-level"
import { getErrorMessage } from "@/lib/form-errors"
import { formatCurrency } from "@/lib/format"
import { riskService } from "../services/risk-service"
import type {
  AiAssignmentResponse,
  AiModelMetricsResponse,
  AiRiskPredictionResponse,
} from "../types"

type AiEstimationPanelProps = {
  projectId: string
  prediction: AiRiskPredictionResponse | null
}

const percent = (value: number) =>
  new Intl.NumberFormat("es-PE", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value)

const modelLabel = (name: string) => name.replaceAll("_", " ")

const decimal = (value: number) => value.toFixed(3)

const byScore = <T,>(
  entries: [string, T][],
  selected: string,
  score: (metric: T) => number
) =>
  [...entries].sort((left, right) => {
    if (left[0] === selected) {
      return -1
    }
    if (right[0] === selected) {
      return 1
    }
    return score(right[1]) - score(left[1])
  })

export const AiEstimationPanel = ({
  projectId,
  prediction,
}: AiEstimationPanelProps) => {
  const [metrics, setMetrics] = useState<AiModelMetricsResponse | null>(null)
  const [loadingMetrics, setLoadingMetrics] = useState(false)
  const [assignments, setAssignments] = useState<AiAssignmentResponse | null>(
    null
  )
  const [optimizing, setOptimizing] = useState(false)

  const loadMetrics = async () => {
    setLoadingMetrics(true)
    try {
      setMetrics(await riskService.getModelMetrics())
    } catch (error) {
      toast.add({
        title: "No se pudieron leer las métricas",
        description: getErrorMessage(error, "Inténtalo de nuevo."),
        type: "error",
      })
    } finally {
      setLoadingMetrics(false)
    }
  }

  const optimize = async () => {
    setOptimizing(true)
    try {
      setAssignments(await riskService.optimizeAssignments(projectId))
    } catch (error) {
      toast.add({
        title: "No se pudo optimizar las asignaciones",
        description: getErrorMessage(error, "Inténtalo de nuevo."),
        type: "error",
      })
    } finally {
      setOptimizing(false)
    }
  }

  const probabilities = prediction
    ? Object.entries(prediction.risk_probabilities)
    : []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asistencia de IA</CardTitle>
        <CardDescription>
          Predicción, métricas y asignación sugerida.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {prediction ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm">
              Modelos usados: {prediction.regression_model_used} y{" "}
              {prediction.classification_model_used}.
            </p>
            <ul className="flex flex-col gap-1.5">
              {probabilities.map(([level, probability]) => (
                <li key={level} className="flex items-center gap-3 text-sm">
                  <span className="w-16">
                    {isRiskLevel(level) ? RISK_LEVEL_LABELS[level] : level}
                  </span>
                  <span className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                    <span
                      className="bg-primary block h-full"
                      style={{
                        width: `${Math.min(100, Math.max(0, probability * 100))}%`,
                      }}
                    />
                  </span>
                  <span className="w-12 text-right tabular-nums">
                    {percent(probability)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            Usa «Sugerir con IA» para ver el nivel, el margen y la probabilidad
            de cada riesgo.
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={loadingMetrics}
            onClick={() => {
              void loadMetrics()
            }}
          >
            <ChartColumnIcon />
            {loadingMetrics ? "Consultando..." : "Métricas de modelos"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={optimizing}
            onClick={() => {
              void optimize()
            }}
          >
            <ShuffleIcon />
            {optimizing ? "Optimizando..." : "Optimizar asignaciones"}
          </Button>
        </div>

        {metrics || assignments ? (
          <div className="grid items-start gap-3 xl:grid-cols-3">
            {metrics ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Regresión</TableHead>
                      <TableHead className="w-20 text-right">R²</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {byScore(
                      Object.entries(metrics.regression_comparison),
                      metrics.selected_regression_model,
                      (metric) => metric.r2
                    ).map(([name, metric]) => (
                      <TableRow key={name}>
                        <TableCell>
                          <span className="inline-flex items-center gap-2">
                            {modelLabel(name)}
                            {name === metrics.selected_regression_model ? (
                              <Badge variant="outline">Activo</Badge>
                            ) : null}
                          </span>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {decimal(metric.r2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Clasificación</TableHead>
                      <TableHead className="w-24 text-right">
                        Exactitud
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {byScore(
                      Object.entries(metrics.classification_comparison),
                      metrics.selected_classification_model,
                      (metric) => metric.accuracy
                    ).map(([name, metric]) => (
                      <TableRow key={name}>
                        <TableCell>
                          <span className="inline-flex items-center gap-2">
                            {modelLabel(name)}
                            {name === metrics.selected_classification_model ? (
                              <Badge variant="outline">Activo</Badge>
                            ) : null}
                          </span>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {percent(metric.accuracy)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            ) : null}
            {assignments ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asignación</TableHead>
                    <TableHead className="text-right">
                      {formatCurrency(assignments.total_cost)}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.assignments.map((item) => (
                    <TableRow key={`${item.task_id}-${item.profile_id}`}>
                      <TableCell>
                        <p>{item.task_title}</p>
                        <p className="text-muted-foreground flex items-center gap-3 text-xs">
                          <span className="inline-flex items-center gap-1">
                            <UserIcon className="size-3" />
                            {item.profile_name}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock3Icon className="size-3" />
                            {item.estimate_hours} h
                          </span>
                        </p>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(item.cost)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
