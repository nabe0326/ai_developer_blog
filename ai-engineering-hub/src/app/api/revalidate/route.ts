import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const secret = request.nextUrl.searchParams.get('secret');

  // セキュリティチェック
  if (!process.env.REVALIDATE_SECRET) {
    console.warn('REVALIDATE_SECRET not set, skipping security check');
  } else if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  try {
    console.log('Revalidation webhook received:', JSON.stringify(body, null, 2));

    // 記事が作成または更新された場合
    if ((body.type === 'create' || body.type === 'edit') && body.api === 'articles') {
      const slug = body.contents?.new?.publishValue?.slug || body.contents?.slug;
      
      console.log(`Revalidating article: ${slug}`);
      
      if (slug) {
        revalidatePath(`/articles/${slug}`);
      }
      
      // 常にトップページと記事一覧を更新
      revalidatePath('/');
      revalidatePath('/articles');
      revalidatePath('/sitemap.xml');
      
      console.log('Article revalidation completed');
    }

    // 記事が削除された場合
    if (body.type === 'delete' && body.api === 'articles') {
      console.log('Article deleted, revalidating lists');
      revalidatePath('/');
      revalidatePath('/articles');
      revalidatePath('/sitemap.xml');
    }

    // カテゴリが更新された場合
    if ((body.type === 'create' || body.type === 'edit' || body.type === 'delete') && body.api === 'categories') {
      console.log('Category updated, revalidating categories');
      revalidateTag('categories');
      revalidatePath('/');
    }

    return NextResponse.json({ 
      revalidated: true, 
      timestamp: new Date().toISOString(),
      event: body.type,
      api: body.api 
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}