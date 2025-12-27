/**
 * Shared Logic for Community Members and their Posts/Trades
 */

export interface CommunityMember {
  id: string;
  name: string;
  username?: string;
  avatar?: string;
  bio?: string;
  isClub?: boolean; // For school clubs
  clubName?: string;
  totalPosts: number;
  followers: number;
  following: number;
  verified?: boolean;
  joinedAt: string;
}

export interface UserPost {
  id: string;
  userId: string;
  type: "trade" | "thought" | "update"; // trade entry, general thought, or update on existing trade
  symbol?: string; // Required for trades
  title: string;
  content: string;
  buyPrice?: number; // For trades
  buyDate?: string; // For trades
  currentPrice?: number; // Updated performance
  targetPrice?: number;
  stopLoss?: number;
  entryThoughts?: string; // Why they bought
  tags: string[];
  publishedAt: string;
  views: number;
  likes: number;
  comments: number;
  performance?: {
    returnPercent: number;
    returnAmount?: number;
    status: "active" | "win" | "loss" | "breakeven";
  };
}

// Mock data for community members
const MOCK_MEMBERS: CommunityMember[] = [
  {
    id: "1",
    name: "Sarah Chen",
    username: "@sarahc",
    bio: "Value investor. Sharing my picks and thought process. Not financial advice.",
    isClub: false,
    totalPosts: 47,
    followers: 1240,
    following: 342,
    joinedAt: "2023-06-15",
  },
  {
    id: "2",
    name: "UW Finance Club",
    username: "@uwfinance",
    bio: "University of Washington Investment Club. Sharing our research and portfolio decisions.",
    isClub: true,
    clubName: "UW Finance Club",
    totalPosts: 32,
    followers: 2100,
    following: 28,
    verified: true,
    joinedAt: "2023-01-10",
  },
  {
    id: "3",
    name: "Alex M.",
    username: "@alex_invests",
    bio: "Learning as I go. Documenting my investment journey and mistakes.",
    isClub: false,
    totalPosts: 28,
    followers: 890,
    following: 156,
    joinedAt: "2024-03-01",
  },
  {
    id: "4",
    name: "Stanford Investment Group",
    username: "@stanford_invest",
    bio: "Stanford's student-run investment fund. Transparent portfolio management.",
    isClub: true,
    clubName: "Stanford Investment Group",
    totalPosts: 41,
    followers: 1560,
    following: 45,
    verified: true,
    joinedAt: "2022-09-01",
  },
];

// Mock data for user posts
const MOCK_POSTS: UserPost[] = [
  {
    id: "a1",
    userId: "1",
    type: "trade",
    symbol: "PACW",
    title: "Bought PACW at $7.85",
    content:
      "Regional bank trading at 0.6x book value. I think the market is overreacting to rate concerns. Balance sheet looks solid. Entry at $12.45, target $18, stop at $11.",
    buyPrice: 12.45,
    buyDate: "2024-01-15",
    currentPrice: 13.2,
    targetPrice: 18,
    stopLoss: 11,
    entryThoughts:
      "Strong fundamentals, trading below intrinsic value. Deposit base is sticky despite rate volatility.",
    publishedAt: "3h ago",
    views: 1240,
    likes: 89,
    comments: 12,
    tags: ["Banking", "Value", "Financials"],
    performance: {
      returnPercent: 7.26,
      returnAmount: 67.5,
      status: "active",
    },
  },
  {
    id: "a2",
    userId: "2",
    type: "trade",
    symbol: "VST",
    title: "UW Finance Club: Data Center Infrastructure Play",
    content:
      "As a club, we decided to enter VST at $112.40. Thesis: AI data center expansion will drive power infrastructure needs. This is a long-term position for our portfolio.",
    buyPrice: 112.4,
    buyDate: "2024-02-01",
    currentPrice: 124.8,
    targetPrice: 150,
    entryThoughts:
      "Club discussion led us to believe infrastructure is undervalued vs pure AI plays. Lower risk, still good exposure.",
    publishedAt: "1d ago",
    views: 3200,
    likes: 245,
    comments: 34,
    tags: ["AI", "Technology", "Infrastructure"],
    performance: {
      returnPercent: 11.04,
      status: "active",
    },
  },
  {
    id: "a3",
    userId: "3",
    type: "thought",
    title: "Learning from my mistakes",
    content:
      "Took a loss on ARWR today. Entered too early before FAA certification was confirmed. Lesson: wait for catalyst confirmation even if the story seems compelling. Down 12% but learned a lot.",
    publishedAt: "5h ago",
    views: 1890,
    likes: 156,
    comments: 28,
    tags: ["Learning", "Aerospace", "Lessons"],
  },
  {
    id: "a4",
    userId: "4",
    type: "update",
    symbol: "ALB",
    title: "Update on ALB position",
    content:
      "Our LITH position is up 22% since entry. Taking partial profits at current levels. Still holding 60% for the long-term EV thesis. Updated target.",
    publishedAt: "2d ago",
    views: 2100,
    likes: 178,
    comments: 19,
    tags: ["Commodities", "Energy", "EV", "Update"],
    performance: {
      returnPercent: 22.0,
      status: "win",
    },
  },
  {
    id: "a5",
    userId: "1",
    type: "trade",
    symbol: "TWNK",
    title: "New position: TWNK",
    content:
      "Small industrial play at $15.20. Trading at distressed multiples but fundamentals improving. Reshoring tailwinds could benefit this company significantly.",
    buyPrice: 15.2,
    buyDate: "2024-01-20",
    currentPrice: 15.8,
    targetPrice: 22,
    entryThoughts:
      "Distressed valuation doesn't match improving fundamentals. Risk/reward looks favorable.",
    publishedAt: "8h ago",
    views: 980,
    likes: 67,
    comments: 8,
    tags: ["Industrials", "Value", "Manufacturing"],
    performance: {
      returnPercent: 3.95,
      status: "active",
    },
  },
  {
    id: "a6",
    userId: "2",
    type: "thought",
    title: "Our investment process",
    content:
      "We document our process: 1) Research 2) Club discussion/vote 3) Entry 4) Regular updates. Transparency helps us learn and holds us accountable.",
    publishedAt: "1d ago",
    views: 2450,
    likes: 198,
    comments: 42,
    tags: ["Process", "Transparency", "Education"],
  },
];

export async function getContributors(): Promise<CommunityMember[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_MEMBERS;
}

// Keep for backward compatibility but use new interface
export async function getContributorAnalyses(
  limit?: number
): Promise<UserPost[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  // TODO: Implement actual date sorting
  const posts = [...MOCK_POSTS];
  return limit ? posts.slice(0, limit) : posts;
}

export async function getContributorById(
  id: string
): Promise<CommunityMember | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return MOCK_MEMBERS.find((c) => c.id === id) || null;
}

export async function getAnalysesByContributor(
  userId: string
): Promise<UserPost[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return MOCK_POSTS.filter((p) => p.userId === userId);
}

// New functions for community posts
export async function getCommunityPosts(limit?: number): Promise<UserPost[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const posts = [...MOCK_POSTS];
  return limit ? posts.slice(0, limit) : posts;
}

export async function getPostsByUser(userId: string): Promise<UserPost[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return MOCK_POSTS.filter((p) => p.userId === userId);
}

export async function getPostById(id: string): Promise<UserPost | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return MOCK_POSTS.find((p) => p.id === id) || null;
}
