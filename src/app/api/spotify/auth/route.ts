import { NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

const scopes = [
  "user-read-private",
  "user-read-email",
  "user-read-recently-played",
  "user-top-read",
  "user-read-currently-playing",
  "user-read-playback-state",
];

export async function GET() {
  try {
    const authUrl = spotifyApi.createAuthorizeURL(scopes, "state");
    return NextResponse.json({ url: authUrl });
  } catch (error) {
    console.error("Error creating auth URL:", error);
    return NextResponse.json(
      { error: "Failed to create authorization URL" },
      { status: 500 },
    );
  }
}
