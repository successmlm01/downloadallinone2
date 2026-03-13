import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "DownloadAllInOne — Download YouTube, TikTok, Instagram, Facebook videos free",
  description: "Free video downloader for YouTube, TikTok, Instagram and Facebook. Download in HD, 1080p or 4K with audio. No sign-up, no software, 100% free.",
  keywords: "video downloader, youtube downloader, tiktok downloader, instagram downloader, facebook downloader, download video free, 4K download, HD video",
  openGraph: {
    title: "DownloadAllInOne — Free Video Downloader",
    description: "Download YouTube, TikTok, Instagram and Facebook videos in HD or 4K with audio. Free, fast, no sign-up.",
    url: "https://downloadallinone2.vercel.app",
    siteName: "DownloadAllInOne",
    type: "website",
  },
  alternates: { canonical: "https://downloadallinone2.vercel.app" },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  )
}
