import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getContributors } from "../server/features/contributors";
import { useLoaderData } from "@tanstack/react-router";
// import { motion } from "motion/react"; 
import {
  Users,
  Search,
  TrendingUp,
  TrendingDown,
  Star,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import type { CommunityMember } from "../server/features/contributors";

// Server Function
const getContributorsFn = createServerFn({ method: "GET" }).handler(
  async () => {
    return getContributors();
  }
);

export const Route = createFileRoute("/contributors")({
  component: Contributors,
  loader: async () => {
    return await getContributorsFn();
  },
});

type SortOption = "most-active" | "best-performers" | "most-followed" | "newest";

function Contributors() {
  const contributors = useLoaderData({ from: "/contributors" }) || [];
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("most-active");

  // Filter and sort contributors
  const filteredContributors = useMemo(() => {
    if (!contributors) return [];
    let filtered = contributors.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.bio?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort based on selected option
    switch (sortBy) {
      case "most-active":
        filtered = filtered.sort((a, b) => b.totalPosts - a.totalPosts);
        break;
      case "best-performers":
        filtered = filtered.sort((a, b) => b.followers - a.followers);
        break;
      case "most-followed":
        filtered = filtered.sort((a, b) => b.followers - a.followers);
        break;
      case "newest":
        filtered = filtered.sort(
          (a, b) => b.joinedAt.localeCompare(a.joinedAt)
        );
        break;
    }

    return filtered;
  }, [contributors, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="border-b bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-12">
          <div
            className="text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <div
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/10 to-primary/30 blur-2xl rounded-full" />
                <Users className="w-20 h-20 text-primary relative z-10" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
              Community Contributors
            </h1>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto mb-10">
              Discover elite investors and analysts. Track their moves, learn from their research.
            </p>

            {/* Elegant Minimal Search */}
            <div className="relative w-full max-w-md mx-auto">
              <div
                className="relative"
              >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 w-4 h-4 z-10" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-background/80 border-2 border-primary/10 rounded-full focus:border-primary/40 focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all shadow-lg shadow-primary/5 placeholder:text-muted-foreground/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 hover:text-foreground p-1 rounded-full hover:bg-accent/50 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Leaderboard / Sorting Bar */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div
            className="flex flex-wrap items-center justify-center gap-1"
          >
            {[
              { id: "most-active", label: "🔥 Hot", icon: TrendingUp, color: "from-orange-500/10 to-orange-500/5 border-orange-500/30" },
              { id: "best-performers", label: "⭐ Elite", icon: Star, color: "from-purple-500/10 to-purple-500/5 border-purple-500/30" },
              { id: "most-followed", label: "💎 Popular", icon: Users, color: "from-blue-500/10 to-blue-500/5 border-blue-500/30" },
              { id: "newest", label: "✨ Fresh", icon: Clock, color: "from-green-500/10 to-green-500/5 border-green-500/30" },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setSortBy(option.id as SortOption)}
                className={`
                  relative px-4 py-2 rounded-xl text-sm font-semibold
                  transition-all duration-300 group
                  ${sortBy === option.id
                    ? `bg-gradient-to-r ${option.color} shadow-lg ring-2 ring-offset-1 ring-offset-background ring-primary/20`
                    : "bg-muted/50 hover:bg-muted/80 border border-border/50"
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  <option.icon className={`w-4 h-4 ${sortBy === option.id ? "" : "text-muted-foreground/70"}`} />
                  <span className={sortBy === option.id ? "" : "text-muted-foreground/90"}>{option.label}</span>
                </span>
                {sortBy === option.id && (
                  <div
                    className="absolute -bottom-1 left-0 h-0.5 rounded-full bg-primary"
                    style={{ width: "100%" }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contributors Grid */}
      {filteredContributors.length > 0 ? (
        <div className="container mx-auto px-4 py-10">
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredContributors.map((contributor) => (
              <div
                key={contributor.id}
              >
                <Link to={`/profiles/${contributor.id}`}>
                  <div className="relative group h-full">
                    {/* Animated Glow Effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/20 via-transparent to-primary/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Premium Card Container */}
                    <div className="relative bg-gradient-to-br from-card via-card to-card/50 rounded-2xl overflow-hidden transition-all duration-500 border border-border/30 hover:border-primary/40 shadow-lg hover:shadow-2xl">
                      {/* Top Gradient Bar */}
                      <div className="h-1 bg-gradient-to-r from-primary via-primary/80 to-primary w-full" />

                      {/* Header Section */}
                      <div className="p-6 pb-4">
                        <div className="flex items-start gap-4">
                          {/* Premium Avatar */}
                          <div className="flex-shrink-0 relative">
                            <div
                              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden border-2 border-background shadow-xl"
                            >
                              {contributor.avatar ? (
                                <img
                                  src={contributor.avatar}
                                  alt={contributor.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-3xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
                                  {contributor.name.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            {/* Verified Badge Overlay */}
                            {contributor.verified && (
                              <div
                                className="absolute -top-1 -right-1"
                              >
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                                  ✓
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Name + Username Section */}
                          <div className="flex-grow min-w-0">
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <CardTitle className="text-xl font-bold truncate tracking-tight">
                                {contributor.name}
                              </CardTitle>
                              {contributor.username && (
                                <Badge variant="secondary" className="text-xs px-2 py-0.5 font-mono">
                                  @{contributor.username}
                                </Badge>
                              )}
                            </div>
                            {contributor.isClub && (
                              <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-semibold mb-2 shadow-lg">
                                🎓 Investment Club
                              </Badge>
                            )}
                            {contributor.clubName && (
                              <p className="text-sm text-muted-foreground/90 truncate font-medium">
                                {contributor.clubName}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Bio */}
                        {contributor.bio && (
                          <CardDescription className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground/80">
                            {contributor.bio}
                          </CardDescription>
                        )}
                      </div>

                      {/* Stats Section - Premium Design */}
                      <div className="px-6 pb-6 pt-4 bg-gradient-to-b from-background/30 to-background/50">
                        <div className="grid grid-cols-3 gap-4">
                          {/* Posts Stat */}
                          <div
                            className="text-center p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
                          >
                            <div className="flex items-center justify-center mb-2">
                              <TrendingUp className="w-5 h-5 text-primary" />
                            </div>
                            <div className="text-2xl font-extrabold bg-gradient-to-br from-primary to-primary/70 bg-clip-text">
                              {contributor.totalPosts}
                            </div>
                            <div className="text-[10px] text-muted-foreground/70 font-semibold uppercase tracking-wider mt-1">
                              Posts
                            </div>
                          </div>

                          {/* Followers Stat */}
                          <div
                            className="text-center p-3 rounded-xl bg-gradient-to-br from-pink-500/10 to-pink-500/5 border border-pink-500/20"
                          >
                            <div className="flex items-center justify-center mb-2">
                              <Users className="w-5 h-5 text-pink-600" />
                            </div>
                            <div className="text-2xl font-extrabold bg-gradient-to-br from-pink-500 to-pink-600 bg-clip-text">
                              {contributor.followers}
                            </div>
                            <div className="text-[10px] text-muted-foreground/70 font-semibold uppercase tracking-wider mt-1">
                              Followers
                            </div>
                          </div>

                          {/* Following Stat */}
                          <div
                            className="text-center p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20"
                          >
                            <div className="flex items-center justify-center mb-2">
                              <TrendingDown className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="text-2xl font-extrabold bg-gradient-to-br from-blue-500 to-blue-600 bg-clip-text">
                              {contributor.following}
                            </div>
                            <div className="text-[10px] text-muted-foreground/70 font-semibold uppercase tracking-wider mt-1">
                              Following
                            </div>
                          </div>
                        </div>

                        {/* View Profile Button - Premium Style */}
                        <div
                        >
                          <div
                            className="w-full mt-5 group relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary/80 text-white font-semibold py-3 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            <span className="relative z-10">View Profile</span>
                            <div
                              className="absolute inset-0 bg-white/20 z-0"
                            />
                            <TrendingUp className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-md mx-auto text-center">
            <div
              className="relative inline-block mb-8"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-primary/30 blur-3xl rounded-full" />
              <Users className="w-32 h-32 text-muted-foreground/40 relative z-10" />
            </div>

            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              {searchQuery ? "No Results Found" : "No Contributors Yet"}
            </h3>

            <p className="text-lg text-muted-foreground/80 mb-8 max-w-sm mx-auto">
              {searchQuery
                ? `We couldn't find any contributors matching ${searchQuery}`
                : "Be the first to join our elite community of investors"}
            </p>

            {!searchQuery && (
              <div
              >
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="group relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 text-white font-semibold py-4 px-8 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all rounded-md"
                  >
                    <span className="relative z-10">Join Elite</span>
                    <div
                      className="absolute inset-0 bg-white/20"
                    />
                    <TrendingUp className="ml-2 w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
