'use client';

import { useState, useEffect } from 'react';
import { ShrineSpot, RegionKey, REGION_OPTIONS, StampRallyCourse } from '@/types/spot';
import { SanpaiVisitLog } from '@/types/sanpai';
import MapView from '@/components/MapView';
import { useLiff } from '@/components/LiffProvider';
import BottomNav, { ActiveTab } from '@/components/BottomNav';
import StampGrid from '@/components/StampGrid';
import DetailModal from '@/components/DetailModal';
import SanpaiLogList from '@/components/SanpaiLogList';
import WorshipGuide from '@/components/WorshipGuide';

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
    const updated = { ...userStamps, [spot.id]: true };
    setUserStamps(updated);
    localStorage.setItem('rekitabi_stamps', JSON.stringify(updated));

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
        `🎉 【${spot.name}】の御朱印スタンプを獲得しました！\n\n🏆 さらにコース制覇達成！\n『${c.title}』コンプリート！\n🏅 称号：【${c.completion_reward.title}】\n（${c.completion_reward.digital_badge}）を授与しました！`
      );
    } else {
      alert(`🎉 【${spot.name}】の御朱印スタンプを獲得しました！`);
    }

    // LINE連携：トークルームへ獲得メッセージを自動送信（LIFF起動時）
    if (liff && liff.isInClient()) {
      liff
        .sendMessages([
          {
            type: 'text',
            text: `⛩️ 【歴たび】${spot.name}（${spot.prefecture}）の御朱印を獲得しました！\n印銘：${spot.stampName.replaceAll('\n', ' ')}`,
          },
        ])
        .catch(() => {});
    }

    setModalSpot(spot);
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
    ? allSpots.filter((s) => selectedCourse.spot_ids.includes(s.id))
    : spots;

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
              <p className="text-[10px] text-amber-200">巡礼者: {profile.displayName} 様</p>
            ) : (
              <p className="text-[10px] text-amber-100/80">全国7地域53社寺・5大スタンプラリーコース</p>
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
            title="ONにすると現地500m以内に行かなくてもワンタップで押印テストができます"
          >
            🧪 テスト押印: {testMode ? 'ON' : 'OFF'}
          </button>
        </div>
      </header>

      {/* タブ1: スタンプ台帳 */}
      {activeTab === 'stamp' && (
        <StampGrid
          spots={spots}
          allSpots={allSpots.length > 0 ? allSpots : spots}
          courses={courses}
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
          selectedCourseId={selectedCourseId}
          onCourseChange={setSelectedCourseId}
          userStamps={userStamps}
          onCheckIn={handleCheckIn}
          onOpenDetail={(spot) => setModalSpot(spot)}
        />
      )}

      {/* タブ2: 和風マップ */}
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

      {/* タブ3: 参拝記録帳 */}
      {activeTab === 'journal' && (
        <SanpaiLogList
          logs={visitLogs}
          onDeleteLog={handleDeleteVisitLog}
          onGoToStampTab={() => setActiveTab('stamp')}
        />
      )}

      {/* タブ4: 由緒・作法ガイド */}
      {activeTab === 'guide' && <WorshipGuide />}

      {/* ボトムナビゲーション */}
      <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* 由緒・祭神・参拝記録モーダル */}
      {modalSpot && (
        <DetailModal
          spot={modalSpot}
          isStamped={!!userStamps[modalSpot.id]}
          onClose={() => setModalSpot(null)}
          onCheckIn={handleCheckIn}
          onSaveLog={handleSaveVisitLog}
        />
      )}
    </div>
  );
}
