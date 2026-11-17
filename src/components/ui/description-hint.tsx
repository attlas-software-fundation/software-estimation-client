type DescriptionHintProps = {
  error: string
  hint: string
  length?: number
  max?: number
}

export const DescriptionHint = ({
  error,
  hint,
  length,
  max,
}: DescriptionHintProps) => {
  const overMax = max != null && length != null && length > max

  return (
    <div className="flex items-center justify-between gap-2">
      {error ? (
        <p className="text-destructive text-xs">{error}</p>
      ) : (
        <p className="text-muted-foreground text-xs">{hint}</p>
      )}
      {max != null && length != null ? (
        <p
          className={
            overMax
              ? "text-destructive shrink-0 text-xs tabular-nums"
              : "text-muted-foreground shrink-0 text-xs tabular-nums"
          }
        >
          {length}/{max}
        </p>
      ) : null}
    </div>
  )
}
