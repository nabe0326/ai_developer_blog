import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Analytics } from '@vercel/analytics/react';
import { WebsiteStructuredData } from "@/components/blog/WebsiteStructuredData";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | 実践AI技術ブログ',
    default: '実践AI技術ブログ - エンジニアと企業向けのAI技術情報',
  },
  description: 'エンジニアと企業向けのAI技術情報。開発事例、ツール比較、導入ノウハウから最新トレンドまで実践的な情報を発信。',
  keywords: ['AI技術', '開発事例', 'エンジニア', '企業導入', '技術ブログ', '実装ガイド', '人工知能', 'Claude', 'GPT', 'プロンプトエンジニアリング'],
  authors: [{ name: '実践AI技術ブログ' }],
  creator: '実践AI技術ブログ',
  metadataBase: new URL('https://ai-developer-blog.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://ai-developer-blog.vercel.app',
    siteName: '実践AI技術ブログ',
    title: '実践AI技術ブログ - エンジニアと企業向けのAI技術情報',
    description: 'エンジニアと企業向けのAI技術情報。開発事例、ツール比較、導入ノウハウから最新トレンドまで実践的な情報を発信。',
    images: [
      {
        url: 'https://ai-developer-blog.vercel.app/ogp-image.png',
        width: 1200,
        height: 630,
        alt: '実践AI技術ブログ - エンジニアと企業向けのAI技術情報',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@practical_ai_tech',
    images: [
      {
        url: 'https://ai-developer-blog.vercel.app/ogp-image.png',
        width: 1200,
        height: 630,
        alt: '実践AI技術ブログ - エンジニアと企業向けのAI技術情報',
      },
    ],
  },
  verification: {
    google: 'nP6rQVSUrvnNnC85ldEfpWqR8NKVQwFH1w3IDkn9SaY',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  alternates: {
    canonical: 'https://ai-developer-blog.vercel.app',
  },
  category: 'technology',
  classification: 'Technology Blog',
  other: {
    'theme-color': '#0f172a',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'msapplication-TileColor': '#0f172a',
    'application-name': '実践AI技術ブログ',
    'apple-mobile-web-app-title': '実践AI技術ブログ',
    'format-detection': 'telephone=no',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <WebsiteStructuredData />
        <link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/feed.xml" />
        <link rel="alternate" type="application/atom+xml" title="Atom Feed" href="/atom.xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-primary-700`}
      >
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        <Analytics />
        <GoogleAnalytics />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
