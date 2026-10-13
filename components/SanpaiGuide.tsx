'use client';

import React from 'react';
import { ShrineSpot } from '@/types/spot';

interface SanpaiGuideProps {
  spots: ShrineSpot[];
  userStamps: Record<string, boolean>;
  onSelectSpot?: (spot: ShrineSpot) => void;
}

export default function SanpaiGuide({ spots, userStamps, onSelectSpot }: SanpaiGuideProps) {
  const stampedSpots = spots.filter((spot) => userStamps[spot.id]);

  return (
    <div className="max-w-md mx-auto p-4 pb-24 space-y-6">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-red-900 via-shrine-darkred to-red-950 text-white p-4 rounded-xl shadow-sm">
        <h2 className="text-base font-bold flex items-center gap-2">
          <span>📜</span> 神社参拝の心得と作法
        </h2>
        <p className="text-xs text-red-100 mt-1 leading-relaxed">
          神域に足を踏み入れる際の正しい作法と心得。心を整えてお参りしましょう。
        </p>
      </div>

      {/* 参拝作法ステップ */}
      <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-stone-800 border-b pb-2 flex items-center gap-1.5">
          <span className="text-shrine-darkred">⛩️</span> 基本の参拝作法（二礼二拍手一礼）
        </h3>

        <div className="space-y-3 text-xs text-stone-700">
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-shrine-darkred font-bold flex items-center justify-center text-xs">
              1
            </span>
            <div>
              <p className="font-bold text-stone-800">鳥居をくぐる（一礼）</p>
              <p className="text-stone-600 mt-0.5 leading-relaxed">
                鳥居の前で一度立ち止まり、浅く一礼（会釈）します。参道の中央（正中）は神様の通り道とされているため、端を歩くのが礼儀です。
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-shrine-darkred font-bold flex items-center justify-center text-xs">
              2
            </span>
            <div>
              <p className="font-bold text-stone-800">手水舎（てみずや）で清める</p>
              <p className="text-stone-600 mt-0.5 leading-relaxed">
                右手で柄杓を持ち左手を清め、左手に持ち替えて右手を清めます。再度右手で柄杓を持ち、左手に水を受けて口をすすぎ、最後に柄杓を立てて柄を清めます。
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-shrine-darkred font-bold flex items-center justify-center text-xs">
              3
            </span>
            <div>
              <p className="font-bold text-stone-800">賽銭と鈴</p>
              <p className="text-stone-600 mt-0.5 leading-relaxed">
                拝殿の前で軽く一礼し、お賽銭を静かに入れます。鈴がある場合は力強く鳴らして神様をお呼びします。
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-shrine-darkred font-bold flex items-center justify-center text-xs">
              4
            </span>
            <div>
              <p className="font-bold text-stone-800">二礼二拍手一礼（にれいにはくしゅいちれい）</p>
              <p className="text-stone-600 mt-0.5 leading-relaxed">
                深く二回お辞儀（礼）をし、胸の前で両手を合わせ右手を少し引いて二回手を打ちます。手を合わせて祈りを捧げた後、最後にもう一度深く一礼します。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 御朱印のいただき方 */}
      <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-stone-800 border-b pb-2 flex items-center gap-1.5">
          <span className="text-shrine-darkred">💮</span> 御朱印拝受の心得
        </h3>
        <ul className="text-xs text-stone-600 space-y-2 list-disc list-inside leading-relaxed">
          <li>御朱印は「参拝の証」です。必ず最初にお参りを済ませてから授与所に向かいましょう。</li>
          <li>初穂料はお釣りの出ないよう、小銭（300円〜500円程度）を事前に用意しておきます。</li>
          <li>御朱印帳は書いていただくページを開いて両手でお渡しします。</li>
          <li>書いていただいている間は静かに感謝の心でお待ちしましょう。</li>
        </ul>
      </div>

      {/* 参拝の記録一覧 */}
      <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
        <h3 className="text-sm font-bold text-stone-800 border-b pb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="text-shrine-darkred">📔</span> 参拝済みの神社一覧
          </span>
          <span className="text-xs font-normal text-stone-500">
            {stampedSpots.length} 社 参拝
          </span>
        </h3>

        {stampedSpots.length === 0 ? (
          <p className="text-xs text-stone-500 py-6 text-center">
            まだ参拝済みの神社はありません。
            <br />
            マップや一覧から神社を訪れてスタンプを獲得しましょう。
          </p>
        ) : (
          <div className="divide-y divide-stone-100 mt-2">
            {stampedSpots.map((spot) => (
              <div
                key={spot.id}
                onClick={() => onSelectSpot && onSelectSpot(spot)}
                className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-stone-50 px-1 rounded transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-red-100 text-shrine-darkred px-1.5 py-0.5 rounded font-bold">
                      {spot.prefecture}
                    </span>
                    <span className="text-xs font-bold text-stone-800">{spot.name}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">{spot.history || spot.desc}</p>
                </div>
                <span className="text-shrine-darkred text-sm">💮</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
