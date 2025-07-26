import Link from 'next/link';
import { Suspense } from 'react';
import { Search, TrendingUp, BookOpen, Lightbulb } from 'lucide-react';
import { getArticles } from '@/lib/microcms';
import { Article } from '@/types/microcms';

async function PopularArticles() {
  try {
    const response = await getArticles({ limit: 6 });
    return (
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
          人気記事
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {response.contents.map((article: Article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">{article.title}</h4>
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
    console.error('Error fetching popular articles:', error);
    return null;
  }
}

function LoadingPopularArticles() {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
        人気記事
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
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

interface NoSearchResultsProps {
  query: string;
  category?: string;
}

export default function NoSearchResults({ query, category }: NoSearchResultsProps) {
  const suggestions = [
    'AI実装',
    'API連携',
    'プロンプト',
    'Claude',
    'ChatGPT',
    'データ分析',
    '業務効率化',
    'Python',
  ];

  return (
    <div className="text-center py-16">
      <div className="mb-8">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          検索結果が見つかりませんでした
        </h2>
        {query && (
          <p className="text-gray-600 mb-4">
            「<span className="font-medium">{query}</span>」に一致する記事はありませんでした
          </p>
        )}
        {category && (
          <p className="text-gray-600 mb-4">
            カテゴリ「<span className="font-medium">{category}</span>」での検索結果です
          </p>
        )}
      </div>

      <div className="max-w-2xl mx-auto mb-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
          検索のコツ
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-left">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">キーワードを変更</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• より一般的な用語を使用</li>
              <li>• 類似語・関連語で検索</li>
              <li>• 英語・カタカナを変更</li>
            </ul>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">検索条件を緩和</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• カテゴリフィルターを解除</li>
              <li>• タグフィルターを調整</li>
              <li>• 難易度設定を変更</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          よく検索されるキーワード
        </h3>
        <div className="flex flex-wrap justify-center gap-2">
          {suggestions.map((suggestion) => (
            <Link
              key={suggestion}
              href={`/search?q=${encodeURIComponent(suggestion)}`}
              className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-full border border-gray-300 text-sm font-medium transition-colors duration-200 hover:border-blue-300"
            >
              {suggestion}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <Link
          href="/articles"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 inline-flex items-center justify-center"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          すべての記事を見る
        </Link>
        <Link
          href="/categories"
          className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-300 transition-colors duration-200"
        >
          カテゴリから探す
        </Link>
      </div>

      <Suspense fallback={<LoadingPopularArticles />}>
        <PopularArticles />
      </Suspense>
    </div>
  );
}