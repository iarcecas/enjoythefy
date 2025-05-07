import Link from "next/link";
import ClientComponent from "./(home)/ClientComponent";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Music,
  History,
  BarChart3,
  Sparkles,
  ListMusic,
  Layout,
} from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="container mx-auto flex items-center justify-between px-4 py-6">
        <div className="flex items-center gap-2">
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-2xl font-extrabold text-transparent">
            EnjoyTheFy
          </span>
        </div>
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-purple-700"
              >
                Login
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
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
          </SignedIn>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-black leading-tight md:text-7xl">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Elevate
            </span>{" "}
            Your Spotify Experience
          </h1>
          <p className="mx-auto mb-4 max-w-2xl text-xl text-gray-300 md:text-2xl">
            Connect your Spotify account and unlock AI-powered recommendations,
            stunning visualizations, and personalized playlists.
          </p>
          <p className="mb-10 text-lg italic text-purple-300">
            Created by a music lover, for music lovers.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <SignedOut>
              <SignUpButton mode="modal">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 text-lg hover:from-purple-600 hover:to-pink-600"
                >
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 text-lg hover:from-purple-600 hover:to-pink-600"
                >
                  Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </SignedIn>
            <Button
              size="lg"
              variant="outline"
              className="border-purple-500/50 bg-black/20 px-8 text-lg text-purple-300 hover:bg-purple-500/10"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-zinc-900/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-16 text-center text-4xl font-bold md:text-5xl">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Features
            </span>
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Music className="h-10 w-10 text-purple-500" />}
              title="Spotify Integration"
              description="Seamlessly connect your Spotify account and access all your music in one place."
            />
            <FeatureCard
              icon={<History className="h-10 w-10 text-purple-500" />}
              title="Listening History"
              description="Dive into your listening patterns and rediscover forgotten favorites."
            />
            <FeatureCard
              icon={<BarChart3 className="h-10 w-10 text-purple-500" />}
              title="Song Visualizer"
              description="Experience your music with stunning visual effects synchronized to the beat."
            />
            <FeatureCard
              icon={<Sparkles className="h-10 w-10 text-purple-500" />}
              title="AI Recommendations"
              description="Get personalized song suggestions powered by advanced AI algorithms."
            />
            <FeatureCard
              icon={<ListMusic className="h-10 w-10 text-purple-500" />}
              title="AI Playlist Creation"
              description="Let AI create the perfect playlists based on your unique taste."
            />
            <FeatureCard
              icon={<Layout className="h-10 w-10 text-purple-500" />}
              title="Custom Interface"
              description="Enjoy a beautiful, intuitive interface designed for music lovers."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="mb-16 text-center text-4xl font-bold md:text-5xl">
          How{" "}
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            It Works
          </span>
        </h2>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
          <StepCard
            number={1}
            title="Connect"
            description="Link your Spotify account with just a few clicks."
          />
          <StepCard
            number={2}
            title="Discover"
            description="Explore new music with AI-powered recommendations."
          />
          <StepCard
            number={3}
            title="Enjoy"
            description="Get personalized playlists and recommendations based on your taste."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-4xl font-bold md:text-5xl">
            Ready to{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Transform
            </span>{" "}
            Your Music Experience?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-300">
            Join thousands of music lovers who have elevated their Spotify
            experience with EnjoyTheFy.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 text-lg hover:from-purple-600 hover:to-pink-600"
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-6 md:mb-0">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-xl font-bold text-transparent">
                EnjoyTheFy
              </span>
              <p className="mt-2 text-gray-400">
                © 2024 EnjoyTheFy. All rights reserved.
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Created by a music lover, for music lovers.
              </p>
            </div>
            <div className="flex gap-6">
              <Link href="#" className="text-gray-400 hover:text-purple-400">
                Terms
              </Link>
              <Link href="#" className="text-gray-400 hover:text-purple-400">
                Privacy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-purple-400">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
      <ClientComponent />
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group relative rounded-xl border border-purple-500/20 bg-black/20 p-6 shadow-sm transition-all hover:border-purple-500/40 hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="rounded-lg bg-purple-500/10 p-2 text-purple-500">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
      </div>
      <p className="mt-4 text-gray-400">{description}</p>
    </div>
  );
}

interface StepCardProps {
  number: number;
  title: string;
  description: string;
}

function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          {number}
        </div>
        <h3 className="text-xl font-semibold text-gray-200">{title}</h3>
      </div>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
