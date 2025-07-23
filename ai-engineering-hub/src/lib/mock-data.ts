import { Article, Category, ArticleResponse, CategoryResponse } from '@/types/microcms';

// モックデータ
export const mockCategories: Category[] = [
  {
    id: '1',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    publishedAt: '2024-01-01T00:00:00.000Z',
    revisedAt: '2024-01-01T00:00:00.000Z',
    name: '実装事例',
    slug: 'implementation',
    description: 'Difyアプリ開発、APIインテグレーション、業務自動化'
  },
  {
    id: '2',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    publishedAt: '2024-01-01T00:00:00.000Z',
    revisedAt: '2024-01-01T00:00:00.000Z',
    name: '技術調査',
    slug: 'research',
    description: '新AI技術、ツール比較、パフォーマンス分析'
  },
  {
    id: '3',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    publishedAt: '2024-01-01T00:00:00.000Z',
    revisedAt: '2024-01-01T00:00:00.000Z',
    name: '業務効率化',
    slug: 'efficiency',
    description: '導入事例、ROI分析、運用ノウハウ'
  },
  {
    id: '4',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    publishedAt: '2024-01-01T00:00:00.000Z',
    revisedAt: '2024-01-01T00:00:00.000Z',
    name: '開発Tips',
    slug: 'tips',
    description: 'プロンプトエンジニアリング、デバッグ、ベストプラクティス'
  },
];

export const mockArticles: Article[] = [
  {
    id: '1',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    publishedAt: '2024-01-01T00:00:00.000Z',
    revisedAt: '2024-01-01T00:00:00.000Z',
    title: 'AI Engineering Hubへようこそ',
    slug: 'welcome-to-ai-engineering-hub',
    content: '# AI Engineering Hubへようこそ\n\nこちらはAI技術の実践的情報を発信するブログサイトです。\n\n## 特徴\n\n- **実践的な情報**: 実際のプロジェクトで使える技術情報\n- **エンジニア向け**: 技術的な詳細まで踏み込んだ解説\n- **企業向け**: ビジネス活用の観点からの情報提供\n\n## 今後の予定\n\n- Claude AIを使った自動化事例\n- プロンプトエンジニアリングのベストプラクティス\n- AI技術の業務活用事例\n\nぜひ定期的にチェックしてください！',
    excerpt: 'AI Engineering Hubの開設記事です。実践的なAI技術情報を発信するブログサイトとして、エンジニア・企業向けに有用な情報を提供していきます。',
    category: mockCategories[0],
    tags: 'AI,ブログ,技術情報',
    featured_image: {
      url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400',
      width: 800,
      height: 400
    },
    contentType: 'experience',
    targetAudience: 'both',
    difficultyLevel: 'beginner',
    reading_time: 3,
    status: 'published'
  },
  {
    id: '2',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
    publishedAt: '2024-01-02T00:00:00.000Z',
    revisedAt: '2024-01-02T00:00:00.000Z',
    title: 'Next.js 15とMicroCMSでブログサイト構築',
    slug: 'nextjs-15-microcms-blog',
    content: '# Next.js 15とMicroCMSでブログサイト構築\n\n最新のNext.js 15とMicroCMSを使ってブログサイトを構築する方法を解説します。\n\n## 技術スタック\n\n- **Next.js 15**: App Router、SSG、ISR対応\n- **MicroCMS**: ヘッドレスCMS\n- **Tailwind CSS**: スタイリング\n- **TypeScript**: 型安全性\n\n## 主な機能\n\n### SEO最適化\n\n- 動的メタデータ生成\n- 構造化データ対応\n- サイトマップ自動生成\n\n### パフォーマンス\n\n- SSG + ISRによる高速化\n- React Cache APIでサーバーサイドキャッシュ\n- 画像最適化\n\nこのように、モダンな技術スタックで高品質なブログサイトを構築できます。',
    excerpt: 'Next.js 15とMicroCMSを使用した高品質なブログサイトの構築方法を詳しく解説します。SEO最適化とパフォーマンス向上のテクニックも紹介。',
    category: mockCategories[1],
    tags: 'Next.js,MicroCMS,ブログ構築,SEO',
    featured_image: {
      url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400',
      width: 800,
      height: 400
    },
    contentType: 'tutorial',
    targetAudience: 'engineer',
    difficultyLevel: 'intermediate',
    reading_time: 8,
    status: 'published'
  },
  {
    id: '3',
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z',
    publishedAt: '2024-01-03T00:00:00.000Z',
    revisedAt: '2024-01-03T00:00:00.000Z',
    title: 'Dify 1.6.0のMCP連携機能を実装してみた',
    slug: 'dify-1-6-0-mcp-integration',
    content: '# Dify 1.6.0のMCP連携機能を実装してみた\n\nDify 1.6.0で新たに追加されたMCP（Model Context Protocol）連携機能を実際に実装してみました。\n\n## MCPとは\n\nMCPは、AIアプリケーションが外部システムと安全に連携するためのプロトコルです。\n\n## 実装手順\n\n1. MCP Serverの設定\n2. Difyとの連携設定\n3. テストと検証\n\n実際に使ってみると、かなり便利な機能でした。',
    excerpt: 'Dify 1.6.0の新機能であるMCP連携を実際に実装した経験をまとめています。実装手順と注意点を詳しく解説。',
    category: mockCategories[0], // implementation
    tags: 'Dify,MCP,実装,連携',
    featured_image: {
      url: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=400',
      width: 800,
      height: 400
    },
    contentType: 'experience',
    targetAudience: 'engineer',
    difficultyLevel: 'advanced',
    reading_time: 12,
    status: 'published'
  },
  {
    id: '4',
    createdAt: '2024-01-04T00:00:00.000Z',
    updatedAt: '2024-01-04T00:00:00.000Z',
    publishedAt: '2024-01-04T00:00:00.000Z',
    revisedAt: '2024-01-04T00:00:00.000Z',
    title: 'Claude CodeとCursor の開発環境比較',
    slug: 'claude-code-vs-cursor-comparison',
    content: '# Claude CodeとCursor の開発環境比較\n\nAI支援開発環境として注目を集めているClaude CodeとCursorを比較してみました。\n\n## 機能比較\n\n### Claude Code\n- ターミナル統合\n- プロジェクト理解力\n- 自然言語でのタスク実行\n\n### Cursor\n- IDE統合\n- リアルタイム補完\n- カスタムプロンプト\n\n## 結論\n\nそれぞれに特徴があり、用途によって使い分けが重要です。',
    excerpt: 'AI支援開発環境のClaude CodeとCursorを詳しく比較。機能面での違いと実際の使用感をレビューします。',
    category: mockCategories[1], // research
    tags: 'Claude Code,Cursor,AI開発,比較',
    featured_image: {
      url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400',
      width: 800,
      height: 400
    },
    contentType: 'research',
    targetAudience: 'engineer',
    difficultyLevel: 'intermediate',
    reading_time: 15,
    status: 'published'
  },
  {
    id: '5',
    createdAt: '2024-01-05T00:00:00.000Z',
    updatedAt: '2024-01-05T00:00:00.000Z',
    publishedAt: '2024-01-05T00:00:00.000Z',
    revisedAt: '2024-01-05T00:00:00.000Z',
    title: 'プロンプトエンジニアリングのベストプラクティス',
    slug: 'prompt-engineering-best-practices',
    content: '# プロンプトエンジニアリングのベストプラクティス\n\n効果的なプロンプト設計のための実践的なガイドラインをまとめました。\n\n## 基本原則\n\n1. 明確性\n2. 具体性\n3. 文脈の提供\n4. 例示の活用\n\n## 実践テクニック\n\n### Chain of Thought\n段階的な思考プロセスを促すテクニック\n\n### Few-shot Learning\n少数の例を提示することで精度向上\n\nこれらのテクニックを組み合わせることで、より良い結果が得られます。',
    excerpt: 'AIとの対話を最適化するプロンプトエンジニアリングの実践的なテクニックとベストプラクティスを紹介します。',
    category: mockCategories[3], // tips
    tags: 'プロンプト,エンジニアリング,AI,ベストプラクティス',
    featured_image: {
      url: 'https://images.unsplash.com/photo-1592609931095-54a2168ae893?w=800&h=400',
      width: 800,
      height: 400
    },
    contentType: 'tutorial',
    targetAudience: 'both',
    difficultyLevel: 'beginner',
    reading_time: 10,
    status: 'published'
  },
  {
    id: '6',
    createdAt: '2024-01-06T00:00:00.000Z',
    updatedAt: '2024-01-06T00:00:00.000Z',
    publishedAt: '2024-01-06T00:00:00.000Z',
    revisedAt: '2024-01-06T00:00:00.000Z',
    title: 'AI導入による業務効率化のROI分析',
    slug: 'ai-efficiency-roi-analysis',
    content: '# AI導入による業務効率化のROI分析\n\n企業でのAI導入について、実際のROI（投資対効果）を分析した事例を紹介します。\n\n## 導入前の課題\n\n- 手作業による業務の非効率性\n- 人的ミスの発生\n- 処理時間の長さ\n\n## AI導入後の効果\n\n### 定量的効果\n- 処理時間の80%削減\n- エラー率の95%減少\n- 人件費の40%削減\n\n### 定性的効果\n- 従業員満足度の向上\n- 創造的業務への時間確保\n- 顧客満足度の向上\n\n## 投資回収期間\n\n導入から6ヶ月で投資回収を達成しました。',
    excerpt: '企業におけるAI導入の実際のROI分析事例を紹介。定量的・定性的効果と投資回収期間について詳しく解説します。',
    category: mockCategories[2], // efficiency
    tags: 'AI導入,ROI,業務効率化,企業',
    featured_image: {
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400',
      width: 800,
      height: 400
    },
    contentType: 'research',
    targetAudience: 'enterprise',
    difficultyLevel: 'intermediate',
    reading_time: 7,
    status: 'published'
  },
];

export const mockArticleResponse: ArticleResponse = {
  contents: mockArticles,
  totalCount: mockArticles.length,
  offset: 0,
  limit: 10,
};

export const mockCategoryResponse: CategoryResponse = {
  contents: mockCategories,
  totalCount: mockCategories.length,
  offset: 0,
  limit: 10,
};