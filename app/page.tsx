"use client"

import { useState } from "react"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://downloader-server-production-3252.up.railway.app"

type Quality = {
  label: string
  height: number
  formatId: string
  filesize: number | null
}

type VideoInfo = {
  title?: string
  thumbnail?: string
  duration?: number
  uploader?: string
  originalUrl?: string
  qualities?: Quality[]
  error?: string
}

function formatDuration(s: number) {
  const m = Math.floor(s / 60)
  return `${m}:${(s % 60).toString().padStart(2, "0")}`
}

function formatSize(bytes: number | null) {
  if (!bytes) return ""
  if (bytes > 1e9) return ` · ${(bytes / 1e9).toFixed(1)} GB`
  if (bytes > 1e6) return ` · ${(bytes / 1e6).toFixed(0)} MB`
  return ""
}

const PLATFORMS = [
  { name: "YouTube", color: "#FF0000" },
  { name: "TikTok", color: "#69C9D0" },
  { name: "Instagram", color: "#E1306C" },
  { name: "Facebook", color: "#1877F2" },
]

export default function Home() {
  const [url, setUrl] = useState("")
  const [info, setInfo] = useState<VideoInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Quality | null>(null)

  async function handleFetch() {
    if (!url.trim()) return
    setLoading(true)
    setInfo(null)
    setSelected(null)
    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      setInfo(data)
      if (data.qualities?.length > 0) setSelected(data.qualities[0])
    } catch {
      setInfo({ error: "Erreur réseau — réessaie." })
    } finally {
      setLoading(false)
    }
  }

  // Construit l'URL de téléchargement qui streame via notre backend
  function getDownloadUrl() {
    if (!selected || !info?.originalUrl) return "#"
    const params = new URLSearchParams({
      url: info.originalUrl,
      formatId: selected.formatId,
      title: info.title || "video",
    })
    return `${BACKEND_URL}/stream?${params.toString()}`
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #07080d; --surface: #0f1018; --border: rgba(255,255,255,0.07);
          --text: #eeeae0; --muted: rgba(238,234,224,0.4); --accent: #6c3fff;
        }
        body { background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; min-height: 100vh; }
        .bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 70% 50% at 15% 60%, rgba(108,63,255,0.07) 0%, transparent 65%),
            radial-gradient(ellipse 50% 40% at 85% 20%, rgba(0,194,255,0.05) 0%, transparent 60%);
        }
        .grid-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.025;
          background-image: linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        main {
          position: relative; z-index: 1; min-height: 100vh;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 60px 20px; gap: 48px;
        }
        .header { text-align: center; animation: fadeUp 0.5s ease both; }
        .badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(108,63,255,0.12); border: 1px solid rgba(108,63,255,0.3);
          border-radius: 100px; padding: 5px 14px;
          font-size: 12px; font-weight: 500; color: #a88fff; letter-spacing: 0.05em; margin-bottom: 20px;
        }
        .badge-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #6c3fff;
          box-shadow: 0 0 6px #6c3fff; animation: pulse 2s ease infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        h1 {
          font-family: 'Syne', sans-serif; font-size: clamp(40px, 7vw, 76px);
          font-weight: 800; letter-spacing: -2.5px; line-height: 0.95;
          background: linear-gradient(135deg, #fff 20%, #a88fff 55%, #00c2ff 90%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .subtitle { font-size: 16px; color: var(--muted); margin-top: 16px; }
        .platforms { display: flex; gap: 10px; justify-content: center; margin-top: 20px; flex-wrap: wrap; }
        .chip {
          display: flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 100px;
          border: 1px solid var(--border); background: rgba(255,255,255,0.03);
          font-size: 11px; font-weight: 500; color: var(--muted);
        }
        .chip-dot { width: 5px; height: 5px; border-radius: 50%; }
        .card {
          width: 100%; max-width: 640px; background: var(--surface);
          border: 1px solid var(--border); border-radius: 24px; padding: 28px;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.03), 0 32px 64px rgba(0,0,0,0.6);
          animation: fadeUp 0.5s 0.1s ease both;
        }
        .input-label {
          font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--muted); margin-bottom: 10px; display: block;
        }
        .input-wrap { display: flex; gap: 10px; }
        .url-input {
          flex: 1; background: rgba(0,0,0,0.5); border: 1px solid var(--border);
          border-radius: 14px; padding: 14px 18px; color: var(--text);
          font-family: 'Inter', sans-serif; font-size: 14px; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .url-input::placeholder { color: rgba(238,234,224,0.2); }
        .url-input:focus { border-color: rgba(108,63,255,0.5); box-shadow: 0 0 0 3px rgba(108,63,255,0.1); }
        .btn-main {
          background: linear-gradient(135deg, #6c3fff, #9f6fff); color: white; border: none; cursor: pointer;
          padding: 14px 22px; border-radius: 14px; font-family: 'Syne', sans-serif;
          font-size: 14px; font-weight: 700; white-space: nowrap;
          transition: opacity 0.2s, transform 0.15s; box-shadow: 0 4px 20px rgba(108,63,255,0.4);
        }
        .btn-main:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .btn-main:disabled { opacity: 0.4; cursor: not-allowed; }
        .loader {
          display: flex; align-items: center; justify-content: center; gap: 12px;
          padding: 32px 0; color: var(--muted); font-size: 14px; animation: fadeUp 0.3s ease both;
        }
        .spinner {
          width: 18px; height: 18px; border: 2px solid rgba(108,63,255,0.2);
          border-top-color: #6c3fff; border-radius: 50%; animation: spin 0.7s linear infinite;
        }
        .result { margin-top: 20px; border: 1px solid var(--border); border-radius: 16px; overflow: hidden; animation: fadeUp 0.4s ease both; }
        .thumb-wrap { position: relative; }
        .thumb { width: 100%; max-height: 200px; object-fit: cover; display: block; }
        .dur { position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.8); color: white; font-size: 12px; font-weight: 600; padding: 3px 8px; border-radius: 6px; }
        .result-body { padding: 20px 22px; }
        .uploader { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 500; }
        .video-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 20px; line-height: 1.4; margin-top: 4px; }
        .quality-label { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; display: block; }
        .quality-grid { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px; }
        .qbtn {
          padding: 8px 16px; border-radius: 10px; border: 1px solid var(--border);
          background: transparent; color: var(--muted); font-family: 'Syne', sans-serif;
          font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; position: relative;
        }
        .qbtn:hover { border-color: rgba(255,255,255,0.15); color: var(--text); }
        .qbtn.active { background: rgba(108,63,255,0.15); border-color: rgba(108,63,255,0.5); color: #a88fff; }
        .qbtn.is4k::after {
          content: "4K"; position: absolute; top: -6px; right: -6px;
          background: linear-gradient(135deg, #f0a500, #ff6b00); color: white;
          font-size: 8px; font-weight: 800; padding: 1px 5px; border-radius: 4px;
        }
        .dl-btn {
          display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%;
          padding: 14px; background: linear-gradient(135deg, rgba(108,63,255,0.15), rgba(0,194,255,0.1));
          border: 1px solid rgba(108,63,255,0.35); border-radius: 12px; color: #a88fff;
          text-decoration: none; font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
          transition: background 0.2s, border-color 0.2s, transform 0.1s;
        }
        .dl-btn:hover { background: linear-gradient(135deg, rgba(108,63,255,0.25), rgba(0,194,255,0.15)); border-color: rgba(108,63,255,0.6); transform: translateY(-1px); }
        .error { margin-top: 16px; padding: 14px 18px; background: rgba(255,60,80,0.07); border: 1px solid rgba(255,60,80,0.2); border-radius: 12px; color: #ff8090; font-size: 13px; animation: fadeUp 0.3s ease both; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>

      <div className="bg" /><div className="grid-bg" />

      <main>
        <div className="header">
          <div className="badge"><span className="badge-dot" />Téléchargeur vidéo gratuit</div>
          <h1>DownloadAllInOne</h1>
          <p className="subtitle">Télécharge en HD, Full HD ou 4K avec audio</p>
          <div className="platforms">
            {PLATFORMS.map((p) => (
              <div key={p.name} className="chip">
                <span className="chip-dot" style={{ background: p.color }} />{p.name}
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <span className="input-label">Lien de la vidéo</span>
          <div className="input-wrap">
            <input className="url-input" placeholder="https://youtube.com/watch?v=..." value={url}
              onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleFetch()} />
            <button className="btn-main" onClick={handleFetch} disabled={loading || !url.trim()}>
              {loading ? "…" : "Analyser"}
            </button>
          </div>

          {loading && <div className="loader"><div className="spinner" />Récupération des formats…</div>}
          {info?.error && <div className="error">⚠ {info.error}</div>}

          {info && !info.error && (
            <div className="result">
              {info.thumbnail && (
                <div className="thumb-wrap">
                  <img className="thumb" src={info.thumbnail} alt="" />
                  {info.duration && <span className="dur">{formatDuration(info.duration)}</span>}
                </div>
              )}
              <div className="result-body">
                {info.uploader && <div className="uploader">{info.uploader}</div>}
                <div className="video-title">{info.title}</div>
                {info.qualities && info.qualities.length > 0 && (
                  <>
                    <span className="quality-label">Choisir la qualité</span>
                    <div className="quality-grid">
                      {info.qualities.map((q) => (
                        <button key={q.label}
                          className={`qbtn${q.height >= 2160 ? " is4k" : ""}${selected?.label === q.label ? " active" : ""}`}
                          onClick={() => setSelected(q)}>
                          {q.label}{formatSize(q.filesize)}
                        </button>
                      ))}
                    </div>
                  </>
                )}
                {selected && (
                  <a className="dl-btn" href={getDownloadUrl()} target="_blank" rel="noopener noreferrer">
                    ↓ Télécharger en {selected.label} (vidéo + audio)
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
