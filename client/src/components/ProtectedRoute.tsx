import type { ReactElement } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/כניסה"
        replace
        state={{
          from: location,
        }}
      />
    )
  }

  return children
}

export default ProtectedRoute

