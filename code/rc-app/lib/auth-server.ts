import { NextRequest } from 'next/server'
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

export async function validateSession(request: NextRequest): Promise<AuthUser | null> {
  try {
    // Check for session ID in Authorization header or cookie
    const authHeader = request.headers.get('Authorization')
    const sessionId = authHeader?.replace('Bearer ', '')
    
    if (!sessionId) {
      return null
    }

    // Validate session in database
    const session = await prisma.sessie.findUnique({
      where: { sessieId: parseInt(sessionId) },
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

    // Check if session is expired
    if (session.vervalTijd < new Date()) {
      return null
    }

    return session.gebruiker
  } catch (error) {
    console.error('Session validation error:', error)
    return null
  }
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
