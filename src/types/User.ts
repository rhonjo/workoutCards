import type { ExerciseData } from './Exercise'

export interface User {
  id: number
  displayName: string
  email: string
  password: string
  createdAt: Date
  user_cards: ExerciseData
}