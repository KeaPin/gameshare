"use client";

import { useState } from 'react';
import Link from 'next/link';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const navItems = [
    { name: '首页', href: '/', active: true },
    { name: '游戏分类', href: '/discover', active: false },
    { name: '排行榜', href: '/ranking', active: false },
    { name: '系列游戏', href: '/cloud', active: false },
    { name: '游戏攻略', href: '/feeds', active: false },
    { name: '游戏预告', href: '/feeds', active: false },
  ];

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* 侧滑菜单 */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-[#0a0a0a] text-white z-50 lg:hidden transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* 头部 */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <Link href="/" className="flex items-center gap-2" onClick={onClose}>
              <span className="text-2xl font-extrabold leading-none text-teal-300">TapTap</span>
            </Link>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/80 hover:bg-white/20"
            >
              ✕
            </button>
          </div>

          {/* 导航菜单 */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {navItems.map(item => (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 h-12 rounded-xl transition-colors relative ${
                  item.active ? 'bg-white/10 ring-1 ring-white/10 text-white' : 'hover:bg-white/5 text-white/80'
                }`}
              >
                {item.active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r bg-teal-300" />}
                <span className="inline-block w-5 h-5 rounded-full bg-white/20" />
                <span className="text-base font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* 底部信息 */}
          <div className="px-6 py-4 border-t border-white/10">
            <div className="text-sm text-white/60">
              GameShare - 游戏资源分享平台
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
