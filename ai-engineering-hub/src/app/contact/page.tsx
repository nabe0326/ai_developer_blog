import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Mail, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description: 'AI Engineering Hub へのお問い合わせはこちらから。記事内容のご質問、掲載依頼、その他のお問い合わせを受け付けています。',
  robots: { index: true, follow: true },
};

// Google Forms の埋め込みURLをここに設定
// Google Forms を作成後、「送信」→「<>」タブの src= に記載された URL を貼り付けてください
// 例: https://docs.google.com/forms/d/e/XXXXXXXXXX/viewform?embedded=true
const GOOGLE_FORM_EMBED_URL = process.env.NEXT_PUBLIC_GOOGLE_FORM_EMBED_URL || '';

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-700 to-primary-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-500/20 rounded-full mb-6">
            <Mail className="w-8 h-8 text-accent-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            お問い合わせ
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            記事内容のご質問、掲載依頼、ご意見・ご感想など、お気軽にご連絡ください。
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          {GOOGLE_FORM_EMBED_URL ? (
            <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              <iframe
                src={GOOGLE_FORM_EMBED_URL}
                width="100%"
                height="1100"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
                title="お問い合わせフォーム"
                className="block"
              >
                読み込んでいます…
              </iframe>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-500/10 rounded-full mb-6">
                <ExternalLink className="w-8 h-8 text-accent-500" />
              </div>
              <h2 className="text-xl font-bold text-primary-900 mb-3">
                フォームを準備中です
              </h2>
              <p className="text-gray-600 mb-6">
                現在お問い合わせフォームを準備中です。<br />
                お急ぎの場合は、SNS よりご連絡ください。
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://github.com/nabe0326"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-5 py-2.5 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors duration-200"
                >
                  GitHub
                  <ExternalLink className="ml-2 w-4 h-4" />
                </a>
                <a
                  href="https://x.com/nabe_AI_dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-5 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  X (Twitter)
                  <ExternalLink className="ml-2 w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-100">
            <h3 className="font-semibold text-primary-900 mb-3">ご連絡の前に</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>・ご回答まで数日かかる場合があります。あらかじめご了承ください。</li>
              <li>・記事内容に関するご指摘は、できる限り迅速に対応します。</li>
              <li>・営業・スパムと判断した場合はご返信できかねます。</li>
              <li>・お問い合わせ内容は<Link href="/privacy-policy" className="text-accent-500 hover:underline">プライバシーポリシー</Link>に基づき適切に管理します。</li>
            </ul>
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
