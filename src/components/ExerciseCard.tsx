import React from 'react'
import type { Exercise } from '../types/Exercise'
import { getDifficultyLabel, getDifficultyColor } from '../utils/exerciseUtils'

interface ExerciseCardProps {
  exercise: Exercise
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
  return (
    <div className="card">
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
  )
}

export default ExerciseCard