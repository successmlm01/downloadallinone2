"use client"

import { useState } from "react"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://downloader-server-production-3252.up.railway.app"

type Quality = {
  label: string; height: number; formatId: string
  filesize: number | null; needsMerge?: boolean
}
type VideoInfo = {
  title?: string; thumbnail?: string; duration?: number
  uploader?: string; originalUrl?: string; platform?: string
  qualities?: Quality[]; error?: string
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

const PLATFORMS = [
  { name: "YouTube",   color: "#FF0000", gradient: "linear-gradient(135deg,#FF0000,#ff5c5c)", shadow: "rgba(255,0,0,0.3)",        icon: "▶", placeholder: "https://youtube.com/watch?v=...",      badge: "4K · HD · MP4",    href: "/youtube-downloader",   longdesc: "Télécharge toutes les vidéos YouTube en HD, 1080p Full HD ou 4K Ultra HD avec audio fusionné. Supporte les Shorts YouTube.",                                          tags: ["4K Ultra HD","1080p Full HD","720p HD","Audio inclus","Shorts"] },
  { name: "TikTok",    color: "#69C9D0", gradient: "linear-gradient(135deg,#69C9D0,#EE1D52)", shadow: "rgba(105,201,208,0.3)",    icon: "♪", placeholder: "https://tiktok.com/@user/video/...",  badge: "Sans filigrane",   href: "/tiktok-downloader",    longdesc: "Télécharge les vidéos TikTok sans filigrane en haute qualité. Idéal pour sauvegarder tes créations ou celles que tu aimes.",                                           tags: ["Sans filigrane","HD","Son original","Mobile friendly"] },
  { name: "Instagram", color: "#E1306C", gradient: "linear-gradient(135deg,#E1306C,#FCAF45)", shadow: "rgba(225,48,108,0.3)",     icon: "◈", placeholder: "https://instagram.com/reel/...",     badge: "Reels · IGTV",     href: "/instagram-downloader", longdesc: "Télécharge les Reels Instagram, les vidéos classiques et les IGTV en HD directement depuis ton navigateur.",                                                           tags: ["Reels","IGTV","Vidéos","HD","Son inclus"] },
  { name: "Facebook",  color: "#1877F2", gradient: "linear-gradient(135deg,#1877F2,#42a0ff)", shadow: "rgba(24,119,242,0.3)",     icon: "ƒ", placeholder: "https://facebook.com/watch?v=...",   badge: "Vidéos · Reels",   href: "/facebook-downloader",  longdesc: "Télécharge les vidéos Facebook publiques, les Reels Facebook et les rediffusions de Lives en SD ou HD.",                                                               tags: ["Vidéos","Reels","Lives","SD & HD"] },
]

const FEATURES = [
  { icon: "🎬", title: "Jusqu'à 4K Ultra HD",       desc: "Télécharge en 360p, 720p HD, 1080p Full HD ou 4K selon la qualité d'origine. Le meilleur format est proposé automatiquement." },
  { icon: "🔊", title: "Vidéo + Audio fusionnés",    desc: "Chaque téléchargement inclut la piste audio synchronisée. Fini les vidéos muettes ou les fichiers séparés à assembler." },
  { icon: "🚫", title: "TikTok sans filigrane",      desc: "Supprime automatiquement le filigrane @username de TikTok pour obtenir une vidéo propre, prête à partager." },
  { icon: "⚡", title: "Analyse en 5 secondes",      desc: "Notre infrastructure dédiée récupère les métadonnées et formats disponibles en quelques secondes, sans attente." },
  { icon: "📱", title: "Tous appareils",             desc: "Fonctionne sur iPhone, Android, Mac, Windows et Linux directement depuis le navigateur. Aucune application à installer." },
  { icon: "🔒", title: "100% privé",                desc: "Aucun compte requis, aucune donnée stockée. Tes téléchargements restent entre toi et ton appareil." },
  { icon: "🌐", title: "4 plateformes",             desc: "YouTube, TikTok, Instagram et Facebook dans un seul outil. Colle n'importe quel lien et on s'occupe du reste." },
  { icon: "💯", title: "Gratuit sans limite",        desc: "Aucun abonnement, aucun quota. Télécharge autant de vidéos que tu veux, gratuitement, pour toujours." },
]

const STEPS = [
  { n: "01", title: "Copie le lien",      desc: "Va sur YouTube, TikTok, Instagram ou Facebook. Ouvre la vidéo et copie son URL depuis la barre d'adresse ou le bouton Partager." },
  { n: "02", title: "Colle et analyse",   desc: "Reviens ici, colle le lien dans le champ ci-dessus et clique sur Analyser. La plateforme est détectée automatiquement." },
  { n: "03", title: "Choisis la qualité", desc: "Sélectionne la résolution souhaitée parmi toutes les qualités disponibles : 720p, 1080p, 4K selon la vidéo." },
  { n: "04", title: "Télécharge",         desc: "Clique sur Télécharger. Le fichier MP4 avec audio se sauvegarde directement sur ton appareil en quelques secondes." },
]

const FAQS = [
  { q: "Comment télécharger une vidéo YouTube, TikTok, Instagram ou Facebook ?",    a: "Copie l'URL de la vidéo depuis la plateforme, colle-la dans le champ ci-dessus, clique sur Analyser, choisis la qualité et télécharge. C'est tout — aucune inscription, aucun logiciel." },
  { q: "Est-ce que DownloadAllInOne est gratuit ?",                                  a: "Oui, totalement gratuit et sans limite. Pas d'abonnement, pas de quota, pas de pub intrusive. Tu peux télécharger autant de vidéos que tu veux." },
  { q: "Peut-on télécharger des vidéos TikTok sans filigrane ?",                     a: "Oui. Notre outil télécharge la vidéo originale sans le filigrane @username que TikTok ajoute lors du téléchargement via l'application officielle." },
  { q: "Quelles qualités sont disponibles ?",                                         a: "Selon la vidéo et la plateforme : 360p, 480p, 720p HD, 1080p Full HD, 1440p et 4K Ultra HD pour YouTube. TikTok et Instagram proposent généralement la meilleure qualité disponible en un seul format." },
  { q: "L'audio est-il inclus dans le téléchargement ?",                             a: "Oui, toujours. Notre serveur fusionne automatiquement la piste vidéo et audio en un seul fichier MP4. Tu n'as rien à faire de plus." },
  { q: "Peut-on télécharger des vidéos privées ?",                                   a: "Non. Notre outil ne peut accéder qu'aux contenus publics. Les vidéos privées, protégées par un mot de passe ou réservées aux abonnés ne peuvent pas être téléchargées." },
  { q: "Ça fonctionne sur iPhone et Android ?",                                      a: "Oui, DownloadAllInOne fonctionne sur tous les navigateurs mobiles (Safari, Chrome, Firefox). La vidéo se télécharge directement sur ton appareil." },
  { q: "Est-ce légal de télécharger des vidéos ?",                                   a: "Télécharger pour un usage personnel et privé est généralement toléré dans la plupart des pays. Il est interdit de redistribuer ou monétiser du contenu protégé par droits d'auteur sans autorisation." },
]

export default function Home() {
  const [url, setUrl] = useState("")
  const [info, setInfo] = useState<VideoInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Quality | null>(null)
  const [activePlatform, setActivePlatform] = useState(PLATFORMS[0])
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  function detectPlatform(u: string) {
    if (/tiktok\.com/i.test(u)) return PLATFORMS[1]
    if (/instagram\.com/i.test(u)) return PLATFORMS[2]
    if (/facebook\.com|fb\.watch/i.test(u)) return PLATFORMS[3]
    return PLATFORMS[0]
  }
  function handleUrlChange(val: string) {
    setUrl(val)
    if (val.startsWith("http")) setActivePlatform(detectPlatform(val))
  }
  async function handleFetch() {
    if (!url.trim()) return
    setLoading(true); setInfo(null); setSelected(null)
    try {
      const res = await fetch("/api/download", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) })
      const data = await res.json()
      setInfo(data)
      if (data.qualities?.length > 0) setSelected(data.qualities[0])
    } catch { setInfo({ error: "Erreur réseau — réessaie." }) }
    finally { setLoading(false) }
  }
  function getDownloadUrl() {
    if (!selected || !info?.originalUrl) return "#"
    const p = new URLSearchParams({ url: info.originalUrl, formatId: selected.formatId, title: info.title || "video", needsMerge: String(selected.needsMerge ?? true) })
    return `${BACKEND_URL}/stream?${p}`
  }

  const ac = activePlatform.color

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
        .container{max-width:980px;margin:0 auto;padding:0 24px}
        .cw{max-width:1120px;margin:0 auto;padding:0 24px}

        /* NAV */
        nav{position:sticky;top:0;z-index:100;border-bottom:1px solid rgba(255,255,255,0.05);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);background:rgba(6,8,16,0.7)}
        .nav-inner{max-width:1120px;margin:0 auto;padding:0 24px;height:60px;display:flex;align-items:center;justify-content:space-between}
        .nav-logo{font-family:'Syne',sans-serif;font-size:17px;font-weight:800;color:var(--text);text-decoration:none;letter-spacing:-0.5px}
        .nav-logo span{color:var(--accent)}
        .nav-links{display:flex;gap:4px}
        .nav-link{font-size:13px;color:var(--muted);text-decoration:none;padding:6px 12px;border-radius:8px;transition:color .2s,background .2s;font-weight:500}
        .nav-link:hover{color:var(--text);background:rgba(255,255,255,0.05)}
        @media(max-width:600px){.nav-links{display:none}}

        /* HERO */
        .hero{padding:90px 0 70px;text-align:center}
        .hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(108,63,255,0.1);border:1px solid rgba(108,63,255,0.28);border-radius:100px;padding:5px 16px;font-size:12px;font-weight:500;color:#a88fff;letter-spacing:0.06em;margin-bottom:24px;animation:fadeUp .5s ease both}
        .badge-dot{width:6px;height:6px;border-radius:50%;background:#6c3fff;box-shadow:0 0 8px #6c3fff;animation:pulse 2s ease infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        h1{font-family:'Syne',sans-serif;font-size:clamp(44px,7.5vw,84px);font-weight:800;letter-spacing:-3px;line-height:0.92;background:linear-gradient(145deg,#fff 0%,#d4c8ff 40%,#00c2ff 80%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:fadeUp .5s .05s ease both}
        .hero-sub{font-size:clamp(15px,2vw,18px);color:var(--muted);max-width:560px;margin:20px auto 0;line-height:1.7;animation:fadeUp .5s .1s ease both}

        /* STATS */
        .stats-row{display:flex;justify-content:center;margin:48px auto 0;max-width:540px;border:1px solid var(--border);border-radius:20px;overflow:hidden;background:rgba(255,255,255,0.02);animation:fadeUp .5s .15s ease both}
        .stat-item{flex:1;padding:18px 12px;text-align:center;border-right:1px solid var(--border)}
        .stat-item:last-child{border-right:none}
        .stat-val{font-family:'Syne',sans-serif;font-size:26px;font-weight:800;color:var(--text);line-height:1}
        .stat-lbl{font-size:10px;color:var(--muted);margin-top:5px;letter-spacing:.05em;text-transform:uppercase;font-weight:500}

        /* PLATFORM CARDS */
        .sec-label{font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);text-align:center;margin-bottom:22px}
        .platforms-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
        @media(max-width:680px){.platforms-grid{grid-template-columns:repeat(2,1fr)}}
        .pcard{display:flex;flex-direction:column;align-items:center;gap:10px;padding:22px 14px 18px;border-radius:18px;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.025);cursor:pointer;transition:all .2s;text-decoration:none;outline:none}
        .pcard:hover{transform:translateY(-4px);border-color:rgba(255,255,255,0.12);background:rgba(255,255,255,0.04)}
        .pcard.active{border-color:var(--ac);box-shadow:0 0 0 1px var(--ac),0 10px 30px var(--ac-sh)}
        .pcard-icon{width:50px;height:50px;border-radius:15px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;color:white;flex-shrink:0}
        .pcard-name{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:var(--text)}
        .pcard-badge{font-size:11px;color:var(--muted);background:rgba(255,255,255,0.05);border-radius:100px;padding:3px 10px;border:1px solid rgba(255,255,255,0.07);text-align:center}

        /* TOOL */
        .tool-card{background:var(--surface);border:1px solid var(--border);border-radius:24px;padding:28px;box-shadow:0 0 0 1px rgba(255,255,255,0.03),0 40px 80px rgba(0,0,0,0.7);transition:box-shadow .35s;margin-top:20px}
        .pi-row{display:flex;align-items:center;gap:10px;margin-bottom:20px;padding-bottom:18px;border-bottom:1px solid var(--border)}
        .pi-dot{width:8px;height:8px;border-radius:50%;transition:background .3s}
        .pi-name{font-family:'Syne',sans-serif;font-size:13px;font-weight:700;transition:color .3s}
        .pi-badge{margin-left:auto;font-size:11px;color:var(--muted);background:rgba(255,255,255,0.04);border:1px solid var(--border);padding:3px 10px;border-radius:100px}
        .input-label{font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:10px;display:block}
        .input-wrap{display:flex;gap:10px}
        .url-input{flex:1;background:rgba(0,0,0,0.5);border:1px solid var(--border);border-radius:14px;padding:14px 18px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:14px;outline:none;transition:border-color .2s,box-shadow .2s}
        .url-input::placeholder{color:rgba(238,234,224,0.18)}
        .url-input:focus{border-color:rgba(108,63,255,.5);box-shadow:0 0 0 3px rgba(108,63,255,.1)}
        .btn-analyse{color:white;border:none;cursor:pointer;padding:14px 22px;border-radius:14px;font-family:'Syne',sans-serif;font-size:14px;font-weight:700;white-space:nowrap;transition:opacity .2s,transform .15s,background .3s}
        .btn-analyse:hover:not(:disabled){opacity:.88;transform:translateY(-1px)}
        .btn-analyse:disabled{opacity:.4;cursor:not-allowed}
        .loader{display:flex;align-items:center;gap:12px;padding:28px 0;color:var(--muted);font-size:14px}
        .spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,0.1);border-radius:50%;animation:spin .7s linear infinite}
        .result-box{margin-top:20px;border:1px solid var(--border);border-radius:16px;overflow:hidden;animation:fadeUp .4s ease both}
        .thumb-wrap{position:relative}
        .thumb{width:100%;max-height:200px;object-fit:cover;display:block}
        .dur-badge{position:absolute;bottom:8px;right:8px;background:rgba(0,0,0,0.85);color:white;font-size:12px;font-weight:600;padding:3px 8px;border-radius:6px}
        .result-body{padding:20px 22px}
        .r-uploader{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;font-weight:500}
        .r-title{font-family:'Syne',sans-serif;font-size:16px;font-weight:700;color:var(--text);margin-bottom:20px;line-height:1.4;margin-top:4px}
        .qlabel{font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:10px;display:block}
        .qgrid{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px}
        .qbtn{padding:8px 16px;border-radius:10px;border:1px solid var(--border);background:transparent;color:var(--muted);font-family:'Syne',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;position:relative}
        .qbtn:hover{border-color:rgba(255,255,255,.15);color:var(--text)}
        .qbtn.on{background:rgba(108,63,255,.15);border-color:rgba(108,63,255,.5);color:#c0b0ff}
        .qbtn.k4::after{content:"4K";position:absolute;top:-6px;right:-6px;background:linear-gradient(135deg,#f0a500,#ff5f00);color:white;font-size:8px;font-weight:800;padding:1px 5px;border-radius:4px}
        .dl-btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:15px;border-radius:13px;color:white;text-decoration:none;font-family:'Syne',sans-serif;font-size:15px;font-weight:700;transition:opacity .2s,transform .1s}
        .dl-btn:hover{opacity:.88;transform:translateY(-1px)}
        .error-box{margin-top:16px;padding:14px 18px;background:rgba(255,60,80,0.07);border:1px solid rgba(255,60,80,.2);border-radius:12px;color:#ff8090;font-size:13px}
        .tip-box{margin-top:10px;padding:10px 14px;background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:10px;color:var(--muted);font-size:12px;line-height:1.6}

        /* DIVIDER */
        .divider{height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)}

        /* SECTION COMMONS */
        .sec{padding:90px 0}
        .sec-heading{font-family:'Syne',sans-serif;font-size:clamp(28px,4vw,40px);font-weight:800;text-align:center;letter-spacing:-1px;margin-bottom:12px}
        .sec-sub{font-size:15px;color:var(--muted);text-align:center;margin-bottom:52px;line-height:1.6;max-width:520px;margin-left:auto;margin-right:auto}

        /* HOW IT WORKS */
        .steps-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
        @media(max-width:700px){.steps-grid{grid-template-columns:repeat(2,1fr)}}
        .step-card{padding:28px 20px;background:rgba(255,255,255,0.02);border:1px solid var(--border);border-radius:18px;position:relative;overflow:hidden}
        .step-card::before{content:attr(data-n);position:absolute;top:-10px;right:10px;font-family:'Syne',sans-serif;font-size:70px;font-weight:800;color:rgba(255,255,255,0.025);line-height:1;pointer-events:none}
        .step-n{font-family:'Syne',sans-serif;font-size:12px;font-weight:700;color:var(--accent);letter-spacing:.1em;margin-bottom:14px}
        .step-title{font-family:'Syne',sans-serif;font-size:16px;font-weight:700;margin-bottom:8px}
        .step-desc{font-size:13px;color:var(--muted);line-height:1.65}

        /* FEATURES */
        .features-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
        @media(max-width:800px){.features-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:480px){.features-grid{grid-template-columns:1fr}}
        .feat-card{padding:24px 20px;background:rgba(255,255,255,0.02);border:1px solid var(--border);border-radius:16px;transition:border-color .2s,transform .2s}
        .feat-card:hover{border-color:rgba(255,255,255,.12);transform:translateY(-2px)}
        .feat-icon{font-size:26px;margin-bottom:12px}
        .feat-title{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;margin-bottom:8px}
        .feat-desc{font-size:13px;color:var(--muted);line-height:1.6}

        /* PLATFORM DETAIL */
        .pd-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
        @media(max-width:620px){.pd-grid{grid-template-columns:1fr}}
        .pd-card{padding:26px;border-radius:20px;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);display:flex;gap:18px;align-items:flex-start;text-decoration:none;transition:all .2s}
        .pd-card:hover{transform:translateY(-3px);border-color:rgba(255,255,255,.12)}
        .pd-icon{width:50px;height:50px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;color:white;flex-shrink:0}
        .pd-body{flex:1}
        .pd-name{font-family:'Syne',sans-serif;font-size:16px;font-weight:800;margin-bottom:6px;color:var(--text)}
        .pd-desc{font-size:13px;color:var(--muted);line-height:1.6;margin-bottom:12px}
        .pd-tags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}
        .pd-tag{font-size:11px;padding:3px 9px;border-radius:100px;border:1px solid rgba(255,255,255,.08);color:var(--muted)}
        .pd-cta{font-family:'Syne',sans-serif;font-size:12px;font-weight:700;display:inline-flex;align-items:center;gap:4px;opacity:0.6;transition:opacity .2s}
        .pd-card:hover .pd-cta{opacity:1}

        /* ARTICLE */
        .article-inner{max-width:720px;margin:0 auto}
        .article-inner h2{font-family:'Syne',sans-serif;font-size:clamp(20px,3vw,28px);font-weight:800;letter-spacing:-.5px;margin:44px 0 14px;color:var(--text)}
        .article-inner h2:first-child{margin-top:0}
        .article-inner p{font-size:15px;color:rgba(238,234,224,0.55);line-height:1.85;margin-bottom:14px}
        .article-inner ul{padding-left:20px;margin-bottom:14px}
        .article-inner li{font-size:15px;color:rgba(238,234,224,0.55);line-height:1.85;margin-bottom:6px}
        .article-inner strong{color:rgba(238,234,224,0.82);font-weight:600}

        /* FAQ */
        .faq-grid{max-width:720px;margin:0 auto;display:flex;flex-direction:column;gap:9px}
        .faq-item{border:1px solid var(--border);border-radius:14px;overflow:hidden;background:rgba(255,255,255,0.02);transition:border-color .2s}
        .faq-item.open{border-color:rgba(255,255,255,0.11)}
        .faq-q{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px 22px;cursor:pointer;user-select:none}
        .faq-q-text{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;color:var(--text);line-height:1.4}
        .faq-chevron{flex-shrink:0;width:22px;height:22px;border-radius:50%;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--muted);transition:transform .25s,border-color .2s}
        .faq-item.open .faq-chevron{transform:rotate(180deg);border-color:rgba(255,255,255,.15)}
        .faq-a{padding:0 22px 18px;font-size:14px;color:var(--muted);line-height:1.75}

        /* FOOTER */
        footer{position:relative;z-index:1;border-top:1px solid rgba(255,255,255,0.06);padding:60px 0 32px;background:rgba(0,0,0,0.35)}
        .footer-top{display:grid;grid-template-columns:1.6fr repeat(3,1fr);gap:40px;margin-bottom:48px}
        @media(max-width:720px){.footer-top{grid-template-columns:1fr 1fr}}
        @media(max-width:480px){.footer-top{grid-template-columns:1fr}}
        .footer-logo{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;color:var(--text);text-decoration:none;letter-spacing:-.5px;display:block;margin-bottom:12px}
        .footer-logo span{color:var(--accent)}
        .footer-tagline{font-size:13px;color:var(--muted);line-height:1.65;margin-bottom:14px}
        .footer-built{font-size:11px;color:rgba(238,234,224,0.18)}
        .footer-col-title{font-family:'Syne',sans-serif;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(238,234,224,0.28);margin-bottom:16px}
        .footer-links{display:flex;flex-direction:column;gap:10px}
        .footer-link{font-size:13px;color:var(--muted);text-decoration:none;transition:color .2s}
        .footer-link:hover{color:var(--text)}
        .footer-bottom{border-top:1px solid rgba(255,255,255,0.05);padding-top:24px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
        .footer-copy{font-size:12px;color:rgba(238,234,224,0.2)}
        .footer-legal{display:flex;gap:20px}
        .footer-legal a{font-size:12px;color:rgba(238,234,224,0.2);text-decoration:none;transition:color .2s}
        .footer-legal a:hover{color:var(--muted)}

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
            {PLATFORMS.map(p => <a key={p.name} href={p.href} className="nav-link">{p.name}</a>)}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge"><span className="badge-dot" /> Téléchargeur vidéo gratuit · Sans inscription</div>
          <h1>Télécharge<br />n'importe quelle<br />vidéo</h1>
          <p className="hero-sub">YouTube, TikTok, Instagram, Facebook — en HD, 1080p ou 4K avec audio. Colle le lien, choisis la qualité, c'est dans ta poche.</p>
          <div className="stats-row">
            {[{v:"4",l:"Plateformes"},{v:"4K",l:"Qualité max"},{v:"100%",l:"Gratuit"},{v:"0",l:"Inscription"}].map(s => (
              <div key={s.l} className="stat-item"><div className="stat-val">{s.v}</div><div className="stat-lbl">{s.l}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* TOOL */}
      <section style={{position:"relative",zIndex:1,paddingBottom:"0"}}>
        <div className="container">
          <div className="sec-label" style={{marginBottom:"22px"}}>Choisir la plateforme</div>
          <div className="platforms-grid">
            {PLATFORMS.map(p => (
              <button key={p.name}
                className={`pcard${activePlatform.name===p.name?" active":""}`}
                style={{"--ac":p.color,"--ac-sh":p.shadow} as React.CSSProperties}
                onClick={()=>{setActivePlatform(p);setUrl("");setInfo(null)}}>
                <div className="pcard-icon" style={{background:p.gradient,boxShadow:`0 4px 16px ${p.shadow}`}}>{p.icon}</div>
                <div className="pcard-name">{p.name}</div>
                <div className="pcard-badge">{p.badge}</div>
              </button>
            ))}
          </div>
          <div className="tool-card" style={{boxShadow:`0 0 0 1px rgba(255,255,255,0.03),0 40px 80px rgba(0,0,0,0.7),0 0 60px ${ac}12`}}>
            <div className="pi-row">
              <div className="pi-dot" style={{background:ac}} />
              <span className="pi-name" style={{color:ac}}>{activePlatform.name}</span>
              <span className="pi-badge">{activePlatform.badge}</span>
            </div>
            <span className="input-label">Lien de la vidéo</span>
            <div className="input-wrap">
              <input className="url-input" placeholder={activePlatform.placeholder} value={url}
                onChange={e=>handleUrlChange(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&handleFetch()} />
              <button className="btn-analyse"
                style={{background:activePlatform.gradient,boxShadow:`0 4px 20px ${activePlatform.shadow}`}}
                onClick={handleFetch} disabled={loading||!url.trim()}>
                {loading?"…":"Analyser"}
              </button>
            </div>
            {loading&&<div className="loader"><div className="spinner" style={{borderTopColor:ac}}/>Récupération des formats…</div>}
            {info?.error&&(
              <div className="error-box">⚠ {info.error}
                {(info.error.includes("privée")||info.error.includes("connecté"))&&
                  <div className="tip-box">💡 Seules les vidéos <strong>publiques</strong> peuvent être téléchargées.</div>}
              </div>
            )}
            {info&&!info.error&&(
              <div className="result-box">
                {info.thumbnail&&(<div className="thumb-wrap"><img className="thumb" src={info.thumbnail} alt={info.title}/>{info.duration&&<span className="dur-badge">{formatDuration(info.duration)}</span>}</div>)}
                <div className="result-body">
                  {info.uploader&&<div className="r-uploader">{info.uploader}</div>}
                  <div className="r-title">{info.title}</div>
                  {info.qualities&&info.qualities.length>0&&(<>
                    <span className="qlabel">Choisir la qualité</span>
                    <div className="qgrid">
                      {info.qualities.map(q=>(
                        <button key={q.label+q.formatId}
                          className={["qbtn",q.height>=2160?"k4":"",selected?.formatId===q.formatId?"on":""].filter(Boolean).join(" ")}
                          onClick={()=>setSelected(q)}>{q.label}{formatSize(q.filesize)}</button>
                      ))}
                    </div>
                  </>)}
                  {selected&&(
                    <a className="dl-btn" style={{background:activePlatform.gradient,boxShadow:`0 4px 20px ${activePlatform.shadow}`}}
                      href={getDownloadUrl()} target="_blank" rel="noopener noreferrer">
                      ↓ Télécharger en {selected.label} (vidéo + audio)
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <div className="divider" style={{marginTop:"90px"}} />
      <section className="sec" id="how">
        <div className="container">
          <h2 className="sec-heading">Comment ça fonctionne ?</h2>
          <p className="sec-sub">4 étapes simples pour télécharger n'importe quelle vidéo en moins d'une minute.</p>
          <div className="steps-grid">
            {STEPS.map(s=>(
              <div key={s.n} className="step-card" data-n={s.n}>
                <div className="step-n">ÉTAPE {s.n}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <div className="divider" />
      <section className="sec" id="features">
        <div className="container">
          <h2 className="sec-heading">Tout ce dont tu as besoin</h2>
          <p className="sec-sub">Un outil simple, rapide et complet pour télécharger des vidéos depuis les 4 grandes plateformes.</p>
          <div className="features-grid">
            {FEATURES.map(f=>(
              <div key={f.title} className="feat-card">
                <div className="feat-icon">{f.icon}</div>
                <div className="feat-title">{f.title}</div>
                <div className="feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORMS DETAIL */}
      <div className="divider" />
      <section className="sec">
        <div className="container">
          <h2 className="sec-heading">Pages dédiées par plateforme</h2>
          <p className="sec-sub">Chaque plateforme a sa page spécialisée avec guide complet et options optimisées.</p>
          <div className="pd-grid">
            {PLATFORMS.map(p=>(
              <a key={p.name} href={p.href} className="pd-card">
                <div className="pd-icon" style={{background:p.gradient,boxShadow:`0 4px 16px ${p.shadow}`}}>{p.icon}</div>
                <div className="pd-body">
                  <div className="pd-name">{p.name} Downloader</div>
                  <div className="pd-desc">{p.longdesc}</div>
                  <div className="pd-tags">{p.tags.map(t=><span key={t} className="pd-tag">{t}</span>)}</div>
                  <div className="pd-cta" style={{color:p.color}}>Voir la page dédiée →</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SEO ARTICLE */}
      <div className="divider" />
      <section className="sec" id="article">
        <div className="cw">
          <div className="article-inner">
            <h2 className="sec-heading" style={{textAlign:"left",marginBottom:"32px"}}>Guide complet — Télécharger des vidéos en 2026</h2>
            <h2>Qu'est-ce que DownloadAllInOne ?</h2>
            <p><strong>DownloadAllInOne</strong> est un outil en ligne gratuit qui permet de télécharger des vidéos depuis YouTube, TikTok, Instagram et Facebook en quelques secondes, sans inscription et sans logiciel à installer. Il suffit de coller un lien pour obtenir un fichier MP4 en haute qualité avec audio inclus.</p>
            <h2>Pourquoi choisir notre outil ?</h2>
            <p>La plupart des outils de téléchargement souffrent du même problème : ils proposent la vidéo sans audio pour les hautes qualités, ou te redirigent vers des pages de publicités avant d'échouer. Notre approche est différente :</p>
            <ul>
              <li><strong>Audio toujours inclus :</strong> Notre serveur fusionne automatiquement vidéo et audio en un seul fichier MP4, même pour les résolutions 1080p et 4K.</li>
              <li><strong>TikTok sans filigrane :</strong> On télécharge la source originale sans le filigrane @username.</li>
              <li><strong>4 plateformes dans un seul outil :</strong> Inutile de jongler entre plusieurs sites.</li>
              <li><strong>Moteur maintenu activement :</strong> Propulsé par yt-dlp, mis à jour régulièrement par la communauté open-source.</li>
            </ul>
            <h2>Quelle qualité choisir ?</h2>
            <p>Pour regarder sur mobile, <strong>720p</strong> est largement suffisant. Pour un grand écran, <strong>1080p Full HD</strong> est le bon compromis. La <strong>4K Ultra HD</strong> est idéale pour archiver ou visionner sur un écran 4K. Pour TikTok et Instagram, la plateforme propose généralement la meilleure qualité disponible directement.</p>
            <h2>Est-ce légal ?</h2>
            <p>Télécharger des vidéos pour un usage strictement personnel est généralement toléré dans la grande majorité des pays. La règle d'or est simple : tu peux sauvegarder du contenu pour toi, mais tu ne peux pas redistribuer ou monétiser du contenu protégé par droits d'auteur sans autorisation explicite du créateur. Respecte toujours le travail des créateurs.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <div className="divider" />
      <section className="sec" id="faq">
        <div className="cw">
          <h2 className="sec-heading">Questions fréquentes</h2>
          <p className="sec-sub">Tout ce que tu dois savoir sur DownloadAllInOne.</p>
          <div className="faq-grid">
            {FAQS.map((f,i)=>(
              <div key={i} className={`faq-item${openFaq===i?" open":""}`}>
                <div className="faq-q" onClick={()=>setOpenFaq(openFaq===i?null:i)}>
                  <span className="faq-q-text">{f.q}</span>
                  <span className="faq-chevron">▾</span>
                </div>
                {openFaq===i&&<div className="faq-a">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="cw">
          <div className="footer-top">
            <div>
              <a href="/" className="footer-logo">Download<span>All</span>InOne</a>
              <p className="footer-tagline">Le téléchargeur vidéo gratuit pour YouTube, TikTok, Instagram et Facebook. Haute qualité, audio inclus, sans inscription.</p>
              <div className="footer-built">Propulsé par yt-dlp &amp; ffmpeg</div>
            </div>
            <div>
              <div className="footer-col-title">Plateformes</div>
              <div className="footer-links">
                <a href="/youtube-downloader" className="footer-link">YouTube Downloader</a>
                <a href="/tiktok-downloader" className="footer-link">TikTok Downloader</a>
                <a href="/instagram-downloader" className="footer-link">Instagram Downloader</a>
                <a href="/facebook-downloader" className="footer-link">Facebook Downloader</a>
              </div>
            </div>
            <div>
              <div className="footer-col-title">Fonctionnalités</div>
              <div className="footer-links">
                <a href="/#features" className="footer-link">Téléchargement 4K</a>
                <a href="/#features" className="footer-link">Sans filigrane TikTok</a>
                <a href="/#features" className="footer-link">Audio inclus</a>
                <a href="/#features" className="footer-link">Gratuit &amp; illimité</a>
              </div>
            </div>
            <div>
              <div className="footer-col-title">Ressources</div>
              <div className="footer-links">
                <a href="/#faq" className="footer-link">FAQ</a>
                <a href="/#how" className="footer-link">Comment ça marche</a>
                <a href="/#article" className="footer-link">Guide complet</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">© 2026 DownloadAllInOne — Tous droits réservés</span>
            <div className="footer-legal">
              <a href="#">Conditions d'utilisation</a>
              <a href="#">Politique de confidentialité</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
