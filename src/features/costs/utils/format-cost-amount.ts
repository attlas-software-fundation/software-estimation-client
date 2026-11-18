import { CurrencyCode } from "@/enumeration/currency-code"
import { formatCurrency } from "@/lib/format"

export const formatCostAmount = (
  amount: number,
  currency: CurrencyCode | null = CurrencyCode.PEN
) => {
  if (currency === null) {
    return new Intl.NumberFormat("es-PE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return formatCurrency(amount)
}
