import { createFileRoute, Link } from "@tanstack/react-router";
import { useLoaderData } from "@tanstack/react-router";
import { getProfileFn } from "../server/fn/profile";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  DollarSign,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/profiles/$id")({
  loader: async ({ params }) => {
    const profile = await getProfileFn({ data: { id: params.id } });
    return { profile };
  },
  component: Profile,
});

function Profile() {
  const { profile } = useLoaderData({ from: "/profiles/$id" });

  if (!profile) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Profile Header */}
      <div className="border-b bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="w-36 h-36 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden border-4 border-background shadow-2xl ring-2 ring-primary/10">
                {profile.image ? (
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
                    {profile.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              {profile.verified && (
                <Badge className="mt-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
                  ✓ Verified
                </Badge>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {profile.name}
                </h1>
                {profile.displayName && (
                  <Badge variant="outline" className="text-base px-3 py-1">
                    @{profile.displayName}
                  </Badge>
                )}
                {profile.isClub && (
                  <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                    Investment Club
                  </Badge>
                )}
              </div>

              {profile.bio && (
                <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                  {profile.bio}
                </p>
              )}

              {/* Social Links */}
              <div className="flex flex-wrap gap-4 mb-4">
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                  >
                    🌐 Website
                  </a>
                )}
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                  >
                    💼 LinkedIn
                  </a>
                )}
                {profile.twitter && (
                  <a
                    href={profile.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                  >
                    🐦 Twitter
                  </a>
                )}
                {profile.location && (
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    📍 {profile.location}
                  </span>
                )}
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-8 mb-6">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {profile.totalPosts}
                  </span>
                  <span className="text-sm text-muted-foreground font-medium">
                    Posts
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {profile.followersCount}
                  </span>
                  <span className="text-sm text-muted-foreground font-medium">
                    Followers
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {profile.followingCount}
                  </span>
                  <span className="text-sm text-muted-foreground font-medium">
                    Following
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20 font-semibold"
                >
                  Follow
                </Button>
                <Button size="lg" variant="outline">
                  Share Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Performance Overview Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            Performance Metrics
          </h2>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card/50 backdrop-blur border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground font-medium">
                Best Trade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                +{profile.bestTrade?.toFixed(2) || "0.00"}%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground font-medium">
                Worst Trade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {profile.worstTrade?.toFixed(2) || "0.00"}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk/Reward Metrics */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/0 border-primary/10 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Risk-Adjusted Performance
            </CardTitle>
            <CardDescription>
              Performance metrics adjusted for risk to provide a clearer picture
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Total Trades
                </div>
                <div className="text-2xl font-bold">{profile.totalTrades}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {profile.activeTrades} currently active
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trading Performance Chart */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/0 border-primary/10 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Trading Performance Over Time
            </CardTitle>
            <CardDescription>
              Visual representation of trading performance and cumulative
              returns
            </CardDescription>
          </CardHeader>
          <CardContent>
            {profile.totalTrades > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { name: "Jan", value: 100 },
                      { name: "Feb", value: 120 },
                      { name: "Mar", value: 115 },
                      { name: "Apr", value: 130 },
                      { name: "May", value: 145 },
                      { name: "Jun", value: 140 },
                      { name: "Jul", value: 155 },
                      { name: "Aug", value: 165 },
                      { name: "Sep", value: 160 },
                      { name: "Oct", value: 175 },
                      { name: "Nov", value: 185 },
                      { name: "Dec", value: 195 },
                    ]}
                  >
                    <defs>
                      <linearGradient
                        id="colorPerformance"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--color-primary)"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-primary)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--color-border)"
                      strokeOpacity={0.2}
                    />
                    <XAxis
                      dataKey="name"
                      stroke="var(--color-muted-foreground)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="var(--color-muted-foreground)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-popover/95 backdrop-blur border border-border rounded-lg shadow-lg p-3">
                              <p className="text-sm font-medium mb-1">
                                {label}
                              </p>
                              <p className="text-lg font-bold text-primary">
                                {payload[0].value}%
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="var(--color-primary)"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorPerformance)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Activity className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No trading data yet
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Start documenting your trades to see your performance chart
                  here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Buys and Sells Summary */}
        <Card className="bg-card/50 backdrop-blur border-border mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Buy & Sell Activity
            </CardTitle>
            <CardDescription>Overview of your trading activity</CardDescription>
          </CardHeader>
          <CardContent>
            {profile.totalTrades > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Buys Card */}
                <div className="p-6 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-muted-foreground font-medium">
                      Total Buys
                    </div>
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                      Active: {profile.activeTrades}
                    </Badge>
                  </div>
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {profile.totalTrades}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    Positions opened
                  </div>
                </div>

                {/* Sells Card */}
                <div className="p-6 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-muted-foreground font-medium">
                      Total Sells
                    </div>
                    <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                      Closed: {profile.totalTrades - profile.activeTrades}
                    </Badge>
                  </div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {profile.totalTrades - profile.activeTrades}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <TrendingDown className="w-4 h-4 inline mr-1" />
                    Positions closed
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <TrendingUp className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No trading activity yet
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Start buying and selling stocks to see your trading activity
                  here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Posts Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Recent Posts
            </h2>
            <Link
              to="/profiles/$id/trades"
              params={{ id: Route.useParams().id }}
            >
              <Button variant="outline" size="sm">
                View All Trades
              </Button>
            </Link>
          </div>
        </div>

        {/* Education Section */}
        {profile.educations && profile.educations.length > 0 && (
          <Card className="bg-card/50 backdrop-blur border-border mt-8">
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.educations.map((edu) => (
                  <div
                    key={edu.id}
                    className="border-l-4 border-primary pl-4 py-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{edu.degree}</h3>
                        <p className="text-muted-foreground">{edu.school}</p>
                        {edu.field && (
                          <p className="text-sm text-muted-foreground">
                            {edu.field}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {new Date(edu.startDate).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          -{" "}
                          {edu.current
                            ? "Present"
                            : edu.endDate
                            ? new Date(edu.endDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "N/A"}
                        </p>
                        {(edu.gpa || edu.honors) && (
                          <div className="mt-2 flex gap-2 flex-wrap">
                            {edu.gpa && <Badge>GPA: {edu.gpa}</Badge>}
                            {edu.honors && <Badge>{edu.honors}</Badge>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Certifications Section */}
        {profile.certifications && profile.certifications.length > 0 && (
          <Card className="bg-card/50 backdrop-blur border-border mt-8">
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="border-l-4 border-primary pl-4 py-2"
                  >
                    <h3 className="font-semibold text-lg">{cert.name}</h3>
                    <p className="text-muted-foreground">{cert.organization}</p>
                    <p className="text-sm text-muted-foreground">
                      Issued:{" "}
                      {new Date(cert.issueDate).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    {cert.expirationDate && (
                      <p className="text-sm text-muted-foreground">
                        Expires:{" "}
                        {new Date(cert.expirationDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    )}
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm"
                      >
                        View Credential
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
