import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  searchParams?: Record<string, string>
}

function buildUrl(baseUrl: string, page: number, searchParams?: Record<string, string>): string {
  const url = new URL(baseUrl, 'http://localhost')
  
  if (page > 1) {
    url.searchParams.set('page', page.toString())
  }
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== 'page' && value) {
        url.searchParams.set(key, value)
      }
    })
  }
  
  return url.pathname + url.search
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  baseUrl, 
  searchParams 
}: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // すべてのページを表示
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // 省略記号を含む表示
      if (currentPage <= 3) {
        // 最初の方のページ
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // 最後の方のページ
        pages.push(1)
        pages.push('ellipsis')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // 中間のページ
        pages.push(1)
        pages.push('ellipsis')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav className="flex justify-center items-center space-x-1" aria-label="ページネーション">
      {/* 前のページ */}
      {currentPage > 1 ? (
        <Link
          href={buildUrl(baseUrl, currentPage - 1, searchParams)}
          className="flex items-center px-3 py-2 text-sm bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors duration-200 rounded-md"
          aria-label="前のページ"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          前へ
        </Link>
      ) : (
        <div className="flex items-center px-3 py-2 text-sm bg-gray-100 border border-gray-200 text-gray-400 rounded-md cursor-not-allowed">
          <ChevronLeft className="w-4 h-4 mr-1" />
          前へ
        </div>
      )}

      {/* ページ番号 */}
      {pageNumbers.map((page, index) => (
        page === 'ellipsis' ? (
          <span 
            key={`ellipsis-${index}`} 
            className="px-3 py-2 text-sm text-gray-400"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <Link
            key={page}
            href={buildUrl(baseUrl, page, searchParams)}
            className={`px-3 py-2 text-sm transition-colors duration-200 rounded-md ${
              page === currentPage
                ? 'bg-accent-500 text-white font-medium'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            aria-label={`ページ ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </Link>
        )
      ))}

      {/* 次のページ */}
      {currentPage < totalPages ? (
        <Link
          href={buildUrl(baseUrl, currentPage + 1, searchParams)}
          className="flex items-center px-3 py-2 text-sm bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors duration-200 rounded-md"
          aria-label="次のページ"
        >
          次へ
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      ) : (
        <div className="flex items-center px-3 py-2 text-sm bg-gray-100 border border-gray-200 text-gray-400 rounded-md cursor-not-allowed">
          次へ
          <ChevronRight className="w-4 h-4 ml-1" />
        </div>
      )}
    </nav>
  )
}