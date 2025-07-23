import { MetadataRoute } from 'next';
import { getAllArticles, getCategories } from '@/lib/microcms';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllArticles({ limit: 100 });
  const categories = await getCategories();

  const articleUrls = articles.map(article => ({
    url: `https://ai-engineering-hub.com/articles/${article.slug}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const categoryUrls = categories.contents.map(category => ({
    url: `https://ai-engineering-hub.com/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  return [
    {
      url: 'https://ai-engineering-hub.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://ai-engineering-hub.com/articles',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...articleUrls,
    ...categoryUrls,
  ];
}