const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

/** @type {import('next').NextConfig} */
const SUBDIR = process.env.TARGET;
const Type = process.env.BUILDTYPE;
const isProd = process.env.NODE_ENV == "productionSep";
const nextConfig = {
  trailingSlash: true,
  output: "export",
  assetPrefix: isProd ? Type + SUBDIR : Type,
  basePath: isProd ? Type + SUBDIR : Type,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.microcms-assets.io",
        port: "",
      },
    ],
    ///外部サーバの画像を表示したい場合は必要
    domains: ["images.microcms-assets.io"],
  },
  publicRuntimeConfig: {
    BASEPath: isProd ? Type + SUBDIR : Type,
  },
};
//console.log((("BasePath:"+nextConfig.assetPrefix + ":" + nextConfig.publicRuntimeConfig.BASEPath);
module.exports = nextConfig;
