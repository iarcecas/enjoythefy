/* eslint-disable @typescript-eslint/no-unused-vars */
import { type Handler } from "@netlify/functions";
import SpotifyWebApi from "spotify-web-api-node";
import mysql, { type Pool } from "mysql2/promise";
import fetch from "node-fetch";
import { drizzle } from "drizzle-orm/singlestore";
import * as schema from "../../src/server/db/schema"; // Adjusted path for schema import

interface ClerkUser {
  id: string;
  private_metadata?: {
    spotify?: {
      refresh_token?: string;
    };
  };
}

interface UserWithRefreshToken {
  id: string;
  refresh_token: string;
}

// Use a global variable to cache the pool in dev
const globalForDb = globalThis as unknown as { pool: Pool | undefined };

const pool =
  globalForDb.pool ??
  mysql.createPool({
    host: process.env.SINGLESTORE_HOST ?? "s",
    port: parseInt(process.env.SINGLESTORE_PORT ?? "3306"),
    user: process.env.SINGLESTORE_USER ?? "root",
    password: process.env.SINGLESTORE_PASS ?? "",
    database: process.env.SINGLESTORE_DB_NAME ?? "mydb",
    ssl: {},
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 0,
  });

if (process.env.NODE_ENV !== "production") globalForDb.pool = pool;

export const db = drizzle(pool, { schema });

async function updateUserInClerk(
  userId: string,
  data: { spotify_refresh_token?: string },
) {
  const clerkApiUrl = `https://api.clerk.com/v1/users/${userId}`;
  const res = await fetch(clerkApiUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorBody = await res.text();
    console.error(
      `Failed to update user in Clerk: ${res.status} ${res.statusText}. Response: ${errorBody}`,
    );
  }
}
// Clerk API integration
async function getAllUsersWithRefreshTokens(): Promise<UserWithRefreshToken[]> {
  const users: UserWithRefreshToken[] = [];
  let offset = 0;
  const limit = 100; // Adjust limit as per Clerk API recommendations/limits
  let hasMore = true;

  while (hasMore) {
    const clerkApiUrl = `https://api.clerk.com/v1/users?limit=${limit}&offset=${offset}`;
    try {
      const res = await fetch(clerkApiUrl, {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          "Content-Type": "application/json", // Good practice to include Content-Type
        },
      });

      if (!res.ok) {
        const errorBody = await res.text();
        console.error(
          `Failed to fetch users from Clerk: ${res.status} ${res.statusText}. Response: ${errorBody}`,
        );
        break; // Exit loop on error
      }

      const data = (await res.json()) as ClerkUser[];
      if (data.length === 0) {
        hasMore = false; // No more users to fetch
        continue;
      }

      for (const user of data) {
        const refresh_token = user.private_metadata?.spotify?.refresh_token;
        if (refresh_token) {
          users.push({ id: user.id, refresh_token });
        }
      }

      hasMore = data.length === limit; // If we received less than the limit, we're on the last page
      offset += limit;
    } catch (error) {
      console.error("Error during fetch operation from Clerk:", error);
      hasMore = false; // Stop pagination on network or other fetch-related errors
    }
  }
  return users;
}

const handler: Handler = async (event, context) => {
  let connection; // Define connection here to ensure it's available in a finally block if needed

  try {
    // Connect to SingleStore
    connection = await pool.getConnection();

    // Fetch all users and their refresh tokens from Clerk
    const users: UserWithRefreshToken[] = await getAllUsersWithRefreshTokens();

    if (users.length === 0) {
      console.log("No users with refresh tokens found to process.");
      return { statusCode: 200, body: "No users to process." };
    }

    for (const user of users) {
      // user.refresh_token is already checked in getAllUsersWithRefreshTokens,
      // but an explicit check here is fine if structure might change.
      if (!user.refresh_token) {
        console.warn(`User ${user.id} is missing a refresh token. Skipping.`);
        continue;
      }

      const spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        redirectUri: process.env.SPOTIFY_REDIRECT_URI, // Though not strictly needed for refresh token flow, good to have if object is reused
      });
      spotifyApi.setRefreshToken(user.refresh_token);

      // Refresh access token
      try {
        const tokenData = await spotifyApi.refreshAccessToken();
        spotifyApi.setAccessToken(tokenData.body.access_token);
        if (tokenData.body.refresh_token) {
          spotifyApi.setRefreshToken(tokenData.body.refresh_token);
          // Here you might want to update the new refresh token in Clerk for this user
          console.log(
            `New refresh token received for user ${user.id}. Consider updating it in Clerk.`,
          );
          await updateUserInClerk(user.id, {
            spotify_refresh_token: tokenData.body.refresh_token,
          });
        }
      } catch (err) {
        console.error(`Failed to refresh token for user ${user.id}:`, err);
        // Potentially handle specific errors, e.g., invalid refresh token, then mark it in Clerk or DB
        continue; // Skip this user if token refresh fails
      }

      // Fetch recently played tracks
      try {
        const { body: recentlyPlayed } =
          await spotifyApi.getMyRecentlyPlayedTracks({
            limit: 50, // Max limit is 50
          });

        if (recentlyPlayed.items.length === 0) {
          console.log(`No recently played tracks for user ${user.id}.`);
          continue;
        }

        for (const item of recentlyPlayed.items) {
          const { track, played_at } = item;
          if (!track) {
            // Check if track object is null (can happen for podcasts or other content)
            console.warn(
              `Skipping item without track data for user ${user.id} at ${played_at}`,
            );
            continue;
          }
          const { id, name, artists, album } = track;
          const playedAt = new Date(played_at);
          const artistName = artists[0]?.name || "Unknown Artist";
          const albumName = album?.name || "Unknown Album";
          const imageUrl = album?.images[0]?.url || ""; // Or a default placeholder image URL

          // Unique ID for the listening history entry
          const entryId = `${user.id}_${id}_${playedAt.getTime()}`;

          // Insert if not already present
          // Note: `INSERT IGNORE` depends on a primary key or unique constraint on `id` or (user_id, track_id, played_at)
          // Ensure your table `spotify_listening_history` has a unique constraint on (user_id, track_id, played_at)
          // or that `id` is the PRIMARY KEY for `INSERT IGNORE` to work as expected for preventing duplicates.
          const query = `
            INSERT IGNORE INTO spotify_listening_history 
              (id, user_id, track_id, played_at, track_name, artist_name, album_name, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `;
          await connection.execute(query, [
            entryId,
            user.id,
            id,
            playedAt,
            name,
            artistName,
            albumName,
            imageUrl,
          ]);
        }
      } catch (err) {
        console.error(
          `Failed to fetch or store tracks for user ${user.id}:`,
          err,
        );
        // Continue with the next user even if this one fails
      }

      // --- Monthly Stats Aggregation ---
      // Get current year and month
      const now = new Date();
      const year = now.getFullYear().toString();
      const month = (now.getMonth() + 1).toString().padStart(2, "0");
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      // Fetch all listening history for this user for this month
      const [monthlyHistoryRows] = await connection.execute(
        `SELECT * FROM spotify_listening_history WHERE user_id = ? AND played_at >= ? AND played_at < ?`,
        [user.id, monthStart, monthEnd],
      );
      type MonthlyHistoryRow = {
        track_id: string;
        track_name: string;
        artist_name: string;
        album_name: string;
        image_url: string;
      };
      const monthlyHistory: MonthlyHistoryRow[] = Array.isArray(
        monthlyHistoryRows,
      )
        ? (monthlyHistoryRows as MonthlyHistoryRow[])
        : [];
      const tracksPlayed = monthlyHistory.length;
      const avgTrackLength = 3.5; // minutes
      const totalMinutes = tracksPlayed * avgTrackLength;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = Math.floor(totalMinutes % 60);
      const listeningTime = `${hours}h ${minutes}m`;

      // --- Top Genre Calculation ---
      // Collect all artist names from this month's tracks
      const artistNames = monthlyHistory
        .map((row) => row.artist_name)
        .filter(Boolean);
      // Fetch genres for unique artists (limit to 10 for rate limits)
      const uniqueArtistNames = Array.from(new Set(artistNames)).slice(0, 10);
      const genreCounts: Record<string, number> = {};
      for (const artistName of uniqueArtistNames) {
        try {
          // Search for artist to get their Spotify ID
          const searchRes = await spotifyApi.searchArtists(artistName, {
            limit: 1,
          });
          const artist = searchRes.body.artists?.items?.[0];
          if (artist?.genres) {
            for (const genre of artist.genres) {
              genreCounts[genre] = (genreCounts[genre] || 0) + 1;
            }
          }
        } catch (err) {
          // Ignore errors for individual artists
        }
      }
      const topGenre =
        Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
        "Unknown";

      // --- Liked Songs ---
      let likedSongs = 0;
      try {
        const likedRes = await spotifyApi.getMySavedTracks({ limit: 1 });
        likedSongs = likedRes.body.total || 0;
      } catch (err) {
        likedSongs = 0;
      }

      // --- Top Tracks Calculation ---
      const trackMap = new Map();
      for (const row of monthlyHistory) {
        if (!trackMap.has(row.track_id)) {
          trackMap.set(row.track_id, {
            id: row.track_id,
            name: row.track_name,
            artist: row.artist_name,
            album: row.album_name,
            image: row.image_url,
            plays: 1,
          });
        } else {
          (trackMap.get(row.track_id) as { plays: number }).plays++;
        }
      }
      const topTracks = Array.from(trackMap.values())
        .sort((a, b) => (b as { plays: number }).plays - (a as { plays: number }).plays)
        .slice(0, 5);
      
      // Store as JSON string
      const topTracksJson = JSON.stringify(topTracks);

      // --- Upsert monthly stats ---
      const statsId = `${user.id}_${year}_${month}`;
      await connection.execute(
        `REPLACE INTO user_monthly_stats (id, user_id, year, month, listening_time, tracks_played, top_genre, liked_songs, top_tracks, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          statsId,
          user.id,
          year,
          month,
          listeningTime,
          tracksPlayed.toString(),
          topGenre,
          likedSongs.toString(),
          topTracksJson,
        ],
      );
      // --- End Monthly Stats Aggregation ---
    }

    return {
      statusCode: 200,
      body: "Successfully processed user listening history.",
    };
  } catch (error) {
    console.error("An unexpected error occurred in the handler:", error);
    return {
      statusCode: 500,
      body: "Internal Server Error.",
    };
  } finally {
    if (connection) {
      connection.release(); // Remove await, as release() is not a Promise
      console.log("Database connection closed.");
    }
  }
};

export { handler };
