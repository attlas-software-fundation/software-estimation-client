"use client"

import { useForm } from "@tanstack/react-form"
import { SaveIcon, XIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { FormSubmitButton } from "@/components/ui/form-submit-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NumberInput } from "@/components/ui/number-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
import { getErrorMessage, getFieldError } from "@/lib/form-errors"
import {
  profileSchema,
  type ProfileFormValues,
} from "../schemas/profile-schema"
import { useCreateProfile, useUpdateProfile } from "../hooks"
import {
  CurrencyCode,
  EXPERIENCE_LEVEL_LABELS,
  EXPERIENCE_LEVEL_OPTIONS,
  TECHNICAL_ROLE_LABELS,
  TECHNICAL_ROLE_OPTIONS,
  type ExperienceLevelValue,
  type Profile,
  type TechnicalRoleValue,
} from "../types"

type ProfileFormProps = {
  profile?: Profile | null
  onSuccess?: () => void
  onCancel?: () => void
}

export const ProfileForm = ({
  profile,
  onSuccess,
  onCancel,
}: ProfileFormProps) => {
  const isEditing = Boolean(profile)
  const createProfileMutation = useCreateProfile()
  const updateProfileMutation = useUpdateProfile()

  const defaultValues: ProfileFormValues = {
    name: profile ? profile.name : "",
    role: profile ? profile.role : "FRONTEND",
    hourlyRate: profile ? profile.hourlyRate : 0,
    currency: profile ? profile.currency : CurrencyCode.PEN,
    experienceLevel: profile ? profile.experienceLevel : "MID",
    email: profile ? profile.email : "",
    isActive: profile ? profile.isActive : true,
  }

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: profileSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        if (isEditing && profile) {
          await updateProfileMutation.mutateAsync({
            id: profile.id,
            ...value,
          })
          toast.add({
            title: "Perfil actualizado",
            description: `Los datos de ${value.name} se guardaron correctamente.`,
            type: "success",
          })
        } else {
          await createProfileMutation.mutateAsync(value)
          toast.add({
            title: "Perfil creado",
            description: `${value.name} se registró correctamente.`,
            type: "success",
          })
        }
        onSuccess?.()
      } catch (error) {
        toast.add({
          title: "No se pudo guardar el perfil",
          description: getErrorMessage(error, "Inténtalo de nuevo."),
          type: "error",
        })
      }
    },
  })

  const isSubmitting =
    createProfileMutation.isPending || updateProfileMutation.isPending
  const submitError = createProfileMutation.error || updateProfileMutation.error

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
      className="space-y-4"
    >
      {submitError && (
        <Alert variant="destructive">
          <AlertTitle>Error al guardar perfil</AlertTitle>
          <AlertDescription>{submitError.message}</AlertDescription>
        </Alert>
      )}
      <form.Field name="name">
        {(field) => (
          <div className="space-y-1.5">
            <Label htmlFor={field.name}>Nombre completo</Label>
            <Input
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Ej. Ana García"
              disabled={isSubmitting}
            />
            {getFieldError(field.state.meta.errors) ? (
              <p className="text-destructive text-xs">
                {getFieldError(field.state.meta.errors)}
              </p>
            ) : null}
          </div>
        )}
      </form.Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <form.Field name="role">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor={field.name}>Rol técnico</Label>
              <Select
                value={field.state.value}
                onValueChange={(val) => {
                  if (val) field.handleChange(val as TechnicalRoleValue)
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger id={field.name} className="w-full">
                  <SelectValue placeholder="Selecciona un rol">
                    {TECHNICAL_ROLE_LABELS[field.state.value]}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {TECHNICAL_ROLE_OPTIONS.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getFieldError(field.state.meta.errors) ? (
                <p className="text-destructive text-xs">
                  {getFieldError(field.state.meta.errors)}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>

        <form.Field name="experienceLevel">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor={field.name}>Nivel de seniority</Label>
              <Select
                value={field.state.value}
                onValueChange={(val) => {
                  if (val) field.handleChange(val as ExperienceLevelValue)
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger id={field.name} className="w-full">
                  <SelectValue placeholder="Selecciona nivel">
                    {EXPERIENCE_LEVEL_LABELS[field.state.value]}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_LEVEL_OPTIONS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getFieldError(field.state.meta.errors) ? (
                <p className="text-destructive text-xs">
                  {getFieldError(field.state.meta.errors)}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <form.Field name="hourlyRate">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor={field.name}>Costo estándar / hora (CER)</Label>
              <NumberInput
                id={field.name}
                value={field.state.value}
                min={0}
                max={9999}
                step={0.5}
                disabled={isSubmitting}
                invalid={Boolean(getFieldError(field.state.meta.errors))}
                className=""
                onBlur={field.handleBlur}
                onChange={field.handleChange}
              />
              {getFieldError(field.state.meta.errors) ? (
                <p className="text-destructive text-xs">
                  {getFieldError(field.state.meta.errors)}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>

        <form.Field name="currency">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor={field.name}>Moneda</Label>
              <Select
                value={CurrencyCode.PEN}
                onValueChange={() => {
                  field.handleChange(CurrencyCode.PEN)
                }}
                disabled
              >
                <SelectTrigger id={field.name} className="w-full">
                  <SelectValue placeholder="PEN (S/)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CurrencyCode.PEN}>PEN (S/)</SelectItem>
                </SelectContent>
              </Select>
              {getFieldError(field.state.meta.errors) ? (
                <p className="text-destructive text-xs">
                  {getFieldError(field.state.meta.errors)}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>
      </div>

      <form.Field name="email">
        {(field) => (
          <div className="space-y-1.5">
            <Label htmlFor={field.name}>Correo electrónico</Label>
            <Input
              id={field.name}
              type="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Ej. ana@empresa.com"
              disabled={isSubmitting}
            />
            {getFieldError(field.state.meta.errors) ? (
              <p className="text-destructive text-xs">
                {getFieldError(field.state.meta.errors)}
              </p>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Field name="isActive">
        {(field) => (
          <div className="flex items-center gap-2">
            <Checkbox
              id={field.name}
              checked={field.state.value}
              disabled={isSubmitting}
              onCheckedChange={(checked) =>
                field.handleChange(checked === true)
              }
            />
            <Label htmlFor={field.name}>Perfil activo</Label>
          </div>
        )}
      </form.Field>

      <div className="flex justify-end gap-2 pt-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <XIcon />
            Cancelar
          </Button>
        )}
        <FormSubmitButton
          form={form}
          schema={profileSchema}
          isPending={isSubmitting}
        >
          {({ isBusy }) => (
            <>
              <SaveIcon />
              {isBusy
                ? "Guardando..."
                : isEditing
                  ? "Actualizar perfil"
                  : "Registrar perfil"}
            </>
          )}
        </FormSubmitButton>
      </div>
    </form>
  )
}
