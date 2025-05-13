import { drizzle } from "drizzle-orm/singlestore";
import { createPool, type Pool } from "mysql2/promise";

import { env } from "~/env";
import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: Pool | undefined;
};

export const conn =
  globalForDb.conn ??
  createPool({
    host: env.SINGLESTORE_HOST ?? "localhost",
    port: parseInt(env.SINGLESTORE_PORT ?? "3306"),
    user: env.SINGLESTORE_USER ?? "root",
    password: env.SINGLESTORE_PASS ?? "",
    database: env.SINGLESTORE_DB_NAME ?? "mydb",    
    maxIdle: 0,
    ssl: {
      rejectUnauthorized: false,
    },
  });
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
