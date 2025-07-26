import { Article } from '@/types/microcms';
import ArticleCard from '@/components/blog/ArticleCard';
import { Pagination } from '@/components/ui/Pagination';
import NoSearchResults from '@/components/search/NoSearchResults';

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
    return <NoSearchResults query={query} category={category} />;
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