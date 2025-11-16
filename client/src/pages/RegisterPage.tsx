import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import AppRegistrationIcon from '@mui/icons-material/AppRegistration'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Link as RouterLink, Navigate, useLocation, useNavigate } from 'react-router-dom'
import type { Location } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

const RegisterPage = () => {
  const { isAuthenticated, register, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [age, setAge] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [sex, setSex] = useState('')
  const [workoutDays, setWorkoutDays] = useState('')
  const [goal, setGoal] = useState('')
  const [referralSource, setReferralSource] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const redirectPath = (location.state as { from?: Location })?.from?.pathname ?? '/יומן'

  const isFormValid = useMemo(() => {
    const trimmedName = fullName.trim()
    return (
      trimmedName.length > 1 &&
      /\S+@\S+\.\S+/.test(email) &&
      password.length >= 6 &&
      password === confirmPassword &&
      age.length > 0 &&
      height.length > 0 &&
      weight.length > 0 &&
      sex.length > 0 &&
      workoutDays.length > 0 &&
      goal.length > 0 &&
      referralSource.length > 0
    )
  }, [confirmPassword, email, fullName, password, age, height, weight, sex, workoutDays, goal, referralSource])

  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isFormValid) {
      return
    }
    setError(null)
    setSuccessMessage(null)
    try {
      const response = await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        age,
        height,
        weight,
        sex,
        workoutDays,
        goal,
        referralSource
      })
      
      // Check if registration was successful with 201 status or has a confirmation message
      if ((response as any).status === 201 || (response as any).message) {
        // Navigate to success page with message and email
        const message = (response as any).message || 'ההרשמה הצליחה! אפשר להיכנס עם הפרטים שהזנתם.'
        navigate('/הרשמה-הצליחה', {
          replace: true,
          state: { 
            message,
            email: email.trim() 
          },
        })
      } else if (response.token) {
        // If token is provided without message, user is automatically logged in
        navigate(redirectPath, { replace: true })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ההרשמה נכשלה. נסו שוב מאוחר יותר.')
    }
  }

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{
        backgroundImage:
          'linear-gradient(180deg, rgba(63,181,114,0.18), rgba(47,128,237,0.14))',
        py: 4,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 600,
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
                <AppRegistrationIcon fontSize="large" />
              </Box>
              <Typography variant="h4" fontWeight={800}>
                הצטרפות ליומן הבריא
              </Typography>
              <Typography color="text.secondary">
                מלאו את הפרטים וגלו חוויית מעקב קלילה וצבעונית 🥦
              </Typography>
            </Stack>

            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
              }}
            >
              {/* Full Name */}
              <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                <TextField
                  label="שם מלא"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                  placeholder="לדוגמה: יוסי קריכלי"
                />
              </Box>

              {/* Email */}
              <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                <TextField
                  label="דוא״ל"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  placeholder="name@example.com"
                />
              </Box>

              {/* Password */}
              <Box sx={{ gridColumn: 'span 1' }}>
                <TextField
                  label="סיסמה"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  helperText="לפחות 6 תווים"
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
              </Box>

              {/* Confirm Password */}
              <Box sx={{ gridColumn: 'span 1' }}>
                <TextField
                  label="אימות סיסמה"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  error={confirmPassword.length > 0 && confirmPassword !== password}
                  helperText={
                    confirmPassword.length > 0 && confirmPassword !== password
                      ? 'הסיסמאות אינן תואמות'
                      : 'הזינו שוב לוודא שלא נפלה טעות'
                  }
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
              </Box>

              {/* Age */}
              <Box sx={{ gridColumn: 'span 1' }}>
                <TextField
                  label="גיל"
                  type="number"
                  value={age}
                  onChange={(event) => setAge(event.target.value)}
                  required
                  placeholder="לדוגמה: 37"
                  InputProps={{
                    inputProps: { min: 1, max: 120 }
                  }}
                />
              </Box>

              {/* Sex */}
              <Box sx={{ gridColumn: 'span 1' }}>
                <FormControl fullWidth required>
                  <InputLabel>מין</InputLabel>
                  <Select
                    value={sex}
                    label="מין"
                    onChange={(event) => setSex(event.target.value)}
                  >
                    <MenuItem value="זכר">זכר</MenuItem>
                    <MenuItem value="נקבה">נקבה</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Height */}
              <Box sx={{ gridColumn: 'span 1' }}>
                <TextField
                  label="גובה (ס״מ)"
                  type="number"
                  value={height}
                  onChange={(event) => setHeight(event.target.value)}
                  required
                  placeholder="לדוגמה: 182"
                  InputProps={{
                    inputProps: { min: 50, max: 250 }
                  }}
                />
              </Box>

              {/* Weight */}
              <Box sx={{ gridColumn: 'span 1' }}>
                <TextField
                  label="משקל (ק״ג)"
                  type="number"
                  value={weight}
                  onChange={(event) => setWeight(event.target.value)}
                  required
                  placeholder="לדוגמה: 89"
                  InputProps={{
                    inputProps: { min: 20, max: 300 }
                  }}
                />
              </Box>

              {/* Workout Days */}
              <Box sx={{ gridColumn: 'span 1' }}>
                <FormControl fullWidth required>
                  <InputLabel>ימי אימון בשבוע</InputLabel>
                  <Select
                    value={workoutDays}
                    label="ימי אימון בשבוע"
                    onChange={(event) => setWorkoutDays(event.target.value)}
                  >
                    <MenuItem value="1-2">1-2</MenuItem>
                    <MenuItem value="3-4">3-4</MenuItem>
                    <MenuItem value="5-7">5-7</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Goal */}
              <Box sx={{ gridColumn: 'span 1' }}>
                <FormControl fullWidth required>
                  <InputLabel>מטרה</InputLabel>
                  <Select
                    value={goal}
                    label="מטרה"
                    onChange={(event) => setGoal(event.target.value)}
                  >
                    <MenuItem value="גירעון קלורי">גירעון קלורי</MenuItem>
                    <MenuItem value="שמירה על קלוריות">שמירה על קלוריות</MenuItem>
                    <MenuItem value="בניית מסת שריר">בניית מסת שריר</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Referral Source */}
              <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                <FormControl fullWidth required>
                  <InputLabel>איך שמעתם עלינו?</InputLabel>
                  <Select
                    value={referralSource}
                    label="איך שמעתם עלינו?"
                    onChange={(event) => setReferralSource(event.target.value)}
                  >
                    <MenuItem value="Crossfit Savoy">Crossfit Savoy</MenuItem>
                    <MenuItem value="Facebook">Facebook</MenuItem>
                    <MenuItem value="Instagram">Instagram</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {error && (
              <Typography color="error" textAlign="center">
                {error}
              </Typography>
            )}
            {successMessage && (
              <Typography color="success.main" textAlign="center" display="flex" gap={1} justifyContent="center">
                <CheckCircleIcon color="success" />
                {successMessage}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={!isFormValid || loading}
              startIcon={loading ? <CircularProgress size={20} /> : undefined}
            >
              פתיחת חשבון
            </Button>

            <Typography variant="body2" color="text.secondary" textAlign="center">
              כבר יש לכם חשבון?{' '}
              <Typography
                component={RouterLink}
                to="/כניסה"
                sx={{ fontWeight: 600, color: 'primary.main', textDecoration: 'none' }}
              >
                התחברו כאן
              </Typography>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}

export default RegisterPage
