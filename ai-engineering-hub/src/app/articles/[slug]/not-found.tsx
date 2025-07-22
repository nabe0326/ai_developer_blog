import Link from 'next/link'
import { ArrowLeft, FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <FileQuestion className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-primary-900 mb-2">404</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">記事が見つかりません</h2>
          <p className="text-gray-600 mb-8">
            お探しの記事は存在しないか、移動した可能性があります。
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-accent-500 text-white font-medium rounded-lg hover:bg-accent-600 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            トップページに戻る
          </Link>
          
          <Link
            href="/articles"
            className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            記事一覧を見る
          </Link>
        </div>
      </div>
    </div>
  )
}