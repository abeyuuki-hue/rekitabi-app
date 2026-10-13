'use client';

import React from 'react';
import { ShrineSpot, RegionKey } from '@/types/spot';

interface StampGridProps {
  spots: ShrineSpot[];
  selectedRegion: RegionKey;
  onRegionChange: (region: RegionKey) => void;
  userStamps: Record<string, boolean>;
  onCheckIn: (spot: ShrineSpot) => void;
  onOpenDetail: (spot: ShrineSpot) => void;
}

const REGIONS: { key: RegionKey; label: string }[] = [
  { key: 'kanto', label: '関東・千葉エリア' },
  { key: 'kansai', label: '関西エリア' },
];

export default function StampGrid({
  spots,
  selectedRegion,
  onRegionChange,
  userStamps,
  onCheckIn,
  onOpenDetail,
}: StampGridProps) {
  const stampedCount = spots.filter((s) => userStamps[s.id]).length;

  return (
    <main className="max-w-md mx-auto p-4">
      {/* 地域選択 */}
      <div className="flex items-center gap-2 mb-4 bg-white p-3 rounded-lg border border-stone-200 shadow-sm">
        <label htmlFor="region-select" className="text-xs font-bold whitespace-nowrap text-stone-700">
          地域選択：
        </label>
        <select
          id="region-select"
          value={selectedRegion}
          onChange={(e) => onRegionChange(e.target.value as RegionKey)}
          className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-xs font-bold text-stone-800 focus:outline-none focus:border-shrine-darkred"
        >
          {REGIONS.map((r) => (
            <option key={r.key} value={r.key}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {/* 獲得スタンプ進捗 */}
      <div className="bg-white border border-amber-900/10 rounded-xl p-3 mb-4 shadow-sm text-xs text-neutral-600 flex justify-between items-center">
        <span>獲得スタンプ数:</span>
        <span className="font-bold">
          <span className="text-shrine-darkred text-base">{stampedCount}</span> / {spots.length} 社
        </span>
      </div>

      {/* スタンプ台帳グリッド */}
      <div className="grid grid-cols-2 gap-3">
        {spots.map((spot) => {
          const isStamped = !!userStamps[spot.id];
          return (
            <div
              key={spot.id}
              className={`bg-white rounded-xl p-3 text-center border-2 transition-all ${
                isStamped ? 'border-shrine-darkred bg-orange-50/20' : 'border-dashed border-stone-300'
              }`}
            >
              <span className="text-[10px] text-stone-500">📍 {spot.prefecture}</span>
              <h3 className="font-bold text-xs mt-0.5 line-clamp-1 text-stone-800">{spot.name}</h3>

              {/* 御朱印印影 */}
              <div
                className={`w-16 h-16 border-2 border-shrine-darkred rounded-full mx-auto my-2 flex items-center justify-center text-[10px] font-bold leading-tight transition-transform ${
                  isStamped ? 'opacity-100 text-shrine-darkred -rotate-6 scale-105' : 'opacity-20 text-stone-400'
                }`}
              >
                {isStamped ? (
                  spot.stampName.split('\n').map((line, i) => <div key={i}>{line}</div>)
                ) : (
                  '未押印'
                )}
              </div>

              {/* アクションボタン */}
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => onCheckIn(spot)}
                  className={`w-full py-1.5 rounded text-xs font-bold text-white shadow-sm transition-colors ${
                    isStamped ? 'bg-stone-600 hover:bg-stone-700' : 'bg-shrine-darkred hover:bg-red-900'
                  }`}
                >
                  {isStamped ? '📜 由緒確認' : '📍 押印 (GPS)'}
                </button>
                <button
                  onClick={() => onOpenDetail(spot)}
                  className="w-full py-1 rounded text-[10px] font-bold text-stone-600 border border-stone-300 hover:bg-stone-50"
                >
                  詳細・参拝記録
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
