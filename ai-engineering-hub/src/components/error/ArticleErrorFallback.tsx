import Link from 'next/link';
import { Suspense } from 'react';
import { AlertCircle, ArrowLeft, Search, Home } from 'lucide-react';
import { getArticles } from '@/lib/microcms';
import { Article } from '@/types/microcms';
import RefreshButton from '@/components/ui/RefreshButton';

async function FallbackArticles() {
  try {
    const response = await getArticles({ limit: 4 });
    return (
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          代わりにこちらの記事はいかがですか？
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {response.contents.map((article: Article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <h4 className="font-medium text-gray-900 mb-2">{article.title}</h4>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{article.excerpt}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {article.category.name}
                </span>
                <span>{article.reading_time}分で読める</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching fallback articles:', error);
    return (
      <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-600">おすすめ記事の読み込みに失敗しました</p>
      </div>
    );
  }
}

function LoadingFallbackArticles() {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        代わりにこちらの記事はいかがですか？
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
              <div className="flex gap-2">
                <div className="h-5 bg-gray-200 rounded w-16"></div>
                <div className="h-5 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ArticleErrorFallbackProps {
  slug?: string;
  error?: string;
  categoryId?: string;
}

export default function ArticleErrorFallback({ 
  slug, 
  error = "記事の読み込みに失敗しました",
  categoryId 
}: ArticleErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="mb-8">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              記事の読み込みエラー
            </h1>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              {error}
              {slug && ` (記事ID: ${slug})`}
              <br />
              一時的な問題の可能性があります。少し時間をおいて再度お試しください。
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <RefreshButton />
            <Link
              href="/"
              className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-300 transition-colors duration-200 inline-flex items-center justify-center"
            >
              <Home className="w-4 h-4 mr-2" />
              ホームに戻る
            </Link>
            <Link
              href="/articles"
              className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-300 transition-colors duration-200 inline-flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              記事一覧
            </Link>
            <Link
              href="/search"
              className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-300 transition-colors duration-200 inline-flex items-center justify-center"
            >
              <Search className="w-4 h-4 mr-2" />
              検索する
            </Link>
          </div>

          <div className="max-w-3xl mx-auto">
            <Suspense fallback={<LoadingFallbackArticles />}>
              <FallbackArticles />
            </Suspense>
          </div>

          {categoryId && (
            <div className="mt-8 text-center">
              <Link
                href={`/categories`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                カテゴリ一覧から他の記事を探す →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}