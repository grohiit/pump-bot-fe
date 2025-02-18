import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function GET(req: Request) {
  const url = process.env.PUMP_URL

  if (!url) {
    return NextResponse.json(
      { error: 'PUMP_URL environment variable is not set' },
      { status: 500 }
    )
  }

  const { searchParams } = new URL(req.url)
  const shouldRefresh = searchParams.get('refresh') === 'true'

  console.log(
    new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
    url,
    shouldRefresh ? 'Forcing re-fetch' : 'Using cache'
  )

  if (shouldRefresh) {
    revalidatePath('/api/data')
  }

  const fetchOptions: RequestInit = shouldRefresh
    ? { cache: 'no-store' as const }
    : { next: { revalidate: 180 } }
  const res = await fetch(url, fetchOptions)
  const response = await res.json()

  return NextResponse.json(response)
}
