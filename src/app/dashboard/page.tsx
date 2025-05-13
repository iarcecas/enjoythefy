"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  Music,
  History,
  BarChart3,
  Sparkles,
  ListMusic,
  Home,
  Settings,
  LogOut,
  Clock,
  Disc3,
  Heart,
  Play,
  ChevronRight,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SpotifyConnect from "@/components/SpotifyConnect";

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  image: string;
  plays?: number;
  playedAt?: string;
}

interface ListeningStats {
  listeningTime: string;
  tracksPlayed: number;
  topGenre: string;
  likedSongs: number;
  prevListeningTime: string | null;
  prevTracksPlayed: number | null;
  prevTopGenre: string | null;
  prevLikedSongs: number | null;
}

interface APIStats {
  listening_time: string;
  tracks_played: string;
  top_genre: string;
  liked_songs: string;
}

interface APIStatsResponse {
  current?: APIStats;
  previous?: APIStats;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  collapsed: boolean;
  active?: boolean;
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  change: string;
  positive: boolean;
}

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  time: string;
}

interface HistoryItem {
  track_id: string;
  track_name: string;
  artist_name: string;
  album_name: string;
  image_url: string;
  played_at: string;
}

const FUN_MESSAGES = [
  "Tuning your musical taste...",
  "Warming up the vinyl...",
  "Summoning the Spotify elves...",
  "Counting your beats per minute...",
  "Untangling your headphone wires...",
  "Finding your next earworm...",
];

function getRandomMessage() {
  return FUN_MESSAGES[Math.floor(Math.random() * FUN_MESSAGES.length)];
}

function NavItem({
  icon,
  label,
  href,
  collapsed,
  active = false,
}: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center rounded-lg p-2 ${
        active
          ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white"
          : "text-gray-400 hover:bg-purple-500/10 hover:text-purple-300"
      } transition-colors`}
    >
      <div className="flex h-6 w-6 items-center justify-center">{icon}</div>
      {!collapsed && <span className="ml-3">{label}</span>}
    </Link>
  );
}

function StatCard({
  icon,
  title,
  value,
  subtitle,
  change,
  positive,
}: StatCardProps) {
  return (
    <Card className="border-purple-500/20 bg-zinc-900/50">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-medium text-gray-200">
            {title}
          </CardTitle>
          <div className="rounded-full bg-purple-500/10 p-2">{icon}</div>
        </div>
        <CardDescription className="text-gray-400">{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-1 text-2xl font-bold text-white">{value}</div>
        <div
          className={`text-xs ${positive ? "text-green-400" : "text-pink-400"}`}
        >
          {change}
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ icon, title, subtitle, time }: ActivityItemProps) {
  return (
    <li className="flex items-center justify-between p-4 hover:bg-purple-500/5">
      <div className="flex items-center">
        <div className="mr-3 rounded-full bg-purple-500/10 p-2">{icon}</div>
        <div>
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
      </div>
      <span className="text-xs text-gray-500">{time}</span>
    </li>
  );
}

function parseListeningTime(time: string): number {
  // e.g. '4h 43m' => 283
  const match = /(\d+)h\s*(\d+)m/.exec(time);
  if (!match) return 0;
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  return hours * 60 + minutes;
}

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([]);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [stats, setStats] = useState<ListeningStats>({
    listeningTime: "0h 0m",
    tracksPlayed: 0,
    topGenre: "Unknown",
    likedSongs: 0,
    prevListeningTime: null,
    prevTracksPlayed: null,
    prevTopGenre: null,
    prevLikedSongs: null,
  });  
  const [loading, setLoading] = useState(true);
  const [funMessage, setFunMessage] = useState(getRandomMessage());
  const [isSpotifyConnected, setIsSpotifyConnected] = useState<boolean | null>(
    null,
  );
  const { user, isLoaded } = useUser();

  useEffect(() => {
    // Fetch spotify_connected from the secure API route
    const fetchSpotifyConnected = async () => {
      const res = await fetch("/api/me/spotify");
      if (!res.ok) {
        setIsSpotifyConnected(false);
        return;
      }
      const dataRaw: unknown = await res.json();
      const data = dataRaw as {
        spotify_connected?: boolean;
        spotify?: { access_token?: string };
      };
      setIsSpotifyConnected(
        data.spotify_connected === true || !!data.spotify?.access_token,
      );
    };
    if (isLoaded) {
      void fetchSpotifyConnected();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (!isSpotifyConnected) return;
    setLoading(true);
    setFunMessage(getRandomMessage());
    // Simulate loading for at least 1s for animation
    const timer = setTimeout(() => setLoading(false), 1000);
    const fetchData = async () => {
      if (!user) return;

      try {
        const [historyRes, statsRes, topTracksRes] = await Promise.all([
          fetch("/api/listening-history"),
          fetch("/api/listening-stats"),
          fetch("/api/top-tracks"),
        ]);

        if (!historyRes.ok || !statsRes.ok || !topTracksRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const history = (await historyRes.json()) as HistoryItem[];
        const statsData = (await statsRes.json()) as APIStatsResponse;
        const topTracksData = (await topTracksRes.json()) as Track[];
        console.log("topTracksData: ", topTracksData);

        setRecentlyPlayed(
          history.map((item) => ({
            id: item.track_id,
            name: item.track_name,
            artist: item.artist_name,
            album: item.album_name,
            image: item.image_url,
            playedAt: new Date(item.played_at).toLocaleString(),
          })),
        );

        setTopTracks(
          topTracksData.map((item) => ({
            id: item.id,
            name: item.name,
            artist: item.artist,
            album: item.album,
            image: item.image,
            plays: item.plays,
          })),
        );

        // Use current and previous month stats
        const current = statsData.current;
        const previous = statsData.previous;
        setStats({
          listeningTime: current?.listening_time ?? "0h 0m",
          tracksPlayed: current ? parseInt(current.tracks_played, 10) : 0,
          topGenre: current?.top_genre ?? "Unknown",
          likedSongs: current ? parseInt(current.liked_songs, 10) : 0,
          prevListeningTime: previous?.listening_time ?? null,
          prevTracksPlayed: previous
            ? parseInt(previous.tracks_played, 10)
            : null,
          prevTopGenre: previous?.top_genre ?? null,
          prevLikedSongs: previous ? parseInt(previous.liked_songs, 10) : null,
        });

        
      } catch (error) {
        console.error("Error fetching data:", error);        
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
    return () => clearTimeout(timer);
  }, [isSpotifyConnected, user]);

  if (!isLoaded || isSpotifyConnected === null) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        Loading user...
      </div>
    );
  }

  if (!isSpotifyConnected) {
    // Show connect prompt only if not connected
    return (
      <div className="flex min-h-screen bg-black text-white">
        {/* Sidebar */}
        <div
          className={`${
            collapsed ? "w-20" : "w-64"
          } fixed flex h-screen flex-col border-r border-purple-500/20 bg-zinc-950 transition-all duration-300`}
        >
          <div className="flex items-center justify-between border-b border-purple-500/20 p-4">
            {!collapsed && (
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-xl font-extrabold text-transparent">
                EnjoyTheFy
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-purple-400"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5 rotate-180" />
              )}
            </Button>
          </div>
          <div className="flex-1 overflow-auto py-4">
            <nav className="space-y-2 px-2">
              <NavItem
                icon={<Home />}
                label="Dashboard"
                href="/dashboard"
                collapsed={collapsed}
                active
              />
              <NavItem
                icon={<Music />}
                label="Spotify Connect"
                href="/spotify"
                collapsed={collapsed}
              />
              <NavItem
                icon={<History />}
                label="Listening History"
                href="/history"
                collapsed={collapsed}
              />
              <NavItem
                icon={<BarChart3 />}
                label="Visualizer"
                href="/visualizer"
                collapsed={collapsed}
              />
              <NavItem
                icon={<Sparkles />}
                label="AI Recommendations"
                href="/recommendations"
                collapsed={collapsed}
              />
              <NavItem
                icon={<ListMusic />}
                label="AI Playlists"
                href="/playlists"
                collapsed={collapsed}
              />
              <NavItem
                icon={<Settings />}
                label="Settings"
                href="/settings"
                collapsed={collapsed}
              />
            </nav>
          </div>
          <div className="border-t border-purple-500/20 p-4">
            <NavItem
              icon={<LogOut />}
              label="Logout"
              href="/api/auth/signout"
              collapsed={collapsed}
            />
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 ${collapsed ? "ml-20" : "ml-64"} transition-all duration-300`}
        >
          {/* Header */}
          <header className="sticky top-0 z-10 border-b border-purple-500/20 bg-zinc-950/80 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                    userButtonPopoverCard:
                      "bg-black/20 border border-purple-500/20",
                    userButtonPopoverActionButton:
                      "text-gray-200 hover:bg-purple-500/10",
                  },
                }}
              />
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="flex flex-1 items-center justify-center p-6">
            <SpotifyConnect />
          </main>
        </div>
      </div>
    );
  }

  if (loading) {
    // Show loading animation and fun message
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <div className="mb-6 h-24 w-24 animate-spin rounded-full border-8 border-purple-500/20 border-t-purple-500"></div>
        <div className="mb-2 text-2xl font-bold">Loading your dashboard...</div>
        <div className="text-lg text-purple-300">{funMessage}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <div
        className={`${
          collapsed ? "w-20" : "w-64"
        } fixed flex h-screen flex-col border-r border-purple-500/20 bg-zinc-950 transition-all duration-300`}
      >
        <div className="flex items-center justify-between border-b border-purple-500/20 p-4">
          {!collapsed && (
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-xl font-extrabold text-transparent">
              EnjoyTheFy
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-purple-400"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5 rotate-180" />
            )}
          </Button>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="space-y-2 px-2">
            <NavItem
              icon={<Home />}
              label="Dashboard"
              href="/dashboard"
              collapsed={collapsed}
              active
            />
            <NavItem
              icon={<Music />}
              label="Spotify Connect"
              href="/spotify"
              collapsed={collapsed}
            />
            <NavItem
              icon={<History />}
              label="Listening History"
              href="/history"
              collapsed={collapsed}
            />
            <NavItem
              icon={<BarChart3 />}
              label="Visualizer"
              href="/visualizer"
              collapsed={collapsed}
            />
            <NavItem
              icon={<Sparkles />}
              label="AI Recommendations"
              href="/recommendations"
              collapsed={collapsed}
            />
            <NavItem
              icon={<ListMusic />}
              label="AI Playlists"
              href="/playlists"
              collapsed={collapsed}
            />
            <NavItem
              icon={<Settings />}
              label="Settings"
              href="/settings"
              collapsed={collapsed}
            />
          </nav>
        </div>
        <div className="border-t border-purple-500/20 p-4">
          <NavItem
            icon={<LogOut />}
            label="Logout"
            href="/api/auth/signout"
            collapsed={collapsed}
          />
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 ${collapsed ? "ml-20" : "ml-64"} transition-all duration-300`}
      >
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-purple-500/20 bg-zinc-950/80 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-purple-300"
              >
                <Headphones className="mr-2 h-4 w-4" />
                Now Playing
              </Button>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                    userButtonPopoverCard:
                      "bg-black/20 border border-purple-500/20",
                    userButtonPopoverActionButton:
                      "text-gray-200 hover:bg-purple-500/10",
                  },
                }}
              />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Welcome Section */}
          <section className="mb-8">
            <div className="rounded-xl border border-purple-500/20 bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-6">
              <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                <div>
                  <h2 className="mb-2 text-2xl font-bold md:text-3xl">
                    Welcome back, Ignacio!
                  </h2>
                  <p className="text-gray-300">
                    Here&apos;s your music overview for today. You&apos;ve
                    listened to {stats.tracksPlayed} songs this week!
                  </p>
                </div>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Play className="mr-2 h-4 w-4" /> Resume Listening
                </Button>
              </div>
            </div>
          </section>

          {/* Stats Overview */}
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Your Listening Stats</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={<Clock className="h-8 w-8 text-purple-400" />}
                title="Listening Time"
                value={stats.listeningTime}
                subtitle="This month"
                change={(() => {
                  if (stats.prevListeningTime) {
                    const curr = parseListeningTime(stats.listeningTime);
                    const prev = parseListeningTime(stats.prevListeningTime);
                    if (prev > 0) {
                      const percent = ((curr - prev) * 100) / prev;
                      return `${percent > 0 ? "+" : ""}${percent.toFixed(2)}% from last month`;
                    }
                  }
                  return "";
                })()}
                positive={
                  stats.prevListeningTime
                    ? parseListeningTime(stats.listeningTime) >=
                      parseListeningTime(stats.prevListeningTime)
                    : true
                }
              />
              <StatCard
                icon={<Music className="h-8 w-8 text-purple-400" />}
                title="Tracks Played"
                value={stats.tracksPlayed.toString()}
                subtitle="This month"
                change={
                  stats.prevTracksPlayed !== null
                    ? `${stats.tracksPlayed - stats.prevTracksPlayed > 0 ? "+" : ""}${stats.tracksPlayed - stats.prevTracksPlayed} from last month`
                    : ""
                }
                positive={
                  stats.prevTracksPlayed !== null
                    ? stats.tracksPlayed >= (stats.prevTracksPlayed ?? 0)
                    : true
                }
              />
              <StatCard
                icon={<Disc3 className="h-8 w-8 text-purple-400" />}
                title="Top Genre"
                value={stats.topGenre}
                subtitle="Based on recent plays"
                change={
                  stats.prevTopGenre && stats.prevTopGenre !== stats.topGenre
                    ? `Changed from ${stats.prevTopGenre}`
                    : ""
                }
                positive={false}
              />
              <StatCard
                icon={<Heart className="h-8 w-8 text-purple-400" />}
                title="Liked Songs"
                value={stats.likedSongs.toString()}
                subtitle="Total in library"
                change={
                  stats.prevLikedSongs !== null
                    ? `${stats.likedSongs - stats.prevLikedSongs > 0 ? "+" : ""}${stats.likedSongs - stats.prevLikedSongs} new this month`
                    : ""
                }
                positive={
                  stats.prevLikedSongs !== null
                    ? stats.likedSongs >= (stats.prevLikedSongs ?? 0)
                    : true
                }
              />
            </div>
          </section>

          {/* Top Tracks */}
          <section className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Top Tracks</h2>
              <Link
                href="/history"
                className="flex items-center text-sm text-purple-400 hover:text-purple-300"
              >
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="overflow-hidden rounded-xl border border-purple-500/20 bg-zinc-900/50">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-purple-500/20">
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                        Track
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                        Artist
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                        Album
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                        Plays
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topTracks.map((track, index) => (
                      <tr
                        key={track.id}
                        className="border-b border-purple-500/10 hover:bg-purple-500/5"
                      >
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-300">
                          {index + 1}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="flex items-center">
                            <div className="mr-3 h-10 w-10 flex-shrink-0">
                              <Image
                                src={track.image || "/placeholders/40.svg"}
                                width={40}
                                height={40}
                                alt="Album cover"
                                className="rounded"
                              />
                            </div>
                            <div className="text-sm font-medium text-white">
                              {track.name}
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-300">
                          {track.artist}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-300">
                          {track.album}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-300">
                          {track.plays}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-purple-400"
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Recent Activity */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <Link
                href="/history"
                className="flex items-center text-sm text-purple-400 hover:text-purple-300"
              >
                View History <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <Card className="border-purple-500/20 bg-zinc-900/50">
              <CardContent className="p-0">
                <ul className="divide-y divide-purple-500/10">
                  {recentlyPlayed.map((track) => (
                    <ActivityItem
                      key={track.id}
                      icon={<Play className="h-4 w-4" />}
                      title={`Played '${track.name}'`}
                      subtitle={track.artist}
                      time={track.playedAt ?? ""}
                    />
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}
