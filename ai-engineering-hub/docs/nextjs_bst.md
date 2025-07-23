# Next.js ブログシステム開発ベストプラクティス

## 全体アーキテクチャ設計

### App Router + TypeScript 構成
```
app/
├── layout.tsx                 # ルートレイアウト
├── page.tsx                   # トップページ（記事一覧）
├── articles/
│   ├── page.tsx              # 記事一覧（ページネーション）
│   └── [slug]/
│       └── page.tsx          # 記事詳細（ISR対応）
├── categories/
│   └── [category]/
│       └── page.tsx          # カテゴリ別記事一覧
├── tags/
│   └── [tag]/
│       └── page.tsx          # タグ別記事一覧
├── search/
│   └── page.tsx              # 検索結果ページ
├── api/
│   ├── articles/route.ts     # 記事API
│   ├── search/route.ts       # 検索API
│   └── revalidate/route.ts   # ISR再生成API
├── components/
├── lib/
└── types/
```

## レンダリング戦略

### 1. 静的生成（SSG）+ ISR
**適用ページ**: 記事詳細、カテゴリページ、トップページ

```typescript
// app/articles/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getArticle, getAllArticles } from '@/lib/microcms';
import { Metadata } from 'next';

// 静的パス生成
export async function generateStaticParams() {
  const articles = await getAllArticles({ limit: 1000 });
  
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

// 動的メタデータ
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const article = await getArticle(params.slug);
  
  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${article.title} | AI Engineering Hub`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: ['AI Engineering Hub'],
      images: article.featuredImage ? [article.featuredImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: article.featuredImage ? [article.featuredImage] : [],
    },
  };
}

// ISR設定（10分間キャッシュ）
export const revalidate = 600;

export default async function ArticlePage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const article = await getArticle(params.slug);
  
  if (!article) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <time dateTime={article.publishedAt}>
            {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
          </time>
          <span>{article.readingTime}分で読める</span>
          <span className="bg-blue-100 px-2 py-1 rounded">
            {article.category.name}
          </span>
        </div>
      </header>
      
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
      
      {/* 関連記事（Suspense使用） */}
      <Suspense fallback={<div>関連記事を読み込み中...</div>}>
        <RelatedArticles categoryId={article.category.id} currentSlug={article.slug} />
      </Suspense>
    </article>
  );
}
```

### 2. サーバーサイドレンダリング（SSR）
**適用ページ**: 検索結果、動的フィルタリング

```typescript
// app/search/page.tsx
import { searchArticles } from '@/lib/microcms';
import { SearchResults } from '@/components/search/SearchResults';

interface SearchPageProps {
  searchParams: { q?: string; category?: string; page?: string };
}

// 動的レンダリング（毎回サーバーで実行）
export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  const category = searchParams.category || '';
  const page = parseInt(searchParams.page || '1');
  
  const results = await searchArticles({
    query,
    category,
    page,
    limit: 12
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {query ? `「${query}」の検索結果` : 'すべての記事'}
      </h1>
      
      <SearchResults 
        articles={results.articles}
        totalCount={results.totalCount}
        currentPage={page}
        query={query}
        category={category}
      />
    </div>
  );
}
```

### 3. クライアントサイドレンダリング（CSR）
**適用コンポーネント**: 検索窓、いいねボタン、コメント機能

```typescript
// components/search/SearchBar.tsx
'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const debouncedSearch = useDebouncedCallback((searchQuery: string) => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  }, 300);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  return (
    <div className="relative">
      <input
        type="search"
        placeholder="記事を検索..."
        value={query}
        onChange={handleInputChange}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
```

## データフェッチング最適化

### MicroCMS クライアント設定

```typescript
// lib/microcms.ts
import { createClient } from 'microcms-js-sdk';
import { cache } from 'react';

const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
});

// React Cache APIを使用してサーバーサイドでキャッシュ
export const getArticles = cache(async (queries?: any) => {
  return await client.get({
    endpoint: 'articles',
    queries: {
      orders: '-publishedAt',
      limit: 12,
      ...queries,
    },
  });
});

export const getArticle = cache(async (slug: string) => {
  try {
    return await client.get({
      endpoint: 'articles',
      queries: {
        filters: `slug[equals]${slug}`,
        limit: 1,
      },
    }).then(res => res.contents[0] || null);
  } catch {
    return null;
  }
});

export const getCategories = cache(async () => {
  return await client.get({
    endpoint: 'categories',
    queries: { limit: 100 },
  });
});

// 検索機能（サーバーサイドのみ）
export const searchArticles = async ({
  query,
  category,
  page = 1,
  limit = 12
}: {
  query?: string;
  category?: string; 
  page?: number;
  limit?: number;
}) => {
  const offset = (page - 1) * limit;
  const filters = [];
  
  if (category) {
    filters.push(`category[equals]${category}`);
  }

  const queries: any = {
    orders: '-publishedAt',
    limit,
    offset,
  };

  if (filters.length > 0) {
    queries.filters = filters.join('[and]');
  }

  if (query) {
    queries.q = query;
  }

  return await client.get({
    endpoint: 'articles',
    queries,
  });
};
```

### エラーハンドリングとフォールバック

```typescript
// lib/error-handling.ts
import { notFound } from 'next/navigation';

export async function getArticleWithErrorHandling(slug: string) {
  try {
    const article = await getArticle(slug);
    if (!article) {
      notFound();
    }
    return article;
  } catch (error) {
    console.error(`Error fetching article ${slug}:`, error);
    notFound();
  }
}

// components/ErrorBoundary.tsx
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('記事取得エラー:', error);
  }, [error]);

  return (
    <div className="text-center py-16">
      <h2 className="text-2xl font-bold mb-4">エラーが発生しました</h2>
      <p className="text-gray-600 mb-6">記事の読み込みに失敗しました。</p>
      <button
        onClick={reset}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        再試行
      </button>
    </div>
  );
}
```

## パフォーマンス最適化

### 1. 画像最適化

```typescript
// components/OptimizedImage.tsx
import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}

export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  priority = false 
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div 
        className="bg-gray-200 flex items-center justify-center"
        style={{ width, height }}
      >
        <span className="text-gray-500">画像を読み込めません</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className="rounded-lg object-cover"
      onError={() => setImageError(true)}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyOiKMA9yfGKzLCW4RMthLcdRlmKRzLFJJAzRu0cqlGUgqcgGt8xdQQOASD5DF4VqxGLOLRbxUa3tIVIaGqEkk/9k="
    />
  );
}
```

### 2. コード分割とLazy Loading

```typescript
// 動的インポートでコード分割
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const CommentSection = dynamic(
  () => import('@/components/CommentSection'),
  {
    loading: () => <div>コメントを読み込み中...</div>,
    ssr: false // コメント機能はクライアントサイドのみ
  }
);

const RelatedArticles = dynamic(
  () => import('@/components/RelatedArticles'),
  {
    loading: () => <div>関連記事を読み込み中...</div>,
  }
);

// Suspenseを使った段階的読み込み
export default function ArticlePage() {
  return (
    <div>
      <article>{/* メインコンテンツ */}</article>
      
      <Suspense fallback={<div>関連記事を読み込み中...</div>}>
        <RelatedArticles />
      </Suspense>
      
      <Suspense fallback={<div>コメントを読み込み中...</div>}>
        <CommentSection />
      </Suspense>
    </div>
  );
}
```

### 3. ISR（Incremental Static Regeneration）

```typescript
// Webhook設定でMicroCMSからの更新通知
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const secret = request.nextUrl.searchParams.get('secret');

  // セキュリティチェック
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  try {
    // 記事が更新された場合
    if (body.type === 'edit' && body.api === 'articles') {
      const slug = body.contents?.new?.publishValue?.slug;
      if (slug) {
        revalidatePath(`/articles/${slug}`);
        revalidatePath('/'); // トップページも更新
        revalidatePath('/articles'); // 記事一覧も更新
      }
    }

    // カテゴリが更新された場合
    if (body.type === 'edit' && body.api === 'categories') {
      revalidateTag('categories');
      revalidatePath('/');
    }

    return NextResponse.json({ revalidated: true });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}
```

## SEO・構造化データ最適化

### 1. 動的メタデータ生成

```typescript
// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | AI Engineering Hub',
    default: 'AI Engineering Hub - 実践的AI技術情報',
  },
  description: 'エンジニアと企業向けの実践的なAI技術情報を発信するブログです。',
  keywords: ['AI', '人工知能', 'Claude', 'GPT', 'プロンプトエンジニアリング'],
  authors: [{ name: 'AI Engineering Hub' }],
  creator: 'AI Engineering Hub',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://ai-engineering-hub.com',
    siteName: 'AI Engineering Hub',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@ai_engineering_hub',
  },
  verification: {
    google: 'google-site-verification-code',
  },
};
```

### 2. 構造化データ（JSON-LD）

```typescript
// components/StructuredData.tsx
interface ArticleStructuredDataProps {
  article: Article;
}

export function ArticleStructuredData({ article }: ArticleStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.featuredImage,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Organization',
      name: 'AI Engineering Hub',
    },
    publisher: {
      '@type': 'Organization',
      name: 'AI Engineering Hub',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ai-engineering-hub.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://ai-engineering-hub.com/articles/${article.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
```

### 3. サイトマップ生成

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';
import { getAllArticles, getCategories } from '@/lib/microcms';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllArticles({ limit: 1000 });
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
```

## 型安全性の確保

```typescript
// types/microcms.ts
export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: Category;
  tags: string;
  featuredImage?: string;
  contentType: string[];
  targetAudience: string[];
  difficultyLevel: string[];
  readingTime: number;
  publishedAt: string;
  updatedAt: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface ArticleListResponse {
  contents: Article[];
  totalCount: number;
  offset: number;
  limit: number;
}
```

## Claude Code への指示テンプレート

このベストプラクティスを使って、Claude Codeに以下のように指示してください：

```
現在のブログシステムを、Next.js ベストプラクティスに従って最適化してください。

添付のベストプラクティスドキュメントに従って：

1. SSG + ISR の適切な実装
2. 動的メタデータとSEO最適化
3. エラーハンドリングの改善
4. パフォーマンス最適化（画像、コード分割）
5. 型安全性の向上

特に以下を重視：
- 記事詳細ページのISR設定（10分キャッシュ）
- MicroCMSからのWebhook対応
- 構造化データの実装
- サイトマップの自動生成

段階的に実装し、各ステップで動作確認をしてください。
```

このベストプラクティスに沿って開発すれば、高品質なブログシステムが完成するはずです！