"use client";

import { useState } from 'react';
import Link from 'next/link';
import MobileNav from './MobileNav';

export default function Header() {
  const [query, setQuery] = useState("");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur supports-[backdrop-filter]:bg-[#0a0a0a]/60">
        <div className="h-14 px-3 sm:px-4">
          <div className="max-w-[1440px] mx-auto h-14 flex items-center justify-between gap-2 sm:gap-4">
            {/* 汉堡菜单按钮 - 仅在移动端显示 */}
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="custom-size lg:hidden w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20 flex-shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 3h12v1H2V3zM2 7h12v1H2V7zM2 11h12v1H2v-1z"/>
              </svg>
            </button>

            {/* Logo - 仅在移动端显示 */}
            <Link href="/" className="lg:hidden flex-shrink-0">
              <span className="text-lg font-extrabold leading-none text-teal-300">TapTap</span>
            </Link>

            {/* 搜索框 */}
            <div className="w-160 min-w-0">
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="搜索游戏..."
                  className="w-full h-8 sm:h-10 rounded-3xl bg-white/10 text-white placeholder-white/50 pl-8 pr-14 sm:pl-12 sm:pr-20 outline-none focus:ring-2 focus:ring-teal-400/50 text-sm sm:text-base border-0"
                />
                {/* 搜索图标 */}
                <div className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 text-white/40">
                  <svg width="14" height="14" className="sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 20l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </svg>
                </div>
                {/* 搜索按钮 */}
                <button className="custom-size absolute right-0.5 sm:right-1.5 top-1/2 -translate-y-1/2 px-2 sm:px-4 h-6 sm:h-8 rounded-3xl bg-teal-400 text-black text-xs sm:text-sm font-medium hover:bg-teal-300 transition-colors flex-shrink-0">
                  搜索
                </button>
              </div>
            </div>

            {/* 右侧按钮组 */}
            <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
              <div className="hidden sm:flex w-10 h-10 rounded-full bg-white/10 items-center justify-center text-white text-sm">
                Ai
              </div>
              <button className="custom-size w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-teal-300 flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* 移动端导航 */}
      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
    </>
  );
}
