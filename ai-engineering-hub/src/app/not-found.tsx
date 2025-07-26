import Link from 'next/link';
import { Suspense } from 'react';
import { getArticles } from '@/lib/microcms';
import { Article } from '@/types/microcms';

async function SuggestedArticles() {
  try {
    const response = await getArticles({ limit: 3 });
    return (
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          こちらの記事はいかがですか？
        </h3>
        <div className="grid gap-4">
          {response.contents.map((article: Article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <h4 className="font-medium text-gray-900 mb-1">{article.title}</h4>
              <p className="text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
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
    console.error('Error fetching suggested articles:', error);
    return null;
  }
}

function LoadingSuggestedArticles() {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        こちらの記事はいかがですか？
      </h3>
      <div className="grid gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              <div className="mt-2 flex gap-2">
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

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              ページが見つかりません
            </h2>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              お探しのページは移動または削除された可能性があります。
              以下のリンクから他のページをご覧ください。
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              ホームに戻る
            </Link>
            <Link
              href="/articles"
              className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-300 transition-colors duration-200"
            >
              記事一覧を見る
            </Link>
            <Link
              href="/search"
              className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-300 transition-colors duration-200"
            >
              検索する
            </Link>
          </div>

          <div className="max-w-2xl mx-auto">
            <Suspense fallback={<LoadingSuggestedArticles />}>
              <SuggestedArticles />
            </Suspense>
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              カテゴリから探す
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                href="/categories/implementation"
                className="bg-green-100 text-green-800 hover:bg-green-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                実装事例
              </Link>
              <Link
                href="/categories/research"
                className="bg-purple-100 text-purple-800 hover:bg-purple-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                技術調査
              </Link>
              <Link
                href="/categories/efficiency"
                className="bg-orange-100 text-orange-800 hover:bg-orange-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                業務効率化
              </Link>
              <Link
                href="/categories/tips"
                className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                開発Tips
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}