export const metadata = {
  title: "DownloadAllinOne",
  description: "Download videos from YouTube, TikTok, Instagram, Facebook"
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
