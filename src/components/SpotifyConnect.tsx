/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";

export default function SpotifyConnect() {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/spotify/auth");
      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error("Error connecting to Spotify:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-purple-500/20 bg-zinc-900/50 p-8 text-center">
      <div className="mb-6 rounded-full bg-purple-500/10 p-4">
        <Music className="h-8 w-8 text-purple-400" />
      </div>
      <h2 className="mb-2 text-2xl font-bold">Connect Your Spotify Account</h2>
      <p className="mb-6 text-gray-400">
        Connect your Spotify account to see your listening history, top tracks,
        and more.
      </p>
      <Button
        onClick={handleConnect}
        disabled={isLoading}
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
      >
        {isLoading ? "Connecting..." : "Connect Spotify"}
      </Button>
    </div>
  );
}
