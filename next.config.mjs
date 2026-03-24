/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/research-pages',
  assetPrefix: '/research-pages',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        child_process: false,
        net: false,
        tls: false,
        http: false,
        https: false,
        stream: false,
        crypto: false,
        util: false,
        url: false,
        zlib: false,
        buffer: false,
      };
      config.externals = config.externals || [];
      config.externals.push({
        'googleapis': 'commonjs googleapis',
        'google-auth-library': 'commonjs google-auth-library',
      });
    }
    return config;
  },
};

export default nextConfig;
