import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: 'AI Engineering Hub のプライバシーポリシーです。広告配信・アクセス解析・個人情報の取り扱いについて説明しています。',
  keywords: ['プライバシーポリシー', '個人情報', 'Cookie', 'Google AdSense'],
  openGraph: {
    title: 'プライバシーポリシー | AI Engineering Hub',
    description: 'AI Engineering Hub のプライバシーポリシーです。広告配信・アクセス解析・個人情報の取り扱いについて説明しています。',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

const sections = [
  {
    title: '1. プライバシーポリシーについて',
    content: `AI Engineering Hub（以下「当サイト」）は、ユーザーの個人情報の取り扱いについて、以下のとおりプライバシーポリシーを定めます。当サイトをご利用いただく場合には、本ポリシーに同意したものとみなします。`,
  },
  {
    title: '2. 広告配信について（Google AdSense）',
    content: `当サイトは、Google が提供する広告配信サービス「Google AdSense」を利用しています。Google AdSense は、ユーザーの興味に応じた広告を表示するために Cookie を使用することがあります。

Cookie を使用することで、Google やそのパートナーは当サイトや他のサイトへのユーザーのアクセス情報に基づいて適切な広告を表示します。

ユーザーは Google アカウントの広告設定ページにてパーソナライズ広告を無効にすることができます。また、www.aboutads.info にアクセスすることで、パーソナライズ広告に使用される第三者配信事業者の Cookie を無効にすることができます。

Google の Cookie 使用に関する詳細は、Google のプライバシーポリシーをご参照ください。`,
  },
  {
    title: '3. アクセス解析ツールについて（Google Analytics）',
    content: `当サイトでは、サイトの利用状況を把握するために Google Analytics を使用しています。Google Analytics は Cookie を通じてデータを収集しますが、個人を特定する情報は含まれません。

収集したデータはサイト改善・コンテンツ最適化の目的にのみ使用します。Google Analytics のデータ収集を拒否する場合は、Google Analytics オプトアウトアドオンをご利用ください。

Google Analytics の利用規約・プライバシーポリシーについては Google のサイトをご参照ください。`,
  },
  {
    title: '4. 当サイトへのリンクについて',
    content: `当サイトは基本的にリンクフリーです。リンクを貼る際に許可は不要です。ただし、インラインフレームの使用や、画像の直リンクは禁止しています。`,
  },
  {
    title: '5. 免責事項',
    content: `当サイトに掲載している情報は、できる限り正確な情報を提供するよう努めていますが、正確性・安全性を保証するものではありません。当サイトに掲載された情報によって生じた損害等について、一切の責任を負いかねます。

また、当サイトからリンクしている外部サイトの内容については関与しておらず、その内容についての責任を負いません。`,
  },
  {
    title: '6. 著作権について',
    content: `当サイトに掲載されているコンテンツ（文章・画像・図表等）の著作権は、当サイト運営者に帰属します。法律で認められた範囲を超えて、無断で複製・転載することを禁止します。`,
  },
  {
    title: '7. プライバシーポリシーの変更',
    content: `当サイトは、法令の変更やサービス内容の変更に伴い、本プライバシーポリシーを予告なく変更することがあります。変更後のポリシーは、当ページに掲載した時点から効力を生じるものとします。`,
  },
  {
    title: '8. お問い合わせ',
    content: `プライバシーポリシーに関するお問い合わせは、お問い合わせページよりご連絡ください。`,
    hasContact: true,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-700 to-primary-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            プライバシー
            <span className="block text-accent-500">ポリシー</span>
          </h1>
          <p className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto">
            AI Engineering Hub における個人情報・Cookie の取り扱いについて説明します。
          </p>
          <p className="text-sm text-gray-400">
            制定日：2025年1月1日　最終改定日：2026年5月18日
          </p>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-10">
            {sections.map((section, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-6 border border-gray-200"
              >
                <h2 className="text-xl font-bold text-primary-900 mb-4">
                  {section.title}
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
                {section.hasContact && (
                  <div className="mt-4">
                    <Link
                      href="/contact"
                      className="inline-flex items-center px-4 py-2 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors duration-200"
                    >
                      お問い合わせページへ
                      <ExternalLink className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Back Link */}
      <section className="py-8 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/"
            className="inline-flex items-center text-accent-500 hover:text-accent-600 font-medium transition-colors duration-200"
          >
            トップページに戻る
            <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
