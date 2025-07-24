import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getArticles } from '@/lib/microcms';
import ArticleCard from '@/components/blog/ArticleCard';
import { Article, ArticleResponse } from '@/types/microcms';
import { Metadata } from 'next';

const getFallbackImageForSite = () => {
  // サイト全体のOGP画像として固定でimage1を使用（ランダムではない）
  return '/image1.png'
}

export const metadata: Metadata = {
  title: 'AI Engineering Hub - 実践的AI技術情報',
  description: 'エンジニアと企業向けの実践的なAI技術情報を発信するブログです。Dify、Claude、GPT、プロンプトエンジニアリングなどの最新AI技術について解説します。',
  keywords: ['AI', '人工知能', 'Claude', 'GPT', 'Dify', 'プロンプトエンジニアリング', 'AI開発', '機械学習', 'エンジニア'],
  authors: [{ name: 'AI Engineering Hub' }],
  creator: 'AI Engineering Hub',
  publisher: 'AI Engineering Hub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-developer-blog.vercel.app',
    siteName: 'AI Engineering Hub',
    title: 'AI Engineering Hub - 実践的AI技術情報',
    description: 'エンジニアと企業向けの実践的なAI技術情報を発信するブログです。Dify、Claude、GPT、プロンプトエンジニアリングなどの最新AI技術について解説します。',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-developer-blog.vercel.app'}${getFallbackImageForSite()}`,
        width: 1200,
        height: 630,
        alt: 'AI Engineering Hub - 実践的AI技術情報',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ai_engineering_hub',
    creator: '@ai_engineering_hub',
    title: 'AI Engineering Hub - 実践的AI技術情報',
    description: 'エンジニアと企業向けの実践的なAI技術情報を発信するブログです。',
    images: [`${process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-developer-blog.vercel.app'}${getFallbackImageForSite()}`],
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

// キャッシュなし（常に最新データを取得）
export const dynamic = 'force-dynamic';

// エラーハンドリング用のフォールバックコンポーネント
function ArticleGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
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

async function ArticleGrid() {
  try {
    const response: ArticleResponse = await getArticles({
      limit: 12,
      orders: '-publishedAt',
      fields: 'id,title,slug,excerpt,category,tags,featured_image,content_type,target_audience,difficulty_level,reading_time,publishedAt'
    });
    
    if (!response.contents || response.contents.length === 0) {
      return (
        <div className="text-center py-16">
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">記事がありません</h3>
          <p className="text-gray-500">まだ記事が投稿されていません。しばらくお待ちください。</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {response.contents.map((article: Article, index: number) => (
          <ArticleCard 
            key={article.id} 
            article={article} 
            priority={index < 3} // 最初の3つの画像を優先読み込み
          />
        ))}
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    return (
      <div className="text-center py-16">
        <div className="text-red-500 mb-4">
          <Sparkles className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">記事の読み込みに失敗しました</h3>
        <p className="text-gray-500 mb-4">
          MicroCMSとの接続を確認してください。環境変数が正しく設定されているか確認してください。
        </p>
        <details className="text-left bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
          <summary className="cursor-pointer font-medium">エラー詳細</summary>
          <pre className="mt-2 whitespace-pre-wrap">{String(error)}</pre>
        </details>
      </div>
    );
  }
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-700 to-primary-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            AI Engineering
            <span className="block text-accent-500">Hub</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            AI技術の実践的情報を発信するブログサイト。<br />
            エンジニア・企業向けに最新のAI開発事例、ツール、ノウハウを提供します。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/articles"
              className="inline-flex items-center px-6 py-3 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              記事一覧を見る
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center px-6 py-3 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors duration-200"
            >
              サイトについて
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-primary-900 mb-2">
                最新記事
              </h2>
              <p className="text-gray-600">
                最新のAI技術情報をお届けします
              </p>
            </div>
            <Link 
              href="/articles"
              className="hidden sm:inline-flex items-center text-accent-500 hover:text-accent-600 font-medium transition-colors duration-200"
            >
              すべて見る
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          <Suspense fallback={<ArticleGridSkeleton />}>
            <ArticleGrid />
          </Suspense>

          {/* Mobile "View All" Button */}
          <div className="text-center mt-12 sm:hidden">
            <Link 
              href="/articles"
              className="inline-flex items-center px-6 py-3 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors duration-200"
            >
              すべての記事を見る
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
