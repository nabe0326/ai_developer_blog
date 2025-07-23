import { getRelatedArticles } from '@/lib/microcms';
import ArticleCard from './ArticleCard';

interface RelatedArticlesProps {
  categoryId?: string;
  currentSlug: string;
}

export default async function RelatedArticles({ 
  categoryId, 
  currentSlug 
}: RelatedArticlesProps) {
  if (!categoryId) return null;
  
  const relatedArticles = await getRelatedArticles(categoryId, currentSlug);
  
  if (relatedArticles.length === 0) return null;

  return (
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
  );
}