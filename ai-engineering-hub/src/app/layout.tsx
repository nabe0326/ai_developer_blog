import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Analytics } from '@vercel/analytics/react';

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
    template: '%s | AI Engineering Hub',
    default: 'AI Engineering Hub - 実践的AI技術情報',
  },
  description: 'エンジニアと企業向けの実践的なAI技術情報を発信するブログです。',
  keywords: ['AI', '人工知能', 'Claude', 'GPT', 'プロンプトエンジニアリング'],
  authors: [{ name: 'AI Engineering Hub' }],
  creator: 'AI Engineering Hub',
  metadataBase: new URL('https://ai-developer-blog.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://ai-developer-blog.vercel.app',
    siteName: 'AI Engineering Hub',
    title: 'AI Engineering Hub - 実践的AI技術情報',
    description: 'エンジニアと企業向けの実践的なAI技術情報を発信するブログです。',
    images: [
      {
        url: '/ogp-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Engineering Hub - 実践的AI技術情報',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@ai_engineering_hub',
    images: [
      {
        url: '/ogp-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Engineering Hub - 実践的AI技術情報',
      },
    ],
  },
  verification: {
    google: 'nP6rQVSUrvnNnC85ldEfpWqR8NKVQwFH1w3IDkn9SaY',
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
      </body>
    </html>
  );
}
