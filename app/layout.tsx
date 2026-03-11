import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "DownloadAllInOne",
  description: "Télécharge des vidéos YouTube, TikTok, Instagram, Facebook",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
