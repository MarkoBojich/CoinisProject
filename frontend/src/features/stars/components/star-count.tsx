import { Star } from 'lucide-react'

type StarCountProps = {
  count: number
}

// The count without a button: for the author's own report and for reports that can no longer be starred.
export function StarCount({ count }: StarCountProps) {
  return (
    <span className="inline-flex min-h-11 items-center gap-2 px-3 text-sm font-semibold text-muted-foreground">
      <Star className="size-5" aria-hidden="true" />
      <span className="sr-only">Stars:</span>
      <span className="tabular-nums">{count}</span>
    </span>
  )
}
