"use client";

import { useEffect, useState } from "react";
import { Music } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Track {
  track: {
    name: string;
    artists: Array<{ name: string }>;
    album: {
      images: Array<{ url: string }>;
    };
  };
}

export default function RecentlyPlayed() {
  const [tracks, setTracks] = useState<Track[]>([]);
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
          localStorage.setItem("spotify_refresh_token", data.refresh_token);
          // Remove the code from URL
          window.history.replaceState({}, document.title, "/dashboard");
        })
        .catch((err) => {
          setError(err.message);
        });
    } else {
      // Check if we have a refresh token
      const refreshToken = localStorage.getItem("spotify_refresh_token");
      if (refreshToken) {
        // TODO: Implement refresh token logic
      }
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
          setTracks(data.items);
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  }, [accessToken]);

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Recently Played
          </CardTitle>
          <CardDescription>Error loading tracks</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (tracks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Recently Played
          </CardTitle>
          <CardDescription>
            Connect to Spotify to see your recently played tracks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <button
            onClick={() => {
              fetch("/api/spotify/auth")
                .then((res) => res.json())
                .then((data) => {
                  if (data.error) {
                    throw new Error(data.error);
                  }
                  window.location.href = data.url;
                })
                .catch((err) => {
                  setError(err.message);
                });
            }}
            className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            Connect to Spotify
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Recently Played
        </CardTitle>
        <CardDescription>Your latest tracks from Spotify</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tracks.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              {item.track.album.images[0] && (
                <img
                  src={item.track.album.images[0].url}
                  alt={item.track.name}
                  className="h-12 w-12 rounded object-cover"
                />
              )}
              <div>
                <div className="font-semibold">{item.track.name}</div>
                <div className="text-sm text-gray-400">
                  {item.track.artists.map((artist) => artist.name).join(", ")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
