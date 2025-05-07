"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

export default function ClientComponent() {
  return (
    <>
      {/* Header Auth Buttons */}
      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton mode="modal">
            <Button
              variant="ghost"
              className="text-gray-300 hover:text-purple-300"
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

      {/* Hero Section Buttons */}
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
      </div>

      {/* CTA Section Buttons */}
      <SignedOut>
        <SignUpButton mode="modal">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 text-lg hover:from-purple-600 hover:to-pink-600"
          >
            Get Started Now
          </Button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <Link href="/dashboard">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 text-lg hover:from-purple-600 hover:to-pink-600"
          >
            Go to Dashboard
          </Button>
        </Link>
      </SignedIn>
    </>
  );
}
