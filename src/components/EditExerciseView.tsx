import { useState } from 'react'
import { Box, Button } from '@mui/material'
import type { Exercise } from '../types/Exercise'
import ExerciseCard from './ExerciseCard'
import { darkOutlinedButtonSx } from './styles'

interface EditExerciseViewProps {
  exercise: Exercise
  onBack: () => void
  onSave: (exercise: Exercise) => void
}

export default function EditExerciseView({ exercise, onBack, onSave }: EditExerciseViewProps) {
  const [name, setName] = useState(exercise.name)
  const [difficulty, setDifficulty] = useState(exercise.difficulty)
  const [repsTime, setRepsTime] = useState(exercise.repsTime)
  const [cue, setCue] = useState(exercise.cue)

  const handleSave = () => onSave({ ...exercise, name, difficulty, repsTime, cue })

  const handleReset = () => {
    setName(exercise.name)
    setDifficulty(exercise.difficulty)
    setRepsTime(exercise.repsTime)
    setCue(exercise.cue)
  }

  return (
    <>
      <div className="back-button-container edit-page-back">
        <Button variant="outlined" onClick={onBack} startIcon={<span>←</span>} sx={darkOutlinedButtonSx}>
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
              <label htmlFor="name">Exercise Name</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-input" />
            </div>
            <div className="form-group">
              <label htmlFor="difficulty">Difficulty</label>
              <select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(Number(e.target.value))} className="form-select">
                <option value={1}>Beginner</option>
                <option value={2}>Intermediate</option>
                <option value={3}>Advanced</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="repsTime">Reps / Time</label>
              <input id="repsTime" type="text" value={repsTime} onChange={(e) => setRepsTime(e.target.value)} className="form-input" />
            </div>
            <div className="form-group">
              <label htmlFor="cue">Exercise Cue</label>
              <input id="cue" type="text" value={cue} onChange={(e) => setCue(e.target.value)} className="form-input" />
            </div>
            <Box className="form-buttons" sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Button variant="outlined" onClick={handleReset} sx={darkOutlinedButtonSx}>Reset</Button>
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #047857, #059669)',
                    boxShadow: '0 6px 18px rgba(5,150,105,0.42)',
                  },
                  transition: 'all 0.25s ease',
                  boxShadow: '0 3px 10px rgba(5,150,105,0.3)',
                }}
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
