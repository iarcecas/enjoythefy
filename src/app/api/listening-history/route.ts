import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import { spotifyListeningHistory } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const history = await db
      .select()
      .from(spotifyListeningHistory)
      .where(eq(spotifyListeningHistory.user_id, userId))
      .orderBy(desc(spotifyListeningHistory.played_at))
      .limit(5);

    return NextResponse.json(history);
  } catch (error) {
    console.error("Error fetching listening history:", error);
    return NextResponse.json(
      { error: "Failed to fetch listening history" },
      { status: 500 },
    );
  }
}
