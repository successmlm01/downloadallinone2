"use client"

import { useState } from "react"

type Result = {
  title?: string
  thumbnail?: string
  download?: string
  ext?: string
  error?: string
}

export default function Home() {
  const [url, setUrl] = useState("")
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    if (!url.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      setResult(data)
    } catch {
      setResult({ error: "Erreur réseau — réessaie." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ padding: "40px", textAlign: "center" }}>
      <h1>DownloadAllInOne</h1>
      <p>YouTube · TikTok · Instagram · Facebook</p>
      <br />
      <input
        style={{ width: "400px", padding: "10px" }}
        placeholder="Colle le lien ici…"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleDownload()}
      />
      <br /><br />
      <button onClick={handleDownload} disabled={loading}>
        {loading ? "Chargement…" : "Télécharger"}
      </button>

      {result?.error && <p style={{ color: "red" }}>{result.error}</p>}

      {result && !result.error && (
        <div style={{ marginTop: "20px" }}>
          {result.thumbnail && (
            <img src={result.thumbnail} alt="thumbnail" style={{ width: "300px" }} />
          )}
          <br />
          <strong>{result.title}</strong>
          <br /><br />
          <a href={result.download} target="_blank" rel="noopener noreferrer">
            ↓ Télécharger la vidéo
          </a>
        </div>
      )}
    </main>
  )
}
