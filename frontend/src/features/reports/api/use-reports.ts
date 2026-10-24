import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { NotFoundError } from '@/lib/mock-db'

import { reportsApi } from './reports-api'
import type { NewReport, ReportChanges, ReportsFilters } from '../types'

export function useReports(filters: ReportsFilters = {}) {
  return useQuery({
    queryKey: ['reports', filters],
    queryFn: () => reportsApi.list(filters),
    // Keep showing the previous list while a new search or filter loads, instead of flashing skeletons.
    placeholderData: keepPreviousData,
  })
}

export function useReport(id: number) {
  return useQuery({
    queryKey: ['reports', id],
    queryFn: () => reportsApi.get(id),
    // A report that does not exist will not appear on retry; show "not available" right away.
    retry: (failureCount, error) => !(error instanceof NotFoundError) && failureCount < 3,
  })
}

export function useUploadPhoto() {
  return useMutation({
    mutationFn: (file: File) => reportsApi.uploadPhoto(file),
  })
}

export function useCreateReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NewReport) => reportsApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reports'] }),
  })
}

export function useUpdateReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, changes }: { id: number; changes: ReportChanges }) => reportsApi.update(id, changes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reports'] }),
  })
}

export function useDeleteReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => reportsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reports'] }),
  })
}
