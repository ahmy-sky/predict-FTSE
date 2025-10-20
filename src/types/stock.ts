export interface StockData {
  id: string;
  symbol: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  created_at: string;
}

export interface PredictionResult {
  nextDayPrice: number;
  movingAverage: number;
  linearRegression: number;
  confidence: string;
  trend: 'up' | 'down' | 'neutral';
}
