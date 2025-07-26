'use client';

import { useEffect, useState } from 'react';
import { Article } from '@/types/microcms';
import { calculateRelatedArticles, RelatednessScore } from '@/lib/relatedness';
import RelatedArticleCard from './RelatedArticleCard';
import { Target, Loader2 } from 'lucide-react';

interface EnhancedRelatedArticlesProps {
  targetArticle: Article;
  candidateArticles: Article[];
  limit?: number;
}

export default function EnhancedRelatedArticles({ 
  targetArticle, 
  candidateArticles,
  limit = 6 
}: EnhancedRelatedArticlesProps) {
  const [relatedScores, setRelatedScores] = useState<RelatednessScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // クライアントサイドで関連度計算を実行
    const calculateScores = () => {
      try {
        const scores = calculateRelatedArticles(targetArticle, candidateArticles, limit);
        setRelatedScores(scores);
      } catch (error) {
        console.error('Error calculating relatedness scores:', error);
        setRelatedScores([]);
      } finally {
        setIsLoading(false);
      }
    };

    // 少し遅延させてスムーズなローディング体験を提供
    const timer = setTimeout(calculateScores, 300);
    return () => clearTimeout(timer);
  }, [targetArticle, candidateArticles, limit]);

  if (isLoading) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-16" data-related-section>
        <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-200/50 shadow-lg">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin mr-2" />
              <span className="text-gray-600">関連記事を分析中...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (relatedScores.length === 0) {
    return null;
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-16" data-related-section>
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-200/50 shadow-lg">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-600 rounded-full p-3 mr-4">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">関連記事</h2>
          </div>
          <p className="text-gray-600">あなたの興味に合わせて厳選された記事</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedScores.map((relatedScore, index) => (
            <RelatedArticleCard
              key={relatedScore.article.id}
              relatednessScore={relatedScore}
              priority={index < 3}
              showScore={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
}