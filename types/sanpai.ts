export interface SanpaiVisitLog {
  id: string;
  spotId: string;
  spotName: string;
  visitedAt: string;
  weather?: string;
  prayer?: string;
  notes: string;
  photos?: string[];
  rating?: number;
  isStamped?: boolean;
}

export interface WorshipEtiquetteStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}
