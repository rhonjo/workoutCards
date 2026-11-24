import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface AuthWarningDialogProps {
  onClose: () => void
  onRegister: () => void
  onLogin: () => void
}

export default function AuthWarningDialog({ onClose, onRegister, onLogin }: AuthWarningDialogProps) {
  return (
    <Dialog open={true} onClose={onClose} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: 2, p: 1 } } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={600}>Login Required</Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: 'grey.500' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="text.secondary">
          You need to be logged in to view and edit exercise cards. Please log in or create an account to continue.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button variant="outlined" onClick={onRegister}>Register</Button>
        <Button variant="contained" color="primary" onClick={onLogin}>Login</Button>
      </DialogActions>
    </Dialog>
  )
}
