import { StockData } from '../types/stock';

interface StockChartProps {
  data: StockData[];
  predictedPrice?: number;
}

export function StockChart({ data, predictedPrice }: StockChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-500 text-center">No data available</p>
      </div>
    );
  }

  const displayData = data.slice(-90);

  const prices = displayData.map(d => d.close);
  const maxPrice = Math.max(...prices, predictedPrice || 0);
  const minPrice = Math.min(...prices, predictedPrice || 0);
  const priceRange = maxPrice - minPrice;
  const padding = priceRange * 0.1;

  const chartHeight = 300;
  const chartWidth = 100;

  const getY = (price: number) => {
    const normalizedPrice = ((price - minPrice + padding) / (priceRange + 2 * padding));
    return chartHeight - (normalizedPrice * chartHeight);
  };

  const pathData = displayData.map((d, i) => {
    const x = (i / (displayData.length - 1)) * chartWidth;
    const y = getY(d.close);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Price Chart (Last 90 Days)</h2>
      <div className="relative w-full" style={{ height: `${chartHeight}px` }}>
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          <path
            d={`${pathData} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`}
            fill="url(#priceGradient)"
          />

          <path
            d={pathData}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="0.5"
            vectorEffect="non-scaling-stroke"
          />

          {predictedPrice && (
            <>
              <line
                x1={chartWidth}
                y1={getY(predictedPrice)}
                x2={chartWidth + 5}
                y2={getY(predictedPrice)}
                stroke="#ef4444"
                strokeWidth="0.5"
                vectorEffect="non-scaling-stroke"
                strokeDasharray="2,2"
              />
              <circle
                cx={chartWidth}
                cy={getY(predictedPrice)}
                r="1"
                fill="#ef4444"
              />
            </>
          )}
        </svg>

        <div className="absolute top-0 right-0 text-xs text-gray-500">
          £{maxPrice.toFixed(2)}
        </div>
        <div className="absolute bottom-0 right-0 text-xs text-gray-500">
          £{minPrice.toFixed(2)}
        </div>
      </div>

      <div className="mt-4 flex justify-between text-xs text-gray-500">
        <span>{displayData[0]?.date}</span>
        <span>{displayData[displayData.length - 1]?.date}</span>
      </div>
    </div>
  );
}
