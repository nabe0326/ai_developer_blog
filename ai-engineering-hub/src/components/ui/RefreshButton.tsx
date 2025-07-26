'use client';

import { RefreshCw } from 'lucide-react';

export default function RefreshButton() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <button
      onClick={handleRefresh}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
    >
      <RefreshCw className="w-4 h-4 mr-2" />
      再読み込み
    </button>
  );
}