/**
 * Data Access Layer for Users
 * Handles all database queries related to users, followers, and social interactions
 */

import { User } from "better-auth";
import { db } from "../../db/index";
import { user, follow, post } from "../../db/schema";
import { eq, desc, sql } from "drizzle-orm";

/**
 * Get user by ID
 */
export async function getUserById(id: string) {
  const users = await db.select().from(user).where(eq(user.id, id)).limit(1);

  if (users.length === 0) return null;

  const userData = users[0];

  // Get post count
  const posts = await db
    .select({ count: sql<number>`count(*)` })
    .from(post)
    .where(eq(post.userId, userData.id));

  // Get followers count
  const followers = await db
    .select({ count: sql<number>`count(*)` })
    .from(follow)
    .where(eq(follow.followingId, id));

  // Get following count
  const following = await db
    .select({ count: sql<number>`count(*)` })
    .from(follow)
    .where(eq(follow.followerId, id));

  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    emailVerified: userData.emailVerified,
    image: userData.image || undefined,
    bio: userData.bio || undefined,
    isClub: userData.isClub || undefined,
    clubName: userData.clubName || undefined,
    verified: userData.verified || undefined,
    createdAt: userData.createdAt,
    updatedAt: userData.updatedAt,
    totalPosts: Number(posts[0]?.count || 0),
    followersCount: Number(followers[0]?.count || 0),
    followingCount: Number(following[0]?.count || 0),
  };
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  const users = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (users.length === 0) return null;

  const userData = users[0];

  // Get post count
  const posts = await db
    .select({ count: sql<number>`count(*)` })
    .from(post)
    .where(eq(post.userId, userData.id));

  // Get followers count
  const followers = await db
    .select({ count: sql<number>`count(*)` })
    .from(follow)
    .where(eq(follow.followingId, userData.id));

  // Get following count
  const following = await db
    .select({ count: sql<number>`count(*)` })
    .from(follow)
    .where(eq(follow.followerId, userData.id));

  return {
    ...userData,
    image: userData.image || undefined,
    name: userData.name || undefined,
    bio: userData.bio || undefined,
    isClub: userData.isClub || undefined,
    clubName: userData.clubName || undefined,
    verified: userData.verified || undefined,
    totalPosts: Number(posts[0]?.count || 0),
    followersCount: Number(followers[0]?.count || 0),
    followingCount: Number(following[0]?.count || 0),
  };
}

/**
 * Get user by name
 */
export async function getUserByname(name: string) {
  const users = await db
    .select()
    .from(user)
    .where(eq(user.name, name))
    .limit(1);

  if (users.length === 0) return null;

  const userData = users[0];

  // Get post count
  const posts = await db
    .select({ count: sql<number>`count(*)` })
    .from(post)
    .where(eq(post.userId, userData.id));

  // Get followers count
  const followers = await db
    .select({ count: sql<number>`count(*)` })
    .from(follow)
    .where(eq(follow.followingId, userData.id));

  // Get following count
  const following = await db
    .select({ count: sql<number>`count(*)` })
    .from(follow)
    .where(eq(follow.followerId, userData.id));

  return {
    ...userData,
    image: userData.image || undefined,
    name: userData.name || undefined,
    bio: userData.bio || undefined,
    isClub: userData.isClub || undefined,
    clubName: userData.clubName || undefined,
    verified: userData.verified || undefined,
    totalPosts: Number(posts[0]?.count || 0),
    followersCount: Number(followers[0]?.count || 0),
    followingCount: Number(following[0]?.count || 0),
  };
}

/**
 * Get all users
 */
export async function getAllUsers(limit?: number) {
  let query = db.select().from(user).orderBy(desc(user.createdAt));

  if (limit) {
    query.limit(limit);
  }

  const users = await query;

  // Get stats for each user
  const usersWithStats = await Promise.all(
    users.map(async (u) => {
      const posts = await db
        .select({ count: sql<number>`count(*)` })
        .from(post)
        .where(eq(post.userId, u.id));

      const followers = await db
        .select({ count: sql<number>`count(*)` })
        .from(follow)
        .where(eq(follow.followingId, u.id));

      const following = await db
        .select({ count: sql<number>`count(*)` })
        .from(follow)
        .where(eq(follow.followerId, u.id));

      return {
        ...u,
        image: u.image || undefined,
        name: u.name || undefined,
        bio: u.bio || undefined,
        isClub: u.isClub || undefined,
        clubName: u.clubName || undefined,
        verified: u.verified || undefined,
        totalPosts: Number(posts[0]?.count || 0),
        followersCount: Number(followers[0]?.count || 0),
        followingCount: Number(following[0]?.count || 0),
      };
    })
  );

  return usersWithStats;
}

/**
 * Check if user A is following user B
 */
export async function isFollowing(
  followerId: string,
  followingId: string
): Promise<boolean> {
  const result = await db
    .select()
    .from(follow)
    .where(
      sql`${follow.followerId} = ${followerId} AND ${follow.followingId} = ${followingId}`
    )
    .limit(1);

  return result.length > 0;
}

/**
 * Follow a user
 */
export async function followUser(
  followerId: string,
  followingId: string
): Promise<void> {
  await db.insert(follow).values({
    followerId,
    followingId,
    createdAt: new Date(),
  });
}

/**
 * Unfollow a user
 */
export async function unfollowUser(
  followerId: string,
  followingId: string
): Promise<void> {
  await db
    .delete(follow)
    .where(
      sql`${follow.followerId} = ${followerId} AND ${follow.followingId} = ${followingId}`
    );
}

/**
 * Get followers for a user
 */
export async function getFollowers(userId: string, limit?: number) {
  let query = db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      bio: user.bio,
      isClub: user.isClub,
      clubName: user.clubName,
      verified: user.verified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
    .from(user)
    .innerJoin(follow, eq(user.id, follow.followerId))
    .where(eq(follow.followingId, userId))
    .orderBy(desc(follow.createdAt));

  if (limit) {
    query.limit(limit);
  }

  const users = await query;

  // Get stats for each user
  const usersWithStats = await Promise.all(
    users.map(async (u) => {
      const posts = await db
        .select({ count: sql<number>`count(*)` })
        .from(post)
        .where(eq(post.userId, u.id));

      const followers = await db
        .select({ count: sql<number>`count(*)` })
        .from(follow)
        .where(eq(follow.followingId, u.id));

      const following = await db
        .select({ count: sql<number>`count(*)` })
        .from(follow)
        .where(eq(follow.followerId, u.id));

      return {
        ...u,
        image: u.image || undefined,
        name: u.name || undefined,
        bio: u.bio || undefined,
        isClub: u.isClub || undefined,
        clubName: u.clubName || undefined,
        verified: u.verified || undefined,
        totalPosts: Number(posts[0]?.count || 0),
        followersCount: Number(followers[0]?.count || 0),
        followingCount: Number(following[0]?.count || 0),
      };
    })
  );

  return usersWithStats;
}

/**
 * Get users a user is following
 */
export async function getFollowing(userId: string, limit?: number) {
  let query = db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      bio: user.bio,
      isClub: user.isClub,
      clubName: user.clubName,
      verified: user.verified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
    .from(user)
    .innerJoin(follow, eq(user.id, follow.followingId))
    .where(eq(follow.followerId, userId))
    .orderBy(desc(follow.createdAt));

  if (limit) {
    query.limit(limit);
  }

  const users = await query;

  // Get stats for each user
  const usersWithStats = await Promise.all(
    users.map(async (u) => {
      const posts = await db
        .select({ count: sql<number>`count(*)` })
        .from(post)
        .where(eq(post.userId, u.id));

      const followers = await db
        .select({ count: sql<number>`count(*)` })
        .from(follow)
        .where(eq(follow.followingId, u.id));

      const following = await db
        .select({ count: sql<number>`count(*)` })
        .from(follow)
        .where(eq(follow.followerId, u.id));

      return {
        ...u,
        image: u.image || undefined,
        name: u.name || undefined,
        bio: u.bio || undefined,
        isClub: u.isClub || undefined,
        clubName: u.clubName || undefined,
        verified: u.verified || undefined,
        totalPosts: Number(posts[0]?.count || 0),
        followersCount: Number(followers[0]?.count || 0),
        followingCount: Number(following[0]?.count || 0),
      };
    })
  );

  return usersWithStats;
}

/**
 * Update user profile
 */
export async function updateUser(id: string, data: Partial<User>) {
  await db
    .update(user)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(user.id, id));
}
