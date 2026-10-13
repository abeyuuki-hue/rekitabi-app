'use client';

import React from 'react';
import { ShrineSpot, RegionKey, RegionOption } from '@/types/spot';

interface StampGridProps {
  spots: ShrineSpot[];
  userStamps: Record<string, boolean>;
  selectedRegion: RegionKey;
  onSelectRegion: (region: RegionKey) => void;
  regions: RegionOption[];
  onCheckIn: (spot: ShrineSpot) => void;
  onShowDetail: (spot: ShrineSpot) => void;
}

export default function StampGrid({
  spots,
  userStamps,
  selectedRegion,
  onSelectRegion,
  regions,
  onCheckIn,
  onShowDetail,
}: StampGridProps) {
  const stampedCount = spots.filter((s) => userStamps[s.id]).length;
  const progressPercent = spots.length > 0 ? Math.round((stampedCount / spots.length) * 100) : 0;

  return (
    <main className="max-w-md mx-auto p-4 pb-24">
      {/* 地域選択 */}
      <div className="flex items-center gap-2 mb-4 bg-white p-3 rounded-lg border border-stone-200 shadow-sm">
        <label htmlFor="region-select" className="text-xs font-bold whitespace-nowrap text-stone-700">
          地域選択：
        </label>
        <select
          id="region-select"
          value={selectedRegion}
          onChange={(e) => onSelectRegion(e.target.value as RegionKey)}
          className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-xs font-bold text-stone-800 focus:outline-none focus:ring-1 focus:ring-shrine-darkred"
        >
          {regions.map((r) => (
            <option key={r.key} value={r.key}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {/* 参拝進捗バー */}
      <div className="bg-white border border-amber-900/10 rounded-xl p-3 mb-4 shadow-sm text-xs text-neutral-600">
        <div className="flex justify-between items-center mb-1.5">
          <span>
            獲得御朱印数: <span className="text-shrine-darkred font-bold text-sm">{stampedCount}</span> / {spots.length} 社
          </span>
          <span className="font-bold text-shrine-darkred">{progressPercent}% 達成</span>
        </div>
        <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200">
          <div
            className="bg-shrine-darkred h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* スタンプグリッド */}
      <div className="grid grid-cols-2 gap-3">
        {spots.map((spot) => {
          const isStamped = !!userStamps[spot.id];
          const stampLines = spot.stampName.split('\n');

          return (
            <div
              key={spot.id}
              className={`bg-white rounded-xl p-3 text-center border-2 transition-all flex flex-col justify-between ${
                isStamped
                  ? 'border-shrine-darkred bg-orange-50/20 shadow-sm'
                  : 'border-dashed border-stone-300 hover:border-stone-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[10px] text-stone-500 mb-1">
                  <span>📍 {spot.prefecture}</span>
                  {isStamped && (
                    <span className="bg-red-100 text-shrine-darkred px-1.5 py-0.5 rounded-full font-bold text-[9px]">
                      参拝済
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-xs mt-0.5 line-clamp-1 text-stone-800" title={spot.name}>
                  {spot.name}
                </h3>

                {/* 朱印印影 */}
                <div
                  className={`w-16 h-16 border-2 border-shrine-darkred rounded-full mx-auto my-2.5 flex flex-col items-center justify-center text-[10px] font-bold leading-tight transition-transform ${
                    isStamped
                      ? 'opacity-100 text-shrine-darkred -rotate-6 scale-105 shadow-inner bg-red-50/40 ring-1 ring-shrine-darkred/30'
                      : 'opacity-25 text-stone-400 bg-stone-50'
                  }`}
                  style={{ fontFamily: 'serif' }}
                >
                  {isStamped ? (
                    stampLines.map((line, i) => (
                      <div key={i} className="tracking-tighter">
                        {line}
                      </div>
                    ))
                  ) : (
                    <span className="text-[10px]">未押印</span>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 mt-2">
                <button
                  type="button"
                  onClick={() => (isStamped ? onShowDetail(spot) : onCheckIn(spot))}
                  className={`w-full py-1.5 rounded text-xs font-bold text-white shadow-sm transition-colors ${
                    isStamped
                      ? 'bg-stone-700 hover:bg-stone-800'
                      : 'bg-shrine-darkred hover:bg-red-900 active:scale-95'
                  }`}
                >
                  {isStamped ? '📜 由緒・参拝記録' : '📍 参拝押印 (GPS)'}
                </button>
                <button
                  type="button"
                  onClick={() => onShowDetail(spot)}
                  className="w-full py-1 text-[10px] text-stone-600 hover:text-stone-900 underline"
                >
                  詳細情報
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
