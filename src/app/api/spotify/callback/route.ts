import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state || state !== userId) {
      return new NextResponse("Invalid request", { status: 400 });
    }

    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token, expires_in } = data.body;

    // Store tokens in Clerk user metadata
    const clerk = await import("@clerk/nextjs/server");
    const client = await clerk.clerkClient();
    await client.users.updateUserMetadata(userId, {
      privateMetadata: {
        spotify: {
          access_token,
          refresh_token,
          expires_at: Date.now() + expires_in * 1000,
        },
      },
    });

    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("Error in Spotify callback:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
