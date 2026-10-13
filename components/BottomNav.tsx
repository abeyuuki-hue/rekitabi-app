'use client';

import React from 'react';

export type NavTab = 'stamps' | 'map' | 'sanpai';

interface BottomNavProps {
  currentTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export default function BottomNav({ currentTab, onChangeTab }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-stone-200 z-[1000] py-1 shadow-lg max-w-md mx-auto">
      <div className="flex justify-around items-center">
        <button
          type="button"
          onClick={() => onChangeTab('stamps')}
          className={`flex flex-col items-center py-1.5 px-3 rounded-lg transition-colors ${
            currentTab === 'stamps'
              ? 'text-shrine-darkred font-bold'
              : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          <span className="text-xl">⛩️</span>
          <span className="text-[11px] mt-0.5">御朱印帳</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeTab('map')}
          className={`flex flex-col items-center py-1.5 px-3 rounded-lg transition-colors ${
            currentTab === 'map'
              ? 'text-shrine-darkred font-bold'
              : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          <span className="text-xl">🗺️</span>
          <span className="text-[11px] mt-0.5">参拝絵図</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeTab('sanpai')}
          className={`flex flex-col items-center py-1.5 px-3 rounded-lg transition-colors ${
            currentTab === 'sanpai'
              ? 'text-shrine-darkred font-bold'
              : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          <span className="text-xl">📜</span>
          <span className="text-[11px] mt-0.5">参拝手引き</span>
        </button>
      </div>
    </nav>
  );
}
