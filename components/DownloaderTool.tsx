"use client"

import { useState } from "react"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://downloader-server-production-3252.up.railway.app"

type Quality = {
  label: string
  height: number
  formatId: string
  filesize: number | null
  needsMerge?: boolean
}

type VideoInfo = {
  title?: string
  thumbnail?: string
  duration?: number
  uploader?: string
  originalUrl?: string
  platform?: string
  qualities?: Quality[]
  error?: string
}

function formatDuration(s: number) {
  const m = Math.floor(s / 60)
  return `${m}:${(s % 60).toString().padStart(2, "0")}`
}

function formatSize(b: number | null) {
  if (!b) return ""
  if (b > 1e9) return ` · ${(b / 1e9).toFixed(1)} GB`
  if (b > 1e6) return ` · ${(b / 1e6).toFixed(0)} MB`
  return ""
}

export default function DownloaderTool({
  placeholder,
  accentColor,
}: {
  placeholder: string
  accentColor: string
}) {
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

  function getDownloadUrl() {
    if (!selected || !info?.originalUrl) return "#"
    const p = new URLSearchParams({
      url: info.originalUrl,
      formatId: selected.formatId,
      title: info.title || "video",
      needsMerge: String(selected.needsMerge ?? true),
    })
    return `${BACKEND_URL}/stream?${p}`
  }

  return (
    <div className="tool-card">
      <style>{`
        .tool-card {
          width: 100%; max-width: 640px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px; padding: 28px;
          box-shadow: 0 32px 64px rgba(0,0,0,0.5);
        }
        .t-label {
          font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: rgba(238,234,224,0.4);
          margin-bottom: 10px; display: block;
        }
        .t-row { display: flex; gap: 10px; }
        .t-input {
          flex: 1; background: rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px; padding: 14px 18px; color: #eeeae0;
          font-family: 'Inter', sans-serif; font-size: 14px; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .t-input::placeholder { color: rgba(238,234,224,0.2); }
        .t-input:focus {
          border-color: ${accentColor}88;
          box-shadow: 0 0 0 3px ${accentColor}22;
        }
        .t-btn {
          color: white; border: none; cursor: pointer; padding: 14px 22px;
          border-radius: 14px; font-family: 'Syne', sans-serif;
          font-size: 14px; font-weight: 700; white-space: nowrap;
          transition: opacity 0.2s, transform 0.15s;
          background: ${accentColor};
          box-shadow: 0 4px 20px ${accentColor}66;
        }
        .t-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .t-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .t-loader {
          display: flex; align-items: center; gap: 12px;
          padding: 28px 0; color: rgba(238,234,224,0.4); font-size: 14px;
        }
        .t-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.1);
          border-top-color: ${accentColor};
          border-radius: 50%; animation: spin 0.7s linear infinite;
        }
        .t-result {
          margin-top: 20px; border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; overflow: hidden;
        }
        .t-thumb { width: 100%; max-height: 200px; object-fit: cover; display: block; position: relative; }
        .t-thumb img { width: 100%; max-height: 200px; object-fit: cover; display: block; }
        .t-dur {
          position: absolute; bottom: 8px; right: 8px;
          background: rgba(0,0,0,0.8); color: white;
          font-size: 12px; font-weight: 600;
          padding: 3px 8px; border-radius: 6px;
        }
        .t-body { padding: 20px 22px; }
        .t-uploader {
          font-size: 12px; color: rgba(238,234,224,0.4);
          text-transform: uppercase; letter-spacing: 0.08em; font-weight: 500;
        }
        .t-title {
          font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700;
          color: #eeeae0; margin-bottom: 20px; line-height: 1.4; margin-top: 4px;
        }
        .t-qlabel {
          font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: rgba(238,234,224,0.4);
          margin-bottom: 10px; display: block;
        }
        .t-qgrid { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px; }
        .t-qbtn {
          padding: 8px 16px; border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.08);
          background: transparent; color: rgba(238,234,224,0.4);
          font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.15s; position: relative;
        }
        .t-qbtn:hover { border-color: rgba(255,255,255,0.15); color: #eeeae0; }
        .t-qbtn.on {
          background: ${accentColor}22;
          border-color: ${accentColor}88;
          color: #eeeae0;
        }
        .t-qbtn.k4::after {
          content: "4K"; position: absolute; top: -6px; right: -6px;
          background: linear-gradient(135deg,#f0a500,#ff6b00);
          color: white; font-size: 8px; font-weight: 800;
          padding: 1px 5px; border-radius: 4px;
        }
        .t-dlbtn {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          width: 100%; padding: 14px;
          border: 1px solid ${accentColor}55;
          border-radius: 12px; color: #eeeae0; text-decoration: none;
          font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
          transition: all 0.2s; background: ${accentColor}22;
        }
        .t-dlbtn:hover {
          background: ${accentColor}44;
          border-color: ${accentColor};
          transform: translateY(-1px);
        }
        .t-error {
          margin-top: 16px; padding: 14px 18px;
          background: rgba(255,60,80,0.07);
          border: 1px solid rgba(255,60,80,0.2);
          border-radius: 12px; color: #ff8090; font-size: 13px;
        }
        .t-tip {
          margin-top: 12px; padding: 10px 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px; color: rgba(238,234,224,0.4);
          font-size: 12px; line-height: 1.5;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <span className="t-label">Lien de la vidéo</span>
      <div className="t-row">
        <input
          className="t-input"
          placeholder={placeholder}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleFetch()}
        />
        <button
          className="t-btn"
          onClick={handleFetch}
          disabled={loading || !url.trim()}
        >
          {loading ? "…" : "Analyser"}
        </button>
      </div>

      {loading && (
        <div className="t-loader">
          <div className="t-spinner" />
          Récupération des formats…
        </div>
      )}

      {info?.error && (
        <div className="t-error">
          ⚠ {info.error}
          {info.error.includes("privée") || info.error.includes("connecté") ? (
            <div className="t-tip">
              💡 Seules les vidéos <strong>publiques</strong> peuvent être téléchargées.
            </div>
          ) : null}
        </div>
      )}

      {info && !info.error && (
        <div className="t-result">
          {info.thumbnail && (
            <div className="t-thumb" style={{ position: "relative" }}>
              <img src={info.thumbnail} alt={info.title} />
              {info.duration && (
                <span className="t-dur">{formatDuration(info.duration)}</span>
              )}
            </div>
          )}
          <div className="t-body">
            {info.uploader && (
              <div className="t-uploader">{info.uploader}</div>
            )}
            <div className="t-title">{info.title}</div>

            {info.qualities && info.qualities.length > 0 && (
              <>
                <span className="t-qlabel">Choisir la qualité</span>
                <div className="t-qgrid">
                  {info.qualities.map((q) => (
                    <button
                      key={q.label + q.formatId}
                      className={[
                        "t-qbtn",
                        q.height >= 2160 ? "k4" : "",
                        selected?.formatId === q.formatId ? "on" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => setSelected(q)}
                    >
                      {q.label}
                      {formatSize(q.filesize)}
                    </button>
                  ))}
                </div>
              </>
            )}

            {selected && (
              <a
                className="t-dlbtn"
                href={getDownloadUrl()}
                target="_blank"
                rel="noopener noreferrer"
              >
                ↓ Télécharger en {selected.label}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
