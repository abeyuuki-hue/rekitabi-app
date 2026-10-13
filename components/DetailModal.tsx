'use client';

import React from 'react';
import { ShrineSpot } from '@/types/spot';

interface DetailModalProps {
  spot: ShrineSpot | null;
  isStamped: boolean;
  onClose: () => void;
  onCheckIn: (spot: ShrineSpot) => void;
}

export default function DetailModal({ spot, isStamped, onClose, onCheckIn }: DetailModalProps) {
  if (!spot) return null;

  const stampLines = spot.stampName.split('\n');

  return (
    <div
      className="fixed inset-0 z-[2000] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto p-5 shadow-2xl border border-stone-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 閉じるボタン */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 bg-stone-100 rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm"
        >
          ✕
        </button>

        {/* ヘッダー情報 */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] bg-red-100 text-shrine-darkred px-2 py-0.5 rounded-full font-bold">
            📍 {spot.prefecture}
          </span>
          {isStamped && (
            <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
              💮 参拝完了
            </span>
          )}
        </div>

        <h2 className="text-xl font-bold text-stone-900 mt-1 mb-3">{spot.name}</h2>

        {/* 朱印印影 */}
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 my-3 flex items-center justify-center gap-4">
          <div
            className={`w-20 h-20 border-2 border-shrine-darkred rounded-full flex flex-col items-center justify-center text-xs font-bold leading-tight transition-transform ${
              isStamped
                ? 'opacity-100 text-shrine-darkred -rotate-6 shadow-inner bg-red-50/50 ring-2 ring-shrine-darkred/20'
                : 'opacity-30 text-stone-400 bg-stone-100'
            }`}
            style={{ fontFamily: 'serif' }}
          >
            {isStamped ? (
              stampLines.map((line, i) => (
                <div key={i} className="tracking-tighter">
                  {line}
                </div>
              ))
            ) : (
              <span className="text-[10px]">未押印</span>
            )}
          </div>
          <div className="text-xs text-stone-600 space-y-1">
            <p className="font-bold text-stone-800">【御朱印印影】</p>
            <p className="text-[11px] text-stone-500 whitespace-pre-line">{spot.stampName}</p>
            <p className="text-[10px] text-stone-400">
              {isStamped ? '参拝済みとして記録されています' : '参拝時にGPSで押印できます'}
            </p>
          </div>
        </div>

        {/* 由緒・解説 */}
        <div className="space-y-4 text-xs text-stone-700 mt-4">
          <div>
            <h3 className="font-bold text-stone-900 border-l-4 border-shrine-darkred pl-2 mb-1 text-xs">
              由緒・解説
            </h3>
            <p className="leading-relaxed text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
              {spot.history || spot.desc}
            </p>
          </div>

          {/* ご祭神 */}
          {spot.deity && (
            <div>
              <h3 className="font-bold text-stone-900 border-l-4 border-shrine-darkred pl-2 mb-1 text-xs">
                ご祭神
              </h3>
              <p className="leading-relaxed text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100 text-[11px]">
                ⛩️ {spot.deity}
              </p>
            </div>
          )}

          {/* 参拝時間 */}
          {spot.sanpaiTime && (
            <div>
              <h3 className="font-bold text-stone-900 border-l-4 border-shrine-darkred pl-2 mb-1 text-xs">
                参拝・開門時間
              </h3>
              <p className="leading-relaxed text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100 text-[11px]">
                🕒 {spot.sanpaiTime}
              </p>
            </div>
          )}

          {/* ご利益 */}
          {spot.benefits && spot.benefits.length > 0 && (
            <div>
              <h3 className="font-bold text-stone-900 border-l-4 border-shrine-darkred pl-2 mb-1.5 text-xs">
                主なご利益
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {spot.benefits.map((b, i) => (
                  <span
                    key={i}
                    className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md text-[11px] font-medium"
                  >
                    ✨ {b}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 参拝ポイント */}
          {spot.sanpaiPoint && (
            <div>
              <h3 className="font-bold text-stone-900 border-l-4 border-shrine-darkred pl-2 mb-1 text-xs">
                参拝のポイント
              </h3>
              <p className="leading-relaxed text-stone-600 bg-red-50/40 p-2.5 rounded-lg border border-red-100 text-[11px]">
                {spot.sanpaiPoint}
              </p>
            </div>
          )}

          {/* 周辺グルメ・見どころ */}
          {spot.gourmet && (
            <div>
              <h3 className="font-bold text-stone-900 border-l-4 border-shrine-darkred pl-2 mb-1 text-xs">
                周辺グルメ・立ち寄り処
              </h3>
              <p className="leading-relaxed text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100 text-[11px]">
                🥢 {spot.gourmet}
              </p>
            </div>
          )}
        </div>

        {/* アクションボタン */}
        <div className="mt-6 pt-3 border-t border-stone-100 space-y-2">
          {!isStamped && (
            <button
              type="button"
              onClick={() => onCheckIn(spot)}
              className="w-full py-2.5 rounded-lg font-bold text-xs text-white bg-shrine-darkred hover:bg-red-900 transition-colors shadow-md flex items-center justify-center gap-1.5"
            >
              <span>📍</span> 参拝して御朱印を押す (GPS判定)
            </button>
          )}

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${spot.lat},${spot.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 rounded-lg font-bold text-xs text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors text-center block"
          >
            🗺️ Googleマップで経路を見る
          </a>
        </div>
      </div>
    </div>
  );
}
