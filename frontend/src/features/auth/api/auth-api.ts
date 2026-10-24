import { delay, userTable, type UserRecord } from '@/lib/mock-db'

import type { Credentials, CurrentUser, NewAccount } from '../types'

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Email or password is not correct')
  }
}

export class EmailAlreadyUsedError extends Error {
  constructor() {
    super('An account with this email already exists')
  }
}

// The session is only the signed-in user's id in localStorage; the backend will use a cookie instead.
const SESSION_KEY = 'fixmycity.session'

const toCurrentUser = ({ id, name, role }: UserRecord): CurrentUser => ({ id, name, role })

const sameEmail = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase()

// localStorage can throw (private window, blocked site data), so a failure means "signed out".
function readSessionId() {
  try {
    const id = Number(localStorage.getItem(SESSION_KEY))
    return Number.isInteger(id) && id > 0 ? id : null
  } catch {
    return null
  }
}

function writeSessionId(id: number | null) {
  try {
    if (id === null) localStorage.removeItem(SESSION_KEY)
    else localStorage.setItem(SESSION_KEY, String(id))
  } catch {
    // Without storage the mock session simply does not persist.
  }
}

export const authApi = {
  // No `delay`: reading the session is instant, and a delay would flash the signed-out state on every page load.
  me: (): Promise<CurrentUser | null> => {
    const account = userTable.rows().find((u) => u.id === readSessionId())
    return Promise.resolve(account ? toCurrentUser(account) : null)
  },

  // Accounts created by signing up need their own password; seeded accounts accept any non-empty one.
  signIn: ({ email, password }: Credentials) => {
    const account = userTable.rows().find((u) => sameEmail(u.email, email))
    const passwordMatches = account?.password === undefined ? password !== '' : account.password === password
    if (!account || !passwordMatches) return Promise.reject(new InvalidCredentialsError())
    writeSessionId(account.id)
    return delay(toCurrentUser(account))
  },

  // A new account is always a citizen and is signed in right away.
  signUp: ({ name, email, password }: NewAccount) => {
    if (userTable.rows().some((u) => sameEmail(u.email, email))) {
      return Promise.reject(new EmailAlreadyUsedError())
    }
    const account: UserRecord = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: 'citizen',
      createdAt: new Date().toISOString().slice(0, 10),
      password,
    }
    userTable.add(account)
    writeSessionId(account.id)
    return delay(toCurrentUser(account))
  },

  signOut: () => {
    writeSessionId(null)
    return delay(undefined)
  },
}
