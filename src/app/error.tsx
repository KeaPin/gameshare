"use client";

import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Global app error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
          <div className="text-center px-4">
            <h2 className="text-2xl font-bold text-white mb-3">出错了</h2>
            <p className="text-gray-400 mb-6">我们已记录该问题，稍后再试或刷新页面。</p>
            <button
              onClick={() => reset()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              刷新
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}


