'use client'

import { Share2, ExternalLink } from 'lucide-react'
import { trackShare } from '@/lib/gtag'

interface ShareButtonsProps {
  url: string
  title: string
  description: string
  compact?: boolean // カード用の小型版
  className?: string
}

export default function ShareButtons({ 
  url, 
  title, 
  compact = false, 
  className = '' 
}: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  // X/Twitter シェアURL
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&via=nabe_AI_dev`

  // Qiita プロフィールURL
  const qiitaProfileUrl = `https://qiita.com/k_nabe`

  const handleShare = (shareUrl: string, platform: string) => {
    // アナリティクス追跡
    const articleSlug = url.split('/articles/')[1] || 'unknown'
    trackShare(platform, articleSlug)
    
    window.open(shareUrl, `share-${platform}`, 'width=600,height=400,scrollbars=no,resizable=no')
  }

  const handleQiitaProfile = () => {
    // アナリティクス追跡
    const articleSlug = url.split('/articles/')[1] || 'unknown'
    trackShare('qiita-profile', articleSlug)
    
    window.open(qiitaProfileUrl, 'qiita-profile', 'width=800,height=600,scrollbars=yes,resizable=yes')
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <button
          onClick={() => handleShare(twitterUrl, 'twitter')}
          className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors duration-200"
          title="Xでシェア"
          aria-label="Xでシェア"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </button>
        
        <button
          onClick={handleQiitaProfile}
          className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors duration-200"
          title="Qiitaプロフィールを見る"
          aria-label="Qiitaプロフィールを見る"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.57 8.343a3.653 3.653 0 0 1 3.652-3.653h9.555a3.653 3.653 0 0 1 3.653 3.653v7.315a3.653 3.653 0 0 1-3.653 3.652H7.222a3.653 3.653 0 0 1-3.652-3.652V8.343zm7.427 1.738c-1.305 0-2.366 1.06-2.366 2.366s1.06 2.366 2.366 2.366 2.366-1.06 2.366-2.366-1.06-2.366-2.366-2.366z"/>
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">この記事をシェア</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {/* X/Twitter シェアボタン */}
        <button
          onClick={() => handleShare(twitterUrl, 'twitter')}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 text-sm font-medium"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          <span>Xでシェア</span>
        </button>

        {/* Qiita プロフィールボタン */}
        <button
          onClick={handleQiitaProfile}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.57 8.343a3.653 3.653 0 0 1 3.652-3.653h9.555a3.653 3.653 0 0 1 3.653 3.653v7.315a3.653 3.653 0 0 1-3.653 3.652H7.222a3.653 3.653 0 0 1-3.652-3.652V8.343zm7.427 1.738c-1.305 0-2.366 1.06-2.366 2.366s1.06 2.366 2.366 2.366 2.366-1.06 2.366-2.366-1.60-2.366-2.366-2.366z"/>
          </svg>
          <span>Qiitaプロフィール</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* シェア先リンク表示 */}
      <div className="mt-3 text-xs text-gray-500">
        <p>
          Xアカウント: <a href="https://x.com/nabe_AI_dev" target="_blank" rel="noopener noreferrer" className="text-accent-600 hover:text-accent-700">@nabe_AI_dev</a>
          {' '}｜ Qiitaアカウント: <a href="https://qiita.com/k_nabe" target="_blank" rel="noopener noreferrer" className="text-accent-600 hover:text-accent-700">@k_nabe</a>
        </p>
      </div>
    </div>
  )
}