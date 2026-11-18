"use client"

import { ReceiptIcon } from "lucide-react"
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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TableEmptyState } from "@/components/table-empty-state"
import type { TaskCost } from "../types/task-cost"
import { TaskCostRows } from "./task-cost-rows"

type TaskCostsTableProps = {
  taskCosts: readonly TaskCost[]
}

export const TaskCostsTable = ({ taskCosts }: TaskCostsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Costos por tarea</CardTitle>
        <CardDescription>
          Detalle de horas, CER horario y costo por perfil de cada tarea.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {taskCosts.length === 0 ? (
          <TableEmptyState
            message="No hay costos calculados. Asigna horas y perfiles a las tareas para ver los costos."
            icon={ReceiptIcon}
          />
        ) : (
          <Table aria-label="Costos por tarea y contribución de cada perfil">
            <TableHeader className="bg-slate-100 [&_tr]:border-b-2 [&_tr]:border-slate-300 [&_tr]:hover:bg-transparent">
              <TableRow className="hover:bg-transparent">
                <TableHead scope="col" className="text-slate-700">
                  Tarea
                </TableHead>
                <TableHead scope="col" className="text-slate-700">
                  Perfil técnico
                </TableHead>
                <TableHead scope="col" className="text-right text-slate-700">
                  Horas
                </TableHead>
                <TableHead scope="col" className="text-right text-slate-700">
                  CER por hora
                </TableHead>
                <TableHead scope="col" className="text-right text-slate-700">
                  Costo por contribución
                </TableHead>
                <TableHead scope="col" className="text-right text-slate-700">
                  Total de la tarea
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taskCosts.map((task, index) => (
                <TaskCostRows key={task.taskId} task={task} taskIndex={index} />
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
