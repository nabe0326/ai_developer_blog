import { Suspense } from 'react';
import { Article } from '@/types/microcms';
import { getEnhancedRelatedArticles } from '@/lib/microcms';
import EnhancedRelatedArticles from './EnhancedRelatedArticles';
import PopularArticles from './PopularArticles';
import ShareButtons from './ShareButtons';

interface ArticleFooterSectionProps {
  article: Article;
  siteUrl: string;
}

function LoadingRelatedArticles() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-200/50 shadow-lg">
        <div className="text-center mb-10">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border">
              <div className="animate-pulse">
                <div className="aspect-video bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LoadingPopularArticles() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 border border-blue-100 shadow-lg">
        <div className="text-center mb-10">
          <div className="animate-pulse">
            <div className="h-8 bg-blue-200 rounded w-56 mx-auto mb-2"></div>
            <div className="h-4 bg-blue-200 rounded w-32 mx-auto"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border">
              <div className="animate-pulse">
                <div className="aspect-video bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

async function RelatedArticlesSection({ article }: { article: Article }) {
  try {
    const candidateArticles = await getEnhancedRelatedArticles(article, 12);
    
    if (candidateArticles.length === 0) {
      return null;
    }

    return (
      <EnhancedRelatedArticles
        targetArticle={article}
        candidateArticles={candidateArticles}
        limit={6}
      />
    );
  } catch (error) {
    console.error('Error loading related articles:', error);
    return null;
  }
}

export default function ArticleFooterSection({ article, siteUrl }: ArticleFooterSectionProps) {
  const articleUrl = `${siteUrl}/articles/${article.slug}`;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white">
      {/* Share Buttons Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">記事をシェア</h3>
          <ShareButtons
            url={articleUrl}
            title={article.title}
            description={article.excerpt}
          />
        </div>
      </section>

      {/* Related Articles */}
      <Suspense fallback={<LoadingRelatedArticles />}>
        <RelatedArticlesSection article={article} />
      </Suspense>

      {/* Popular Articles */}
      <Suspense fallback={<LoadingPopularArticles />}>
        <PopularArticles limit={6} />
      </Suspense>

    </div>
  );
}