import { CircleCheck } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'

import type { Report } from '../types'

type ReportSentProps = {
  report: Report
}

// Confirmation after a report was created. It starts as pending, so it is not public yet.
export function ReportSent({ report }: ReportSentProps) {
  return (
    <div role="status" className="flex max-w-2xl flex-col items-start gap-4 rounded-lg border p-6">
      <CircleCheck className="size-8 text-success" aria-hidden="true" />
      <div>
        <h1 className="text-xl font-semibold">Your report was sent</h1>
        <p className="mt-2 text-muted-foreground">
          It will appear on the public list after the city has checked it. You can still see it and change it
          until then.
        </p>
      </div>
      <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
        <Button asChild size="lg" className="h-11 shadow-none">
          <Link to={`/reports/${report.id}`}>View your report</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="h-11 shadow-none">
          <Link to="/">Back to all reports</Link>
        </Button>
      </div>
    </div>
  )
}
