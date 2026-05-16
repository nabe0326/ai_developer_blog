# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
NEXT_PUBLIC_SITE_URL=https://blog.aurore-tech.com
```

## Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Production server
npm run start

# Linting (Next.js built-in ESLint)
npx next lint

# Type checking
npx tsc --noEmit
```

## 現在のデプロイ状況
- **本番URL**: https://blog.aurore-tech.com
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

## Architecture Overview

**Core Technologies:**
- **Frontend**: Next.js 14 with App Router
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS v4.x
- **CMS**: MicroCMS (production integrated)
- **Deployment**: Vercel with auto-deployment
- **Analytics**: Google Analytics 4 + Vercel Analytics

**Key Architecture Decisions:**
- Uses MicroCMS SDK for content management - **NEVER use mock data in production**
- All routes use App Router pattern (`src/app/`)
- Comprehensive SEO setup with structured data, sitemaps, and feeds
- Optimized images with WebP/AVIF support for MicroCMS assets
- RSS/Atom feeds for content distribution

## Key File Locations

**Core API Integration:**
- `src/lib/microcms.ts` - MicroCMS client and data fetching functions
- `src/types/microcms.ts` - TypeScript interfaces for CMS data structures
- `src/lib/utils.ts` - Utility functions and helpers

**Main Pages:**
- `src/app/page.tsx` - Homepage with featured articles
- `src/app/articles/[slug]/page.tsx` - Article detail pages
- `src/app/articles/page.tsx` - Articles listing
- `src/app/categories/[category]/page.tsx` - Category pages
- `src/app/search/page.tsx` - Search functionality

**Components:**
- `src/components/layout/Header.tsx` & `Footer.tsx` - Site layout
- `src/components/blog/ArticleCard.tsx` - Article preview cards
- `src/components/blog/ArticleContent.tsx` - Main article content display
- `src/components/blog/ShareButtons.tsx` - Social sharing
- `src/components/search/SearchBar.tsx` - Search interface

**SEO & Feeds:**
- `src/app/sitemap.ts` - Dynamic sitemap generation
- `src/app/feed.xml/route.ts` - RSS feed
- `src/app/atom.xml/route.ts` - Atom feed

## Code Patterns and Conventions

**Data Fetching:**
- Use functions from `src/lib/microcms.ts` for all CMS operations
- Functions include error handling and fallbacks to mock data when env vars missing
- Most functions are already cached appropriately for production performance

**Component Structure:**
- Follow existing component patterns in `src/components/`
- Use TypeScript interfaces from `src/types/microcms.ts`
- Maintain responsive design with Tailwind CSS utilities

**Routing:**
- All pages use App Router conventions
- Dynamic routes: `[slug]`, `[category]`, `[tag]`
- API routes for feeds and revalidation in `src/app/api/`

**SEO Implementation:**
- Each page defines its own metadata export
- Structured data components in `src/components/blog/`
- Automatic sitemap generation with `src/app/sitemap.ts`

## Current Priority Tasks

**Highest Priority (Phase 2A):**
- Image workflow optimization - MCP Server placeholder functionality
- Image library construction for reusable assets

**Medium Priority:**
- Enhanced search functionality with filters and highlighting
- Related articles algorithm improvements
- Core Web Vitals optimization

## Important Notes

**Environment Variables Required:**
```bash
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-api-key
NEXT_PUBLIC_SITE_URL=https://blog.aurore-tech.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Content Management:**
- Articles are automatically published through Claude Desktop + MCP Server integration
- **Never use mock data** - production site uses live MicroCMS integration
- Follow existing content patterns and SEO optimization
- All content should be practical, engineer/enterprise-focused

**Deployment:**
- Production URL: https://blog.aurore-tech.com
- Auto-deployment via GitHub integration
- MicroCMS is live production environment

**For detailed TODO tracking see:** `docs/TODO.md`