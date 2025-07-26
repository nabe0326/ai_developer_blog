# AI Engineering Hub - プロジェクト概要とClaude協働ガイド

## プロジェクト概要
AI技術の実践的情報を発信するブログサイト「AI Engineering Hub」
- **ターゲット**: エンジニア & 企業  
- **技術スタック**: Next.js 14 + TypeScript + Tailwind CSS + MicroCMS + Vercel
- **特色**: Claude Desktop MCP Server による自動記事投稿機能搭載

## 現在の開発状況

### ✅ 完了済み（2025年1月時点）
**Phase 1: 基盤構築 - 完了**
- [x] Next.js 14プロジェクトセットアップ（App Router）
- [x] TypeScript + Tailwind CSS設定
- [x] MicroCMS連携実装・本番稼働
- [x] **MCP Server開発・Claude Desktop連携完了**
- [x] 基本ページ実装（トップ、記事詳細、カテゴリ、検索等）
- [x] SEO基本設定（構造化データ、sitemap、robots.txt）
- [x] Vercel本番デプロイ環境構築

### 🚨 現在の重要課題
**Phase 2A: 画像運用フロー確立（最優先）**
- [ ] MCP Server画像プレースホルダー機能実装
- [ ] 画像差し替え手順書作成
- [ ] 汎用画像ライブラリ構築

---

# 技術仕様

## アーキテクチャ
```
Frontend: Next.js 14 (App Router) + TypeScript
Styling: Tailwind CSS 
CMS: MicroCMS (本番連携済み)
Deploy: Vercel
Automation: Claude Desktop + MCP Server
```

## データ構造（MicroCMS実装済み）
```json
{
  "id": "記事ID",
  "title": "記事タイトル",
  "slug": "url-slug", 
  "content": "記事本文（マークダウン）",
  "excerpt": "記事概要（150文字以内）",
  "category": {
    "id": "カテゴリID",
    "name": "カテゴリ名",
    "slug": "category-slug"
  },
  "tags": "tag1,tag2,tag3",
  "featured_image": {
    "url": "画像URL",
    "width": 1200,
    "height": 630
  },
  "contentType": "experience | research | tutorial",
  "targetAudience": "engineer | enterprise | both",
  "difficultyLevel": "beginner | intermediate | advanced",
  "reading_time": 5,
  "publishedAt": "2025-01-26T12:00:00.000Z",
  "status": "published | draft"
}
```

## ディレクトリ構造
```
src/
├── app/                 # Next.js App Router
│   ├── page.tsx        # トップページ
│   ├── articles/       # 記事関連ページ
│   ├── categories/     # カテゴリページ
│   ├── search/         # 検索ページ
│   └── about/          # サイト紹介
├── components/
│   ├── blog/           # 記事表示コンポーネント
│   ├── layout/         # ヘッダー・フッター
│   ├── search/         # 検索機能
│   └── ui/             # 汎用UIコンポーネント
├── lib/
│   ├── microcms.ts     # CMS連携ロジック
│   ├── search.ts       # 検索機能
│   └── utils.ts        # ユーティリティ
└── types/
    └── microcms.ts     # 型定義
```

## カテゴリ体系（実装済み）
1. **実装事例** - Difyアプリ開発、APIインテグレーション、業務自動化
2. **技術調査** - 新AI技術、ツール比較、パフォーマンス分析  
3. **業務効率化** - 導入事例、ROI分析、運用ノウハウ
4. **開発Tips** - プロンプトエンジニアリング、デバッグ、ベストプラクティス

---

# 開発環境・運用

## 必要な環境変数
```bash
# MicroCMS連携（設定済み）
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-api-key

# サイト設定
NEXT_PUBLIC_SITE_URL=https://ai-developer-blog.vercel.app
```

## 開発コマンド
```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動  
npm run start
```

## 現在のデプロイ状況
- **本番URL**: https://ai-developer-blog.vercel.app
- **自動デプロイ**: GitHub連携で自動
- **CMS**: MicroCMS本番環境稼働中
- **MCP Server**: Claude Desktop連携稼働中

---

# Claude協働時の重要ポイント

## 記事投稿フロー（現在）
1. **Claude Desktop** → MCP Server → **MicroCMS自動投稿**
2. 手動画像追加（当面の課題）
3. Vercel自動再デプロイ

## コード変更時の注意
- **モックデータは使用しない**（本番MicroCMS連携済み）
- 型定義は `src/types/microcms.ts` を基準とする
- コンポーネントは既存パターンを踏襲

## テスト・確認方法
```bash
# ローカル開発時の確認
npm run dev

# 本番ビルド確認
npm run build
```

## よく使用するファイル
- **記事表示**: `src/app/articles/[slug]/page.tsx`
- **MicroCMS連携**: `src/lib/microcms.ts`  
- **型定義**: `src/types/microcms.ts`
- **ヘッダー**: `src/components/layout/Header.tsx`

---

# 今後の開発計画

## 最優先タスク（Phase 2A）
1. **画像運用フロー確立**
   - MCP Server画像プレースホルダー機能
   - 画像ライブラリ構築
   - 半自動画像生成機能（将来）

## 中期改善項目（Phase 2B）
1. **UX向上**
   - ソーシャルシェア機能
   - コメント機能（Disqus等）
   - 検索機能強化

2. **SEO最適化**
   - Core Web Vitals改善
   - 構造化データ拡充
   - サイトマップ最適化

## 長期拡張（Phase 3）
1. **AI連携強化**
   - 自動画像生成API
   - コンテンツ分析機能
   - SEO提案機能

2. **運用機能**
   - アクセス解析
   - パフォーマンス監視
   - 自動バックアップ

---

# 参考リンク・ドキュメント

## プロジェクト関連
- **本番サイト**: https://ai-developer-blog.vercel.app
- **MicroCMS管理画面**: https://your-service.microcms.io
- **Vercelダッシュボード**: https://vercel.com/dashboard

## 技術資料
- **Next.js 14**: https://nextjs.org/docs
- **MicroCMS**: https://document.microcms.io/
- **Tailwind CSS**: https://tailwindcss.com/docs

## MCP Server参考実装  
- **Zenn記事**: https://zenn.dev/himara2/articles/14eb2260c4f0e4

---

# 運用メモ

## 記事更新頻度
- **目標**: 毎日2-3記事
- **文字数**: 500-1000文字
- **Claude Desktop**: 直接投稿可能（MCP Server経由）

## 記事品質基準
- エンジニア・企業向けの実践的内容
- 具体的な実装例・事例を含む
- SEO最適化（タイトル、メタ記述、構造化データ）
- 読了時間: 3-5分程度

## 課題管理
詳細な課題・TODO管理は `docs/TODO.md` を参照