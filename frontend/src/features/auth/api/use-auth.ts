import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { authApi } from './auth-api'
import type { Credentials, NewAccount } from '../types'

// `null` data means nobody is signed in (a visitor).
export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authApi.me(),
    staleTime: Infinity,
  })
}

export function useSignIn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (credentials: Credentials) => authApi.signIn(credentials),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['auth'] }),
  })
}

export function useSignUp() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (account: NewAccount) => authApi.signUp(account),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['auth'] }),
  })
}

export function useSignOut() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => authApi.signOut(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['auth'] }),
  })
}
