import { useState } from 'react'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  TextField,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface RegisterModalProps {
  onClose: () => void
  onRegister: (displayName: string, email: string, password: string) => void
}

export default function RegisterModal({ onClose, onRegister }: RegisterModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verifyPassword, setVerifyPassword] = useState('')
  const [displayName, setDisplayName] = useState('')

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const getEmailError = () => {
    if (email === '') return ''
    if (!validateEmail(email)) return 'Please enter a valid email address'
    return ''
  }

  const getPasswordStrength = (): {
    strength: number
    label: string
    color: 'primary' | 'error' | 'warning' | 'info' | 'success'
  } => {
    if (password === '') return { strength: 0, label: '', color: 'primary' }

    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[^A-Za-z0-9]/.test(password),
    }
    const score = Object.values(checks).filter(Boolean).length

    if (score <= 2) return { strength: 25, label: 'Weak', color: 'error' }
    if (score === 3) return { strength: 50, label: 'Fair', color: 'warning' }
    if (score === 4) return { strength: 75, label: 'Good', color: 'info' }
    return { strength: 100, label: 'Strong', color: 'success' }
  }

  const passwordStrength = getPasswordStrength()
  const emailError = getEmailError()
  const isFormValid =
    displayName.trim() !== '' &&
    email !== '' &&
    !emailError &&
    password !== '' &&
    verifyPassword !== '' &&
    password === verifyPassword &&
    passwordStrength.strength >= 50

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (isFormValid) onRegister(displayName, email, password)
  }

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 2, p: 1 } } }}>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h2" fontWeight={600}>Create Account</Typography>
        <IconButton aria-label="close" onClick={onClose} sx={{ color: (theme) => theme.palette.grey[500] }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          <TextField autoFocus margin="normal" id="displayName" label="Display Name" type="text" fullWidth variant="outlined" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required sx={{ mb: 2 }} />
          <TextField margin="normal" id="email" label="Email Address" type="email" fullWidth variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} required error={!!emailError} helperText={emailError || "We'll use this to send you important updates"} sx={{ mb: 2 }} />
          <TextField margin="normal" id="password" label="Password" type="password" fullWidth variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} required sx={{ mb: 1 }} />
          {password && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Password Strength:</Typography>
                <Chip label={passwordStrength.label} size="small" color={passwordStrength.color} variant="outlined" />
              </Box>
              <LinearProgress variant="determinate" value={passwordStrength.strength} color={passwordStrength.color} sx={{ height: 6, borderRadius: 3 }} />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                Use 8+ characters with uppercase, lowercase, numbers, and symbols
              </Typography>
            </Box>
          )}
          <TextField margin="normal" id="verifyPassword" label="Verify Password" type="password" fullWidth variant="outlined" value={verifyPassword} onChange={(e) => setVerifyPassword(e.target.value)} required error={verifyPassword !== '' && password !== verifyPassword} helperText={verifyPassword !== '' && password !== verifyPassword ? 'Passwords do not match' : ''} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" color="primary" disabled={!isFormValid}>Create Account</Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
