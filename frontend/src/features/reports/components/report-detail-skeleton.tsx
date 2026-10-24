import { Skeleton } from '@/components/ui/skeleton'

export function ReportDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true">
      <Skeleton className="h-6 w-32" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-x-8">
        <div className="flex flex-col gap-6">
          <Skeleton className="aspect-[4/3] w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  )
}
