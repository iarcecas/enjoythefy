import { NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get("access_token");
    const limit = searchParams.get("limit") ?? "20";

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 400 },
      );
    }

    spotifyApi.setAccessToken(accessToken);
    const response = await spotifyApi.getMyRecentlyPlayedTracks({
      limit: parseInt(limit),
    });

    return NextResponse.json(response.body);
  } catch (error) {
    console.error("Error fetching recently played tracks:", error);
    return NextResponse.json(
      { error: "Failed to fetch recently played tracks" },
      { status: 500 },
    );
  }
}
