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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: #080a0f; color: #e8e4dc;
          font-family: 'DM Mono', monospace;
          min-height: 100vh;
        }
        .bg-glow {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background:
            radial-gradient(ellipse 60% 40% at 20% 50%, rgba(99,57,255,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 80% 20%, rgba(0,186,255,0.06) 0%, transparent 60%);
        }
        main {
          position: relative; z-index: 1;
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 40px 24px;
        }
        .header { text-align: center; margin-bottom: 56px; animation: fadeUp 0.6s ease both; }
        .logo {
          font-family: 'Syne', sans-serif;
          font-size: clamp(38px, 7vw, 72px);
          font-weight: 800; letter-spacing: -2px; line-height: 0.95;
          background: linear-gradient(135deg, #ffffff 30%, #8b7cf8 70%, #00baff 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .tagline {
          font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 400;
          color: rgba(232,228,220,0.4); letter-spacing: 0.2em; text-transform: uppercase; margin-top: 14px;
        }
        .platforms {
          display: flex; gap: 16px; justify-content: center; margin-top: 24px; flex-wrap: wrap;
        }
        .chip {
          font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
          padding: 5px 13px; border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(232,228,220,0.45);
          display: flex; align-items: center; gap: 6px;
        }
        .dot { width: 6px; height: 6px; border-radius: 50%; }
        .card {
          width: 100%; max-width: 620px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 32px;
          backdrop-filter: blur(12px);
          animation: fadeUp 0.6s 0.15s ease both;
          box-shadow: 0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .label {
          font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(232,228,220,0.35); margin-bottom: 10px; display: block;
        }
        .input-row { display: flex; gap: 12px; }
        .url-input {
          flex: 1; background: rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
          padding: 14px 18px; color: #e8e4dc;
          font-family: 'DM Mono', monospace; font-size: 14px; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .url-input::placeholder { color: rgba(232,228,220,0.2); }
        .url-input:focus {
          border-color: rgba(139,124,248,0.5);
          box-shadow: 0 0 0 3px rgba(139,124,248,0.12);
        }
        .btn {
          background: linear-gradient(135deg, #6339ff, #a066ff);
          color: white; border: none; cursor: pointer;
          padding: 14px 24px; border-radius: 12px;
          font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
          letter-spacing: 0.05em; white-space: nowrap;
          transition: opacity 0.2s, transform 0.1s, box-shadow 0.2s;
          box-shadow: 0 4px 24px rgba(99,57,255,0.35);
        }
        .btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .btn:active:not(:disabled) { transform: translateY(0); }
        .btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .spinner {
          display: inline-block; width: 13px; height: 13px;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
          border-radius: 50%; animation: spin 0.7s linear infinite;
          vertical-align: middle; margin-right: 8px;
        }
        .result {
          margin-top: 24px;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; overflow: hidden;
          animation: fadeUp 0.4s ease both;
        }
        .result-thumb {
          width: 100%; max-height: 200px; object-fit: cover; display: block;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .result-body { padding: 18px 22px; }
        .result-title {
          font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
          color: #e8e4dc; margin-bottom: 14px; line-height: 1.4;
        }
        .dl-btn {
          display: inline-flex; align-items: center; gap: 10px;
          background: rgba(99,57,255,0.15);
          border: 1px solid rgba(99,57,255,0.4);
          color: #a88fff; border-radius: 10px;
          padding: 12px 20px; text-decoration: none;
          font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
          transition: background 0.2s, border-color 0.2s;
        }
        .dl-btn:hover { background: rgba(99,57,255,0.28); border-color: rgba(99,57,255,0.7); }
        .dl-icon { font-size: 18px; }
        .error-box {
          margin-top: 20px; padding: 14px 18px;
          background: rgba(255,50,80,0.08);
          border: 1px solid rgba(255,50,80,0.25);
          border-radius: 12px; color: #ff8090; font-size: 13px;
          animation: fadeUp 0.3s ease both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="bg-glow" />

      <main>
        <div className="header">
          <div className="logo">DownloadAllInOne</div>
          <div className="tagline">Télécharge n'importe quelle vidéo</div>
          <div className="platforms">
            {[
              { name: "YouTube",   color: "#FF0000" },
              { name: "TikTok",    color: "#69C9D0" },
              { name: "Instagram", color: "#E1306C" },
              { name: "Facebook",  color: "#1877F2" },
            ].map((p) => (
              <div key={p.name} className="chip">
                <span className="dot" style={{ background: p.color }} />
                {p.name}
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <span className="label">Lien de la vidéo</span>
          <div className="input-row">
            <input
              className="url-input"
              placeholder="Colle le lien ici…"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleDownload()}
            />
            <button className="btn" onClick={handleDownload} disabled={loading || !url.trim()}>
              {loading ? <><span className="spinner" />Chargement</> : "↓ Télécharger"}
            </button>
          </div>

          {result?.error && (
            <div className="error-box">⚠ {result.error}</div>
          )}

          {result && !result.error && (
            <div className="result">
              {result.thumbnail && (
                <img className="result-thumb" src={result.thumbnail} alt="thumbnail" />
              )}
              <div className="result-body">
                {result.title && <div className="result-title">{result.title}</div>}
                <a className="dl-btn" href={result.download} target="_blank" rel="noopener noreferrer">
                  <span className="dl-icon">↓</span>
                  Télécharger la vidéo (.{result.ext || "mp4"})
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
