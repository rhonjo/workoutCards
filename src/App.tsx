import { useState } from 'react'
import './App.css'
import exercisesData from '../exercises.json'

interface Exercise {
  id: number
  name: string
  difficulty: number
  repsTime: string
  cue: string
}

function App() {
  const [showCards, setShowCards] = useState(false)
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([])

  const getAllExercises = (): Exercise[] => {
    const allExercises: Exercise[] = []
    Object.values(exercisesData.exercises).forEach(category => {
      allExercises.push(...category)
    })
    return allExercises
  }

  const getRandomExerciseByDifficulty = (difficulty: number): Exercise => {
    const allExercises = getAllExercises()
    const exercisesByDifficulty = allExercises.filter(ex => ex.difficulty === difficulty)
    const randomIndex = Math.floor(Math.random() * exercisesByDifficulty.length)
    return exercisesByDifficulty[randomIndex]
  }

  const handleButtonClick = () => {
    const beginner = getRandomExerciseByDifficulty(1)
    const intermediate = getRandomExerciseByDifficulty(2)
    const advanced = getRandomExerciseByDifficulty(3)
    
    setSelectedExercises([beginner, intermediate, advanced])
    setShowCards(true)
  }

  const getDifficultyLabel = (difficulty: number): string => {
    const labels = { 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced' }
    return labels[difficulty as keyof typeof labels]
  }

  const getDifficultyColor = (difficulty: number): string => {
    const colors = { 1: '#22c55e', 2: '#f59e0b', 3: '#ef4444' }
    return colors[difficulty as keyof typeof colors]
  }

  return (
    <div className="app-container">
      {!showCards ? (
        <button className="center-button" onClick={handleButtonClick}>
          Show Cards
        </button>
      ) : (
        <div className="cards-container">
          {selectedExercises.map((exercise) => (
            <div key={exercise.id} className="card">
              <div className="card-header">
                <span 
                  className="difficulty-badge" 
                  style={{ backgroundColor: getDifficultyColor(exercise.difficulty) }}
                >
                  {getDifficultyLabel(exercise.difficulty)}
                </span>
              </div>
              <div className="card-content">
                <h3 className="exercise-name">{exercise.name}</h3>
                <p className="exercise-reps">{exercise.repsTime}</p>
                <p className="exercise-cue">{exercise.cue}</p>
              </div>
            </div>
          ))}
          <button className="new-exercises-btn" onClick={handleButtonClick}>
            New Exercises
          </button>
        </div>
      )}
    </div>
  )
}

export default App
