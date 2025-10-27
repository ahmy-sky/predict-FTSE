# 📈 StockPredictor — EMA-based Stock Forecasting
https://predict-ftse.vercel.app/

A TypeScript-based predictive model that uses **Exponential Moving Averages (EMA)**, **Linear Regression**, and **Volatility Analysis** to estimate next-day stock prices.


### 🔍 OVERVIEW

This project predicts the **next day’s price** for a given stock or ETF based on historical closing data.  
It combines short-term and medium-term momentum with a linear trend projection, while factoring in volatility for realistic confidence scoring.

### ⚙️ CORE FEATURES
- 📈 **EMA(12)** & **EMA(26)** — Capture short-term and medium-term price momentum.  
- 📊 **Linear Regression (30 days)** — Identifies overall trend direction.  
- 💡 **Volatility Analysis** — Computes annualized price fluctuations to assess market stability.  
- 🔮 **Confidence Scoring** — Adjusts prediction reliability based on data volume and volatility.  
- 📉 **Trend Classification** — Labels next-day movement as *Up*, *Down*, or *Neutral*.  
- 📑 **Statistics Summary** — Provides mean, standard deviation, range, and volatility metrics. 

### 🧠 PREDICATION LOGIC
````typescript
nextDayPrice = (EMA12 * 0.4) + (EMA26 * 0.3) + (LinearRegression * 0.3)
````

### 📊 EXAMPLE OUTPUT
````json
{
  "nextDayPrice": 32.36,
  "movingAverage": 32.11,
  "linearRegression": 32.23,
  "confidence": "Medium",
  "trend": "Up"
}
````

### 🧭 Key Learnings
This was my first exposure to financial modeling.
I initially implemented a simple Moving Average (MA) model, but after research, I transitioned to Exponential Moving Averages (EMA) for greater responsiveness to market shifts.
Along the way, I learned about volatility, annualization, and how to incorporate confidence as a measure of prediction reliability.
