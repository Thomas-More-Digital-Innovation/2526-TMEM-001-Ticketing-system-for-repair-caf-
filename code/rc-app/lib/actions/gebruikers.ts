'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import crypto from 'node:crypto'

interface CreateGebruikerInput {
  gebruikerNaam: string
  naam: string
  wachtwoord: string
  gebruikerTypeId: number
}

export async function createGebruiker(data: CreateGebruikerInput) {
  try {
    const gebruiker = await prisma.gebruiker.create({
      data: {
        gebruikerNaam: data.gebruikerNaam,
        naam: data.naam,
        wachtwoord: data.wachtwoord, // In production, hash this password!
        gebruikerTypeId: data.gebruikerTypeId,
      },
      include: {
        gebruikerType: true,
      },
    })

    revalidatePath('/admin/gebruikers')
    
    return { success: true, gebruiker }
  } catch (error) {
    console.error('Error creating gebruiker:', error)
    return { success: false, error: 'Failed to create gebruiker' }
  }
}

export async function generateQRLoginToken(gebruikerId: number) {
  try {
    // Generate a unique token
    const token = crypto.randomBytes(32).toString('hex')
    
    // Set expiration time to 5 minutes from now
    const vervalTijd = new Date(Date.now() + 5 * 60 * 1000)
    
    // Create QR login entry
    const qrLogin = await prisma.qRLogin.create({
      data: {
        token,
        vervalTijd,
        gebruikerId,
      },
    })
    
    return { success: true, token: qrLogin.token }
  } catch (error) {
    console.error('Error generating QR login token:', error)
    return { success: false, error: 'Failed to generate QR login token' }
  }
}
