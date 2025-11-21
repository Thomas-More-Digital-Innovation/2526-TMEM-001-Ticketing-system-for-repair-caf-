'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// Add material to voorwerp
export async function addMateriaalToVoorwerp(
  volgnummer: string,
  materiaalId: number,
  aantal: number
) {
  try {
    // Get voorwerp by volgnummer
    const voorwerp = await prisma.voorwerp.findUnique({
      where: { volgnummer },
    })

    if (!voorwerp) {
      throw new Error('Voorwerp niet gevonden')
    }

    // Check if material already exists for this voorwerp
    const existing = await prisma.gebruikteMateriaal.findFirst({
      where: {
        voorwerpId: voorwerp.voorwerpId,
        materiaalId: materiaalId,
      },
    })

    if (existing) {
      // Update existing entry - add to the current aantal
      await prisma.gebruikteMateriaal.update({
        where: {
          gebruikteMateriaalId: existing.gebruikteMateriaalId,
        },
        data: {
          aantal: existing.aantal + aantal,
        },
      })
    } else {
      // Create new entry
      await prisma.gebruikteMateriaal.create({
        data: {
          voorwerpId: voorwerp.voorwerpId,
          materiaalId: materiaalId,
          aantal: aantal,
        },
      })
    }

    revalidatePath(`/student/handle/${volgnummer}`)
    return { success: true }
  } catch (error) {
    console.error('Error adding material to voorwerp:', error)
    throw new Error('Er is een fout opgetreden bij het toevoegen van materiaal')
  }
}

// Remove material from voorwerp
export async function removeMateriaalFromVoorwerp(
  volgnummer: string,
  materiaalId: number
) {
  try {
    const voorwerp = await prisma.voorwerp.findUnique({
      where: { volgnummer },
    })

    if (!voorwerp) {
      throw new Error('Voorwerp niet gevonden')
    }

    await prisma.gebruikteMateriaal.deleteMany({
      where: {
        voorwerpId: voorwerp.voorwerpId,
        materiaalId: materiaalId,
      },
    })

    revalidatePath(`/student/handle/${volgnummer}`)
    return { success: true }
  } catch (error) {
    console.error('Error removing material from voorwerp:', error)
    throw new Error('Er is een fout opgetreden bij het verwijderen van materiaal')
  }
}

// Update material quantity for voorwerp
export async function updateMateriaalAantal(
  volgnummer: string,
  materiaalId: number,
  aantal: number
) {
  try {
    const voorwerp = await prisma.voorwerp.findUnique({
      where: { volgnummer },
    })

    if (!voorwerp) {
      throw new Error('Voorwerp niet gevonden')
    }

    if (aantal <= 0) {
      // Remove if aantal is 0 or negative
      await removeMateriaalFromVoorwerp(volgnummer, materiaalId)
    } else {
      // Update existing entry
      const existing = await prisma.gebruikteMateriaal.findFirst({
        where: {
          voorwerpId: voorwerp.voorwerpId,
          materiaalId: materiaalId,
        },
      })

      if (existing) {
        await prisma.gebruikteMateriaal.update({
          where: {
            gebruikteMateriaalId: existing.gebruikteMateriaalId,
          },
          data: {
            aantal: aantal,
          },
        })
      }
    }

    revalidatePath(`/student/handle/${volgnummer}`)
    return { success: true }
  } catch (error) {
    console.error('Error updating material quantity:', error)
    throw new Error('Er is een fout opgetreden bij het wijzigen van de hoeveelheid')
  }
}
