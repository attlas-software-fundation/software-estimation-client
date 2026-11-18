import { z } from "zod"
import { refineDateRange } from "@/lib/date-range"

export const ALL_PROJECT_FILTER_VALUE = "all"

export const projectFiltersSchema = z
  .object({
    name: z.string(),
    type: z.string(),
    responsibleId: z.string(),
    status: z.string(),
    startDate: z.date().or(z.undefined()),
    plannedDate: z.date().or(z.undefined()),
  })
  .superRefine((data, ctx) => {
    refineDateRange(
      ctx,
      data.startDate,
      data.plannedDate,
      {
        start: ["startDate"],
        end: ["plannedDate"],
      },
      { required: false }
    )
  })
