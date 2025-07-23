import { Article } from '@/types/microcms';
import ArticleCard from '@/components/blog/ArticleCard';
import { Pagination } from '@/components/ui/Pagination';

interface SearchResultsProps {
  articles: Article[];
  totalCount: number;
  currentPage: number;
  query: string;
  category: string;
}

export function SearchResults({ 
  articles, 
  totalCount, 
  currentPage, 
  query, 
  category 
}: SearchResultsProps) {
  const totalPages = Math.ceil(totalCount / 12);

  if (articles.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">記事が見つかりませんでした</h2>
        <p className="text-gray-600">検索条件を変更してお試しください。</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <p className="text-gray-600">
        {totalCount}件の記事が見つかりました
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl="/search"
          searchParams={{ q: query, category }}
        />
      )}
    </div>
  );
}