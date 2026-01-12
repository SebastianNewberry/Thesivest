import { createServerFn } from "@tanstack/react-start";

import { Resource } from "sst";

// Type for MarketStack EOD Response
type MarketStackEODResponse = {
  data: {
    date: string;
    close: number;
    adj_close?: number; // Adjusted closing price for splits/dividends
    symbol: string;
  }[];
};

// Generic function to fetch EOD data for multiple symbols
export const getMarketDataFn = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const apiKey = Resource.MARKETSTACK_API_KEY.value;

      if (!apiKey) {
        console.warn("Missing MARKETSTACK_API_KEY");
        return {};
      }

      // Calculate date_from for 2 years ago to ensure we cover the requested range
      const today = new Date();
      const twoYearsAgo = new Date(today.setFullYear(today.getFullYear() - 2));
      const dateFrom = twoYearsAgo.toISOString().split("T")[0];

      // Symbols to fetch: S&P 500, NASDAQ, Russell 2000, Berkshire, ARK, NVDA, TSLA, PLTR
      const symbols = [
        "SPY", // S&P 500
        "QQQ", // NASDAQ
        "IWM", // Russell 2000
        "BRK-B", // Berkshire Hathaway Class B
        "ARKK", // ARK Innovation ETF
        "NVDA", // NVIDIA
        "TSLA", // Tesla
        "PLTR", // Palantir
      ];

      // Fetch data for each symbol sequentially to avoid potential rate limits (429)
      const results: { symbol: string; data: any[] }[] = [];

      for (const symbol of symbols) {
        const url = `https://api.marketstack.com/v2/eod?access_key=${apiKey}&symbols=${symbol}&limit=1000&date_from=${dateFrom}&sort=ASC`;

        try {
          const res = await fetch(url);
          if (!res.ok) {
            console.error(
              `MarketStack API Error for ${symbol}:`,
              res.status,
              res.statusText
            );
            // Continue to next symbol even if one fails
            continue;
          }

          const json = (await res.json()) as MarketStackEODResponse;

          if (!json.data || !Array.isArray(json.data)) {
            console.error(
              `Invalid MarketStack response format for ${symbol}`,
              json
            );
            continue;
          }

          results.push({ symbol, data: json.data });
        } catch (fetchError) {
          console.error(`Network error fetching ${symbol}:`, fetchError);
        }
      }

      // Group data by symbol
      const groupedData: Record<string, { date: number; close: number }[]> = {};

      results.forEach((result) => {
        if (!result) return;

        const { symbol, data } = result;

        if (!groupedData[symbol]) {
          groupedData[symbol] = [];
        }

        data.forEach((item) => {
          groupedData[symbol].push({
            date: new Date(item.date).getTime(),
            close: item.adj_close ?? item.close, // Use adjusted close if available to handle splits
          });
        });

        // Sort
        groupedData[symbol].sort((a, b) => a.date - b.date);
      });

      console.log(`[MarketStack] Final grouped data summary:`);
      Object.entries(groupedData).forEach(([symbol, data]) => {
        console.log(`  ${symbol}: ${data.length} data points, first: ${new Date(data[0]?.date).toISOString().split('T')[0]}, last: ${new Date(data[data.length - 1]?.date).toISOString().split('T')[0]}`);
      });

      return groupedData;
    } catch (error) {
      console.error("Failed to fetch market data:", error);
      return {};
    }
  }
);

// Legacy function for backward compatibility (renamed to be more specific)
export const getSp500DataFn = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const apiKey = Resource.MARKETSTACK_API_KEY.value;

      if (!apiKey) {
        console.warn("Missing MARKETSTACK_API_KEY");
        return [];
      }

      // Use SPY (SPDR S&P 500 ETF Trust) instead of the S&P 500 index directly.
      // SPY is a widely traded ETF that tracks the S&P 500 index performance.
      // It's more reliable and has better data availability through MarketStack's EOD endpoint.
      const symbol = "SPY";

      // Calculate date_from for 2 years ago
      const today = new Date();
      const twoYearsAgo = new Date(today.setFullYear(today.getFullYear() - 2));
      const dateFrom = twoYearsAgo.toISOString().split("T")[0];

      // Fetch 1000 items which easily covers 2 years of trading days (252 * 2 = 504)
      const url = `https://api.marketstack.com/v2/eod?access_key=${apiKey}&symbols=${symbol}&limit=1000&date_from=${dateFrom}&sort=ASC`;

      const res = await fetch(url);
      if (!res.ok) {
        console.error("MarketStack API Error:", res.status, res.statusText);
        const text = await res.text();
        console.error("Body:", text);
        return [];
      }

      const json = (await res.json()) as MarketStackEODResponse;

      if (!json.data || !Array.isArray(json.data)) {
        console.error("Invalid MarketStack response format:", json);
        return [];
      }

      // Map to simple { date, close } format
      // Sort by date ascending (already sorted with sort=ASC but ensuring consistency)
      const data = json.data
        .map((item) => ({
          date: new Date(item.date).getTime(),
          close: item.adj_close ?? item.close,
        }))
        .sort((a, b) => a.date - b.date);

      return data;
    } catch (error) {
      console.error("Failed to fetch S&P 500 data:", error);
      return [];
    }
  }
);
