'use client'

import dynamic from 'next/dynamic'

interface ArticleContentProps {
  content: string
}

// クライアントサイド専用のコンポーネントを動的にインポート
const ArticleContentClient = dynamic(
  () => import('./ArticleContentClient'),
  { 
    ssr: false,
    loading: () => (
      <div className="prose max-w-none p-6 lg:p-8">
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
          </div>
          <p className="text-gray-500 mt-4">記事を読み込み中...</p>
        </div>
      </div>
    )
  }
)

export default function ArticleContent({ content }: ArticleContentProps) {
  return <ArticleContentClient content={content} />
}