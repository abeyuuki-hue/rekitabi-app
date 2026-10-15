'use client';

import { useState, useEffect, useMemo } from 'react';
import { ShrineSpot, RegionKey, REGION_OPTIONS, StampRallyCourse } from '@/types/spot';
import { SanpaiVisitLog } from '@/types/sanpai';
import MapView from '@/components/MapView';
import { useLiff } from '@/components/LiffProvider';
import BottomNav, { ActiveTab } from '@/components/BottomNav';
import StampGrid from '@/components/StampGrid';
import DetailModal from '@/components/DetailModal';
import SanpaiLogList from '@/components/SanpaiLogList';
import WorshipGuide from '@/components/WorshipGuide';
import HomeShrineView from '@/components/HomeShrineView';
import ZoneClearFujiModal from '@/components/ZoneClearFujiModal';
import {
  DEFAULT_HOME_SPOT_ID,
  JAPAN_17_ZONES,
  JapanZone,
  SACRED_BOOKMARKS_17,
  SacredBookmark,
  getAwakeningStage,
  getDeityCharacterForSpot,
  getZoneForPrefecture,
  pickRandomBookmark,
} from '@/lib/story_data';

const LEGACY_ID_MAP: Record<string, string> = {
  meiji: 'KT-001',
  kanda: 'KT-003',
  koami: 'KT-005',
  kashima: 'KT-010',
  fushimi: 'KS-001',
  kiyomizu: 'KS-002',
  sumiyoshi: 'KS-005',
  kasuga: 'KS-006',
};

export default function RekitabiApp() {
  const { liff, profile } = useLiff();
  const [activeTab, setActiveTab] = useState<ActiveTab>('stamp');
  const [selectedRegion, setSelectedRegion] = useState<RegionKey>('all');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [spots, setSpots] = useState<ShrineSpot[]>([]);
  const [allSpots, setAllSpots] = useState<ShrineSpot[]>([]);
  const [courses, setCourses] = useState<StampRallyCourse[]>([]);
  const [userStamps, setUserStamps] = useState<Record<string, boolean>>({});
  const [visitLogs, setVisitLogs] = useState<SanpaiVisitLog[]>([]);
  const [modalSpot, setModalSpot] = useState<ShrineSpot | null>(null);
  const [testMode, setTestMode] = useState(false);

  // 追加機能用の状態管理（デフォルトのホームは船橋大神宮: 'funabashi'）
  const [homeSpotId, setHomeSpotId] = useState<string>(DEFAULT_HOME_SPOT_ID);
  const [unofferedShinryoku, setUnofferedShinryoku] = useState<number>(0);
  const [offeredShinryoku, setOfferedShinryoku] = useState<number>(0);
  const [goshuinPhotos, setGoshuinPhotos] = useState<Record<string, string>>({});
  const [clearedZoneIds, setClearedZoneIds] = useState<string[]>([]);
  const [unlockedBookmarkIds, setUnlockedBookmarkIds] = useState<string[]>([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('scenario_1');

  // ゾーンクリア達成時の富士山頂10項目アニメーション＆導きの栞モーダル状態
  const [fujiModalOpen, setFujiModalOpen] = useState(false);
  const [activeClearedZone, setActiveClearedZone] = useState<JapanZone | null>(null);
  const [activeAwardedBookmark, setActiveAwardedBookmark] = useState<SacredBookmark | null>(null);

  // Load stamps, logs, and initial courses/allSpots
  useEffect(() => {
    const savedStamps = localStorage.getItem('rekitabi_stamps');
    if (savedStamps) {
      try {
        const parsed = JSON.parse(savedStamps);
        const migrated: Record<string, boolean> = { ...parsed };
        for (const [oldKey, newKey] of Object.entries(LEGACY_ID_MAP)) {
          if (parsed[oldKey]) {
            migrated[newKey] = true;
          }
        }
        setUserStamps(migrated);
      } catch (e) {
        console.error('Failed to parse rekitabi_stamps', e);
      }
    }

    const savedLogs = localStorage.getItem('sanpai_visit_logs');
    if (savedLogs) {
      try {
        setVisitLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error('Failed to parse sanpai_visit_logs', e);
      }
    }

    const savedHomeSpotId = localStorage.getItem('rekitabi_home_spot_id');
    if (savedHomeSpotId) {
      setHomeSpotId(savedHomeSpotId);
    } else {
      setHomeSpotId(DEFAULT_HOME_SPOT_ID);
      localStorage.setItem('rekitabi_home_spot_id', DEFAULT_HOME_SPOT_ID);
    }

    const savedUnoffered = localStorage.getItem('rekitabi_unoffered_shinryoku');
    if (savedUnoffered) {
      const val = Number(savedUnoffered);
      if (!Number.isNaN(val)) setUnofferedShinryoku(val);
    }

    const savedOffered = localStorage.getItem('rekitabi_offered_shinryoku');
    if (savedOffered) {
      const val = Number(savedOffered);
      if (!Number.isNaN(val)) setOfferedShinryoku(val);
    }

    const savedPhotos = localStorage.getItem('rekitabi_goshuin_photos');
    if (savedPhotos) {
      try {
        setGoshuinPhotos(JSON.parse(savedPhotos));
      } catch (e) {
        console.error('Failed to parse rekitabi_goshuin_photos', e);
      }
    }

    const savedClearedZones = localStorage.getItem('rekitabi_cleared_zones');
    if (savedClearedZones) {
      try {
        setClearedZoneIds(JSON.parse(savedClearedZones));
      } catch (e) {
        console.error('Failed to parse rekitabi_cleared_zones', e);
      }
    }

    const savedBookmarks = localStorage.getItem('rekitabi_unlocked_bookmarks');
    if (savedBookmarks) {
      try {
        setUnlockedBookmarkIds(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error('Failed to parse rekitabi_unlocked_bookmarks', e);
      }
    }

    const savedScenario = localStorage.getItem('rekitabi_story_scenario');
    if (savedScenario) {
      setSelectedScenarioId(savedScenario);
    }

    fetch('/api/spots?region=all')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAllSpots(data);
      })
      .catch(() => {});

    fetch('/api/courses')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCourses(data);
      })
      .catch(() => {});
  }, []);

  // Fetch spots based on region
  useEffect(() => {
    fetch(`/api/spots?region=${selectedRegion}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSpots(data);
        } else {
          setSpots([]);
        }
      })
      .catch(() => setSpots([]));
  }, [selectedRegion]);

  const effectiveAllSpots = allSpots.length > 0 ? allSpots : spots;

  // 現在のホーム神社スポット＆デフォルメ御祭神キャラ
  const homeSpot = useMemo(() => {
    return (
      effectiveAllSpots.find((s) => s.id === homeSpotId) ||
      effectiveAllSpots.find((s) => s.id === DEFAULT_HOME_SPOT_ID) ||
      effectiveAllSpots[0] ||
      null
    );
  }, [effectiveAllSpots, homeSpotId]);

  const homeCharacter = useMemo(() => getDeityCharacterForSpot(homeSpot), [homeSpot]);
  const awakening = useMemo(() => getAwakeningStage(offeredShinryoku), [offeredShinryoku]);

  // ホーム（本宮）の変更保存
  const handleSelectHomeSpot = (spotId: string) => {
    setHomeSpotId(spotId);
    localStorage.setItem('rekitabi_home_spot_id', spotId);
  };

  // シナリオ候補（3候補）の変更保存
  const handleSelectScenarioId = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId);
    localStorage.setItem('rekitabi_story_scenario', scenarioId);
  };

  // 神力をホーム（本宮）へ献上する処理
  const handleOfferShinryoku = () => {
    if (unofferedShinryoku <= 0) return;
    const nextOffered = offeredShinryoku + unofferedShinryoku;
    setOfferedShinryoku(nextOffered);
    setUnofferedShinryoku(0);
    localStorage.setItem('rekitabi_offered_shinryoku', String(nextOffered));
    localStorage.setItem('rekitabi_unoffered_shinryoku', '0');
  };

  // 現地で撮影した本物の御朱印写真の保存（初回は神力+50ボーナス）
  const handleSaveGoshuinPhoto = (spotId: string, dataUrl: string) => {
    const isFirstPhotoForSpot = !goshuinPhotos[spotId];
    const updated = { ...goshuinPhotos, [spotId]: dataUrl };
    setGoshuinPhotos(updated);
    try {
      localStorage.setItem('rekitabi_goshuin_photos', JSON.stringify(updated));
    } catch (e) {
      console.error('Storage quota exceeded when saving photo', e);
    }

    if (isFirstPhotoForSpot) {
      const nextUnoffered = unofferedShinryoku + 50;
      setUnofferedShinryoku(nextUnoffered);
      localStorage.setItem('rekitabi_unoffered_shinryoku', String(nextUnoffered));
    }
  };

  // 実物御朱印写真の削除
  const handleDeleteGoshuinPhoto = (spotId: string) => {
    const updated = { ...goshuinPhotos };
    delete updated[spotId];
    setGoshuinPhotos(updated);
    localStorage.setItem('rekitabi_goshuin_photos', JSON.stringify(updated));
  };

  // スタンプ更新時に17ゾーンの新たな制覇をチェックし、達成時は富士山頂イベント＆ランダム栞を授与
  const checkAndTriggerZoneClears = (updatedStamps: Record<string, boolean>) => {
    if (effectiveAllSpots.length === 0) return;

    const newlyClearedZones: JapanZone[] = [];
    for (const zone of JAPAN_17_ZONES) {
      if (clearedZoneIds.includes(zone.zoneId)) continue;
      const zoneSpots = effectiveAllSpots.filter((sp) => {
        const z = getZoneForPrefecture(sp.prefecture || '');
        return z?.zoneId === zone.zoneId;
      });
      if (zoneSpots.length > 0 && zoneSpots.every((sp) => updatedStamps[sp.id])) {
        newlyClearedZones.push(zone);
      }
    }

    if (newlyClearedZones.length === 0) return;

    const nextClearedIds = [...clearedZoneIds];
    const nextBookmarkIds = [...unlockedBookmarkIds];
    let latestAwardedBookmark: SacredBookmark | null = null;

    for (const z of newlyClearedZones) {
      if (!nextClearedIds.includes(z.zoneId)) {
        nextClearedIds.push(z.zoneId);
      }
      const chosenBookmark = pickRandomBookmark(nextBookmarkIds);
      if (!nextBookmarkIds.includes(chosenBookmark.id)) {
        nextBookmarkIds.push(chosenBookmark.id);
      }
      latestAwardedBookmark = chosenBookmark;
    }

    setClearedZoneIds(nextClearedIds);
    setUnlockedBookmarkIds(nextBookmarkIds);
    localStorage.setItem('rekitabi_cleared_zones', JSON.stringify(nextClearedIds));
    localStorage.setItem('rekitabi_unlocked_bookmarks', JSON.stringify(nextBookmarkIds));

    // 達成したゾーンの富士山頂10項目アニメーション＆導きの栞モーダルを表示
    const targetZone = newlyClearedZones[newlyClearedZones.length - 1];
    setActiveClearedZone(targetZone);
    setActiveAwardedBookmark(latestAwardedBookmark || SACRED_BOOKMARKS_17[0]);
    setFujiModalOpen(true);
  };

  // Haversine distance calculation
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const p1 = (lat1 * Math.PI) / 180;
    const p2 = (lat2 * Math.PI) / 180;
    const dp = ((lat2 - lat1) * Math.PI) / 180;
    const dl = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const awardStamp = (spot: ShrineSpot) => {
    const isNewStamp = !userStamps[spot.id];
    const updated = { ...userStamps, [spot.id]: true };
    setUserStamps(updated);
    localStorage.setItem('rekitabi_stamps', JSON.stringify(updated));

    // 御朱印獲得で神力 +100 を貯める（未献上神力に加算）
    if (isNewStamp) {
      const nextUnoffered = unofferedShinryoku + 100;
      setUnofferedShinryoku(nextUnoffered);
      localStorage.setItem('rekitabi_unoffered_shinryoku', String(nextUnoffered));
    }

    // Check if any course was just completed
    const newlyCompletedCourses = courses.filter(
      (c) =>
        c.spot_ids.includes(spot.id) &&
        c.spot_ids.every((id) => updated[id]) &&
        !c.spot_ids.every((id) => userStamps[id])
    );

    if (newlyCompletedCourses.length > 0) {
      const c = newlyCompletedCourses[0];
      alert(
        `🎉 【${spot.name}】の御朱印スタンプを獲得し、神力 +100✨ が宿りました！\n（本宮「${homeSpot?.name || '船橋大神宮'}」へ持ち帰って献上できます）\n\n🏆 さらにコース制覇達成！\n『${c.title}』コンプリート！\n🏅 称号：【${c.completion_reward.title}】\n（${c.completion_reward.digital_badge}）を授与しました！`
      );
    } else {
      alert(
        `🎉 【${spot.name}】の御朱印スタンプを獲得し、神力 +100✨ が宿りました！\n（「🏮 本宮・神力」タブで${homeSpot?.name || '船橋大神宮'}の御祭神へ献上できます）`
      );
    }

    // LINE連携：トークルームへ獲得メッセージを自動送信（LIFF起動時）
    if (liff && liff.isInClient()) {
      liff
        .sendMessages([
          {
            type: 'text',
            text: `⛩️ 【歴たび】${spot.name}（${spot.prefecture}）の御朱印を獲得しました！（神力+100✨）\n印銘：${spot.stampName.replaceAll('\n', ' ')}`,
          },
        ])
        .catch(() => {});
    }

    setModalSpot(spot);
    checkAndTriggerZoneClears(updated);
  };

  // テストモード専用：複数スポットの一括御朱印獲得機能（要件5）
  const handleBulkStampSpots = (spotsToStamp: ShrineSpot[], label: string) => {
    if (spotsToStamp.length === 0) return;
    const updated = { ...userStamps };
    let newlyStampedCount = 0;

    for (const sp of spotsToStamp) {
      if (!updated[sp.id]) {
        updated[sp.id] = true;
        newlyStampedCount++;
      }
    }

    setUserStamps(updated);
    localStorage.setItem('rekitabi_stamps', JSON.stringify(updated));

    if (newlyStampedCount > 0) {
      const gainedShinryoku = newlyStampedCount * 100;
      const nextUnoffered = unofferedShinryoku + gainedShinryoku;
      setUnofferedShinryoku(nextUnoffered);
      localStorage.setItem('rekitabi_unoffered_shinryoku', String(nextUnoffered));
    }

    checkAndTriggerZoneClears(updated);
  };

  // テストモード専用：次の未達成ゾーン1つを一括制覇して富士山頂10項目アニメーション＆栞ゲットを発動
  const handleTestClearNextZone = () => {
    if (effectiveAllSpots.length === 0) return;
    const nextZone =
      JAPAN_17_ZONES.find((z) => !clearedZoneIds.includes(z.zoneId)) || JAPAN_17_ZONES[0];
    const zoneSpots = effectiveAllSpots.filter((sp) => {
      const z = getZoneForPrefecture(sp.prefecture || '');
      return z?.zoneId === nextZone.zoneId;
    });

    const updated = { ...userStamps };
    let newlyAdded = 0;
    for (const sp of zoneSpots) {
      if (!updated[sp.id]) {
        updated[sp.id] = true;
        newlyAdded++;
      }
    }
    setUserStamps(updated);
    localStorage.setItem('rekitabi_stamps', JSON.stringify(updated));

    const gained = Math.max(1, newlyAdded) * 100;
    const nextUnoffered = unofferedShinryoku + gained;
    setUnofferedShinryoku(nextUnoffered);
    localStorage.setItem('rekitabi_unoffered_shinryoku', String(nextUnoffered));

    const nextClearedIds = clearedZoneIds.includes(nextZone.zoneId)
      ? clearedZoneIds
      : [...clearedZoneIds, nextZone.zoneId];
    const chosenBookmark = pickRandomBookmark(unlockedBookmarkIds);
    const nextBookmarkIds = unlockedBookmarkIds.includes(chosenBookmark.id)
      ? unlockedBookmarkIds
      : [...unlockedBookmarkIds, chosenBookmark.id];

    setClearedZoneIds(nextClearedIds);
    setUnlockedBookmarkIds(nextBookmarkIds);
    localStorage.setItem('rekitabi_cleared_zones', JSON.stringify(nextClearedIds));
    localStorage.setItem('rekitabi_unlocked_bookmarks', JSON.stringify(nextBookmarkIds));

    setActiveClearedZone(nextZone);
    setActiveAwardedBookmark(chosenBookmark);
    setFujiModalOpen(true);
  };

  // テストモード専用：神力を直接追加
  const handleTestAddShinryoku = (amount: number) => {
    const nextUnoffered = unofferedShinryoku + amount;
    setUnofferedShinryoku(nextUnoffered);
    localStorage.setItem('rekitabi_unoffered_shinryoku', String(nextUnoffered));
  };

  // テストモード専用：御朱印・神力・ゾーン達成状態のリセット
  const handleTestResetAll = () => {
    if (!confirm('【テストモード】獲得した御朱印・神力・17ゾーン制覇・導きの栞を初期状態にリセットしますか？（ホーム設定と実物写真は保持されます）')) {
      return;
    }
    setUserStamps({});
    setUnofferedShinryoku(0);
    setOfferedShinryoku(0);
    setClearedZoneIds([]);
    setUnlockedBookmarkIds([]);
    localStorage.removeItem('rekitabi_stamps');
    localStorage.setItem('rekitabi_unoffered_shinryoku', '0');
    localStorage.setItem('rekitabi_offered_shinryoku', '0');
    localStorage.removeItem('rekitabi_cleared_zones');
    localStorage.removeItem('rekitabi_unlocked_bookmarks');
  };

  // 達成済みゾーンの富士山頂アニメーションを再鑑賞
  const handleReplayZoneClearModal = (zone: JapanZone) => {
    const bookmarkIdx = Math.max(0, zone.zoneNumber - 1) % SACRED_BOOKMARKS_17.length;
    const bookmark =
      SACRED_BOOKMARKS_17.find((b) => unlockedBookmarkIds.includes(b.id)) ||
      SACRED_BOOKMARKS_17[bookmarkIdx];
    setActiveClearedZone(zone);
    setActiveAwardedBookmark(bookmark);
    setFujiModalOpen(true);
  };

  // GPS Check-in (or Test Mode instant check-in)
  const handleCheckIn = (spot: ShrineSpot) => {
    if (userStamps[spot.id]) {
      setModalSpot(spot);
      return;
    }

    if (testMode) {
      awardStamp(spot);
      return;
    }

    if (!navigator.geolocation) {
      alert('お使いの端末は位置情報取得に対応していません。（上部ヘッダーの「🧪テスト押印」をONにすると押印体験が可能です）');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const dist = calculateDistance(pos.coords.latitude, pos.coords.longitude, spot.lat, spot.lng);
        if (dist <= 500) {
          awardStamp(spot);
        } else {
          alert(
            `📍 現在地から ${spot.name} まで約 ${Math.round(dist).toLocaleString()}m です。\n境内（500m以内）に入ってから押印してください。\n（※動作確認の場合は上部ヘッダーの「🧪テスト押印」をONにしてください）`
          );
        }
      },
      () =>
        alert(
          '位置情報の取得に失敗しました。位置情報の利用を許可するか、上部ヘッダーの「🧪テスト押印」をONにしてお試しください。'
        )
    );
  };

  // Save new visit log
  const handleSaveVisitLog = (newLogData: Omit<SanpaiVisitLog, 'id'>) => {
    const newLog: SanpaiVisitLog = {
      ...newLogData,
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    };
    const updated = [newLog, ...visitLogs];
    setVisitLogs(updated);
    localStorage.setItem('sanpai_visit_logs', JSON.stringify(updated));
  };

  // Delete visit log
  const handleDeleteVisitLog = (id: string) => {
    if (confirm('この参拝記録を削除しますか？')) {
      const updated = visitLogs.filter((log) => log.id !== id);
      setVisitLogs(updated);
      localStorage.setItem('sanpai_visit_logs', JSON.stringify(updated));
    }
  };

  const selectedCourse = courses.find((c) => c.course_id === selectedCourseId) || null;
  const mapSpots = selectedCourse
    ? effectiveAllSpots.filter((s) => selectedCourse.spot_ids.includes(s.id))
    : spots;

  const stampedIdsList = useMemo(
    () => Object.keys(userStamps).filter((id) => userStamps[id]),
    [userStamps]
  );

  return (
    <div className="min-h-screen bg-shrine-bg text-neutral-800 font-serif pb-20">
      {/* ヘッダー */}
      <header className="bg-shrine-darkred text-white py-2.5 px-3 border-b-2 border-shrine-gold sticky top-0 z-50 shadow-md">
        <div className="max-w-md mx-auto flex justify-between items-center gap-2">
          <div className="text-left">
            <h1 className="text-sm sm:text-base font-bold tracking-wider">
              ⛩️ 歴たび - 全国パワースポット参拝帳
            </h1>
            {profile ? (
              <p className="text-[10px] text-amber-200">
                巡礼者: {profile.displayName} 様｜🏮本宮: {homeSpot?.name || '船橋大神宮'}
              </p>
            ) : (
              <p className="text-[10px] text-amber-100/80">
                全国17霊域・{effectiveAllSpots.length || 191}社寺｜🏮本宮: {homeSpot?.name || '船橋大神宮'}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setTestMode(!testMode)}
            className={`px-2 py-1 rounded-full text-[10px] font-bold border transition-all shrink-0 ${
              testMode
                ? 'bg-amber-400 text-stone-900 border-white shadow-sm'
                : 'bg-black/25 text-amber-100 border-amber-300/40 hover:bg-black/40'
            }`}
            title="ONにすると現地500m以内に行かなくてもワンタップ押印や一括御朱印獲得テストができます"
          >
            🧪 テスト押印: {testMode ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* テストモードON時の一括御朱印獲得＆検証パネル（要件5） */}
        {testMode && (
          <div className="max-w-md mx-auto mt-2 pt-2 border-t border-amber-300/30 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-amber-200">
              <span className="font-bold">🧪 テストモード：一括御朱印獲得＆神力・ゾーン制覇ツール</span>
              <span>
                制覇ゾーン: {clearedZoneIds.length}/17｜栞: {unlockedBookmarkIds.length}/17
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={handleTestClearNextZone}
                className="px-2 py-1 rounded bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-[10px] shadow-xs"
              >
                🗻 1ゾーン一括獲得 (富士10項アニメ＆栞)
              </button>
              <button
                type="button"
                onClick={() => handleBulkStampSpots(spots, '表示中エリア')}
                className="px-2 py-1 rounded bg-orange-300 hover:bg-orange-200 text-stone-950 font-bold text-[10px] shadow-xs"
              >
                📍 表示中エリア一括獲得 ({spots.length}社)
              </button>
              <button
                type="button"
                onClick={() => handleBulkStampSpots(effectiveAllSpots, '全国191社寺')}
                className="px-2 py-1 rounded bg-emerald-300 hover:bg-emerald-200 text-stone-950 font-bold text-[10px] shadow-xs"
              >
                🗾 全国{effectiveAllSpots.length || 191}社を一括獲得
              </button>
              <button
                type="button"
                onClick={() => handleTestAddShinryoku(1000)}
                className="px-2 py-1 rounded bg-purple-200 hover:bg-purple-100 text-stone-950 font-bold text-[10px] shadow-xs"
              >
                ✨ 神力+1,000追加
              </button>
              <button
                type="button"
                onClick={handleTestResetAll}
                className="px-2 py-1 rounded bg-stone-700 hover:bg-stone-600 text-stone-100 font-bold text-[10px]"
              >
                🔄 リセット
              </button>
            </div>
          </div>
        )}
      </header>

      {/* タブ1: スタンプ台帳 */}
      {activeTab === 'stamp' && (
        <StampGrid
          spots={spots}
          allSpots={effectiveAllSpots}
          courses={courses}
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
          selectedCourseId={selectedCourseId}
          onCourseChange={setSelectedCourseId}
          userStamps={userStamps}
          onCheckIn={handleCheckIn}
          onOpenDetail={(spot) => setModalSpot(spot)}
          homeSpotId={homeSpotId}
          goshuinPhotos={goshuinPhotos}
          unofferedShinryoku={unofferedShinryoku}
          offeredShinryoku={offeredShinryoku}
          onGoToHomeShrine={() => setActiveTab('home')}
          testMode={testMode}
          onBulkStampSpots={handleBulkStampSpots}
        />
      )}

      {/* タブ2: 本宮・神力・守護キャラ・17ゾーン・導きの栞・特典画像 */}
      {activeTab === 'home' && (
        <HomeShrineView
          spots={effectiveAllSpots}
          stampedIds={stampedIdsList}
          homeSpotId={homeSpotId}
          onSelectHomeSpot={handleSelectHomeSpot}
          unofferedShinryoku={unofferedShinryoku}
          offeredShinryoku={offeredShinryoku}
          onOfferShinryoku={handleOfferShinryoku}
          clearedZoneIds={clearedZoneIds}
          unlockedBookmarkIds={unlockedBookmarkIds}
          onReplayZoneClearModal={handleReplayZoneClearModal}
          selectedScenarioId={selectedScenarioId}
          onSelectScenarioId={handleSelectScenarioId}
          goshuinPhotos={goshuinPhotos}
          onOpenSpotDetail={(spot) => setModalSpot(spot)}
          testMode={testMode}
          onTestClearNextZone={handleTestClearNextZone}
          onTestAddShinryoku={handleTestAddShinryoku}
        />
      )}

      {/* タブ3: 和風マップ */}
      {activeTab === 'map' && (
        <div>
          <div className="bg-white/95 backdrop-blur-xs px-4 py-2 border-b border-stone-200 flex flex-wrap justify-between items-center gap-2 text-xs">
            <span className="font-bold text-stone-700">
              {selectedCourse
                ? `🎯 コース：${selectedCourse.title} (${mapSpots.length}社)`
                : `🗺️ 表示中：${
                    REGION_OPTIONS.find((r) => r.key === selectedRegion)?.shortLabel || '全国'
                  } (${mapSpots.length}社)`}
            </span>
            <div className="flex items-center gap-1.5">
              {selectedCourse && (
                <button
                  type="button"
                  onClick={() => setSelectedCourseId(null)}
                  className="px-2 py-1 rounded bg-red-50 text-shrine-darkred border border-shrine-darkred/30 text-[10px] font-bold"
                >
                  コース解除
                </button>
              )}
              <select
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedCourseId(null);
                  setSelectedRegion(e.target.value as RegionKey);
                }}
                className="bg-stone-50 border border-stone-300 rounded px-2 py-1 text-xs font-bold"
              >
                {REGION_OPTIONS.map((r) => (
                  <option key={r.key} value={r.key}>
                    {r.shortLabel}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <MapView
            spots={mapSpots}
            userStamps={userStamps}
            onSelectSpot={(spot) => setModalSpot(spot)}
          />
        </div>
      )}

      {/* タブ4: 参拝記録帳 */}
      {activeTab === 'journal' && (
        <SanpaiLogList
          logs={visitLogs}
          onDeleteLog={handleDeleteVisitLog}
          onGoToStampTab={() => setActiveTab('stamp')}
        />
      )}

      {/* タブ5: 由緒・作法ガイド */}
      {activeTab === 'guide' && <WorshipGuide />}

      {/* ボトムナビゲーション */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        unofferedShinryoku={unofferedShinryoku}
      />

      {/* 由緒・実物御朱印撮影・本宮設定・参拝記録モーダル */}
      {modalSpot && (
        <DetailModal
          spot={modalSpot}
          isStamped={!!userStamps[modalSpot.id]}
          onClose={() => setModalSpot(null)}
          onCheckIn={handleCheckIn}
          onSaveLog={handleSaveVisitLog}
          isHomeSpot={modalSpot.id === homeSpotId}
          onSetHomeSpot={handleSelectHomeSpot}
          goshuinPhoto={goshuinPhotos[modalSpot.id]}
          onSaveGoshuinPhoto={handleSaveGoshuinPhoto}
          onDeleteGoshuinPhoto={handleDeleteGoshuinPhoto}
        />
      )}

      {/* ゾーンクリア達成時の富士山頂10項目アニメーション＆導きの栞（17葉）モーダル */}
      <ZoneClearFujiModal
        isOpen={fujiModalOpen}
        onClose={() => setFujiModalOpen(false)}
        clearedZone={activeClearedZone}
        allClearedZoneIds={clearedZoneIds}
        character={homeCharacter}
        homeSpotName={homeSpot?.name || '船橋大神宮（意富比神社）'}
        awardedBookmark={activeAwardedBookmark}
        awakeningLevel={awakening.level}
      />
    </div>
  );
}
