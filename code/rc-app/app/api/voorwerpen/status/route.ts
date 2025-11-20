import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const voorwerpen = await prisma.voorwerp.findMany({
      include: {
        voorwerpStatus: true,
      },
      orderBy: {
        aanmeldingsDatum: 'desc',
      },
    })

    // Group items by status
    const grouped = {
      afgeleverd: voorwerpen.filter((v: any) => v.voorwerpStatus.naam === 'Geregistreerd'),
      inBehandeling: voorwerpen.filter((v: any) => v.voorwerpStatus.naam === 'In behandeling'),
      klaar: voorwerpen.filter((v: any) => v.voorwerpStatus.naam === 'Klaar'),
    }

    return NextResponse.json(grouped)
  } catch (error) {
    console.error('Error fetching voorwerpen status:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden' },
      { status: 500 }
    )
  }
}
