import { StockData, PredictionResult } from '../types/stock';

export class StockPredictor {
  private data: StockData[];

  constructor(data: StockData[]) {
    this.data = data;
  }

  private calculateEMA(period: number): number {
    if (this.data.length === 0) {
      return 0;
    }

    if (this.data.length < period) {
      const sum = this.data.reduce((acc, item) => acc + item.close, 0);
      return sum / this.data.length;
    }

    const multiplier = 2 / (period + 1);
    const initialSMA = this.data.slice(0, period)
      .reduce((acc, item) => acc + item.close, 0) / period;

    let ema = initialSMA;

    for (let i = period; i < this.data.length; i++) {
      ema = (this.data[i].close - ema) * multiplier + ema;
    }

    return ema;
  }

  private calculateVolatility(period: number = 20): number {
    if (this.data.length < period) {
      period = this.data.length;
    }

    const recentData = this.data.slice(-period);
    const returns = [];

    for (let i = 1; i < recentData.length; i++) {
      const dailyReturn = (recentData[i].close - recentData[i - 1].close) / recentData[i - 1].close;
      returns.push(dailyReturn);
    }

    const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((acc, ret) => acc + Math.pow(ret - meanReturn, 2), 0) / returns.length;
    const volatility = Math.sqrt(variance) * Math.sqrt(252);

    return volatility;
  }

  private calculateLinearRegression(): number {
    const n = Math.min(this.data.length, 30);
    const recentData = this.data.slice(-n);

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;

    recentData.forEach((item, index) => {
      const x = index;
      const y = item.close;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const nextX = n;
    return slope * nextX + intercept;
  }

  public predict(): PredictionResult {
    const ema12 = this.calculateEMA(12);
    const ema26 = this.calculateEMA(26);
    const lrPrediction = this.calculateLinearRegression();

    const combinedPrediction = (ema12 * 0.4 + ema26 * 0.3 + lrPrediction * 0.3);

    const currentPrice = this.data[this.data.length - 1].close;
    const priceChange = combinedPrediction - currentPrice;
    const percentChange = (priceChange / currentPrice) * 100;

    let trend: 'up' | 'down' | 'neutral' = 'neutral';
    if (percentChange > 0.5) trend = 'up';
    else if (percentChange < -0.5) trend = 'down';

    const volatility = this.calculateVolatility();
    const volatilityPercent = volatility * 100;

    let confidence = 'Low';

    if (this.data.length >= 100) {
      if (volatilityPercent < 15) {
        confidence = 'High';
      } else if (volatilityPercent < 25) {
        confidence = 'Medium';
      } else {
        confidence = 'Low';
      }
    } else if (this.data.length >= 50) {
      if (volatilityPercent < 15) {
        confidence = 'Medium';
      } else {
        confidence = 'Low';
      }
    }

    return {
      nextDayPrice: Number(combinedPrediction.toFixed(2)),
      movingAverage: Number(ema12.toFixed(2)),
      linearRegression: Number(lrPrediction.toFixed(2)),
      confidence,
      trend,
    };
  }

  public getStatistics() {
    const closes = this.data.map(d => d.close);
    const mean = closes.reduce((a, b) => a + b, 0) / closes.length;

    const variance = closes.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / closes.length;
    const stdDev = Math.sqrt(variance);

    const sortedCloses = [...closes].sort((a, b) => a - b);
    const min = sortedCloses[0];
    const max = sortedCloses[sortedCloses.length - 1];

    const volatility = this.calculateVolatility();

    return {
      mean: Number(mean.toFixed(2)),
      stdDev: Number(stdDev.toFixed(2)),
      min: Number(min.toFixed(2)),
      max: Number(max.toFixed(2)),
      volatility: Number((volatility * 100).toFixed(2)),
      dataPoints: this.data.length,
    };
  }
}
