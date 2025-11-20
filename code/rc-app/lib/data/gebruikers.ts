import prisma from '@/lib/prisma'
import { cache } from 'react'

// GET all gebruikers - cached for request deduplication
export const getGebruikers = cache(async () => {
  try {
    const gebruikers = await prisma.gebruiker.findMany({
      include: {
        gebruikerType: true,
      },
    })
    return gebruikers
  } catch (error) {
    console.error('Error fetching gebruikers:', error)
    throw new Error('Failed to fetch gebruikers')
  }
})

// GET a specific gebruiker by ID
export const getGebruikerById = cache(async (gebruikerId: number) => {
  try {
    const gebruiker = await prisma.gebruiker.findUnique({
      where: { gebruikerId },
      include: {
        gebruikerType: true,
      },
    })
    return gebruiker
  } catch (error) {
    console.error('Error fetching gebruiker:', error)
    throw new Error('Failed to fetch gebruiker')
  }
})
