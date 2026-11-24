import { Button } from '@mui/material'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'

interface HeroSectionProps {
  onShowCards: () => void
}

export default function HeroSection({ onShowCards }: HeroSectionProps) {
  return (
    <div className="hero-section">
      <div className="hero-icon-wrapper">
        <FitnessCenterIcon sx={{ fontSize: '3rem', color: '#a5b4fc' }} />
      </div>
      <h2 className="hero-title">Workout Cards</h2>
      <p className="hero-subtitle">Discover your perfect daily workout</p>
      <Button
        variant="contained"
        size="large"
        onClick={onShowCards}
        sx={{
          mt: 1.5,
          fontSize: '1.05rem',
          px: 5,
          py: 1.5,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            boxShadow: '0 10px 28px rgba(99,102,241,0.48)',
          },
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 18px rgba(99,102,241,0.32)',
          letterSpacing: '0.01em',
        }}
      >
        Show Cards
      </Button>
    </div>
  )
}
