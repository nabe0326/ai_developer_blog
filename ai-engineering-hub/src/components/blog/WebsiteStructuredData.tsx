export function WebsiteStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '実践AI技術ブログ',
    alternateName: 'AI技術ブログ',
    description: 'エンジニアと企業向けのAI技術情報。開発事例、ツール比較、導入ノウハウから最新トレンドまで実践的な情報を発信。',
    url: 'https://ai-developer-blog.vercel.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://ai-developer-blog.vercel.app/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: '実践AI技術ブログ',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ai-developer-blog.vercel.app/ogp-image.png',
        width: 1200,
        height: 630,
      },
      sameAs: [
        'https://github.com/nabe0326',
        'https://x.com/nabe_AI_dev',
      ],
    },
    inLanguage: 'ja-JP',
    copyrightYear: new Date().getFullYear(),
    about: [
      {
        '@type': 'Thing',
        name: 'AI技術',
        description: '人工知能技術の実践的応用',
      },
      {
        '@type': 'Thing',
        name: 'エンジニアリング',
        description: 'ソフトウェア開発とエンジニアリング技術',
      },
      {
        '@type': 'Thing',
        name: '企業導入',
        description: 'AI技術の企業での実装と導入事例',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}