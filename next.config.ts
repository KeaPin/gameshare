import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img20.360buyimg.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'shared.cdn.queniuqe.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'media.st.dl.eccdnx.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'shared.st.dl.eccdnx.com',
                port: '',
                pathname: '/**',
            },
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
