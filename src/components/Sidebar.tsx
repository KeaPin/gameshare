"use client";

import Link from 'next/link';

export default function Sidebar() {
  const navItems = [
    { name: '首页', href: '/', active: true },
    { name: '安卓游戏', href: '/discover', active: false },
    { name: 'PC游戏', href: '/ranking', active: false },
    { name: '怀旧游戏', href: '/cloud', active: false },
    { name: 'Swift游戏', href: '/feeds', active: false },
    { name: '游戏模拟器', href: '/feeds', active: false },
    { name: '游戏攻略', href: '/feeds', active: false },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-[232px] shrink-0 bg-[#0a0a0a] text-white/90 h-screen sticky top-0">
      <div className="px-6 pt-6 pb-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-3xl font-extrabold leading-none text-teal-300">TapTap</span>
        </Link>
      </div>

      <nav className="px-3 mt-2 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-4 h-11 rounded-xl transition-colors relative ${
              item.active ? 'bg-white/10 ring-1 ring-white/10 text-white' : 'hover:bg-white/5 text-white/80'
            }`}
          >
            {item.active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r bg-teal-300" />}
            <span className="inline-block w-5 h-5 rounded-full bg-white/20" />
            <span className="text-sm font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}


