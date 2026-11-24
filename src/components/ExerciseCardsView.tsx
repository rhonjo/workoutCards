import { Box, Button } from '@mui/material'
import type { Exercise } from '../types/Exercise'
import ExerciseCard from './ExerciseCard'
import { darkOutlinedButtonSx } from './styles'

interface ExerciseCardsViewProps {
  exercises: Exercise[]
  viewMode: 'random' | 'all'
  onBack: () => void
  onEdit: (exercise: Exercise) => void
  onNewExercises: () => void
  onViewAll: () => void
}

export default function ExerciseCardsView({
  exercises,
  viewMode,
  onBack,
  onEdit,
  onNewExercises,
  onViewAll,
}: ExerciseCardsViewProps) {
  return (
    <>
      {viewMode === 'all' && (
        <>
          <div className="back-button-container">
            <Button
              variant="outlined"
              onClick={onBack}
              startIcon={<span>←</span>}
              sx={darkOutlinedButtonSx}
            >
              Back
            </Button>
          </div>
          <div className="all-exercises-header">
            <h2 className="all-exercises-title">Exercise Library</h2>
          </div>
        </>
      )}
      <div className={`cards-container ${viewMode === 'all' ? 'all-exercises' : ''}`}>
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onClick={viewMode === 'all' ? () => onEdit(exercise) : undefined}
          />
        ))}
      </div>
      {viewMode === 'random' && (
        <Box className="button-container" sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={onNewExercises}
            sx={{
              px: 3,
              py: 1,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                boxShadow: '0 8px 22px rgba(99,102,241,0.45)',
              },
              transition: 'all 0.25s ease',
              boxShadow: '0 3px 12px rgba(99,102,241,0.32)',
            }}
          >
            New Exercises
          </Button>
          <Button
            variant="contained"
            onClick={onViewAll}
            sx={{
              px: 3,
              py: 1,
              background: 'linear-gradient(135deg, #059669, #10b981)',
              '&:hover': {
                background: 'linear-gradient(135deg, #047857, #059669)',
                boxShadow: '0 8px 22px rgba(5,150,105,0.45)',
              },
              transition: 'all 0.25s ease',
              boxShadow: '0 3px 10px rgba(5,150,105,0.32)',
            }}
          >
            View/Edit Exercise Cards
          </Button>
        </Box>
      )}
    </>
  )
}
