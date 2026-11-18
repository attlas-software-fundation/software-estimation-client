import { formatCurrency } from "@/lib/format"
import { EstimationImpact } from "../types"
import { Clock, Banknote } from "lucide-react"

interface ContingencyImpactCardProps {
  impact: EstimationImpact
}

export const ContingencyImpactCard = ({
  impact,
}: ContingencyImpactCardProps) => {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="flex items-center justify-between gap-3 rounded-md border px-3 py-2">
        <span className="text-muted-foreground flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          Tiempo
        </span>
        <span className="text-right text-sm">
          <span className="font-semibold tabular-nums">
            {impact.totalTime.toFixed(1)} días
          </span>
          <span className="text-muted-foreground ml-2 text-xs">
            +{impact.contingencyTime.toFixed(1)}
          </span>
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 rounded-md border px-3 py-2">
        <span className="text-muted-foreground flex items-center gap-2 text-sm">
          <Banknote className="h-4 w-4" />
          Costo
        </span>
        <span className="text-right text-sm">
          <span className="font-semibold tabular-nums">
            {formatCurrency(impact.totalCost)}
          </span>
          <span className="text-muted-foreground ml-2 text-xs">
            +{formatCurrency(impact.contingencyCost)}
          </span>
        </span>
      </div>
    </div>
  )
}
