import { Outlet } from 'react-router-dom'
import BreakfastDiningIcon from '@mui/icons-material/BreakfastDining'
import LogoutIcon from '@mui/icons-material/Logout'
import { Avatar, Box, Container, IconButton, Stack, Toolbar, Typography } from '@mui/material'
import AppBar from '@mui/material/AppBar'

import { useAuth } from '../../hooks/useAuth'

const MainLayout = () => {
  const { user, logout } = useAuth()

  return (
    <Stack minHeight="100vh" bgcolor="background.default">
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          borderBottom: '1px solid rgba(63,181,114,0.16)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Toolbar>
          <Stack direction="row" alignItems="center" spacing={2} flex={1}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
              }}
            >
              <BreakfastDiningIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                יומן קלוריות
              </Typography>
              <Typography variant="body2" color="text.secondary">
                מעקב בריא ומדויק לכל השנה 🌿
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box textAlign="right">
              <Typography variant="subtitle1" fontWeight={600}>
                {user?.name ?? 'טוב לראות אותך!'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email ?? 'המשיכו לשמור על רצף בריא 💪'}
              </Typography>
            </Box>
            <Avatar
              src={user?.photoUrl}
              alt={user?.name ?? 'משתמש'}
              sx={{
                bgcolor: 'secondary.main',
              }}
            >
              {user?.name?.[0] ?? '😊'}
            </Avatar>
            <IconButton color="primary" onClick={logout} aria-label="יציאה מהמערכת">
              <LogoutIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container sx={{ flex: 1, py: 4 }} maxWidth="lg">
        <Outlet />
      </Container>
    </Stack>
  )
}

export default MainLayout


