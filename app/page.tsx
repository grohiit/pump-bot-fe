'use client'

import { useState, useEffect } from 'react'
import TwitterTable from '@/components/TwitterTable'
import { PumpLaunch } from '@/utils/types'
import RefreshButton from '@/components/RefreshButton'
import { delay } from '@/utils/helperFns'

export default function Home() {
  const [pumpLaunches, setPumpLaunches] = useState<PumpLaunch[]>([])
  const [fetched, setFetched] = useState(0)

  const [loading, setLoading] = useState(true)

  const handleRefresh = async () => {
    setLoading(true)
    await fetchData(true)
    setLoading(false)
  }

  async function fetchData(refresh: boolean = false) {
    try {
      const response = await fetch(
        '/api/data' + (refresh ? '?refresh=true' : '')
      )

      const result = await response.json()
      setPumpLaunches(result.pumpLaunches)
      setFetched(result.fetched)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="p-4 mx-auto">
      <h1 className="text-2xl font-bold mb-0">
        Recent Releases{' '}
        <RefreshButton handleRefresh={handleRefresh} loading={loading} />
      </h1>
      <small>
        Fetched at{' '}
        {!fetched
          ? ''
          : new Date(fetched).toLocaleString('en-US', {
              timeZoneName: 'short',
              weekday: 'short',
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
      </small>

      <div className="bg-gray-100 p-4 rounded  mx-auto">
        <TwitterTable
          pumpLaunches={pumpLaunches}
          fetched={fetched}
          loading={loading}
        />
      </div>
    </div>
  )
}
