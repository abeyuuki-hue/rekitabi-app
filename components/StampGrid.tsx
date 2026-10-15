'use client';

import React, { useState } from 'react';
import { ShrineSpot, RegionKey, REGION_OPTIONS, StampRallyCourse } from '@/types/spot';

interface StampGridProps {
  spots: ShrineSpot[];
  allSpots: ShrineSpot[];
  courses: StampRallyCourse[];
  selectedRegion: RegionKey;
  onRegionChange: (region: RegionKey) => void;
  selectedCourseId: string | null;
  onCourseChange: (courseId: string | null) => void;
  userStamps: Record<string, boolean>;
  onCheckIn: (spot: ShrineSpot) => void;
  onOpenDetail: (spot: ShrineSpot) => void;
}

export default function StampGrid({
  spots,
  allSpots,
  courses,
  selectedRegion,
  onRegionChange,
  selectedCourseId,
  onCourseChange,
  userStamps,
  onCheckIn,
  onOpenDetail,
}: StampGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCoursesPanel, setShowCoursesPanel] = useState(true);

  const selectedCourse = courses.find((c) => c.course_id === selectedCourseId) || null;

  // Filter spots by course (if selected) and search query
  const baseSpots = selectedCourse
    ? allSpots.filter((s) => selectedCourse.spot_ids.includes(s.id))
    : spots;

  const filteredSpots = baseSpots.filter((spot) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    const matchName = spot.name.toLowerCase().includes(q);
    const matchPref = spot.prefecture.toLowerCase().includes(q);
    const matchDeity = (spot.deity || '').toLowerCase().includes(q);
    const matchBlessings = (spot.blessings || []).some((b) => b.toLowerCase().includes(q));
    return matchName || matchPref || matchDeity || matchBlessings;
  });

  const stampedCount = baseSpots.filter((s) => userStamps[s.id]).length;
  const totalNationwideStamped = allSpots.filter((s) => userStamps[s.id]).length;

  return (
    <main className="max-w-md mx-auto p-4 space-y-3">
      {/* 全国総合進捗バナー */}
      <div className="bg-gradient-to-r from-shrine-darkred to-red-900 text-white rounded-xl p-3 shadow-md border border-shrine-gold/40">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-amber-200">🗾 全国パワースポット制覇状況</span>
          <span className="font-bold">
            <span className="text-base text-amber-300">{totalNationwideStamped}</span> / {allSpots.length || 53} 社寺
          </span>
        </div>
        <div className="w-full bg-black/30 h-2 rounded-full mt-1.5 overflow-hidden">
          <div
            className="bg-amber-400 h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, Math.round((totalNationwideStamped / Math.max(1, allSpots.length || 53)) * 100))}%`,
            }}
          />
        </div>
      </div>

      {/* 5大テーマ別スタンプラリーコース */}
      {courses.length > 0 && (
        <div className="bg-white rounded-xl border border-amber-900/15 shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => setShowCoursesPanel(!showCoursesPanel)}
            className="w-full px-3 py-2.5 bg-amber-50/70 flex justify-between items-center text-xs font-bold text-stone-800 border-b border-amber-900/10"
          >
            <span>🏆 5大テーマ別スタンプラリーコース（称号獲得）</span>
            <span className="text-[10px] text-shrine-darkred">{showCoursesPanel ? '▲ 閉じる' : '▼ コースを選ぶ'}</span>
          </button>

          {showCoursesPanel && (
            <div className="p-2.5 space-y-2">
              {selectedCourseId && (
                <button
                  type="button"
                  onClick={() => onCourseChange(null)}
                  className="w-full py-1 text-[11px] font-bold text-shrine-darkred bg-red-50 border border-shrine-darkred/30 rounded-lg"
                >
                  ✕ コース絞り込みを解除して地域一覧に戻る
                </button>
              )}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {courses.map((course) => {
                  const doneCount = course.spot_ids.filter((id) => userStamps[id]).length;
                  const isCompleted = doneCount >= course.spot_ids.length;
                  const isSelected = selectedCourseId === course.course_id;
                  return (
                    <button
                      key={course.course_id}
                      type="button"
                      onClick={() =>
                        onCourseChange(isSelected ? null : course.course_id)
                      }
                      className={`min-w-[210px] text-left p-2.5 rounded-lg border-2 transition-all shrink-0 ${
                        isSelected
                          ? 'border-shrine-darkred bg-red-50/40 shadow-sm'
                          : isCompleted
                          ? 'border-amber-500 bg-amber-50/40'
                          : 'border-stone-200 bg-stone-50/60 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex justify-between items-center gap-1">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-shrine-darkred/10 text-shrine-darkred">
                          {course.theme}
                        </span>
                        <span className="text-[10px] font-bold text-stone-600">
                          {doneCount}/{course.spot_ids.length}社
                        </span>
                      </div>
                      <div className="font-bold text-xs text-stone-800 mt-1 line-clamp-1">
                        {course.title}
                      </div>
                      <div className="text-[10px] text-stone-500 mt-0.5 line-clamp-1">
                        {course.spot_names.join('・')}
                      </div>
                      {isCompleted ? (
                        <div className="mt-1.5 px-2 py-0.5 bg-amber-400/20 border border-amber-500 rounded text-[10px] font-bold text-amber-900">
                          🏅 称号：{course.completion_reward.title}
                        </div>
                      ) : (
                        <div className="mt-1.5 text-[10px] text-stone-500">
                          🎁 報酬：{course.completion_reward.title}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 選択中コースの詳細バナー */}
      {selectedCourse && (
        <div className="bg-amber-50 border-2 border-shrine-darkred rounded-xl p-3 text-xs space-y-1 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="font-bold text-shrine-darkred">🎯 選択中：{selectedCourse.title}</span>
            <span className="font-bold text-stone-700">
              {stampedCount} / {selectedCourse.spot_ids.length} 社達成
            </span>
          </div>
          <p className="text-[11px] text-stone-600">{selectedCourse.description}</p>
          <p className="text-[10px] text-amber-900 font-bold">
            🏅 制覇称号：【{selectedCourse.completion_reward.title}】（{selectedCourse.completion_reward.digital_badge}）
          </p>
        </div>
      )}

      {/* 地域選択 ＆ キーワード検索 */}
      <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <label htmlFor="region-select" className="text-xs font-bold whitespace-nowrap text-stone-700">
            地域選択：
          </label>
          <select
            id="region-select"
            value={selectedRegion}
            onChange={(e) => {
              onCourseChange(null);
              onRegionChange(e.target.value as RegionKey);
            }}
            className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-xs font-bold text-stone-800 focus:outline-none focus:border-shrine-darkred"
          >
            {REGION_OPTIONS.map((r) => (
              <option key={r.key} value={r.key}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 社寺名・都道府県・ご利益（金運、縁結び等）で検索..."
            className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-shrine-darkred"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1.5 text-stone-400 hover:text-stone-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 表示中エリアの獲得スタンプ進捗 */}
      <div className="bg-white border border-amber-900/10 rounded-xl p-3 shadow-sm text-xs text-neutral-600 flex justify-between items-center">
        <span>
          {selectedCourse
            ? `コース内獲得スタンプ:`
            : `表示エリア獲得スタンプ (${REGION_OPTIONS.find((r) => r.key === selectedRegion)?.shortLabel || ''}):`}
        </span>
        <span className="font-bold">
          <span className="text-shrine-darkred text-base">{stampedCount}</span> / {baseSpots.length} 社
        </span>
      </div>

      {/* スタンプ台帳グリッド */}
      <div className="grid grid-cols-2 gap-3">
        {filteredSpots.map((spot) => {
          const isStamped = !!userStamps[spot.id];
          return (
            <div
              key={spot.id}
              className={`bg-white rounded-xl p-3 text-center border-2 transition-all flex flex-col justify-between ${
                isStamped ? 'border-shrine-darkred bg-orange-50/20 shadow-sm' : 'border-dashed border-stone-300'
              }`}
            >
              <div>
                <div className="flex justify-between items-center text-[10px] text-stone-500">
                  <span>📍 {spot.prefecture}</span>
                  {spot.type && (
                    <span className="px-1.5 py-0.2 bg-stone-100 rounded text-[9px] font-bold text-stone-600">
                      {spot.type}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-xs mt-1 line-clamp-1 text-stone-800" title={spot.name}>
                  {spot.name}
                </h3>
                {spot.blessings && spot.blessings.length > 0 && (
                  <p className="text-[9px] text-shrine-darkred/80 mt-0.5 line-clamp-1">
                    ✨ {spot.blessings.slice(0, 2).join('・')}
                  </p>
                )}
              </div>

              {/* 御朱印印影 */}
              <div
                onClick={() => onOpenDetail(spot)}
                className={`w-16 h-16 border-2 border-shrine-darkred rounded-full mx-auto my-2 flex flex-col items-center justify-center text-[9px] font-bold leading-tight cursor-pointer transition-transform ${
                  isStamped
                    ? 'opacity-100 text-shrine-darkred -rotate-6 scale-105 bg-red-50/40 shadow-inner'
                    : 'opacity-25 text-stone-400 hover:opacity-40'
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
                  type="button"
                  onClick={() => onCheckIn(spot)}
                  className={`w-full py-1.5 rounded text-xs font-bold text-white shadow-sm transition-colors ${
                    isStamped ? 'bg-stone-600 hover:bg-stone-700' : 'bg-shrine-darkred hover:bg-red-900'
                  }`}
                >
                  {isStamped ? '📜 由緒確認' : '📍 押印 (GPS)'}
                </button>
                <button
                  type="button"
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

      {filteredSpots.length === 0 && (
        <div className="text-center py-8 text-xs text-stone-500 bg-white rounded-xl border border-stone-200">
          条件に一致する社寺・パワースポットが見つかりませんでした。
        </div>
      )}
    </main>
  );
}
