import { 
  Article, 
  Category, 
  ArticleResponse, 
  CategoryResponse,
  MicroCMSQueries 
} from '@/types/microcms';
import { createClient } from 'microcms-js-sdk';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { 
  mockArticles, 
  mockCategories, 
  mockArticleResponse, 
  mockCategoryResponse 
} from './mock-data';

// 環境変数の確認とクライアント作成
const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;

if (!serviceDomain || !apiKey) {
  console.warn('MicroCMS環境変数が設定されていません。開発時はモックデータを使用します。');
}

const client = serviceDomain && apiKey ? createClient({
  serviceDomain,
  apiKey,
}) : null;

// React Cache APIを使用してサーバーサイドでキャッシュ
export const getArticles = cache(async (queries?: MicroCMSQueries): Promise<ArticleResponse> => {
  // 環境変数が設定されていない場合はモックデータを返す
  if (!client) {
    await new Promise(resolve => setTimeout(resolve, 100)); // API呼び出しを模擬
    return mockArticleResponse;
  }

  try {
    // featured_imageフィールドを明示的に指定
    const defaultFields = 'id,title,slug,content,excerpt,category,tags,featured_image,content_type,target_audience,difficulty_level,reading_time,publishedAt,updatedAt,createdAt,revisedAt';
    
    return await client.get({
      endpoint: 'articles',
      queries: {
        orders: '-publishedAt',
        limit: 12,
        fields: queries?.fields || defaultFields,
        ...queries,
      },
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
});

export const getArticle = cache(async (slug: string): Promise<Article | null> => {
  // 環境変数が設定されていない場合はモックデータを返す
  if (!client) {
    await new Promise(resolve => setTimeout(resolve, 100)); // API呼び出しを模擬
    return mockArticles.find(article => article.slug === slug) || null;
  }

  try {
    const response = await client.get<ArticleResponse>({
      endpoint: 'articles',
      queries: {
        filters: `slug[equals]${slug}`,
        limit: 1,
      },
    });
    return response.contents[0] || null;
  } catch (error) {
    console.error(`Error fetching article ${slug}:`, error);
    return null;
  }
});

export const getCategories = cache(async (): Promise<CategoryResponse> => {
  // 環境変数が設定されていない場合はモックデータを返す
  if (!client) {
    await new Promise(resolve => setTimeout(resolve, 100)); // API呼び出しを模擬
    return mockCategoryResponse;
  }

  try {
    const result = await client.get({
      endpoint: 'categories',
      queries: { limit: 100 },
    });
    return result;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
});

export const getCategory = cache(async (slug: string): Promise<Category | null> => {
  // 環境変数が設定されていない場合はモックデータを返す
  if (!client) {
    await new Promise(resolve => setTimeout(resolve, 100)); // API呼び出しを模擬
    return mockCategories.find(category => category.slug === slug) || null;
  }

  try {
    const response = await client.get<CategoryResponse>({
      endpoint: 'categories',
      queries: {
        filters: `slug[equals]${slug}`,
        limit: 1,
      },
    });
    return response.contents[0] || null;
  } catch (error) {
    console.error(`Error fetching category ${slug}:`, error);
    return null;
  }
});

// 検索機能（サーバーサイドのみ）
export const searchArticles = async ({
  query,
  category,
  tags,
  contentType,
  targetAudience,
  difficultyLevel,
  page = 1,
  limit = 12
}: {
  query?: string;
  category?: string;
  tags?: string[];
  contentType?: string;
  targetAudience?: string;
  difficultyLevel?: string;
  page?: number;
  limit?: number;
}): Promise<ArticleResponse> => {
  // 環境変数が設定されていない場合はモックデータを返す
  if (!client) {
    await new Promise(resolve => setTimeout(resolve, 100)); // API呼び出しを模擬
    let filteredArticles = mockArticles;
    
    // 検索クエリでフィルター
    if (query) {
      filteredArticles = filteredArticles.filter(article => 
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.content.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // カテゴリでフィルター
    if (category) {
      filteredArticles = filteredArticles.filter(article => 
        article.category.slug === category
      );
    }
    
    // タグでフィルター
    if (tags && tags.length > 0) {
      filteredArticles = filteredArticles.filter(article => {
        const articleTags = article.tags.toLowerCase().split(',').map(tag => tag.trim());
        return tags.some(tag => 
          articleTags.some(articleTag => articleTag.includes(tag.toLowerCase()))
        );
      });
    }
    
    // コンテンツタイプでフィルター
    if (contentType) {
      filteredArticles = filteredArticles.filter(article => 
        article.contentType === contentType
      );
    }
    
    // ターゲット読者でフィルター
    if (targetAudience) {
      filteredArticles = filteredArticles.filter(article => 
        article.targetAudience === targetAudience
      );
    }
    
    // 難易度でフィルター
    if (difficultyLevel) {
      filteredArticles = filteredArticles.filter(article => 
        article.difficultyLevel === difficultyLevel
      );
    }
    
    const offset = (page - 1) * limit;
    const paginatedArticles = filteredArticles.slice(offset, offset + limit);
    
    return {
      contents: paginatedArticles,
      totalCount: filteredArticles.length,
      offset,
      limit,
    };
  }

  const offset = (page - 1) * limit;
  const filters = [];
  
  if (category) {
    // MicroCMSでカテゴリをIDでフィルタリング（スラッグではなくIDを使用）
    // まずカテゴリ一覧を取得してスラッグからIDを見つける
    const categoriesResponse = await getCategories();
    const categoryObj = categoriesResponse.contents.find(c => c.slug === category);
    if (categoryObj) {
      filters.push(`category[equals]${categoryObj.id}`);
    }
  }
  
  if (contentType) {
    filters.push(`contentType[equals]${contentType}`);
  }
  
  if (targetAudience) {
    filters.push(`targetAudience[equals]${targetAudience}`);
  }
  
  if (difficultyLevel) {
    filters.push(`difficultyLevel[equals]${difficultyLevel}`);
  }
  
  if (tags && tags.length > 0) {
    // タグは複数あるので OR 条件で結合
    const tagFilters = tags.map(tag => `tags[contains]${tag}`);
    if (tagFilters.length === 1) {
      filters.push(tagFilters[0]);
    } else {
      filters.push(`(${tagFilters.join('[or]')})`);
    }
  }

  const searchQueries: MicroCMSQueries = {
    orders: '-publishedAt',
    limit,
    offset,
  };

  if (filters.length > 0) {
    searchQueries.filters = filters.join('[and]');
  }

  if (query) {
    searchQueries.q = query;
  }

  try {
    return await client.get({
      endpoint: 'articles',
      queries: searchQueries,
    });
  } catch (error) {
    console.error('Error searching articles:', error);
    throw error;
  }
};

// 全記事取得（サイトマップ用）
export const getAllArticles = cache(async ({ limit = 100 } = {}): Promise<Article[]> => {
  // 環境変数が設定されていない場合はモックデータを返す
  if (!client) {
    await new Promise(resolve => setTimeout(resolve, 100)); // API呼び出しを模擬
    return mockArticles.slice(0, limit);
  }

  try {
    // MicroCMSのlimit上限は100なので、複数回取得が必要な場合はページネーション処理
    const allArticles: Article[] = [];
    let offset = 0;
    const maxLimit = Math.min(limit, 100);
    
    while (allArticles.length < limit) {
      const response = await client.get<ArticleResponse>({
        endpoint: 'articles',
        queries: {
          orders: '-publishedAt',
          limit: maxLimit,
          offset,
          fields: 'id,title,slug,publishedAt,updatedAt',
        },
      });
      
      if (response.contents.length === 0) break;
      
      allArticles.push(...response.contents);
      
      // 取得したい件数に達した、または返された件数がlimitより少ない場合は終了
      if (allArticles.length >= limit || response.contents.length < maxLimit) {
        break;
      }
      
      offset += maxLimit;
    }
    
    return allArticles.slice(0, limit);
  } catch (error) {
    console.error('Error fetching all articles:', error);
    throw error;
  }
});

// エラーハンドリング付きの記事取得
export async function getArticleWithErrorHandling(slug: string): Promise<Article> {
  const article = await getArticle(slug);
  if (!article) {
    notFound();
  }
  return article;
}

// タグ検索
export const getArticlesByTag = cache(async (tag: string, queries?: MicroCMSQueries): Promise<ArticleResponse> => {
  // 環境変数が設定されていない場合はモックデータを返す
  if (!client) {
    await new Promise(resolve => setTimeout(resolve, 100)); // API呼び出しを模擬
    const filteredArticles = mockArticles.filter(article => 
      article.tags.toLowerCase().includes(tag.toLowerCase())
    );
    
    const limit = queries?.limit || 12;
    const offset = queries?.offset || 0;
    const paginatedArticles = filteredArticles.slice(offset, offset + limit);
    
    return {
      contents: paginatedArticles,
      totalCount: filteredArticles.length,
      offset,
      limit,
    };
  }

  try {
    return await client.get({
      endpoint: 'articles',
      queries: {
        ...queries,
        filters: `tags[contains]${tag}`,
        orders: '-publishedAt',
      },
    });
  } catch (error) {
    console.error(`Error fetching articles by tag ${tag}:`, error);
    throw error;
  }
});

// カテゴリ別記事取得
export const getArticlesByCategory = cache(async (categoryId: string, queries?: MicroCMSQueries): Promise<ArticleResponse> => {
  // 環境変数が設定されていない場合はモックデータを返す
  if (!client) {
    await new Promise(resolve => setTimeout(resolve, 100)); // API呼び出しを模擬
    const filteredArticles = mockArticles.filter(article => 
      article.category.id === categoryId
    );
    
    const limit = queries?.limit || 12;
    const offset = queries?.offset || 0;
    const paginatedArticles = filteredArticles.slice(offset, offset + limit);
    
    return {
      contents: paginatedArticles,
      totalCount: filteredArticles.length,
      offset,
      limit,
    };
  }

  try {
    return await client.get({
      endpoint: 'articles',
      queries: {
        ...queries,
        filters: `category[equals]${categoryId}`,
        orders: '-publishedAt',
      },
    });
  } catch (error) {
    console.error(`Error fetching articles by category ${categoryId}:`, error);
    throw error;
  }
});

// 関連記事取得
export const getRelatedArticles = cache(async (categoryId: string, currentSlug: string, limit = 3): Promise<Article[]> => {
  // 環境変数が設定されていない場合はモックデータを返す
  if (!client) {
    await new Promise(resolve => setTimeout(resolve, 100)); // API呼び出しを模擬
    const relatedArticles = mockArticles.filter(article => 
      article.category.id === categoryId && article.slug !== currentSlug
    );
    
    return relatedArticles.slice(0, limit);
  }

  try {
    const response = await client.get<ArticleResponse>({
      endpoint: 'articles',
      queries: {
        filters: `category[equals]${categoryId}[and]slug[not_equals]${currentSlug}`,
        orders: '-publishedAt',
        limit,
        fields: 'id,title,slug,excerpt,featured_image,publishedAt,category',
      },
    });
    return response.contents;
  } catch (error) {
    console.error(`Error fetching related articles for ${currentSlug}:`, error);
    return [];
  }
});

// ユーティリティ関数
export const microCMSUtils = {
  // 画像URL最適化
  optimizeImageUrl: (url: string, width?: number, height?: number, quality = 80): string => {
    if (!url) return '';
    
    const params = new URLSearchParams();
    if (width) params.set('w', String(width));
    if (height) params.set('h', String(height));
    params.set('q', String(quality));
    params.set('fm', 'webp');
    
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  },

  // 日付フォーマット
  formatDate: (dateString: string): string => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  },

  // 読了時間計算（日本語対応）
  calculateReadingTime: (content: string): number => {
    const japaneseCharsPerMinute = 400; // 日本語読書速度（文字/分）
    const contentLength = content.replace(/\s+/g, '').length;
    return Math.ceil(contentLength / japaneseCharsPerMinute);
  },
};