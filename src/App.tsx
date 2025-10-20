import { useEffect, useState } from 'react';
import { TrendingUp, RefreshCw, Database } from 'lucide-react';
import { StockData, PredictionResult } from './types/stock';
import { fetchStockDataFromAPI, getStockData } from './services/stockService';
import { StockPredictor } from './models/predictor';
import { StockChart } from './components/StockChart';
import { PredictionCard } from './components/PredictionCard';
import { StatisticsCard } from './components/StatisticsCard';

function App() {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const symbol = 'VUKE.L';

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getStockData(symbol);

      if (data.length === 0) {
        setError('No data available. Please fetch data first.');
        setStockData([]);
        setPrediction(null);
        setStatistics(null);
      } else {
        setStockData(data);

        const predictor = new StockPredictor(data);
        const predictionResult = predictor.predict();
        const stats = predictor.getStatistics();

        setPrediction(predictionResult);
        setStatistics(stats);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setFetching(true);
      setError(null);
      await fetchStockDataFromAPI(symbol, 365);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stock data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-600 rounded-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">FTSE 100 ETF Predictor</h1>
                <p className="text-gray-600 mt-1">Vanguard FTSE 100 UCITS ETF ({symbol})</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={loadData}
                disabled={fetching}
                className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow hover:shadow-md transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${fetching ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                onClick={fetchData}
                disabled={fetching}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                <Database className="w-5 h-5" />
                <span>{fetching ? 'Fetching...' : 'Fetch New Data'}</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </div>

        {stockData.length > 0 && prediction && statistics ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <PredictionCard
                prediction={prediction}
                currentPrice={stockData[stockData.length - 1].close}
              />
              <StatisticsCard statistics={statistics} />
            </div>

            <StockChart data={stockData} predictedPrice={prediction.nextDayPrice} />

            <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">About This Model</h2>
              <div className="prose prose-sm text-gray-600 space-y-3">
                <p>
                  This prediction model uses a combination of technical analysis methods to estimate
                  the next trading day's closing price for the Vanguard FTSE 100 UCITS ETF.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Exponential Moving Average (70%)</h3>
                    <p className="text-sm">
                      Combines 12-day EMA (40%) and 26-day EMA (30%) which give more weight to recent
                      prices, making the model more responsive to price changes.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Linear Regression (30%)</h3>
                    <p className="text-sm">
                      Analyzes the last 30 days of price data to project the trend into
                      the next trading day.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Volatility-Based Confidence</h3>
                    <p className="text-sm">
                      Calculated using annualized volatility (&lt;15% = High, 15-25% = Medium, &gt;25% = Low)
                      combined with data availability (100+ days required for High).
                    </p>
                  </div>
                </div>
                <p className="text-xs mt-4 text-gray-500 italic">
                  Disclaimer: This is a simple educational model for demonstration purposes only.
                  Not financial advice. Past performance does not guarantee future results.
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data Available</h2>
            <p className="text-gray-600 mb-6">
              Click "Fetch New Data" to download historical stock data from Yahoo Finance.
            </p>
            <button
              onClick={fetchData}
              disabled={fetching}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all disabled:opacity-50 inline-flex items-center space-x-2"
            >
              <Database className="w-5 h-5" />
              <span>{fetching ? 'Fetching...' : 'Fetch Historical Data'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
