'use client';

import { useState, useEffect } from 'react';
import { ShrineSpot, RegionKey } from '@/types/spot';
import MapView from '@/components/MapView';
import { useLiff } from '@/components/LiffProvider';

const REGIONS: { key: RegionKey; label: string }[] = [
  { key: 'kanto', label: '関東・千葉エリア' },
  { key: 'kansai', label: '関西エリア' },
];

export default function RekitabiApp() {
  const { liff, profile } = useLiff();
  const [activeTab, setActiveTab] = useState<'stamp' | 'map'>('stamp');
  const [selectedRegion, setSelectedRegion] = useState<RegionKey>('kanto');
  const [spots, setSpots] = useState<ShrineSpot[]>([]);
  const [userStamps, setUserStamps] = useState<Record<string, boolean>>({});
  const [modalSpot, setModalSpot] = useState<ShrineSpot | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('rekitabi_stamps');
    if (saved) setUserStamps(JSON.parse(saved));
  }, []);

  useEffect(() => {
    fetch(`/api/spots?region=${selectedRegion}`)
      .then((res) => res.json())
      .then((data) => setSpots(data))
      .catch(() => setSpots([]));
  }, [selectedRegion]);

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
                text: `⛩️ 【歴たび】${spot.name}（${spot.prefecture}）の御朱印を獲得しました！
印銘：${spot.stampName.replace('
', ' ')}`,
              },
            ]).catch(() => {});
          }
        } else {
          alert(`📍 現在地から ${spot.name} まで約 ${Math.round(dist)}m です。
境内（500m以内）に入ってから押印してください。`);
        }
      },
      () => alert('位置情報の取得に失敗しました。位置情報の利用を許可してください。')
    );
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const p1 = (lat1 * Math.PI) / 180;
    const p2 = (lat2 * Math.PI) / 180;
    const dp = ((lat2 - lat1) * Math.PI) / 180;
    const dl = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const stampedCount = spots.filter((s) => userStamps[s.id]).length;

  return (
    <div className="min-h-screen bg-shrine-bg text-neutral-800 font-serif pb-20">
      {/* ヘッダー */}
      <header className="bg-shrine-darkred text-white text-center py-3 border-b-2 border-shrine-gold sticky top-0 z-50 shadow-md">
        <h1 className="text-base font-bold tracking-wider">⛩️ 歴たび - 全国パワースポットめぐり</h1>
        {profile && (
          <p className="text-[10px] text-amber-200 mt-0.5">巡礼者: {profile.displayName} 様</p>
        )}
      </header>

      {/* タブ1: スタンプ台帳 */}
      {activeTab === 'stamp' && (
        <main className="max-w-md mx-auto p-4">
          <div className="flex items-center gap-2 mb-4 bg-white p-3 rounded-lg border border-stone-200 shadow-sm">
            <label htmlFor="region-select" className="text-xs font-bold whitespace-nowrap">地域選択：</label>
            <select
              id="region-select"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value as RegionKey)}
              className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-xs font-bold"
            >
              {REGIONS.map((r) => (
                <option key={r.key} value={r.key}>{r.label}</option>
              ))}
            </select>
          </div>

          <div className="bg-white border border-amber-900/10 rounded-xl p-3 mb-4 shadow-sm text-xs text-neutral-600">
            獲得スタンプ数: <span className="text-shrine-darkred font-bold text-sm">{stampedCount}</span> / {spots.length} 社
          </div>

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
                  <h3 className="font-bold text-xs mt-0.5 line-clamp-1">{spot.name}</h3>

                  <div
                    className={`w-16 h-16 border-2 border-shrine-darkred rounded-full mx-auto my-2 flex items-center justify-center text-[10px] font-bold leading-tight ${
                      isStamped ? 'opacity-100 text-shrine-darkred -rotate-6 scale-105' : 'opacity-20 text-stone-400'
                    }`}
                  >
                    {isStamped ? spot.stampName.split('
').map((line, i) => <div key={i}>{line}</div>) : '未押印'}
                  </div>

                  <button
                    onClick={() => handleCheckIn(spot)}
                    className={`w-full py-1.5 rounded text-xs font-bold text-white shadow-sm transition-colors ${
                      isStamped ? 'bg-stone-600 hover:bg-stone-700' : 'bg-shrine-darkred hover:bg-red-900'
                    }`}
                  >
                    {isStamped ? '📜 由緒確認' : '📍 押印 (GPS)'}
                  </button>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* タブ2: 和風マップ */}
      {activeTab === 'map' && <MapView spots={spots} />}

      {/* ボトムナビゲーション */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-stone-200 flex justify-around py-2 z-50 shadow-lg">
        <button
          onClick={() => setActiveTab('stamp')}
          className={`flex flex-col items-center w-1/2 text-xs font-bold ${
            activeTab === 'stamp' ? 'text-shrine-darkred' : 'text-stone-400'
          }`}
        >
          <span className="text-xl">📜</span>
          <span>御朱印帳</span>
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center w-1/2 text-xs font-bold ${
            activeTab === 'map' ? 'text-shrine-darkred' : 'text-stone-400'
          }`}
        >
          <span className="text-xl">🗺️</span>
          <span>古今絵図</span>
        </button>
      </nav>

      {/* 由緒・名物モーダル */}
      {modalSpot && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 relative shadow-xl">
            <button
              onClick={() => setModalSpot(null)}
              className="absolute top-3 right-4 text-stone-400 text-xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-shrine-darkred font-bold text-base mb-3 border-b pb-2">
              ⛩️ {modalSpot.name}
            </h2>
            <div className="text-xs space-y-3 leading-relaxed text-stone-700">
              <div>
                <strong className="text-stone-900">【歴史・由緒】</strong>
                <p className="mt-1">{modalSpot.history}</p>
              </div>
              <div>
                <strong className="text-stone-900">【門前名物・グルメ】</strong>
                <p className="mt-1">{modalSpot.gourmet}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}