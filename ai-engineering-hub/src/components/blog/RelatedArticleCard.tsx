'use client';

import Link from 'next/link';
import { Calendar, Clock, Tag, TrendingUp } from 'lucide-react';
import { microCMSUtils } from '@/lib/microcms';
import { stringUtils, dateUtils } from '@/lib/utils';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { RelatednessScore, getRelatednessLevel } from '@/lib/relatedness';

interface RelatedArticleCardProps {
  relatednessScore: RelatednessScore;
  priority?: boolean;
  showScore?: boolean;
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800', 
  advanced: 'bg-red-100 text-red-800',
};

const contentTypeLabels = {
  experience: '実体験',
  research: '調査情報',
  tutorial: 'チュートリアル',
};

const difficultyLabels = {
  beginner: '初級',
  intermediate: '中級',
  advanced: '上級',
};

export default function RelatedArticleCard({ 
  relatednessScore, 
  priority = false,
  showScore = true 
}: RelatedArticleCardProps) {
  const { article, score } = relatednessScore;
  const optimizedImageUrl = article.featured_image?.url
    ? microCMSUtils.optimizeImageUrl(article.featured_image.url, 400, 240)
    : null;

  const relatednessInfo = getRelatednessLevel(score);

  return (
    <article className="group bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
      <div className="flex-1 flex flex-col">
        {/* Featured Image */}
        <Link href={`/articles/${article.slug}`} className="block">
          <div className="aspect-video relative overflow-hidden bg-gray-100">
            <ImageWithFallback
              src={optimizedImageUrl || ''}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              priority={priority}
              categorySlug={article.category?.slug}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Content Type Badge */}
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                {contentTypeLabels[article.contentType]}
              </span>
            </div>

            {/* Relatedness Score Badge */}
            {showScore && (
              <div className="absolute top-3 right-3">
                <div className={`px-2 py-1 text-xs font-medium rounded-full border ${relatednessInfo.color}`}>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{relatednessInfo.label}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Difficulty Badge */}
            <div className="absolute bottom-3 right-3">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${difficultyColors[article.difficultyLevel]}`}>
                {difficultyLabels[article.difficultyLevel]}
              </span>
            </div>
          </div>
        </Link>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Category */}
          <div className="flex items-center justify-between mb-3">
            {article.category && (
              <Link 
                href={`/categories/${article.category.slug}`}
                className="flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <Tag className="w-4 h-4 mr-1" />
                <span className="font-medium">{article.category.name}</span>
              </Link>
            )}
            {showScore && (
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                関連度: {score.toFixed(1)}%
              </div>
            )}
          </div>

          {/* Title */}
          <Link href={`/articles/${article.slug}`} className="block flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
              {article.title}
            </h3>

            {/* Excerpt */}
            <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed text-sm flex-1">
              {stringUtils.truncate(article.excerpt, 100)}
            </p>
          </Link>

          {/* Tags */}
          {article.tags && (
            <div className="flex flex-wrap gap-1 mb-4">
              {(() => {
                const tagArray: string[] = Array.isArray(article.tags) 
                  ? article.tags 
                  : typeof article.tags === 'string' 
                    ? article.tags.split(',').map(tag => tag.trim()) 
                    : [];
                
                return tagArray.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                  >
                    #{tag}
                  </span>
                ));
              })()}
              {(() => {
                const tagArray: string[] = Array.isArray(article.tags) 
                  ? article.tags 
                  : typeof article.tags === 'string' 
                    ? article.tags.split(',').map(tag => tag.trim()) 
                    : [];
                return tagArray.length > 2 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                    +{tagArray.length - 2}
                  </span>
                );
              })()}
            </div>
          )}

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100 mt-auto">
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                <time dateTime={article.publishedAt}>
                  {dateUtils.formatDate(article.publishedAt)}
                </time>
              </div>
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span>{article.reading_time || 5}分</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}