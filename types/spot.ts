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
  { key: 'all', label: '🗾 全国すべて（全47都道府県・191社寺）', shortLabel: '全国すべて' },
  { key: 'kanto', label: '🗼 関東・千葉エリア（40社寺）', shortLabel: '関東エリア' },
  { key: 'kansai', label: '⛩️ 関西・近畿エリア（35社寺）', shortLabel: '関西エリア' },
  { key: 'chubu_hokuriku', label: '🗻 中部・甲信越・北陸（32社寺）', shortLabel: '中部・北陸' },
  { key: 'kyushu_okinawa', label: '🌺 九州・沖縄エリア（28社寺）', shortLabel: '九州・沖縄' },
  { key: 'hokkaido_tohoku', label: '❄️ 北海道・東北エリア（22社寺）', shortLabel: '北海道・東北' },
  { key: 'chugoku', label: '🌊 中国・山陰山陽エリア（19社寺）', shortLabel: '中国エリア' },
  { key: 'shikoku', label: '🍊 四国エリア（15社寺）', shortLabel: '四国エリア' },
];

export const PREFECTURE_ORDER: string[] = [
  '北海道',
  '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県', '愛知県',
  '三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
  '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県',
  '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県',
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
