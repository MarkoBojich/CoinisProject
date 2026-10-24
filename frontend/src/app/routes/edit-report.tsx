import { useNavigate, useParams } from 'react-router'

import { ReportFormGate } from '@/app/report-form-gate'
import { ReportEditor } from '@/features/reports/components/report-editor'
import { ReportNotAvailable } from '@/features/reports/components/report-not-available'

export function EditReport() {
  const { id } = useParams()
  const navigate = useNavigate()
  const reportId = Number(id)

  if (!Number.isInteger(reportId) || reportId <= 0) return <ReportNotAvailable />

  return (
    <section className="flex max-w-2xl flex-col gap-6">
      <h1 className="text-3xl font-bold">Edit report</h1>

      <ReportFormGate>
        {({ currentUser, categories }) => (
          <ReportEditor
            reportId={reportId}
            viewer={currentUser}
            categories={categories}
            onSaved={(report) => navigate(`/reports/${report.id}`)}
          />
        )}
      </ReportFormGate>
    </section>
  )
}
