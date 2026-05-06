import type { User } from '../types/User'
import exercisesData from '../../exercises.json'

// Simple in-memory user storage
let users: User[] = []
let nextUserId = 1

export const createUser = (displayName: string, email: string, password: string): User => {
  const userExercisesData = JSON.parse(JSON.stringify(exercisesData))

  const newUser: User = {
    id: nextUserId++,
    displayName,
    email,
    password,
    createdAt: new Date(),
    user_cards: userExercisesData
  }

  users.push(newUser)
  console.log('User created:', { id: newUser.id, displayName: newUser.displayName, email: newUser.email })
  return newUser
}

export const getAllUsers = (): User[] => {
  return users
}

export const findUserByEmail = (email: string): User | undefined => {
  return users.find(user => user.email === email)
}

export const authenticateUser = (email: string, password: string): User | null => {
  const user = findUserByEmail(email)
  if (user && user.password === password) {
    return user
  }
  return null
}

export const updateUserExercise = (userId: number, exerciseId: number, updatedExercise: any): boolean => {
  const user = users.find(u => u.id === userId)
  if (!user) return false

  for (const category of Object.values(user.user_cards.exercises)) {
    const exerciseIndex = (category as any[]).findIndex((ex: any) => ex.id === exerciseId)
    if (exerciseIndex !== -1) {
      (category as any[])[exerciseIndex] = { ...(category as any[])[exerciseIndex], ...updatedExercise }
      console.log('Updated exercise for user', userId, ':', updatedExercise)
      return true
    }
  }
  return false
}

export const getUserExercises = (userId: number) => {
  const user = users.find(u => u.id === userId)
  return user ? user.user_cards : null
}