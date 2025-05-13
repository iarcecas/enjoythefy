import { sql } from "drizzle-orm";
import {
  text,
  singlestoreTableCreator,
  timestamp,
  datetime,
  varchar,
  index,
  json,
} from "drizzle-orm/singlestore-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = singlestoreTableCreator((name) => `${name}`);

export const posts = createTable(
  "post",
  (d) => ({
    id: d.bigint({ mode: "number" }).primaryKey().autoincrement(),
    name: d.text(),
    createdAt: d
      .bigint({ mode: "number" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d
      .bigint({ mode: "number" })
      .$onUpdate(() => new Date().getTime()),
  }),
  (t) => [index("name_idx").on(t.name)],
);

export const spotifyListeningHistory = createTable(
  "spotify_listening_history",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    user_id: text("user_id").notNull(),
    track_id: text("track_id").notNull(),
    played_at: datetime("played_at").notNull(),
    track_name: text("track_name"),
    artist_name: text("artist_name"),
    album_name: text("album_name"),
    image_url: text("image_url"),
    inserted_at: timestamp("inserted_at").defaultNow(),
  },
);

export const userMonthlyStats = createTable("user_monthly_stats", {
  id: varchar("id", { length: 128 }).primaryKey(), // userId_year_month
  user_id: text("user_id").notNull(),
  year: varchar("year", { length: 4 }).notNull(),
  month: varchar("month", { length: 2 }).notNull(),
  listening_time: varchar("listening_time", { length: 16 }).notNull(), // e.g. '4h 43m'
  tracks_played: text("tracks_played").notNull(),
  top_genre: text("top_genre").notNull(),
  liked_songs: text("liked_songs").notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  top_tracks: json("top_tracks").notNull(),
});

export type DB_TrackHistory = typeof spotifyListeningHistory.$inferSelect;
export type DB_UserMonthlyStats = typeof userMonthlyStats.$inferSelect;
