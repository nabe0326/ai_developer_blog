'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface TocItem {
  id: string
  title: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

function isHtmlContent(content: string): boolean {
  return /<[^>]+>/.test(content)
}

function extractTocItemsFromHtml(content: string): TocItem[] {
  const headingRegex = /<(h[1-6])([^>]*?)id="([^"]*)"[^>]*>(.*?)<\/\1>/gi
  const items: TocItem[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = parseInt(match[1].charAt(1))
    const existingId = match[3]
    const title = match[4].replace(/<[^>]+>/g, '').trim()

    if (level >= 2 && level <= 6) {
      items.push({ id: existingId, title, level })
    }
  }

  return items
}

function extractTocItems(content: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const items: TocItem[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const title = match[2].trim()
    const id = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    items.push({ id, title, level })
  }

  return items
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [isFixed, setIsFixed] = useState(true)
  const [topPosition, setTopPosition] = useState('6rem')
  
  const isHtml = isHtmlContent(content)
  const tocItems = isHtml ? extractTocItemsFromHtml(content) : extractTocItems(content)

  // スクロール位置の監視
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-80px 0px -80% 0px' }
    )

    const headings = document.querySelectorAll('h2[id], h3[id]')
    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [content])

  // 目次のスクロール位置制御
  useEffect(() => {
    const handleScroll = () => {
      const articleContent = document.querySelector('[data-article-content]')
      
      if (!articleContent) return

      const articleRect = articleContent.getBoundingClientRect()
      const tocHeight = 450
      
      const articleBottomFromTop = articleRect.bottom
      const shouldStick = articleBottomFromTop > (tocHeight + 100)

      if (shouldStick && !isFixed) {
        setIsFixed(true)
        setTopPosition('6rem')
      } else if (!shouldStick && isFixed) {
        const scrollTop = window.pageYOffset
        const articleTop = articleRect.top + scrollTop
        const stopPosition = articleRect.bottom + scrollTop - tocHeight - 100
        
        setIsFixed(false)
        setTopPosition(`${Math.max(0, stopPosition - articleTop)}px`)
      }
    }

    const throttledScroll = () => {
      requestAnimationFrame(handleScroll)
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })
    window.addEventListener('resize', throttledScroll, { passive: true })
    
    // 初回実行
    handleScroll()

    return () => {
      window.removeEventListener('scroll', throttledScroll)
      window.removeEventListener('resize', throttledScroll)
    }
  }, [isFixed]) // isFixedの変化のみを監視

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (tocItems.length === 0) return null

  return (
    <div 
      className="hidden xl:block w-72 z-30"
      style={{
        position: isFixed ? 'fixed' : 'absolute',
        top: topPosition,
        right: '2rem'
      }}
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200/50 p-6 max-h-[70vh] overflow-y-auto">
        <div className="flex items-center mb-4 pb-3 border-b border-gray-100">
          <div className="w-2 h-2 bg-accent-500 rounded-full mr-3"></div>
          <h3 className="text-base font-bold text-primary-900">
            目次
          </h3>
        </div>
        <nav>
          <ul className="space-y-1">
            {tocItems.map((item, index) => (
              <li key={`${item.id}-${index}`}>
                <button
                  onClick={() => scrollToHeading(item.id)}
                  className={cn(
                    'w-full text-left text-sm py-2 px-3 rounded-lg transition-all duration-300 hover:bg-accent-50 hover:text-accent-700 group relative',
                    item.level === 3 && 'ml-4',
                    item.level === 4 && 'ml-8',
                    item.level === 5 && 'ml-12',
                    item.level === 6 && 'ml-16',
                    activeId === item.id 
                      ? 'text-accent-600 bg-accent-50 font-medium shadow-sm' 
                      : 'text-gray-600 hover:text-primary-900'
                  )}
                >
                  {activeId === item.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent-500 rounded-full"></div>
                  )}
                  <span className="block truncate">{item.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}