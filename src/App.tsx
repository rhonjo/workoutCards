import { useState } from 'react'
import './App.css'
import type { Exercise } from './types/Exercise'
import { getRandomExerciseByDifficulty, getAllExercises } from './utils/exerciseUtils'
import ExerciseCard from './components/ExerciseCard'

function App() {
  const [showCards, setShowCards] = useState(false)
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([])
  const [viewMode, setViewMode] = useState<'random' | 'all' | 'edit'>('random')
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)

  const handleRandomExercises = () => {
    const beginner = getRandomExerciseByDifficulty(1)
    const intermediate = getRandomExerciseByDifficulty(2)
    const advanced = getRandomExerciseByDifficulty(3)
    
    setSelectedExercises([beginner, intermediate, advanced])
    setViewMode('random')
    setShowCards(true)
  }

  const handleViewAllExercises = () => {
    const allExercises = getAllExercises()
    const sortedExercises = allExercises.sort((a, b) => a.difficulty - b.difficulty)
    
    setSelectedExercises(sortedExercises)
    setViewMode('all')
    setShowCards(true)
  }

  const handleBackToRandomCards = () => {
    const beginner = getRandomExerciseByDifficulty(1)
    const intermediate = getRandomExerciseByDifficulty(2)
    const advanced = getRandomExerciseByDifficulty(3)
    
    setSelectedExercises([beginner, intermediate, advanced])
    setViewMode('random')
  }

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise)
    setViewMode('edit')
  }

  const handleBackToAllExercises = () => {
    const allExercises = getAllExercises()
    const sortedExercises = allExercises.sort((a, b) => a.difficulty - b.difficulty)
    
    setSelectedExercises(sortedExercises)
    setViewMode('all')
    setEditingExercise(null)
  }

  const handleSaveExercise = (updatedExercise: Exercise) => {
    // For now, just go back to all exercises view
    // In a real app, you'd save to database/JSON here
    handleBackToAllExercises()
  }

  return (
    <div className="app-container">
      {!showCards ? (
        <button className="center-button" onClick={handleRandomExercises}>
          Show Cards
        </button>
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
              <button className="back-button" onClick={handleBackToRandomCards}>
                ← Back
              </button>
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
            <div className="button-container">
              <button className="new-exercises-btn" onClick={handleRandomExercises}>
                New Exercises
              </button>
              <button className="view-all-btn" onClick={handleViewAllExercises}>
                View/Edit Exercise Cards
              </button>
            </div>
          )}
        </>
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

  return (
    <>
      <div className="back-button-container">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
      </div>
      <div className="edit-exercise-container">
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
          
          <button className="save-button" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </>
  )
}

export default App