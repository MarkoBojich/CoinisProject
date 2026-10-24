import { Skeleton } from '@/components/ui/skeleton'

export function ReportFormSkeleton() {
  return (
    <div className="flex max-w-2xl flex-col gap-8" aria-busy="true">
      <Skeleton className="aspect-[4/3] w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-72 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}
