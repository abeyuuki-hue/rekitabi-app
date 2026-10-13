'use client';

import React, { useState } from 'react';
import { ShrineSpot } from '@/types/spot';
import { SanpaiVisitLog } from '@/types/sanpai';

interface DetailModalProps {
  spot: ShrineSpot;
  isStamped: boolean;
  onClose: () => void;
  onCheckIn: (spot: ShrineSpot) => void;
  onSaveLog: (log: Omit<SanpaiVisitLog, 'id'>) => void;
}

export default function DetailModal({
  spot,
  isStamped,
  onClose,
  onCheckIn,
  onSaveLog,
}: DetailModalProps) {
  const [modalTab, setModalTab] = useState<'history' | 'sanpai' | 'record'>('history');

  // Form states for visit log
  const [visitedDate, setVisitedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [weather, setWeather] = useState('晴れ');
  const [prayer, setPrayer] = useState('');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(5);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmitLog = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveLog({
      spotId: spot.id,
      spotName: spot.name,
      visitedAt: new Date(visitedDate).toISOString(),
      weather,
      prayer,
      notes,
      rating,
      isStamped,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] flex flex-col relative shadow-2xl overflow-hidden border border-amber-900/10">
        {/* ヘッダー */}
        <div className="bg-shrine-darkred text-white p-4 relative border-b-2 border-shrine-gold">
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-amber-200 hover:text-white text-2xl font-bold leading-none"
            aria-label="閉じる"
          >
            &times;
          </button>
          <span className="text-[10px] text-amber-200 tracking-wider">📍 {spot.prefecture}・{spot.region}</span>
          <h2 className="text-lg font-bold tracking-wide mt-0.5">⛩️ {spot.name}</h2>
          <p className="text-xs text-amber-100/90 mt-0.5">印銘：{spot.stampName.replace('\n', ' ')}</p>
        </div>

        {/* モーダルタブ切り替え */}
        <div className="flex border-b border-stone-200 bg-stone-50 text-xs font-bold">
          <button
            onClick={() => setModalTab('history')}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
              modalTab === 'history'
                ? 'border-shrine-darkred text-shrine-darkred bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            📜 由緒・名物
          </button>
          <button
            onClick={() => setModalTab('sanpai')}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
              modalTab === 'sanpai'
                ? 'border-shrine-darkred text-shrine-darkred bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            🙏 祭神・ご利益
          </button>
          <button
            onClick={() => setModalTab('record')}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
              modalTab === 'record'
                ? 'border-shrine-darkred text-shrine-darkred bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            📔 参拝記録をつける
          </button>
        </div>

        {/* コンテンツエリア */}
        <div className="p-4 overflow-y-auto flex-1 text-xs space-y-3 leading-relaxed text-stone-700">
          {modalTab === 'history' && (
            <div className="space-y-3">
              <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-900/10">
                <strong className="text-shrine-darkred flex items-center gap-1 font-bold">
                  <span>📜</span> 歴史・由緒
                </strong>
                <p className="mt-1 text-stone-700 leading-normal">{spot.history}</p>
              </div>

              <div className="bg-orange-50/50 p-3 rounded-xl border border-orange-900/10">
                <strong className="text-orange-900 flex items-center gap-1 font-bold">
                  <span>🍵</span> 門前名物・グルメ
                </strong>
                <p className="mt-1 text-stone-700 leading-normal">{spot.gourmet}</p>
              </div>

              {spot.officialUrl && (
                <div className="pt-1 text-right">
                  <a
                    href={spot.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-shrine-darkred underline text-[11px] font-bold"
                  >
                    公式サイトを開く ↗
                  </a>
                </div>
              )}
            </div>
          )}

          {modalTab === 'sanpai' && (
            <div className="space-y-3">
              {spot.enshrinedDeities && spot.enshrinedDeities.length > 0 && (
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <strong className="text-stone-900 flex items-center gap-1 font-bold">
                    <span>✨</span> 御祭神（主祭神・配祀神）
                  </strong>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {spot.enshrinedDeities.map((deity, idx) => (
                      <span
                        key={idx}
                        className="bg-white px-2 py-0.5 rounded border border-stone-300 font-bold text-stone-800"
                      >
                        {deity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {spot.blessings && spot.blessings.length > 0 && (
                <div className="bg-red-50/40 p-3 rounded-xl border border-red-900/10">
                  <strong className="text-shrine-darkred flex items-center gap-1 font-bold">
                    <span>🌟</span> 主なご利益・祈願
                  </strong>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {spot.blessings.map((blessing, idx) => (
                      <span
                        key={idx}
                        className="bg-shrine-darkred text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-xs"
                      >
                        {blessing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {spot.etiquetteNotes && (
                <div className="bg-amber-50/40 p-3 rounded-xl border border-amber-900/10">
                  <strong className="text-amber-900 flex items-center gap-1 font-bold">
                    <span>⛩️</span> 参拝の心得・境内の作法
                  </strong>
                  <p className="mt-1 text-stone-700 leading-normal">{spot.etiquetteNotes}</p>
                </div>
              )}
            </div>
          )}

          {modalTab === 'record' && (
            <form onSubmit={handleSubmitLog} className="space-y-3">
              {savedSuccess && (
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded text-center font-bold">
                  ✨ 参拝記録を保存しました！
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">参拝日</label>
                <input
                  type="date"
                  value={visitedDate}
                  onChange={(e) => setVisitedDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded p-1.5 text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">天気</label>
                <select
                  value={weather}
                  onChange={(e) => setWeather(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded p-1.5 text-xs font-bold"
                >
                  <option value="晴れ">☀️ 晴れ</option>
                  <option value="曇り">☁️ 曇り</option>
                  <option value="雨">🌧️ 雨</option>
                  <option value="雪">❄️ 雪</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">願意・祈願したこと</label>
                <input
                  type="text"
                  value={prayer}
                  onChange={(e) => setPrayer(e.target.value)}
                  placeholder="例：家内安全、良縁成就、心身健康"
                  className="w-full bg-stone-50 border border-stone-300 rounded p-1.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">参拝日記・感想</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="境内の雰囲気、御朱印の墨書き、門前の茶屋での出来事など..."
                  className="w-full bg-stone-50 border border-stone-300 rounded p-1.5 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">心の充実度</label>
                <div className="flex gap-2 items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-lg transition-transform ${rating >= star ? 'text-amber-400 scale-110' : 'text-stone-300'}`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-stone-500 font-bold ml-2">（{rating}/5）</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-stone-800 hover:bg-stone-900 text-white font-bold rounded-lg shadow-sm transition-colors"
              >
                💾 記録帳に保存する
              </button>
            </form>
          )}
        </div>

        {/* フッターアクション */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 flex gap-2">
          <button
            onClick={() => onCheckIn(spot)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold text-white shadow-sm transition-colors ${
              isStamped ? 'bg-stone-600 hover:bg-stone-700' : 'bg-shrine-darkred hover:bg-red-900'
            }`}
          >
            {isStamped ? '✅ 押印済み (再確認)' : '📍 境内GPSで押印する'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold rounded-lg transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
