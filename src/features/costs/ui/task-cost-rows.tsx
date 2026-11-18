import { TableCell, TableRow } from "@/components/ui/table"
import type { TaskCost } from "../types/task-cost"
import { formatCostAmount } from "../utils/format-cost-amount"
import { CostProfileIdentity } from "./cost-profile-identity"

type TaskCostRowsProps = {
  task: TaskCost
  taskIndex: number
}

export const TaskCostRows = ({ task, taskIndex }: TaskCostRowsProps) => {
  const contributions = task.contributions ?? []
  const groupTone = taskIndex % 2 === 0 ? "bg-slate-50" : "bg-white"
  const taskSplit = taskIndex > 0 ? "border-t-2 border-t-slate-400" : ""

  if (contributions.length === 0) {
    return (
      <TableRow className={`${groupTone} ${taskSplit} hover:bg-slate-100`}>
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
    <TableRow
      key={contribution.technicalProfileId}
      className={`${groupTone} ${index === 0 ? taskSplit : "border-slate-200"} hover:bg-slate-100`}
    >
      {index === 0 && (
        <TableCell
          rowSpan={contributions.length}
          className="border-r border-slate-200 align-top font-medium"
        >
          {task.taskName}
          <span className="text-muted-foreground mt-1 block text-xs">
            {task.totalHours} h en total
          </span>
        </TableCell>
      )}
      <TableCell>
        <CostProfileIdentity
          name={contribution.profileName}
          role={contribution.profileRole}
          email={contribution.profileEmail}
        />
      </TableCell>
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
          className="border-l border-slate-200 text-right align-top font-semibold tabular-nums"
        >
          {formatCostAmount(task.totalCost, task.currency)}
        </TableCell>
      )}
    </TableRow>
  ))
}
