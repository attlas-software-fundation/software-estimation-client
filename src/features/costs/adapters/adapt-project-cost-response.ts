import type { ProjectCostResponse } from "../types/project-cost-response"
import type { ProjectCostSummary } from "../types/project-cost-summary"

export const adaptProjectCostResponse = (
  response: ProjectCostResponse | null | undefined
): ProjectCostSummary => {
  if (!response) {
    throw new Error(
      "El servidor no devolvió el resumen de costos del proyecto."
    )
  }

  const contributions = response.tasks.flatMap((task) => task.contributions)

  return {
    totalCost: response.total.amount,
    currency: response.total.currency,
    taskCosts: response.tasks.map((task) => ({
      taskId: task.taskId,
      taskName: task.taskId,
      totalHours: task.contributions.reduce(
        (total, item) => total + item.hours,
        0
      ),
      totalCost: task.total.amount,
      currency: task.total.currency,
      contributions: task.contributions,
      profiles: task.contributions.map((item) => ({
        profileId: item.technicalProfileId,
        profileName: item.technicalProfileId,
        profileRole: "",
        profileEmail: "",
      })),
    })),
    profileBreakdown: response.profiles.map((profile) => {
      const items = contributions.filter(
        (item) => item.technicalProfileId === profile.technicalProfileId
      )
      const first = items[0]

      if (!first) {
        throw new Error(
          "El desglose de costos contiene un perfil sin contribuciones."
        )
      }

      return {
        profileId: profile.technicalProfileId,
        profileName: profile.technicalProfileId,
        profileRole: "",
        profileEmail: "",
        totalHours: items.reduce((total, item) => total + item.hours, 0),
        cer: items.every((item) => item.hourlyRate === first.hourlyRate)
          ? first.hourlyRate
          : null,
        totalCost: profile.subtotal.amount,
        currency: profile.subtotal.currency,
      }
    }),
  }
}
