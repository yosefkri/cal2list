import { Suspense, lazy, useMemo } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'

import ProtectedRoute from './components/ProtectedRoute'
import MainLayout from './components/layout/MainLayout'

const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const RegistrationSuccessPage = lazy(() => import('./pages/RegistrationSuccessPage'))

const App = () => {
  const loader = useMemo(
    () => (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        gap={2}
        textAlign="center"
      >
        <CircularProgress />
      </Box>
    ),
    [],
  )

  return (
    <Suspense fallback={loader}>
      <Routes>
        <Route path="/" element={<Navigate to="/יומן" replace />} />
        <Route path="/" element={<MainLayout />}>
          <Route
            path="/יומן"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/כניסה" element={<LoginPage />} />
        <Route path="/הרשמה" element={<RegisterPage />} />
        <Route path="/הרשמה-הצליחה" element={<RegistrationSuccessPage />} />
        <Route path="*" element={<Navigate to="/יומן" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
