import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
  getContributors,
  getContributorAnalyses,
} from "../server/features/contributors";
import { useLoaderData } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Search,
  Users,
  Award,
  ArrowRight,
  Eye,
  Heart,
  Clock,
} from "lucide-react";
import { PortfolioDeck } from "../components/PortfolioDeck";
import { useState } from "react";
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
import type { UserPost } from "../server/features/contributors";

// Server Functions calling Shared Logic
const getContributorsFn = createServerFn({ method: "GET" }).handler(
  async () => {
    return getContributors();
  }
);

const getContributorAnalysesFn = createServerFn({ method: "GET" }).handler(
  async () => {
    return getContributorAnalyses(6);
  }
);

export const Route = createFileRoute("/")({
  component: Home,
  loader: async () => {
    const [contributors, analyses] = await Promise.all([
      getContributorsFn(),
      getContributorAnalysesFn(),
    ]);
    return { contributors, analyses };
  },
});

function Home() {
  const { contributors, analyses } = useLoaderData({ from: "/" });
  const [isDeckFanned, setIsDeckFanned] = useState(false);

  const getTypeColor = (type: UserPost["type"]) => {
    switch (type) {
      case "trade":
        return "bg-primary/10 text-primary border-primary/20";
      case "thought":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "update":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getMemberName = (userId: string) => {
    const member = contributors.find((c) => c.id === userId);
    return member?.isClub
      ? member.clubName || member.name
      : member?.name || "Unknown";
  };

  const formatReturn = (returnPercent?: number, status?: string) => {
    if (!returnPercent) return null;
    const sign = returnPercent >= 0 ? "+" : "";
    const color =
      status === "win"
        ? "text-green-600"
        : status === "loss"
        ? "text-red-600"
        : "text-muted-foreground";
    return (
      <span className={color}>
        {sign}
        {returnPercent.toFixed(2)}%
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 overflow-x-hidden">
      {/* Abstract Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[1800px] mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-center min-h-[60vh] w-full mb-24">
          {/* Left Column: Text & Animation */}
          <div className="flex flex-col items-center justify-center w-full">
            {/* Logo Animation - HOVER TRIGGER */}
            <div className="relative h-20 md:h-32 text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter flex items-center justify-center overflow-hidden w-full m-auto select-none">
              <div
                className="inline-flex items-center cursor-pointer hover:text-primary/80 transition-colors relative z-10"
                onMouseEnter={() => setIsDeckFanned(true)}
                onMouseLeave={() => setIsDeckFanned(false)}
              >
                <motion.div
                  className="flex items-center"
                  initial={{ x: -250 }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.8, ease: "backOut" }}
                >
                  <span className="text-foreground">Thesi</span>
                  <motion.span
                    className="text-foreground"
                    initial={{ opacity: 1, width: "auto" }}
                    animate={{ opacity: 0, width: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    style={{ display: "inline-block", overflow: "hidden" }}
                  >
                    s
                  </motion.span>
                </motion.div>

                <motion.span
                  className="text-muted-foreground mx-4"
                  initial={{
                    opacity: 1,
                    width: "auto",
                    scale: 1,
                    marginLeft: 0,
                    marginRight: 0,
                  }}
                  animate={{
                    opacity: 0,
                    width: 0,
                    scale: 0,
                    marginLeft: 0,
                    marginRight: 0,
                  }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  style={{ display: "inline-block", overflow: "hidden" }}
                >
                  +
                </motion.span>

                <motion.div
                  className="flex items-center"
                  initial={{ x: 250 }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.8, ease: "backOut" }}
                >
                  <motion.span
                    className="text-primary"
                    initial={{ opacity: 1, width: "auto" }}
                    animate={{ opacity: 0, width: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    style={{ display: "inline-block", overflow: "hidden" }}
                  >
                    In
                  </motion.span>
                  <span className="text-primary">vest</span>
                </motion.div>
              </div>
            </div>

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3, duration: 0.8 }}
              className="space-y-6 text-center mt-4"
            >
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Thesis + Invest. <br />
                <span className="text-muted-foreground">
                  The symmetry involved in high conviction plays.
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Share your investment thoughts, track your picks, and learn from
                a community of investors sharing their journey.
              </p>
              <div className="flex gap-4 justify-center pt-4">
                <Link to="/tournaments">
                  <Button size="lg" className="group">
                    Explore Tournaments
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline">
                  Get Started
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Chart */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 3.5, duration: 0.8 }}
            className="flex items-center justify-center w-full relative z-20"
          >
            <PortfolioDeck isFanned={isDeckFanned} />
          </motion.div>
        </div>

        {/* Platform Explanation Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How Thesivest Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A community platform where you share your investment journey,
              track performance of your picks, and learn from fellow investors.
              Perfect for school clubs, individual traders, and anyone
              passionate about investing.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-card/50 backdrop-blur-xl border-border hover:border-primary/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Share Your Trades</CardTitle>
                <CardDescription>
                  Post your investment picks, when you bought them, and your
                  thought process. Track how they perform over time and share
                  your journey with the community.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 backdrop-blur-xl border-border hover:border-primary/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Follow & Learn</CardTitle>
                <CardDescription>
                  Follow other investors to see their trades and thought
                  processes. Build your subscriber base as others learn from
                  your investment journey and track record.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 backdrop-blur-xl border-border hover:border-primary/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Track Performance</CardTitle>
                <CardDescription>
                  Automatically track how your picks perform over time. See your
                  win rate, returns, and build a portfolio of your investment
                  decisions for the community to follow.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </motion.section>

        {/* Contributors Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Community Posts
              </h2>
              <p className="text-muted-foreground">
                Recent trades and investment thoughts from community members
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/">
                View All
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyses.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col bg-card/50 backdrop-blur-xl border-border hover:border-primary/50 transition-all hover:shadow-xl cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge
                        variant="outline"
                        className={getTypeColor(post.type)}
                      >
                        {post.type === "trade"
                          ? "Trade"
                          : post.type === "thought"
                          ? "Thought"
                          : "Update"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {post.publishedAt}
                      </span>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {post.content}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold text-foreground">
                          {getMemberName(post.userId)}
                        </span>
                        {post.symbol && (
                          <>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">
                              {post.symbol}
                            </span>
                          </>
                        )}
                        {post.performance && (
                          <>
                            <span className="text-muted-foreground">•</span>
                            {formatReturn(
                              post.performance.returnPercent,
                              post.performance.status
                            )}
                          </>
                        )}
                      </div>
                      {post.buyPrice && (
                        <div className="text-sm text-muted-foreground">
                          Entry: ${post.buyPrice.toFixed(2)}{" "}
                          {post.currentPrice &&
                            `→ $${post.currentPrice.toFixed(2)}`}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-border">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.comments} comments</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="group/btn">
                        View
                        <ArrowRight className="ml-1 w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Featured Contributors */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Active Community Members
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Regular investors sharing their trades, thought processes, and
              performance. Follow those whose investment style resonates with
              you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contributors.map((contributor, index) => (
              <motion.div
                key={contributor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-card/50 backdrop-blur-xl border-border hover:border-primary/50 transition-all text-center">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-primary">
                        {contributor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <CardTitle className="text-lg">
                      {contributor.isClub
                        ? contributor.clubName
                        : contributor.name}
                    </CardTitle>
                    {contributor.username && (
                      <CardDescription className="text-sm">
                        {contributor.username}
                      </CardDescription>
                    )}
                    {contributor.isClub && (
                      <Badge variant="outline" className="text-xs mt-1">
                        Club
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent>
                    {contributor.bio && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {contributor.bio}
                      </p>
                    )}
                    <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                      <div>
                        <span className="font-semibold text-foreground">
                          {contributor.totalPosts}
                        </span>{" "}
                        posts
                      </div>
                      <div>
                        <span className="font-semibold text-foreground">
                          {contributor.followers}
                        </span>{" "}
                        followers
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl md:text-4xl mb-4">
                Ready to Start Investing?
              </CardTitle>
              <CardDescription className="text-lg">
                Join a community of investors sharing trades, tracking
                performance, and learning from each other's investment journeys
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/signup">
                  Create Account
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/tournaments">Browse Tournaments</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}
