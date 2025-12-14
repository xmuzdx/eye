export interface BlinkEvent {
  value: number;
  index: number;
  type: 'complete' | 'incomplete';
}

export interface BlinkStats {
  complete_blinks: number;
  incomplete_blinks: number;
  blink_events: BlinkEvent[];
}

export interface DataPoint {
  frame: number;
  value: number;
  isBlinkMinima?: boolean;
  blinkType?: 'complete' | 'incomplete';
}

export interface AnalysisSummary {
  videoName: string;
  totalBlinks: number;
  completeCount: number;
  incompleteCount: number;
  incompleteRatio: number;
  normalizedOverallAvg: number;
  normalizedBlinkMinAvg: number;
}