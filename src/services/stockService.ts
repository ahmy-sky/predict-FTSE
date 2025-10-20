import { supabase } from '../lib/supabase';
import { StockData } from '../types/stock';

export const fetchStockDataFromAPI = async (symbol: string = 'VUKE.L', days: number = 365) => {
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-stock-data`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ symbol, days }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch stock data');
  }

  return await response.json();
};

export const getStockData = async (symbol: string = 'VUKE.L', limit: number = 365): Promise<StockData[]> => {
  const { data, error } = await supabase
    .from('stock_data')
    .select('*')
    .eq('symbol', symbol)
    .order('date', { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return (data || []).reverse();
};
