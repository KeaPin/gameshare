import { Suspense } from 'react';
import SearchClient from '@/components/SearchClient';
import { Metadata } from 'next';
import { ResourceModel } from '@/lib/models/ResourceModel';

export const metadata: Metadata = {
  title: '搜索游戏 - 找到你想要的游戏',
  description: '搜索和发现各种类型的游戏，包括安卓游戏、PC游戏、怀旧游戏等。',
  keywords: '游戏搜索,找游戏,游戏发现,游戏下载',
};

export default async function SearchPage({
  searchParams
}: {
  searchParams?: { q?: string; page?: string; limit?: string };
}) {
  const q = typeof searchParams?.q === 'string' ? searchParams.q : '';
  const page = Number(searchParams?.page ?? 1) || 1;
  const limit = Number(searchParams?.limit ?? 12) || 12;

  const result = await ResourceModel.getResources({
    search: q ? q : undefined,
    page,
    limit,
    sort: 'created_time',
    order: 'desc'
  });

  return (
    <div className="px-3 sm:px-4 py-4 sm:py-6">
      <div className="max-w-[1208px] mx-auto">
        <Suspense fallback={<div className="text-gray-400">加载中...</div>}>
          <SearchClient
            results={result.data}
            initialQuery={q}
            total={result.total}
            page={result.page}
            totalPages={result.totalPages}
            limit={result.limit}
          />
        </Suspense>
      </div>
    </div>
  );
}
