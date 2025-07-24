import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowLeft, Calendar, Clock, Tag, User } from 'lucide-react';
import { getArticleWithErrorHandling, getAllArticles } from '@/lib/microcms';
import ArticleContent from '@/components/blog/ArticleContent';
import { ArticleStructuredData } from '@/components/blog/StructuredData';
import dynamic from 'next/dynamic';

// 関連記事コンポーネント
const RelatedArticles = dynamic(
  () => import('@/components/blog/RelatedArticles').catch(() => ({ default: () => null })),
  {
    loading: () => <div>関連記事を読み込み中...</div>,
  }
);


// 静的パス生成
export async function generateStaticParams() {
  const articles = await getAllArticles({ limit: 100 });
  
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

// ISR設定（10分間キャッシュ）
export const revalidate = 600;

const getFallbackImageByCategory = (categorySlug?: string) => {
  const categoryImageMap: Record<string, string> = {
    'implementation': '/image1.png',  // 実装事例
    'research': '/image2.png',        // 技術調査
    'efficiency': '/image3.png',      // 業務効率化
    'tips': '/image4.png',           // 開発Tips
  }
  
  if (categorySlug && categoryImageMap[categorySlug]) {
    return categoryImageMap[categorySlug]
  }
  
  // デフォルト画像
  return '/image1.png'
}

// 動的メタデータ
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleWithErrorHandling(slug);
  
  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  const ogImage = article.featured_image?.url || getFallbackImageByCategory(article.category?.slug)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-developer-blog.vercel.app'
  const absoluteOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`

  return {
    title: `${article.title} | AI Engineering Hub`,
    description: article.excerpt,
    keywords: article.tags ? (Array.isArray(article.tags) ? article.tags.join(', ') : article.tags) : undefined,
    authors: [{ name: 'AI Engineering Hub' }],
    creator: 'AI Engineering Hub',
    publisher: 'AI Engineering Hub',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      url: `${siteUrl}/articles/${article.slug}`,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: ['AI Engineering Hub'],
      tags: article.tags ? (Array.isArray(article.tags) ? article.tags : article.tags.split(',').map(tag => tag.trim())) : undefined,
      images: [
        {
          url: absoluteOgImage,
          width: 1200,
          height: 630,
          alt: article.title,
        }
      ],
      siteName: 'AI Engineering Hub',
      locale: 'ja_JP',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@ai_engineering_hub',
      creator: '@ai_engineering_hub',
      title: article.title,
      description: article.excerpt,
      images: [absoluteOgImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_VERIFICATION,
    },
  };
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

const difficultyLabels = {
  beginner: '初級',
  intermediate: '中級',
  advanced: '上級',
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default async function ArticlePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const article = await getArticleWithErrorHandling(slug);
  
  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <ArticleStructuredData article={article} />
      
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
      <article className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative">
        <header className="mb-8 sm:mb-12">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs sm:text-sm font-semibold rounded-full shadow-sm">
              {contentTypeLabels[article.contentType]}
            </span>
            <span className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-full shadow-sm ${difficultyColors[article.difficultyLevel]}`}>
              {difficultyLabels[article.difficultyLevel]}
            </span>
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary-50 text-primary-700 text-xs sm:text-sm font-semibold rounded-full border border-primary-200">
              {targetAudienceLabels[article.targetAudience]}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-900 mb-4 sm:mb-6 leading-tight bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8 leading-relaxed font-light">
            {article.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8 p-4 sm:p-6 bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200/50">
            <div className="flex items-center bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-accent-600" />
              <time dateTime={article.publishedAt}>
                {formatDate(article.publishedAt)}
              </time>
            </div>
            <div className="flex items-center bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-accent-600" />
              <span>{article.reading_time}分で読める</span>
            </div>
            {article.category && (
              <div className="flex items-center bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
                <Tag className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-accent-600" />
                <Link 
                  href={`/categories/${article.category.slug}`}
                  className="hover:text-accent-600 transition-colors duration-200 font-medium"
                >
                  {article.category.name}
                </Link>
              </div>
            )}
            <div className="flex items-center bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
              <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-accent-600" />
              <span className="font-medium">AI Engineering Hub</span>
            </div>
          </div>

          {/* Tags */}
          {article.tags && (
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 sm:mb-10">
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
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 text-gray-700 text-xs sm:text-sm font-medium rounded-full hover:border-accent-300 hover:bg-accent-50 hover:text-accent-700 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    #{tag}
                  </Link>
                ))
              })()}
            </div>
          )}
        </header>

        {/* Article Content with Sidebar Layout */}
        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col xl:flex-row gap-6 xl:gap-8">
            {/* Main Content */}
            <div className="flex-1 xl:max-w-4xl min-w-0">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden" data-article-content>
                <ArticleContent content={article.content} />
              </div>
            </div>

            {/* Right Sidebar - TOC */}
            <aside className="hidden xl:block w-80 flex-shrink-0">
              <div className="sticky top-24">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm p-6">
                  <div className="flex items-center mb-4 pb-3 border-b border-gray-200/50">
                    <div className="w-2 h-2 bg-accent-500 rounded-full mr-3"></div>
                    <h3 className="text-base font-bold text-primary-900">
                      目次
                    </h3>
                  </div>
                  <nav className="max-h-96 overflow-y-auto">
                    <div id="sidebar-toc-container">
                      {/* 目次は ArticleContentClient から動的に挿入されます */}
                    </div>
                  </nav>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {/* 関連記事（Suspense使用） */}
      <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-16 text-center">関連記事を読み込み中...</div>}>
        <RelatedArticles categoryId={article.category?.id} currentSlug={article.slug} />
      </Suspense>
    </div>
  )
}