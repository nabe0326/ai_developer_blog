'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { GA_TRACKING_ID, pageview } from '@/lib/gtag'

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      config?: Record<string, unknown>
    ) => void
  }
}

export default function GoogleAnalytics() {
  const pathname = usePathname()

  useEffect(() => {
    if (!GA_TRACKING_ID || !pathname) return

    // searchParamsを使わずにpathnameのみを使用
    pageview(pathname)
  }, [pathname])

  if (!GA_TRACKING_ID) {
    return null
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_location: window.location.href,
              page_title: document.title,
              send_page_view: false, // We handle page views manually
            });
          `,
        }}
      />
    </>
  )
}