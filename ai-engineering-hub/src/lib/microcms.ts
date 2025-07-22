import { 
  Article, 
  Category, 
  ArticleResponse, 
  CategoryResponse,
  MicroCMSQueries 
} from '@/types/microcms';

const API_KEY = process.env.NEXT_PUBLIC_MICROCMS_API_KEY;
const SERVICE_DOMAIN = process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN;

if (!API_KEY || !SERVICE_DOMAIN) {
  throw new Error('MICROCMS_API_KEY and MICROCMS_SERVICE_DOMAIN must be set');
}

const BASE_URL = `https://${SERVICE_DOMAIN}.microcms.io/api/v1`;

const getHeaders = (): Record<string, string> => {
  return {
    'X-MICROCMS-API-KEY': API_KEY,
    'Content-Type': 'application/json',
  }
}


async function fetcher<T>(
  endpoint: string,
  queries?: MicroCMSQueries
): Promise<T> {
  try {
    const url = new URL(`${BASE_URL}${endpoint}`);
    
    if (queries) {
      Object.entries(queries).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      });
    }

    const headers = getHeaders();

    console.log('MicroCMS API Request:', {
      url: url.toString(),
      headers: { ...headers, 'X-MICROCMS-API-KEY': '[HIDDEN]' },
      endpoint,
      queries
    });

    // クライアントサイドとサーバーサイドで異なるfetchオプション
    const fetchOptions: RequestInit = {
      headers,
    };
    
    // サーバーサイドの場合のみNext.js特有のオプションを追加
    if (typeof window === 'undefined') {
      fetchOptions.next = { revalidate: 60 };
      fetchOptions.cache = 'force-cache';
    }

    const response = await fetch(url.toString(), fetchOptions);

    console.log('MicroCMS API Response Status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('MicroCMS API Error Response:', errorText);
      throw new Error(`MicroCMS API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('MicroCMS API Response Data:', data);
    return data;
  } catch (error) {
    console.error(`MicroCMS fetch error for ${endpoint}:`, error);
    throw error;
  }
}

// 記事関連API
export const articlesApi = {
  // 記事一覧取得
  getList: async (queries?: MicroCMSQueries): Promise<ArticleResponse> => {
    return fetcher<ArticleResponse>('/articles', queries);
  },

  // 記事詳細取得
  getDetail: async (contentId: string, queries?: MicroCMSQueries): Promise<Article> => {
    return fetcher<Article>(`/articles/${contentId}`, queries);
  },

  // スラッグで記事取得
  getBySlug: async (slug: string, queries?: MicroCMSQueries): Promise<ArticleResponse> => {
    const response = await fetcher<ArticleResponse>('/articles', {
      ...queries,
      filters: `slug[equals]${slug}`,
      limit: 1,
    });
    return response;
  },

  // カテゴリ別記事取得
  getByCategory: async (categoryId: string, queries?: MicroCMSQueries): Promise<ArticleResponse> => {
    return fetcher<ArticleResponse>('/articles', {
      ...queries,
      filters: `category[equals]${categoryId}`,
    });
  },

  // タグで記事検索
  getByTag: async (tag: string, queries?: MicroCMSQueries): Promise<ArticleResponse> => {
    return fetcher<ArticleResponse>('/articles', {
      ...queries,
      filters: `tags[contains]${tag}`,
    });
  },

  // 全文検索
  search: async (keyword: string, queries?: MicroCMSQueries): Promise<ArticleResponse> => {
    return fetcher<ArticleResponse>('/articles', {
      ...queries,
      q: keyword,
    });
  },
};

// カテゴリ関連API
export const categoriesApi = {
  // カテゴリ一覧取得
  getList: async (queries?: MicroCMSQueries): Promise<CategoryResponse> => {
    return fetcher<CategoryResponse>('/categories', queries);
  },

  // カテゴリ詳細取得
  getDetail: async (contentId: string, queries?: MicroCMSQueries): Promise<Category> => {
    return fetcher<Category>(`/categories/${contentId}`, queries);
  },

  // スラッグでカテゴリ取得
  getBySlug: async (slug: string, queries?: MicroCMSQueries): Promise<CategoryResponse> => {
    const response = await fetcher<CategoryResponse>('/categories', {
      ...queries,
      filters: `slug[equals]${slug}`,
      limit: 1,
    });
    return response;
  },
};

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