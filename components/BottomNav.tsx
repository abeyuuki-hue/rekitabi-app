'use client';

import React from 'react';

export type ActiveTab = 'stamp' | 'map' | 'journal' | 'guide';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export default function BottomNav({ activeTab, onSelectTab }: BottomNavProps) {
  const tabs: { key: ActiveTab; label: string; icon: string }[] = [
    { key: 'stamp', label: '御朱印帳', icon: '📜' },
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
            className={`flex flex-col items-center flex-1 py-1 text-xs font-bold transition-colors ${
              isActive ? 'text-shrine-darkred font-black' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <span className="text-lg mb-0.5">{tab.icon}</span>
            <span className="text-[11px]">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
