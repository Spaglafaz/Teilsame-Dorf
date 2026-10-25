import type { NextConfig } from "next";

// Statischer Export: der Ordner «out/» kann direkt auf ein Webhosting (z. B. hosttech/Plesk) geladen werden.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
