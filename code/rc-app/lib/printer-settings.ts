import { prisma } from '@/lib/prisma'

export const DEFAULT_PRINTER_TOP_MESSAGE = 'REPAIR CAFE'
export const DEFAULT_PRINTER_BOTTOM_MESSAGE = 'Bedankt!'

type PrinterSettings = {
  topMessage: string
  bottomMessage: string
}

export async function getPrinterMessages(): Promise<PrinterSettings> {
  const rows = await prisma.printerSetting.findMany({
    where: {
      key: {
        in: ['top_message', 'bottom_message'],
      },
    },
  })

  const topRow = rows.find((row) => row.key === 'top_message')
  const bottomRow = rows.find((row) => row.key === 'bottom_message')

  return {
    topMessage: topRow?.value ?? DEFAULT_PRINTER_TOP_MESSAGE,
    bottomMessage: bottomRow?.value ?? DEFAULT_PRINTER_BOTTOM_MESSAGE,
  }
}

export async function setPrinterMessages(input: PrinterSettings): Promise<PrinterSettings> {
  const topMessage = input.topMessage.trim() || DEFAULT_PRINTER_TOP_MESSAGE
  const bottomMessage = input.bottomMessage.trim() || DEFAULT_PRINTER_BOTTOM_MESSAGE

  await prisma.printerSetting.upsert({
    where: { key: 'top_message' },
    update: { value: topMessage },
    create: {
      key: 'top_message',
      value: topMessage,
    },
  })

  await prisma.printerSetting.upsert({
    where: { key: 'bottom_message' },
    update: { value: bottomMessage },
    create: {
      key: 'bottom_message',
      value: bottomMessage,
    },
  })

  return {
    topMessage,
    bottomMessage,
  }
}
