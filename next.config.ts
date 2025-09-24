import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'games.gamesport.store',
                port: '',
                pathname: '/**',
            }
        ],
    },
    eslint: {
        // 忽略构建阶段的 ESLint 报错，不阻塞构建
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
