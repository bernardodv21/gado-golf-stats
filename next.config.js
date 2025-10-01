/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['googleapis'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        child_process: false,
        http2: false,
        os: false,
        path: false,
        url: false,
        util: false,
        assert: false,
        zlib: false,
        qs: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
