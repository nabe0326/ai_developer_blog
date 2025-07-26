import { NextResponse } from 'next/server'
import { getArticlesByCategory, getCategory } from '@/lib/microcms'
import { generateCategoryRSSFeed } from '@/lib/feed'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params
    
    // カテゴリ情報を取得
    const categoryData = await getCategory(category)
    if (!categoryData) {
      return new NextResponse('Category not found', { status: 404 })
    }
    
    // カテゴリ別記事を取得
    const response = await getArticlesByCategory(categoryData.id, {
      limit: 50,
      orders: '-publishedAt',
      fields: 'id,title,slug,content,excerpt,category,tags,publishedAt,updatedAt,reading_time'
    })
    
    const feed = generateCategoryRSSFeed(response.contents, categoryData.name, category)
    
    return new NextResponse(feed, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
      }
    })
  } catch (error) {
    console.error('Category RSS feed generation error:', error)
    return new NextResponse('Category RSS feed generation failed', { status: 500 })
  }
}