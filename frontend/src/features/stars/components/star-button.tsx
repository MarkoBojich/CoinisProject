import { cva } from 'class-variance-authority'
import { Star } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'

import { useCreateStar, useRemoveStar, useStars } from '../api/use-stars'

const starButtonVariants = cva(
  'inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
  {
    variants: {
      starred: {
        true: 'text-foreground',
        false: 'text-muted-foreground hover:text-foreground',
      },
    },
  },
)

const starIconVariants = cva('size-5', {
  variants: {
    starred: {
      true: 'fill-accent text-accent',
      false: '',
    },
  },
})

type StarButtonProps = {
  reportId: number
  starCount: number
  // The signed-in user's id, or null for a visitor (the route reads it from `auth`).
  currentUserId: number | null
}

// Optimistic star toggle. While the mutation is pending (including the refetch that follows it)
// the button already shows the new state and count; if the request fails it goes back and says so.
export function StarButton({ reportId, starCount, currentUserId }: StarButtonProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: myStars } = useStars(
    { userId: currentUserId ?? undefined },
    { enabled: currentUserId !== null },
  )
  const create = useCreateStar()
  const remove = useRemoveStar()

  const myStar = myStars?.find((star) => star.reportId === reportId)
  const starred = create.isPending ? true : remove.isPending ? false : myStar !== undefined
  const count = starCount + (create.isPending ? 1 : 0) - (remove.isPending ? 1 : 0)

  function handleClick() {
    if (currentUserId === null) {
      navigate(`/sign-in?from=${encodeURIComponent(location.pathname + location.search)}`)
      return
    }
    if (create.isPending || remove.isPending) return
    if (myStar) remove.mutate(myStar.id)
    else create.mutate({ reportId, userId: currentUserId })
  }

  return (
    <div className="flex items-center gap-2">
      {(create.isError || remove.isError) && (
        <span role="alert" className="text-xs text-destructive">
          Could not update. Try again.
        </span>
      )}
      <button
        type="button"
        aria-pressed={starred}
        onClick={handleClick}
        className={starButtonVariants({ starred })}
      >
        <Star className={starIconVariants({ starred })} aria-hidden="true" />
        <span className="sr-only">
          {currentUserId === null ? 'Sign in to star this report' : 'Star this report'}
        </span>
        <span className="tabular-nums">{count}</span>
      </button>
    </div>
  )
}
