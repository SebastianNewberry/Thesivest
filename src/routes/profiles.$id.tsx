import { createFileRoute, Link } from "@tanstack/react-router";
import { useLoaderData } from "@tanstack/react-router";
import { getProfileFn } from "../server/fn/profile";
import { getUserById } from "../server/data-access/users";
import {
  isFollowing,
  followUser,
  unfollowUser,
} from "../server/data-access/users";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

// Follow function
const followFn = createServerFn({ method: "POST" })
  .inputValidator((z) =>
    z.object({
      followerId: z.string().cuid("Invalid follower ID"),
      followingId: z.string().cuid("Invalid following ID"),
    })
  )
  .handler(async ({ input: { followerId, followingId } }) => {
    await followUser(followerId, followingId);
    return { success: true };
  });

// Unfollow function
const unfollowFn = createServerFn({ method: "POST" })
  .inputValidator((z) =>
    z.object({
      followerId: z.string().cuid("Invalid follower ID"),
      followingId: z.string().cuid("Invalid following ID"),
    })
  )
  .handler(async ({ input: { followerId, followingId } }) => {
    await unfollowUser(followerId, followingId);
    return { success: true };
  });

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
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-4 border-background shadow-lg">
                {profile.image ? (
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-primary">
                    {profile.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              {profile.verified && (
                <Badge className="mt-2 bg-blue-500 text-white">
                  ✓ Verified
                </Badge>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                {profile.username && (
                  <Badge variant="outline">@{profile.username}</Badge>
                )}
                {profile.isClub && (
                  <Badge className="bg-purple-500 text-white">
                    Investment Club
                  </Badge>
                )}
                {profile.availableForHire && (
                  <Badge className="bg-green-500 text-white">
                    Available for Hire
                  </Badge>
                )}
                {profile.seekingEmployment && (
                  <Badge className="bg-orange-500 text-white">
                    Open to Opportunities
                  </Badge>
                )}
              </div>

              {profile.bio && (
                <p className="text-muted-foreground mb-4">{profile.bio}</p>
              )}

              {/* Social Links */}
              <div className="flex gap-4 mb-4">
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Website
                  </a>
                )}
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    LinkedIn
                  </a>
                )}
                {profile.twitter && (
                  <a
                    href={profile.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Twitter
                  </a>
                )}
                {profile.location && (
                  <span className="text-muted-foreground">
                    {profile.location}
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mb-4">
                <div>
                  <div className="text-2xl font-bold">{profile.totalPosts}</div>
                  <div className="text-sm text-muted-foreground">Posts</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {profile.followersCount}
                  </div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {profile.followingCount}
                  </div>
                  <div className="text-sm text-muted-foreground">Following</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button>Follow</Button>
                <Button variant="outline">Share Profile</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Performance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="glassmorphism">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Win Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {profile.winRate.toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Total Return
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-3xl font-bold ${
                  profile.totalReturn >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {profile.totalReturn >= 0 ? "+" : ""}$
                {profile.totalReturn.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Average Return
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-3xl font-bold ${
                  profile.averageReturn >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {profile.averageReturn >= 0 ? "+" : ""}{" "}
                {profile.averageReturn.toFixed(2)}%
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Total Trades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{profile.totalTrades}</div>
              <div className="text-sm text-muted-foreground">
                {profile.activeTrades} active
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Streaks */}
        <Card className="glassmorphism mb-8">
          <CardHeader>
            <CardTitle>Trading Streaks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-2xl font-bold text-green-500">
                  {profile.streaks.currentWinStreak}
                </div>
                <div className="text-sm text-muted-foreground">
                  Current Win Streak
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {profile.streaks.longestWinStreak}
                </div>
                <div className="text-sm text-muted-foreground">
                  Longest Win Streak
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-500">
                  {profile.streaks.currentLossStreak}
                </div>
                <div className="text-sm text-muted-foreground">
                  Current Loss Streak
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {profile.streaks.longestLossStreak}
                </div>
                <div className="text-sm text-muted-foreground">
                  Longest Loss Streak
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Metrics */}
        <Card className="glassmorphism mb-8">
          <CardHeader>
            <CardTitle>Community Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {profile.totalViews.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Views</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-500">
                  {profile.totalLikes.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Likes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">
                  {profile.totalComments.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Comments
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Education Section */}
        {profile.educations.length > 0 && (
          <Card className="glassmorphism mb-8">
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
        {profile.certifications.length > 0 && (
          <Card className="glassmorphism">
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
