import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { starsApi } from './stars-api'
import type { NewStar, StarsFilters } from '../types'

export function useStars(filters: StarsFilters = {}, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ['stars', filters],
    queryFn: () => starsApi.list(filters),
    enabled: options.enabled ?? true,
  })
}

export function useStar(id: number) {
  return useQuery({
    queryKey: ['stars', id],
    queryFn: () => starsApi.get(id),
  })
}

// A star changes a report's starCount, so reports are refetched too. The key is only a string:
// this feature does not import `reports`. Returning the promise keeps the mutation pending until
// the refetch is done, which lets the star button show the new state meanwhile.
export function useCreateStar() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NewStar) => starsApi.create(input),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['stars'] }),
        queryClient.invalidateQueries({ queryKey: ['reports'] }),
      ]),
  })
}

export function useRemoveStar() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => starsApi.remove(id),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['stars'] }),
        queryClient.invalidateQueries({ queryKey: ['reports'] }),
      ]),
  })
}
