import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://downloadallinone2.vercel.app"
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/youtube-downloader`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/tiktok-downloader`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/instagram-downloader`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/facebook-downloader`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
  ]
}
