import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Folder } from 'lucide-react'
import { articlesApi, categoriesApi } from '@/lib/microcms'
import { Article, Category } from '@/types/microcms'
import ArticleCard from '@/components/blog/ArticleCard'
import Pagination from '@/components/ui/Pagination'

interface CategoryPageProps {
  params: Promise<{ category: string }>
  searchParams: Promise<{ page?: string }>
}

async function getCategory(categorySlug: string): Promise<Category | null> {
  try {
    const response = await categoriesApi.getList({
      filters: `slug[equals]${categorySlug}`,
      limit: 1,
    })
    
    return response.contents[0] || null
  } catch (error) {
    console.error('Failed to fetch category:', error)
    return null
  }
}

async function getArticlesByCategory(
  categoryId: string,
  page: number = 1,
  limit: number = 12
): Promise<{ articles: Article[]; totalCount: number }> {
  try {
    const offset = (page - 1) * limit
    const response = await articlesApi.getByCategory(categoryId, {
      limit,
      offset,
    })
    
    return {
      articles: response.contents,
      totalCount: response.totalCount,
    }
  } catch (error) {
    console.error('Failed to fetch articles by category:', error)
    return { articles: [], totalCount: 0 }
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params
  const category = await getCategory(categorySlug)

  if (!category) {
    return {
      title: 'Category Not Found - AI Engineering Hub',
      description: 'The requested category could not be found.',
    }
  }

  return {
    title: `${category.name} - AI Engineering Hub`,
    description: `${category.name}に関する記事一覧です。AI技術の実践的な情報を発信しています。`,
    openGraph: {
      title: `${category.name} - AI Engineering Hub`,
      description: `${category.name}に関する記事一覧です。AI技術の実践的な情報を発信しています。`,
      type: 'website',
    },
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category: categorySlug } = await params
  const { page } = await searchParams
  const currentPage = page ? parseInt(page, 10) : 1
  
  const category = await getCategory(categorySlug)
  
  if (!category) {
    notFound()
  }

  const { articles, totalCount } = await getArticlesByCategory(category.id, currentPage)
  const totalPages = Math.ceil(totalCount / 12)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Back Navigation */}
          <Link 
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-primary-900 transition-colors duration-200 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            記事一覧に戻る
          </Link>

          {/* Category Header */}
          <div className="flex items-center mb-4">
            <Folder className="w-8 h-8 text-accent-500 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-primary-900">
              {category.name}
            </h1>
          </div>
          
          {category.description && (
            <p className="text-lg text-gray-600 max-w-3xl">
              {category.description}
            </p>
          )}
          
          <div className="mt-4 text-sm text-gray-500">
            {totalCount}件の記事
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl={`/categories/${categorySlug}`}
              />
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              記事が見つかりませんでした
            </h2>
            <p className="text-gray-500">
              このカテゴリにはまだ記事がありません。
            </p>
            <Link
              href="/"
              className="inline-block mt-6 px-6 py-3 bg-accent-500 text-white font-medium rounded-lg hover:bg-accent-600 transition-colors duration-200"
            >
              全記事を見る
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}