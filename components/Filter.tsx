'use client'
import { BsSearch } from 'react-icons/bs'
import { useState } from 'react'
import { PumpLaunch } from '@/utils/types'

type Props = {
  filterLaunches: (searchTerm: string) => void
  pumpLaunches: PumpLaunch[]
}

export default function Filter({ filterLaunches, pumpLaunches }: Props) {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="flex sm:w-96 p-2 rounded-md h-10 bg-white gap-2 items-center border border-black my-2">
      <BsSearch />
      <input
        className="w-full focus:outline-none"
        type="Text"
        placeholder="realDonaldTrump"
        value={searchTerm}
        onChange={(e) => {
          const searchTerm = e.target.value
          setSearchTerm(searchTerm)
          filterLaunches(searchTerm)
        }}
      />
    </div>
  )
}
