import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
  getContributors,
  getContributorAnalyses,
} from "../server/features/contributors";
import { useLoaderData } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Users,
  ArrowRight,
  Eye,
  Heart,
  Clock,
  TrendingUp,
  FileText,
} from "lucide-react";
import { PortfolioDeck } from "../components/PortfolioDeck";
import { useState, useEffect } from "react";
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

  // Save scroll position on scroll (only if navigation will be to a post)
  useEffect(() => {
    const handleScroll = () => {
      const navigationSource = sessionStorage.getItem("navigation-source");
      // Only save if we're going to navigate to a post card
      if (navigationSource === "post-card") {
        sessionStorage.setItem("homepage-scroll", window.scrollY.toString());
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Restore scroll position on mount (only if navigating back from a post)
  useEffect(() => {
    const savedScroll = sessionStorage.getItem("homepage-scroll");
    const navigationSource = sessionStorage.getItem("navigation-source");

    // Only restore if navigation source was a post card (not header navigation)
    if (savedScroll && navigationSource === "post-card") {
      window.scrollTo(0, parseInt(savedScroll));
    }

    // Clear navigation source and saved scroll after processing
    sessionStorage.removeItem("navigation-source");
    sessionStorage.removeItem("homepage-scroll");
  }, []);

  const handlePostCardClick = () => {
    // Set navigation source AND save current scroll position immediately
    sessionStorage.setItem("navigation-source", "post-card");
    sessionStorage.setItem("homepage-scroll", window.scrollY.toString());
  };

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
                  initial={{ x: -200 }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.6, ease: "backOut" }}
                >
                  <span className="text-foreground">Thesi</span>
                  <motion.span
                    className="text-foreground"
                    initial={{ opacity: 1, width: "auto" }}
                    animate={{ opacity: 0, width: 0 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
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
                  transition={{ duration: 0.3, delay: 0.15 }}
                  style={{ display: "inline-block", overflow: "hidden" }}
                >
                  +
                </motion.span>

                <motion.div
                  className="flex items-center"
                  initial={{ x: 200 }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.6, ease: "backOut" }}
                >
                  <motion.span
                    className="text-primary"
                    initial={{ opacity: 1, width: "auto" }}
                    animate={{ opacity: 0, width: 0 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
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
              transition={{ delay: 1.5, duration: 0.6 }}
              className="space-y-6 text-center mt-4"
            >
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Thesis + Invest. <br />
                <span className="text-muted-foreground">
                  Where Research Becomes Conviction.
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Stop buying stocks without a plan. Document your thesis, track
                your performance, and learn from investors who actually beat the
                market.
              </p>
              <div className="flex gap-4 justify-center pt-4">
                <Link to="/signup">
                  <Button size="lg" className="group">
                    Start Tracking Your Picks
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/tournaments">Explore Tournaments</Link>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Chart */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="flex items-center justify-center w-full relative z-20"
          >
            <PortfolioDeck isFanned={isDeckFanned} />
          </motion.div>
        </div>

        {/* Core Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Invest Smarter
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Track your investments, document your thesis, and build a
              following of investors who learn from your decisions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card/50 backdrop-blur-xl border-border hover:border-primary/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Track Your Portfolio</CardTitle>
                <CardDescription>
                  Create your portfolio and track every trade with automatic
                  price updates. Monitor performance in real-time with
                  comprehensive analytics including win rate, returns, and risk
                  metrics.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 backdrop-blur-xl border-border hover:border-primary/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Document Your Thesis</CardTitle>
                <CardDescription>
                  Before every trade, write down your investment thesis.
                  Document entry price, target price, stop loss, and the
                  reasoning behind your decision. Build a track record you can
                  be proud of.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 backdrop-blur-xl border-border hover:border-primary/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Build Your Following</CardTitle>
                <CardDescription>
                  Share your insights with the community. As you build a proven
                  track record, you'll attract followers who learn from your
                  research and investment process.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </motion.section>

        {/* How It Works Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get Started in Minutes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A simple workflow that keeps you disciplined and accountable
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Sign Up",
                description:
                  "Create your free account in seconds. No credit card required.",
              },
              {
                step: "2",
                title: "Add Your Thesis",
                description:
                  "Document your research, entry price, and target before buying.",
              },
              {
                step: "3",
                title: "Track Performance",
                description:
                  "Automatic price updates show you how your thesis plays out.",
              },
              {
                step: "4",
                title: "Build Reputation",
                description:
                  "Share insights and grow your community of followers.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="text-center h-full bg-card/50 backdrop-blur-xl border-border hover:border-primary/50 transition-all">
                  <CardContent className="pt-6 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mb-4">
                      {item.step}
                    </div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contributors Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Example Community Posts
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what investors share on Thesivest. Click any post to view full
              details.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyses.map((post, index) => (
              <Link
                to="/posts/$id"
                params={{ id: post.id }}
                className="block h-full"
                onClick={handlePostCardClick}
              >
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <Card className="h-full flex flex-col bg-card/50 backdrop-blur-xl border-border hover:border-primary/50 transition-all hover:shadow-xl group">
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
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl md:text-4xl mb-4">
                Start Documenting Your Investment Thesis
              </CardTitle>
              <CardDescription className="text-lg">
                Create your free account and begin tracking your investment
                journey. Every trade you post builds your track record.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/signup">
                  Create Free Account
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}
