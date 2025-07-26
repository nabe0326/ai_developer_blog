import { Article } from '@/types/microcms';

export interface RelatednessScore {
  article: Article;
  score: number;
  breakdown: {
    categoryMatch: number;
    tagOverlap: number;
    dateProximity: number;
    difficultyMatch: number;
    audienceMatch: number;
  };
}

// タグの重複度を計算
function calculateTagOverlap(tags1: string, tags2: string): number {
  if (!tags1 || !tags2) return 0;
  
  const tagArray1 = Array.isArray(tags1) 
    ? tags1 
    : tags1.split(',').map(tag => tag.trim().toLowerCase());
  const tagArray2 = Array.isArray(tags2) 
    ? tags2 
    : tags2.split(',').map(tag => tag.trim().toLowerCase());
  
  const overlap = tagArray1.filter(tag => tagArray2.includes(tag)).length;
  const totalUnique = new Set([...tagArray1, ...tagArray2]).size;
  
  return totalUnique > 0 ? overlap / totalUnique : 0;
}

// 日付の近さを計算（0-1の範囲）
function calculateDateProximity(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d1.getTime() - d2.getTime());
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  
  // 30日以内は高スコア、それ以降は徐々に減少
  if (diffDays <= 30) return 1 - (diffDays / 30) * 0.5;
  if (diffDays <= 90) return 0.5 - ((diffDays - 30) / 60) * 0.3;
  if (diffDays <= 180) return 0.2 - ((diffDays - 90) / 90) * 0.2;
  return 0;
}

// 2つの記事の関連度スコアを計算
export function calculateRelatednessScore(
  targetArticle: Article, 
  candidateArticle: Article
): RelatednessScore {
  // カテゴリ一致（30点満点）
  const categoryMatch = targetArticle.category?.id === candidateArticle.category?.id ? 30 : 0;
  
  // タグ重複度（40点満点）
  const tagOverlap = calculateTagOverlap(targetArticle.tags, candidateArticle.tags) * 40;
  
  // 日付近さ（15点満点）
  const dateProximity = calculateDateProximity(
    targetArticle.publishedAt, 
    candidateArticle.publishedAt
  ) * 15;
  
  // 難易度一致（8点満点）
  const difficultyMatch = targetArticle.difficultyLevel === candidateArticle.difficultyLevel ? 8 : 0;
  
  // ターゲット読者一致（7点満点）
  const audienceMatch = targetArticle.targetAudience === candidateArticle.targetAudience ? 7 : 0;
  
  const totalScore = categoryMatch + tagOverlap + dateProximity + difficultyMatch + audienceMatch;
  
  return {
    article: candidateArticle,
    score: Math.round(totalScore * 100) / 100, // 小数点2位まで
    breakdown: {
      categoryMatch,
      tagOverlap: Math.round(tagOverlap * 100) / 100,
      dateProximity: Math.round(dateProximity * 100) / 100,
      difficultyMatch,
      audienceMatch,
    },
  };
}

// 複数の記事に対して関連度スコアを計算し、ソートして返す
export function calculateRelatedArticles(
  targetArticle: Article,
  candidateArticles: Article[],
  limit = 6
): RelatednessScore[] {
  return candidateArticles
    .filter(article => article.slug !== targetArticle.slug) // 自分自身を除外
    .map(article => calculateRelatednessScore(targetArticle, article))
    .sort((a, b) => b.score - a.score) // スコア降順でソート
    .slice(0, limit);
}

// 関連度スコアのレベルを取得
export function getRelatednessLevel(score: number): {
  level: 'high' | 'medium' | 'low';
  label: string;
  color: string;
} {
  if (score >= 70) {
    return { level: 'high', label: '高関連', color: 'text-green-600 bg-green-50' };
  } else if (score >= 40) {
    return { level: 'medium', label: '中関連', color: 'text-yellow-600 bg-yellow-50' };
  } else {
    return { level: 'low', label: '低関連', color: 'text-gray-600 bg-gray-50' };
  }
}

// 人気記事を取得（現時点では日付ベース）
export function getPopularArticles(articles: Article[], limit = 6): Article[] {
  return [...articles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}