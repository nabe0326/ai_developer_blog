import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Target, Users, Lightbulb, Github, Twitter } from 'lucide-react';

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

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-900 mb-4">
              サイトの特徴
            </h2>
            <p className="text-lg text-gray-600">
              効率的で価値ある情報提供を実現する、このサイトならではの特徴をご紹介します。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-primary-900 mb-4">高品質なコンテンツ</h3>
              <p className="text-gray-600 mb-4">
                実際のプロジェクトで得られた経験と知見を基に、実践的で価値の高い記事を継続的に提供しています。
              </p>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• 実装時の課題と解決策を詳細に解説</li>
                <li>• 企業導入における具体的な効果測定</li>
                <li>• 最新技術の動向と将来性の分析</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-primary-900 mb-4">効率的な記事制作</h3>
              <p className="text-gray-600 mb-4">
                先進的な制作プロセスにより、タイムリーで一貫性の高いコンテンツ配信を実現しています。
              </p>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• 毎日2-3記事の高頻度更新</li>
                <li>• 統一されたフォーマットと品質基準</li>
                <li>• 最新技術動向への迅速な対応</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-primary-900 mb-4">読者に優しい設計</h3>
              <p className="text-gray-600 mb-4">
                エンジニアと企業の両方のニーズを考慮した、使いやすいサイト設計を心がけています。
              </p>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• カテゴリとタグによる効率的な記事検索</li>
                <li>• 難易度別・対象者別の明確な分類</li>
                <li>• モバイルファーストのレスポンシブデザイン</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-primary-900 mb-4">コミュニティ重視</h3>
              <p className="text-gray-600 mb-4">
                単なる情報発信にとどまらず、AI技術者・企業担当者同士の学習と成長を支援します。
              </p>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• 実践者の生の声と経験談を重視</li>
                <li>• 企業事例とエンジニア視点の両面から解説</li>
                <li>• フィードバックと継続的な改善</li>
              </ul>
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
              href="https://github.com/nabe0326"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <Github className="mr-2 w-5 h-5" />
              GitHub
            </a>
            <a
              href="https://x.com/nabe_AI_dev"
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