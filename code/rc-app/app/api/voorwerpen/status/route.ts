import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-server'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(['Admin', 'Balie', 'Student'])(request)
    if (authResult instanceof Response) {
      return authResult
    }

    const voorwerpen = await prisma.voorwerp.findMany({
      include: {
        voorwerpStatus: true,
        cafedagVoorwerp: {
          include: {
            cafedag: true,
          },
        },
      },
      orderBy: {
        aanmeldingsDatum: 'desc',
      },
    })

    const actieveCafedagVoorwerpen = voorwerpen.filter((voorwerp: any) =>
      Array.isArray(voorwerp.cafedagVoorwerp) &&
      voorwerp.cafedagVoorwerp.some(
        (koppeling: any) => koppeling.cafedag?.inactive === false
      )
    )

    // Group items by status
    const grouped = {
      afgeleverd: actieveCafedagVoorwerpen.filter((v: any) => v.voorwerpStatus.naam === 'Geregistreerd'),
      inBehandeling: actieveCafedagVoorwerpen.filter((v: any) => v.voorwerpStatus.naam === 'In behandeling'),
      klaar: actieveCafedagVoorwerpen.filter((v: any) => v.voorwerpStatus.naam === 'Klaar'),
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
