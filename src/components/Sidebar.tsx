"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems, getNavIcon } from '@/data/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  // 判断当前路径是否与菜单项匹配
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden lg:flex flex-col w-[232px] shrink-0 bg-[#0a0a0a] text-white/90 h-screen sticky top-0">
      <div className="px-6 pt-6 pb-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-3xl font-extrabold leading-none text-blue-600">探玩游戏</span>
        </Link>
      </div>

      <nav className="px-3 mt-2 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 h-11 rounded-xl transition-colors relative ${
                active ? 'bg-white/10 ring-1 ring-white/10 text-white' : 'hover:bg-white/5 text-white/80'
              }`}
            >
              {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r bg-blue-600" />}
              <span className="text-white/80">
                {getNavIcon(item.icon, 18)}
              </span>
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}


