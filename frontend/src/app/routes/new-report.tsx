import { useState } from 'react'

import { ReportFormGate } from '@/app/report-form-gate'
import { ReportForm } from '@/features/reports/components/report-form'
import { ReportSent } from '@/features/reports/components/report-sent'
import type { Report } from '@/features/reports/types'

export function NewReport() {
  const [sent, setSent] = useState<Report | null>(null)

  if (sent) return <ReportSent report={sent} />

  return (
    <section className="flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Report a problem</h1>
        <p className="text-muted-foreground">
          Add a photo, mark the place and describe the problem. The city checks every report before it is
          shown to others.
        </p>
      </div>

      <ReportFormGate>
        {({ currentUser, categories }) => (
          <ReportForm authorId={currentUser.id} categories={categories} onSaved={setSent} />
        )}
      </ReportFormGate>
    </section>
  )
}
