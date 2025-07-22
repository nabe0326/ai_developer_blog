import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 日付関連ユーティリティ
export const dateUtils = {
  // 日付をフォーマット
  formatDate: (dateString: string, locale = 'ja-JP'): string => {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString))
  },

  // 相対時間表示
  formatRelativeTime: (dateString: string): string => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return '今日'
    if (diffInDays === 1) return '昨日'
    if (diffInDays < 7) return `${diffInDays}日前`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}週間前`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}ヶ月前`
    return `${Math.floor(diffInDays / 365)}年前`
  },

  // ISO日付文字列をYYYY-MM-DD形式に
  toDateString: (dateString: string): string => {
    return new Date(dateString).toISOString().split('T')[0]
  },
}

// 文字列関連ユーティリティ
export const stringUtils = {
  // 文字数制限（日本語対応）
  truncate: (text: string, length: number, suffix = '...'): string => {
    if (text.length <= length) return text
    return text.substring(0, length - suffix.length) + suffix
  },

  // スラッグ生成
  createSlug: (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // 特殊文字除去
      .replace(/[\s_-]+/g, '-') // スペース・アンダースコアをハイフンに
      .replace(/^-+|-+$/g, '') // 先頭・末尾のハイフン除去
  },

  // HTMLタグ除去
  stripHtml: (html: string): string => {
    return html.replace(/<[^>]*>/g, '')
  },

  // 読了時間計算（日本語対応）
  calculateReadingTime: (content: string): number => {
    const japaneseCharsPerMinute = 400 // 日本語読書速度
    const contentLength = stringUtils.stripHtml(content).replace(/\s+/g, '').length
    return Math.max(1, Math.ceil(contentLength / japaneseCharsPerMinute))
  },
}

// URL関連ユーティリティ
export const urlUtils = {
  // 絶対URLを生成
  createAbsoluteUrl: (path: string): string => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
  },

  // 画像URL最適化
  optimizeImageUrl: (
    url: string,
    options: {
      width?: number
      height?: number
      quality?: number
      format?: 'webp' | 'jpg' | 'png'
    } = {}
  ): string => {
    if (!url) return ''
    
    const { width, height, quality = 80, format = 'webp' } = options
    const params = new URLSearchParams()
    
    if (width) params.set('w', String(width))
    if (height) params.set('h', String(height))
    params.set('q', String(quality))
    params.set('fm', format)
    
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}${params.toString()}`
  },
}

// SEO関連ユーティリティ
export const seoUtils = {
  // メタディスクリプション生成
  generateMetaDescription: (content: string, maxLength = 160): string => {
    const plainText = stringUtils.stripHtml(content)
    return stringUtils.truncate(plainText, maxLength)
  },

  // キーワード抽出（簡易版）
  extractKeywords: (content: string, maxKeywords = 10): string[] => {
    const plainText = stringUtils.stripHtml(content).toLowerCase()
    const words = plainText
      .split(/\s+/)
      .filter(word => word.length > 2) // 3文字以上
      .filter(word => !/^[0-9]+$/.test(word)) // 数字のみ除外
    
    const wordCount: Record<string, number> = {}
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1
    })
    
    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, maxKeywords)
      .map(([word]) => word)
  },
}

// バリデーション関連ユーティリティ
export const validationUtils = {
  // メールアドレス検証
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // URL検証
  isValidUrl: (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },

  // スラッグ検証
  isValidSlug: (slug: string): boolean => {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    return slugRegex.test(slug)
  },
}