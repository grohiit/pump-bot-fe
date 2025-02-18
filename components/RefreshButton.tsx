'use client'

import { FiRefreshCw } from 'react-icons/fi'

type Props = {
  handleRefresh: () => void
  loading: boolean
}

export default function RefreshButton({ handleRefresh, loading }: Props) {
  return (
    <button
      className="mx-2 rounded-full border border-white p-2"
      onClick={handleRefresh}
      disabled={loading}
    >
      {<FiRefreshCw className={`${loading && 'animate-spin'}`} />}
    </button>
  )
}
