import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { USERS } from '../constants.ts'
import type { User } from '../types.ts'

const SESSION_KEY = 'cepac-gestao-session'

type AuthContextValue = {
  user: User | null
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readSession(): User | null {
  try {
    const username = localStorage.getItem(SESSION_KEY)
    return USERS.find((item) => item.username === username) ?? null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readSession())

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login(username, password) {
        const found = USERS.find(
          (item) => item.username === username.trim().toLowerCase() && item.password === password,
        )
        if (!found) return false
        localStorage.setItem(SESSION_KEY, found.username)
        setUser(found)
        return true
      },
      logout() {
        localStorage.removeItem(SESSION_KEY)
        setUser(null)
      },
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return context
}
