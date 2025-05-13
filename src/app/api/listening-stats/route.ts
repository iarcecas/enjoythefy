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

function getPreviousYearMonth() {
  const now = new Date();
  now.setMonth(now.getMonth() - 1);
  return {
    year: now.getFullYear().toString(),
    month: (now.getMonth() + 1).toString().padStart(2, "0"),
  };
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { year, month } = getCurrentYearMonth();
    const { year: prevYear, month: prevMonth } = getPreviousYearMonth();

    const [current] = await db
      .select()
      .from(userMonthlyStats)
      .where(
        and(
          eq(userMonthlyStats.user_id, userId),
          eq(userMonthlyStats.year, year),
          eq(userMonthlyStats.month, month),
        ),
      );
    const [previous] = await db
      .select()
      .from(userMonthlyStats)
      .where(
        and(
          eq(userMonthlyStats.user_id, userId),
          eq(userMonthlyStats.year, prevYear),
          eq(userMonthlyStats.month, prevMonth),
        ),
      );

    return NextResponse.json({
      current,
      previous,
    });
  } catch (error) {
    console.error("Error fetching listening stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch listening stats" },
      { status: 500 },
    );
  }
}
