'use client';

import React, { useMemo, useState } from 'react';
import { ShrineSpot } from '@/types/spot';
import {
  DEFAULT_HOME_SPOT_ID,
  JAPAN_17_ZONES,
  JapanZone,
  SACRED_BOOKMARKS_17,
  SHINRYOKU_REWARDS,
  STORY_SCENARIOS,
  getAwakeningStage,
  getDeityCharacterForSpot,
  getZoneForPrefecture,
} from '@/lib/story_data';
import DeityAvatarSvg, {
  downloadRewardArtCardPng,
  getRewardMotifEmoji,
  getVisualStyleEmoji,
} from './DeityAvatarSvg';

interface HomeShrineViewProps {
  spots: ShrineSpot[];
  stampedIds: string[];
  homeSpotId: string;
  onSelectHomeSpot: (spotId: string) => void;
  unofferedShinryoku: number;
  offeredShinryoku: number;
  onOfferShinryoku: () => void;
  clearedZoneIds: string[];
  unlockedBookmarkIds: string[];
  onReplayZoneClearModal: (zone: JapanZone) => void;
  selectedScenarioId: string;
  onSelectScenarioId: (scenarioId: string) => void;
  goshuinPhotos: Record<string, string>;
  onOpenSpotDetail: (spot: ShrineSpot) => void;
  testMode: boolean;
  onTestClearNextZone: () => void;
  onTestAddShinryoku: (amount: number) => void;
}

export default function HomeShrineView({
  spots,
  stampedIds,
  homeSpotId,
  onSelectHomeSpot,
  unofferedShinryoku,
  offeredShinryoku,
  onOfferShinryoku,
  clearedZoneIds,
  unlockedBookmarkIds,
  onReplayZoneClearModal,
  selectedScenarioId,
  onSelectScenarioId,
  goshuinPhotos,
  onOpenSpotDetail,
  testMode,
  onTestClearNextZone,
  onTestAddShinryoku,
}: HomeShrineViewProps) {
  const [isOfferingAnim, setIsOfferingAnim] = useState(false);
  const [offeringMessage, setOfferingMessage] = useState<string | null>(null);
  const [lastOfferedAmount, setLastOfferedAmount] = useState<number>(0);
  const [showHomePicker, setShowHomePicker] = useState(false);
  const [homeSearchQuery, setHomeSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<
    'altar' | 'zones' | 'bookmarks' | 'rewards' | 'scenarios' | 'photos'
  >('altar');

  // ホーム神社（未設定や存在しない場合はデフォルト「船橋大神宮（funabashi）」）
  const homeSpot = useMemo(() => {
    return (
      spots.find((s) => s.id === homeSpotId) ||
      spots.find((s) => s.id === DEFAULT_HOME_SPOT_ID) ||
      spots[0] ||
      null
    );
  }, [spots, homeSpotId]);

  // ホーム神社固有のデフォルメ御祭神キャラ
  const character = useMemo(() => getDeityCharacterForSpot(homeSpot), [homeSpot]);

  // 現在の神力覚醒ステージ
  const awakening = useMemo(() => getAwakeningStage(offeredShinryoku), [offeredShinryoku]);

  // 選択中のストーリーシナリオ
  const currentScenario = useMemo(
    () => STORY_SCENARIOS.find((s) => s.id === selectedScenarioId) || STORY_SCENARIOS[0],
    [selectedScenarioId]
  );

  // 各ゾーンの達成状況集計
  const zoneStats = useMemo(() => {
    return JAPAN_17_ZONES.map((zone) => {
      const zoneSpots = spots.filter((sp) => {
        const z = getZoneForPrefecture(sp.prefecture || '');
        return z?.zoneId === zone.zoneId;
      });
      const stampedCount = zoneSpots.filter((sp) => stampedIds.includes(sp.id)).length;
      const isCleared =
        clearedZoneIds.includes(zone.zoneId) ||
        (zoneSpots.length > 0 && stampedCount >= zoneSpots.length);
      return {
        zone,
        totalSpots: zoneSpots.length,
        stampedCount,
        isCleared,
      };
    });
  }, [spots, stampedIds, clearedZoneIds]);

  // 神力をホームに持ち帰り献上するアニメーション実行
  const handleTriggerOffering = () => {
    if (unofferedShinryoku <= 0 || isOfferingAnim) return;
    const amount = unofferedShinryoku;
    setLastOfferedAmount(amount);
    setIsOfferingAnim(true);
    setOfferingMessage(
      `✨ 旅先で集めた【 +${amount.toLocaleString()} 神力 】が黄金の霊珠となって${homeSpot?.name || '船橋大神宮'}の本殿へ舞い上がります…！`
    );

    setTimeout(() => {
      onOfferShinryoku();
      setOfferingMessage(
        `🌟 奉納完了！${character.charaName}が神力を取り戻し、本宮の神威がさらに高まりました！`
      );
    }, 1500);

    setTimeout(() => {
      setIsOfferingAnim(false);
    }, 3200);
  };

  // ホーム変更用フィルター
  const filteredSpotsForPicker = useMemo(() => {
    const q = homeSearchQuery.trim().toLowerCase();
    if (!q) return spots;
    return spots.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.prefecture || '').toLowerCase().includes(q) ||
        (s.region || '').toLowerCase().includes(q)
    );
  }, [spots, homeSearchQuery]);

  const savedPhotoEntries = useMemo(() => {
    return Object.entries(goshuinPhotos)
      .map(([spotId, dataUrl]) => {
        const sp = spots.find((s) => s.id === spotId);
        return sp ? { spot: sp, dataUrl } : null;
      })
      .filter((x): x is { spot: ShrineSpot; dataUrl: string } => x !== null);
  }, [goshuinPhotos, spots]);

  const styleEmoji = getVisualStyleEmoji(character.visualStyle);
  const currentQuote =
    character.awakeningQuotes[Math.min(4, Math.max(0, awakening.level - 1))] ||
    character.catchphrase;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-5 pt-3 pb-28 space-y-4">
      {/* 上部：本宮（ホームスポット）＆神力ステータスヘッダー */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-amber-950 text-white p-4 sm:p-6 shadow-xl border border-amber-400/40">
        {/* 献上アニメーション中の飛翔する黄金光珠オーバーレイ */}
        {isOfferingAnim && (
          <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
            {[...Array(14)].map((_, i) => (
              <span
                key={i}
                className="absolute inline-block w-4 h-4 rounded-full bg-yellow-300 shadow-[0_0_20px_#fde047] animate-bounce"
                style={{
                  left: `${12 + ((i * 7) % 76)}%`,
                  top: `${15 + ((i * 11) % 65)}%`,
                  animationDuration: `${0.55 + (i % 4) * 0.18}s`,
                }}
              />
            ))}
            <div className="absolute inset-0 bg-amber-400/20 animate-pulse" />
          </div>
        )}

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-3.5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold">
                🏠 本宮（ホーム神社）
              </span>
              {(!homeSpot || homeSpot.id === DEFAULT_HOME_SPOT_ID) && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-300/40 text-[11px] text-amber-200 font-bold">
                  デフォルト本宮（船橋大神宮）
                </span>
              )}
              <span className="text-xs text-amber-200/90">
                📍 {homeSpot?.prefecture || '千葉県'} / {homeSpot?.region || '関東'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-amber-100 mt-1 flex items-center gap-2">
              <span>⛩️ {homeSpot?.name || '船橋大神宮（意富比神社）'}</span>
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={() => setShowHomePicker(true)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-amber-300/40 text-xs font-bold text-amber-200 transition"
            >
              🔄 ホーム社寺を変更
            </button>
            {homeSpot && (
              <button
                onClick={() => onOpenSpotDetail(homeSpot)}
                className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-xs font-bold text-amber-100 transition"
              >
                📖 社寺詳細
              </button>
            )}
          </div>
        </div>

        {/* デフォルメ御祭神キャラ＆神力献上ステージ */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5 pt-4 items-center">
          {/* 左：デフォルメ御祭神キャラ */}
          <div className="md:col-span-5 flex flex-col items-center text-center bg-slate-950/50 rounded-2xl p-4 border border-amber-400/30">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 text-xs font-extrabold">
                覚醒 Lv.{awakening.level}：{awakening.stageName}
              </span>
            </div>

            <div className="my-1">
              <DeityAvatarSvg
                character={character}
                awakeningLevel={awakening.level}
                size={148}
                isOffering={isOfferingAnim}
              />
            </div>

            <h3 className="text-base font-extrabold text-amber-200 mt-1">
              {styleEmoji} {character.charaName}
            </h3>
            <p className="text-xs text-amber-100/90 font-bold mt-0.5">
              【御祭神・縁神】{character.originDeity}
            </p>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              神具：{character.companionItem}
            </p>
          </div>

          {/* 右：神力ゲージ＆持ち帰り献上アクション */}
          <div className="md:col-span-7 space-y-3">
            {/* 御祭神の吹き出しセリフ */}
            <div className="rounded-2xl bg-white/10 border border-amber-300/40 p-3.5 shadow-inner">
              <p className="text-[11px] font-bold text-amber-300 mb-1">
                💬 守護神からのメッセージ（{currentScenario.badge}）：
              </p>
              <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                {isOfferingAnim
                  ? `「おおっ…！全国で結んだ尊い御朱印の神力が、私の胸に温かく満ちてゆきます…！（+${lastOfferedAmount.toLocaleString()} 神力）」`
                  : currentQuote}
              </p>
            </div>

            {/* 神力カウンター（未献上 ⇄ 本宮蓄積） */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-950/70 border border-amber-400/40 p-3">
                <p className="text-[11px] text-amber-200/80 font-bold">
                  👜 旅先で集めた未献上の神力
                </p>
                <p className="text-xl sm:text-2xl font-extrabold text-yellow-300 mt-0.5">
                  {unofferedShinryoku.toLocaleString()}{' '}
                  <span className="text-xs font-normal text-amber-200">神力</span>
                </p>
                <p className="text-[10px] text-slate-300 mt-0.5">
                  ※御朱印1拝受につき+100神力（実物撮影で+50）
                </p>
              </div>

              <div className="rounded-2xl bg-slate-950/70 border border-amber-400/40 p-3">
                <p className="text-[11px] text-amber-200/80 font-bold">
                  ⛩️ 本宮に貯蔵された累計神力
                </p>
                <p className="text-xl sm:text-2xl font-extrabold text-amber-400 mt-0.5">
                  {offeredShinryoku.toLocaleString()}{' '}
                  <span className="text-xs font-normal text-amber-200">神力</span>
                </p>
                <p className="text-[10px] text-slate-300 mt-0.5">
                  {offeredShinryoku < awakening.nextThreshold
                    ? `次の形態まで残り ${(awakening.nextThreshold - offeredShinryoku).toLocaleString()} 神力`
                    : '🌟 最高覚醒「富士開闢・幸魂」到達済！'}
                </p>
              </div>
            </div>

            {/* 覚醒ゲージ */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-amber-200">
                <span>🔥 御祭神の神力回復ゲージ（{awakening.stageName}）</span>
                <span className="font-bold">{awakening.progressPercent}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-amber-400/30">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-200 transition-all duration-700"
                  style={{ width: `${awakening.progressPercent}%` }}
                />
              </div>
            </div>

            {/* 神力をホームに持ち帰り献上するボタン */}
            <div className="pt-1">
              <button
                onClick={handleTriggerOffering}
                disabled={unofferedShinryoku <= 0 || isOfferingAnim}
                className={`w-full py-3 px-4 rounded-2xl font-extrabold text-sm sm:text-base shadow-lg transition flex items-center justify-center gap-2 ${
                  unofferedShinryoku > 0
                    ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 hover:brightness-105 animate-pulse'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                }`}
              >
                <span>🙏</span>
                <span>
                  {isOfferingAnim
                    ? '✨ 本宮へ神力を献上中…！'
                    : unofferedShinryoku > 0
                    ? `神力をホーム（${homeSpot?.name || '船橋大神宮'}）に持ち帰り献上する（+${unofferedShinryoku.toLocaleString()}）`
                    : '御朱印を集めるとここへ神力を持ち帰り献上できます'}
                </span>
              </button>

              {offeringMessage && (
                <div className="mt-2 rounded-xl bg-amber-400/20 border border-amber-300/60 px-3 py-2 text-xs font-bold text-amber-100">
                  {offeringMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* テストモード専用ショートカットバー（一括獲得・神力追加・富士イベント即体験） */}
      {testMode && (
        <div className="rounded-2xl bg-amber-50 border-2 border-amber-400 p-3.5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-extrabold text-amber-900">
              🧪 テストモード専用・神力＆ゾーンクリア即時検証パネル
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onTestAddShinryoku(500)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition"
              >
                ✨ 未献上神力 +500
              </button>
              <button
                onClick={onTestClearNextZone}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition"
              >
                🗻 次の未達成ゾーンを一括達成（富士10項アニメ＆栞ゲット）
              </button>
            </div>
          </div>
        </div>
      )}

      {/* サブナビゲーションタブ */}
      <div className="flex overflow-x-auto gap-1.5 pb-1">
        {[
          { id: 'altar', label: '⛩️ 本宮・物語概要' },
          { id: 'zones', label: `🗾 全国17霊域 (${clearedZoneIds.length}/17)` },
          { id: 'bookmarks', label: `🔖 導きの栞 (${unlockedBookmarkIds.length}/17)` },
          { id: 'rewards', label: '🖼️ 神力特典画像 (8種)' },
          { id: 'scenarios', label: '📜 シナリオ3候補切替' },
          { id: 'photos', label: `📷 実物御朱印帳 (${savedPhotoEntries.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition ${
              activeSubTab === tab.id
                ? 'bg-amber-600 text-white shadow'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-amber-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* タブ①：本宮・物語概要 */}
      {activeSubTab === 'altar' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-white border border-amber-200 p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold">
                📖 現在進行中の物語：{currentScenario.badge}
              </span>
              <button
                onClick={() => setActiveSubTab('scenarios')}
                className="text-xs font-bold text-amber-700 hover:underline"
              >
                別のシナリオ候補（全3種）を見る ▶
              </button>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              {currentScenario.title}
              <span className="block text-xs font-normal text-slate-500 mt-0.5">
                {currentScenario.subtitle}
              </span>
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed bg-amber-50/60 p-3.5 rounded-xl border border-amber-100">
              <p>
                <strong>【序章】</strong> {currentScenario.prologue}
              </p>
              <p>
                <strong>【全国巡礼と献上】</strong> {currentScenario.missionSummary}
              </p>
              <p>
                <strong>【御祭神の覚醒】</strong> {currentScenario.awakeningNarrative}
              </p>
              <p>
                <strong>【富士山頂の結実】</strong> {currentScenario.endingSummary}
              </p>
            </div>
          </div>

          {/* 3ステップ遊び方ガイド */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
              <div className="text-2xl mb-1">1️⃣ ⛩️ 御朱印＆実物撮影</div>
              <h4 className="text-sm font-extrabold text-slate-800">
                全国191社寺で神力を集める
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                GPS参拝（またはテスト押印）で<strong>+100神力</strong>、現地で頂いた本物の御朱印をカメラ撮影・保存するとさらに<strong>+50神力</strong>が宿ります。
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
              <div className="text-2xl mb-1">2️⃣ 🙏 本宮へ持ち帰り献上</div>
              <h4 className="text-sm font-extrabold text-slate-800">
                ホームの御祭神が力を取り戻す
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                初期ホーム「船橋大神宮」（変更自由）へ神力を持ち帰り献上すると、特有のデフォルメ御祭神が覚醒し、<strong>限定特典画像（全8種）</strong>が解放されます。
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
              <div className="text-2xl mb-1">3️⃣ 🗻 富士山頂と17の栞</div>
              <h4 className="text-sm font-extrabold text-slate-800">
                17ゾーン達成で『導きの栞』獲得
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                全国17霊域のいずれかを達成するたび、力を取り戻した御祭神が富士山頂から日本列島を光で包み、全10項目の演出と共に<strong>『古の導きの栞』</strong>を授けます。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* タブ②：全国17神域（ゾーン）達成マップ＆富士イベント再生 */}
      {activeSubTab === 'zones' && (
        <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                🗾 全国十七霊域（17ゾーン）結界解放一覧
              </h3>
              <p className="text-xs text-slate-500">
                各ゾーン内の社寺をすべて参拝すると、富士山頂での10項目アニメーション＆『導きの栞』授与イベントが発生します。
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold self-start sm:self-center">
              達成済：{zoneStats.filter((z) => z.isCleared).length} / 17 ゾーン
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {zoneStats.map(({ zone, totalSpots, stampedCount, isCleared }) => {
              const pct = totalSpots > 0 ? Math.round((stampedCount / totalSpots) * 100) : 0;
              return (
                <div
                  key={zone.zoneId}
                  className={`rounded-2xl border p-3.5 transition ${
                    isCleared
                      ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-400 shadow-sm'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-amber-800">
                      {zone.shortName}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        isCleared
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isCleared ? '🌟 結界解放済' : `${stampedCount} / ${totalSpots} 社寺`}
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 mt-1">
                    {zone.name}
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    対象都道府県：{zone.prefectures.join('・')}
                  </p>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden my-2">
                    <div
                      className="h-full bg-amber-500 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[11px] text-slate-500">{zone.description}</span>
                    {isCleared && (
                      <button
                        onClick={() => onReplayZoneClearModal(zone)}
                        className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold whitespace-nowrap ml-2 shadow-sm transition"
                      >
                        🗻 富士山頂演出を再生
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* タブ③：獲得した『古の導きの栞（全十七葉）』コレクション */}
      {activeSubTab === 'bookmarks' && (
        <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                🔖 古の導きの栞（全十七葉）言霊帖
              </h3>
              <p className="text-xs text-slate-500">
                「神には神の法則（すじみち）があるように、人には人の法則（すじみち）があるようだな…」——ゾーン達成ごとにランダムで1葉ずつ授かる暮らしの指針です。
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold self-start sm:self-center">
              獲得済：{unlockedBookmarkIds.length} / 17 葉
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SACRED_BOOKMARKS_17.map((bm) => {
              const isUnlocked = unlockedBookmarkIds.includes(bm.id);
              return (
                <div
                  key={bm.id}
                  className={`rounded-2xl border p-4 transition ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-amber-50/90 via-white to-yellow-50/80 border-amber-300 shadow-sm'
                      : 'bg-slate-50 border-slate-200 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold">
                      {bm.kanjiNumber}
                    </span>
                    <span className="text-[11px] font-bold text-amber-700">
                      {isUnlocked ? '✨ 授与済' : '🔒 未解放（ゾーン達成でランダム獲得）'}
                    </span>
                  </div>

                  {isUnlocked ? (
                    <>
                      <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                        🔖 『{bm.title}』
                        <span className="ml-1.5 text-xs font-normal text-slate-500">
                          — {bm.subtitle} —
                        </span>
                      </h4>
                      <p className="text-xs font-bold text-amber-950 bg-amber-100/60 rounded-xl p-2.5 mt-2 leading-relaxed border border-amber-200">
                        {bm.deityQuote}
                      </p>
                      <p className="text-[11px] text-slate-600 mt-2">
                        💡 <strong>日々の心がけ：</strong> {bm.practicalWisdom}
                      </p>
                    </>
                  ) : (
                    <div className="py-4 text-center text-xs text-slate-400">
                      全国17霊域のいずれかをクリアすると、富士山頂の光からランダムで授かります。
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* タブ④：神力の保持量による特典画像（御神影アートカード全8種） */}
      {activeSubTab === 'rewards' && (
        <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                🖼️ 本宮奉納・神力保持特典「御神影アートカード」
              </h3>
              <p className="text-xs text-slate-500">
                ホーム神社（{homeSpot?.name || '船橋大神宮'}）に献上した累計神力の保持量に応じて、高精細PNG護符アートカードを解放・保存できます。
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold">
              現在の保持神力：{offeredShinryoku.toLocaleString()} 神力
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {SHINRYOKU_REWARDS.map((rw) => {
              const unlocked = offeredShinryoku >= rw.requiredShinryoku;
              const motifEmoji = getRewardMotifEmoji(rw.motif);
              return (
                <div
                  key={rw.id}
                  className={`rounded-2xl border p-4 flex flex-col justify-between transition ${
                    unlocked
                      ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border-amber-400 shadow-md'
                      : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                          unlocked
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        必要神力：{rw.requiredShinryoku.toLocaleString()} 神力
                      </span>
                      <span className="text-xs font-bold">
                        {unlocked ? '✅ 解放済' : '🔒 未解放'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 my-2">
                      <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-3xl shrink-0">
                        {motifEmoji}
                      </div>
                      <div>
                        <h4
                          className={`text-sm sm:text-base font-extrabold ${
                            unlocked ? 'text-amber-200' : 'text-slate-700'
                          }`}
                        >
                          {rw.title}
                        </h4>
                        <p
                          className={`text-xs ${
                            unlocked ? 'text-amber-300/90' : 'text-slate-500'
                          }`}
                        >
                          {rw.subtitle}
                        </p>
                      </div>
                    </div>

                    <p
                      className={`text-xs mt-1 leading-relaxed ${
                        unlocked ? 'text-slate-200' : 'text-slate-500'
                      }`}
                    >
                      {rw.description}（御神徳：{rw.blessingText}）
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/10">
                    {unlocked ? (
                      <button
                        onClick={() =>
                          downloadRewardArtCardPng(
                            rw,
                            character,
                            homeSpot?.name || '船橋大神宮（意富比神社）'
                          )
                        }
                        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-extrabold text-xs shadow transition"
                      >
                        📥 特典御神影カード（PNG画像）を保存する
                      </button>
                    ) : (
                      <p className="text-[11px] text-center text-slate-400">
                        あと {(rw.requiredShinryoku - offeredShinryoku).toLocaleString()} 神力の献上で解放
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* タブ⑤：ストーリーシナリオ3候補の比較・切り替え */}
      {activeSubTab === 'scenarios' && (
        <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              📜 ストーリーシナリオ 3候補（いつでも切り替え可能）
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              いずれも「ホームに選んだ社寺特有のデフォルメ御祭神キャラを授かり、全国の御朱印巡礼で神力を取り戻し、富士山頂から17ゾーンを光で包んで『ひとつの道』と17の栞を授かる」大筋に沿った3つの演出トーンです。
            </p>
          </div>

          <div className="space-y-3">
            {STORY_SCENARIOS.map((sc) => {
              const selected = sc.id === currentScenario.id;
              return (
                <div
                  key={sc.id}
                  className={`rounded-2xl border-2 p-4 transition ${
                    selected
                      ? 'border-amber-500 bg-amber-50/70 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-amber-300'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-xs font-extrabold">
                        {sc.badge}
                      </span>
                    </div>
                    <button
                      onClick={() => onSelectScenarioId(sc.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition ${
                        selected
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-800 hover:bg-slate-700 text-white'
                      }`}
                    >
                      {selected ? '✅ 現在の採用シナリオ' : 'このシナリオに切り替える'}
                    </button>
                  </div>

                  <h4 className="text-base font-extrabold text-slate-900">
                    {sc.title}
                    <span className="block text-xs font-normal text-slate-600">
                      {sc.subtitle}
                    </span>
                  </h4>

                  <div className="mt-2.5 space-y-1.5 text-xs text-slate-700 leading-relaxed">
                    <p>
                      <strong>・導入：</strong> {sc.prologue}
                    </p>
                    <p>
                      <strong>・展開：</strong> {sc.missionSummary}
                    </p>
                    <p>
                      <strong>・覚醒：</strong> {sc.awakeningNarrative}
                    </p>
                    <p>
                      <strong>・クライマックス：</strong> {sc.endingSummary}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* タブ⑥：現地で撮影・保存した本物の御朱印アルバム */}
      {activeSubTab === 'photos' && (
        <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                📷 現地撮影・本物の御朱印コレクション
              </h3>
              <p className="text-xs text-slate-500">
                各社寺の詳細画面から、実際に頂いた御朱印帳の写真を撮影・保存するとここに一覧表示されます。
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold">
              保存枚数：{savedPhotoEntries.length} 枚
            </span>
          </div>

          {savedPhotoEntries.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 border border-dashed border-slate-300 p-8 text-center space-y-2">
              <div className="text-3xl">📷</div>
              <p className="text-sm font-bold text-slate-700">
                まだ実物の御朱印写真が保存されていません
              </p>
              <p className="text-xs text-slate-500">
                「御朱印帳」タブで各社寺をタップし、「📷 本物の御朱印を撮影・保存」タブから写真を登録すると、初回ボーナスとして<strong>+50神力</strong>も獲得できます！
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {savedPhotoEntries.map(({ spot, dataUrl }) => (
                <div
                  key={spot.id}
                  onClick={() => onOpenSpotDetail(spot)}
                  className="cursor-pointer group rounded-2xl border border-amber-200 overflow-hidden bg-amber-50/40 shadow-sm hover:shadow-md transition"
                >
                  <div className="aspect-[3/4] w-full bg-slate-900 overflow-hidden">
                    <img
                      src={dataUrl}
                      alt={`${spot.name}の実物御朱印`}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-2.5">
                    <p className="text-[10px] font-bold text-amber-700">
                      {spot.prefecture}・{spot.region}
                    </p>
                    <p className="text-xs font-extrabold text-slate-900 truncate">
                      {spot.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ホーム神社（本宮）変更モーダル */}
      {showHomePicker && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-5 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  🏠 ホーム神社・本宮を変更する
                </h3>
                <p className="text-xs text-slate-500">
                  選んだ社寺特有のデフォルメ御祭神（被る場合は配祀神・神使・ゆかりの英傑）が守護神になります
                </p>
              </div>
              <button
                onClick={() => setShowHomePicker(false)}
                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="my-3 flex gap-2">
              <input
                type="text"
                value={homeSearchQuery}
                onChange={(e) => setHomeSearchQuery(e.target.value)}
                placeholder="社寺名・都道府県（例：船橋大神宮、千葉、伊勢…）で検索"
                className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={() => {
                  onSelectHomeSpot(DEFAULT_HOME_SPOT_ID);
                  setShowHomePicker(false);
                }}
                className="px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-extrabold whitespace-nowrap"
              >
                🏮 船橋大神宮に戻す
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredSpotsForPicker.map((sp) => {
                const ch = getDeityCharacterForSpot(sp);
                const isCurrent = sp.id === homeSpot?.id;
                const emoji = getVisualStyleEmoji(ch.visualStyle);
                return (
                  <div
                    key={sp.id}
                    onClick={() => {
                      onSelectHomeSpot(sp.id);
                      setShowHomePicker(false);
                    }}
                    className={`cursor-pointer rounded-2xl border p-3 flex items-center justify-between gap-3 transition ${
                      isCurrent
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{emoji}</span>
                        <span className="text-xs font-extrabold text-slate-900 truncate">
                          {sp.name}
                        </span>
                        {sp.id === DEFAULT_HOME_SPOT_ID && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-950 text-[10px] font-bold">
                            初期ホーム
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-amber-800 font-bold truncate mt-0.5">
                        守護キャラ：{ch.charaName}（{ch.originDeity}）
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {sp.prefecture} / {sp.region}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold shrink-0 ${
                        isCurrent
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-900 text-white'
                      }`}
                    >
                      {isCurrent ? '設定中' : '本宮にする'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
