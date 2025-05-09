import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI,
});

export const getRecentlyPlayed = async (accessToken: string) => {
  spotifyApi.setAccessToken(accessToken);
  try {
    const response = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 5 });
    return response.body.items.map((item) => ({
      id: item.track.id,
      name: item.track.name,
      artist: item.track.artists[0].name,
      album: item.track.album.name,
      image: item.track.album.images[0]?.url,
      playedAt: new Date(item.played_at).toLocaleString(),
    }));
  } catch (error) {
    console.error("Error fetching recently played tracks:", error);
    return [];
  }
};

export const getTopTracks = async (accessToken: string) => {
  spotifyApi.setAccessToken(accessToken);
  try {
    const response = await spotifyApi.getMyTopTracks({ limit: 5 });
    return response.body.items.map((track) => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      image: track.album.images[0]?.url,
    }));
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    return [];
  }
};

export const getListeningStats = async (accessToken: string) => {
  spotifyApi.setAccessToken(accessToken);
  try {
    // Get recently played and top tracks
    const [recentlyPlayed, topTracks, savedTracks] = await Promise.all([
      spotifyApi.getMyRecentlyPlayedTracks({ limit: 50 }),
      spotifyApi.getMyTopTracks({ limit: 10 }),
      spotifyApi.getMySavedTracks({ limit: 1 }),
    ]);

    // Calculate listening time
    const totalTracks = recentlyPlayed.body.items.length;
    const avgTrackLength = 3.5; // minutes
    const totalMinutes = totalTracks * avgTrackLength;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);

    // Get top genre
    const artistIds = topTracks.body.items.map((track) => track.artists[0].id);
    const uniqueArtistIds = Array.from(new Set(artistIds)).slice(0, 5); // limit to 5 for rate limits
    const artistResponses = await Promise.all(
      uniqueArtistIds.map((id) => spotifyApi.getArtist(id)),
    );
    const genreCounts: Record<string, number> = {};
    artistResponses.forEach((res) => {
      res.body.genres.forEach((genre) => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });
    const topGenre =
      Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "Unknown";
    // Get liked songs count
    const likedSongs = savedTracks.body.total;

    return {
      listeningTime: `${hours}h ${minutes}m`,
      tracksPlayed: totalTracks,
      topGenre,
      likedSongs,
    };
  } catch (error) {
    console.error("Error fetching listening stats:", error);
    return {
      listeningTime: "0h 0m",
      tracksPlayed: 0,
      topGenre: "Unknown",
      likedSongs: 0,
    };
  }
};
