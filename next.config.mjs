/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true, // Better for Firebase Hosting / GitHub Pages
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint to reduce memory usage
  },
  typescript: {
    ignoreBuildErrors: true, // Skip type checking to reduce memory usage
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude Node.js modules from client bundle
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
      // Ignore googleapis and google-auth-library in client bundle
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
