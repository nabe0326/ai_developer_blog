import { NextResponse } from 'next/server'
import { getArticles } from '@/lib/microcms'
import { generateAtomFeed } from '@/lib/feed'

export async function GET() {
  try {
    const response = await getArticles({ 
      limit: 50,
      orders: '-publishedAt',
      fields: 'id,title,slug,content,excerpt,category,tags,publishedAt,updatedAt,reading_time'
    })
    
    const feed = generateAtomFeed(response.contents)
    
    return new NextResponse(feed, {
      status: 200,
      headers: {
        'Content-Type': 'application/atom+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
      }
    })
  } catch (error) {
    console.error('Atom feed generation error:', error)
    return new NextResponse('Atom feed generation failed', { status: 500 })
  }
}