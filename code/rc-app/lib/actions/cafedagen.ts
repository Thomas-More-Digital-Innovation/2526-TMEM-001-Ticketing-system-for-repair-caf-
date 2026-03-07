'use server'

import prisma from '@/lib/prisma'
import { getServerActionUser } from '@/lib/auth-server'
import { revalidatePath } from 'next/cache'

interface CreateCafedagInput {
    cafeId: number
    startDatum: Date
    eindDatum: Date
}

function toStartOfDay(date: Date) {
    const normalizedDate = new Date(date)
    normalizedDate.setHours(0, 0, 0, 0)
    return normalizedDate
}

function toEndOfDay(date: Date) {
    const normalizedDate = new Date(date)
    normalizedDate.setHours(23, 59, 59, 999)
    return normalizedDate
}

// Create a new cafedag
export async function createCafedag(data: CreateCafedagInput) {
    try {
        await getServerActionUser(['Admin'])

        const startDatum = toStartOfDay(data.startDatum)
        const eindDatum = toEndOfDay(data.eindDatum)

        if (eindDatum < startDatum) {
            return { success: false, error: 'Einddatum mag niet voor startdatum liggen' }
        }

        const cafedag = await prisma.cafedag.create({
            data: {
                cafeId: data.cafeId,
                startDatum,
                eindDatum,
            },
            include: {
                cafe: true,
            },
        })

        revalidatePath('/admin/cafedagen')
        return { success: true, cafedag }
    } catch (error) {
        console.error('Error creating cafedag:', error)
        return { success: false, error: 'Failed to create cafedag' }
    }
}

// Update an existing cafedag
export async function updateCafedag(
    cafedagId: number,
    data: Partial<CreateCafedagInput>
) {
    try {
        await getServerActionUser(['Admin'])

        const existingCafedag = await prisma.cafedag.findUnique({
            where: { cafedagId },
            select: { startDatum: true, eindDatum: true },
        })

        if (!existingCafedag) {
            return { success: false, error: 'Cafedag niet gevonden' }
        }

        const startDatum = data.startDatum
            ? toStartOfDay(data.startDatum)
            : existingCafedag.startDatum
        const eindDatum = data.eindDatum
            ? toEndOfDay(data.eindDatum)
            : existingCafedag.eindDatum

        if (eindDatum < startDatum) {
            return { success: false, error: 'Einddatum mag niet voor startdatum liggen' }
        }

        const cafedag = await prisma.cafedag.update({
            where: { cafedagId },
            data: {
                ...(data.cafeId && { cafeId: data.cafeId }),
                startDatum,
                eindDatum,
            },
            include: {
                cafe: true,
            },
        })

        revalidatePath('/admin/cafedagen')
        return { success: true, cafedag }
    } catch (error) {
        console.error('Error updating cafedag:', error)
        return { success: false, error: 'Failed to update cafedag' }
    }
}

// Delete a cafedag
export async function deleteCafedag(cafedagId: number) {
    try {
        await getServerActionUser(['Admin'])

        await prisma.cafedag.delete({
            where: { cafedagId },
        })

        revalidatePath('/admin/cafedagen')
        return { success: true }
    } catch (error) {
        console.error('Error deleting cafedag:', error)
        return { success: false, error: 'Failed to delete cafedag' }
    }
}

// Create a new cafe
export async function createCafe(
    naam: string,
    locatie: string,
    cafePatroon: string
) {
    try {
        await getServerActionUser(['Admin'])

        const cafe = await prisma.cafe.create({
            data: {
                naam,
                locatie,
                cafePatroon,
            },
        })

        revalidatePath('/admin/cafedagen')
        return { success: true, cafe }
    } catch (error) {
        console.error('Error creating cafe:', error)
        return { success: false, error: 'Failed to create cafe' }
    }
}

// Update an existing cafe
export async function updateCafe(
    cafeId: number,
    naam: string,
    locatie: string,
    cafePatroon: string
) {
    try {
        await getServerActionUser(['Admin'])

        const cafe = await prisma.cafe.update({
            where: { cafeId },
            data: {
                naam,
                locatie,
                cafePatroon,
            },
        })

        revalidatePath('/admin/cafedagen')
        return { success: true, cafe }
    } catch (error) {
        console.error('Error updating cafe:', error)
        return { success: false, error: 'Failed to update cafe' }
    }
}

// Delete a cafe
export async function deleteCafe(cafeId: number) {
    try {
        await getServerActionUser(['Admin'])

        await prisma.cafe.delete({
            where: { cafeId },
        })

        revalidatePath('/admin/cafedagen')
        return { success: true }
    } catch (error) {
        console.error('Error deleting cafe:', error)
        return { success: false, error: 'Failed to delete cafe' }
    }
}
