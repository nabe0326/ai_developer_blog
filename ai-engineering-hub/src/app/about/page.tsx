import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Target, Users, Lightbulb, Mail, Github, Twitter } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About - AI Engineering Hub',
  description: 'AI Engineering Hubについて。AI技術の実践的情報を発信し、エンジニアと企業の成長を支援するブログサイトです。',
  keywords: ['AI', '人工知能', 'Claude', 'GPT', 'プロンプトエンジニアリング', 'AI開発', 'MCP'],
  openGraph: {
    title: 'About - AI Engineering Hub',
    description: 'AI Engineering Hubについて。AI技術の実践的情報を発信し、エンジニアと企業の成長を支援するブログサイトです。',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-700 to-primary-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            About
            <span className="block text-accent-500">AI Engineering Hub</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            AI技術の実践的情報を発信し、<br />
            エンジニアと企業の成長を支援するブログサイトです。
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-900 mb-4">
              私たちのミッション
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              AI技術の可能性を最大限に引き出し、実践的な知識とノウハウを共有することで、
              より良い未来の構築に貢献します。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary-900 mb-3">実践重視</h3>
              <p className="text-gray-600">
                理論だけでなく、実際の開発現場で活用できる実践的な情報を提供します。
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary-900 mb-3">コミュニティ</h3>
              <p className="text-gray-600">
                エンジニアと企業が共に学び、成長できるコミュニティの形成を目指します。
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary-900 mb-3">イノベーション</h3>
              <p className="text-gray-600">
                最新のAI技術動向を追跡し、革新的なアイデアや手法を積極的に紹介します。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Cover Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-900 mb-4">
              コンテンツカテゴリ
            </h2>
            <p className="text-lg text-gray-600">
              多様な視点からAI技術に関する情報をお届けします。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-primary-900 mb-3">実装事例</h3>
              <p className="text-gray-600 mb-4">
                Difyアプリ開発、APIインテグレーション、業務自動化など、実際のプロジェクトで得られた知見を共有。
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-accent-50 text-accent-700 text-sm rounded-full">Dify</span>
                <span className="px-3 py-1 bg-accent-50 text-accent-700 text-sm rounded-full">API</span>
                <span className="px-3 py-1 bg-accent-50 text-accent-700 text-sm rounded-full">自動化</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-primary-900 mb-3">技術調査</h3>
              <p className="text-gray-600 mb-4">
                新AI技術の調査、ツール比較、パフォーマンス分析など、技術的な深掘り情報を提供。
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-accent-50 text-accent-700 text-sm rounded-full">調査</span>
                <span className="px-3 py-1 bg-accent-50 text-accent-700 text-sm rounded-full">比較</span>
                <span className="px-3 py-1 bg-accent-50 text-accent-700 text-sm rounded-full">分析</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-primary-900 mb-3">業務効率化</h3>
              <p className="text-gray-600 mb-4">
                AI導入事例、ROI分析、運用ノウハウなど、企業でのAI活用に役立つ情報をお届け。
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-accent-50 text-accent-700 text-sm rounded-full">導入</span>
                <span className="px-3 py-1 bg-accent-50 text-accent-700 text-sm rounded-full">ROI</span>
                <span className="px-3 py-1 bg-accent-50 text-accent-700 text-sm rounded-full">運用</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-primary-900 mb-3">開発Tips</h3>
              <p className="text-gray-600 mb-4">
                プロンプトエンジニアリング、デバッグ手法、ベストプラクティスなど、開発者向けの実用的な情報。
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-accent-50 text-accent-700 text-sm rounded-full">プロンプト</span>
                <span className="px-3 py-1 bg-accent-50 text-accent-700 text-sm rounded-full">デバッグ</span>
                <span className="px-3 py-1 bg-accent-50 text-accent-700 text-sm rounded-full">Tips</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-900 mb-4">
              技術スタック
            </h2>
            <p className="text-lg text-gray-600">
              このサイトは最新のWeb技術とAIツールを活用して構築されています。
            </p>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-primary-900 mb-4">フロントエンド</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• <span className="font-medium">Next.js 14</span> - React フレームワーク（App Router）</li>
                  <li>• <span className="font-medium">TypeScript</span> - 型安全性とコード品質向上</li>
                  <li>• <span className="font-medium">Tailwind CSS</span> - ユーティリティファーストCSS</li>
                  <li>• <span className="font-medium">Lucide React</span> - アイコンライブラリ</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-primary-900 mb-4">バックエンド・その他</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• <span className="font-medium">MicroCMS</span> - ヘッドレスCMS</li>
                  <li>• <span className="font-medium">Vercel</span> - ホスティング・デプロイ</li>
                  <li>• <span className="font-medium">Claude Desktop</span> - AI支援による記事作成</li>
                  <li>• <span className="font-medium">MCP Server</span> - 自動投稿システム</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary-900 mb-4">
            お問い合わせ・フィードバック
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            ご質問、ご提案、コラボレーションのお声かけなど、お気軽にご連絡ください。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <a 
              href="mailto:contact@ai-engineering-hub.com"
              className="inline-flex items-center px-6 py-3 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <Mail className="mr-2 w-5 h-5" />
              メールでお問い合わせ
            </a>
            <a
              href="https://github.com/ai-engineering-hub"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Github className="mr-2 w-5 h-5" />
              GitHub
            </a>
            <a
              href="https://twitter.com/ai_engineering_hub"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Twitter className="mr-2 w-5 h-5" />
              Twitter
            </a>
          </div>

          <div className="text-center">
            <Link 
              href="/articles"
              className="inline-flex items-center text-accent-500 hover:text-accent-600 font-medium transition-colors duration-200"
            >
              記事一覧に戻る
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}