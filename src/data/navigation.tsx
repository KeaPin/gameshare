import React from 'react';

export interface NavItem {
  name: string;
  href: string;
  active: boolean;
  icon: string;
}

export const navItems: NavItem[] = [
  { name: '首页', href: '/', active: true, icon: 'home' },
  { name: '安卓游戏', href: '/games/android', active: false, icon: 'smartphone' },
  { name: 'PC游戏', href: '/games/pc', active: false, icon: 'monitor' },
  { name: '怀旧游戏', href: '/games/retro', active: false, icon: 'history' },
  { name: 'Swift游戏', href: '/games/switch', active: false, icon: 'zap' },
  { name: '游戏模拟器', href: '/games/simulator', active: false, icon: 'cpu' },
  { name: '游戏攻略', href: '/articles', active: false, icon: 'book' },
];

interface IconProps {
  width: string;
  height: string;
  viewBox: string;
  fill: string;
  stroke: string;
  strokeWidth: string;
  strokeLinecap: "round";
  strokeLinejoin: "round";
}

export const getNavIcon = (iconName: string, size: number = 18): React.ReactElement => {
  const iconProps: IconProps = {
    width: size.toString(),
    height: size.toString(),
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };

  switch (iconName) {
    case 'home':
      return (
        <svg {...iconProps}>
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
      );
    case 'smartphone':
      return (
        <svg {...iconProps}>
          <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
          <line x1="12" y1="18" x2="12.01" y2="18"/>
        </svg>
      );
    case 'monitor':
      return (
        <svg {...iconProps}>
          <rect width="20" height="14" x="2" y="3" rx="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      );
    case 'history':
      return (
        <svg width={size.toString()} height={size.toString()} viewBox="0 0 1024 1024" fill="currentColor" fillOpacity="0.9">
          <path d="M469.333333 170.666667a85.333333 85.333333 0 0 1 85.333334-85.333334h170.666666v85.333334h-170.666666v85.333333h384v597.333333H85.333333V256h384V170.666667zM170.666667 341.333333v426.666667h682.666666V341.333333H170.666667z m213.333333 85.333334v85.333333h85.333333v85.333333H384v85.333334H298.666667v-85.333334H213.333333v-85.333333h85.333334v-85.333333h85.333333z m256 0h85.461333v85.333333h85.333334v85.504h-85.333334v85.333333H640v-85.333333h-85.333333V512h85.333333v-85.333333z m0.170667 85.504V597.333333H725.333333v-85.162666h-85.162666z"/>
        </svg>
      );
    case 'zap':
      return (
        <svg width={size.toString()} height={size.toString()} viewBox="0 0 1024 1024" fill="currentColor">
          <path d="M512 128v768H324.267A196.267 196.267 0 0 1 128 699.733V324.267A196.267 196.267 0 0 1 324.267 128H512z m-85.333 85.333h-102.4a110.933 110.933 0 0 0-110.934 110.934v375.466a110.933 110.933 0 0 0 110.934 110.934h102.4V213.333zM320 426.667a64 64 0 1 1 0-128 64 64 0 0 1 0 128zM597.333 128h102.4A196.267 196.267 0 0 1 896 324.267v375.466A196.267 196.267 0 0 1 699.733 896h-102.4V128z m128 499.2a76.8 76.8 0 1 0 0-153.6 76.8 76.8 0 0 0 0 153.6z"/>
        </svg>
      );
    case 'cpu':
      return (
        <svg width={size.toString()} height={size.toString()} viewBox="0 0 1024 1024" fill="currentColor">
          <path d="M752.7936 102.4H271.2064A168.704 168.704 0 0 0 102.4 271.0528v481.8944A168.7552 168.7552 0 0 0 271.2064 921.6h481.5872A168.704 168.704 0 0 0 921.6 752.9472V271.0528A168.7552 168.7552 0 0 0 752.7936 102.4zM209.3056 313.1392c0-55.808 45.2608-101.0688 101.1712-101.0688h394.8544c55.808 0 101.1712 45.2096 101.1712 101.0688V490.496c0 55.808-45.312 101.12-101.1712 101.12H310.4768A101.12 101.12 0 0 1 209.3056 490.496V313.1392z m211.456 451.584c0 18.432-14.9504 33.3824-33.3824 33.3824h-38.2464v38.1952c0 18.432-14.9504 33.28-33.3824 33.28h-11.3664a33.3312 33.3312 0 0 1-33.3824-33.28v-38.1952h-38.2464a33.3824 33.3824 0 0 1-33.3824-33.3312v-11.4176c0-18.432 14.9504-33.28 33.3824-33.28h38.2464v-38.2464c0-18.432 14.9504-33.3312 33.3312-33.3312h11.4176c18.432 0 33.3824 14.8992 33.3824 33.28v38.2464h38.2464c18.432 0 33.3312 14.9504 33.3312 33.3824v11.3664z m171.6736 53.76a59.392 59.392 0 1 1 0-118.8352 59.392 59.392 0 0 1 0 118.784z m162.7648-59.392a59.392 59.392 0 1 1-0.0512-118.784 59.392 59.392 0 0 1 0 118.784z"/>
        </svg>
      );
    case 'book':
      return (
        <svg {...iconProps}>
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
        </svg>
      );
    default:
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10"/>
        </svg>
      );
  }
};
