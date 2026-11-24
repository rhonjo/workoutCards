import type { User } from '../types/User'

const apiRequest = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error || `Request failed (${response.status})`)
  }

  if (response.status === 204) return null
  return response.json()
}

export const getSession = async (): Promise<User | null> => {
  try {
    return await apiRequest('/api/auth/session')
  } catch {
    return null
  }
}

export const createUser = async (displayName: string, email: string, password: string): Promise<User> =>
  apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ displayName, email, password }),
  })

export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  try {
    return await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid email or password.') return null
    throw error
  }
}

export const logoutUser = async (): Promise<void> => {
  await apiRequest('/api/auth/logout', { method: 'POST' })
}

export const updateUserExercise = async (
  userId: number,
  exerciseId: number,
  updatedExercise: unknown,
): Promise<boolean> => {
  try {
    await apiRequest(`/api/users/${userId}/exercises/${exerciseId}`, {
      method: 'PUT',
      body: JSON.stringify(updatedExercise),
    })
    return true
  } catch {
    return false
  }
}

export const getUserExercises = async (userId: number) => {
  const user = await getSession()
  return user?.id === userId ? user.user_cards : null
}
