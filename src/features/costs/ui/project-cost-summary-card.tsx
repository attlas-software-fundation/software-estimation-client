import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import type { CurrencyCode } from "@/enumeration/currency-code"
import { formatCostAmount } from "../utils/format-cost-amount"

interface ProjectCostSummaryCardProps {
  totalCost: number
  currency?: CurrencyCode | null
}

export const ProjectCostSummaryCard = ({
  totalCost,
  currency,
}: ProjectCostSummaryCardProps) => {
  return (
    <Card className="bg-zinc-900 py-0 text-zinc-50 ring-zinc-800">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-100">
            Costo base total del proyecto
          </p>
          <CardDescription className="text-xs text-zinc-400">
            Total consolidado antes de aplicar contingencias.
            {currency === null
              ? " El proyecto aún no tiene una moneda definida."
              : ""}
          </CardDescription>
        </div>
        <CardTitle className="font-mono text-xl font-bold text-white tabular-nums">
          {formatCostAmount(totalCost, currency)}
        </CardTitle>
      </div>
    </Card>
  )
}
