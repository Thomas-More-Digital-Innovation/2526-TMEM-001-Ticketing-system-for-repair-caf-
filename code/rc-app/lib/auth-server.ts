import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'node:crypto'
import prisma from './prisma'

export interface AuthUser {
  gebruikerId: number
  gebruikerNaam: string
  naam: string
  gebruikerTypeId: number
  gebruikerType: {
    gebruikerTypeId: number
    typeNaam: string
  }
}

const SESSION_COOKIE_NAME = 'rc_session'

function getSessionSecret() {
  return process.env.SESSION_SECRET || process.env.NEXTAUTH_SECRET || 'replace-this-dev-secret'
}

function signPayload(payload: string): string {
  return crypto.createHmac('sha256', getSessionSecret()).update(payload).digest('hex')
}

function timingSafeEqual(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a)
  const bBuffer = Buffer.from(b)

  if (aBuffer.length !== bBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(aBuffer, bBuffer)
}

export function createSessionToken(sessionId: number): string {
  const nonce = crypto.randomBytes(16).toString('hex')
  const payload = `${sessionId}.${nonce}`
  const signature = signPayload(payload)
  return `${payload}.${signature}`
}

function parseSessionIdFromToken(token: string): number | null {
  if (!token) {
    return null
  }

  const parts = token.split('.')

  if (parts.length === 3) {
    const [sessionIdStr, nonce, signature] = parts
    const payload = `${sessionIdStr}.${nonce}`
    const expectedSignature = signPayload(payload)

    if (!timingSafeEqual(signature, expectedSignature)) {
      return null
    }

    const sessionId = Number.parseInt(sessionIdStr, 10)
    return Number.isNaN(sessionId) ? null : sessionId
  }

  const legacySessionId = Number.parseInt(token, 10)
  return Number.isNaN(legacySessionId) ? null : legacySessionId
}

async function validateSessionToken(token: string): Promise<AuthUser | null> {
  const sessionId = parseSessionIdFromToken(token)

  if (!sessionId) {
    return null
  }

  const session = await prisma.sessie.findUnique({
    where: { sessieId: sessionId },
    include: {
      gebruiker: {
        include: {
          gebruikerType: true,
        },
      },
    },
  })

  if (!session) {
    return null
  }

  if (session.vervalTijd < new Date()) {
    return null
  }

  return session.gebruiker
}

export async function setSessionCookie(sessionId: number) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, createSessionToken(sessionId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function validateSession(request: NextRequest): Promise<AuthUser | null> {
  try {
    // Check for signed token in Authorization header or secure cookie
    const authHeader = request.headers.get('Authorization')
    const bearerToken = authHeader?.replace('Bearer ', '')
    const cookieToken = request.cookies.get(SESSION_COOKIE_NAME)?.value
    const token = bearerToken || cookieToken
    
    if (!token) {
      return null
    }

    return await validateSessionToken(token)
  } catch (error) {
    console.error('Session validation error:', error)
    return null
  }
}

export async function getServerActionUser(allowedRoles?: string[]): Promise<AuthUser> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) {
    throw new Error('Niet geautoriseerd')
  }

  const user = await validateSessionToken(token)

  if (!user) {
    throw new Error('Niet geautoriseerd')
  }

  if (allowedRoles && !allowedRoles.includes(user.gebruikerType.typeNaam)) {
    throw new Error('Geen toegang')
  }

  return user
}

export async function getServerActionSessionId(): Promise<number | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  return parseSessionIdFromToken(token)
}

export function requireAuth(allowedRoles?: string[]) {
  return async (request: NextRequest): Promise<{ user: AuthUser } | Response> => {
    const user = await validateSession(request)

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Niet geautoriseerd' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (allowedRoles && !allowedRoles.includes(user.gebruikerType.typeNaam)) {
      return new Response(
        JSON.stringify({ error: 'Geen toegang' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return { user }
  }
}
