import { NextResponse } from 'next/server'
import { getArticles } from '@/lib/microcms'
import { generateRSSFeed } from '@/lib/feed'

export async function GET() {
  try {
    const response = await getArticles({ 
      limit: 50,
      orders: '-publishedAt',
      fields: 'id,title,slug,content,excerpt,category,tags,publishedAt,updatedAt,reading_time'
    })
    
    const feed = generateRSSFeed(response.contents)
    
    return new NextResponse(feed, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
      }
    })
  } catch (error) {
    console.error('RSS feed generation error:', error)
    return new NextResponse('RSS feed generation failed', { status: 500 })
  }
}