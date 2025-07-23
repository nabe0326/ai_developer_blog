import { Article } from '@/types/microcms';

export interface SearchFilters {
  query?: string;
  category?: string;
  tags?: string[];
  contentType?: string;
  targetAudience?: string;
  difficultyLevel?: string;
}

export interface SearchOptions {
  filters: SearchFilters;
  page: number;
  limit: number;
  sortBy: 'publishedAt' | 'updatedAt' | 'title' | 'reading_time';
  sortOrder: 'asc' | 'desc';
}

export const DEFAULT_SEARCH_OPTIONS: SearchOptions = {
  filters: {},
  page: 1,
  limit: 12,
  sortBy: 'publishedAt',
  sortOrder: 'desc',
};

export function buildSearchParams(options: Partial<SearchOptions>): Record<string, string> {
  const params: Record<string, string> = {};
  
  if (options.filters?.query) {
    params.q = options.filters.query;
  }
  
  if (options.filters?.category) {
    params.category = options.filters.category;
  }
  
  if (options.filters?.tags?.length) {
    params.tags = options.filters.tags.join(',');
  }
  
  if (options.filters?.contentType) {
    params.contentType = options.filters.contentType;
  }
  
  if (options.filters?.targetAudience) {
    params.targetAudience = options.filters.targetAudience;
  }
  
  if (options.filters?.difficultyLevel) {
    params.difficultyLevel = options.filters.difficultyLevel;
  }
  
  if (options.page && options.page > 1) {
    params.page = options.page.toString();
  }
  
  if (options.sortBy && options.sortBy !== 'publishedAt') {
    params.sortBy = options.sortBy;
  }
  
  if (options.sortOrder && options.sortOrder !== 'desc') {
    params.sortOrder = options.sortOrder;
  }
  
  return params;
}

export function parseSearchParams(searchParams: URLSearchParams): SearchOptions {
  const filters: SearchFilters = {};
  
  const query = searchParams.get('q');
  if (query) filters.query = query;
  
  const category = searchParams.get('category');
  if (category) filters.category = category;
  
  const tags = searchParams.get('tags');
  if (tags) filters.tags = tags.split(',').filter(Boolean);
  
  const contentType = searchParams.get('contentType');
  if (contentType) filters.contentType = contentType;
  
  const targetAudience = searchParams.get('targetAudience');
  if (targetAudience) filters.targetAudience = targetAudience;
  
  const difficultyLevel = searchParams.get('difficultyLevel');
  if (difficultyLevel) filters.difficultyLevel = difficultyLevel;
  
  const page = parseInt(searchParams.get('page') || '1');
  const sortBy = (searchParams.get('sortBy') as SearchOptions['sortBy']) || 'publishedAt';
  const sortOrder = (searchParams.get('sortOrder') as SearchOptions['sortOrder']) || 'desc';
  
  return {
    filters,
    page,
    limit: 12,
    sortBy,
    sortOrder,
  };
}

export function getTagsFromArticles(articles: Article[]): string[] {
  const allTags = articles.flatMap(article => 
    article.tags.split(',').map(tag => tag.trim()).filter(Boolean)
  );
  
  return Array.from(new Set(allTags)).sort();
}

export function filterArticlesByClient(
  articles: Article[], 
  filters: SearchFilters
): Article[] {
  return articles.filter(article => {
    if (filters.query) {
      const searchText = `${article.title} ${article.content} ${article.excerpt}`.toLowerCase();
      if (!searchText.includes(filters.query.toLowerCase())) {
        return false;
      }
    }
    
    if (filters.category && article.category.slug !== filters.category) {
      return false;
    }
    
    if (filters.tags?.length) {
      const articleTags = article.tags.toLowerCase().split(',').map(tag => tag.trim());
      const hasMatchingTag = filters.tags.some(tag => 
        articleTags.some(articleTag => articleTag.includes(tag.toLowerCase()))
      );
      if (!hasMatchingTag) {
        return false;
      }
    }
    
    if (filters.contentType && article.contentType !== filters.contentType) {
      return false;
    }
    
    if (filters.targetAudience && article.targetAudience !== filters.targetAudience) {
      return false;
    }
    
    if (filters.difficultyLevel && article.difficultyLevel !== filters.difficultyLevel) {
      return false;
    }
    
    return true;
  });
}

export function sortArticles(
  articles: Article[], 
  sortBy: SearchOptions['sortBy'], 
  sortOrder: SearchOptions['sortOrder']
): Article[] {
  return [...articles].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'reading_time':
        comparison = a.reading_time - b.reading_time;
        break;
      case 'updatedAt':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      case 'publishedAt':
      default:
        comparison = new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
}

export const SEARCH_CONSTANTS = {
  CONTENT_TYPES: [
    { value: 'experience', label: '実体験' },
    { value: 'research', label: '調査情報' },
    { value: 'tutorial', label: 'チュートリアル' },
  ],
  TARGET_AUDIENCES: [
    { value: 'engineer', label: 'エンジニア' },
    { value: 'enterprise', label: '企業' },
    { value: 'both', label: '両方' },
  ],
  DIFFICULTY_LEVELS: [
    { value: 'beginner', label: '初級' },
    { value: 'intermediate', label: '中級' },
    { value: 'advanced', label: '上級' },
  ],
  SORT_OPTIONS: [
    { value: 'publishedAt', label: '公開日時' },
    { value: 'updatedAt', label: '更新日時' },
    { value: 'title', label: 'タイトル' },
    { value: 'reading_time', label: '読了時間' },
  ],
} as const;