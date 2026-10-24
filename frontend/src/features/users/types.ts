export type UserRole = 'citizen' | 'administrator'

export type User = {
  id: number
  name: string
  email: string
  role: UserRole
  avatarUrl?: string
  createdAt: string
}

export type NewUser = Omit<User, 'id' | 'createdAt'>

export type UsersFilters = {
  search?: string
  role?: UserRole
}
