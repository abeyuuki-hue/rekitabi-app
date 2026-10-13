'use client';

import React from 'react';
import { SanpaiVisitLog } from '@/types/sanpai';

interface SanpaiLogListProps {
  logs: SanpaiVisitLog[];
  onDeleteLog: (id: string) => void;
  onGoToStampTab: () => void;
}

export default function SanpaiLogList({
  logs,
  onDeleteLog,
  onGoToStampTab,
}: SanpaiLogListProps) {
  return (
    <main className="max-w-md mx-auto p-4 space-y-4">
      {/* タイトルバナー */}
      <div className="bg-white p-3.5 rounded-xl border border-amber-900/10 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-shrine-darkred flex items-center gap-1.5">
            <span>📔</span> 参拝記録帳（和紙の手記）
          </h2>
          <p className="text-[11px] text-stone-500 mt-0.5">参拝した社寺での祈願・感想の個人日誌</p>
        </div>
        <div className="bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 text-xs font-bold text-amber-900">
          全 {logs.length} 件
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-stone-300 p-8 text-center text-stone-500 space-y-3 shadow-xs">
          <div className="text-4xl">⛩️</div>
          <p className="text-xs font-bold">まだ参拝記録がありません</p>
          <p className="text-[11px] text-stone-400">
            社寺の詳細画面から「参拝記録をつける」を選ぶと、参拝日やお願いごと、感想をここに綴ることができます。
          </p>
          <button
            onClick={onGoToStampTab}
            className="mt-2 px-4 py-2 bg-shrine-darkred hover:bg-red-900 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
          >
            📜 御朱印帳から社寺をさがす
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => {
            const dateStr = new Date(log.visitedAt).toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={log.id}
                className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm space-y-2 relative"
              >
                <div className="flex items-start justify-between border-b border-stone-100 pb-2">
                  <div>
                    <span className="text-[10px] text-stone-400 font-bold">
                      {dateStr} {log.weather && `・ ${log.weather}`}
                    </span>
                    <h3 className="text-sm font-bold text-stone-900 mt-0.5">
                      ⛩️ {log.spotName}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {log.isStamped && (
                      <span className="bg-red-50 text-shrine-darkred border border-red-200 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        朱印受領済
                      </span>
                    )}
                    <button
                      onClick={() => onDeleteLog(log.id)}
                      className="text-stone-300 hover:text-red-600 text-xs font-bold p-1 transition-colors"
                      title="記録を削除"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {log.prayer && (
                  <div className="text-xs bg-amber-50/60 text-amber-900 px-2.5 py-1 rounded border border-amber-900/10">
                    <span className="font-bold">【願意】</span> {log.prayer}
                  </div>
                )}

                <p className="text-xs text-stone-700 whitespace-pre-wrap leading-relaxed">
                  {log.notes}
                </p>

                {log.rating && (
                  <div className="flex items-center text-amber-400 text-xs">
                    {'★'.repeat(log.rating)}
                    {'☆'.repeat(5 - log.rating)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
