'use client';

import React from 'react';

export type ActiveTab = 'stamp' | 'home' | 'map' | 'journal' | 'guide';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  unofferedShinryoku?: number;
}

export default function BottomNav({
  activeTab,
  onSelectTab,
  unofferedShinryoku = 0,
}: BottomNavProps) {
  const tabs: { key: ActiveTab; label: string; icon: string; badge?: string }[] = [
    { key: 'stamp', label: '御朱印帳', icon: '📜' },
    {
      key: 'home',
      label: '本宮・神力',
      icon: '🏮',
      badge: unofferedShinryoku > 0 ? `+${unofferedShinryoku}` : undefined,
    },
    { key: 'map', label: '古今絵図', icon: '🗺️' },
    { key: 'journal', label: '参拝の記録', icon: '📔' },
    { key: 'guide', label: '由緒・作法', icon: '⛩️' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-sm border-t border-stone-200 flex justify-around py-1.5 z-50 shadow-lg">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onSelectTab(tab.key)}
            className={`relative flex flex-col items-center flex-1 py-1 text-xs font-bold transition-colors ${
              isActive ? 'text-shrine-darkred font-black' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <span className="text-lg mb-0.5 relative">
              {tab.icon}
              {tab.badge && (
                <span className="absolute -top-1.5 -right-5 px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[9px] font-extrabold shadow animate-pulse">
                  {tab.badge}
                </span>
              )}
            </span>
            <span className="text-[11px]">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

