import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">404</h1>
        <h2 className="text-xl text-gray-400 mb-6">游戏未找到</h2>
        <p className="text-gray-500 mb-8">抱歉，您查找的游戏不存在。</p>
        <Link 
          href="/games"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors"
        >
          返回游戏列表
        </Link>
      </div>
    </div>
  );
}
