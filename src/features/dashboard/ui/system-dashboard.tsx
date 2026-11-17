"use client"

import {
  BanknoteIcon,
  Clock3Icon,
  FolderKanbanIcon,
  LayersIcon,
  type LucideIcon,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { PROJECT_STATUS_LABELS, PROJECT_TYPE_LABELS } from "@/enumeration"
import { useDashboardSummary } from "@/features/dashboard/hooks/use-dashboard"
import { formatCurrency } from "@/lib/format"

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

const query = {
  filters: [],
  pagination: {
    pageNumber: 0,
    pageSize: 1,
    orderBy: "createdAt",
    sortDirection: "DESC" as const,
  },
}

const colorAt = (index: number) => CHART_COLORS[index % CHART_COLORS.length]

export const SystemDashboard = () => {
  const { data, isLoading, isError } = useDashboardSummary(query)

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
        <Skeleton className="h-96 md:col-span-2" />
        <Skeleton className="h-96 md:col-span-2" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <p className="text-muted-foreground text-sm">
        No se pudo cargar el dashboard.
      </p>
    )
  }

  const statusRows = data.projectsByStatus ?? []
  const typeRows = data.projectsByType ?? []
  const costRows = data.costByProject ?? []

  const statusConfig = Object.fromEntries(
    statusRows.map((item, index) => [
      item.status,
      { label: PROJECT_STATUS_LABELS[item.status], color: colorAt(index) },
    ])
  ) satisfies ChartConfig

  const statusData = statusRows.map((item) => ({
    status: item.status,
    value: item.count,
    fill: `var(--color-${item.status})`,
  }))

  const typeConfig = {
    value: { label: "Proyectos", color: "var(--chart-1)" },
  } satisfies ChartConfig

  const typeData = typeRows.map((item) => ({
    name: PROJECT_TYPE_LABELS[item.type],
    value: item.count,
  }))

  const costConfig = {
    costo: { label: "Costo", color: "var(--chart-2)" },
  } satisfies ChartConfig

  const costData = costRows.map((item) => ({
    name: item.projectName,
    costo: item.totalCost,
  }))

  const leadingStatus = [...statusRows].sort((a, b) => b.count - a.count)[0]
  const leadingType = [...typeRows].sort((a, b) => b.count - a.count)[0]

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Vista general del sistema.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.projectCount != null ? (
          <Kpi
            label="Proyectos"
            value={String(data.projectCount)}
            hint={
              data.projectsWithEstimation != null
                ? `${data.projectsWithEstimation} con estimación`
                : "Según tu acceso a proyectos"
            }
            icon={FolderKanbanIcon}
          />
        ) : null}
        {data.totalStoryPoints != null ? (
          <Kpi
            label="Puntos"
            value={String(data.totalStoryPoints)}
            hint="Story points de las estimaciones"
            icon={LayersIcon}
          />
        ) : null}
        {data.totalTimeDays != null ? (
          <Kpi
            label="Tiempo"
            value={`${data.totalTimeDays}`}
            hint="Días sumados de las estimaciones"
            icon={Clock3Icon}
          />
        ) : null}
        {data.totalCost != null ? (
          <Kpi
            label="Costo"
            value={formatCurrency(data.totalCost)}
            hint="Costo sumado de las estimaciones"
            icon={BanknoteIcon}
          />
        ) : null}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {data.projectsByStatus != null ? (
          <Card>
            <CardHeader>
              <CardTitle>Proyectos por estado</CardTitle>
              <CardDescription>Distribución del portafolio.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={statusConfig}
                className="mx-auto aspect-square max-h-64"
              >
                <PieChart>
                  <ChartTooltip
                    content={<ChartTooltipContent hideLabel nameKey="status" />}
                  />
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="status"
                    innerRadius={58}
                    strokeWidth={2}
                  />
                  <ChartLegend
                    content={<ChartLegendContent nameKey="status" />}
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
            <CardFooter>
              <p className="text-muted-foreground text-sm">
                {leadingStatus
                  ? `${PROJECT_STATUS_LABELS[leadingStatus.status]} concentra ${leadingStatus.count} proyectos.`
                  : "Todavía no hay proyectos."}
              </p>
            </CardFooter>
          </Card>
        ) : null}

        {data.projectsByType != null ? (
          <Card>
            <CardHeader>
              <CardTitle>Proyectos por tipo</CardTitle>
              <CardDescription>
                Cantidad según el tipo de proyecto.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={typeConfig}
                className="aspect-auto h-64 w-full"
              >
                <BarChart data={typeData} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    interval={0}
                    angle={-18}
                    height={56}
                  />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="value" fill="var(--color-value)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter>
              <p className="text-muted-foreground text-sm">
                {leadingType
                  ? `${PROJECT_TYPE_LABELS[leadingType.type]} es el tipo con más proyectos.`
                  : "Todavía no hay proyectos."}
              </p>
            </CardFooter>
          </Card>
        ) : null}
      </div>

      {data.costByProject != null ? (
        <Card>
          <CardHeader>
            <CardTitle>Costo de las estimaciones más altas</CardTitle>
            <CardDescription>
              Hasta ocho proyectos, ordenados por costo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={costConfig}
              className="aspect-auto h-80 w-full"
            >
              <BarChart
                data={costData}
                layout="vertical"
                accessibilityLayer
                margin={{ left: 8 }}
              >
                <CartesianGrid horizontal={false} />
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  width={148}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                  }
                />
                <Bar dataKey="costo" fill="var(--color-costo)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter>
            <p className="text-muted-foreground text-sm">
              {costRows[0]
                ? `${costRows[0].projectName} encabeza con ${formatCurrency(costRows[0].totalCost)}.`
                : "Todavía no hay estimaciones con costo."}
            </p>
          </CardFooter>
        </Card>
      ) : null}
    </div>
  )
}

const Kpi = ({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string
  value: string
  hint: string
  icon: LucideIcon
}) => (
  <Card>
    <CardHeader>
      <CardDescription>{label}</CardDescription>
      <CardTitle className="text-2xl font-semibold tabular-nums">
        {value}
      </CardTitle>
      <CardAction>
        <Icon className="text-muted-foreground size-4" />
      </CardAction>
    </CardHeader>
    <CardFooter>
      <p className="text-muted-foreground text-sm">{hint}</p>
    </CardFooter>
  </Card>
)
