/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import "~/styles/globals.css";
import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "EnjoyTheFy - Elevate Your Spotify Experience",
  description:
    "Connect your Spotify account and unlock AI-powered recommendations, stunning visualizations, and personalized playlists.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: PropsWithChildren): React.JSX.Element {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          userButtonPopoverCard: "bg-black/20 border border-purple-500/20",
          userButtonPopoverActionButton: "text-gray-200 hover:bg-purple-500/10",
        },
      }}
    >
      <html lang="en">
        <body className={`font-sans ${inter.variable}`}>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
