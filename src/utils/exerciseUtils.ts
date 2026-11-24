import type { Exercise, ExerciseData } from '../types/Exercise'
import exercisesData from '../../exercises.json'

export const getAllExercises = (userExercisesData?: ExerciseData): Exercise[] => {
  const dataSource = userExercisesData || exercisesData
  const allExercises: Exercise[] = []
  Object.values(dataSource.exercises).forEach((category) => {
    allExercises.push(...category)
  })
  return allExercises
}

export const getRandomExerciseByDifficulty = (difficulty: number, userExercisesData?: ExerciseData): Exercise => {
  const allExercises = getAllExercises(userExercisesData)
  const exercisesByDifficulty = allExercises.filter(ex => ex.difficulty === difficulty)
  const randomIndex = Math.floor(Math.random() * exercisesByDifficulty.length)
  return exercisesByDifficulty[randomIndex]
}

export const getDifficultyLabel = (difficulty: number): string => {
  const labels = { 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced' }
  return labels[difficulty as keyof typeof labels]
}

export const getDifficultyColor = (difficulty: number): string => {
  const colors = { 1: '#22c55e', 2: '#f59e0b', 3: '#ef4444' }
  return colors[difficulty as keyof typeof colors]
}