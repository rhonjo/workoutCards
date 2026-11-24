import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { getSession } from './utils/userUtils'

vi.mock('./utils/userUtils', () => ({
  createUser: vi.fn(),
  authenticateUser: vi.fn(),
  updateUserExercise: vi.fn(),
  getUserExercises: vi.fn(),
  getSession: vi.fn(),
  logoutUser: vi.fn(),
}))

describe('App', () => {
  beforeEach(() => {
    vi.mocked(getSession).mockResolvedValue(null)
  })

  it('shows one randomly selected card for each difficulty', async () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Show Cards' }))

    await waitFor(() => {
      expect(document.querySelectorAll('.cards-container .card')).toHaveLength(3)
    })
    expect(screen.getByText('Beginner')).toBeInTheDocument()
    expect(screen.getByText('Intermediate')).toBeInTheDocument()
    expect(screen.getByText('Advanced')).toBeInTheDocument()
  })

  it('requires authentication to open the exercise library', async () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Show Cards' }))
    fireEvent.click(screen.getByRole('button', { name: 'View/Edit Exercise Cards' }))

    expect(await screen.findByText('Login Required')).toBeInTheDocument()
    expect(screen.getByText(/need to be logged in to view and edit exercise cards/i)).toBeInTheDocument()
  })
})
