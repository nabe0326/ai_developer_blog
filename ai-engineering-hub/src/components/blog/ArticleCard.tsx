'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, Tag } from 'lucide-react'
import { Article } from '@/types/microcms'
import { microCMSUtils } from '@/lib/microcms'
import { stringUtils, dateUtils } from '@/lib/utils'

interface ArticleCardProps {
  article: Article
  priority?: boolean
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800', 
  advanced: 'bg-red-100 text-red-800',
}

const contentTypeLabels = {
  experience: '実体験',
  research: '調査情報',
  tutorial: 'チュートリアル',
}

const targetAudienceLabels = {
  engineer: 'エンジニア向け',
  enterprise: '企業向け',
  both: 'エンジニア・企業向け',
}

export default function ArticleCard({ article, priority = false }: ArticleCardProps) {
  const optimizedImageUrl = article.featuredImage?.url
    ? microCMSUtils.optimizeImageUrl(article.featuredImage.url, 400, 240)
    : null

  return (
    <article className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-accent-500/20 transition-all duration-300 transform hover:-translate-y-1">
      <div className="block">
        {/* Featured Image */}
        <Link href={`/articles/${article.slug}`} className="block">
          <div className="aspect-video relative overflow-hidden bg-gray-100">
            {optimizedImageUrl ? (
              <Image
                src={optimizedImageUrl}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                priority={priority}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                <div className="text-primary-600 text-lg font-medium">
                  AI Engineering Hub
                </div>
              </div>
            )}
            
            {/* Content Type Badge */}
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 bg-accent-500 text-white text-xs font-medium rounded-full">
                {contentTypeLabels[article.contentType]}
              </span>
            </div>

            {/* Difficulty Badge */}
            <div className="absolute top-3 right-3">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${difficultyColors[article.difficultyLevel]}`}>
                {article.difficultyLevel === 'beginner' && '初級'}
                {article.difficultyLevel === 'intermediate' && '中級'}
                {article.difficultyLevel === 'advanced' && '上級'}
              </span>
            </div>
          </div>
        </Link>

        {/* Content */}
        <div className="p-6">
          {/* Category & Target Audience */}
          <div className="flex items-center justify-between mb-3">
            {article.category && (
              <Link 
                href={`/categories/${article.category.slug}`}
                className="flex items-center text-sm text-accent-600 hover:text-accent-700 transition-colors duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <Tag className="w-4 h-4 mr-1" />
                <span className="font-medium">{article.category.name}</span>
              </Link>
            )}
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {targetAudienceLabels[article.targetAudience]}
            </span>
          </div>

          {/* Title */}
          <Link href={`/articles/${article.slug}`} className="block">
            <h2 className="text-xl font-bold text-primary-900 mb-3 line-clamp-2 group-hover:text-accent-600 transition-colors duration-200">
              {article.title}
            </h2>

            {/* Excerpt */}
            <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
              {stringUtils.truncate(article.excerpt, 120)}
            </p>
          </Link>

          {/* Tags */}
          {article.tags && (
            <div className="flex flex-wrap gap-1 mb-4">
              {(() => {
                // タグを配列として処理
                const tagArray: string[] = Array.isArray(article.tags) 
                  ? article.tags 
                  : typeof article.tags === 'string' 
                    ? article.tags.split(',').map(tag => tag.trim()) 
                    : []
                
                return tagArray.slice(0, 3).map((tag, index) => (
                  <Link
                    key={index}
                    href={`/tags/${encodeURIComponent(tag)}`}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md hover:bg-accent-50 hover:text-accent-700 transition-colors duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    #{tag}
                  </Link>
                ))
              })()}
              {(() => {
                const tagArray: string[] = Array.isArray(article.tags) 
                  ? article.tags 
                  : typeof article.tags === 'string' 
                    ? article.tags.split(',').map(tag => tag.trim()) 
                    : []
                return tagArray.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                    +{tagArray.length - 3}
                  </span>
                )
              })()}
            </div>
          )}

          {/* Meta Info */}
          <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <time dateTime={article.publishedAt}>
                {dateUtils.formatDate(article.publishedAt)}
              </time>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{article.reading_time}分</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}