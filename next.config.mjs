import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: "canvas" }];
    return config;
  },
  // Add HTTPS configuration for development
  server: {
    https: {
      key: fs.readFileSync(
        join(__dirname, "certificates", "localhost-key.pem"),
      ),
      cert: fs.readFileSync(join(__dirname, "certificates", "localhost.pem")),
    },
  },
};

export default nextConfig;
