'use client'

import { useState, useEffect } from 'react'
import TwitterTable from '@/components/TwitterTable'
import { PumpLaunch } from '@/utils/types'

export default function Home() {
  const [pumpLaunches, setPumpLaunches] = useState<PumpLaunch[]>([])
  const [fetched, setFetched] = useState(0)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/data')
        const result = await response.json()
        setPumpLaunches(result.pumpLaunches)
        setFetched(result.fetched)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div className="p-4 text-center">Loading...</div>

  return (
    <div className="p-4 mx-auto">
      <h1 className="text-2xl font-bold mb-0">Recent Releases</h1>
      <small>
        Fetched at{' '}
        {new Date(fetched).toLocaleString('en-US', { timeZoneName: 'short' })}
      </small>
      <div className="bg-gray-100 p-4 rounded  mx-auto">
        <TwitterTable pumpLaunches={pumpLaunches} fetched={fetched} />
      </div>
    </div>
  )
}
