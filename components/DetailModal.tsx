'use client';

import React, { useRef, useState } from 'react';
import { ShrineSpot } from '@/types/spot';
import { SanpaiVisitLog } from '@/types/sanpai';
import { getDeityCharacterForSpot } from '@/lib/story_data';
import DeityAvatarSvg, { getVisualStyleEmoji } from './DeityAvatarSvg';

interface DetailModalProps {
  spot: ShrineSpot;
  isStamped: boolean;
  onClose: () => void;
  onCheckIn: (spot: ShrineSpot) => void;
  onSaveLog: (log: Omit<SanpaiVisitLog, 'id'>) => void;
  isHomeSpot?: boolean;
  onSetHomeSpot?: (spotId: string) => void;
  goshuinPhoto?: string;
  onSaveGoshuinPhoto?: (spotId: string, dataUrl: string) => void;
  onDeleteGoshuinPhoto?: (spotId: string) => void;
}

/**
 * クライアント側で撮影・選択した画像をCanvasで最大720pxの軽量JPEGに圧縮してDataURLを返す
 */
async function compressImageToDataUrl(file: File, maxDim = 720, quality = 0.78): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height >= width && height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export default function DetailModal({
  spot,
  isStamped,
  onClose,
  onCheckIn,
  onSaveLog,
  isHomeSpot = false,
  onSetHomeSpot,
  goshuinPhoto,
  onSaveGoshuinPhoto,
  onDeleteGoshuinPhoto,
}: DetailModalProps) {
  const [modalTab, setModalTab] = useState<'history' | 'photo' | 'sanpai' | 'record'>('history');

  // Form states for visit log
  const [visitedDate, setVisitedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [weather, setWeather] = useState('晴れ');
  const [prayer, setPrayer] = useState('');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(5);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Real Goshuin photo states
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoSavedBanner, setPhotoSavedBanner] = useState(false);

  const guardianChar = getDeityCharacterForSpot(spot);

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

  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onSaveGoshuinPhoto) return;
    setIsUploadingPhoto(true);
    try {
      const compressedDataUrl = await compressImageToDataUrl(file);
      onSaveGoshuinPhoto(spot.id, compressedDataUrl);
      setPhotoSavedBanner(true);
      setTimeout(() => setPhotoSavedBanner(false), 3000);
    } catch (err) {
      console.error(err);
      alert('画像の読み込みに失敗しました。別の写真でお試しください。');
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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
          <div className="flex items-center gap-1.5 flex-wrap pr-6">
            <span className="text-[10px] text-amber-200 tracking-wider">
              📍 {spot.prefecture}・{spot.region}
            </span>
            {isHomeSpot && (
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-bold shadow-xs">
                🏮 ホーム（本宮）設定中
              </span>
            )}
            {goshuinPhoto && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-stone-950 text-[10px] font-bold shadow-xs">
                📷 実物御朱印あり
              </span>
            )}
          </div>
          <h2 className="text-lg font-bold tracking-wide mt-0.5">⛩️ {spot.name}</h2>
          <p className="text-xs text-amber-100/90 mt-0.5">印銘：{spot.stampName.replaceAll('\n', ' ')}</p>
        </div>

        {/* モーダルタブ切り替え */}
        <div className="grid grid-cols-4 border-b border-stone-200 bg-stone-50 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setModalTab('history')}
            className={`py-2.5 text-center transition-colors border-b-2 ${
              modalTab === 'history'
                ? 'border-shrine-darkred text-shrine-darkred bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            📜 由緒・名物
          </button>
          <button
            type="button"
            onClick={() => setModalTab('photo')}
            className={`py-2.5 text-center transition-colors border-b-2 relative ${
              modalTab === 'photo'
                ? 'border-shrine-darkred text-shrine-darkred bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            📷 実物御朱印
            {goshuinPhoto && (
              <span className="ml-0.5 inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 align-middle" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setModalTab('sanpai')}
            className={`py-2.5 text-center transition-colors border-b-2 ${
              modalTab === 'sanpai'
                ? 'border-shrine-darkred text-shrine-darkred bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            🙏 祭神・本宮
          </button>
          <button
            type="button"
            onClick={() => setModalTab('record')}
            className={`py-2.5 text-center transition-colors border-b-2 ${
              modalTab === 'record'
                ? 'border-shrine-darkred text-shrine-darkred bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            📔 参拝記録
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

              {/* 実物御朱印＆ホーム設定へのクイック誘導カード */}
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getVisualStyleEmoji(guardianChar.visualStyle)}</span>
                  <div>
                    <div className="text-[11px] font-bold text-stone-800">
                      守護キャラ：{guardianChar.charaName}
                    </div>
                    <div className="text-[10px] text-stone-500">
                      実物御朱印の撮影保存・ホーム本宮設定が可能
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setModalTab('photo')}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-[10px] shrink-0 shadow-xs"
                >
                  📷 撮影・本宮へ
                </button>
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

          {modalTab === 'photo' && (
            <div className="space-y-3">
              {/* 本物の御朱印を撮影・保存するセクション */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 p-3.5 rounded-xl border border-amber-900/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <strong className="text-shrine-darkred flex items-center gap-1 font-bold text-xs">
                    <span>📷</span> 現地で授かった本物の御朱印を撮影・保存
                  </strong>
                  <span className="px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-950 text-[10px] font-bold">
                    初回保存で神力 +50✨
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  社務所・授与所でいただいた実物の御朱印帳をスマホのカメラで撮影（またはアルバムから選択）して、あなただけのデジタル御朱印帳に永久保存できます。
                </p>

                {photoSavedBanner && (
                  <div className="p-2 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-lg text-center font-bold text-[11px]">
                    ✨ 本物の御朱印写真を保存しました！（神力が宿りました）
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoFileChange}
                  className="hidden"
                />

                {goshuinPhoto ? (
                  <div className="space-y-2">
                    <div className="relative rounded-xl overflow-hidden border-2 border-amber-700/40 bg-stone-900 shadow-md">
                      <img
                        src={goshuinPhoto}
                        alt={`${spot.name}の実物御朱印`}
                        className="w-full max-h-72 object-contain mx-auto"
                      />
                      <div className="bg-black/75 text-amber-200 px-3 py-1.5 text-[10px] flex justify-between items-center">
                        <span>⛩️ {spot.name}（実物御朱印）</span>
                        <span>保存済み</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={isUploadingPhoto}
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 py-2 rounded-lg bg-shrine-darkred hover:bg-red-900 text-white font-bold text-xs shadow-xs"
                      >
                        📷 写真を撮り直す / 変更
                      </button>
                      {onDeleteGoshuinPhoto && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm('保存した実物御朱印の写真を削除しますか？')) {
                              onDeleteGoshuinPhoto(spot.id);
                            }
                          }}
                          className="px-3 py-2 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold text-xs"
                        >
                          🗑️ 削除
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={isUploadingPhoto}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-shrine-darkred to-red-800 hover:from-red-800 hover:to-red-900 text-white font-bold text-xs shadow-md flex flex-col items-center justify-center gap-1 border border-amber-400/40"
                  >
                    <span className="text-lg">📸 カメラを起動して本物の御朱印を撮影 / 写真選択</span>
                    <span className="text-[10px] text-amber-200 font-normal">
                      {isUploadingPhoto ? '画像を最適化して保存中...' : 'スマホのカメラまたは写真フォルダから登録できます'}
                    </span>
                  </button>
                )}
              </div>

              {/* このスポットの守護デフォルメキャラ＆ホーム（本宮）設定 */}
              <div className="bg-stone-900 text-white p-3.5 rounded-xl border border-amber-500/30 space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="shrink-0">
                    <DeityAvatarSvg character={guardianChar} awakeningLevel={3} size={76} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[9px] font-bold">
                      {guardianChar.title}
                    </span>
                    <h4 className="text-sm font-bold text-amber-200 mt-1">
                      {getVisualStyleEmoji(guardianChar.visualStyle)} {guardianChar.charaName}
                    </h4>
                    <p className="text-[10px] text-stone-300 mt-0.5 leading-snug">
                      由来：{guardianChar.originDeity}（神器：{guardianChar.companionItem}）
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-stone-300 bg-black/30 p-2.5 rounded-lg border border-white/10 leading-relaxed">
                  {guardianChar.catchphrase}
                </p>
                {onSetHomeSpot && (
                  <button
                    type="button"
                    disabled={isHomeSpot}
                    onClick={() => onSetHomeSpot(spot.id)}
                    className={`w-full py-2 rounded-lg font-bold text-xs transition-all ${
                      isHomeSpot
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 cursor-default'
                        : 'bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-sm'
                    }`}
                  >
                    {isHomeSpot
                      ? '🏮 現在この社寺がホーム（本宮）に設定されています'
                      : `🏠 【${spot.name}】をホーム（本宮）に設定して${guardianChar.charaName}を授かる`}
                  </button>
                )}
              </div>
            </div>
          )}

          {modalTab === 'sanpai' && (
            <div className="space-y-3">
              {/* 守護デフォルメキャラ紹介 */}
              <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-900/15 flex items-center justify-between gap-2">
                <div>
                  <strong className="text-shrine-darkred flex items-center gap-1 font-bold">
                    <span>{getVisualStyleEmoji(guardianChar.visualStyle)}</span> 本宮設定時の守護キャラ：{guardianChar.charaName}
                  </strong>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    {guardianChar.originDeity}（神器：{guardianChar.companionItem}）
                  </p>
                </div>
                {onSetHomeSpot && !isHomeSpot && (
                  <button
                    type="button"
                    onClick={() => onSetHomeSpot(spot.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-shrine-darkred text-white font-bold text-[10px] shrink-0"
                  >
                    🏠 本宮にする
                  </button>
                )}
              </div>

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
            type="button"
            onClick={() => onCheckIn(spot)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold text-white shadow-sm transition-colors ${
              isStamped ? 'bg-stone-600 hover:bg-stone-700' : 'bg-shrine-darkred hover:bg-red-900'
            }`}
          >
            {isStamped ? '✅ 押印済み (再確認)' : '📍 境内GPSで押印 (+100神力)'}
          </button>
          <button
            type="button"
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
