import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
    <Card>
      <CardHeader>
        <CardDescription>Costo base total del proyecto</CardDescription>
        <CardTitle className="text-3xl tabular-nums">
          {formatCostAmount(totalCost, currency)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Total consolidado antes de aplicar contingencias.
        </p>
        {currency === null && (
          <p className="text-muted-foreground mt-1 text-sm">
            El proyecto aún no tiene una moneda definida.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
