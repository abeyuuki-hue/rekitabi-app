export type RegionKey =
  | 'all'
  | 'hokkaido_tohoku'
  | 'kanto'
  | 'chubu_hokuriku'
  | 'kansai'
  | 'chugoku'
  | 'shikoku'
  | 'kyushu_okinawa';

export interface RegionOption {
  key: RegionKey;
  label: string;
  shortLabel: string;
}

export const REGION_OPTIONS: RegionOption[] = [
  { key: 'all', label: '🗾 全国すべて（全53社寺・霊場）', shortLabel: '全国すべて' },
  { key: 'kanto', label: '🗼 関東・千葉エリア（14社寺）', shortLabel: '関東エリア' },
  { key: 'kansai', label: '⛩️ 関西・近畿エリア（11社寺）', shortLabel: '関西エリア' },
  { key: 'hokkaido_tohoku', label: '❄️ 北海道・東北エリア（6社寺）', shortLabel: '北海道・東北' },
  { key: 'chubu_hokuriku', label: '🗻 中部・甲信越・北陸（8社寺）', shortLabel: '中部・北陸' },
  { key: 'chugoku', label: '🌊 中国エリア（4社寺）', shortLabel: '中国エリア' },
  { key: 'shikoku', label: '🍊 四国エリア（4社寺）', shortLabel: '四国エリア' },
  { key: 'kyushu_okinawa', label: '🌺 九州・沖縄エリア（6社寺）', shortLabel: '九州・沖縄' },
];

export interface ShrineSpot {
  id: string;
  name: string;
  type?: string;
  region: string;
  regionKey?: RegionKey;
  prefecture: string;
  location?: string;
  lat: number;
  lng: number;
  stampName: string;
  history: string;
  gourmet: string;
  desc?: string;
  deity?: string;
  benefits?: string[];
  sanpaiTime?: string;
  sanpaiPoint?: string;
  // Sanpai integration fields
  enshrinedDeities?: string[];
  blessings?: string[];
  etiquetteNotes?: string;
  officialUrl?: string;
}

export interface StampRallyCourse {
  course_id: string;
  title: string;
  theme: string;
  target_audience: string;
  recommended_duration: string;
  total_spots: number;
  description: string;
  spot_ids: string[];
  spot_names: string[];
  completion_reward: {
    digital_badge: string;
    title: string;
  };
}

export interface SanpaiRecord {
  id: string;
  spotId: string;
  spotName: string;
  visitedAt: string;
  weather?: string;
  prayer?: string;
  notes?: string;
  photos?: string[];
  rating?: number;
}
