import prisma from '@/lib/prisma'
import { cache } from 'react'

// GET all materialen - cached for request deduplication
export const getMaterialen = cache(async () => {
  try {
    const materialen = await prisma.materiaal.findMany({
      orderBy: {
        naam: 'asc',
      },
    })
    return materialen
  } catch (error) {
    console.error('Error fetching materialen:', error)
    throw new Error('Er is een fout opgetreden bij het ophalen van materialen')
  }
})

// GET materiaal by ID
export const getMateriaalById = cache(async (materiaalId: number) => {
  try {
    const materiaal = await prisma.materiaal.findUnique({
      where: {
        materiaalId,
      },
    })
    return materiaal
  } catch (error) {
    console.error('Error fetching materiaal:', error)
    throw new Error('Er is een fout opgetreden bij het ophalen van materiaal')
  }
})

// Search materialen by name
export const searchMaterialen = cache(async (query: string) => {
  try {
    const materialen = await prisma.materiaal.findMany({
      where: {
        naam: {
          contains: query,
          mode: 'insensitive',
        },
      },
      orderBy: {
        naam: 'asc',
      },
    })
    return materialen
  } catch (error) {
    console.error('Error searching materialen:', error)
    throw new Error('Er is een fout opgetreden bij het zoeken naar materialen')
  }
})
