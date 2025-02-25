'use client'

import { useState, useEffect } from 'react'

import { PumpLaunch } from '@/utils/types'
import SingleLaunchRow from './SingleLaunchRow'
import { FaSpinner } from 'react-icons/fa'
import Pagination from './Pagination'

type Props = { pumpLaunches: PumpLaunch[]; fetched: number; loading: boolean }

export default function TwitterTable({
  pumpLaunches,
  fetched,
  loading,
}: Props) {
  const PER_PAGE = 20
  const launchCount = pumpLaunches.length
  const totalPages = Math.ceil(launchCount / PER_PAGE)

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [startIndex, setStartIndex] = useState(PER_PAGE * (currentPage - 1))
  const [endIndex, setEndIndex] = useState(PER_PAGE * currentPage)

  const [displayLaunches, setDisplayLaunches] = useState<PumpLaunch[]>(
    pumpLaunches.filter((v, i) => i >= startIndex && i < endIndex)
  )
  const [sortAsc, setSortAsc] = useState<boolean>(false)
  const [sortKey, setSortKey] = useState('1hr')

  useEffect(() => {
    const startIndex = PER_PAGE * (currentPage - 1)
    const endIndex = PER_PAGE * currentPage
    setStartIndex(startIndex)
    setEndIndex(endIndex)
    setDisplayLaunches(
      pumpLaunches
        .sort((a, b) => {
          if (sortKey === 'URLs')
            return sortAsc
              ? a.url.localeCompare(b.url)
              : b.url.localeCompare(a.url)
          else
            return timeStampCompare(
              sortKey,
              b.timestamps,
              a.timestamps,
              sortAsc
            )
        })
        .filter((v, i) => i >= startIndex && i < endIndex)
    )
  }, [currentPage, sortKey, sortAsc, pumpLaunches])

  function timeStampCompare(
    sortKey: string,
    bTimestamps: number[],
    aTimestamps: number[],
    sortAsc: boolean
  ) {
    let timestamp = 0
    if (sortKey == '5m') timestamp = fetched - 5 * 60 * 1000
    if (sortKey == '1hr') timestamp = fetched - 1 * 60 * 60 * 1000
    if (sortKey == '24hr') timestamp = fetched - 24 * 60 * 60 * 1000
    if (sortKey == '7d') timestamp = fetched - 7 * 24 * 60 * 60 * 1000
    const bCount = bTimestamps.filter((t) => t > timestamp).length
    const aCount = aTimestamps.filter((t) => t > timestamp).length
    return sortAsc ? aCount - bCount : bCount - aCount
  }

  function handleSort(newSortKey: string) {
    if (sortKey == newSortKey) return setSortAsc(!sortAsc)
    return setSortKey(newSortKey), setSortAsc(false)
  }

  if (loading)
    return <FaSpinner className="animate-spin mx-auto text-center" size={80} />

  return (
    <>
      <table className="w-full text-center table-fixed">
        <thead className="">
          <tr className="">
            <THeadCell
              displayText="URLs"
              sortKey={sortKey}
              sortAsc={sortAsc}
              handleClick={handleSort}
            />
            <THeadCell
              displayText="5m"
              sortKey={sortKey}
              sortAsc={sortAsc}
              handleClick={handleSort}
            />
            <THeadCell
              displayText="1hr"
              sortKey={sortKey}
              sortAsc={sortAsc}
              handleClick={handleSort}
            />
            <THeadCell
              displayText="24hr"
              sortKey={sortKey}
              sortAsc={sortAsc}
              handleClick={handleSort}
            />
            <THeadCell
              displayText="7d"
              sortKey={sortKey}
              sortAsc={sortAsc}
              handleClick={handleSort}
            />
            <THeadCell
              displayText="Total"
              sortKey={sortKey}
              sortAsc={sortAsc}
              handleClick={handleSort}
            />
          </tr>
        </thead>
        <tbody>
          {displayLaunches.map((launch, index) => {
            return <SingleLaunchRow key={index} pumpLaunch={launch} />
          })}
        </tbody>
      </table>
      <div className="flex flex-col items-center md:flex-row md:justify-between sm:mx-5 my-5  ">
        <div className="w-fit font-medium">
          Results {startIndex + 1}-{Math.min(endIndex, launchCount)} of
          {` ${launchCount}`}
        </div>
        <Pagination
          maxPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </>
  )
}

type TableHeaderProps = {
  displayText: string
  handleClick: (v: string) => void
  sortKey: string
  sortAsc: boolean
}
function THeadCell({
  displayText,
  handleClick,
  sortKey,
  sortAsc,
}: TableHeaderProps) {
  return (
    <th className="px-1 py-2">
      <div
        className="cursor-pointer flex bold w-fit mx-auto md:p-2"
        onClick={() => handleClick(displayText)}
      >
        {displayText}
        <SortIcon
          sortKey={sortKey}
          sortAsc={sortAsc}
          displayText={displayText}
        />
      </div>
    </th>
  )
}

import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa'
type SortIconProps = {
  sortKey: string
  sortAsc: boolean
  displayText: string
}
function SortIcon({ sortKey, sortAsc, displayText }: SortIconProps) {
  return (
    <div className="self-center mx-1">
      {sortKey !== displayText ? (
        <FaSort />
      ) : sortAsc ? (
        <FaSortUp />
      ) : (
        <FaSortDown />
      )}
    </div>
  )
}
