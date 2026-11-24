import { Button, Typography } from '@mui/material'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import type { User } from '../types/User'
import { darkOutlinedButtonSx } from './styles'

interface HeaderProps {
  currentUser: User | null
  onLogin: () => void
  onRegister: () => void
  onLogout: () => void
}

export default function Header({ currentUser, onLogin, onRegister, onLogout }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <FitnessCenterIcon sx={{ color: '#a5b4fc', fontSize: '1.75rem' }} />
          <h1>Workout Cards</h1>
        </div>
        <div className="auth-buttons">
          {currentUser ? (
            <>
              <Typography variant="body2" sx={{ mr: 1, color: 'rgba(255,255,255,0.6)' }}>
                Welcome, {currentUser.displayName}
              </Typography>
              <Button variant="outlined" sx={darkOutlinedButtonSx} onClick={onLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outlined" sx={{ ...darkOutlinedButtonSx, mr: 0.5 }} onClick={onLogin}>
                Login
              </Button>
              <Button
                variant="contained"
                onClick={onRegister}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    boxShadow: '0 4px 18px rgba(99,102,241,0.45)',
                  },
                  boxShadow: '0 2px 10px rgba(99,102,241,0.3)',
                  transition: 'all 0.25s ease',
                }}
              >
                Register
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
