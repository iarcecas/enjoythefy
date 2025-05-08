"use client";

import SpotifyTest from "@/components/SpotifyTest";

export default function SpotifyPage() {
  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <h1 className="mb-8 text-3xl font-bold">Spotify Integration</h1>
      <div className="mx-auto max-w-2xl">
        <SpotifyTest />
      </div>
    </div>
  );
}
