import { useState } from 'react'
import './App.css'
import type { Exercise } from './types/Exercise'
import { getRandomExerciseByDifficulty } from './utils/exerciseUtils'
import ExerciseCard from './components/ExerciseCard'

function App() {
  const [showCards, setShowCards] = useState(false)
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([])

  const handleButtonClick = () => {
    const beginner = getRandomExerciseByDifficulty(1)
    const intermediate = getRandomExerciseByDifficulty(2)
    const advanced = getRandomExerciseByDifficulty(3)
    
    setSelectedExercises([beginner, intermediate, advanced])
    setShowCards(true)
  }

  return (
    <div className="app-container">
      {!showCards ? (
        <button className="center-button" onClick={handleButtonClick}>
          Show Cards
        </button>
      ) : (
        <>
          <div className="cards-container">
            {selectedExercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
          <div className="button-container">
            <button className="new-exercises-btn" onClick={handleButtonClick}>
              New Exercises
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default App