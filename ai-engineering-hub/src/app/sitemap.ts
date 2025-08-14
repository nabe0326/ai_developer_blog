import { MetadataRoute } from 'next';
import { getAllArticles, getCategories } from '@/lib/microcms';

// Google Search Console登録の安定性を向上
export const revalidate = 86400; // 24時間ごとに再生成（より安定したキャッシュ）

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const articles = await getAllArticles({ limit: 100 });
    const categories = await getCategories();
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-developer-blog.vercel.app';

    console.log(`Sitemap generation: ${articles.length} articles, ${categories.contents.length} categories`);

    const articleUrls = articles.map(article => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: new Date(article.updatedAt || article.publishedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    const categoryUrls = categories.contents.map(category => ({
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/articles`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      ...articleUrls,
      ...categoryUrls,
    ];
  } catch (error) {
    console.error('Sitemap generation error:', error);
    
    // エラー時はベース構造のみ返す
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-developer-blog.vercel.app';
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/articles`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
    ];
  }
}