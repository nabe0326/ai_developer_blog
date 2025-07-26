// Google Analytics設定
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

// pageview追跡
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID!, {
      page_location: url,
    })
  }
}

// カスタムイベント追跡
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// ソーシャルシェア追跡
export const trackShare = (platform: string, articleSlug: string) => {
  event({
    action: 'share',
    category: 'article',
    label: `${platform}:${articleSlug}`,
  })
}

// 記事読了追跡
export const trackReadComplete = (articleSlug: string, readingTime: number) => {
  event({
    action: 'read_complete',
    category: 'article',
    label: articleSlug,
    value: readingTime,
  })
}

// 検索追跡
export const trackSearch = (query: string, resultsCount: number) => {
  event({
    action: 'search',
    category: 'site',
    label: query,
    value: resultsCount,
  })
}