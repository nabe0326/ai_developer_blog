'use client'

import { useState, useEffect, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import CodeBlock from '@/components/ui/CodeBlock'

interface ArticleContentClientProps {
  content: string
}

interface TocItem {
  id: string
  title: string
  level: number
}

// Markdown component props interface
interface MarkdownProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node?: any
  inline?: boolean
  className?: string
  children?: React.ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}


// マークダウン用コードブロックコンポーネント
function MarkdownCodeBlock({ children, className, ...props }: MarkdownProps) {
  const match = /language-(\w+)/.exec(className || '')
  const language = match ? match[1] : 'text'
  const code = String(children).replace(/\n$/, '')

  return (
    <CodeBlock
      code={code}
      language={language}
      {...props}
    />
  )
}

// カスタムコンポーネント定義
const components = {
  code: ({ inline, children, className, ...props }: MarkdownProps) => {
    return !inline ? (
      <MarkdownCodeBlock className={className} {...props}>
        {children}
      </MarkdownCodeBlock>
    ) : (
      <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
        {children}
      </code>
    )
  },
  h1: ({ children, ...props }: MarkdownProps) => (
    <h1 className="text-3xl font-bold text-primary-900 mt-8 mb-4 pb-2 border-b border-gray-200" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: MarkdownProps) => {
    const id = String(children)
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    
    return (
      <h2 id={id} className="text-2xl md:text-3xl font-bold text-primary-900 mt-12 mb-6 scroll-mt-20 pb-2 border-b-2 border-accent-100" {...props}>
        {children}
      </h2>
    )
  },
  h3: ({ children, ...props }: MarkdownProps) => {
    const id = String(children)
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    
    return (
      <h3 id={id} className="text-xl md:text-2xl font-semibold text-primary-900 mt-10 mb-4 scroll-mt-20" {...props}>
        {children}
      </h3>
    )
  },
  h4: ({ children, ...props }: MarkdownProps) => (
    <h4 className="text-lg font-semibold text-primary-900 mt-4 mb-2" {...props}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }: MarkdownProps) => (
    <p className="mb-4 sm:mb-6 leading-relaxed sm:leading-loose text-gray-800 text-sm sm:text-base md:text-lg" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: MarkdownProps) => (
    <ul className="mb-6 pl-6 space-y-3 list-disc marker:text-accent-500" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: MarkdownProps) => (
    <ol className="mb-6 pl-6 space-y-3 list-decimal marker:text-accent-500" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: MarkdownProps) => (
    <li className="text-gray-800 leading-relaxed sm:leading-loose text-sm sm:text-base md:text-lg" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: MarkdownProps) => (
    <blockquote className="border-l-4 border-accent-500 pl-4 sm:pl-6 py-3 sm:py-4 my-6 sm:my-8 bg-gradient-to-r from-accent-50/50 to-primary-50/30 rounded-r-lg italic text-gray-800 text-sm sm:text-base md:text-lg leading-relaxed sm:leading-loose" {...props}>
      {children}
    </blockquote>
  ),
  table: ({ children, ...props }: MarkdownProps) => (
    <div className="overflow-x-auto w-full max-w-full my-4 sm:my-6">
      <table className="min-w-full border border-gray-300 text-sm sm:text-base" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: MarkdownProps) => (
    <thead className="bg-gray-50" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }: MarkdownProps) => (
    <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left font-semibold text-gray-900 text-sm sm:text-base" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: MarkdownProps) => (
    <td className="border border-gray-300 px-2 sm:px-4 py-2 text-gray-700 text-sm sm:text-base" {...props}>
      {children}
    </td>
  ),
  a: ({ children, ...props }: MarkdownProps) => (
    <a 
      className="text-accent-600 hover:text-accent-700 underline transition-colors duration-200" 
      target="_blank" 
      rel="noopener noreferrer" 
      {...props}
    >
      {children}
    </a>
  ),
  strong: ({ children, ...props }: MarkdownProps) => (
    <strong className="font-semibold text-gray-900" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: MarkdownProps) => (
    <em className="italic text-gray-700" {...props}>
      {children}
    </em>
  ),
}

// 目次生成のためのヘッダー抽出
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

    // h1は除外し、h2-h6のみ目次に含める
    if (level >= 2 && level <= 6) {
      items.push({ id: existingId, title, level })
    }
  }

  return items
}

// HTMLコンテンツからコードブロックを抽出してReactコンポーネントで置き換える
function HtmlContentWithSyntaxHighlighting({ content }: { content: string }) {
  const [processedContent, setProcessedContent] = useState<string>('')
  const [codeBlocks, setCodeBlocks] = useState<{ id: string; code: string; language: string; filename?: string }[]>([])

  useEffect(() => {
    // コードブロックを抽出
    const blocks: { id: string; code: string; language: string; filename?: string }[] = []
    let processedHtml = content

    // MicroCMSのファイル名付きコードブロックパターンを処理
    processedHtml = processedHtml.replace(/<div data-filename="([^"]*)">\s*<pre>\s*<code class="language-(\w+)">([\s\S]*?)<\/code>\s*<\/pre>\s*<\/div>/gi, (match, filename, language, code) => {
      const id = `code-block-${blocks.length}`
      const decodedCode = code
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&amp;/g, '&')
      
      blocks.push({ id, code: decodedCode, language, filename })
      return `<div data-code-block-id="${id}"></div>`
    })

    // 通常の<pre><code>パターンを見つけて置き換え
    processedHtml = processedHtml.replace(/<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/gi, (match, language, code) => {
      const id = `code-block-${blocks.length}`
      const decodedCode = code
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&amp;/g, '&')
      
      blocks.push({ id, code: decodedCode, language })
      return `<div data-code-block-id="${id}"></div>`
    })

    // 一般的な<pre><code>パターンも処理
    processedHtml = processedHtml.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/gi, (match, code) => {
      const id = `code-block-${blocks.length}`
      const decodedCode = code
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&amp;/g, '&')
      
      blocks.push({ id, code: decodedCode, language: 'text' })
      return `<div data-code-block-id="${id}"></div>`
    })

    setCodeBlocks(blocks)
    setProcessedContent(processHtmlContent(processedHtml))
  }, [content])

  useEffect(() => {
    // コードブロックを動的に挿入
    codeBlocks.forEach(({ id, code, language, filename }) => {
      const element = document.querySelector(`[data-code-block-id="${id}"]`)
      if (element) {
        const codeBlockElement = document.createElement('div')
        codeBlockElement.innerHTML = ''
        element.parentNode?.replaceChild(codeBlockElement, element)
        
        // Reactコンポーネントとしてマウント
        import('react-dom/client').then(({ createRoot }) => {
          const root = createRoot(codeBlockElement)
          root.render(<CodeBlockForHtml code={code} language={language} filename={filename} />)
        })
      }
    })
  }, [processedContent, codeBlocks])

  return (
    <div 
      dangerouslySetInnerHTML={{ 
        __html: processedContent
      }} 
    />
  )
}

// HTML用のコードブロックコンポーネント
function CodeBlockForHtml({ code, language, filename }: { code: string; language: string; filename?: string }) {
  return (
    <CodeBlock
      code={code}
      language={language}
      filename={filename}
    />
  )
}

function processHtmlContent(content: string): string {
  return content
    .replace(/<h([2-6])([^>]*?)(?:\s+id="[^"]*")?([^>]*)>(.*?)<\/h\1>/gi, (match, level, attrs1, attrs2, text) => {
      // 既存のid属性を保持
      const existingIdMatch = match.match(/id="([^"]*)"/)
      const existingId = existingIdMatch ? existingIdMatch[1] : ''
      
      const className = level === '2' 
        ? 'text-2xl md:text-3xl font-bold text-primary-900 mt-12 mb-6 scroll-mt-20 pb-2 border-b-2 border-accent-100'
        : level === '3'
        ? 'text-xl md:text-2xl font-semibold text-primary-900 mt-10 mb-4 scroll-mt-20'
        : 'text-lg font-semibold text-primary-900 mt-8 mb-3'
      
      return `<h${level} id="${existingId}" class="${className}"${attrs1}${attrs2}>${text}</h${level}>`
    })
    .replace(/<p([^>]*)>/gi, '<p class="mb-4 sm:mb-6 leading-relaxed sm:leading-loose text-gray-800 text-sm sm:text-base md:text-lg"$1>')
    .replace(/<ul([^>]*)>/gi, '<ul class="mb-4 sm:mb-6 pl-4 sm:pl-6 space-y-2 sm:space-y-3 list-disc marker:text-accent-500"$1>')
    .replace(/<ol([^>]*)>/gi, '<ol class="mb-4 sm:mb-6 pl-4 sm:pl-6 space-y-2 sm:space-y-3 list-decimal marker:text-accent-500"$1>')
    .replace(/<li([^>]*)>/gi, '<li class="text-gray-800 leading-relaxed sm:leading-loose text-sm sm:text-base md:text-lg"$1>')
    .replace(/<blockquote([^>]*)>/gi, '<blockquote class="border-l-4 border-accent-500 pl-4 sm:pl-6 py-3 sm:py-4 my-6 sm:my-8 bg-gradient-to-r from-accent-50/50 to-primary-50/30 rounded-r-lg italic text-gray-800 text-sm sm:text-base md:text-lg leading-relaxed sm:leading-loose"$1>')
    .replace(/<strong([^>]*)>/gi, '<strong class="font-semibold text-gray-900"$1>')
    .replace(/<em([^>]*)>/gi, '<em class="italic text-gray-800"$1>')
    .replace(/<a([^>]*?)>/gi, '<a class="text-accent-600 hover:text-accent-700 underline transition-colors duration-200" target="_blank" rel="noopener noreferrer"$1>')
    .replace(/<code([^>]*)>/gi, '<code class="bg-gray-100 text-gray-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-mono"$1>')
    .replace(/<table([^>]*)>/gi, '<div class="overflow-x-auto w-full max-w-full my-6 sm:my-8"><table class="min-w-full border border-gray-300 rounded-lg text-sm sm:text-base"$1>')
    .replace(/<\/table>/gi, '</table></div>')
    .replace(/<thead([^>]*)>/gi, '<thead class="bg-gray-50"$1>')
    .replace(/<th([^>]*)>/gi, '<th class="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-gray-900 text-sm sm:text-base"$1>')
    .replace(/<td([^>]*)>/gi, '<td class="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-gray-800 text-sm sm:text-base"$1>')
}

export default function ArticleContentClient({ content }: ArticleContentClientProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [tocOpen, setTocOpen] = useState(false)
  const [showAllTocItems, setShowAllTocItems] = useState(false)
  
  const isHtml = useMemo(() => isHtmlContent(content), [content])
  
  // 目次アイテムを生成
  const tocItems = useMemo(() => {
    return isHtml ? extractTocItemsFromHtml(content) : extractTocItems(content)
  }, [content, isHtml])

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


  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTocOpen(false)
    }
  }

  // サイドバーに目次を追加する関数
  useEffect(() => {
    const sidebarContainer = document.getElementById('sidebar-toc-container')
    if (sidebarContainer && tocItems.length > 0) {
      sidebarContainer.innerHTML = ''
      
      const ul = document.createElement('ul')
      ul.className = 'space-y-1'
      
      const itemsToShow = showAllTocItems ? tocItems : tocItems.slice(0, 10)
      
      itemsToShow.forEach((item) => {
        const li = document.createElement('li')
        const button = document.createElement('button')
        
        const indentClass = {
          2: '',
          3: 'ml-3',
          4: 'ml-6',
          5: 'ml-9',
          6: 'ml-12'
        }[item.level] || ''
        
        button.className = `w-full text-left text-sm py-2 px-3 rounded-md transition-all duration-200 hover:bg-accent-50 hover:text-accent-700 relative ${indentClass} ${
          activeId === item.id 
            ? 'text-accent-600 bg-accent-50 font-medium border-l-2 border-accent-500' 
            : 'text-gray-700 hover:text-primary-900'
        }`
        
        const span = document.createElement('span')
        span.className = 'block leading-relaxed'
        span.textContent = item.title
        button.appendChild(span)
        
        button.onclick = () => scrollToHeading(item.id)
        
        li.appendChild(button)
        ul.appendChild(li)
      })
      
      if (!showAllTocItems && tocItems.length > 10) {
        const li = document.createElement('li')
        const button = document.createElement('button')
        button.className = 'w-full text-center py-2 px-3 text-sm text-accent-600 hover:text-accent-700 font-medium transition-colors duration-200 border-t border-gray-200 mt-2 pt-3 rounded-md hover:bg-accent-50'
        button.textContent = `もっと見る（+${tocItems.length - 10}項目）`
        button.onclick = () => setShowAllTocItems(true)
        li.appendChild(button)
        ul.appendChild(li)
      }
      
      sidebarContainer.appendChild(ul)
    }
  }, [tocItems, activeId, showAllTocItems])

  return (
    <div className="relative">
        {/* 目次 - モバイル・タブレット版 */}
        {tocItems.length > 0 && (
          <div className="mb-16 xl:hidden">
              {/* モバイル・タブレット - 折りたたみ式 */}
              <div>
                <button
                  onClick={() => setTocOpen(!tocOpen)}
                  className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-accent-50 to-primary-50 rounded-xl border border-gray-200/50 text-left shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <span className="flex items-center text-base font-semibold text-primary-900">
                    <div className="w-2 h-2 bg-accent-500 rounded-full mr-3"></div>
                    目次を表示
                  </span>
                  <ChevronRight 
                    className={cn(
                      "w-5 h-5 text-accent-600 transition-transform duration-300",
                      tocOpen && "rotate-90"
                    )} 
                  />
                </button>
                
                {tocOpen && (
                  <div className="mt-4 p-6 bg-white rounded-xl border border-gray-200/50 shadow-lg">
                    <nav>
                      <ul className="space-y-2">
                        {(showAllTocItems ? tocItems : tocItems.slice(0, 8)).map((item, index) => (
                          <li key={`${item.id}-${index}`}>
                            <button
                              onClick={() => scrollToHeading(item.id)}
                              className={cn(
                                'w-full text-left text-sm py-3 px-4 rounded-lg transition-all duration-300 hover:bg-accent-50 hover:text-accent-700 relative',
                                item.level === 3 && 'ml-6',
                                item.level === 4 && 'ml-12',
                                item.level === 5 && 'ml-18',
                                item.level === 6 && 'ml-24',
                                activeId === item.id 
                                  ? 'text-accent-600 bg-accent-50 font-medium shadow-sm' 
                                  : 'text-gray-600 hover:text-primary-900'
                              )}
                            >
                              {activeId === item.id && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-500 rounded-full"></div>
                              )}
                              <span className="block">{item.title}</span>
                            </button>
                          </li>
                        ))}
                        {tocItems.length > 8 && (
                          <li>
                            <button
                              onClick={() => setShowAllTocItems(!showAllTocItems)}
                              className="w-full text-center py-3 px-4 text-xs text-accent-600 hover:text-accent-700 font-medium transition-colors duration-200 border-t border-gray-100 mt-2 pt-4"
                            >
                              {showAllTocItems ? '簡潔表示' : `もっと見る（他 ${tocItems.length - 8} 項目）`}
                            </button>
                          </li>
                        )}
                      </ul>
                    </nav>
                  </div>
                )}
              </div>

              {/* デスクトップ - 常時表示（xl以下で非表示） */}
              <div className="hidden lg:block xl:hidden">
                <div className="p-6 bg-gradient-to-r from-accent-50 to-primary-50 rounded-xl border border-gray-200/50 shadow-sm">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200/50">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-accent-500 rounded-full mr-3"></div>
                      <h3 className="text-base font-bold text-primary-900">
                        目次
                      </h3>
                    </div>
                    {tocItems.length > 5 && (
                      <button
                        onClick={() => setShowAllTocItems(!showAllTocItems)}
                        className="text-xs text-accent-600 hover:text-accent-700 font-medium transition-colors duration-200"
                      >
                        {showAllTocItems ? '簡潔表示' : 'もっと見る'}
                      </button>
                    )}
                  </div>
                  <nav>
                    <ul className="space-y-1">
                      {(showAllTocItems ? tocItems : tocItems.slice(0, 5)).map((item, index) => (
                        <li key={`${item.id}-${index}`}>
                          <button
                            onClick={() => scrollToHeading(item.id)}
                            className={cn(
                              'w-full text-left text-sm py-2 px-3 rounded-lg transition-all duration-300 hover:bg-white hover:text-accent-700 relative',
                              item.level === 3 && 'ml-4',
                              item.level === 4 && 'ml-8',
                              item.level === 5 && 'ml-12',
                              item.level === 6 && 'ml-16',
                              activeId === item.id 
                                ? 'text-accent-600 bg-white font-medium shadow-sm' 
                                : 'text-gray-700 hover:text-primary-900'
                            )}
                          >
                            {activeId === item.id && (
                              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent-500 rounded-full"></div>
                            )}
                            <span className="block truncate">{item.title}</span>
                          </button>
                        </li>
                      ))}
                      {!showAllTocItems && tocItems.length > 5 && (
                        <li>
                          <button
                            onClick={() => setShowAllTocItems(true)}
                            className="w-full text-center py-2 px-3 text-xs text-accent-600 hover:text-accent-700 font-medium transition-colors duration-200 border-t border-gray-100 mt-2 pt-3 rounded-lg hover:bg-accent-50"
                          >
                            もっと見る（{tocItems.length - 5}項目）
                          </button>
                        </li>
                      )}
                    </ul>
                  </nav>
                </div>
              </div>
          </div>
        )}

        {/* 記事本文 */}
        <div className="p-4 sm:p-6 md:p-8 lg:p-12 leading-relaxed">
          <div className="prose max-w-none max-w-full overflow-hidden">
            {isHtml ? (
              <HtmlContentWithSyntaxHighlighting content={content} />
            ) : (
              <ReactMarkdown
                components={components}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                  rehypeSlug,
                  [rehypeAutolinkHeadings, { behavior: 'wrap' }]
                ]}
              >
                {content}
              </ReactMarkdown>
            )}
          </div>
        </div>
    </div>
  )
}