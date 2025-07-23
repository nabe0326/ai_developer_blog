import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const secret = request.nextUrl.searchParams.get('secret');

  // セキュリティチェック
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  try {
    // 記事が更新された場合
    if (body.type === 'edit' && body.api === 'articles') {
      const slug = body.contents?.new?.publishValue?.slug;
      if (slug) {
        revalidatePath(`/articles/${slug}`);
        revalidatePath('/'); // トップページも更新
        revalidatePath('/articles'); // 記事一覧も更新
      }
    }

    // カテゴリが更新された場合
    if (body.type === 'edit' && body.api === 'categories') {
      revalidateTag('categories');
      revalidatePath('/');
    }

    return NextResponse.json({ revalidated: true });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}