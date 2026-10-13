'use client';

import { useState, useEffect, useCallback } from 'react';
import { ShrineSpot, RegionKey, RegionOption } from '@/types/spot';
import MapView from '@/components/MapView';
import StampGrid from '@/components/StampGrid';
import BottomNav, { NavTab } from '@/components/BottomNav';
import DetailModal from '@/components/DetailModal';
import SanpaiGuide from '@/components/SanpaiGuide';
import { useLiff } from '@/components/LiffProvider';

const REGIONS: RegionOption[] = [
  { key: 'kanto', label: '関東・千葉エリア' },
  { key: 'kansai', label: '関西エリア' },
];

export default function RekitabiApp() {
  const { liff, profile } = useLiff();
  const [activeTab, setActiveTab] = useState<NavTab>('stamps');
  const [selectedRegion, setSelectedRegion] = useState<RegionKey>('kanto');
  const [spots, setSpots] = useState<ShrineSpot[]>([]);
  const [userStamps, setUserStamps] = useState<Record<string, boolean>>({});
  const [modalSpot, setModalSpot] = useState<ShrineSpot | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('rekitabi_stamps');
      if (saved) {
        setUserStamps(JSON.parse(saved));
      }
    } catch {
      // ignore JSON parse or localStorage errors
    }
  }, []);

  useEffect(() => {
    fetch(`/api/spots?region=${selectedRegion}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch spots');
        return res.json();
      })
      .then((data: ShrineSpot[]) => setSpots(data))
      .catch(() => setSpots([]));
  }, [selectedRegion]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // meters
    const p1 = (lat1 * Math.PI) / 180;
    const p2 = (lat2 * Math.PI) / 180;
    const dp = ((lat2 - lat1) * Math.PI) / 180;
    const dl = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dp / 2) ** 2 +
      Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const handleCheckIn = useCallback(
    (spot: ShrineSpot) => {
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
          const dist = calculateDistance(
            pos.coords.latitude,
            pos.coords.longitude,
            spot.lat,
            spot.lng
          );

          if (dist <= 500) {
            const updated = { ...userStamps, [spot.id]: true };
            setUserStamps(updated);
            try {
              localStorage.setItem('rekitabi_stamps', JSON.stringify(updated));
            } catch {
              // ignore localStorage write errors
            }
            alert(`🎉 【${spot.name}】の御朱印スタンプを獲得しました！`);

            // LINE連携：トークルームへ獲得メッセージを送信
            if (liff && liff.isInClient()) {
              liff
                .sendMessages([
                  {
                    type: 'text',
                    text: `⛩️ 【歴たび・参拝】${spot.name}（${spot.prefecture}）の御朱印を獲得しました！\n印銘：${spot.stampName.replace(
                      /\n/g,
                      ' '
                    )}`,
                  },
                ])
                .catch(() => {});
            }
          } else {
            alert(
              `📍 現在地から ${spot.name} まで約 ${Math.round(dist)}m です。\n境内（500m以内）に入ってから押印してください。`
            );
          }
        },
        () => {
          alert('位置情報の取得に失敗しました。端末の位置情報利用を許可してください。');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    },
    [liff, userStamps]
  );

  return (
    <div className="min-h-screen bg-shrine-bg text-stone-800 font-serif">
      {/* ヘッダー */}
      <header className="bg-gradient-to-r from-red-950 via-shrine-darkred to-red-950 text-white text-center py-3 border-b-2 border-shrine-gold sticky top-0 z-50 shadow-md">
        <h1 className="text-base font-bold tracking-wider">
          ⛩️ 歴たび - 神社参拝・御朱印巡り
        </h1>
        {profile && (
          <p className="text-[10px] text-amber-200 mt-0.5">
            巡礼者: {profile.displayName} 様
          </p>
        )}
      </header>

      {/* タブコンテンツ */}
      {activeTab === 'stamps' && (
        <StampGrid
          spots={spots}
          userStamps={userStamps}
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
          regions={REGIONS}
          onCheckIn={handleCheckIn}
          onShowDetail={(spot) => setModalSpot(spot)}
        />
      )}

      {activeTab === 'map' && (
        <div className="max-w-md mx-auto">
          <div className="p-2 bg-stone-100 flex items-center justify-between text-xs px-4">
            <span className="font-bold text-stone-700">表示エリア:</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value as RegionKey)}
              className="bg-white border border-stone-300 rounded px-2 py-1 text-xs font-bold text-stone-800"
            >
              {REGIONS.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <MapView
            spots={spots}
            userStamps={userStamps}
            onSelectSpot={(spot) => setModalSpot(spot)}
          />
        </div>
      )}

      {activeTab === 'sanpai' && (
        <SanpaiGuide
          spots={spots}
          userStamps={userStamps}
          onSelectSpot={(spot) => setModalSpot(spot)}
        />
      )}

      {/* ボトムナビゲーション */}
      <BottomNav currentTab={activeTab} onChangeTab={setActiveTab} />

      {/* 詳細モーダル */}
      {modalSpot && (
        <DetailModal
          spot={modalSpot}
          isStamped={!!userStamps[modalSpot.id]}
          onClose={() => setModalSpot(null)}
          onCheckIn={handleCheckIn}
        />
      )}
    </div>
  );
}
