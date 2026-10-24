import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { NotFoundError } from '@/lib/mock-db'

import { useReport } from '../api/use-reports'
import type { Report, ReportViewer } from '../types'
import { canEditReport, canViewReport } from './report-access'
import { ReportFormSkeleton } from './report-form-skeleton'
import { ReportForm } from './report-form'
import { ReportNotAvailable } from './report-not-available'

type ReportEditorProps = {
  reportId: number
  viewer: ReportViewer
  categories: { id: number; name: string }[]
  onSaved: (report: Report) => void
}

// Loads a report and shows the edit form, or says why it cannot be edited.
export function ReportEditor({ reportId, viewer, categories, onSaved }: ReportEditorProps) {
  const { data: report, isLoading, error, refetch } = useReport(reportId)

  if (isLoading) return <ReportFormSkeleton />

  if (error instanceof NotFoundError) return <ReportNotAvailable />

  if (error) {
    return (
      <div role="alert" className="flex flex-col items-start gap-4 rounded-lg border p-6">
        <p>The report could not be loaded. Please check your connection and try again.</p>
        <Button variant="outline" className="h-11 shadow-none" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    )
  }

  if (!report || !canViewReport(report, viewer)) return <ReportNotAvailable />

  if (!canEditReport(report, viewer)) {
    return (
      <div role="status" className="flex flex-col items-start gap-4 rounded-lg border p-6">
        <div>
          <h2 className="text-xl font-semibold">This report cannot be edited</h2>
          <p className="mt-2 text-muted-foreground">
            You can only edit your own reports while they are waiting for approval.
          </p>
        </div>
        <Button asChild variant="outline" className="h-11 shadow-none">
          <Link to={`/reports/${report.id}`}>Back to the report</Link>
        </Button>
      </div>
    )
  }

  return <ReportForm authorId={report.author.id} categories={categories} report={report} onSaved={onSaved} />
}
