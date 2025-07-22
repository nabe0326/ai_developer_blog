import { Metadata } from 'next'
import Link from 'next/link'
import { Folder, FileText } from 'lucide-react'
import { categoriesApi, articlesApi } from '@/lib/microcms'
import { Category } from '@/types/microcms'

export const metadata: Metadata = {
  title: 'カテゴリ一覧 - AI Engineering Hub',
  description: 'AI技術に関する記事のカテゴリ一覧です。実装事例、技術調査、業務効率化、開発Tipsなど様々なカテゴリの記事をご覧いただけます。',
  openGraph: {
    title: 'カテゴリ一覧 - AI Engineering Hub',
    description: 'AI技術に関する記事のカテゴリ一覧です。実装事例、技術調査、業務効率化、開発Tipsなど様々なカテゴリの記事をご覧いただけます。',
    type: 'website',
  },
}

async function getCategoriesWithCounts(): Promise<(Category & { articleCount: number })[]> {
  try {
    // カテゴリ一覧を取得
    const categoriesResponse = await categoriesApi.getList({ limit: 100 })
    
    // 各カテゴリの記事数を取得
    const categoriesWithCounts = await Promise.all(
      categoriesResponse.contents.map(async (category) => {
        try {
          const articlesResponse = await articlesApi.getByCategory(category.id, {
            limit: 1, // 記事数だけ知りたいので1件だけ取得
          })
          return {
            ...category,
            articleCount: articlesResponse.totalCount,
          }
        } catch (error) {
          console.error(`Failed to fetch article count for category ${category.id}:`, error)
          return {
            ...category,
            articleCount: 0,
          }
        }
      })
    )

    // 記事数の多い順にソート
    return categoriesWithCounts.sort((a, b) => b.articleCount - a.articleCount)
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return []
  }
}

export default async function CategoriesPage() {
  const categories = await getCategoriesWithCounts()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center mb-4">
            <Folder className="w-8 h-8 text-accent-500 mr-3" />
            <h1 className="text-4xl font-bold text-primary-900">カテゴリ一覧</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl">
            AI技術に関する記事を分野別にご覧いただけます。
            実装事例、技術調査、業務効率化、開発Tipsなど、様々なカテゴリの記事を掲載しています。
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-accent-500/20 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Folder className="w-6 h-6 text-accent-500 mr-3" />
                      <h2 className="text-xl font-bold text-primary-900 group-hover:text-accent-600 transition-colors duration-200">
                        {category.name}
                      </h2>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      <FileText className="w-4 h-4 mr-1" />
                      <span>{category.articleCount}件</span>
                    </div>
                  </div>

                  {category.description && (
                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                      {category.description}
                    </p>
                  )}

                  <div className="flex items-center text-accent-600 font-medium text-sm">
                    記事を見る →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              カテゴリがありません
            </h3>
            <p className="text-gray-500">
              カテゴリが設定されていません。
            </p>
            <Link
              href="/"
              className="inline-block mt-6 px-6 py-3 bg-accent-500 text-white font-medium rounded-lg hover:bg-accent-600 transition-colors duration-200"
            >
              ホームに戻る
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}