import { Suspense } from 'react'
import { Metadata } from 'next'
import { Search } from 'lucide-react'
import { getArticles } from '@/lib/microcms'
import { Article } from '@/types/microcms'
import ArticleCard from '@/components/blog/ArticleCard'
import { Pagination } from '@/components/ui/Pagination'

export const metadata: Metadata = {
  title: '記事一覧',
  description: 'AI技術に関する実践的な記事の一覧です。開発事例、技術調査、チュートリアルなど様々な情報を提供しています。',
}

// キャッシュを無効化してリアルタイム更新を実現
export const dynamic = 'force-dynamic';

function ArticleGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
          <div className="aspect-video bg-gray-200" />
          <div className="p-6">
            <div className="h-4 bg-gray-200 rounded mb-3" />
            <div className="h-6 bg-gray-200 rounded mb-3" />
            <div className="h-4 bg-gray-200 rounded mb-2" />
            <div className="h-4 bg-gray-200 rounded mb-4" />
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-4 bg-gray-200 rounded w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

async function ArticlesList({ page }: { page: number }) {
  try {
    const limit = 12
    const offset = (page - 1) * limit

    const response = await getArticles({
      limit,
      offset,
      orders: '-publishedAt',
    })

    if (!response.contents || response.contents.length === 0) {
      return (
        <div className="text-center py-16">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">記事がありません</h3>
          <p className="text-gray-500">記事が投稿されていません。</p>
        </div>
      )
    }

    const totalPages = Math.ceil(response.totalCount / limit)

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {response.contents.map((article: Article, index: number) => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              priority={index < 6}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/articles"
          />
        )}
      </>
    )
  } catch (error) {
    console.error('Failed to fetch articles:', error)
    return (
      <div className="text-center py-16">
        <div className="text-red-500 mb-4">
          <Search className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">記事の読み込みに失敗しました</h3>
        <p className="text-gray-500">しばらくしてから再度お試しください。</p>
      </div>
    )
  }
}

interface ArticlesPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const { page } = await searchParams
  const currentPage = page ? parseInt(page, 10) : 1

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-primary-900 mb-4">記事一覧</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            AI技術に関する実践的な記事をお届けします。開発事例、技術調査、チュートリアルなど、
            エンジニアと企業の皆様に役立つ情報を幅広く掲載しています。
          </p>
        </div>

        {/* Articles Grid */}
        <Suspense fallback={<ArticleGridSkeleton />}>
          <ArticlesList page={currentPage} />
        </Suspense>
      </div>
    </div>
  )
}