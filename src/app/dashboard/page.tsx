/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
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
  PlusCircle,
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
import { type JSX } from "react/jsx-runtime";

export default function Dashboard(): JSX.Element {
  const [collapsed, setCollapsed] = useState(false);

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
          {/* Assuming /logout is handled correctly, maybe via middleware or a specific page */}
          <NavItem
            icon={<LogOut />}
            label="Logout"
            href="/api/auth/signout" // Or wherever your Clerk signout handler is
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
                    Welcome back, Ignacio! {/* Consider fetching user name */}
                  </h2>
                  <p className="text-gray-300">
                    Here&apos;s your music overview for today. You&apos;ve
                    listened to 42 songs this week! {/* Fetch dynamic data */}
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
              {/* Replace with dynamic data */}
              <StatCard
                icon={<Clock className="h-8 w-8 text-purple-400" />}
                title="Listening Time"
                value="32h 45m"
                subtitle="This month"
                change="+12% from last month"
                positive={true}
              />
              <StatCard
                icon={<Music className="h-8 w-8 text-purple-400" />}
                title="Tracks Played"
                value="487"
                subtitle="This month"
                change="+24 from last week"
                positive={true}
              />
              <StatCard
                icon={<Disc3 className="h-8 w-8 text-purple-400" />}
                title="Top Genre"
                value="Indie Rock"
                subtitle="Based on recent plays"
                change="Changed from Pop"
                positive={false}
              />
              <StatCard
                icon={<Heart className="h-8 w-8 text-purple-400" />}
                title="Liked Songs"
                value="126"
                subtitle="Total in library"
                change="+8 new this month"
                positive={true}
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
                    {/* Replace with dynamic data */}
                    {[1, 2, 3, 4, 5].map((i) => (
                      <tr
                        key={i}
                        className="border-b border-purple-500/10 hover:bg-purple-500/5"
                      >
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-300">
                          {i}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="flex items-center">
                            <div className="mr-3 h-10 w-10 flex-shrink-0">
                              <Image
                                src={`/placeholders/40.svg`} // Corrected path
                                width={40}
                                height={40}
                                alt="Album cover"
                                className="rounded"
                              />
                            </div>
                            <div className="text-sm font-medium text-white">
                              Track Name {i}
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-300">
                          Artist {i}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-300">
                          Album Title {i}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-300">
                          {42 - i * 5}
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

          {/* Features Quick Access */}
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Quick Access</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<BarChart3 className="h-6 w-6" />}
                title="Song Visualizer"
                description="Experience your music with stunning visual effects"
                href="/visualizer"
                bgClass="from-purple-600/20 to-pink-600/20"
              />
              <FeatureCard
                icon={<Sparkles className="h-6 w-6" />}
                title="AI Recommendations"
                description="Discover new music tailored to your taste"
                href="/recommendations"
                bgClass="from-blue-600/20 to-purple-600/20"
              />
              <FeatureCard
                icon={<ListMusic className="h-6 w-6" />}
                title="AI Playlist Creation"
                description="Generate the perfect playlist for any occasion"
                href="/playlists"
                bgClass="from-pink-600/20 to-orange-600/20"
              />
            </div>
          </section>

          {/* Recent Activity & Recommendations */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
                    {/* Replace with dynamic data */}
                    <ActivityItem
                      icon={<Play className="h-4 w-4" />}
                      title="Played 'Dreams'"
                      subtitle="Fleetwood Mac"
                      time="2 hours ago"
                    />
                    <ActivityItem
                      icon={<Heart className="h-4 w-4" />}
                      title="Liked 'Bohemian Rhapsody'"
                      subtitle="Queen"
                      time="Yesterday"
                    />
                    <ActivityItem
                      icon={<PlusCircle className="h-4 w-4" />}
                      title="Created playlist 'Summer Vibes'"
                      subtitle="15 tracks"
                      time="2 days ago"
                    />
                    <ActivityItem
                      icon={<Sparkles className="h-4 w-4" />}
                      title="Got new recommendations"
                      subtitle="Based on your recent listens"
                      time="3 days ago"
                    />
                    <ActivityItem
                      icon={<BarChart3 className="h-4 w-4" />}
                      title="Used visualizer for 'Blinding Lights'"
                      subtitle="The Weeknd"
                      time="4 days ago"
                    />
                  </ul>
                </CardContent>
              </Card>
            </section>

            {/* Recommendations */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recommended For You</h2>
                <Link
                  href="/recommendations"
                  className="flex items-center text-sm text-purple-400 hover:text-purple-300"
                >
                  View All <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <Card className="border-purple-500/20 bg-zinc-900/50">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {/* Replace with dynamic data */}
                    <RecommendationItem
                      title="Based on your love for Indie Rock"
                      tracks={[
                        "Arctic Monkeys - 505",
                        "The Strokes - Reptilia",
                        "Tame Impala - Let It Happen",
                      ]}
                    />
                    <RecommendationItem
                      title="New releases from artists you follow"
                      tracks={[
                        "Dua Lipa - New Track",
                        "The Weeknd - Latest Single",
                        "Billie Eilish - New Release",
                      ]}
                    />
                    <Button
                      className="mt-2 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      size="sm"
                    >
                      <Sparkles className="mr-2 h-4 w-4" /> Get More
                      Recommendations
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
// --- Sub Components ---

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  collapsed: boolean;
  active?: boolean; // Optional prop
}

function NavItem({
  icon,
  label,
  href,
  collapsed,
  active = false, // Default value
}: NavItemProps): JSX.Element {
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

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  change: string;
  positive: boolean;
}

function StatCard({
  icon,
  title,
  value,
  subtitle,
  change,
  positive,
}: StatCardProps): JSX.Element {
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

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  bgClass: string;
}

function FeatureCard({
  icon,
  title,
  description,
  href,
  bgClass,
}: FeatureCardProps): JSX.Element {
  return (
    <Link href={href}>
      {/* Ensure the Card component accepts a generic child or ref correctly if Link causes issues */}
      <Card className="h-full border-purple-500/20 bg-zinc-900/50 transition-all hover:border-purple-500/40">
        <CardContent className="p-6">
          <div
            className={`rounded-full bg-gradient-to-r ${bgClass} mb-4 flex h-12 w-12 items-center justify-center p-3`}
          >
            {icon}
          </div>
          <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  time: string;
}

function ActivityItem({
  icon,
  title,
  subtitle,
  time,
}: ActivityItemProps): JSX.Element {
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

interface RecommendationItemProps {
  title: string;
  tracks: string[]; // Array of strings is safe
}

function RecommendationItem({
  title,
  tracks,
}: RecommendationItemProps): JSX.Element {
  return (
    <div>
      <h3 className="mb-2 text-sm font-medium text-white">{title}</h3>
      <ul className="space-y-2">
        {tracks.map((track, index) => (
          <li key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-2 h-8 w-8">
                <Image
                  src={`/placeholders/32.svg`} // Corrected path
                  width={32}
                  height={32}
                  alt="Track"
                  className="rounded"
                />
              </div>
              <span className="text-xs text-gray-300">{track}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-purple-400"
            >
              <Play className="h-3 w-3" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
