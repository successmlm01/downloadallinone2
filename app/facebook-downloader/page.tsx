import type { Metadata } from "next"
import DownloaderTool from "@/components/DownloaderTool"

export const metadata: Metadata = {
  title: "Facebook Downloader — Télécharger vidéos Facebook en HD gratuit",
  description: "Télécharge gratuitement des vidéos Facebook en HD. Vidéos publiques, Stories, Reels Facebook. Sans inscription, sans logiciel. Rapide et gratuit.",
  keywords: "télécharger vidéo facebook, facebook downloader, download facebook video gratuit, facebook video download hd, télécharger facebook",
  openGraph: {
    title: "Facebook Downloader — Vidéos HD Gratuit",
    description: "Télécharge n'importe quelle vidéo Facebook publique gratuitement en HD.",
    url: "https://downloadallinone2.vercel.app/facebook-downloader",
    siteName: "DownloadAllInOne",
    type: "website",
  },
  alternates: { canonical: "https://downloadallinone2.vercel.app/facebook-downloader" },
}

const faqs = [
  { q: "Comment trouver le lien d'une vidéo Facebook ?", a: "Clique sur la vidéo Facebook pour l'ouvrir en plein écran, puis copie l'URL depuis la barre d'adresse de ton navigateur." },
  { q: "Peut-on télécharger des vidéos Facebook privées ?", a: "Non, notre outil fonctionne uniquement avec les vidéos Facebook publiques. Les vidéos privées ne sont pas accessibles." },
  { q: "Ça fonctionne sur mobile ?", a: "Oui, notre outil fonctionne sur tous les navigateurs mobiles. Tu peux télécharger des vidéos Facebook directement sur ton iPhone ou Android." },
  { q: "Les Facebook Reels sont-ils supportés ?", a: "Oui, notre outil supporte les Facebook Reels, les vidéos classiques et les vidéos en direct rediffusées." },
  { q: "Quelle qualité est disponible pour les vidéos Facebook ?", a: "Facebook propose généralement ses vidéos en SD (480p) et HD (720p). Notre outil te propose les deux options quand elles sont disponibles." },
]

export default function FacebookDownloader() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #07080d; color: #eeeae0; font-family: 'Inter', sans-serif; }
        .bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(ellipse 60% 50% at 20% 50%, rgba(24,119,242,0.06) 0%, transparent 65%),
                      radial-gradient(ellipse 50% 40% at 80% 20%, rgba(24,119,242,0.03) 0%, transparent 60%);
        }
        main { position: relative; z-index: 1; }
        .hero { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 80px 24px 60px; gap: 20px; }
        .fb-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(24,119,242,0.1); border: 1px solid rgba(24,119,242,0.25); border-radius: 100px; padding: 6px 16px; font-size: 13px; font-weight: 600; color: #1877F2; }
        h1 { font-family: 'Syne', sans-serif; font-size: clamp(36px, 6vw, 68px); font-weight: 800; letter-spacing: -2px; line-height: 1; color: #eeeae0; }
        h1 span { color: #1877F2; }
        .hero-sub { font-size: 17px; color: rgba(238,234,224,0.5); max-width: 520px; line-height: 1.6; }
        .hero-stats { display: flex; gap: 32px; margin-top: 8px; flex-wrap: wrap; justify-content: center; }
        .stat { text-align: center; }
        .stat-num { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; color: #1877F2; }
        .stat-label { font-size: 12px; color: rgba(238,234,224,0.4); margin-top: 2px; }
        .tool-section { display: flex; justify-content: center; padding: 0 24px 80px; }
        .steps-section { padding: 80px 24px; background: rgba(255,255,255,0.02); border-top: 1px solid rgba(255,255,255,0.05); }
        .section-title { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; text-align: center; margin-bottom: 48px; }
        .steps { display: flex; gap: 24px; max-width: 900px; margin: 0 auto; flex-wrap: wrap; justify-content: center; }
        .step { flex: 1; min-width: 220px; max-width: 280px; text-align: center; }
        .step-num { width: 48px; height: 48px; border-radius: 50%; background: rgba(24,119,242,0.1); border: 1px solid rgba(24,119,242,0.3); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: #1877F2; margin: 0 auto 16px; }
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
        .nav-links a { font-size: 13px; color: rgba(238,234,224,0.5); text-decoration: none; }
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
          <div className="fb-badge">ƒ Facebook Downloader</div>
          <h1>Télécharger une vidéo <span>Facebook</span> en HD</h1>
          <p className="hero-sub">Télécharge gratuitement des vidéos Facebook publiques, Reels et rediffusions en direct en HD. Sans inscription, sans logiciel.</p>
          <div className="hero-stats">
            <div className="stat"><div className="stat-num">HD</div><div className="stat-label">Qualité max</div></div>
            <div className="stat"><div className="stat-num">Reels</div><div className="stat-label">Supportés</div></div>
            <div className="stat"><div className="stat-num">100%</div><div className="stat-label">Gratuit</div></div>
          </div>
        </section>
        <section className="tool-section">
          <DownloaderTool placeholder="https://www.facebook.com/watch?v=..." accentColor="#1877F2" />
        </section>
        <section className="steps-section">
          <h2 className="section-title">Comment télécharger une vidéo Facebook ?</h2>
          <div className="steps">
            {[
              { n: "1", title: "Ouvre la vidéo", desc: "Clique sur la vidéo Facebook pour l'ouvrir en plein écran dans ton navigateur." },
              { n: "2", title: "Copie le lien", desc: "Copie l'URL depuis la barre d'adresse de ton navigateur." },
              { n: "3", title: "Colle et analyse", desc: "Colle le lien dans notre outil et clique sur Analyser." },
              { n: "4", title: "Télécharge en HD", desc: "Choisis SD ou HD et télécharge ta vidéo Facebook." },
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
              { icon: "📹", title: "Vidéos & Reels", desc: "Télécharge les vidéos classiques Facebook et les nouveaux Reels Facebook." },
              { icon: "📺", title: "Rediffusions Live", desc: "Télécharge les rediffusions de vidéos en direct Facebook." },
              { icon: "🖥️", title: "SD & HD", desc: "Choisis entre la qualité standard (480p) et haute définition (720p)." },
              { icon: "💯", title: "Gratuit", desc: "Aucun abonnement, aucune limite. 100% gratuit pour toujours." },
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
