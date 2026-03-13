import type { Metadata } from "next"
import DownloaderTool from "@/components/DownloaderTool"

export const metadata: Metadata = {
  title: "Instagram Downloader — Télécharger vidéos & Reels Instagram en HD",
  description: "Télécharge gratuitement des vidéos Instagram, Reels et IGTV en HD. Sans inscription, sans logiciel. Colle le lien et télécharge instantanément.",
  keywords: "télécharger vidéo instagram, instagram downloader, download reels instagram, télécharger reels, instagram video download gratuit",
  openGraph: {
    title: "Instagram Downloader — Vidéos & Reels en HD Gratuit",
    description: "Télécharge n'importe quelle vidéo Instagram, Reels ou IGTV gratuitement.",
    url: "https://downloadallinone2.vercel.app/instagram-downloader",
    siteName: "DownloadAllInOne",
    type: "website",
  },
  alternates: { canonical: "https://downloadallinone2.vercel.app/instagram-downloader" },
}

const faqs = [
  { q: "Comment télécharger un Reel Instagram ?", a: "Ouvre le Reel sur Instagram, appuie sur les 3 points ··· puis 'Copier le lien'. Colle ce lien dans notre outil et télécharge." },
  { q: "Peut-on télécharger des vidéos Instagram privées ?", a: "Non, notre outil ne fonctionne qu'avec les publications publiques. Les comptes privés nécessitent d'être abonné et connecté." },
  { q: "Ça fonctionne pour IGTV ?", a: "Oui, notre outil supporte les vidéos Instagram classiques, les Reels et les vidéos IGTV." },
  { q: "Comment copier le lien d'un Reel Instagram ?", a: "Sur l'app Instagram : appuie sur ··· → Copier le lien. Sur navigateur : copie l'URL depuis la barre d'adresse." },
  { q: "Quelle qualité pour les vidéos Instagram ?", a: "Instagram compresse ses vidéos, donc la qualité maximale disponible est généralement 720p ou 1080p selon la vidéo originale." },
]

export default function InstagramDownloader() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #07080d; color: #eeeae0; font-family: 'Inter', sans-serif; }
        .bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(ellipse 60% 50% at 20% 50%, rgba(225,48,108,0.06) 0%, transparent 65%),
                      radial-gradient(ellipse 50% 40% at 80% 20%, rgba(253,175,34,0.04) 0%, transparent 60%);
        }
        main { position: relative; z-index: 1; }
        .hero { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 80px 24px 60px; gap: 20px; }
        .ig-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(225,48,108,0.1); border: 1px solid rgba(225,48,108,0.25); border-radius: 100px; padding: 6px 16px; font-size: 13px; font-weight: 600; color: #E1306C; }
        h1 { font-family: 'Syne', sans-serif; font-size: clamp(36px, 6vw, 68px); font-weight: 800; letter-spacing: -2px; line-height: 1; color: #eeeae0; }
        h1 span { background: linear-gradient(135deg, #E1306C, #FCAF45); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .hero-sub { font-size: 17px; color: rgba(238,234,224,0.5); max-width: 520px; line-height: 1.6; }
        .hero-stats { display: flex; gap: 32px; margin-top: 8px; flex-wrap: wrap; justify-content: center; }
        .stat { text-align: center; }
        .stat-num { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; color: #E1306C; }
        .stat-label { font-size: 12px; color: rgba(238,234,224,0.4); margin-top: 2px; }
        .tool-section { display: flex; justify-content: center; padding: 0 24px 80px; }
        .steps-section { padding: 80px 24px; background: rgba(255,255,255,0.02); border-top: 1px solid rgba(255,255,255,0.05); }
        .section-title { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; text-align: center; margin-bottom: 48px; }
        .steps { display: flex; gap: 24px; max-width: 900px; margin: 0 auto; flex-wrap: wrap; justify-content: center; }
        .step { flex: 1; min-width: 220px; max-width: 280px; text-align: center; }
        .step-num { width: 48px; height: 48px; border-radius: 50%; background: rgba(225,48,108,0.1); border: 1px solid rgba(225,48,108,0.3); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: #E1306C; margin: 0 auto 16px; }
        .step h3 { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; margin-bottom: 8px; }
        .step p { font-size: 14px; color: rgba(238,234,224,0.5); line-height: 1.6; }
        .features-section { padding: 80px 24px; }
        .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; max-width: 900px; margin: 0 auto; }
        .feature { padding: 24px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; }
        .feature-icon { font-size: 28px; margin-bottom: 12px; }
        .feature h3 { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; margin-bottom: 8px; }
        .feature p { font-size: 13px; color: rgba(238,234,224,0.5); line-height: 1.6; }
        .faq-section { padding: 80px 24px; background: rgba(255,255,255,0.02); border-top: 1px solid rgba(255,255,255,0.05); }
        .faqs { max-width: 700px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; }
        .faq { padding: 20px 24px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; }
        .faq h3 { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; margin-bottom: 8px; }
        .faq p { font-size: 14px; color: rgba(238,234,224,0.55); line-height: 1.6; }
        nav { padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: space-between; }
        .nav-logo { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: #eeeae0; text-decoration: none; }
        .nav-links { display: flex; gap: 24px; }
        .nav-links a { font-size: 13px; color: rgba(238,234,224,0.5); text-decoration: none; transition: color 0.2s; }
        .nav-links a:hover { color: #eeeae0; }
        footer { padding: 40px 24px; border-top: 1px solid rgba(255,255,255,0.06); text-align: center; color: rgba(238,234,224,0.3); font-size: 13px; }
      `}</style>
      <div className="bg" />
      <nav>
        <a href="/" className="nav-logo">DownloadAllInOne</a>
        <div className="nav-links">
          <a href="/youtube-downloader">YouTube</a>
          <a href="/tiktok-downloader">TikTok</a>
          <a href="/instagram-downloader">Instagram</a>
          <a href="/facebook-downloader">Facebook</a>
        </div>
      </nav>
      <main>
        <section className="hero">
          <div className="ig-badge">◈ Instagram Downloader</div>
          <h1>Télécharger vidéos & Reels <span>Instagram</span></h1>
          <p className="hero-sub">Télécharge gratuitement n'importe quel Reel, vidéo ou IGTV en HD. Sans inscription, sans logiciel à installer.</p>
          <div className="hero-stats">
            <div className="stat"><div className="stat-num">Reels</div><div className="stat-label">Supportés</div></div>
            <div className="stat"><div className="stat-num">IGTV</div><div className="stat-label">Supporté</div></div>
            <div className="stat"><div className="stat-num">HD</div><div className="stat-label">Qualité max</div></div>
          </div>
        </section>
        <section className="tool-section">
          <DownloaderTool placeholder="https://www.instagram.com/reel/..." accentColor="#E1306C" />
        </section>
        <section className="steps-section">
          <h2 className="section-title">Comment télécharger un Reel Instagram ?</h2>
          <div className="steps">
            {[
              { n: "1", title: "Ouvre le Reel", desc: "Trouve le Reel ou la vidéo Instagram que tu veux télécharger." },
              { n: "2", title: "Copie le lien", desc: "Appuie sur ··· → Copier le lien (app) ou copie l'URL (navigateur)." },
              { n: "3", title: "Colle et analyse", desc: "Colle le lien dans le champ ci-dessus et clique sur Analyser." },
              { n: "4", title: "Télécharge en HD", desc: "Choisis la qualité et télécharge ta vidéo Instagram en HD." },
            ].map((s) => (
              <div key={s.n} className="step">
                <div className="step-num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="features-section">
          <h2 className="section-title">Fonctionnalités</h2>
          <div className="features">
            {[
              { icon: "🎬", title: "Reels & IGTV", desc: "Télécharge tous les formats vidéo Instagram : Reels courts, vidéos classiques et IGTV." },
              { icon: "📱", title: "Mobile friendly", desc: "Fonctionne parfaitement sur iPhone et Android directement depuis Safari ou Chrome." },
              { icon: "🎵", title: "Audio préservé", desc: "La musique et les sons originaux de tes Reels Instagram sont conservés." },
              { icon: "⚡", title: "Rapide", desc: "Téléchargement généré en quelques secondes. Pas d'attente." },
            ].map((f) => (
              <div key={f.title} className="feature">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="faq-section">
          <h2 className="section-title">Questions fréquentes</h2>
          <div className="faqs">
            {faqs.map((f) => (
              <div key={f.q} className="faq"><h3>{f.q}</h3><p>{f.a}</p></div>
            ))}
          </div>
        </section>
      </main>
      <footer>
        <p>© 2026 DownloadAllInOne — <a href="/youtube-downloader" style={{color:"inherit"}}>YouTube</a> · <a href="/tiktok-downloader" style={{color:"inherit"}}>TikTok</a> · <a href="/instagram-downloader" style={{color:"inherit"}}>Instagram</a> · <a href="/facebook-downloader" style={{color:"inherit"}}>Facebook</a></p>
      </footer>
    </>
  )
}
