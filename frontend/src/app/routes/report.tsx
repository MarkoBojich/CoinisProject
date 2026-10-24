import { useParams } from 'react-router'

import { ReportStarSlot } from '@/app/report-star-slot'
import { useCurrentUser } from '@/features/auth/api/use-auth'
import { ReportDetail } from '@/features/reports/components/report-detail'
import { ReportDetailSkeleton } from '@/features/reports/components/report-detail-skeleton'
import { ReportNotAvailable } from '@/features/reports/components/report-not-available'

export function Report() {
  const { id } = useParams()
  const reportId = Number(id)
  const { data: currentUser, isPending } = useCurrentUser()

  if (!Number.isInteger(reportId) || reportId <= 0) return <ReportNotAvailable />
  // Wait for the session so an author is not shown "not available" for their own pending report.
  if (isPending) return <ReportDetailSkeleton />

  return (
    <ReportDetail
      reportId={reportId}
      viewer={currentUser ?? null}
      renderStar={(report) => <ReportStarSlot report={report} currentUserId={currentUser?.id ?? null} />}
    />
  )
}
