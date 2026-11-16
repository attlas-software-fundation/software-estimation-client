import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ProfileCostBreakdown } from "../types/profile-cost-breakdown"
import { formatCostAmount } from "../utils/format-cost-amount"

type ProfileCostDistributionChartProps = {
  profileBreakdown: readonly ProfileCostBreakdown[]
  totalCost: number
}

export const ProfileCostDistributionChart = ({
  profileBreakdown,
  totalCost,
}: ProfileCostDistributionChartProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Distribución de costos por perfil</CardTitle>
      <CardDescription>
        Participación de cada perfil en el costo base del proyecto.
      </CardDescription>
    </CardHeader>
    <CardContent>
      {profileBreakdown.length === 0 || totalCost <= 0 ? (
        <p role="status" className="text-muted-foreground text-sm">
          Aún no hay costos positivos para mostrar una distribución.
        </p>
      ) : (
        <ul
          className="space-y-4"
          aria-label="Porcentaje del costo base por perfil técnico"
        >
          {profileBreakdown.map((profile) => {
            const share = profile.totalCost / totalCost
            const percentage = new Intl.NumberFormat("es-PE", {
              style: "percent",
              maximumFractionDigits: 1,
            }).format(share)

            return (
              <li key={profile.profileId} className="space-y-1.5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
                  <span className="min-w-0 font-medium break-all">
                    {profile.profileName}
                  </span>
                  <span className="tabular-nums">
                    {formatCostAmount(profile.totalCost, profile.currency)} ·{" "}
                    {percentage}
                  </span>
                </div>
                <div
                  aria-hidden="true"
                  className="bg-muted h-3 overflow-hidden rounded-full"
                >
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{
                      width: `${Math.min(100, Math.max(0, share * 100))}%`,
                    }}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </CardContent>
  </Card>
)
