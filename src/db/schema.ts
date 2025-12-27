import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  numeric,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Tournament Types
export type TournamentCategory =
  | "Value Investing"
  | "Growth Investing"
  | "Sector Focus"
  | "Options Trading"
  | "Crypto";

export type TournamentStatus = "Upcoming" | "Active" | "Completed";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  bio: text("bio"),
  isClub: boolean("is_club").default(false),
  clubName: text("club_name"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  posts: many(post),
  followers: many(follow, {
    relationName: "followers",
  }),
  following: many(follow, {
    relationName: "following",
  }),
  postLikes: many(postLike),
  comments: many(comment),
  tournamentParticipants: many(tournamentParticipant),
}));

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// Posts Table
export const post = pgTable("post", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  type: text("type").notNull(), // 'trade', 'thought', 'update'
  symbol: text("symbol"), // Required for trades
  title: text("title").notNull(),
  content: text("content").notNull(),
  buyPrice: numeric("buy_price"),
  buyDate: timestamp("buy_date"),
  currentPrice: numeric("current_price"),
  targetPrice: numeric("target_price"),
  stopLoss: numeric("stop_loss"),
  entryThoughts: text("entry_thoughts"),
  publishedAt: timestamp("published_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
});

export const postRelations = relations(post, ({ one, many }) => ({
  user: one(user, {
    fields: [post.userId],
    references: [user.id],
  }),
  tags: many(postTag),
  performance: many(tradePerformance),
  likes: many(postLike),
  comments: many(comment),
  tournamentParticipants: many(tournamentParticipant),
}));

// Tags
export const tag = pgTable("tag", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const tagRelations = relations(tag, ({ many }) => ({
  posts: many(postTag),
}));

export const postTag = pgTable("post_tag", {
  postId: text("post_id")
    .notNull()
    .references(() => post.id, { onDelete: "cascade" }),
  tagId: text("tag_id")
    .notNull()
    .references(() => tag.id, { onDelete: "cascade" }),
});

export const postTagRelations = relations(postTag, ({ one }) => ({
  post: one(post, {
    fields: [postTag.postId],
    references: [post.id],
  }),
  tag: one(tag, {
    fields: [postTag.tagId],
    references: [tag.id],
  }),
}));

// Trade Performance
export const tradePerformance = pgTable("trade_performance", {
  id: text("id").primaryKey(),
  postId: text("post_id")
    .notNull()
    .references(() => post.id),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  currentPrice: numeric("current_price").notNull(),
  returnPercent: numeric("return_percent").notNull(),
  returnAmount: numeric("return_amount"),
  status: text("status").notNull(), // 'active', 'win', 'loss', 'breakeven'
  updatedAt: timestamp("updated_at").notNull(),
});

export const tradePerformanceRelations = relations(
  tradePerformance,
  ({ one }) => ({
    post: one(post, {
      fields: [tradePerformance.postId],
      references: [post.id],
    }),
    user: one(user, {
      fields: [tradePerformance.userId],
      references: [user.id],
    }),
  })
);

// Follow System
export const follow = pgTable("follow", {
  followerId: text("follower_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  followingId: text("following_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull(),
});

export const followRelations = relations(follow, ({ one }) => ({
  follower: one(user, {
    fields: [follow.followerId],
    references: [user.id],
    relationName: "following",
  }),
  following: one(user, {
    fields: [follow.followingId],
    references: [user.id],
    relationName: "followers",
  }),
}));

// Post Likes
export const postLike = pgTable("post_like", {
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  postId: text("post_id")
    .notNull()
    .references(() => post.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull(),
});

export const postLikeRelations = relations(postLike, ({ one }) => ({
  user: one(user, {
    fields: [postLike.userId],
    references: [user.id],
  }),
  post: one(post, {
    fields: [postLike.postId],
    references: [post.id],
  }),
}));

// Comments
export const comment = pgTable("comment", {
  id: text("id").primaryKey(),
  postId: text("post_id")
    .notNull()
    .references(() => post.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const commentRelations = relations(comment, ({ one }) => ({
  post: one(post, {
    fields: [comment.postId],
    references: [post.id],
  }),
  user: one(user, {
    fields: [comment.userId],
    references: [user.id],
  }),
}));

// Tournament Tables
export const tournament = pgTable("tournament", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // 'Value Investing', 'Growth Investing', 'Sector Focus', 'Options Trading', 'Crypto'
  status: text("status").notNull(), // 'Upcoming', 'Active', 'Completed'
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  participants: integer("participants").default(0),
  prizePool: text("prize_pool").notNull(),
  rules: text("rules").array(), // Stored as JSON array
  icon: text("icon").notNull(), // lucide icon name
});

export const tournamentRelations = relations(tournament, ({ many }) => ({
  participants: many(tournamentParticipant),
}));

export const tournamentParticipant = pgTable("tournament_participant", {
  id: text("id").primaryKey(),
  tournamentId: text("tournament_id")
    .notNull()
    .references(() => tournament.id),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  postId: text("post_id")
    .notNull()
    .references(() => post.id),
  rank: integer("rank"),
  score: numeric("score"),
  joinedAt: timestamp("joined_at").notNull(),
});

export const tournamentParticipantRelations = relations(
  tournamentParticipant,
  ({ one }) => ({
    tournament: one(tournament, {
      fields: [tournamentParticipant.tournamentId],
      references: [tournament.id],
    }),
    user: one(user, {
      fields: [tournamentParticipant.userId],
      references: [user.id],
    }),
    post: one(post, {
      fields: [tournamentParticipant.postId],
      references: [post.id],
    }),
  })
);
