import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import cookieParser from 'cookie-parser'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDirectory = path.join(__dirname, '.data')
const dataFile = path.join(dataDirectory, 'users.json')
const secretFile = path.join(dataDirectory, 'session-secret.txt')
const port = Number(process.env.PORT || 3001)

fs.mkdirSync(dataDirectory, { recursive: true })

if (!fs.existsSync(secretFile)) {
  fs.writeFileSync(secretFile, crypto.randomBytes(32).toString('hex'), { mode: 0o600 })
}

const sessionSecret = fs.readFileSync(secretFile, 'utf8').trim()
const app = express()
app.use(express.json())
app.use(cookieParser())

const readDatabase = () => {
  if (!fs.existsSync(dataFile)) return { nextUserId: 1, users: [] }
  return JSON.parse(fs.readFileSync(dataFile, 'utf8'))
}

const writeDatabase = (database) => {
  fs.writeFileSync(dataFile, JSON.stringify(database, null, 2))
}

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex')
  const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex')
  return `scrypt:${salt}:${derivedKey}`
}

const verifyPassword = (password, storedHash) => {
  const [algorithm, salt, expectedHex] = storedHash.split(':')
  if (algorithm !== 'scrypt') return false
  const actualHex = crypto.scryptSync(password, salt, 64).toString('hex')
  const expected = Buffer.from(expectedHex, 'hex')
  const actual = Buffer.from(actualHex, 'hex')
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual)
}

const signSession = (userId) => {
  const payload = Buffer.from(JSON.stringify({ userId, expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 })).toString('base64url')
  const signature = crypto.createHmac('sha256', sessionSecret).update(payload).digest('base64url')
  return `${payload}.${signature}`
}

const verifySession = (token) => {
  if (!token) return null
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return null
  const expected = crypto.createHmac('sha256', sessionSecret).update(payload).digest('base64url')
  const actualBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)
  if (actualBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(actualBuffer, expectedBuffer)) return null
  const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
  return session.expiresAt > Date.now() ? session.userId : null
}

const publicUser = (user) => ({
  id: user.id,
  displayName: user.displayName,
  email: user.email,
  createdAt: user.createdAt,
  user_cards: user.user_cards,
})

const setSessionCookie = (res, userId) => {
  res.cookie('workout_session', signSession(userId), {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

app.post('/api/auth/register', (req, res) => {
  const { displayName, email, password } = req.body
  if (!displayName?.trim() || !email?.trim() || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'Display name, email, and an 8-character password are required.' })
  }

  const database = readDatabase()
  const normalizedEmail = email.trim().toLowerCase()
  if (database.users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
    return res.status(409).json({ error: 'An account with that email already exists.' })
  }

  const exerciseData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'exercises.json'), 'utf8'))
  const user = {
    id: database.nextUserId,
    displayName: displayName.trim(),
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
    user_cards: exerciseData,
  }
  database.nextUserId += 1
  database.users.push(user)
  writeDatabase(database)
  setSessionCookie(res, user.id)
  res.status(201).json(publicUser(user))
})

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body
  if (!email || typeof password !== 'string') {
    return res.status(400).json({ error: 'Email and password are required.' })
  }

  const database = readDatabase()
  const user = database.users.find((item) => item.email.toLowerCase() === email.trim().toLowerCase())
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid email or password.' })
  }
  setSessionCookie(res, user.id)
  res.json(publicUser(user))
})

app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie('workout_session')
  res.status(204).end()
})

app.get('/api/auth/session', (req, res) => {
  const userId = verifySession(req.cookies.workout_session)
  if (!userId) return res.status(401).json({ error: 'Not authenticated.' })
  const database = readDatabase()
  const user = database.users.find((item) => item.id === userId)
  if (!user) return res.status(401).json({ error: 'Not authenticated.' })
  res.json(publicUser(user))
})

app.put('/api/users/:userId/exercises/:exerciseId', (req, res) => {
  const userId = verifySession(req.cookies.workout_session)
  const requestedUserId = Number(req.params.userId)
  if (!userId || userId !== requestedUserId) {
    return res.status(401).json({ error: 'Not authenticated.' })
  }

  const exerciseId = Number(req.params.exerciseId)
  const { name, difficulty, repsTime, cue } = req.body
  if (
    (name !== undefined && typeof name !== 'string') ||
    (difficulty !== undefined && ![1, 2, 3].includes(difficulty)) ||
    (repsTime !== undefined && typeof repsTime !== 'string') ||
    (cue !== undefined && typeof cue !== 'string')
  ) {
    return res.status(400).json({ error: 'Invalid exercise update.' })
  }

  const database = readDatabase()
  const user = database.users.find((item) => item.id === requestedUserId)
  if (!user) return res.status(404).json({ error: 'User not found.' })

  for (const exercises of Object.values(user.user_cards.exercises)) {
    const index = exercises.findIndex((exercise) => exercise.id === exerciseId)
    if (index !== -1) {
      exercises[index] = {
        ...exercises[index],
        ...(name !== undefined ? { name } : {}),
        ...(difficulty !== undefined ? { difficulty } : {}),
        ...(repsTime !== undefined ? { repsTime } : {}),
        ...(cue !== undefined ? { cue } : {}),
      }
      writeDatabase(database)
      return res.json(publicUser(user))
    }
  }
  res.status(404).json({ error: 'Exercise not found.' })
})

app.listen(port, '127.0.0.1', () => {
  console.log(`Workout Cards API listening on http://127.0.0.1:${port}`)
})
