/*
  # Create stock data table

  1. New Tables
    - `stock_data`
      - `id` (uuid, primary key) - Unique identifier for each record
      - `symbol` (text) - Stock symbol (e.g., 'VUKE.L' for FTSE 100 ETF)
      - `date` (date) - Trading date
      - `open` (numeric) - Opening price
      - `high` (numeric) - Highest price of the day
      - `low` (numeric) - Lowest price of the day
      - `close` (numeric) - Closing price
      - `volume` (bigint) - Trading volume
      - `created_at` (timestamptz) - Record creation timestamp
      - Unique constraint on (symbol, date) to prevent duplicates
  
  2. Security
    - Enable RLS on `stock_data` table
    - Add policy for public read access (stock data is public information)
    - Only authenticated users can insert data (for data fetching service)
*/

CREATE TABLE IF NOT EXISTS stock_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL,
  date date NOT NULL,
  open numeric(10, 2) NOT NULL,
  high numeric(10, 2) NOT NULL,
  low numeric(10, 2) NOT NULL,
  close numeric(10, 2) NOT NULL,
  volume bigint NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(symbol, date)
);

CREATE INDEX IF NOT EXISTS idx_stock_data_symbol_date ON stock_data(symbol, date DESC);

ALTER TABLE stock_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read stock data"
  ON stock_data FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert stock data"
  ON stock_data FOR INSERT
  TO authenticated
  WITH CHECK (true);