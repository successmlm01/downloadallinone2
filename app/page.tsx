"use client"

import { useState } from "react"
import { translations, type Lang } from "@/lib/translations"
import LanguageSwitcher from "@/components/LanguageSwitcher"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://downloader-server-production-3252.up.railway.app"

type Quality = { label: string; height: number; formatId: string; filesize: number | null; needsMerge?: boolean }
type VideoInfo = { title?: string; thumbnail?: string; duration?: number; uploader?: string; originalUrl?: string; qualities?: Quality[]; error?: string }

function formatDuration(s: number) { const m = Math.floor(s/60); return `${m}:${(s%60).toString().padStart(2,"0")}` }
function formatSize(b: number | null) { if(!b) return ""; if(b>1e9) return ` · ${(b/1e9).toFixed(1)} GB`; if(b>1e6) return ` · ${(b/1e6).toFixed(0)} MB`; return "" }

const PLATFORM_COLORS = [
  { color:"#FF0000", gradient:"linear-gradient(135deg,#FF0000,#ff5c5c)", shadow:"rgba(255,0,0,0.3)",     icon:"▶", href:"/youtube-downloader",   name:"YouTube"   },
  { color:"#69C9D0", gradient:"linear-gradient(135deg,#69C9D0,#EE1D52)", shadow:"rgba(105,201,208,0.3)", icon:"♪", href:"/tiktok-downloader",    name:"TikTok"    },
  { color:"#E1306C", gradient:"linear-gradient(135deg,#E1306C,#FCAF45)", shadow:"rgba(225,48,108,0.3)",  icon:"◈", href:"/instagram-downloader", name:"Instagram" },
  { color:"#1877F2", gradient:"linear-gradient(135deg,#1877F2,#42a0ff)", shadow:"rgba(24,119,242,0.3)",  icon:"ƒ", href:"/facebook-downloader",  name:"Facebook"  },
]
const PLATFORM_PLACEHOLDERS = [
  "https://youtube.com/watch?v=...",
  "https://tiktok.com/@user/video/...",
  "https://instagram.com/reel/...",
  "https://facebook.com/watch?v=...",
]

export default function Home() {
  const [lang, setLang] = useState<Lang>("en")
  const [url, setUrl] = useState("")
  const [info, setInfo] = useState<VideoInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Quality | null>(null)
  const [activePIdx, setActivePIdx] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const t = translations[lang]
  const ap = PLATFORM_COLORS[activePIdx]
  const ac = ap.color

  function detectPlatformIdx(u: string) {
    if (/tiktok\.com/i.test(u)) return 1
    if (/instagram\.com/i.test(u)) return 2
    if (/facebook\.com|fb\.watch/i.test(u)) return 3
    return 0
  }
  function handleUrlChange(val: string) {
    setUrl(val)
    if (val.startsWith("http")) setActivePIdx(detectPlatformIdx(val))
  }
  async function handleFetch() {
    if (!url.trim()) return
    setLoading(true); setInfo(null); setSelected(null)
    try {
      const res = await fetch("/api/download", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({url}) })
      const data = await res.json()
      setInfo(data)
      if (data.qualities?.length > 0) setSelected(data.qualities[0])
    } catch { setInfo({ error: t.errors.network }) }
    finally { setLoading(false) }
  }
  function getDownloadUrl() {
    if (!selected || !info?.originalUrl) return "#"
    const p = new URLSearchParams({ url:info.originalUrl, formatId:selected.formatId, title:info.title||"video", needsMerge:String(selected.needsMerge??true) })
    return `${BACKEND_URL}/stream?${p}`
  }

  function changeLang(l: Lang) {
    setLang(l)
    if (typeof document !== "undefined") {
      document.documentElement.dir = translations[l].dir
      document.documentElement.lang = l
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--bg:#060810;--surface:#0d0f1a;--border:rgba(255,255,255,0.07);--text:#eeeae0;--muted:rgba(238,234,224,0.38);--accent:#6c3fff}
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;min-height:100vh;overflow-x:hidden}
        .bg-fixed{position:fixed;inset:0;z-index:0;pointer-events:none}
        .bg-grad{background:radial-gradient(ellipse 80% 60% at 10% 70%,rgba(108,63,255,0.07) 0%,transparent 60%),radial-gradient(ellipse 60% 50% at 90% 10%,rgba(0,194,255,0.05) 0%,transparent 60%)}
        .bg-grid{opacity:0.018;background-image:linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px);background-size:44px 44px}
        section{position:relative;z-index:1}
        .c{max-width:980px;margin:0 auto;padding:0 24px}
        .cw{max-width:1120px;margin:0 auto;padding:0 24px}

        /* NAV */
        nav{position:sticky;top:0;z-index:100;border-bottom:1px solid rgba(255,255,255,0.05);backdrop-filter:blur(20px);background:rgba(6,8,16,0.75)}
        .nav-inner{max-width:1120px;margin:0 auto;padding:0 24px;height:62px;display:flex;align-items:center;gap:16px}
        .nav-logo{font-family:'Syne',sans-serif;font-size:17px;font-weight:800;color:var(--text);text-decoration:none;letter-spacing:-0.5px;margin-inline-end:auto}
        .nav-logo span{color:var(--accent)}
        .nav-links{display:flex;gap:4px}
        .nav-link{font-size:13px;color:var(--muted);text-decoration:none;padding:6px 12px;border-radius:8px;transition:color .2s,background .2s;font-weight:500}
        .nav-link:hover{color:var(--text);background:rgba(255,255,255,0.05)}
        @media(max-width:640px){.nav-links{display:none}}

        /* HERO */
        .hero{padding:90px 0 70px;text-align:center}
        .hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(108,63,255,0.1);border:1px solid rgba(108,63,255,0.28);border-radius:100px;padding:5px 16px;font-size:12px;font-weight:500;color:#a88fff;letter-spacing:0.05em;margin-bottom:24px;animation:fadeUp .5s ease both}
        .badge-dot{width:6px;height:6px;border-radius:50%;background:#6c3fff;box-shadow:0 0 8px #6c3fff;animation:pulse 2s ease infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        h1{font-family:'Syne',sans-serif;font-size:clamp(42px,7.5vw,84px);font-weight:800;letter-spacing:-3px;line-height:0.92;background:linear-gradient(145deg,#fff 0%,#d4c8ff 40%,#00c2ff 80%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:fadeUp .5s .05s ease both}
        .hero-sub{font-size:clamp(15px,2vw,17px);color:var(--muted);max-width:560px;margin:20px auto 0;line-height:1.7;animation:fadeUp .5s .1s ease both}
        .stats-row{display:flex;justify-content:center;margin:48px auto 0;max-width:540px;border:1px solid var(--border);border-radius:20px;overflow:hidden;background:rgba(255,255,255,0.02);animation:fadeUp .5s .15s ease both}
        .stat-item{flex:1;padding:18px 12px;text-align:center;border-inline-end:1px solid var(--border)}
        .stat-item:last-child{border-inline-end:none}
        .stat-val{font-family:'Syne',sans-serif;font-size:26px;font-weight:800;line-height:1}
        .stat-lbl{font-size:10px;color:var(--muted);margin-top:5px;letter-spacing:.04em;text-transform:uppercase;font-weight:500}

        /* PLATFORMS */
        .sec-label{font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);text-align:center;margin-bottom:22px}
        .pgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
        @media(max-width:680px){.pgrid{grid-template-columns:repeat(2,1fr)}}
        .pcard{display:flex;flex-direction:column;align-items:center;gap:10px;padding:22px 14px 18px;border-radius:18px;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.025);cursor:pointer;transition:all .2s;outline:none}
        .pcard:hover{transform:translateY(-4px);border-color:rgba(255,255,255,0.12)}
        .pcard.active{border-color:var(--ac);box-shadow:0 0 0 1px var(--ac),0 10px 30px var(--ac-sh)}
        .pcard-icon{width:50px;height:50px;border-radius:15px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;color:white}
        .pcard-name{font-family:'Syne',sans-serif;font-size:14px;font-weight:700}
        .pcard-badge{font-size:11px;color:var(--muted);background:rgba(255,255,255,0.05);border-radius:100px;padding:3px 10px;border:1px solid rgba(255,255,255,0.07);text-align:center}

        /* TOOL */
        .tool-card{background:var(--surface);border:1px solid var(--border);border-radius:24px;padding:28px;margin-top:20px;transition:box-shadow .35s}
        .pi-row{display:flex;align-items:center;gap:10px;margin-bottom:20px;padding-bottom:18px;border-bottom:1px solid var(--border)}
        .pi-dot{width:8px;height:8px;border-radius:50%;transition:background .3s}
        .pi-name{font-family:'Syne',sans-serif;font-size:13px;font-weight:700;transition:color .3s}
        .pi-badge{margin-inline-start:auto;font-size:11px;color:var(--muted);background:rgba(255,255,255,0.04);border:1px solid var(--border);padding:3px 10px;border-radius:100px}
        .inp-label{font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:10px;display:block}
        .inp-wrap{display:flex;gap:10px}
        .url-inp{flex:1;background:rgba(0,0,0,0.5);border:1px solid var(--border);border-radius:14px;padding:14px 18px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:14px;outline:none;transition:border-color .2s,box-shadow .2s}
        .url-inp::placeholder{color:rgba(238,234,224,0.18)}
        .url-inp:focus{border-color:rgba(108,63,255,.5);box-shadow:0 0 0 3px rgba(108,63,255,.1)}
        .btn-go{color:white;border:none;cursor:pointer;padding:14px 22px;border-radius:14px;font-family:'Syne',sans-serif;font-size:14px;font-weight:700;white-space:nowrap;transition:opacity .2s,transform .15s}
        .btn-go:hover:not(:disabled){opacity:.88;transform:translateY(-1px)}
        .btn-go:disabled{opacity:.4;cursor:not-allowed}
        .loader{display:flex;align-items:center;gap:12px;padding:28px 0;color:var(--muted);font-size:14px}
        .spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,0.1);border-radius:50%;animation:spin .7s linear infinite}
        .rbox{margin-top:20px;border:1px solid var(--border);border-radius:16px;overflow:hidden;animation:fadeUp .4s ease both}
        .thumb{width:100%;max-height:200px;object-fit:cover;display:block}
        .dur{position:absolute;bottom:8px;inset-inline-end:8px;background:rgba(0,0,0,.85);color:white;font-size:12px;font-weight:600;padding:3px 8px;border-radius:6px}
        .rbody{padding:20px 22px}
        .r-up{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;font-weight:500}
        .r-title{font-family:'Syne',sans-serif;font-size:16px;font-weight:700;margin-bottom:20px;line-height:1.4;margin-top:4px}
        .qlbl{font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:10px;display:block}
        .qgrid{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px}
        .qbtn{padding:8px 16px;border-radius:10px;border:1px solid var(--border);background:transparent;color:var(--muted);font-family:'Syne',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;position:relative}
        .qbtn:hover{border-color:rgba(255,255,255,.15);color:var(--text)}
        .qbtn.on{background:rgba(108,63,255,.15);border-color:rgba(108,63,255,.5);color:#c0b0ff}
        .qbtn.k4::after{content:"4K";position:absolute;top:-6px;inset-inline-end:-6px;background:linear-gradient(135deg,#f0a500,#ff5f00);color:white;font-size:8px;font-weight:800;padding:1px 5px;border-radius:4px}
        .dl-btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:15px;border-radius:13px;color:white;text-decoration:none;font-family:'Syne',sans-serif;font-size:15px;font-weight:700;transition:opacity .2s,transform .1s}
        .dl-btn:hover{opacity:.88;transform:translateY(-1px)}
        .err{margin-top:16px;padding:14px 18px;background:rgba(255,60,80,0.07);border:1px solid rgba(255,60,80,.2);border-radius:12px;color:#ff8090;font-size:13px}
        .tip{margin-top:10px;padding:10px 14px;background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:10px;color:var(--muted);font-size:12px;line-height:1.6}

        /* DIVIDER */
        .divider{height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)}

        /* SECTIONS */
        .sec{padding:90px 0}
        .sh{font-family:'Syne',sans-serif;font-size:clamp(26px,4vw,40px);font-weight:800;text-align:center;letter-spacing:-1px;margin-bottom:12px}
        .ss{font-size:15px;color:var(--muted);text-align:center;margin-bottom:52px;line-height:1.6;max-width:520px;margin-inline:auto}

        /* HOW */
        .sgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
        @media(max-width:700px){.sgrid{grid-template-columns:repeat(2,1fr)}}
        .sc{padding:28px 20px;background:rgba(255,255,255,0.02);border:1px solid var(--border);border-radius:18px;position:relative;overflow:hidden}
        .sc::before{content:attr(data-n);position:absolute;top:-10px;inset-inline-end:10px;font-family:'Syne',sans-serif;font-size:70px;font-weight:800;color:rgba(255,255,255,0.025);line-height:1;pointer-events:none}
        .sn{font-family:'Syne',sans-serif;font-size:12px;font-weight:700;color:var(--accent);letter-spacing:.1em;margin-bottom:14px}
        .st{font-family:'Syne',sans-serif;font-size:16px;font-weight:700;margin-bottom:8px}
        .sd{font-size:13px;color:var(--muted);line-height:1.65}

        /* FEATURES */
        .fgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
        @media(max-width:800px){.fgrid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:480px){.fgrid{grid-template-columns:1fr}}
        .fc{padding:24px 20px;background:rgba(255,255,255,0.02);border:1px solid var(--border);border-radius:16px;transition:border-color .2s,transform .2s}
        .fc:hover{border-color:rgba(255,255,255,.12);transform:translateY(-2px)}
        .fi{font-size:26px;margin-bottom:12px}
        .ft{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;margin-bottom:8px}
        .fd{font-size:13px;color:var(--muted);line-height:1.6}

        /* PLATFORM DETAIL */
        .pdgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
        @media(max-width:620px){.pdgrid{grid-template-columns:1fr}}
        .pdc{padding:26px;border-radius:20px;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);display:flex;gap:18px;align-items:flex-start;text-decoration:none;transition:all .2s}
        .pdc:hover{transform:translateY(-3px);border-color:rgba(255,255,255,.12)}
        .pdi{width:50px;height:50px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;color:white;flex-shrink:0}
        .pdb{flex:1}
        .pdn{font-family:'Syne',sans-serif;font-size:16px;font-weight:800;margin-bottom:6px}
        .pdd{font-size:13px;color:var(--muted);line-height:1.6;margin-bottom:10px}
        .pdtags{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:10px}
        .pdtag{font-size:11px;padding:3px 9px;border-radius:100px;border:1px solid rgba(255,255,255,.08);color:var(--muted)}
        .pdcta{font-family:'Syne',sans-serif;font-size:12px;font-weight:700;display:inline-flex;align-items:center;gap:4px;opacity:.6;transition:opacity .2s}
        .pdc:hover .pdcta{opacity:1}

        /* ARTICLE */
        .art{max-width:720px;margin:0 auto}
        .art h2{font-family:'Syne',sans-serif;font-size:clamp(20px,3vw,28px);font-weight:800;letter-spacing:-.5px;margin:44px 0 14px}
        .art h2:first-child{margin-top:0}
        .art p{font-size:15px;color:rgba(238,234,224,0.55);line-height:1.85;margin-bottom:14px}
        .art ul{padding-inline-start:20px;margin-bottom:14px}
        .art li{font-size:15px;color:rgba(238,234,224,0.55);line-height:1.85;margin-bottom:6px}
        .art strong{color:rgba(238,234,224,0.82);font-weight:600}

        /* FAQ */
        .faqgrid{max-width:720px;margin:0 auto;display:flex;flex-direction:column;gap:9px}
        .faqitem{border:1px solid var(--border);border-radius:14px;overflow:hidden;background:rgba(255,255,255,0.02);transition:border-color .2s}
        .faqitem.open{border-color:rgba(255,255,255,0.11)}
        .faqq{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px 22px;cursor:pointer;user-select:none}
        .faqq-t{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;line-height:1.4}
        .faqchev{flex-shrink:0;width:22px;height:22px;border-radius:50%;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--muted);transition:transform .25s,border-color .2s}
        .faqitem.open .faqchev{transform:rotate(180deg);border-color:rgba(255,255,255,.15)}
        .faqa{padding:0 22px 18px;font-size:14px;color:var(--muted);line-height:1.75}

        /* FOOTER */
        footer{position:relative;z-index:1;border-top:1px solid rgba(255,255,255,0.06);padding:60px 0 32px;background:rgba(0,0,0,0.35)}
        .ftop{display:grid;grid-template-columns:1.6fr repeat(3,1fr);gap:40px;margin-bottom:48px}
        @media(max-width:720px){.ftop{grid-template-columns:1fr 1fr}}
        @media(max-width:480px){.ftop{grid-template-columns:1fr}}
        .flogo{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;color:var(--text);text-decoration:none;display:block;margin-bottom:12px}
        .flogo span{color:var(--accent)}
        .ftag{font-size:13px;color:var(--muted);line-height:1.65;margin-bottom:14px}
        .fbuilt{font-size:11px;color:rgba(238,234,224,0.2)}
        .fct{font-family:'Syne',sans-serif;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(238,234,224,0.28);margin-bottom:16px}
        .flinks{display:flex;flex-direction:column;gap:10px}
        .flink{font-size:13px;color:var(--muted);text-decoration:none;transition:color .2s}
        .flink:hover{color:var(--text)}
        .fbot{border-top:1px solid rgba(255,255,255,0.05);padding-top:24px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
        .fcopy{font-size:12px;color:rgba(238,234,224,0.2)}
        .flegal{display:flex;gap:20px}
        .flegal a{font-size:12px;color:rgba(238,234,224,0.2);text-decoration:none;transition:color .2s}
        .flegal a:hover{color:var(--muted)}

        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      <div className="bg-fixed bg-grad" />
      <div className="bg-fixed bg-grid" />

      {/* NAV */}
      <nav>
        <div className="nav-inner">
          <a href="/" className="nav-logo">Download<span>All</span>InOne</a>
          <div className="nav-links">
            {PLATFORM_COLORS.map(p => <a key={p.name} href={p.href} className="nav-link">{p.name}</a>)}
          </div>
          <LanguageSwitcher current={lang} onChange={changeLang} />
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="c">
          <div className="hero-badge"><span className="badge-dot" /> {t.hero.badge}</div>
          <h1>{t.hero.title.map((line,i) => <span key={i}>{line}{i<t.hero.title.length-1?<br/>:null}</span>)}</h1>
          <p className="hero-sub">{t.hero.sub}</p>
          <div className="stats-row">
            {t.stats.map(s => (
              <div key={s.l} className="stat-item">
                <div className="stat-val">{s.v}</div>
                <div className="stat-lbl">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOOL */}
      <section style={{position:"relative",zIndex:1}}>
        <div className="c">
          <div className="sec-label">{t.tool.sectionLabel}</div>
          <div className="pgrid">
            {PLATFORM_COLORS.map((p,i) => (
              <button key={p.name}
                className={`pcard${activePIdx===i?" active":""}`}
                style={{"--ac":p.color,"--ac-sh":p.shadow} as React.CSSProperties}
                onClick={()=>{setActivePIdx(i);setUrl("");setInfo(null)}}>
                <div className="pcard-icon" style={{background:p.gradient,boxShadow:`0 4px 16px ${p.shadow}`}}>{p.icon}</div>
                <div className="pcard-name">{p.name}</div>
                <div className="pcard-badge">{t.platforms[i].badge}</div>
              </button>
            ))}
          </div>
          <div className="tool-card" style={{boxShadow:`0 0 0 1px rgba(255,255,255,.03),0 40px 80px rgba(0,0,0,.7),0 0 60px ${ac}12`}}>
            <div className="pi-row">
              <div className="pi-dot" style={{background:ac}}/>
              <span className="pi-name" style={{color:ac}}>{PLATFORM_COLORS[activePIdx].name}</span>
              <span className="pi-badge">{t.platforms[activePIdx].badge}</span>
            </div>
            <span className="inp-label">{t.tool.inputLabel}</span>
            <div className="inp-wrap">
              <input className="url-inp" placeholder={PLATFORM_PLACEHOLDERS[activePIdx]} value={url}
                onChange={e=>handleUrlChange(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&handleFetch()} />
              <button className="btn-go" style={{background:ap.gradient,boxShadow:`0 4px 20px ${ap.shadow}`}}
                onClick={handleFetch} disabled={loading||!url.trim()}>
                {loading?t.tool.analyzingBtn:t.tool.analyzeBtn}
              </button>
            </div>
            {loading&&<div className="loader"><div className="spinner" style={{borderTopColor:ac}}/>{t.tool.loadingText}</div>}
            {info?.error&&(
              <div className="err">⚠ {info.error}
                {(info.error.includes("privé")||info.error.includes("private")||info.error.includes("خاص"))&&
                  <div className="tip" dangerouslySetInnerHTML={{__html:t.tool.errorPrivate}}/>}
              </div>
            )}
            {info&&!info.error&&(
              <div className="rbox">
                {info.thumbnail&&(<div style={{position:"relative"}}><img className="thumb" src={info.thumbnail} alt={info.title}/>{info.duration&&<span className="dur">{formatDuration(info.duration)}</span>}</div>)}
                <div className="rbody">
                  {info.uploader&&<div className="r-up">{info.uploader}</div>}
                  <div className="r-title">{info.title}</div>
                  {info.qualities&&info.qualities.length>0&&(<>
                    <span className="qlbl">{t.tool.qualityLabel}</span>
                    <div className="qgrid">
                      {info.qualities.map(q=>(
                        <button key={q.label+q.formatId}
                          className={["qbtn",q.height>=2160?"k4":"",selected?.formatId===q.formatId?"on":""].filter(Boolean).join(" ")}
                          onClick={()=>setSelected(q)}>{q.label}{formatSize(q.filesize)}</button>
                      ))}
                    </div>
                  </>)}
                  {selected&&(
                    <a className="dl-btn" style={{background:ap.gradient,boxShadow:`0 4px 20px ${ap.shadow}`}}
                      href={getDownloadUrl()} target="_blank" rel="noopener noreferrer">
                      {t.tool.downloadBtn(selected.label)}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <div className="divider" style={{marginTop:"90px"}}/>
      <section className="sec" id="how">
        <div className="c">
          <h2 className="sh">{t.how.heading}</h2>
          <p className="ss">{t.how.sub}</p>
          <div className="sgrid">
            {t.how.steps.map(s=>(
              <div key={s.n} className="sc" data-n={s.n}>
                <div className="sn">{lang==="ar"?"الخطوة":"STEP"} {s.n}</div>
                <div className="st">{s.title}</div>
                <div className="sd">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <div className="divider"/>
      <section className="sec" id="features">
        <div className="c">
          <h2 className="sh">{t.features.heading}</h2>
          <p className="ss">{t.features.sub}</p>
          <div className="fgrid">
            {t.features.items.map(f=>(
              <div key={f.title} className="fc">
                <div className="fi">{f.icon}</div>
                <div className="ft">{f.title}</div>
                <div className="fd">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM DETAIL */}
      <div className="divider"/>
      <section className="sec">
        <div className="c">
          <h2 className="sh">{t.platformsDetail.heading}</h2>
          <p className="ss">{t.platformsDetail.sub}</p>
          <div className="pdgrid">
            {PLATFORM_COLORS.map((p,i)=>(
              <a key={p.name} href={p.href} className="pdc">
                <div className="pdi" style={{background:p.gradient,boxShadow:`0 4px 16px ${p.shadow}`}}>{p.icon}</div>
                <div className="pdb">
                  <div className="pdn" style={{color:p.color}}>{p.name} Downloader</div>
                  <div className="pdd">{t.platforms[i].longdesc}</div>
                  <div className="pdtags">{t.platforms[i].tags.map(tag=><span key={tag} className="pdtag">{tag}</span>)}</div>
                  <div className="pdcta" style={{color:p.color}}>{t.platforms[i].cta}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ARTICLE SEO */}
      <div className="divider"/>
      <section className="sec" id="article">
        <div className="cw">
          <div className="art">
            <h2 className="sh" style={{textAlign:"start",marginBottom:"32px"}}>{t.article.heading}</h2>
            {t.article.blocks.map((b,i)=>(
              <div key={i}>
                <h2>{b.h}</h2>
                <p>{b.p}</p>
                {"ul" in b && b.ul && <ul>{b.ul.map((li,j)=><li key={j}><span dangerouslySetInnerHTML={{__html:li}}/></li>)}</ul>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <div className="divider"/>
      <section className="sec" id="faq">
        <div className="cw">
          <h2 className="sh">{t.faq.heading}</h2>
          <p className="ss">{t.faq.sub}</p>
          <div className="faqgrid">
            {t.faq.items.map((f,i)=>(
              <div key={i} className={`faqitem${openFaq===i?" open":""}`}>
                <div className="faqq" onClick={()=>setOpenFaq(openFaq===i?null:i)}>
                  <span className="faqq-t">{f.q}</span>
                  <span className="faqchev">▾</span>
                </div>
                {openFaq===i&&<div className="faqa">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="cw">
          <div className="ftop">
            <div>
              <a href="/" className="flogo">Download<span>All</span>InOne</a>
              <p className="ftag">{t.footer.tagline}</p>
              <div className="fbuilt">{t.footer.built}</div>
            </div>
            {t.footer.cols.map(col=>(
              <div key={col.title}>
                <div className="fct">{col.title}</div>
                <div className="flinks">{col.links.map(l=><a key={l.l} href={l.h} className="flink">{l.l}</a>)}</div>
              </div>
            ))}
          </div>
          <div className="fbot">
            <span className="fcopy">{t.footer.copy}</span>
            <div className="flegal">
              <a href="#">{t.footer.terms}</a>
              <a href="#">{t.footer.privacy}</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
