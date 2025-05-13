import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import { userMonthlyStats } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";

function getCurrentYearMonth() {
  const now = new Date();
  return {
    year: now.getFullYear().toString(),
    month: (now.getMonth() + 1).toString().padStart(2, "0"),
  };
}

interface TopTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  image: string;
  plays: number;
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { year, month } = getCurrentYearMonth();

    const [stats] = await db
      .select()
      .from(userMonthlyStats)
      .where(
        and(
          eq(userMonthlyStats.user_id, userId),
          eq(userMonthlyStats.year, year),
          eq(userMonthlyStats.month, month),
        ),
      );
    let topTracks: TopTrack[] = [];
    if (stats && Array.isArray((stats as Record<string, unknown>).top_tracks)) {
      topTracks = (stats as Record<string, unknown>).top_tracks as TopTrack[];
    }    
    return NextResponse.json(topTracks);
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    return NextResponse.json(
      { error: "Failed to fetch top tracks" },
      { status: 500 },
    );
  }
}
