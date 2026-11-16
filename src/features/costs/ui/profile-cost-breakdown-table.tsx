import { UserIcon } from "lucide-react"
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
import { formatCostAmount } from "../utils/format-cost-amount"
import { TableEmptyState } from "@/components/table-empty-state"
import type { ProfileCostBreakdown } from "../types/profile-cost-breakdown"
import { CostProfileIdentity } from "./cost-profile-identity"

interface ProfileCostBreakdownTableProps {
  profileBreakdown: readonly ProfileCostBreakdown[]
}

export const ProfileCostBreakdownTable = ({
  profileBreakdown,
}: ProfileCostBreakdownTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Desglose por perfil técnico</CardTitle>
        <CardDescription>
          Subtotales consolidados por perfil y horas de sus contribuciones.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {profileBreakdown.length === 0 ? (
          <TableEmptyState
            message="No hay perfiles con costos calculados aún."
            icon={UserIcon}
          />
        ) : (
          <Table aria-label="Desglose de costos por perfil técnico">
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Perfil técnico (ID)</TableHead>
                <TableHead scope="col" className="text-right">
                  Horas totales
                </TableHead>
                <TableHead scope="col" className="text-right">
                  CER por hora
                </TableHead>
                <TableHead scope="col" className="text-right">
                  Costo total
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profileBreakdown.map((profile) => (
                <TableRow key={profile.profileId}>
                  <TableCell>
                    <CostProfileIdentity
                      name={profile.profileName}
                      role={profile.profileRole}
                      email={profile.profileEmail}
                    />
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {profile.totalHours} h
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {profile.cer === null
                      ? "Variable por contribución"
                      : `${formatCostAmount(profile.cer, profile.currency)} / h`}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCostAmount(profile.totalCost, profile.currency)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
