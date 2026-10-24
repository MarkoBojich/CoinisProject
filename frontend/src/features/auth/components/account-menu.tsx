import { ChevronDown, LogOut } from 'lucide-react'
import { Link, useLocation } from 'react-router'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useCurrentUser, useSignOut } from '../api/use-auth'

const roleLabels = { citizen: 'Citizen', administrator: 'Administrator' }

function getInitials(name: string) {
  const words = name.trim().split(/\s+/)
  const first = words[0]?.[0] ?? ''
  const last = words.length > 1 ? (words.at(-1)?.[0] ?? '') : ''
  return (first + last).toUpperCase()
}

// Shown in the page header. A visitor gets a "Sign in" button; a signed-in user gets a profile button
// (initials and name) that opens a menu with who they are and "Sign out".
export function AccountMenu() {
  const location = useLocation()
  const { data: currentUser, isPending } = useCurrentUser()
  const signOut = useSignOut()

  if (isPending) return null

  if (!currentUser) {
    // Come back to the page the visitor was on, except from the sign-in pages themselves.
    const onAuthPage = location.pathname === '/sign-in' || location.pathname === '/sign-up'
    const target = onAuthPage
      ? '/sign-in'
      : `/sign-in?from=${encodeURIComponent(location.pathname + location.search)}`

    return (
      <Button asChild variant="outline" className="h-11 shadow-none">
        <Link to={target}>Sign in</Link>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-11 gap-2 px-2 shadow-none sm:px-3"
          aria-label={`Account menu for ${currentUser.name}`}
        >
          <span
            aria-hidden="true"
            className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
          >
            {getInitials(currentUser.name)}
          </span>
          <span className="hidden max-w-32 truncate text-sm font-semibold sm:inline">{currentUser.name}</span>
          <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-1">
          <span className="truncate font-semibold">{currentUser.name}</span>
          <span className="text-xs font-normal text-muted-foreground">{roleLabels[currentUser.role]}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="min-h-11" disabled={signOut.isPending} onSelect={() => signOut.mutate()}>
          <LogOut aria-hidden="true" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
