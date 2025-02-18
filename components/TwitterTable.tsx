'use client'

import { useState, useEffect } from 'react'

import { PumpLaunch } from '@/utils/types'
import SingleLaunchRow from './SingleLaunchRow'

type Props = { pumpLaunches: PumpLaunch[]; fetched: number }

export default function TwitterTable({ pumpLaunches, fetched }: Props) {
  const PER_PAGE = 20
  const launchCount = pumpLaunches.length
  const totalPages = Math.ceil(launchCount / PER_PAGE)

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [startIndex, setStartIndex] = useState(PER_PAGE * (currentPage - 1))
  const [endIndex, setEndIndex] = useState(PER_PAGE * currentPage)

  const [displayLaunches, setDisplayLaunches] = useState<PumpLaunch[]>(
    pumpLaunches.filter((v, i) => i >= startIndex && i < endIndex)
  )
  const [sortAsc, setSortAsc] = useState(true)
  const [sortKey, setSortKey] = useState('URL')

  useEffect(() => {
    const startIndex = PER_PAGE * (currentPage - 1)
    const endIndex = PER_PAGE * currentPage
    setStartIndex(startIndex)
    setEndIndex(endIndex)
    setDisplayLaunches(
      pumpLaunches
        .sort((a, b) => {
          if (sortKey === 'URL')
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
  }, [currentPage, sortKey, sortAsc])

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
    if (sortKey !== newSortKey) setSortKey(newSortKey)
    setSortAsc(!sortAsc)
    return
  }

  return (
    <div>
      <table className="w-full text-center table-fixed">
        <thead className="">
          <tr className="">
            <THeadCell
              displayText="URL"
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
    </div>
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

import { AiOutlineRight, AiOutlineLeft } from 'react-icons/ai'
import RefreshButton from './RefreshButton'
// import { delay, parseDateTime } from '@/utils/helperFns'

type PaginationProps = {
  maxPages: number
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

function Pagination({
  maxPages,
  currentPage,
  setCurrentPage,
}: PaginationProps) {
  const [pages, setPages] = useState<(string | number)[]>([1])

  useEffect(() => {
    if (maxPages <= 7) {
      let array = []
      for (let i = 1; i <= maxPages; i++) array.push(i)
      setPages(array)
    } else if (currentPage <= 3)
      setPages([1, 2, 3, 4, '...', maxPages - 1, maxPages])
    else if (currentPage >= maxPages - 2)
      setPages([
        1,
        2,
        '...',
        maxPages - 3,
        maxPages - 2,
        maxPages - 1,
        maxPages,
      ])
    else
      setPages([
        1,
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        maxPages,
      ])
  }, [currentPage, maxPages])

  function nextPage() {
    currentPage < maxPages && setCurrentPage(++currentPage)
  }
  function prevPage() {
    currentPage > 1 && setCurrentPage(--currentPage)
  }
  if (maxPages === 1) return null
  return (
    <div className="flex shrink rounded-lg items-center justify-center">
      <button
        onClick={prevPage}
        className="h-10 w-10
                rounded-full hover:bg-gray-900 hover:text-white flex items-center justify-center"
      >
        <AiOutlineLeft />
      </button>

      {pages.map((page, index) => (
        <PageButton
          currentPage={currentPage}
          page={page}
          key={index}
          setCurrentPage={setCurrentPage}
        />
      ))}

      <button
        onClick={nextPage}
        className="h-10 w-10
               rounded-full hover:bg-gray-900 hover:text-white flex items-center justify-center"
      >
        <AiOutlineRight />
      </button>
    </div>
  )
}

type ButtonProps = {
  page: string | number
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}
function PageButton({ page, currentPage, setCurrentPage }: ButtonProps) {
  return (
    <button
      onClick={() => page !== '...' && setCurrentPage(page as number)}
      className={`h-6 w-6 xs:h-10 xs:w-10
          ${currentPage === page && 'bg-gray-900 text-white'} mx-2 rounded-full
          ${page === '...' && 'cursor-not-allowed'}
          `}
    >
      {page}
    </button>
  )
}
