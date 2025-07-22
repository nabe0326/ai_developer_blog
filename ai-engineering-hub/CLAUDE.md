# AI Engineering Hub - 開発ドキュメント

## プロジェクト概要
AI技術の実践的情報を発信するブログサイト
- **ターゲット**: エンジニア & 企業
- **技術スタック**: Next.js 14 + TypeScript + Tailwind CSS + MicroCMS + Vercel
- **運用**: Claude Desktop + MCP Server による自動投稿

## 開発進行状況
- [ ] Phase 1: 基盤構築（Next.jsセットアップ済み）
- [ ] Phase 2: UI/UX改善  
- [ ] Phase 3: MCP連携

## 現在の作業フェーズ
**Phase 1: 基盤構築**
- [x] Next.jsプロジェクトセットアップ（手動完了）
- [ ] MicroCMS連携実装
- [ ] 基本ページ実装
- [ ] 基本レイアウト作成

---

# 詳細要件定義

## 技術仕様
### フロントエンド
```
Framework: Next.js 14 (App Router) + TypeScript
Styling: Tailwind CSS + shadcn/ui
CMS: MicroCMS
Hosting: Vercel
```

### 記事データ構造（MicroCMS）
```json
{
  "title": "記事タイトル",
  "slug": "url-slug", 
  "content": "記事本文（マークダウン）",
  "excerpt": "記事概要（150文字以内）",
  "category": "カテゴリID",
  "tags": ["tag1", "tag2", "tag3"],
  "featured_image": "アイキャッチ画像URL",
  "content_type": "実体験 | 調査情報 | チュートリアル",
  "target_audience": "エンジニア | 企業 | 両方",
  "difficulty_level": "初級 | 中級 | 上級",
  "estimated_reading_time": "分",
  "published_at": "公開日時",
  "updated_at": "更新日時",
  "status": "published | draft"
}
```

## ページ構成
```
/                     - トップページ（最新記事一覧）
/articles            - 全記事一覧
/articles/[slug]     - 記事詳細ページ  
/categories/[category] - カテゴリ別記事一覧
/tags/[tag]          - タグ別記事一覧
/search              - 記事検索ページ
/about               - サイト・執筆者について
```

## デザインシステム
### カラーパレット
```css
--primary-900: #0f172a    /* ダークブルー（ヘッダー） */
--primary-700: #334155    /* メインブルー（テキスト） */  
--accent-500: #10b981     /* グリーン（CTA、リンク） */
--gray-50: #f8fafc        /* 背景色 */
--gray-100: #f1f5f9       /* カード背景 */
```

### コンポーネント一覧
- Header（ナビゲーション、検索窓）
- Footer（サイト情報、リンク）
- ArticleCard（記事カード）
- Pagination（ページネーション）
- SearchFilter（検索・フィルタUI）
- CodeBlock（コードハイライト）
- TOC（目次）
- ShareButtons（シェアボタン）

## カテゴリ構造
1. **実装事例** - Difyアプリ開発、APIインテグレーション、業務自動化
2. **技術調査** - 新AI技術、ツール比較、パフォーマンス分析
3. **業務効率化** - 導入事例、ROI分析、運用ノウハウ  
4. **開発Tips** - プロンプトエンジニアリング、デバッグ、ベストプラクティス

## MCP Server 仕様
**参考実装**: https://zenn.dev/himara2/articles/14eb2260c4f0e4

### 必要な機能
```typescript
interface MCPServerFunctions {
  // 記事管理
  createArticle(content: ArticleInput): Promise<Article>
  updateArticle(id: string, content: Partial<ArticleInput>): Promise<Article>
  
  // Claude AI連携による自動化
  generateArticleFromPrompt(prompt: string): Promise<ArticleInput>
  analyzeAndCategorize(content: string): Promise<{category: string, tags: string[]}>
  generateSEOMetadata(article: ArticleInput): Promise<SEOMetadata>
  
  // 画像管理
  uploadImage(imageData: Buffer, filename: string): Promise<string>
}
```

## 環境変数
```
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-api-key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 開発メモ
- 記事更新頻度: 毎日2-3記事
- 文字数: 500-1000文字
- Claude Desktopから直接投稿可能にする
- 企業向けコンテンツとエンジニア向けを区別表示
- SEO最適化必須（Core Web Vitals対応）

## 参考リンク
- MicroCMS MCP実装例: https://zenn.dev/himara2/articles/14eb2260c4f0e4
- デザインイメージ: スタイリッシュ、プロフェッショナル、視認性重視