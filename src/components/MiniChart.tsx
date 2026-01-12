import { HeroChart } from "./HeroChart";

interface MiniChartProps {
  portfolioId: string;
  marketData?: Record<string, { date: number; close: number }[]>;
}

export function MiniChart({ portfolioId, marketData }: MiniChartProps) {

  return (
    <div className="w-full h-full select-none pointer-events-none">
      <HeroChart
        portfolioId={portfolioId}
        marketData={marketData}
        minimal={true}
        forcedActiveSeries={["portfolio", "sp500"]}
      // Force specific series if we want only portfolio + benchmark,
      // but HeroChart defaults to that anyway.
      />
    </div>
  );
}
