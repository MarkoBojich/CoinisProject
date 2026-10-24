import { Link } from 'react-router'

import { Button } from '@/components/ui/button'

// Shown for an unknown id and for reports the viewer is not allowed to see, so the two look the same.
export function ReportNotAvailable() {
  return (
    <div role="status" className="flex flex-col items-start gap-4 rounded-lg border p-6">
      <div>
        <h1 className="text-xl font-semibold">Report not available</h1>
        <p className="mt-2 text-muted-foreground">This report does not exist or is not public.</p>
      </div>
      <Button asChild variant="outline" className="h-11 shadow-none">
        <Link to="/">Back to all reports</Link>
      </Button>
    </div>
  )
}
