import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const INQUIRY_TYPES: Record<string, string> = {
  question: '記事内容についての質問',
  correction: '記事の誤り・修正依頼',
  business: '掲載・取材依頼',
  other: 'その他',
};

export async function POST(request: NextRequest) {
  try {
    const { name, email, type, message } = await request.json();

    if (!name || !email || !type || !message) {
      return NextResponse.json({ error: '必須項目を入力してください' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'メールアドレスの形式が正しくありません' }, { status: 400 });
    }

    if (message.length > 1000) {
      return NextResponse.json({ error: 'お問い合わせ内容は1000文字以内で入力してください' }, { status: 400 });
    }

    const inquiryLabel = INQUIRY_TYPES[type] ?? type;

    await resend.emails.send({
      from: process.env.CONTACT_EMAIL_FROM ?? 'AI Engineering Hub <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL_TO ?? '',
      replyTo: email,
      subject: `[お問い合わせ] ${inquiryLabel} - ${name}様`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0f172a; border-bottom: 2px solid #f59e0b; padding-bottom: 8px;">
            新しいお問い合わせが届きました
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <th style="text-align: left; padding: 10px; background: #f8fafc; width: 140px; color: #64748b; font-size: 14px;">お名前</th>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${name}</td>
            </tr>
            <tr>
              <th style="text-align: left; padding: 10px; background: #f8fafc; color: #64748b; font-size: 14px;">メールアドレス</th>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${email}</td>
            </tr>
            <tr>
              <th style="text-align: left; padding: 10px; background: #f8fafc; color: #64748b; font-size: 14px;">お問い合わせ種別</th>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${inquiryLabel}</td>
            </tr>
          </table>
          <h3 style="color: #0f172a;">お問い合わせ内容</h3>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px; line-height: 1.7; white-space: pre-wrap;">
            ${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
          </div>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #e2e8f0;" />
          <p style="color: #94a3b8; font-size: 12px;">
            このメールは AI Engineering Hub のお問い合わせフォームから送信されました。<br>
            返信する場合は、このメールに直接返信してください（Reply-To: ${email}）。
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'メールの送信に失敗しました。しばらくしてから再度お試しください。' }, { status: 500 });
  }
}
