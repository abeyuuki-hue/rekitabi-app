'use client';

import React, { useEffect, useState } from 'react';
import {
  DeformedDeityCharacter,
  FUJI_10_ANIMATION_STEPS,
  JAPAN_17_ZONES,
  JapanZone,
  SacredBookmark,
} from '@/lib/story_data';
import DeityAvatarSvg from './DeityAvatarSvg';

interface ZoneClearFujiModalProps {
  isOpen: boolean;
  onClose: () => void;
  clearedZone: JapanZone | null;
  allClearedZoneIds: string[];
  character: DeformedDeityCharacter;
  homeSpotName: string;
  awardedBookmark: SacredBookmark | null;
  awakeningLevel: number;
}

/**
 * ゾーンクリア達成時の「富士山頂・10項目アニメーション＆導きの栞（17葉）授与」イベントモーダル
 */
export default function ZoneClearFujiModal({
  isOpen,
  onClose,
  clearedZone,
  allClearedZoneIds,
  character,
  homeSpotName,
  awardedBookmark,
  awakeningLevel,
}: ZoneClearFujiModalProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0); // 0..9 (10項目)
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setCurrentStepIdx(0);
      setAutoPlay(true);
    }
  }, [isOpen, clearedZone?.zoneId, awardedBookmark?.id]);

  useEffect(() => {
    if (!isOpen || !autoPlay) return;
    if (currentStepIdx >= FUJI_10_ANIMATION_STEPS.length - 1) {
      setAutoPlay(false);
      return;
    }
    const timer = setTimeout(() => {
      setCurrentStepIdx((prev) => Math.min(FUJI_10_ANIMATION_STEPS.length - 1, prev + 1));
    }, 2400);
    return () => clearTimeout(timer);
  }, [isOpen, autoPlay, currentStepIdx]);

  if (!isOpen || !clearedZone || !awardedBookmark) return null;

  const currentStep = FUJI_10_ANIMATION_STEPS[currentStepIdx];
  const stepNum = currentStep.stepNumber; // 1..10
  const isAll17Cleared = allClearedZoneIds.length >= 17;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border-2 border-amber-400/70 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-amber-50 shadow-[0_0_60px_rgba(251,191,36,0.35)] overflow-hidden my-auto">
        {/* 上部ヘッダー */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-amber-500/20 via-yellow-400/20 to-amber-500/20 border-b border-amber-400/30">
          <div className="flex items-center gap-2">
            <span className="text-xl">🗻</span>
            <div>
              <p className="text-[11px] font-bold tracking-widest text-amber-300 uppercase">
                霊峰富士・神域結界解放イベント（全10項目アニメーション）
              </p>
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                {clearedZone.name}（{clearedZone.shortName}）達成！
                {isAll17Cleared && ' 🌟全国十七霊域・完全開顕🌟'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-white/10 hover:bg-white/20 px-3 py-1 text-xs font-bold text-amber-200 transition"
          >
            ✕ 閉じる
          </button>
        </div>

        {/* 10項目プログレスインジケーター */}
        <div className="px-5 pt-3 pb-2 bg-slate-950/60 border-b border-white/10">
          <div className="flex items-center justify-between text-[11px] text-amber-200/90 mb-1.5">
            <span className="font-bold">
              ✨ 神話演出ステップ：{stepNum} / 10 — 【{currentStep.phaseTitle}】
            </span>
            <button
              onClick={() => setAutoPlay((p) => !p)}
              className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-[10px] font-bold text-amber-200 hover:bg-amber-500/30"
            >
              {autoPlay ? '⏸ 自動再生中' : '▶ 自動再生再開'}
            </button>
          </div>
          <div className="grid grid-cols-10 gap-1">
            {FUJI_10_ANIMATION_STEPS.map((st, idx) => {
              const active = idx === currentStepIdx;
              const done = idx < currentStepIdx;
              return (
                <button
                  key={st.stepNumber}
                  onClick={() => {
                    setAutoPlay(false);
                    setCurrentStepIdx(idx);
                  }}
                  title={`${st.stepNumber}. ${st.phaseTitle}`}
                  className={`h-2 rounded-full transition-all ${
                    active
                      ? 'bg-amber-300 ring-2 ring-amber-400/80 scale-y-125'
                      : done
                      ? 'bg-amber-500/80'
                      : 'bg-slate-700'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* メインビジュアルステージ：富士山＆17ゾーン日本列島＆御祭神 */}
        <div className="relative px-4 py-4 sm:px-6 sm:py-5 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-700"
            style={{
              background:
                stepNum >= 5
                  ? 'radial-gradient(circle at 50% 38%, rgba(253,224,71,0.32) 0%, rgba(245,158,11,0.12) 48%, transparent 75%)'
                  : 'radial-gradient(circle at 50% 45%, rgba(56,189,248,0.16) 0%, transparent 70%)',
            }}
          />

          <div className="relative grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* 左：富士山頂に立つデフォルメ御祭神 */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center relative">
              <div className="relative flex flex-col items-center">
                <div
                  className={`transition-all duration-700 ${
                    stepNum >= 3 ? '-translate-y-1 scale-105' : 'opacity-90'
                  }`}
                >
                  <DeityAvatarSvg
                    character={character}
                    awakeningLevel={Math.max(awakeningLevel, stepNum >= 7 ? 5 : 3)}
                    size={126}
                    isOffering={stepNum >= 5 && stepNum <= 9}
                  />
                </div>

                {/* 霊峰・富士山のSVG */}
                <svg
                  viewBox="0 0 260 110"
                  className="w-56 h-24 -mt-6 drop-shadow-[0_4px_20px_rgba(251,191,36,0.4)]"
                >
                  <defs>
                    <linearGradient id="fujiBody" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="45%" stopColor="#1e3a8a" />
                      <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                  </defs>
                  {stepNum >= 4 && (
                    <ellipse
                      cx="130"
                      cy="18"
                      rx={stepNum >= 7 ? '115' : '75'}
                      ry="18"
                      fill="#fde047"
                      opacity="0.35"
                    />
                  )}
                  <path
                    d="M12,104 Q88,82 108,20 L152,20 Q172,82 248,104 Z"
                    fill="url(#fujiBody)"
                    stroke="#fbbf24"
                    strokeWidth="2"
                  />
                  <path
                    d="M108,20 L152,20 L164,48 L146,40 L130,52 L114,40 L96,48 Z"
                    fill="#ffffff"
                  />
                  <text
                    x="130"
                    y="94"
                    textAnchor="middle"
                    fill="#fde68a"
                    fontSize="10.5"
                    fontWeight="bold"
                  >
                    🗻 霊峰・富士山頂（本宮：{homeSpotName}）
                  </text>
                </svg>
              </div>
            </div>

            {/* 右：全国17ゾーン日本列島マップ＆やさしい光の抱擁演出 */}
            <div className="sm:col-span-7 bg-slate-900/80 border border-amber-400/30 rounded-2xl p-3 relative">
              <div className="flex items-center justify-between text-[11px] text-amber-200 mb-1">
                <span className="font-bold">🗾 日本列島 十七霊域・やさしい光の包摂図</span>
                <span className="text-amber-300 font-bold">
                  解放済：{allClearedZoneIds.length} / 17 霊域
                </span>
              </div>

              <svg viewBox="0 0 400 380" className="w-full h-52 sm:h-56 overflow-visible">
                <defs>
                  <radialGradient id="zoneClearedGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
                    <stop offset="55%" stopColor="#f59e0b" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* 日本列島シルエットライン */}
                <path
                  d="M300,32 L355,28 L360,78 L305,88 Z M280,102 L308,155 L292,235 L235,262 L185,268 L142,265 L108,268 L95,252 L145,232 L205,212 L252,162 Z M122,282 L162,282 L156,312 L118,312 Z M55,295 L102,295 L92,355 L52,348 Z"
                  fill="#1e293b"
                  stroke="#475569"
                  strokeWidth="1.5"
                />

                {/* 富士山（248, 248）から達成ゾーンへの黄金光ライン */}
                {stepNum >= 5 && (
                  <>
                    <line
                      x1={248}
                      y1={248}
                      x2={clearedZone.mapX}
                      y2={clearedZone.mapY}
                      stroke="#fde047"
                      strokeWidth="3.5"
                      strokeDasharray="5 3"
                    />
                    <circle
                      cx={clearedZone.mapX}
                      cy={clearedZone.mapY}
                      r={stepNum >= 8 ? clearedZone.mapRadius * 2.3 : clearedZone.mapRadius * 1.7}
                      fill="url(#zoneClearedGlow)"
                    />
                  </>
                )}

                {/* 全17ゾーンのノード描画 */}
                {JAPAN_17_ZONES.map((z) => {
                  const isCurrentCleared = z.zoneId === clearedZone.zoneId;
                  const isCleared = allClearedZoneIds.includes(z.zoneId) || isCurrentCleared;
                  return (
                    <g key={z.zoneId}>
                      <circle
                        cx={z.mapX}
                        cy={z.mapY}
                        r={isCurrentCleared ? z.mapRadius * 0.78 : z.mapRadius * 0.56}
                        fill={
                          isCurrentCleared
                            ? '#fef08a'
                            : isCleared
                            ? '#f59e0b'
                            : '#334155'
                        }
                        stroke={isCurrentCleared ? '#ffffff' : isCleared ? '#fde68a' : '#64748b'}
                        strokeWidth={isCurrentCleared ? 2.5 : 1.2}
                        opacity={isCleared ? 0.95 : 0.65}
                      />
                      <text
                        x={z.mapX}
                        y={z.mapY + 3.5}
                        textAnchor="middle"
                        fontSize={isCurrentCleared ? '9.5' : '7.5'}
                        fontWeight="bold"
                        fill={isCleared ? '#0f172a' : '#cbd5e1'}
                      >
                        {z.zoneNumber}
                      </text>
                    </g>
                  );
                })}

                {/* 富士山頂マーカー */}
                <circle cx={248} cy={248} r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                <text x={248} y={236} textAnchor="middle" fontSize="9" fill="#fef08a" fontWeight="bold">
                  🗻富士山頂
                </text>

                {/* ステップ9〜10：光が中央に集まり「1つの栞」へ結晶化する演出 */}
                {stepNum >= 9 && (
                  <g>
                    <line
                      x1={clearedZone.mapX}
                      y1={clearedZone.mapY}
                      x2={185}
                      y2={155}
                      stroke="#fef08a"
                      strokeWidth="4"
                    />
                    <rect
                      x="167"
                      y="123"
                      width="36"
                      height="64"
                      rx="6"
                      fill="#fbbf24"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                    />
                    <text x="185" y="160" textAnchor="middle" fontSize="18">
                      🔖
                    </text>
                  </g>
                )}
              </svg>

              <p className="text-[11px] text-center text-amber-200/90 mt-1">
                対象都道府県：{clearedZone.prefectures.join('・')}（{clearedZone.shortName}）
              </p>
            </div>
          </div>

          {/* 10項目アニメーションのナレーション＆御祭神セリフボックス */}
          <div className="mt-4 rounded-2xl bg-slate-950/85 border border-amber-400/50 p-4 shadow-inner">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold">
                第 {stepNum} 項 / 全10項
              </span>
              <span className="text-sm font-bold text-amber-300">{currentStep.phaseTitle}</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-2.5">
              {currentStep.caption}
            </p>

            {/* 御祭神の重要セリフ（「神には神の法則（すじみち）があるように…」＆一つの道） */}
            <div className="rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-500/20 border border-amber-300/50 p-3">
              <p className="text-[11px] font-bold text-amber-300 mb-1">
                🗣️ {character.charaName}（{character.originDeity}）のお言葉：
              </p>
              <p className="text-sm sm:text-base font-extrabold text-amber-100 leading-relaxed">
                {stepNum === 8
                  ? awardedBookmark.deityQuote
                  : '「神には神の法則（すじみち）があるように、人には人の法則（すじみち）があるようだな…」'}
              </p>
              {stepNum >= 6 && (
                <p className="mt-1.5 text-[11px] text-amber-300/90">
                  🌟 富士山頂からの導き：達成したゾーンの光がひとつに集まり、人として進む「ひとつの道」を記した栞へと結晶化していきます。
                </p>
              )}
            </div>
          </div>

          {/* 獲得した『古の導きの栞』（全十七葉）アイテムカード表示 */}
          <div
            className={`mt-4 rounded-2xl border-2 p-4 transition-all duration-500 ${
              stepNum >= 9
                ? 'border-amber-300 bg-gradient-to-r from-amber-950/90 via-yellow-900/60 to-amber-950/90 shadow-[0_0_30px_rgba(251,191,36,0.35)] scale-[1.01]'
                : 'border-amber-500/30 bg-slate-900/70'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔖</span>
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40">
                    {stepNum >= 9 ? '✨ ゾーンの光が結晶化・アイテム獲得！' : '🔮 結晶化中の導きの栞'}
                  </span>
                  <h4 className="text-base sm:text-lg font-extrabold text-amber-200 mt-0.5">
                    古の導きの栞 {awardedBookmark.kanjiNumber}『{awardedBookmark.title}』
                  </h4>
                  <p className="text-xs text-amber-300/90">— {awardedBookmark.subtitle} —</p>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm font-bold text-white bg-black/30 rounded-xl p-3 border border-white/10 leading-relaxed">
              {awardedBookmark.deityQuote}
            </p>
            <p className="text-[11px] text-amber-200/90 mt-2">
              💡 <strong>今日の一歩（日々の心がけ）：</strong> {awardedBookmark.practicalWisdom}
            </p>
          </div>
        </div>

        {/* 下部操作フッター */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 bg-slate-950/90 border-t border-amber-400/30">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setAutoPlay(false);
                setCurrentStepIdx((prev) => Math.max(0, prev - 1));
              }}
              disabled={currentStepIdx === 0}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-slate-200 transition"
            >
              ◀ 前の項
            </button>
            <button
              onClick={() => {
                setAutoPlay(false);
                setCurrentStepIdx((prev) =>
                  Math.min(FUJI_10_ANIMATION_STEPS.length - 1, prev + 1)
                );
              }}
              disabled={currentStepIdx >= FUJI_10_ANIMATION_STEPS.length - 1}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 disabled:opacity-40 text-xs font-bold text-amber-200 transition"
            >
              次の項へ ▶ ({stepNum}/10)
            </button>
            {currentStepIdx < FUJI_10_ANIMATION_STEPS.length - 1 && (
              <button
                onClick={() => {
                  setAutoPlay(false);
                  setCurrentStepIdx(FUJI_10_ANIMATION_STEPS.length - 1);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs text-amber-300 transition"
              >
                ⏩ 第10項（栞の結晶）へ
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg transition"
          >
            🔖 導きの栞を受け取って本宮へ戻る
          </button>
        </div>
      </div>
    </div>
  );
}
