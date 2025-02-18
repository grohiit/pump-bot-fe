import { format } from 'date-fns'

export function parseDateTime(date: string, time: string): Date {
  const [day, month, year] = date.split('/').map(Number)
  const [hour, minute] = time.split(':').map(Number)
  return new Date(year, month - 1, day, hour, minute)
}

export function displayDateTime(date: string, time: string): string {
  const formattedDate = parseDateTime(date, time)

  return format(formattedDate, 'd MMM HH:mm')
}

export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}
