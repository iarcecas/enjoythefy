/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useEffect, useState } from "react";

export default function SpotifyTest() {
  const [recentTracks, setRecentTracks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if we have a code in the URL (after Spotify redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      // Exchange code for access token
      fetch("/api/spotify/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            throw new Error(data.error);
          }
          setAccessToken(data.access_token);
          // Store refresh token in localStorage for future use
          localStorage.setItem("spotify_refresh_token", data.refresh_token);
          // Remove the code from URL
          window.history.replaceState({}, document.title, "/spotify");
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      // Fetch recently played tracks
      fetch(`/api/spotify/recently-played?access_token=${accessToken}&limit=5`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            throw new Error(data.error);
          }
          setRecentTracks(data.items);
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  }, [accessToken]);

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/spotify/auth");
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get auth URL");
    }
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      {recentTracks.length === 0 ? (
        <button
          onClick={handleLogin}
          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
          Connect to Spotify
        </button>
      ) : (
        <div>
          <h2 className="mb-4 text-xl font-bold">Recently Played Tracks</h2>
          <div className="space-y-4">
            {recentTracks.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                {item.track.album.images[0] && (
                  <img
                    src={item.track.album.images[0].url}
                    alt={item.track.name}
                    className="h-16 w-16 object-cover"
                  />
                )}
                <div>
                  <div className="font-semibold">{item.track.name}</div>
                  <div className="text-gray-600">
                    {item.track.artists
                      .map((artist: any) => artist.name)
                      .join(", ")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
