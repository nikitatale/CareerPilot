const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,  
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;