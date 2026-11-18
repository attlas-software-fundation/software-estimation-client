"use client"

import { useState } from "react"
import {
  BookOpenIcon,
  CalculatorIcon,
  ClockIcon,
  SlidersHorizontalIcon,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { SprintCalculation } from "./sprint-calculation"
import { SprintTeamConfigForm } from "./sprint-team-config-form"
import { TaskHoursTable } from "./task-hours-table"
import { UserStoryTable } from "./user-story-table"

type EstimationViewProps = {
  projectId: string
}

export const EstimationView = ({ projectId }: EstimationViewProps) => {
  const [activeTab, setActiveTab] = useState<string>("config")

  const getTriggerClass = (tabKey: string) =>
    cn(
      "flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-all cursor-pointer border border-transparent",
      activeTab === tabKey
        ? "!bg-primary !text-primary-foreground font-semibold shadow-xs"
        : "text-muted-foreground hover:bg-background/80 hover:text-foreground font-medium"
    )

  return (
    <div className="flex min-h-full w-full flex-col gap-6 pb-16">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Estimación ágil</h1>
        <p className="text-muted-foreground text-sm">
          Planificación de sprints, puntos de historia y esfuerzo estimado.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex w-full flex-col gap-6"
      >
        <div className="w-full overflow-x-auto pb-1">
          <TabsList className="bg-muted/40 inline-flex h-auto items-center gap-1.5 rounded-xl border p-1.5 shadow-xs">
            <TabsTrigger value="config" className={getTriggerClass("config")}>
              <SlidersHorizontalIcon className="size-4 shrink-0" />
              <span>Configuración de sprint</span>
            </TabsTrigger>
            <TabsTrigger
              value="historias"
              className={getTriggerClass("historias")}
            >
              <BookOpenIcon className="size-4 shrink-0" />
              <span>Puntos por historia</span>
            </TabsTrigger>
            <TabsTrigger value="horas" className={getTriggerClass("horas")}>
              <ClockIcon className="size-4 shrink-0" />
              <span>Horas por tarea</span>
            </TabsTrigger>
            <TabsTrigger value="calculo" className={getTriggerClass("calculo")}>
              <CalculatorIcon className="size-4 shrink-0" />
              <span>Cálculo y resumen</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="w-full">
          <TabsContent value="config" className="mt-0 outline-none">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">
                  Parámetros del sprint
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SprintTeamConfigForm projectId={projectId} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="historias" className="mt-0 outline-none">
            <UserStoryTable projectId={projectId} />
          </TabsContent>

          <TabsContent value="horas" className="mt-0 outline-none">
            <TaskHoursTable projectId={projectId} />
          </TabsContent>

          <TabsContent value="calculo" className="mt-0 outline-none">
            <SprintCalculation projectId={projectId} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
