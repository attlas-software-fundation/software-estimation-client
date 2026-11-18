"use client"

import { BanknoteIcon, CalculatorIcon, Clock3Icon } from "lucide-react"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { timeUnitLabel } from "@/lib/calendar-time"
import { formatCurrency } from "@/lib/format"
import type { ReportSnapshot } from "../types"

type ReportSummaryCardsProps = {
  snapshot: ReportSnapshot
}

export const ReportSummaryCards = ({ snapshot }: ReportSummaryCardsProps) => {
  const unit = timeUnitLabel(snapshot.timeUnit)

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardDescription>Esfuerzo</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {snapshot.baseEffortPoints} SP
          </CardTitle>
          <CardAction>
            <CalculatorIcon className="text-muted-foreground size-4" />
          </CardAction>
        </CardHeader>
        <CardFooter>
          <p className="text-muted-foreground text-sm">
            {snapshot.storiesWithPoints}/{snapshot.storiesTotal} historias ·{" "}
            {snapshot.totalSprints} sprints
          </p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Tiempo</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {snapshot.totalTime} {unit}
          </CardTitle>
          <CardAction>
            <Clock3Icon className="text-muted-foreground size-4" />
          </CardAction>
        </CardHeader>
        <CardFooter>
          <p className="text-muted-foreground text-sm">
            Base {snapshot.baseTime} {unit} + {snapshot.contingencyTime}
          </p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Costo</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {formatCurrency(snapshot.totalCost)}
          </CardTitle>
          <CardAction>
            <BanknoteIcon className="text-muted-foreground size-4" />
          </CardAction>
        </CardHeader>
        <CardFooter>
          <p className="text-muted-foreground text-sm">
            Base {formatCurrency(snapshot.baseCost)} ·{" "}
            {snapshot.contingencyMarginPercentage}%
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
