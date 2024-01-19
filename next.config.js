const path = require('path');
const fs = require('fs');

/** @type {import('next').NextConfig} */


const api_cache_path = path.resolve(__dirname, 'cache')
const database = process.env.NODE_ENV === 'production' ? 'prod.sqlite' : "dev.sqlite"

const nextConfig = {
  env: {
    API_CACHE: api_cache_path,
    LOGS_DIR_PATH: path.join(api_cache_path, 'logs'),
    PRINTS_DIR_PATH: path.join(api_cache_path, 'pdf'),
    DATABASE_PATH: path.join(api_cache_path, "database", database),
  },
  // reactStrictMode: true,
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};



module.exports = nextConfig;
