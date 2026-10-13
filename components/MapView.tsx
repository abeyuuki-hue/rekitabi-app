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

interface MapViewProps {
  spots: ShrineSpot[];
  onSelectSpot?: (spot: ShrineSpot) => void;
}

export default function MapView({ spots, onSelectSpot }: MapViewProps) {
  return (
    <div className="w-full h-[calc(100vh-130px)]">
      <DynamicMap spots={spots} onSelectSpot={onSelectSpot} />
    </div>
  );
}
