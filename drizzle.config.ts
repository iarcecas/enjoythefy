/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "singlestore",
  tablesFilter: ["spotify_*"],
  dbCredentials: {
    host: env.SINGLESTORE_HOST ?? "drizzle",
    port: parseInt(env.SINGLESTORE_PORT ?? "3306"),
    user: env.SINGLESTORE_USER ?? "root",
    password: env.SINGLESTORE_PASS ?? "",
    database: env.SINGLESTORE_DB_NAME ?? "mydb",
    ssl: {
      rejectUnauthorized: false,
    },
  },
} satisfies Config;
