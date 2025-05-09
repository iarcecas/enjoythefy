// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, sqliteTableCreator } from "drizzle-orm/sqlite-core";
import {
  mysqlTable,
  varchar,
  datetime,
  timestamp,
} from "drizzle-orm/mysql-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `enjoythefy_${name}`);

export const posts = createTable(
  "post",
  (d) => ({
    id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    name: d.text({ length: 256 }),
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
  }),
  (t) => [index("name_idx").on(t.name)],
);

export const spotifyListeningHistory = mysqlTable("spotify_listening_history", {
  id: varchar("id", { length: 128 }).primaryKey(),
  user_id: varchar("user_id", { length: 64 }).notNull(),
  track_id: varchar("track_id", { length: 64 }).notNull(),
  played_at: datetime("played_at", { fsp: 3 }).notNull(),
  track_name: varchar("track_name", { length: 255 }),
  artist_name: varchar("artist_name", { length: 255 }),
  album_name: varchar("album_name", { length: 255 }),
  image_url: varchar("image_url", { length: 255 }),
  inserted_at: timestamp("inserted_at").defaultNow(),
});
