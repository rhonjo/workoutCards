import { useEffect, useState } from 'react'
import './App.css'
import type { Exercise } from './types/Exercise'
import type { User } from './types/User'
import { getRandomExerciseByDifficulty, getAllExercises } from './utils/exerciseUtils'
import {
  createUser,
  authenticateUser,
  updateUserExercise,
  getUserExercises,
  getSession,
  logoutUser,
} from './utils/userUtils'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import ExerciseCardsView from './components/ExerciseCardsView'
import EditExerciseView from './components/EditExerciseView'
import RegisterModal from './components/RegisterModal'
import LoginModal from './components/LoginModal'
import AuthWarningDialog from './components/AuthWarningDialog'

function App() {
  const [showCards, setShowCards] = useState(false)
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([])
  const [viewMode, setViewMode] = useState<'random' | 'all' | 'edit'>('random')
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [showAuthWarningModal, setShowAuthWarningModal] = useState(false)

  useEffect(() => {
    getSession().then(setCurrentUser)
  }, [])

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
    const allExercises = getAllExercises(currentUser.user_cards)
    setSelectedExercises(allExercises.sort((a, b) => a.difficulty - b.difficulty))
    setViewMode('all')
    setShowCards(true)
  }

  const handleBackToRandomCards = () => {
    const userExercisesData = currentUser?.user_cards
    setSelectedExercises([
      getRandomExerciseByDifficulty(1, userExercisesData),
      getRandomExerciseByDifficulty(2, userExercisesData),
      getRandomExerciseByDifficulty(3, userExercisesData),
    ])
    setViewMode('random')
  }

  const handleBackToAllExercises = async () => {
    const freshUserCards = currentUser ? await getUserExercises(currentUser.id) : null
    const userExercisesData = freshUserCards ?? currentUser?.user_cards
    const allExercises = getAllExercises(userExercisesData)
    setSelectedExercises(allExercises.sort((a, b) => a.difficulty - b.difficulty))
    setViewMode('all')
    setEditingExercise(null)
  }

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise)
    setViewMode('edit')
  }

  const handleSaveExercise = async (updatedExercise: Exercise) => {
    if (currentUser) {
      const success = await updateUserExercise(currentUser.id, updatedExercise.id, updatedExercise)
      if (success) {
        const freshUserCards = await getUserExercises(currentUser.id)
        if (freshUserCards) {
          setCurrentUser((previous) => previous ? { ...previous, user_cards: freshUserCards } : previous)
        }
        console.log('Exercise saved to account:', currentUser.displayName, '-', updatedExercise.name)
      } else {
        console.error('Failed to save exercise')
      }
    }
    await handleBackToAllExercises()
  }

  const handleUserRegistration = async (displayName: string, email: string, password: string) => {
    try {
      const newUser = await createUser(displayName, email, password)
      setCurrentUser(newUser)
      setShowRegisterModal(false)
      console.log('Registration successful:', { id: newUser.id, displayName: newUser.displayName, email: newUser.email })
    } catch (error) {
      console.error('Registration failed:', error)
      alert(`Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleUserLogin = async (email: string, password: string) => {
    try {
      const user = await authenticateUser(email, password)
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

  const handleLogout = async () => {
    await logoutUser()
    setCurrentUser(null)
    setShowCards(false)
    setViewMode('random')
    setEditingExercise(null)
    setSelectedExercises([])
    console.log('User logged out')
  }

  return (
    <div className="app">
      <Header
        currentUser={currentUser}
        onLogin={() => setShowLoginModal(true)}
        onRegister={() => setShowRegisterModal(true)}
        onLogout={handleLogout}
      />

      <div className="app-container">
        {!showCards ? (
          <HeroSection onShowCards={handleRandomExercises} />
        ) : viewMode === 'edit' && editingExercise ? (
          <EditExerciseView
            exercise={editingExercise}
            onBack={handleBackToAllExercises}
            onSave={handleSaveExercise}
          />
        ) : (
          <ExerciseCardsView
            exercises={selectedExercises}
            viewMode={viewMode === 'all' ? 'all' : 'random'}
            onBack={handleBackToRandomCards}
            onEdit={handleEditExercise}
            onNewExercises={handleRandomExercises}
            onViewAll={handleViewAllExercises}
          />
        )}
      </div>

      {showRegisterModal && (
        <RegisterModal onClose={() => setShowRegisterModal(false)} onRegister={handleUserRegistration} />
      )}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} onLogin={handleUserLogin} />
      )}
      {showAuthWarningModal && (
        <AuthWarningDialog
          onClose={() => setShowAuthWarningModal(false)}
          onRegister={() => {
            setShowAuthWarningModal(false)
            setShowRegisterModal(true)
          }}
          onLogin={() => {
            setShowAuthWarningModal(false)
            setShowLoginModal(true)
          }}
        />
      )}
    </div>
  )
}

export default App
