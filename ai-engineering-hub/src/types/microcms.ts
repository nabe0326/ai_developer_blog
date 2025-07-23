export interface Article {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: Category;
  tags: string;
  featured_image?: {
    url: string;
    width: number;
    height: number;
  };
  contentType: 'experience' | 'research' | 'tutorial';
  targetAudience: 'engineer' | 'enterprise' | 'both';
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  reading_time: number;
  status: 'published' | 'draft';
}

export interface Category {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  name: string;
  slug: string;
  description?: string;
}

export interface ArticleResponse {
  contents: Article[];
  totalCount: number;
  offset: number;
  limit: number;
}

export interface CategoryResponse {
  contents: Category[];
  totalCount: number;
  offset: number;
  limit: number;
}

export interface MicroCMSQueries {
  draftKey?: string;
  limit?: number;
  offset?: number;
  orders?: string;
  q?: string;
  fields?: string;
  ids?: string;
  filters?: string;
  depth?: 1 | 2 | 3;
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
}