'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('記事取得エラー:', error);
  }, [error]);

  return (
    <div className="text-center py-16">
      <h2 className="text-2xl font-bold mb-4">エラーが発生しました</h2>
      <p className="text-gray-600 mb-6">記事の読み込みに失敗しました。</p>
      <button
        onClick={reset}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        再試行
      </button>
    </div>
  );
}