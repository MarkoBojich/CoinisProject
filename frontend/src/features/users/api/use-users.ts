import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { usersApi } from './users-api'
import type { NewUser, UsersFilters } from '../types'

export function useUsers(filters: UsersFilters = {}) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => usersApi.list(filters),
  })
}

export function useUser(id: number) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => usersApi.get(id),
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NewUser) => usersApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, changes }: { id: number; changes: Partial<NewUser> }) => usersApi.update(id, changes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => usersApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })
}
