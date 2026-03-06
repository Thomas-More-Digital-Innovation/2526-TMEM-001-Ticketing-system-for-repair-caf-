'use server'

import prisma from '@/lib/prisma'
import { clearSessionCookie, getServerActionSessionId, setSessionCookie } from '@/lib/auth-server'
import { hashPassword, isPasswordHash, verifyPassword } from '@/lib/password'

export async function logoutAction() {
  try {
    const sessionId = await getServerActionSessionId()

    if (sessionId) {
      await prisma.sessie.deleteMany({
        where: { sessieId: sessionId },
      })
    }

    await clearSessionCookie()

    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    return { success: false, error: 'Er is een fout opgetreden tijdens het uitloggen' }
  }
}

export async function loginAction(username: string, password: string) {
  try {
    if (!username || !password) {
      return { success: false, error: 'Gebruikersnaam en wachtwoord zijn verplicht' }
    }

    // Find user by username
    const gebruiker = await prisma.gebruiker.findUnique({
      where: { gebruikerNaam: username },
      include: { gebruikerType: true },
    })

    if (!gebruiker) {
      return { success: false, error: 'Ongeldige gebruikersnaam of wachtwoord' }
    }

    let isValidPassword = false

    if (isPasswordHash(gebruiker.wachtwoord)) {
      isValidPassword = await verifyPassword(password, gebruiker.wachtwoord)
    } else {
      isValidPassword = gebruiker.wachtwoord === password

      if (isValidPassword) {
        const hashedPassword = await hashPassword(password)
        await prisma.gebruiker.update({
          where: { gebruikerId: gebruiker.gebruikerId },
          data: { wachtwoord: hashedPassword },
        })
      }
    }

    if (!isValidPassword) {
      return { success: false, error: 'Ongeldige gebruikersnaam of wachtwoord' }
    }

    // Create session
    const session = await prisma.sessie.create({
      data: {
        gebruikerId: gebruiker.gebruikerId,
        vervalTijd: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    })

    await setSessionCookie(session.sessieId)

    const { wachtwoord, ...userWithoutPassword } = gebruiker

    return {
      success: true,
      user: userWithoutPassword,
    }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'Er is een fout opgetreden tijdens het inloggen' }
  }
}

export async function loginWithQRToken(token: string) {
  try {
    if (!token) {
      return { success: false, error: 'Token is verplicht' }
    }

    // Find QR login token
    const qrLogin = await prisma.qRLogin.findUnique({
      where: { token },
      include: {
        gebruiker: {
          include: { gebruikerType: true },
        },
      },
    })

    if (!qrLogin) {
      return { success: false, error: 'Ongeldige QR code' }
    }

    // Create session
    const session = await prisma.sessie.create({
      data: {
        gebruikerId: qrLogin.gebruikerId,
        vervalTijd: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    })

    await setSessionCookie(session.sessieId)

    const { wachtwoord, ...userWithoutPassword } = qrLogin.gebruiker

    return {
      success: true,
      user: userWithoutPassword,
    }
  } catch (error) {
    console.error('QR Login error:', error)
    return { success: false, error: 'Er is een fout opgetreden tijdens het inloggen' }
  }
}
