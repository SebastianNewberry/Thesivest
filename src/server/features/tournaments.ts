/**
 * Shared Logic for Tournaments
 */

export interface Tournament {
  id: string;
  name: string;
  description: string;
  category: "Value Investing" | "Growth Investing" | "Sector Focus" | "Options Trading" | "Crypto";
  status: "Upcoming" | "Active" | "Completed";
  startDate: string;
  endDate: string;
  participants: number;
  prizePool: string;
  rules: string[];
  icon: string; // lucide icon name
}

// Mock data for tournaments
const MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: "1",
    name: "Deep Value Discovery Challenge",
    description: "Find the most undervalued small-cap stocks trading below intrinsic value. Participants submit detailed theses on companies with market cap under $500M.",
    category: "Value Investing",
    status: "Active",
    startDate: "2024-01-15",
    endDate: "2024-03-15",
    participants: 342,
    prizePool: "$25,000",
    rules: [
      "Market cap must be under $500M",
      "Must provide detailed DCF or comparable analysis",
      "Minimum 3-year investment horizon",
      "Public thesis submission required",
    ],
    icon: "TrendingUp",
  },
  {
    id: "2",
    name: "Tech Disruptor Tournament",
    description: "Identify the next big tech disruptor before it hits mainstream. Focus on early-stage companies with breakthrough technology.",
    category: "Growth Investing",
    status: "Active",
    startDate: "2024-02-01",
    endDate: "2024-04-30",
    participants: 521,
    prizePool: "$40,000",
    rules: [
      "Company must be in tech sector",
      "Must demonstrate disruptive potential",
      "Include competitive analysis",
      "Minimum 5-year growth projection",
    ],
    icon: "Zap",
  },
  {
    id: "3",
    name: "Biotech Pipeline Analysis",
    description: "Deep dive into biotech companies with promising pipelines. Analyze clinical trial data and regulatory pathways.",
    category: "Sector Focus",
    status: "Upcoming",
    startDate: "2024-03-01",
    endDate: "2024-06-30",
    participants: 0,
    prizePool: "$30,000",
    rules: [
      "Focus on companies with Phase 2+ trials",
      "Must analyze clinical data",
      "Include regulatory risk assessment",
      "FDA approval timeline analysis required",
    ],
    icon: "FlaskConical",
  },
  {
    id: "4",
    name: "Options Strategy Championship",
    description: "Showcase your options trading strategies. Best risk-adjusted returns win. Real money, real trades.",
    category: "Options Trading",
    status: "Active",
    startDate: "2024-01-20",
    endDate: "2024-03-20",
    participants: 189,
    prizePool: "$15,000",
    rules: [
      "Minimum 10 trades required",
      "Maximum portfolio allocation: 20%",
      "Must document strategy rationale",
      "Risk management plan mandatory",
    ],
    icon: "LineChart",
  },
  {
    id: "5",
    name: "ESG Impact Investing Challenge",
    description: "Find companies that deliver both financial returns and positive environmental/social impact. Prove that doing good can mean doing well.",
    category: "Value Investing",
    status: "Upcoming",
    startDate: "2024-04-01",
    endDate: "2024-07-31",
    participants: 0,
    prizePool: "$20,000",
    rules: [
      "Must meet ESG criteria",
      "Financial returns must be competitive",
      "Impact metrics required",
      "Long-term sustainability analysis",
    ],
    icon: "Leaf",
  },
  {
    id: "6",
    name: "Crypto Alpha Hunt",
    description: "Identify undervalued crypto projects with strong fundamentals. Focus on utility and real-world adoption.",
    category: "Crypto",
    status: "Completed",
    startDate: "2023-10-01",
    endDate: "2024-01-31",
    participants: 456,
    prizePool: "$35,000",
    rules: [
      "Must analyze tokenomics",
      "Community and adoption metrics required",
      "Technical analysis of blockchain",
      "Risk assessment of regulatory environment",
    ],
    icon: "Coins",
  },
];

export async function getTournaments(): Promise<Tournament[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_TOURNAMENTS;
}

export async function getTournamentById(id: string): Promise<Tournament | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return MOCK_TOURNAMENTS.find((t) => t.id === id) || null;
}

export async function getTournamentsByCategory(category: Tournament["category"]): Promise<Tournament[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return MOCK_TOURNAMENTS.filter((t) => t.category === category);
}

export async function getActiveTournaments(): Promise<Tournament[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return MOCK_TOURNAMENTS.filter((t) => t.status === "Active");
}

