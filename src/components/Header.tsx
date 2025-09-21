"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import MobileNav from './MobileNav';

export default function Header() {
  const [query, setQuery] = useState("");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  // 在搜索页面时隐藏搜索栏
  const isSearchPage = pathname === '/search';

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/search');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <div className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur supports-[backdrop-filter]:bg-[#0a0a0a]/60">
        <div className="h-14 px-3 sm:px-4">
          <div className="max-w-[1440px] mx-auto h-14 grid grid-cols-3 items-center gap-2 sm:gap-4">
            {/* 左侧区域 - 汉堡菜单 */}
            <div className="flex items-center justify-start">
              <button
                onClick={() => setIsMobileNavOpen(true)}
                className="custom-size lg:hidden w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20 flex-shrink-0"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
              {/* Logo - 在搜索页面显示 */}
              <div className={`${isSearchPage ? 'ml-2' : 'lg:hidden ml-2'} flex-shrink-0`}>
              </div>
            </div>

            {/* 中间区域 - 搜索框居中 */}
            <div className="flex justify-center">
              {!isSearchPage && (
                <div className="w-full max-w-md">
                  <div className="relative">
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="搜索游戏..."
                      className="w-full h-8 sm:h-10 rounded-3xl bg-white/10 text-white placeholder-white/50 pl-8 pr-14 sm:pl-12 sm:pr-20 outline-none focus:ring-2 focus:ring-blue-400/50 text-sm sm:text-base border-0"
                    />
                    {/* 搜索图标 */}
                    <div className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 text-white/40">
                      <svg width="14" height="14" className="sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                      </svg>
                    </div>
                    {/* 搜索按钮 */}
                    <button 
                      onClick={handleSearch}
                      className="custom-size absolute right-0.5 sm:right-1.5 top-1/2 -translate-y-1/2 px-2 sm:px-4 h-6 sm:h-8 rounded-3xl bg-blue-400 text-black text-xs sm:text-sm font-medium hover:bg-blue-300 transition-colors flex-shrink-0"
                    >
                      搜索
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 右侧区域 - 按钮组 */}
            <div className="flex items-center justify-end gap-1 sm:gap-3">
              <div className="hidden sm:flex w-10 h-10 rounded-full bg-white/10 items-center justify-center text-white text-sm">
                Ai
              </div>
              <button className="custom-size w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-300 flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* 移动端导航 */}
      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
    </>
  );
}
