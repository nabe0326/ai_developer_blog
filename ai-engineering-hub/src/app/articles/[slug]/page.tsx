import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Tag, User } from 'lucide-react'
import { articlesApi } from '@/lib/microcms'
import { Article } from '@/types/microcms'
import { dateUtils } from '@/lib/utils'
import ArticleContent from '@/components/blog/ArticleContent'
import ArticleCard from '@/components/blog/ArticleCard'
import TableOfContents from '@/components/blog/TableOfContents'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

async function getArticle(slug: string): Promise<Article | null> {
  try {
    console.log('Fetching article with slug:', slug)
    
    // まず全記事を取得してスラッグを確認
    console.log('First, fetching all articles to check available slugs...')
    const allArticles = await articlesApi.getList({ limit: 100 })
    console.log('Available article slugs:', allArticles.contents.map(a => a.slug))
    
    // スラッグで検索
    const response = await articlesApi.getBySlug(slug)
    console.log('Slug search response:', response)
    
    if (response.contents && response.contents.length > 0) {
      return response.contents[0]
    } else {
      console.log('No article found with slug:', slug)
      return null
    }
  } catch (error) {
    console.error('Failed to fetch article:', error)
    return null
  }
}

async function getRelatedArticles(categoryId: string, currentArticleId: string): Promise<Article[]> {
  try {
    const response = await articlesApi.getByCategory(categoryId, {
      limit: 4,
      filters: `id[not_equals]${currentArticleId}`,
    })
    return response.contents.slice(0, 3)
  } catch (error) {
    console.error('Failed to fetch related articles:', error)
    return []
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    return {
      title: 'Article Not Found - AI Engineering Hub',
      description: 'The requested article could not be found.',
    }
  }

  return {
    title: `${article.title} - AI Engineering Hub`,
    description: article.excerpt,
    keywords: article.tags,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: ['AI Engineering Hub'],
      tags: article.tags,
      images: article.featured_image ? [
        {
          url: article.featured_image.url,
          width: article.featured_image.width,
          height: article.featured_image.height,
          alt: article.title,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: article.featured_image ? [article.featured_image.url] : undefined,
    },
  }
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
}

const contentTypeLabels = {
  experience: '実体験',
  research: '調査情報',
  tutorial: 'チュートリアル',
}

const targetAudienceLabels = {
  engineer: 'エンジニア向け',
  enterprise: '企業向け',
  both: 'エンジニア・企業向け',
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    notFound()
  }

  const relatedArticles = article.category 
    ? await getRelatedArticles(article.category.id, article.id)
    : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Back Navigation */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link 
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-primary-900 transition-all duration-300 hover:bg-gray-100 px-3 py-2 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            記事一覧に戻る
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl xl:max-w-3xl mx-auto px-4 py-12">
        <header className="mb-12">
          {/* Badges */}
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-4 py-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white text-sm font-semibold rounded-full shadow-sm">
              {contentTypeLabels[article.content_type]}
            </span>
            <span className={`px-4 py-2 text-sm font-semibold rounded-full shadow-sm ${difficultyColors[article.difficulty_level]}`}>
              {article.difficulty_level === 'beginner' && '初級'}
              {article.difficulty_level === 'intermediate' && '中級'}
              {article.difficulty_level === 'advanced' && '上級'}
            </span>
            <span className="px-4 py-2 bg-primary-50 text-primary-700 text-sm font-semibold rounded-full border border-primary-200">
              {targetAudienceLabels[article.target_audience]}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-primary-900 mb-6 leading-tight bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-gray-700 mb-8 leading-relaxed font-light">
            {article.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50">
            <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
              <Calendar className="w-4 h-4 mr-2 text-accent-600" />
              <time dateTime={article.publishedAt}>
                {dateUtils.formatDate(article.publishedAt)}
              </time>
            </div>
            <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
              <Clock className="w-4 h-4 mr-2 text-accent-600" />
              <span>{article.reading_time}分で読める</span>
            </div>
            {article.category && (
              <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                <Tag className="w-4 h-4 mr-2 text-accent-600" />
                <Link 
                  href={`/categories/${article.category.slug}`}
                  className="hover:text-accent-600 transition-colors duration-200 font-medium"
                >
                  {article.category.name}
                </Link>
              </div>
            )}
            <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
              <User className="w-4 h-4 mr-2 text-accent-600" />
              <span className="font-medium">AI Engineering Hub</span>
            </div>
          </div>

          {/* Tags */}
          {article.tags && (
            <div className="flex flex-wrap gap-3 mb-10">
              {(() => {
                // タグを配列として処理
                const tagArray = Array.isArray(article.tags) 
                  ? article.tags 
                  : typeof article.tags === 'string' 
                    ? article.tags.split(',').map(tag => tag.trim()) 
                    : []
                
                return tagArray.map((tag, index) => (
                  <Link
                    key={index}
                    href={`/tags/${encodeURIComponent(tag)}`}
                    className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-full hover:border-accent-300 hover:bg-accent-50 hover:text-accent-700 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    #{tag}
                  </Link>
                ))
              })()}
            </div>
          )}
        </header>

        {/* Article Content */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden" data-article-content>
          <ArticleContent content={article.content} />
        </div>
      </article>
      
      {/* Table of Contents - positioned outside article */}
      <TableOfContents content={article.content} />

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16" data-related-section>
          <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-200/50 shadow-lg">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-primary-900 mb-4">関連記事</h2>
              <p className="text-gray-600">こちらの記事もおすすめです</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedArticles.map((relatedArticle) => (
                <ArticleCard key={relatedArticle.id} article={relatedArticle} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}