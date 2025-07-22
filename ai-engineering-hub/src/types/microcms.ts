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
  tags: string[] | string;
  featured_image?: {
    url: string;
    width: number;
    height: number;
  };
  content_type: 'experience' | 'research' | 'tutorial';
  target_audience: 'engineer' | 'enterprise' | 'both';
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  reading_time: number;
  status: 'published' | 'draft';
}

export interface Category {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  name?: string;
  slug?: string;
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
  depth?: number;
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
}