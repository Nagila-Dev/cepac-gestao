import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.tsx'

export function RequireAuth() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}

export function RequireAdmin() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return <Outlet />
}
