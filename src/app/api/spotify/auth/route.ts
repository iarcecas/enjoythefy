import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

const SCOPES = [
  "user-read-recently-played",
  "user-top-read",
  "user-read-private",
  "user-read-email",
  "user-library-read",
];

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  // Use userId as state for CSRF protection
  const authUrl = spotifyApi.createAuthorizeURL(SCOPES, userId);
  return NextResponse.json({ url: authUrl });
}
