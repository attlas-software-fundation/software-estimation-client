import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ApiError } from "@/lib/api/api-error"

type CostsErrorStateProps = {
  error: unknown
  isFetching: boolean
  onRetry: () => void
}

export const CostsErrorState = ({
  error,
  isFetching,
  onRetry,
}: CostsErrorStateProps) => {
  let message =
    "No se pudo consultar el costo del proyecto. Comprueba tu conexión e inténtalo de nuevo."

  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        message =
          "La solicitud de costos no es válida. Comprueba el identificador del proyecto."
        break
      case 401:
        message =
          "Tu sesión ha expirado. Inicia sesión nuevamente para consultar los costos."
        break
      case 403:
        message =
          "Tu usuario no tiene permiso para consultar los costos de este proyecto."
        break
      case 404:
        message = "El proyecto no existe o fue eliminado."
        break
      case 409:
        message = error.message
        break
    }
  }

  return (
    <Alert variant="destructive">
      <AlertTitle>No se pudieron cargar los costos</AlertTitle>
      <AlertDescription>
        <p>{message}</p>
        <Button
          type="button"
          variant="outline"
          disabled={isFetching}
          onClick={onRetry}
        >
          {isFetching ? "Consultando…" : "Reintentar"}
        </Button>
      </AlertDescription>
    </Alert>
  )
}
