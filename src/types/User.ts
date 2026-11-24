import type { ExerciseData } from './Exercise'

export interface User {
  id: number
  displayName: string
  email: string
  createdAt: string
  user_cards: ExerciseData
}