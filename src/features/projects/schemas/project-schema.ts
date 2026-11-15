import { z } from "zod"
import { refineDateRange } from "@/lib/date-range"

export const projectSchema = z
  .object({
    name: z
      .string()
      .min(1, "El nombre del proyecto es obligatorio")
      .max(150, "El nombre del proyecto no puede superar los 150 caracteres"),
    description: z
      .string()
      .trim()
      .max(500, "La descripción no puede superar los 500 caracteres")
      .refine((value) => value.length === 0 || value.length >= 10, {
        message: "La descripción debe tener al menos 10 caracteres",
      }),
    type: z.string().min(1, "Selecciona el tipo de proyecto"),
    startDate: z.date().or(z.undefined()),
    plannedDate: z.date().or(z.undefined()),
    responsibleId: z.string().min(1, "Selecciona un responsable"),
    status: z.string().min(1, "Selecciona el estado"),
  })
  .superRefine((data, ctx) => {
    refineDateRange(ctx, data.startDate, data.plannedDate, {
      start: ["startDate"],
      end: ["plannedDate"],
    })
  })

export type ProjectFormValues = z.infer<typeof projectSchema>
export type ProjectEditFormValues = ProjectFormValues
