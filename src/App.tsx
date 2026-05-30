import { useState } from 'react'
import './App.css'
import type { Exercise } from './types/Exercise'
import type { User } from './types/User'
import { getRandomExerciseByDifficulty, getAllExercises } from './utils/exerciseUtils'
import { createUser, authenticateUser, updateUserExercise, getUserExercises } from './utils/userUtils'
import ExerciseCard from './components/ExerciseCard'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  Typography,
  LinearProgress,
  Chip
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

function App() {
  const [showCards, setShowCards] = useState(false)
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([])
  const [viewMode, setViewMode] = useState<'random' | 'all' | 'edit'>('random')
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [showAuthWarningModal, setShowAuthWarningModal] = useState(false)

  const handleRandomExercises = () => {
    const userExercisesData = currentUser?.user_cards
    const beginner = getRandomExerciseByDifficulty(1, userExercisesData)
    const intermediate = getRandomExerciseByDifficulty(2, userExercisesData)
    const advanced = getRandomExerciseByDifficulty(3, userExercisesData)
    
    setSelectedExercises([beginner, intermediate, advanced])
    setViewMode('random')
    setShowCards(true)
  }

  const handleViewAllExercises = () => {
    if (!currentUser) {
      setShowAuthWarningModal(true)
      return
    }
    const userExercisesData = currentUser?.user_cards
    const allExercises = getAllExercises(userExercisesData)
    const sortedExercises = allExercises.sort((a, b) => a.difficulty - b.difficulty)
    
    setSelectedExercises(sortedExercises)
    setViewMode('all')
    setShowCards(true)
  }

  const handleBackToRandomCards = () => {
    const userExercisesData = currentUser?.user_cards
    const beginner = getRandomExerciseByDifficulty(1, userExercisesData)
    const intermediate = getRandomExerciseByDifficulty(2, userExercisesData)
    const advanced = getRandomExerciseByDifficulty(3, userExercisesData)
    
    setSelectedExercises([beginner, intermediate, advanced])
    setViewMode('random')
  }

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise)
    setViewMode('edit')
  }

  const handleBackToAllExercises = () => {
    // Always read fresh user_cards from the store so edits are reflected immediately
    const freshUserCards = currentUser ? getUserExercises(currentUser.id) : null
    const userExercisesData = freshUserCards ?? currentUser?.user_cards
    const allExercises = getAllExercises(userExercisesData)
    const sortedExercises = allExercises.sort((a, b) => a.difficulty - b.difficulty)

    setSelectedExercises(sortedExercises)
    setViewMode('all')
    setEditingExercise(null)
  }

  const handleSaveExercise = (updatedExercise: Exercise) => {
    if (currentUser) {
      const success = updateUserExercise(currentUser.id, updatedExercise.id, updatedExercise)
      if (success) {
        // Sync currentUser state with the updated in-memory user data
        const freshUserCards = getUserExercises(currentUser.id)
        if (freshUserCards) {
          setCurrentUser(prev => prev ? { ...prev, user_cards: freshUserCards } : prev)
        }
        console.log('Exercise saved to account:', currentUser.displayName, '-', updatedExercise.name)
      } else {
        console.error('Failed to save exercise')
      }
    }
    handleBackToAllExercises()
  }

  const handleRegisterClick = () => {
    setShowRegisterModal(true)
  }

  const handleCloseRegisterModal = () => {
    setShowRegisterModal(false)
  }

  const handleLoginClick = () => {
    setShowLoginModal(true)
  }

  const handleCloseLoginModal = () => {
    setShowLoginModal(false)
  }

  const handleUserRegistration = (displayName: string, email: string, password: string) => {
    try {
      const newUser = createUser(displayName, email, password)
      setCurrentUser(newUser)
      setShowRegisterModal(false)
      console.log('Registration successful:', { id: newUser.id, displayName: newUser.displayName, email: newUser.email })
    } catch (error) {
      console.error('Registration failed:', error)
      alert(`Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleUserLogin = (email: string, password: string) => {
    try {
      const user = authenticateUser(email, password)
      if (user) {
        setCurrentUser(user)
        setShowLoginModal(false)
        console.log('Login successful:', { id: user.id, displayName: user.displayName, email: user.email })
      } else {
        alert('Invalid email or password. Please check your credentials and try again.')
      }
    } catch (error) {
      console.error('Login failed:', error)
      alert(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setShowCards(false)
    setViewMode('random')
    setEditingExercise(null)
    setSelectedExercises([])
    console.log('User logged out')
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <h1>Exercise App</h1>
          </div>
          <div className="auth-buttons">
            {currentUser ? (
              <>
                <Typography variant="body2" sx={{ mr: 2, color: 'text.secondary' }}>
                  Welcome, {currentUser.displayName}
                </Typography>
                <Button variant="outlined" color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outlined" color="inherit" sx={{ mr: 1 }} onClick={handleLoginClick}>
                  Login
                </Button>
                <Button variant="contained" color="primary" onClick={handleRegisterClick}>
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      <div className="app-container">
        {!showCards ? (
          <Button 
            variant="contained" 
            size="large" 
            onClick={handleRandomExercises}
            sx={{ 
              fontSize: '1.2rem',
              px: 4,
              py: 1.5,
              borderRadius: 2
            }}
          >
            Show Cards
          </Button>
        ) : viewMode === 'edit' && editingExercise ? (
          <EditExerciseView 
            exercise={editingExercise}
            onBack={handleBackToAllExercises}
            onSave={handleSaveExercise}
          />
        ) : (
          <>
            {viewMode === 'all' && (
              <div className="back-button-container">
                <Button 
                  variant="outlined" 
                  color="inherit" 
                  onClick={handleBackToRandomCards}
                  startIcon={<span>←</span>}
                  sx={{ 
                    color: 'text.secondary',
                    borderColor: 'grey.300',
                    '&:hover': {
                      borderColor: 'grey.400',
                      backgroundColor: 'grey.50'
                    }
                  }}
                >
                  Back
                </Button>
              </div>
            )}
            <div className={`cards-container ${viewMode === 'all' ? 'all-exercises' : ''}`}>
              {selectedExercises.map((exercise) => (
                <ExerciseCard 
                  key={exercise.id} 
                  exercise={exercise} 
                  onClick={viewMode === 'all' ? () => handleEditExercise(exercise) : undefined}
                />
              ))}
            </div>
            {viewMode === 'random' && (
              <Box className="button-container" sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleRandomExercises}
                  sx={{ px: 3, py: 1 }}
                >
                  New Exercises
                </Button>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  onClick={handleViewAllExercises}
                  sx={{ px: 3, py: 1 }}
                >
                  View/Edit Exercise Cards
                </Button>
              </Box>
            )}
          </>
        )}
      </div>
      {showRegisterModal && (
        <RegisterModal onClose={handleCloseRegisterModal} onRegister={handleUserRegistration} />
      )}
      {showLoginModal && (
        <LoginModal onClose={handleCloseLoginModal} onLogin={handleUserLogin} />
      )}
      {showAuthWarningModal && (
        <Dialog
          open={true}
          onClose={() => setShowAuthWarningModal(false)}
          maxWidth="xs"
          fullWidth
          slotProps={{ paper: { sx: { borderRadius: 2, p: 1 } } }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600}>Login Required</Typography>
            <IconButton onClick={() => setShowAuthWarningModal(false)} size="small" sx={{ color: 'grey.500' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" color="text.secondary">
              You need to be logged in to view and edit exercise cards. Please log in or create an account to continue.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setShowAuthWarningModal(false)
                setShowRegisterModal(true)
              }}
            >
              Register
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setShowAuthWarningModal(false)
                setShowLoginModal(true)
              }}
            >
              Login
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  )
}

interface EditExerciseViewProps {
  exercise: Exercise
  onBack: () => void
  onSave: (exercise: Exercise) => void
}

function EditExerciseView({ exercise, onBack, onSave }: EditExerciseViewProps) {
  const [name, setName] = useState(exercise.name)
  const [difficulty, setDifficulty] = useState(exercise.difficulty)
  const [repsTime, setRepsTime] = useState(exercise.repsTime)
  const [cue, setCue] = useState(exercise.cue)

  const handleSave = () => {
    const updatedExercise: Exercise = {
      ...exercise,
      name,
      difficulty,
      repsTime,
      cue
    }
    onSave(updatedExercise)
  }

  const handleReset = () => {
    setName(exercise.name)
    setDifficulty(exercise.difficulty)
    setRepsTime(exercise.repsTime)
    setCue(exercise.cue)
  }

  return (
    <>
      <div className="back-button-container edit-page-back">
        <Button 
          variant="outlined" 
          color="inherit" 
          onClick={onBack}
          startIcon={<span>←</span>}
          sx={{ 
            color: 'text.secondary',
            borderColor: 'grey.300',
            '&:hover': {
              borderColor: 'grey.400',
              backgroundColor: 'grey.50'
            }
          }}
        >
          Back
        </Button>
      </div>
      <div className="edit-exercise-container">
        <div className="edit-content">
          <div className="edit-card-preview">
            <ExerciseCard exercise={{ ...exercise, name, difficulty, repsTime, cue }} />
          </div>
          <div className="edit-form">
            <div className="form-group">
              <label htmlFor="name">Exercise Name:</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="difficulty">Difficulty:</label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(Number(e.target.value))}
                className="form-select"
              >
                <option value={1}>Beginner</option>
                <option value={2}>Intermediate</option>
                <option value={3}>Advanced</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="repsTime">Reps/Time:</label>
              <input
                id="repsTime"
                type="text"
                value={repsTime}
                onChange={(e) => setRepsTime(e.target.value)}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="cue">Exercise Cue:</label>
              <input
                id="cue"
                type="text"
                value={cue}
                onChange={(e) => setCue(e.target.value)}
                className="form-input"
              />
            </div>
            
            <Box className="form-buttons" sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button 
                variant="outlined" 
                color="inherit" 
                onClick={handleReset}
                sx={{ 
                  color: 'text.secondary',
                  borderColor: 'grey.300'
                }}
              >
                Reset
              </Button>
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </Box>
          </div>
        </div>
      </div>
    </>
  )
}

export default App

interface RegisterModalProps {
  onClose: () => void
  onRegister: (displayName: string, email: string, password: string) => void
}
function RegisterModal({ onClose, onRegister }: RegisterModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verifyPassword, setVerifyPassword] = useState('')
  const [displayName, setDisplayName] = useState('')

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const getEmailError = () => {
    if (email === '') return ''
    if (!validateEmail(email)) return 'Please enter a valid email address'
    return ''
  }

  // Password strength calculation
  const getPasswordStrength = () => {
    if (password === '') return { strength: 0, label: '', color: 'grey' }

    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[^A-Za-z0-9]/.test(password)
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
    passwordStrength.strength >= 50 // Require at least "Fair" password

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isFormValid) {
      onRegister(displayName, email, password)
    }
  }

  return (
    <Dialog 
      open={true} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            p: 1
          }
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h2" fontWeight={600}>
          Create Account
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            autoFocus
            margin="normal"
            id="displayName"
            label="Display Name"
            type="text"
            fullWidth
            variant="outlined"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="normal"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={!!emailError}
            helperText={emailError || 'We\'ll use this to send you important updates'}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="normal"
            id="password"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 1 }}
          />
          
          {password && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Password Strength:
                </Typography>
                <Chip 
                  label={passwordStrength.label} 
                  size="small" 
                  color={passwordStrength.color as any}
                  variant="outlined"
                />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={passwordStrength.strength} 
                color={passwordStrength.color as any}
                sx={{ height: 6, borderRadius: 3 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                Use 8+ characters with uppercase, lowercase, numbers, and symbols
              </Typography>
            </Box>
          )}
          
          <TextField
            margin="normal"
            id="verifyPassword"
            label="Verify Password"
            type="password"
            fullWidth
            variant="outlined"
            value={verifyPassword}
            onChange={(e) => setVerifyPassword(e.target.value)}
            required
            error={verifyPassword !== '' && password !== verifyPassword}
            helperText={verifyPassword !== '' && password !== verifyPassword ? 'Passwords do not match' : ''}
          />
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={!isFormValid}
          >
            Create Account
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

interface LoginModalProps {
  onClose: () => void
  onLogin: (email: string, password: string) => void
}
function LoginModal({ onClose, onLogin }: LoginModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const getEmailError = () => {
    if (email === '') return ''
    if (!validateEmail(email)) return 'Please enter a valid email address'
    return ''
  }

  const emailError = getEmailError()
  const isFormValid = 
    email !== '' &&
    !emailError &&
    password !== ''

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isFormValid) {
      onLogin(email, password)
    }
  }

  return (
    <Dialog 
      open={true} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            p: 1
          }
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h2" fontWeight={600}>
          Sign In
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            autoFocus
            margin="normal"
            id="loginEmail"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={!!emailError}
            helperText={emailError}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="normal"
            id="loginPassword"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Button 
              variant="text" 
              size="small" 
              sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
            >
              Forgot password?
            </Button>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={!isFormValid}
            sx={{ minWidth: 100 }}
          >
            Sign In
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}