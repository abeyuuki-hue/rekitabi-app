'use client';

import React from 'react';
import { DeformedDeityCharacter, ShinryokuRewardArt } from '@/lib/story_data';

interface DeityAvatarSvgProps {
  character: DeformedDeityCharacter;
  awakeningLevel?: number; // 1..5
  size?: number;
  isOffering?: boolean;
  className?: string;
}

/**
 * ホーム神社（本宮）特有のデフォルメ守護神キャラSVGコンポーネント
 * 覚醒段階（Lv.1〜Lv.5）に応じて後光オーラ・神具の輝きが進化する
 */
export default function DeityAvatarSvg({
  character,
  awakeningLevel = 1,
  size = 140,
  isOffering = false,
  className = '',
}: DeityAvatarSvgProps) {
  const { primaryColor, secondaryColor, visualStyle, spotId } = character;
  const glowOpacity = Math.min(0.95, 0.2 + awakeningLevel * 0.15);

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* 献上時の波紋エフェクト */}
      {isOffering && (
        <>
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              background: `radial-gradient(circle, ${secondaryColor}88 0%, transparent 70%)`,
            }}
          />
          <span
            className="absolute -inset-3 rounded-full animate-pulse"
            style={{
              border: `2px solid ${secondaryColor}`,
              boxShadow: `0 0 25px ${primaryColor}`,
            }}
          />
        </>
      )}

      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className="overflow-visible drop-shadow-md"
      >
        <defs>
          <radialGradient id={`aura-${spotId}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={secondaryColor} stopOpacity={glowOpacity} />
            <stop offset="65%" stopColor={primaryColor} stopOpacity={glowOpacity * 0.55} />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`robe-${spotId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#fff8eb" />
            <stop offset="100%" stopColor={secondaryColor} />
          </linearGradient>
          <linearGradient id={`accent-${spotId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={secondaryColor} />
          </linearGradient>
        </defs>

        {/* 1. 背面神光オーラ（覚醒レベルに応じて多重化） */}
        <circle cx="100" cy="105" r="88" fill={`url(#aura-${spotId})`} />
        {awakeningLevel >= 2 && (
          <circle
            cx="100"
            cy="105"
            r="74"
            fill="none"
            stroke={secondaryColor}
            strokeWidth="2"
            strokeDasharray="6 4"
            opacity="0.7"
          />
        )}
        {awakeningLevel >= 3 && (
          <g opacity="0.75">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <line
                key={deg}
                x1="100"
                y1="105"
                x2={100 + 86 * Math.cos((deg * Math.PI) / 180)}
                y2={105 + 86 * Math.sin((deg * Math.PI) / 180)}
                stroke={secondaryColor}
                strokeWidth={awakeningLevel >= 5 ? '3' : '1.5'}
                strokeLinecap="round"
              />
            ))}
          </g>
        )}
        {awakeningLevel >= 4 && (
          <circle
            cx="100"
            cy="105"
            r="84"
            fill="none"
            stroke="#fff7cc"
            strokeWidth="2.5"
            opacity="0.85"
          />
        )}

        {/* 2. タイプ別の背面シンボル（狐尻尾・龍・翼・後光輪など） */}
        {visualStyle === 'inari_fox' && (
          <g>
            <path
              d="M45,145 Q15,115 35,85 Q55,100 62,130 Z"
              fill={secondaryColor}
              stroke={primaryColor}
              strokeWidth="2.5"
            />
            <path
              d="M155,145 Q185,115 165,85 Q145,100 138,130 Z"
              fill={secondaryColor}
              stroke={primaryColor}
              strokeWidth="2.5"
            />
          </g>
        )}
        {visualStyle === 'dragon_water' && (
          <path
            d="M30,135 Q15,85 55,60 Q95,35 145,60 Q185,85 170,135"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.65"
          />
        )}
        {visualStyle === 'mountain_tengu' && (
          <g fill="#334155" stroke="#0f172a" strokeWidth="2">
            <path d="M55,120 Q20,90 28,65 Q52,80 68,108 Z" />
            <path d="M145,120 Q180,90 172,65 Q148,80 132,108 Z" />
          </g>
        )}
        {visualStyle === 'buddha_lotus' && (
          <g fill="#fbcfe8" stroke="#db2777" strokeWidth="2">
            <ellipse cx="100" cy="168" rx="58" ry="15" />
            <path d="M55,165 Q70,142 85,165 Z" />
            <path d="M82,166 Q100,138 118,166 Z" />
            <path d="M115,165 Q130,142 145,165 Z" />
          </g>
        )}

        {/* 3. ちびキャラ胴体（巫女装束・神衣・狩衣） */}
        <path
          d="M64,166 L74,114 Q100,106 126,114 L136,166 Q100,174 64,166 Z"
          fill={`url(#robe-${spotId})`}
          stroke={primaryColor}
          strokeWidth="2.5"
        />
        {/* 袴・前垂れ */}
        <path
          d="M78,132 L122,132 L128,166 Q100,172 72,166 Z"
          fill={`url(#accent-${spotId})`}
          opacity="0.9"
        />
        {/* 襟元の合わせ */}
        <path
          d="M84,114 L100,134 L116,114"
          fill="none"
          stroke={primaryColor}
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* 勾玉の首飾り */}
        <circle cx="100" cy="127" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.2" />

        {/* 4. ちびキャラ頭部・髪 */}
        {/* 後ろ髪 */}
        <path
          d="M56,92 Q52,132 68,142 L132,142 Q148,132 144,92 Z"
          fill="#1e1b4b"
        />
        {/* 顔輪郭 */}
        <circle
          cx="100"
          cy="90"
          r="34"
          fill="#fff1e6"
          stroke="#e29578"
          strokeWidth="2"
        />
        {/* 前髪 */}
        <path
          d="M65,86 Q72,54 100,54 Q128,54 135,86 Q120,72 108,82 Q100,68 92,82 Q80,72 65,86 Z"
          fill="#1e1b4b"
        />

        {/* 5. 表情 */}
        {isOffering || awakeningLevel >= 4 ? (
          <>
            <ellipse cx="86" cy="93" rx="5.5" ry="6.5" fill="#1e1b4b" />
            <ellipse cx="114" cy="93" rx="5.5" ry="6.5" fill="#1e1b4b" />
            <circle cx="84" cy="90.5" r="2.2" fill="#ffffff" />
            <circle cx="112" cy="90.5" r="2.2" fill="#ffffff" />
            <circle cx="88" cy="95" r="1.2" fill={secondaryColor} />
            <circle cx="116" cy="95" r="1.2" fill={secondaryColor} />
            <path
              d="M93,106 Q100,113 107,106"
              fill="none"
              stroke="#e11d48"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            <ellipse cx="86" cy="93" rx="5" ry="6" fill="#1e1b4b" />
            <ellipse cx="114" cy="93" rx="5" ry="6" fill="#1e1b4b" />
            <circle cx="84" cy="91" r="2" fill="#ffffff" />
            <circle cx="112" cy="91" r="2" fill="#ffffff" />
            <path
              d="M95,106 Q100,110 105,106"
              fill="none"
              stroke="#e11d48"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </>
        )}
        <ellipse cx="76" cy="100" rx="5.5" ry="3" fill="#fda4af" opacity="0.7" />
        <ellipse cx="124" cy="100" rx="5.5" ry="3" fill="#fda4af" opacity="0.7" />

        {/* 6. タイプ別の頭飾り＆手持ち神具 */}
        {visualStyle === 'sun_lantern' && (
          <g>
            {/* 船橋大神宮：太陽の天冠＋灯明台 */}
            <circle
              cx="100"
              cy="46"
              r="12"
              fill="#fbbf24"
              stroke="#ea580c"
              strokeWidth="2.5"
            />
            <path
              d="M84,54 L100,34 L116,54 Z"
              fill="#fef08a"
              stroke="#ca8a04"
              strokeWidth="2"
            />
            <g transform="translate(142, 112)">
              <rect
                x="-10"
                y="0"
                width="20"
                height="26"
                rx="4"
                fill="#fef3c7"
                stroke="#d97706"
                strokeWidth="2.2"
              />
              <path d="M-13,0 L13,0 L8,-7 L-8,-7 Z" fill="#92400e" />
              <path
                d="M0,18 Q-6,12 0,4 Q6,12 0,18 Z"
                fill="#f97316"
              />
              <circle cx="0" cy="12" r="3" fill="#fef08a" />
            </g>
          </g>
        )}

        {visualStyle === 'amaterasu_mirror' && (
          <g>
            <circle
              cx="100"
              cy="46"
              r="11"
              fill="#fef08a"
              stroke="#d97706"
              strokeWidth="2.5"
            />
            <g transform="translate(144, 122)">
              <circle cx="0" cy="0" r="14" fill="#fde047" stroke="#b45309" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="9" fill="#fef9c3" />
            </g>
          </g>
        )}

        {visualStyle === 'inari_fox' && (
          <g>
            <path
              d="M68,62 L58,34 L84,52 Z"
              fill="#fb923c"
              stroke="#9a3412"
              strokeWidth="2"
            />
            <path
              d="M132,62 L142,34 L116,52 Z"
              fill="#fb923c"
              stroke="#9a3412"
              strokeWidth="2"
            />
            <circle cx="144" cy="124" r="11" fill="#f97316" stroke="#fef08a" strokeWidth="2.5" />
          </g>
        )}

        {visualStyle === 'enmusubi_rabbit' && (
          <g>
            <ellipse
              cx="80"
              cy="42"
              rx="7"
              ry="18"
              transform="rotate(-12 80 42)"
              fill="#ffffff"
              stroke="#f43f5e"
              strokeWidth="2"
            />
            <ellipse
              cx="120"
              cy="42"
              rx="7"
              ry="18"
              transform="rotate(12 120 42)"
              fill="#ffffff"
              stroke="#f43f5e"
              strokeWidth="2"
            />
            <circle cx="142" cy="124" r="10" fill="#fda4af" stroke="#e11d48" strokeWidth="2.5" />
          </g>
        )}

        {visualStyle === 'warrior_sword' && (
          <g>
            <path
              d="M72,54 L60,32 L88,48 L100,36 L112,48 L140,32 L128,54 Z"
              fill="#fbbf24"
              stroke="#92400e"
              strokeWidth="2"
            />
            <g transform="translate(146, 120) rotate(20)">
              <rect x="-3" y="-26" width="6" height="36" rx="2" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
              <rect x="-9" y="8" width="18" height="4" rx="1" fill="#fbbf24" />
            </g>
          </g>
        )}

        {visualStyle === 'dragon_water' && (
          <g>
            <path d="M76,54 Q66,32 82,28" fill="none" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
            <path d="M124,54 Q134,32 118,28" fill="none" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
            <circle cx="144" cy="124" r="11" fill="#38bdf8" stroke="#e0f2fe" strokeWidth="2.5" />
          </g>
        )}

        {visualStyle === 'tenjin_plum' && (
          <g>
            <circle cx="100" cy="46" r="9" fill="#f43f5e" stroke="#fef2f2" strokeWidth="2" />
            <rect x="134" y="114" width="20" height="12" rx="3" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
          </g>
        )}

        {visualStyle === 'mountain_tengu' && (
          <g>
            <polygon points="88,48 112,48 106,32 94,32" fill="#1e293b" stroke="#fbbf24" strokeWidth="2" />
            <circle cx="144" cy="124" r="11" fill="#10b981" stroke="#065f46" strokeWidth="2" />
          </g>
        )}

        {visualStyle === 'buddha_lotus' && (
          <g>
            <polygon points="82,52 100,30 118,52" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
            <circle cx="100" cy="74" r="2.5" fill="#fbbf24" />
          </g>
        )}

        {awakeningLevel >= 5 && (
          <g>
            <circle cx="38" cy="48" r="6" fill="#fef08a" />
            <circle cx="162" cy="48" r="6" fill="#fef08a" />
            <circle cx="30" cy="130" r="4.5" fill="#fde047" />
            <circle cx="170" cy="130" r="4.5" fill="#fde047" />
          </g>
        )}
      </svg>
    </div>
  );
}

export function getVisualStyleEmoji(style: DeformedDeityCharacter['visualStyle']): string {
  switch (style) {
    case 'sun_lantern':
      return '🏮☀️';
    case 'amaterasu_mirror':
      return '🪞✨';
    case 'inari_fox':
      return '🦊🌾';
    case 'warrior_sword':
      return '⚔️🛡️';
    case 'enmusubi_rabbit':
      return '🐇🎀';
    case 'dragon_water':
      return '🐉💧';
    case 'tenjin_plum':
      return '🌸📜';
    case 'mountain_tengu':
      return '⛰️🦅';
    case 'buddha_lotus':
      return '🪷🙏';
    default:
      return '⛩️✨';
  }
}

export function getRewardMotifEmoji(motif: ShinryokuRewardArt['motif']): string {
  switch (motif) {
    case 'lantern_sunrise':
      return '🏮🌅';
    case 'guardian_talisman':
      return '🧿✨';
    case 'golden_clouds':
      return '☁️🦚';
    case 'four_guardians':
      return '🐉🐅';
    case 'twin_dragons':
      return '🐲🌕';
    case 'three_sacred_mountains':
      return '⛰️☀️';
    case 'red_fuji':
      return '🗻☀️';
    case 'supreme_one_path':
      return '🗻🌈';
    default:
      return '⛩️';
  }
}

/**
 * 神力保持量によって解放される特典「御神影アートカード」プレビュー＆PNG保存ヘルパー
 */
export function downloadRewardArtCardPng(
  reward: ShinryokuRewardArt,
  character: DeformedDeityCharacter,
  homeSpotName: string
) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1520;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 背景グラデーション
  const grad = ctx.createLinearGradient(0, 0, 1080, 1520);
  grad.addColorStop(0, '#0f172a');
  grad.addColorStop(0.5, '#1e1b4b');
  grad.addColorStop(1, reward.themeColor || '#31102f');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 1520);

  // 黄金の後光
  const radial = ctx.createRadialGradient(540, 560, 40, 540, 560, 460);
  radial.addColorStop(0, `${character.secondaryColor}cc`);
  radial.addColorStop(0.5, `${character.primaryColor}55`);
  radial.addColorStop(1, 'transparent');
  ctx.fillStyle = radial;
  ctx.beginPath();
  ctx.arc(540, 560, 460, 0, Math.PI * 2);
  ctx.fill();

  // 富士山のシルエット
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(120, 1020);
  ctx.quadraticCurveTo(390, 920, 470, 690);
  ctx.lineTo(610, 690);
  ctx.quadraticCurveTo(690, 920, 960, 1020);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 富士山頂の雪化粧
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(470, 690);
  ctx.lineTo(610, 690);
  ctx.lineTo(648, 780);
  ctx.lineTo(590, 755);
  ctx.lineTo(540, 790);
  ctx.lineTo(490, 755);
  ctx.lineTo(432, 780);
  ctx.closePath();
  ctx.fill();

  // 外枠の二重金襴フレーム
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 8;
  ctx.strokeRect(44, 44, 992, 1432);
  ctx.strokeStyle = '#fde68a';
  ctx.lineWidth = 2;
  ctx.strokeRect(64, 64, 952, 1392);

  // タイトル・テキスト描画
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 34px serif';
  ctx.fillText('⛩️ 歴たび 御神影（ごしんえい）奉納特典護符 ⛩️', 540, 135);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px serif';
  ctx.fillText(reward.title, 540, 215);

  ctx.fillStyle = '#fbbf24';
  ctx.font = '28px serif';
  ctx.fillText(`【 ${reward.subtitle} 】`, 540, 270);

  // 中央シンボル＆御祭神情報
  ctx.font = '130px serif';
  ctx.fillText(getRewardMotifEmoji(reward.motif), 540, 520);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 40px serif';
  ctx.fillText(`${character.charaName}`, 540, 635);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '26px sans-serif';
  ctx.fillText(`本宮：${homeSpotName}（${character.originDeity}）`, 540, 1100);

  ctx.fillStyle = '#fef3c7';
  ctx.font = 'italic 28px serif';
  ctx.fillText(`「${reward.blessingText}」 — ${reward.description}`, 540, 1175);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '24px sans-serif';
  ctx.fillText(
    `神力到達証：${reward.requiredShinryoku.toLocaleString()} 神力達成 / 発行日：${new Date().toLocaleDateString('ja-JP')}`,
    540,
    1390
  );

  const link = document.createElement('a');
  link.download = `rekitabi_${reward.id}_${homeSpotName}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
