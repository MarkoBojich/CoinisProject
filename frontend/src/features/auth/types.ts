export type CurrentUser = {
  id: number
  name: string
  role: 'citizen' | 'administrator'
}

export type Credentials = {
  email: string
  password: string
}

// What a visitor sends to create an account. The role is never sent: a new account is always a citizen.
export type NewAccount = Credentials & {
  name: string
}
