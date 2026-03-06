'use server'

import { getServerActionUser } from '@/lib/auth-server'
import { getPrinterMessages, setPrinterMessages } from '@/lib/printer-settings'

export async function getPrinterSettings() {
  try {
    await getServerActionUser(['Admin'])
    const settings = await getPrinterMessages()
    return { success: true, settings }
  } catch (error) {
    console.error('Error fetching printer settings:', error)
    return { success: false, error: 'Fout bij ophalen van printer instellingen' }
  }
}

export async function updatePrinterSettings(data: { topMessage: string; bottomMessage: string }) {
  try {
    await getServerActionUser(['Admin'])

    const settings = await setPrinterMessages({
      topMessage: data.topMessage,
      bottomMessage: data.bottomMessage,
    })

    return { success: true, settings }
  } catch (error) {
    console.error('Error updating printer settings:', error)
    return { success: false, error: 'Fout bij opslaan van printer instellingen' }
  }
}
