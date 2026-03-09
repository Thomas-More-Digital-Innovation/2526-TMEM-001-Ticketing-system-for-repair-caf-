import prisma from '@/lib/prisma'

export async function broadcastVoorwerpenUpdate() {
  try {
    if (!global.io) {
      console.log('Socket.IO not initialized yet')
      return
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

    const grouped = {
      afgeleverd: actieveCafedagVoorwerpen.filter((v: any) => v.voorwerpStatus.naam === 'Geregistreerd'),
      inBehandeling: actieveCafedagVoorwerpen.filter((v: any) => v.voorwerpStatus.naam === 'In behandeling'),
      klaar: actieveCafedagVoorwerpen.filter((v: any) => v.voorwerpStatus.naam === 'Klaar'),
    }

    global.io.emit('voorwerpen-updated', grouped)
    console.log('Broadcasted voorwerpen update to all clients')
  } catch (error) {
    console.error('Error broadcasting voorwerpen update:', error)
  }
}
