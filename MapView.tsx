'use client';

import dynamic from 'next/dynamic';
import { ShrineSpot } from '@/types/spot';

const DynamicMap = dynamic(() => import('./MapInner'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-shrine-darkred font-bold">
      🗺️ 絵図を読み込み中...
    </div>
  ),
});

export default function MapView({ spots }: { spots: ShrineSpot[] }) {
  return (
    <div className="w-full h-[calc(100vh-125px)]">
      <DynamicMap spots={spots} />
    </div>
  );
}