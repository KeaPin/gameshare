"use client";

import { useEffect } from 'react';

export default function GamesError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Error in /games route:', error);
  }, [error]);

  return (
    <div className="px-3 sm:px-4 py-10 text-center">
      <h2 className="text-2xl font-bold text-white mb-3">页面出现错误</h2>
      <p className="text-gray-400 mb-6">请稍后重试，或点击下方按钮刷新页面。</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
      >
        重新加载
      </button>
    </div>
  );
}


