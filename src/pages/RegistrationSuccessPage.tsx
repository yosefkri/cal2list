import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LoginIcon from '@mui/icons-material/Login'
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from '@mui/material'
import { Link as RouterLink, useLocation } from 'react-router-dom'

const RegistrationSuccessPage = () => {
  const location = useLocation()
  const message = (location.state as any)?.message || 'ההרשמה הצליחה! אפשר להיכנס עם הפרטים שהזנתם.'
  const email = (location.state as any)?.email || ''

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{
        backgroundImage:
          'linear-gradient(180deg, rgba(63,181,114,0.18), rgba(47,128,237,0.14))',
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 520,
          borderRadius: 8,
          boxShadow: '0 24px 40px rgba(63,181,114,0.18)',
        }}
      >
        <CardContent>
          <Stack spacing={4} alignItems="center" textAlign="center">
            {/* Success Icon */}
            <Box
              sx={{
                width: 96,
                height: 96,
                borderRadius: '50%',
                backgroundImage: 'linear-gradient(135deg,#3fb572,#2a9d8f)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 56 }} />
            </Box>

            {/* Success Title */}
            <Typography variant="h4" fontWeight={800} color="success.main">
              ההרשמה הצליחה!
            </Typography>

            {/* Server Message */}
            <Typography variant="body1" color="text.secondary" sx={{ px: 2 }}>
              {message}
            </Typography>

            {/* Email Reminder */}
            {email && (
              <Box
                sx={{
                  backgroundColor: 'grey.100',
                  borderRadius: 2,
                  p: 2,
                  width: '100%',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  כתובת הדוא״ל שלכם:
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {email}
                </Typography>
              </Box>
            )}

            {/* Login Button */}
            <Button
              component={RouterLink}
              to="/כניסה"
              state={{ email }}
              variant="contained"
              size="large"
              fullWidth
              startIcon={<LoginIcon />}
              sx={{ mt: 2 }}
            >
              המשך לכניסה למערכת
            </Button>

            {/* Alternative Link */}
            <Typography variant="body2" color="text.secondary">
              או{' '}
              <Typography
                component={RouterLink}
                to="/"
                sx={{ fontWeight: 600, color: 'primary.main', textDecoration: 'none' }}
              >
                חזרה לדף הבית
              </Typography>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}

export default RegistrationSuccessPage
