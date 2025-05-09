import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  // privateMetadata is only available here
  return NextResponse.json({
    spotify: user.privateMetadata?.spotify ?? null,
  });
}
