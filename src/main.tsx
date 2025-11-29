import React from 'react'
import ReactDOM from 'react-dom/client'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { CacheProvider } from '@emotion/react'
import { BrowserRouter } from 'react-router-dom'
import dayjs from 'dayjs'
import 'dayjs/locale/he'

import App from './App'
import { AuthProvider } from './context/AuthContext'
import createRtlCache from './styles/createRtlCache'
import theme from './styles/theme'

const rootElement = document.getElementById('app')

if (!rootElement) {
  throw new Error('אלמנט השורש לא נמצא ב־DOM')
}

document.documentElement.lang = 'he'
document.documentElement.dir = 'rtl'

const cache = createRtlCache()
dayjs.locale('he')

// Handle GitHub Pages 404 redirect
// If we were redirected from 404.html, restore the original path
const redirectPath = sessionStorage.getItem('githubPages404Redirect')
const isProduction = import.meta.env.PROD
const basePath = isProduction ? '/cal2list' : ''

if (redirectPath) {
  sessionStorage.removeItem('githubPages404Redirect')
  // Update the URL before React Router initializes
  const newPath = basePath + redirectPath
  if (window.location.pathname + window.location.search + window.location.hash !== newPath) {
    window.history.replaceState(null, '', newPath)
  }
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter basename={basePath || undefined}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </CacheProvider>
  </React.StrictMode>,
)
