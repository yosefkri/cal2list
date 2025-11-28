import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5678',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common.Authorization
  }
}

api.interceptors.response.use(
  (response) => {
    // Handle both 200 and 201 as success
    if (response.status === 200 || response.status === 201) {
      return response
    }
    return response
  },
  (error) => {
    // Check if it's a 201 status code (which shouldn't be in error, but just in case)
    if (error.response?.status === 201) {
      return Promise.resolve(error.response)
    }
    
    if (error.response) {
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        'אירעה שגיאה בלתי צפויה. נסו שוב מאוחר יותר.'
      return Promise.reject(new Error(message))
    }
    if (error.request) {
      return Promise.reject(new Error('לא התקבלה תגובה מהשרת. בדקו את החיבור.'))
    }
    return Promise.reject(error)
  },
)

export default api
