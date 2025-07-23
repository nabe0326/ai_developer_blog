import { searchArticles, getCategories } from '@/lib/microcms';
import { SearchResults } from '@/components/search/SearchResults';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchFilters } from '@/components/search/SearchFilters';
import { getTagsFromArticles } from '@/lib/search';
import { Metadata } from 'next';
import { Suspense } from 'react';

interface SearchPageProps {
  searchParams: Promise<{ 
    q?: string; 
    category?: string; 
    page?: string;
    tags?: string;
    contentType?: string;
    targetAudience?: string;
    difficultyLevel?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

// 動的レンダリング（毎回サーバーで実行）
export const dynamic = 'force-dynamic';

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q || '';
  const title = query ? `「${query}」の検索結果` : 'すべての記事';
  
  return {
    title: `${title} | AI Engineering Hub`,
    description: query ? `「${query}」に関する記事の検索結果です。` : 'AI Engineering Hubの全記事一覧です。',
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';
  const category = params.category || '';
  const page = parseInt(params.page || '1');
  const tags = params.tags ? params.tags.split(',') : undefined;
  const contentType = params.contentType || '';
  const targetAudience = params.targetAudience || '';
  const difficultyLevel = params.difficultyLevel || '';
  

  const [results, categoriesResponse, allArticlesForTags] = await Promise.all([
    searchArticles({
      query,
      category,
      tags,
      contentType,
      targetAudience,
      difficultyLevel,
      page,
      limit: 12
    }),
    getCategories(),
    // タグ用に全記事を取得（フィルタリングなし）
    searchArticles({
      limit: 100
    })
  ]);

  const availableTags = getTagsFromArticles(allArticlesForTags.contents);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {query ? `「${query}」の検索結果` : 'すべての記事'}
        </h1>
        
        {/* 検索バー（モバイル用） */}
        <div className="sm:hidden mb-6">
          <Suspense fallback={<div className="w-full h-10 bg-gray-200 rounded animate-pulse" />}>
            <SearchBar placeholder="記事を検索..." autoFocus />
          </Suspense>
        </div>
      </div>
      
      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* フィルターサイドバー */}
        <div className="lg:col-span-1">
          <Suspense fallback={<div className="w-full h-64 bg-gray-200 rounded animate-pulse" />}>
            <SearchFilters 
              categories={categoriesResponse.contents}
              availableTags={availableTags}
            />
          </Suspense>
        </div>
        
        {/* 検索結果 */}
        <div className="lg:col-span-3">
          <SearchResults 
            articles={results.contents}
            totalCount={results.totalCount}
            currentPage={page}
            query={query}
            category={category}
          />
        </div>
      </div>
    </div>
  );
}