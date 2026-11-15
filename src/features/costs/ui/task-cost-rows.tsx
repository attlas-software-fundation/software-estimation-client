import { TableCell, TableRow } from "@/components/ui/table"
import type { TaskCost } from "../types/task-cost"
import { formatCostAmount } from "../utils/format-cost-amount"
import { CostProfileIdentity } from "./cost-profile-identity"

type TaskCostRowsProps = {
  task: TaskCost
}

export const TaskCostRows = ({ task }: TaskCostRowsProps) => {
  const contributions = task.contributions ?? []

  if (contributions.length === 0) {
    return (
      <TableRow>
        <TableCell className="font-medium">{task.taskName}</TableCell>
        <TableCell>
          <div className="flex flex-col gap-2">
            {task.profiles.map((profile) => (
              <CostProfileIdentity
                key={profile.profileId}
                name={profile.profileName}
                role={profile.profileRole}
                email={profile.profileEmail}
              />
            ))}
          </div>
        </TableCell>
        <TableCell className="text-right tabular-nums">
          {task.totalHours} h
        </TableCell>
        <TableCell className="text-right">—</TableCell>
        <TableCell className="text-right">—</TableCell>
        <TableCell className="text-right tabular-nums">
          {formatCostAmount(task.totalCost, task.currency)}
        </TableCell>
      </TableRow>
    )
  }

  return contributions.map((contribution, index) => (
    <TableRow key={contribution.technicalProfileId}>
      {index === 0 && (
        <TableCell
          rowSpan={contributions.length}
          className="align-top font-medium"
        >
          {task.taskName}
          <span className="text-muted-foreground mt-1 block text-xs">
            {task.totalHours} h en total
          </span>
        </TableCell>
      )}
      <TableCell>{contribution.technicalProfileId}</TableCell>
      <TableCell className="text-right tabular-nums">
        {contribution.hours} h
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {formatCostAmount(contribution.hourlyRate, contribution.cost.currency)}{" "}
        / h
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {formatCostAmount(contribution.cost.amount, contribution.cost.currency)}
      </TableCell>
      {index === 0 && (
        <TableCell
          rowSpan={contributions.length}
          className="text-right align-top font-medium tabular-nums"
        >
          {formatCostAmount(task.totalCost, task.currency)}
        </TableCell>
      )}
    </TableRow>
  ))
}
