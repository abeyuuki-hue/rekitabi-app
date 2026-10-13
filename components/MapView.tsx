'use client';

import dynamic from 'next/dynamic';
import { ShrineSpot } from '@/types/spot';

const DynamicMap = dynamic(() => import('./MapInner'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[300px] items-center justify-center text-shrine-darkred font-bold">
      🗺️ 絵図を読み込み中...
    </div>
  ),
});

interface MapViewProps {
  spots: ShrineSpot[];
  userStamps?: Record<string, boolean>;
  onSelectSpot?: (spot: ShrineSpot) => void;
}

export default function MapView({ spots, userStamps = {}, onSelectSpot }: MapViewProps) {
  return (
    <div className="w-full h-[calc(100vh-140px)] min-h-[400px]">
      <DynamicMap spots={spots} userStamps={userStamps} onSelectSpot={onSelectSpot} />
    </div>
  );
}
