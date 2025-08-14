import { NextResponse } from 'next/server';
import { getAllArticles } from '@/lib/microcms';

export async function GET() {
  try {
    const articles = await getAllArticles({ limit: 100 });
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-developer-blog.vercel.app';

    const articleSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${articles.map(article => `  <url>
    <loc>${baseUrl}/articles/${article.slug}</loc>
    <lastmod>${new Date(article.updatedAt || article.publishedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

    return new NextResponse(articleSitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('Article sitemap generation error:', error);
    
    // エラー時は空のsitemapを返す
    const emptySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;

    return new NextResponse(emptySitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=300',
      },
    });
  }
}

export const revalidate = 86400; // 24時間