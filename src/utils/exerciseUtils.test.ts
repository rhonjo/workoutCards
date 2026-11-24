import { describe, expect, it, vi } from 'vitest'
import type { ExerciseData } from '../types/Exercise'
import {
  getAllExercises,
  getDifficultyColor,
  getDifficultyLabel,
  getRandomExerciseByDifficulty,
} from './exerciseUtils'

const exerciseData: ExerciseData = {
  exercises: {
    lowerBody: [
      { id: 1, name: 'Squat', difficulty: 1, repsTime: '10 reps', cue: 'Sit back' },
      { id: 2, name: 'Jump squat', difficulty: 3, repsTime: '8 reps', cue: 'Land softly' },
    ],
    upperBody: [
      { id: 3, name: 'Push-up', difficulty: 2, repsTime: '8 reps', cue: 'Keep straight' },
    ],
    core: [],
    fullBody: [],
    cardioPlyo: [],
    mobilityBalance: [],
  },
  difficultyLevels: {
    '1': 'Beginner',
    '2': 'Intermediate',
    '3': 'Advanced',
  },
}

describe('exercise utilities', () => {
  it('flattens the provided exercise categories', () => {
    expect(getAllExercises(exerciseData).map(({ id }) => id)).toEqual([1, 2, 3])
  })

  it('returns an exercise with the requested difficulty', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)

    expect(getRandomExerciseByDifficulty(2, exerciseData)).toEqual(exerciseData.exercises.upperBody[0])

    vi.restoreAllMocks()
  })

  it('maps supported difficulties to their labels and colors', () => {
    expect(getDifficultyLabel(1)).toBe('Beginner')
    expect(getDifficultyLabel(2)).toBe('Intermediate')
    expect(getDifficultyLabel(3)).toBe('Advanced')
    expect(getDifficultyColor(1)).toBe('#22c55e')
    expect(getDifficultyColor(2)).toBe('#f59e0b')
    expect(getDifficultyColor(3)).toBe('#ef4444')
  })
})
