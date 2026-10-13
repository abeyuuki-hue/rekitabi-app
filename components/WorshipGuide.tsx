'use client';

import React, { useState } from 'react';

const FORTUNES = [
  { rank: '大吉', word: '誠の心に通ず', advice: '日頃の行いが神慮にかない、運気は最高潮。感謝を忘れず進めば大願成就。' },
  { rank: '中吉', word: '一歩一歩の歩み', advice: '静かに努力を積み重ねるとき。社寺の清らかな風に触れることで道が開けます。' },
  { rank: '吉', word: '和顔愛語の徳', advice: '周囲への優しい思いやりが福を呼びます。神社境内の散策で良縁あり。' },
  { rank: '小吉', word: '心静かに待つ', advice: '焦りは禁物。手水で身を清めるように、心を穏やかに整えることで好機到来。' },
  { rank: '末吉', word: '末広の兆し', advice: '始めは苦労があれど、次第に道は開けます。古社の歴史に学び足元を固めよ。' },
];

export default function WorshipGuide() {
  const [activeGuide, setActiveGuide] = useState<'temizu' | 'hairei' | 'omikuji'>('temizu');
  const [omikujiResult, setOmikujiResult] = useState<typeof FORTUNES[0] | null>(null);

  const handleDrawOmikuji = () => {
    const randomIndex = Math.floor(Math.random() * FORTUNES.length);
    setOmikujiResult(FORTUNES[randomIndex]);
  };

  return (
    <main className="max-w-md mx-auto p-4 space-y-4">
      {/* ナビゲーションセレクター */}
      <div className="flex border border-stone-200 rounded-xl overflow-hidden bg-white shadow-sm text-xs font-bold">
        <button
          onClick={() => setActiveGuide('temizu')}
          className={`flex-1 py-2.5 text-center transition-colors ${
            activeGuide === 'temizu'
              ? 'bg-shrine-darkred text-white'
              : 'text-stone-600 hover:bg-stone-50'
          }`}
        >
          💧 手水舎の作法
        </button>
        <button
          onClick={() => setActiveGuide('hairei')}
          className={`flex-1 py-2.5 text-center transition-colors border-x border-stone-200 ${
            activeGuide === 'hairei'
              ? 'bg-shrine-darkred text-white'
              : 'text-stone-600 hover:bg-stone-50'
          }`}
        >
          🙏 二礼二拍手一礼
        </button>
        <button
          onClick={() => setActiveGuide('omikuji')}
          className={`flex-1 py-2.5 text-center transition-colors ${
            activeGuide === 'omikuji'
              ? 'bg-shrine-darkred text-white'
              : 'text-stone-600 hover:bg-stone-50'
          }`}
        >
          🥠 今日の御神籤
        </button>
      </div>

      {/* 手水舎の作法 */}
      {activeGuide === 'temizu' && (
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm space-y-3">
          <div className="border-b border-stone-100 pb-2">
            <h2 className="text-sm font-bold text-shrine-darkred flex items-center gap-1.5">
              <span>💧</span> 手水舎（てみずや）の作法
            </h2>
            <p className="text-[11px] text-stone-500 mt-0.5">
              神域に入る前に、心と身体の穢れを祓い清める大切な儀式です。一口の水で清めます。
            </p>
          </div>

          <ol className="space-y-3 text-xs">
            <li className="flex gap-2.5 items-start bg-blue-50/40 p-2.5 rounded-lg border border-blue-900/10">
              <span className="w-5 h-5 rounded-full bg-shrine-darkred text-white font-bold flex items-center justify-center text-[10px] shrink-0">1</span>
              <div>
                <strong className="text-stone-900 font-bold">右手に柄杓を持ち、左手を清める</strong>
                <p className="text-stone-600 text-[11px] mt-0.5">柄杓に水を汲み、左手に注いで清めます。</p>
              </div>
            </li>
            <li className="flex gap-2.5 items-start bg-blue-50/40 p-2.5 rounded-lg border border-blue-900/10">
              <span className="w-5 h-5 rounded-full bg-shrine-darkred text-white font-bold flex items-center justify-center text-[10px] shrink-0">2</span>
              <div>
                <strong className="text-stone-900 font-bold">左手に柄杓を持ち替え、右手を清める</strong>
                <p className="text-stone-600 text-[11px] mt-0.5">柄杓を持ち替え、同様に右手を清めます。</p>
              </div>
            </li>
            <li className="flex gap-2.5 items-start bg-blue-50/40 p-2.5 rounded-lg border border-blue-900/10">
              <span className="w-5 h-5 rounded-full bg-shrine-darkred text-white font-bold flex items-center justify-center text-[10px] shrink-0">3</span>
              <div>
                <strong className="text-stone-900 font-bold">右手に戻し、左手で口をすすぐ</strong>
                <p className="text-stone-600 text-[11px] mt-0.5">柄杓に直接口をつけず、左の手のひらに水を受けて口をすすぎます。</p>
              </div>
            </li>
            <li className="flex gap-2.5 items-start bg-blue-50/40 p-2.5 rounded-lg border border-blue-900/10">
              <span className="w-5 h-5 rounded-full bg-shrine-darkred text-white font-bold flex items-center justify-center text-[10px] shrink-0">4</span>
              <div>
                <strong className="text-stone-900 font-bold">左手を清め、柄杓の柄を洗い流す</strong>
                <p className="text-stone-600 text-[11px] mt-0.5">口をつけた左手を洗い、最後に柄杓を立てて柄に残りの水を流し、伏せて置きます。</p>
              </div>
            </li>
          </ol>
        </div>
      )}

      {/* 拝礼の作法 */}
      {activeGuide === 'hairei' && (
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm space-y-3">
          <div className="border-b border-stone-100 pb-2">
            <h2 className="text-sm font-bold text-shrine-darkred flex items-center gap-1.5">
              <span>🙏</span> 二礼二拍手一礼（拝礼の基本）
            </h2>
            <p className="text-[11px] text-stone-500 mt-0.5">
              本殿正面の御神前に進み、神様にご挨拶と感謝の誠を捧げる正式な作法です。
            </p>
          </div>

          <ol className="space-y-3 text-xs">
            <li className="flex gap-2.5 items-start bg-red-50/30 p-2.5 rounded-lg border border-red-900/10">
              <span className="w-5 h-5 rounded-full bg-shrine-darkred text-white font-bold flex items-center justify-center text-[10px] shrink-0">1</span>
              <div>
                <strong className="text-stone-900 font-bold">御賽銭を入れて軽く一礼（会釈）</strong>
                <p className="text-stone-600 text-[11px] mt-0.5">お賽銭箱に静かに納め、鈴があれば鳴らして神様をお招きします。</p>
              </div>
            </li>
            <li className="flex gap-2.5 items-start bg-red-50/30 p-2.5 rounded-lg border border-red-900/10">
              <span className="w-5 h-5 rounded-full bg-shrine-darkred text-white font-bold flex items-center justify-center text-[10px] shrink-0">2</span>
              <div>
                <strong className="text-stone-900 font-bold">深く二礼（二回のお辞儀）</strong>
                <p className="text-stone-600 text-[11px] mt-0.5">背筋を伸ばし、腰を約90度折って深く2回頭を下げます。</p>
              </div>
            </li>
            <li className="flex gap-2.5 items-start bg-red-50/30 p-2.5 rounded-lg border border-red-900/10">
              <span className="w-5 h-5 rounded-full bg-shrine-darkred text-white font-bold flex items-center justify-center text-[10px] shrink-0">3</span>
              <div>
                <strong className="text-stone-900 font-bold">二拍手（二回手を打つ）</strong>
                <p className="text-stone-600 text-[11px] mt-0.5">胸の高さで両手を合わせ、右手を少し引いて指先をずらしてから、パンパンと2回打ちます。</p>
              </div>
            </li>
            <li className="flex gap-2.5 items-start bg-red-50/30 p-2.5 rounded-lg border border-red-900/10">
              <span className="w-5 h-5 rounded-full bg-shrine-darkred text-white font-bold flex items-center justify-center text-[10px] shrink-0">4</span>
              <div>
                <strong className="text-stone-900 font-bold">祈念（祈願・感謝）</strong>
                <p className="text-stone-600 text-[11px] mt-0.5">ずらした右手を戻して揃え、心の中で日頃の感謝とお願いごとを申し上げます。</p>
              </div>
            </li>
            <li className="flex gap-2.5 items-start bg-red-50/30 p-2.5 rounded-lg border border-red-900/10">
              <span className="w-5 h-5 rounded-full bg-shrine-darkred text-white font-bold flex items-center justify-center text-[10px] shrink-0">5</span>
              <div>
                <strong className="text-stone-900 font-bold">深く一礼して退く</strong>
                <p className="text-stone-600 text-[11px] mt-0.5">両手を下ろし、最後にもう一度深くお辞儀をして静かに下がります。</p>
              </div>
            </li>
          </ol>
        </div>
      )}

      {/* 今日の御神籤 */}
      {activeGuide === 'omikuji' && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm text-center space-y-4">
          <div className="border-b border-stone-100 pb-2">
            <h2 className="text-sm font-bold text-shrine-darkred flex items-center justify-center gap-1.5">
              <span>🥠</span> 参拝者の日々の御神籤（おみくじ）
            </h2>
            <p className="text-[11px] text-stone-500 mt-0.5">
              今日の心の道標として、御神籤を引いてみましょう。
            </p>
          </div>

          {!omikujiResult ? (
            <div className="py-6 space-y-3">
              <div className="text-5xl animate-bounce">⛩️</div>
              <p className="text-xs text-stone-600">
                心を穏やかに整えて、下の筒を振ってください。
              </p>
              <button
                onClick={handleDrawOmikuji}
                className="px-6 py-2.5 bg-shrine-darkred hover:bg-red-900 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-95"
              >
                🥠 御神籤を引く
              </button>
            </div>
          ) : (
            <div className="bg-amber-50/60 border-2 border-shrine-gold rounded-2xl p-4 space-y-3 animate-fadeIn">
              <span className="text-[10px] text-stone-500 tracking-wider">【神託・本日の運勢】</span>
              <div className="text-3xl font-black text-shrine-darkred tracking-widest my-1">
                {omikujiResult.rank}
              </div>
              <div className="text-xs font-bold text-stone-800 bg-white/80 py-1 px-3 rounded-full inline-block border border-amber-900/10">
                御言：{omikujiResult.word}
              </div>
              <p className="text-xs text-stone-700 leading-relaxed max-w-xs mx-auto">
                {omikujiResult.advice}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setOmikujiResult(null)}
                  className="text-[11px] text-stone-500 underline font-bold"
                >
                  もう一度引く
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
