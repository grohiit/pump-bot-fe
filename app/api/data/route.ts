import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.PUMP_URL

  if (!url) {
    return NextResponse.json(
      { error: 'PUMP_URL environment variable is not set' },
      { status: 500 }
    )
  }

  console.log(
    new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
    url
  )

  const res = await fetch(url, { cache: 'no-store' })
  const response = await res.json()

  return NextResponse.json(response)
}
