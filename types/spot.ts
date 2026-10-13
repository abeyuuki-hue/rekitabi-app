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
  // Sanpai integration fields
  enshrinedDeities?: string[];
  blessings?: string[];
  etiquetteNotes?: string;
  officialUrl?: string;
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
