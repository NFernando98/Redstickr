/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)", // Apply headers to all routes
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin", // Set this to 'same-origin'
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp", // Set this to 'require-corp'
          },
        ],
      },
    ];
  },
};

export default nextConfig;
