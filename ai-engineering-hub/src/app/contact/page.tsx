'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Mail, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const INQUIRY_TYPES = [
  { value: 'question', label: '記事内容についての質問' },
  { value: 'correction', label: '記事の誤り・修正依頼' },
  { value: 'business', label: '掲載・取材依頼' },
  { value: 'other', label: 'その他' },
];

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, type, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error ?? '送信に失敗しました');
        setStatus('error');
        return;
      }

      setStatus('success');
    } catch {
      setErrorMessage('ネットワークエラーが発生しました。しばらくしてから再度お試しください。');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
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

      {/* Form */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          {status === 'success' ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-primary-900 mb-3">送信完了しました</h2>
              <p className="text-gray-600 mb-8">
                お問い合わせありがとうございます。<br />
                通常 3〜5 営業日以内にご返信いたします。
              </p>
              <button
                onClick={() => {
                  setStatus('idle');
                  setName('');
                  setEmail('');
                  setType('');
                  setMessage('');
                }}
                className="inline-flex items-center px-5 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                別のお問い合わせをする
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-primary-900 mb-1.5">
                  お名前 <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="山田 太郎"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-primary-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-primary-900 mb-1.5">
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="example@email.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-primary-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors"
                />
              </div>

              {/* Inquiry Type */}
              <div>
                <p className="block text-sm font-semibold text-primary-900 mb-2">
                  お問い合わせの種類 <span className="text-red-500">*</span>
                </p>
                <div className="space-y-2">
                  {INQUIRY_TYPES.map((item) => (
                    <label key={item.value} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="type"
                        value={item.value}
                        checked={type === item.value}
                        onChange={(e) => setType(e.target.value)}
                        required
                        className="w-4 h-4 text-accent-500 border-gray-300 focus:ring-accent-500"
                      />
                      <span className="text-gray-700 group-hover:text-primary-900 transition-colors">
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-primary-900 mb-1.5">
                  お問い合わせ内容 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={6}
                  maxLength={1000}
                  placeholder="詳しくお聞かせください"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-primary-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors resize-none"
                />
                <p className="text-right text-xs text-gray-400 mt-1">{message.length} / 1000</p>
              </div>

              {/* Error */}
              {status === 'error' && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{errorMessage}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    送信中...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    送信する
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                送信内容は<Link href="/privacy-policy" className="text-accent-500 hover:underline">プライバシーポリシー</Link>に基づき適切に管理します。
              </p>
            </form>
          )}

          {/* Notes */}
          <div className="mt-10 bg-blue-50 rounded-lg p-6 border border-blue-100">
            <h3 className="font-semibold text-primary-900 mb-3">ご連絡の前に</h3>
            <ul className="space-y-1.5 text-gray-600 text-sm">
              <li>・通常 3〜5 営業日以内にご返信いたします。</li>
              <li>・記事内容に関するご指摘は、できる限り迅速に対応します。</li>
              <li>・営業・スパムと判断した場合はご返信できかねます。</li>
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
