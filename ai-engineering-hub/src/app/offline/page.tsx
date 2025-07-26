import Link from 'next/link';
import { WifiOff, Home, BookOpen } from 'lucide-react';
import { Metadata } from 'next';
import RefreshButton from '@/components/ui/RefreshButton';

export const metadata: Metadata = {
  title: 'オフライン | AI Engineering Hub',
  description: 'インターネット接続を確認してください',
  robots: {
    index: false,
    follow: false,
  },
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <WifiOff className="w-8 h-8 text-gray-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            オフラインです
          </h1>
          <p className="text-gray-600 mb-6">
            インターネット接続を確認して、再度お試しください。
            キャッシュされたページは引き続きご利用いただけます。
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <RefreshButton />
          
          <Link
            href="/"
            className="w-full bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-300 transition-colors duration-200 flex items-center justify-center"
          >
            <Home className="w-4 h-4 mr-2" />
            ホームに戻る
          </Link>

          <Link
            href="/articles"
            className="w-full bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-300 transition-colors duration-200 flex items-center justify-center"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            キャッシュされた記事を見る
          </Link>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">オフライン時の機能</h3>
          <ul className="text-sm text-blue-800 space-y-1 text-left">
            <li>• 以前に訪問したページの閲覧</li>
            <li>• キャッシュされた記事の読み返し</li>
            <li>• 基本的なナビゲーション</li>
          </ul>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          接続が復旧すると、最新のコンテンツをお楽しみいただけます
        </div>
      </div>
    </div>
  );
}