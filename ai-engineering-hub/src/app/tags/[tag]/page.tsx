import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Tag } from 'lucide-react';
import { getArticlesByTag } from '@/lib/microcms';
import ArticleCard from '@/components/blog/ArticleCard';
import { Pagination } from '@/components/ui/Pagination';

// 動的レンダリング（タグは無制限なのでSSGは使わない）
export const dynamic = 'force-dynamic';



export async function generateMetadata(
  { params }: { params: Promise<{ tag: string }> }
): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  
  return {
    title: `#${decodedTag} | AI Engineering Hub`,
    description: `「${decodedTag}」タグが付いた記事一覧です。AI技術の実践的な情報を発信しています。`,
    openGraph: {
      title: `#${decodedTag} | AI Engineering Hub`,
      description: `「${decodedTag}」タグが付いた記事一覧です。`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `#${decodedTag} | AI Engineering Hub`,
      description: `「${decodedTag}」タグが付いた記事一覧です。`,
    },
  };
}

export default async function TagPage({ 
  params, 
  searchParams 
}: {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { tag } = await params;
  const { page } = await searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;
  const decodedTag = decodeURIComponent(tag);
  
  const response = await getArticlesByTag(decodedTag, { 
    limit: 12, 
    offset: (currentPage - 1) * 12 
  });
  
  const articles = response.contents;
  const totalCount = response.totalCount;
  const totalPages = Math.ceil(totalCount / 12);

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

          {/* Tag Header */}
          <div className="flex items-center mb-4">
            <Tag className="w-8 h-8 text-accent-500 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-primary-900">
              #{decodedTag}
            </h1>
          </div>
          
          <p className="text-lg text-gray-600">
            「{decodedTag}」に関する記事一覧
          </p>
          
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
                baseUrl={`/tags/${tag}`}
                searchParams={{}}
              />
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              記事が見つかりませんでした
            </h2>
            <p className="text-gray-500">
              「{decodedTag}」タグの記事はありません。
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