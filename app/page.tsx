'use client';

import { useState, useEffect } from 'react';
import { ShrineSpot, RegionKey } from '@/types/spot';
import { SanpaiVisitLog } from '@/types/sanpai';
import MapView from '@/components/MapView';
import { useLiff } from '@/components/LiffProvider';
import BottomNav, { ActiveTab } from '@/components/BottomNav';
import StampGrid from '@/components/StampGrid';
import DetailModal from '@/components/DetailModal';
import SanpaiLogList from '@/components/SanpaiLogList';
import WorshipGuide from '@/components/WorshipGuide';

export default function RekitabiApp() {
  const { liff, profile } = useLiff();
  const [activeTab, setActiveTab] = useState<ActiveTab>('stamp');
  const [selectedRegion, setSelectedRegion] = useState<RegionKey>('kanto');
  const [spots, setSpots] = useState<ShrineSpot[]>([]);
  const [userStamps, setUserStamps] = useState<Record<string, boolean>>({});
  const [visitLogs, setVisitLogs] = useState<SanpaiVisitLog[]>([]);
  const [modalSpot, setModalSpot] = useState<ShrineSpot | null>(null);

  // Load stamps and logs from localStorage
  useEffect(() => {
    const savedStamps = localStorage.getItem('rekitabi_stamps');
    if (savedStamps) {
      try {
        setUserStamps(JSON.parse(savedStamps));
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

  // GPS Check-in
  const handleCheckIn = (spot: ShrineSpot) => {
    if (userStamps[spot.id]) {
      setModalSpot(spot);
      return;
    }

    if (!navigator.geolocation) {
      alert('お使いの端末は位置情報取得に対応していません。');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const dist = calculateDistance(pos.coords.latitude, pos.coords.longitude, spot.lat, spot.lng);
        if (dist <= 500) {
          const updated = { ...userStamps, [spot.id]: true };
          setUserStamps(updated);
          localStorage.setItem('rekitabi_stamps', JSON.stringify(updated));
          alert(`🎉 【${spot.name}】の御朱印スタンプを獲得しました！`);

          // LINE連携：トークルームへ獲得メッセージを自動送信（LIFF起動時）
          if (liff && liff.isInClient()) {
            liff.sendMessages([
              {
                type: 'text',
                text: `⛩️ 【歴たび】${spot.name}（${spot.prefecture}）の御朱印を獲得しました！\n印銘：${spot.stampName.replace('\n', ' ')}`,
              },
            ]).catch(() => {});
          }

          // Open modal after check-in
          setModalSpot(spot);
        } else {
          alert(`📍 現在地から ${spot.name} まで約 ${Math.round(dist)}m です。\n境内（500m以内）に入ってから押印してください。`);
        }
      },
      () => alert('位置情報の取得に失敗しました。位置情報の利用を許可してください。')
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

  return (
    <div className="min-h-screen bg-shrine-bg text-neutral-800 font-serif pb-20">
      {/* ヘッダー */}
      <header className="bg-shrine-darkred text-white text-center py-3 border-b-2 border-shrine-gold sticky top-0 z-50 shadow-md">
        <h1 className="text-base font-bold tracking-wider">⛩️ 歴たび - 全国パワースポットめぐり & 参拝帳</h1>
        {profile && (
          <p className="text-[10px] text-amber-200 mt-0.5">巡礼者: {profile.displayName} 様</p>
        )}
      </header>

      {/* タブ1: スタンプ台帳 */}
      {activeTab === 'stamp' && (
        <StampGrid
          spots={spots}
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
          userStamps={userStamps}
          onCheckIn={handleCheckIn}
          onOpenDetail={(spot) => setModalSpot(spot)}
        />
      )}

      {/* タブ2: 和風マップ */}
      {activeTab === 'map' && (
        <div>
          <div className="bg-white/90 backdrop-blur-xs px-4 py-2 border-b border-stone-200 flex justify-between items-center text-xs">
            <span className="font-bold text-stone-700">表示中：{selectedRegion === 'kanto' ? '関東エリア' : '関西エリア'}</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value as RegionKey)}
              className="bg-stone-50 border border-stone-300 rounded px-2 py-1 text-xs font-bold"
            >
              <option value="kanto">関東・千葉</option>
              <option value="kansai">関西エリア</option>
            </select>
          </div>
          <MapView spots={spots} onSelectSpot={(spot) => setModalSpot(spot)} />
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
