import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Link as RouterLink, Navigate, useLocation } from 'react-router-dom'
import type { Location } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

const LoginPage = () => {
  const { isAuthenticated, login, loading } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const redirectPath = (location.state as { from?: Location })?.from?.pathname ?? '/יומן'

  useEffect(() => {
    const prefillEmail = (location.state as { email?: string })?.email
    if (prefillEmail) {
      setEmail(prefillEmail)
    }
  }, [location.state])

  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    try {
      await login(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'הכניסה נכשלה. בדקו את הפרטים.')
    }
  }

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{
        backgroundImage:
          'linear-gradient(180deg, rgba(63,181,114,0.14), rgba(255,179,71,0.14))',
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 420,
          borderRadius: 8,
          boxShadow: '0 24px 40px rgba(63,181,114,0.18)',
        }}
      >
        <CardContent>
          <Stack component="form" spacing={3} onSubmit={handleSubmit}>
            <Stack spacing={1} textAlign="center">
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  margin: '0 auto',
                  backgroundImage: 'linear-gradient(135deg,#3fb572,#2a9d8f)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <RestaurantIcon fontSize="large" />
              </Box>
              <Typography variant="h4" fontWeight={800}>
                ברוכים השבים!
              </Typography>
              <Typography color="text.secondary">
                התחברו כדי לנהל את יומן הקלוריות שלכם בקלות ובחיוך 😊
              </Typography>
            </Stack>
            <TextField
              label="דוא״ל"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              fullWidth
              placeholder="name@example.com"
            />
            <TextField
              label="סיסמה"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {error && (
              <Typography color="error" textAlign="center">
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : undefined}
            >
              כניסה למערכת
            </Button>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              הנתונים נשמרים ב־n8n ומאובטחים היטב 🔐
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              עדיין אין לכם חשבון?{' '}
              <Typography
                component={RouterLink}
                to="/הרשמה"
                sx={{ fontWeight: 600, color: 'primary.main', textDecoration: 'none' }}
              >
                הרשמו כאן
              </Typography>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}

export default LoginPage

