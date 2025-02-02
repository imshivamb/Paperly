import fs from "fs";
import path from "path";
import type { NextConfig } from "next";

const publicDir = path.join(__dirname, "public");
const sourceFile = path.join(__dirname, "node_modules/pdfjs-dist/build/pdf.worker.min.mjs");
const destinationFile = path.join(publicDir, "pdf.worker.min.mjs");

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

if (fs.existsSync(sourceFile)) {
  fs.copyFileSync(sourceFile, destinationFile);
  console.log("✅ pdf.worker.min.mjs copied to public folder");
} else {
  console.warn("⚠️ pdf.worker.min.mjs not found, skipping copy");
}

const nextConfig: NextConfig = {
  images: {
    domains: ["cdnjs.cloudflare.com"],
  },
};

export default nextConfig;
