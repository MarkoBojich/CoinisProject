import { Plus } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'

// The one orange action of a page: sticky at the bottom on phones, inline from `md` up.
export function ReportProblemButton() {
  return (
    <div className="fixed inset-x-4 bottom-4 z-10 md:static md:inset-auto">
      <Button
        asChild
        size="lg"
        className="h-11 w-full bg-accent text-accent-foreground shadow-md hover:bg-accent/90 md:w-auto md:shadow-none"
      >
        <Link to="/reports/new">
          <Plus aria-hidden="true" />
          Report a problem
        </Link>
      </Button>
    </div>
  )
}
