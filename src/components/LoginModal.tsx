import { useState } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface LoginModalProps {
  onClose: () => void
  onLogin: (email: string, password: string) => void
}

export default function LoginModal({ onClose, onLogin }: LoginModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  const emailError = email === '' ? '' : validateEmail(email) ? '' : 'Please enter a valid email address'
  const isFormValid = email !== '' && !emailError && password !== ''

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (isFormValid) onLogin(email, password)
  }

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 2, p: 1 } } }}>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h2" fontWeight={600}>Sign In</Typography>
        <IconButton aria-label="close" onClick={onClose} sx={{ color: (theme) => theme.palette.grey[500] }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          <TextField autoFocus margin="normal" id="loginEmail" label="Email Address" type="email" fullWidth variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} required error={!!emailError} helperText={emailError} sx={{ mb: 2 }} />
          <TextField margin="normal" id="loginPassword" label="Password" type="password" fullWidth variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} required sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Button variant="text" size="small" sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}>Forgot password?</Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" color="primary" disabled={!isFormValid} sx={{ minWidth: 100 }}>Sign In</Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
