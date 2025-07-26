import { getArticles } from '@/lib/microcms';
import { getPopularArticles } from '@/lib/relatedness';
import PopularArticleCard from './PopularArticleCard';
import { TrendingUp } from 'lucide-react';

interface PopularArticlesProps {
  limit?: number;
}

export default async function PopularArticles({ limit = 6 }: PopularArticlesProps) {
  try {
    // より多くの記事を取得してから人気記事を選定
    const response = await getArticles({ limit: Math.min(limit * 2, 20) });
    const popularArticles = getPopularArticles(response.contents, limit);
    
    if (popularArticles.length === 0) return null;

    return (
      <section className="max-w-6xl mx-auto px-4 py-12" data-popular-section>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 border border-blue-100 shadow-lg">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-blue-600 rounded-full p-3 mr-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-blue-900">この記事も読まれています</h2>
            </div>
            <p className="text-blue-700">最新の人気記事をチェック</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularArticles.map((article, index) => (
              <PopularArticleCard
                key={article.id}
                article={article}
                rank={index + 1}
                priority={index < 3}
              />
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Error fetching popular articles:', error);
    return null;
  }
}