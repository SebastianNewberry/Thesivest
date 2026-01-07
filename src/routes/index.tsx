import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { FamousFunds } from "../components/FamousFunds";
import {
  getContributors,
  getContributorAnalyses,
} from "../server/features/contributors";
import { useLoaderData } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  ArrowRight,
  Eye,
  Heart,
  Clock,
  TrendingUp,
  FileText,
} from "lucide-react";
import { useEffect, useState } from "react";
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
import { PortfolioDeck } from "@/components/PortfolioDeck";

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
    try {
      const [contributors, analyses] = await Promise.all([
        getContributorsFn(),
        getContributorAnalysesFn(),
      ]);
      return { contributors, analyses };
    } catch (e) {
      console.error("Home loader failed:", e);
      return { contributors: [], analyses: [] };
    }
  },
});

function Home() {
  const { contributors, analyses } = useLoaderData({ from: "/" });

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
      {/* Editorial Premium Background - Clean & Trustworthy */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 py-16">
        {/* Unified Centered Hero Section */}
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
                  <div className="inline-flex items-center cursor-pointer hover:text-primary/80 transition-colors relative z-10">
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
                    Stop buying stocks without a plan. Document your thesis,
                    track your performance, and learn from investors who
                    actually beat the market.
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
                      comprehensive analytics including win rate, returns, and
                      risk metrics.
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
                      reasoning behind your decision. Build a track record you
                      can be proud of.
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
                      Share your insights with the community. As you build a
                      proven track record, you'll attract followers who learn
                      from your research and investment process.
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
                  See what investors share on Thesivest. Click any post to view
                  full details.
                </p>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Feature - Spans 2 Columns */}
          <Card className="md:col-span-2 bg-card border-border/60 shadow-sm hover:shadow-md transition-all overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="w-32 h-32 text-primary" />
            </div>
            <CardHeader className="relative z-10">
              <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Track Your Portfolio</CardTitle>
              <CardDescription className="text-base mt-2 max-w-lg">
                Create your portfolio and track every trade with daily price
                updates. Monitor performance with comprehensive analytics
                including win rate, returns, and risk metrics.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              {/* Decorative mini-graph or UI element could go here */}
              <div className="h-32 bg-primary/5 rounded-lg border border-primary/10 mt-4 w-full flex items-center justify-center text-muted-foreground text-sm italic">
                Performance Analytics Dashboard Preview
              </div>
            </CardContent>
          </Card>

          {/* Secondary Feature - Vertical */}
          <Card className="md:col-span-1 bg-card border-border/60 shadow-sm hover:shadow-md transition-all group">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-accent-foreground" />
              </div>
              <CardTitle className="text-xl">Document Your Thesis</CardTitle>
              <CardDescription className="mt-2">
                Before every trade, write down your investment thesis. Document
                entry price, target price, and stop loss.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Third Feature - Full Width Bottom */}
          <Card className="md:col-span-3 bg-gradient-to-r from-card to-muted/50 border-border/60 shadow-sm hover:shadow-md transition-all">
            <div className="flex flex-col md:flex-row items-center">
              <CardHeader className="flex-1">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle className="text-2xl">Build Your Following</CardTitle>
                <CardDescription className="text-lg mt-2">
                  Share your insights with the community. As you build a proven
                  track record, you'll attract followers who learn from your
                  research and investment process.
                </CardDescription>
              </CardHeader>
              <div className="p-8 hidden md:block">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground"
                    >
                      U{i}
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-2 border-background bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    +1k
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Mission & Vision Section - "The Business Card for Finance" */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-32 py-24 border-y border-border/40 relative overflow-hidden bg-muted/20"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-full bg-primary/5 blur-3xl -z-10 pointer-events-none" />

          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-20">
              <span className="text-primary font-bold tracking-widest text-xs uppercase mb-4 block">
                The Mission
              </span>
              <h2 className="text-4xl md:text-5xl font-serif text-foreground leading-tight max-w-3xl mx-auto">
                Your Live Business Card for the Finance World.
              </h2>
              <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
                Whether you're a student breaking into the industry or a
                professional building your reputation, Thesivest is where you
                prove your edge.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 text-left">
              {/* Pillar 1: Career */}
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-serif text-foreground">
                  Build Your Track Record
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Stop sending static PDF resumes. Send a link to your live
                  portfolio. Show employers exactly what you bought, when you
                  bought it, and{" "}
                  <span className="text-foreground font-medium">why</span>.
                  Prove your analysis skills with a verified history of your
                  calls.
                </p>
              </div>

              {/* Pillar 2: AI Research */}
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-2">
                  <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-serif text-foreground">
                  Leverage AI Research
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Professional grade data at your fingertips. We're integrating
                  advanced AI tools to help you tear down 10-Ks, analyze
                  earnings calls, and stress-test your thesis in seconds, not
                  hours. Focus on the decision, not the data entry.
                </p>
              </div>

              {/* Pillar 3: Community */}
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-2xl font-serif text-foreground">
                  Follow the Smart Money
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Don't invest in a vacuum. Follow top performers, read their
                  detailed investment memos, and debate the merits of a trade.
                  Build a following of your own by consistently sharing
                  high-quality insights.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Famous Funds Section - "Track the Giants" */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <FamousFunds />
        </motion.div>

        {/* How It Works Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-32"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">
              A Disciplined Process
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple steps to professionalize your investing journey.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Sign Up",
                description: "Create your free investor profile.",
              },
              {
                step: "02",
                title: "Add Thesis",
                description: "Document your research and targets.",
              },
              {
                step: "03",
                title: "Track",
                description: "Monitor performance with daily updates.",
              },
              {
                step: "04",
                title: "Grow",
                description: "Build reputation and community.",
              },
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="text-6xl font-black text-muted/20 absolute -top-8 -left-4 z-0 group-hover:text-primary/10 transition-colors select-none">
                  {item.step}
                </div>
                <div className="relative z-10 pt-4 px-2">
                  <h3 className="font-bold text-xl mb-2 text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-2 font-serif">
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
              <CardTitle className="text-3xl md:text-4xl mb-4 font-serif">
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
