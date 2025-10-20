import { Activity, BarChart3, TrendingUp, TrendingDown, Waves } from 'lucide-react';

interface StatisticsCardProps {
  statistics: {
    mean: number;
    stdDev: number;
    min: number;
    max: number;
    volatility: number;
    dataPoints: number;
  };
}

export function StatisticsCard({ statistics }: StatisticsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Historical Statistics</h2>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Mean Price</p>
              <p className="text-xl font-bold text-gray-900">£{statistics.mean}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Waves className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Volatility</p>
              <p className="text-xl font-bold text-gray-900">{statistics.volatility}%</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Maximum</p>
              <p className="text-xl font-bold text-gray-900">£{statistics.max}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Minimum</p>
              <p className="text-xl font-bold text-gray-900">£{statistics.min}</p>
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-3 pt-2 border-t">
          <div className="p-2 bg-slate-100 rounded-lg">
            <BarChart3 className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Std. Deviation</p>
            <p className="text-xl font-bold text-gray-900">£{statistics.stdDev}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Data Points Analyzed</span>
          <span className="text-lg font-bold text-gray-900">{statistics.dataPoints}</span>
        </div>
      </div>
    </div>
  );
}
