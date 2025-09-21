import Link from 'next/link';

export default function ArticleNotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-6">
          <svg
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto text-gray-600"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10,9 9,9 8,9"/>
          </svg>
        </div>
        
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        
        <h2 className="text-xl font-semibold text-white mb-2">文章不存在</h2>
        
        <p className="text-gray-400 mb-6">
          抱歉，你要查找的文章可能已被删除或不存在。
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/articles"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            浏览文章
          </Link>
          
          <Link
            href="/"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
