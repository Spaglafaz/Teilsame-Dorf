import type { NextConfig } from "next";

// Grundpfad: leer für die eigene Domain, «/Teilsame-Dorf» für GitHub Pages (siehe .github/workflows/pages.yml)
const basis = (process.env.NEXT_PUBLIC_BASIS || "").replace(/\/+$/, "");

// Statischer Export: der Ordner «out/» kann direkt auf ein Webhosting (z. B. hosttech/Plesk) geladen werden.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  ...(basis ? { basePath: basis } : {}),
};

export default nextConfig;
