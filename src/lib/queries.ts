import { queryOptions } from "@tanstack/react-query";
import { getMarketDataFn } from "../server/fn/marketstack";

export const marketDataQueryOptions = () =>
  queryOptions({
    queryKey: ["marketData"],
    queryFn: () => getMarketDataFn(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

// Legacy query for backward compatibility
export const sp500QueryOptions = () =>
  queryOptions({
    queryKey: ["sp500"],
    queryFn: () => getMarketDataFn(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
