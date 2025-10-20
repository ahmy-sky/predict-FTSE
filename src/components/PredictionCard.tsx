import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { PredictionResult } from '../types/stock';

interface PredictionCardProps {
  prediction: PredictionResult;
  currentPrice: number;
}

export function PredictionCard({ prediction, currentPrice }: PredictionCardProps) {
  const priceChange = prediction.nextDayPrice - currentPrice;
  const percentChange = (priceChange / currentPrice) * 100;

  const getTrendIcon = () => {
    switch (prediction.trend) {
      case 'up':
        return <TrendingUp className="w-8 h-8 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-8 h-8 text-red-500" />;
      default:
        return <Minus className="w-8 h-8 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (prediction.trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Next Day Prediction</h2>

      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500 mb-1">Predicted Price</p>
          <p className="text-4xl font-bold text-gray-900">£{prediction.nextDayPrice.toFixed(2)}</p>
          <p className={`text-sm font-semibold mt-1 ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({percentChange >= 0 ? '+' : ''}{percentChange.toFixed(2)}%)
          </p>
        </div>
        <div className="flex flex-col items-center">
          {getTrendIcon()}
          <p className={`text-sm font-semibold mt-2 uppercase ${getTrendColor()}`}>
            {prediction.trend}
          </p>
        </div>
      </div>

      <div className="space-y-4 border-t pt-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Current Price</span>
          <span className="font-semibold text-gray-900">£{currentPrice.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">12-Day EMA</span>
          <span className="font-semibold text-gray-900">£{prediction.movingAverage.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Linear Regression</span>
          <span className="font-semibold text-gray-900">£{prediction.linearRegression.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Confidence</span>
          <span className={`font-semibold ${
            prediction.confidence === 'High' ? 'text-green-600' :
            prediction.confidence === 'Medium' ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {prediction.confidence}
          </span>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-xs text-gray-600 leading-relaxed">
          This prediction combines 12-day EMA (40%), 26-day EMA (30%),
          and linear regression (30%) to estimate the next trading day's closing price.
          Confidence is calculated based on data volume and annualized volatility.
        </p>
      </div>
    </div>
  );
}
