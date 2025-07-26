import { Article } from '@/types/microcms';

interface ArticleStructuredDataProps {
  article: Article;
}

export function ArticleStructuredData({ article }: ArticleStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.featured_image?.url,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Organization',
      name: '実践AI技術ブログ',
      url: 'https://ai-developer-blog.vercel.app',
    },
    publisher: {
      '@type': 'Organization',
      name: '実践AI技術ブログ',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ai-developer-blog.vercel.app/ogp-image.png',
        width: 1200,
        height: 630,
      },
      url: 'https://ai-developer-blog.vercel.app',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://ai-developer-blog.vercel.app/articles/${article.slug}`,
    },
    wordCount: article.content?.length || 0,
    articleSection: article.category?.name,
    keywords: Array.isArray(article.tags) 
      ? article.tags.join(', ') 
      : typeof article.tags === 'string' 
        ? article.tags 
        : '',
    inLanguage: 'ja-JP',
    isAccessibleForFree: true,
    genre: ['Technology', 'AI', 'Engineering'],
    about: [
      {
        '@type': 'Thing',
        name: 'Artificial Intelligence',
      },
      {
        '@type': 'Thing', 
        name: 'Software Engineering',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}