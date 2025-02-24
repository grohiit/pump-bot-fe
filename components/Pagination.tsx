'use client'
import { AiOutlineRight, AiOutlineLeft } from 'react-icons/ai'
import { useState, useEffect } from 'react'
type PaginationProps = {
  maxPages: number
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

export default function Pagination({
  maxPages,
  currentPage,
  setCurrentPage,
}: PaginationProps) {
  const [pages, setPages] = useState<(string | number)[]>([1])

  useEffect(() => {
    if (currentPage > maxPages) setCurrentPage(maxPages)
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
