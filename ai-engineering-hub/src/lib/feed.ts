import { Article } from '@/types/microcms'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-developer-blog.vercel.app'
const SITE_NAME = '実践AI技術ブログ'
const SITE_DESCRIPTION = 'エンジニアと企業向けの実践的なAI技術情報を発信するブログです。Dify、Claude、GPT、プロンプトエンジニアリングなどの最新AI技術について解説します。'

// 記事のHTMLコンテンツを生成（簡略版）
function generateHtmlContent(article: Article): string {
  return `
    <div>
      <p><strong>概要:</strong> ${article.excerpt}</p>
      <hr>
      ${article.content.replace(/```[\s\S]*?```/g, '<pre><code>$&</code></pre>')}
      <hr>
      <p><strong>カテゴリ:</strong> ${article.category?.name || 'その他'}</p>
      <p><strong>タグ:</strong> ${article.tags || 'なし'}</p>
      <p><strong>読了時間:</strong> ${article.reading_time}分</p>
      <p><a href="${SITE_URL}/articles/${article.slug}">記事を読む</a></p>
    </div>
  `.trim()
}

// RSS 2.0フィード生成
export function generateRSSFeed(articles: Article[]): string {
  const lastBuildDate = new Date().toUTCString()
  const pubDate = articles.length > 0 ? new Date(articles[0].publishedAt).toUTCString() : lastBuildDate

  const items = articles.map(article => {
    const articleUrl = `${SITE_URL}/articles/${article.slug}`
    const htmlContent = generateHtmlContent(article)
    
    return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <description><![CDATA[${article.excerpt}]]></description>
      <content:encoded><![CDATA[${htmlContent}]]></content:encoded>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <author>noreply@ai-developer-blog.vercel.app (実践AI技術ブログ)</author>
      <category><![CDATA[${article.category?.name || 'その他'}]]></category>
      ${article.tags ? article.tags.split(',').map(tag => `<category><![CDATA[${tag.trim()}]]></category>`).join('\n      ') : ''}
    </item>`
  }).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${SITE_NAME}]]></title>
    <description><![CDATA[${SITE_DESCRIPTION}]]></description>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <language>ja</language>
    <managingEditor>noreply@ai-developer-blog.vercel.app (実践AI技術ブログ)</managingEditor>
    <webMaster>noreply@ai-developer-blog.vercel.app (実践AI技術ブログ)</webMaster>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <pubDate>${pubDate}</pubDate>
    <generator>Next.js AI Engineering Hub</generator>
    <ttl>60</ttl>
    <image>
      <url>${SITE_URL}/ogp-image.png</url>
      <title><![CDATA[${SITE_NAME}]]></title>
      <link>${SITE_URL}</link>
      <width>144</width>
      <height>144</height>
    </image>
${items}
  </channel>
</rss>`
}

// Atom 1.0フィード生成
export function generateAtomFeed(articles: Article[]): string {
  const updated = articles.length > 0 ? new Date(articles[0].publishedAt).toISOString() : new Date().toISOString()
  
  const entries = articles.map(article => {
    const articleUrl = `${SITE_URL}/articles/${article.slug}`
    const htmlContent = generateHtmlContent(article)
    
    return `
  <entry>
    <title type="html"><![CDATA[${article.title}]]></title>
    <link href="${articleUrl}" rel="alternate" type="text/html"/>
    <id>${articleUrl}</id>
    <updated>${new Date(article.updatedAt).toISOString()}</updated>
    <published>${new Date(article.publishedAt).toISOString()}</published>
    <author>
      <name>実践AI技術ブログ</name>
      <email>noreply@ai-developer-blog.vercel.app</email>
    </author>
    <summary type="html"><![CDATA[${article.excerpt}]]></summary>
    <content type="html"><![CDATA[${htmlContent}]]></content>
    <category term="${article.category?.name || 'その他'}" label="${article.category?.name || 'その他'}"/>
    ${article.tags ? article.tags.split(',').map(tag => `<category term="${tag.trim()}" label="${tag.trim()}"/>`).join('\n    ') : ''}
  </entry>`
  }).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title type="text">${SITE_NAME}</title>
  <subtitle type="text">${SITE_DESCRIPTION}</subtitle>
  <link href="${SITE_URL}/atom.xml" rel="self" type="application/atom+xml"/>
  <link href="${SITE_URL}" rel="alternate" type="text/html"/>
  <id>${SITE_URL}/</id>
  <updated>${updated}</updated>
  <rights>© 2025 ${SITE_NAME}</rights>
  <generator uri="https://nextjs.org/" version="14">Next.js</generator>
  <author>
    <name>実践AI技術ブログ</name>
    <email>noreply@ai-developer-blog.vercel.app</email>
    <uri>${SITE_URL}</uri>
  </author>
  <icon>${SITE_URL}/favicon.ico</icon>
  <logo>${SITE_URL}/ogp-image.png</logo>
${entries}
</feed>`
}

// カテゴリ別RSSフィード生成
export function generateCategoryRSSFeed(articles: Article[], categoryName: string, categorySlug: string): string {
  const lastBuildDate = new Date().toUTCString()
  const pubDate = articles.length > 0 ? new Date(articles[0].publishedAt).toUTCString() : lastBuildDate

  const items = articles.map(article => {
    const articleUrl = `${SITE_URL}/articles/${article.slug}`
    const htmlContent = generateHtmlContent(article)
    
    return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <description><![CDATA[${article.excerpt}]]></description>
      <content:encoded><![CDATA[${htmlContent}]]></content:encoded>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <author>noreply@ai-developer-blog.vercel.app (実践AI技術ブログ)</author>
      <category><![CDATA[${categoryName}]]></category>
    </item>`
  }).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${SITE_NAME} - ${categoryName}]]></title>
    <description><![CDATA[${SITE_DESCRIPTION} - ${categoryName}カテゴリの記事]]></description>
    <link>${SITE_URL}/categories/${categorySlug}</link>
    <atom:link href="${SITE_URL}/categories/${categorySlug}/feed.xml" rel="self" type="application/rss+xml"/>
    <language>ja</language>
    <managingEditor>noreply@ai-developer-blog.vercel.app (実践AI技術ブログ)</managingEditor>
    <webMaster>noreply@ai-developer-blog.vercel.app (実践AI技術ブログ)</webMaster>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <pubDate>${pubDate}</pubDate>
    <generator>Next.js AI Engineering Hub</generator>
    <ttl>60</ttl>
    <image>
      <url>${SITE_URL}/ogp-image.png</url>
      <title><![CDATA[${SITE_NAME}]]></title>
      <link>${SITE_URL}</link>
      <width>144</width>
      <height>144</height>
    </image>
${items}
  </channel>
</rss>`
}