import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import EmojiNatureIcon from '@mui/icons-material/EmojiNature'
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import { Box, Button, Card, CardContent, MenuItem, Stack, TextField, Typography } from '@mui/material'

import { createMealEntry } from '../services/consumption'
import type { MealInput } from '../types'

interface AddMealFormProps {
  onSuccess: () => void
}

const emojiOptions = ['🥗', '🍱', '🍲', '🍛', '🥙', '🥞', '🧋', '🍎', '🍌', '🥑']

const AddMealForm = ({ onSuccess }: AddMealFormProps) => {
  const [formData, setFormData] = useState<MealInput>({
    name: '',
    calories: 0,
    emoji: '🥗',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isFormValid = useMemo(
    () => formData.name.trim().length > 1 && formData.calories > 0,
    [formData.calories, formData.name],
  )

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isFormValid) {
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await createMealEntry({
        ...formData,
        consumedAt: new Date().toISOString(),
      })
      setFormData({
        name: '',
        calories: 0,
        emoji: formData.emoji,
      })
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'אירעה שגיאה בעת שמירת הארוחה')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(63,181,114,0.12)',
                fontSize: 24,
              }}
            >
              {formData.emoji}
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                הוספת ארוחה חדשה
              </Typography>
              <Typography variant="body2" color="text.secondary">
                הזינו את הפרטים ושמרו על מסלול מאוזן 💚
              </Typography>
            </Box>
          </Stack>
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', md: '1.6fr 1fr 0.8fr' },
            }}
          >
            <Box>
              <TextField
                label="שם הארוחה"
                value={formData.name}
                required
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, name: event.target.value }))
                }
                placeholder="לדוגמה: סלט קינואה"
                InputProps={{
                  startAdornment: <RestaurantMenuIcon color="primary" sx={{ mr: 1 }} />,
                }}
              />
            </Box>
            <Box>
              <TextField
                label="קלוריות"
                type="number"
                value={formData.calories || ''}
                required
                inputProps={{ min: 0, step: 10 }}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    calories: Number(event.target.value),
                  }))
                }
                InputProps={{
                  startAdornment: <HealthAndSafetyIcon color="secondary" sx={{ mr: 1 }} />,
                }}
              />
            </Box>
            <Box>
              <TextField
                label="אימוג׳י"
                select
                value={formData.emoji}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    emoji: event.target.value,
                  }))
                }
              >
                {emojiOptions.map((emoji) => (
                  <MenuItem key={emoji} value={emoji}>
                    {emoji}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>
          {error && (
            <Typography color="error" display="flex" alignItems="center" gap={1}>
              <EmojiNatureIcon color="error" />
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={<AddCircleIcon />}
            disabled={!isFormValid || submitting}
          >
            שמירת הארוחה
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default AddMealForm

