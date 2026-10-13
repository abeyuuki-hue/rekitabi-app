export type RegionKey = 'kanto' | 'kansai';

export interface ShrineSpot {
  id: string;
  name: string;
  region: string;
  prefecture: string;
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
}

export interface SanpaiRecord {
  spotId: string;
  stampedAt: string;
  note?: string;
}

export interface RegionOption {
  key: RegionKey;
  label: string;
}
