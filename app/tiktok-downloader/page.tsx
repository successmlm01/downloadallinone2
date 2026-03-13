import type { Metadata } from "next"
import DownloaderTool from "@/components/DownloaderTool"

export const metadata: Metadata = {
  title: "TikTok Downloader — Télécharger vidéos TikTok sans filigrane",
  description: "Télécharge gratuitement des vidéos TikTok sans filigrane en HD. Aucune inscription requise. Colle le lien et télécharge instantanément sur iPhone, Android, PC.",
  keywords: "télécharger tiktok sans filigrane, tiktok downloader, download tiktok gratuit, tiktok video downloader, télécharger vidéo tiktok",
  openGraph: {
    title: "TikTok Downloader Sans Filigrane — Gratuit",
    description: "Télécharge n'importe quelle vidéo TikTok sans filigrane gratuitement.",
    url: "https://downloadallinone2.vercel.app/tiktok-downloader",
    siteName: "DownloadAllInOne",
    type: "website",
  },
  alternates: { canonical: "https://downloadallinone2.vercel.app/tiktok-downloader" },
}

const faqs = [
  { q: "Comment télécharger une vidéo TikTok sans filigrane ?", a: "Colle le lien de la vidéo TikTok dans le champ ci-dessus, clique sur Analyser puis Télécharger. Notre outil retire automatiquement le filigrane TikTok." },
  { q: "Puis-je télécharger des TikToks privés ?", a: "Non, notre outil ne peut télécharger que les vidéos TikTok publiques. Les vidéos privées nécessitent d'être connecté au compte propriétaire." },
  { q: "Où trouver le lien d'une vidéo TikTok ?", a: "Sur l'app TikTok, appuie sur Partager puis 'Copier le lien'. Sur navigateur, copie l'URL directement depuis la barre d'adresse." },
  { q: "Le téléchargement fonctionne sur iPhone ?", a: "Oui, notre outil fonctionne sur tous les navigateurs iOS (Safari, Chrome). La vidéo se sauvegarde directement dans ta galerie photo." },
  { q: "Combien de vidéos puis-je télécharger ?", a: "Il n'y a aucune limite. Tu peux télécharger autant de vidéos TikTok que tu veux, gratuitement." },
]

export default function TikTokDownloader() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #07080d; color: #eeeae0; font-family: 'Inter', sans-serif; }
        .bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(ellipse 60% 50% at 20% 50%, rgba(105,201,208,0.06) 0%, transparent 65%),
                      radial-gradient(ellipse 50% 40% at 80% 20%, rgba(238,29,82,0.04) 0%, transparent 60%);
        }
        main { position: relative; z-index: 1; }
        .hero { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 80px 24px 60px; gap: 20px; }
        .tt-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(105,201,208,0.1); border: 1px solid rgba(105,201,208,0.25); border-radius: 100px; padding: 6px 16px; font-size: 13px; font-weight: 600; color: #69C9D0; }
        h1 { font-family: 'Syne', sans-serif; font-size: clamp(36px, 6vw, 68px); font-weight: 800; letter-spacing: -2px; line-height: 1; color: #eeeae0; }
        h1 span { background: linear-gradient(135deg, #69C9D0, #EE1D52); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .hero-sub { font-size: 17px; color: rgba(238,234,224,0.5); max-width: 520px; line-height: 1.6; }
        .hero-stats { display: flex; gap: 32px; margin-top: 8px; flex-wrap: wrap; justify-content: center; }
        .stat { text-align: center; }
        .stat-num { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; color: #69C9D0; }
        .stat-label { font-size: 12px; color: rgba(238,234,224,0.4); margin-top: 2px; }
        .tool-section { display: flex; justify-content: center; padding: 0 24px 80px; }
        .steps-section { padding: 80px 24px; background: rgba(255,255,255,0.02); border-top: 1px solid rgba(255,255,255,0.05); }
        .section-title { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; text-align: center; margin-bottom: 48px; }
        .steps { display: flex; gap: 24px; max-width: 900px; margin: 0 auto; flex-wrap: wrap; justify-content: center; }
        .step { flex: 1; min-width: 220px; max-width: 280px; text-align: center; }
        .step-num { width: 48px; height: 48px; border-radius: 50%; background: rgba(105,201,208,0.1); border: 1px solid rgba(105,201,208,0.3); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: #69C9D0; margin: 0 auto 16px; }
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
        .article-section { padding: 80px 24px; }
        .article { max-width: 700px; margin: 0 auto; }
        .article h2 { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; margin-bottom: 16px; margin-top: 40px; }
        .article h2:first-child { margin-top: 0; }
        .article p { font-size: 15px; color: rgba(238,234,224,0.6); line-height: 1.8; margin-bottom: 16px; }
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
          <div className="tt-badge">♪ TikTok Downloader</div>
          <h1>Télécharger une vidéo <span>TikTok</span> sans filigrane</h1>
          <p className="hero-sub">Télécharge n'importe quelle vidéo TikTok en HD, sans le filigrane @username. Gratuit, instantané, sans inscription.</p>
          <div className="hero-stats">
            <div className="stat"><div className="stat-num">0</div><div className="stat-label">Filigrane</div></div>
            <div className="stat"><div className="stat-num">HD</div><div className="stat-label">Qualité max</div></div>
            <div className="stat"><div className="stat-num">100%</div><div className="stat-label">Gratuit</div></div>
          </div>
        </section>

        <section className="tool-section">
          <DownloaderTool placeholder="https://www.tiktok.com/@user/video/..." accentColor="#69C9D0" />
        </section>

        <section className="steps-section">
          <h2 className="section-title">Comment télécharger une vidéo TikTok ?</h2>
          <div className="steps">
            {[
              { n: "1", title: "Ouvre TikTok", desc: "Trouve la vidéo que tu veux télécharger sur l'app ou le site TikTok." },
              { n: "2", title: "Copie le lien", desc: "Appuie sur Partager → Copier le lien. Sur navigateur, copie l'URL." },
              { n: "3", title: "Colle et analyse", desc: "Colle le lien dans le champ ci-dessus et clique Analyser." },
              { n: "4", title: "Télécharge sans filigrane", desc: "La vidéo se télécharge sans le filigrane @username de TikTok." },
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
          <h2 className="section-title">Pourquoi notre TikTok Downloader ?</h2>
          <div className="features">
            {[
              { icon: "🚫", title: "Sans filigrane", desc: "Télécharge les vidéos TikTok sans le filigrane @username qui gâche la vidéo." },
              { icon: "📱", title: "iPhone & Android", desc: "Compatible avec tous les appareils mobiles. Fonctionne directement depuis le navigateur." },
              { icon: "⚡", title: "Instantané", desc: "Le lien de téléchargement est généré en quelques secondes." },
              { icon: "🎵", title: "Son inclus", desc: "La musique et les sons originaux de la vidéo TikTok sont préservés." },
              { icon: "🔒", title: "Privé", desc: "Aucune donnée personnelle collectée. Tes téléchargements restent confidentiels." },
              { icon: "💯", title: "Gratuit sans limite", desc: "Télécharge autant de TikToks que tu veux, sans abonnement." },
            ].map((f) => (
              <div key={f.title} className="feature">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="article-section">
          <article className="article">
            <h2>Télécharger des vidéos TikTok en 2026 — Guide complet</h2>
            <p>TikTok est la plateforme vidéo la plus populaire au monde avec plus d'un milliard d'utilisateurs actifs. Que tu veuilles sauvegarder tes vidéos préférées, les regarder hors ligne ou les réutiliser pour tes créations, notre TikTok Downloader te permet de le faire facilement.</p>
            <h2>Pourquoi supprimer le filigrane TikTok ?</h2>
            <p>Quand tu télécharges une vidéo TikTok via l'application officielle, un filigrane avec le logo TikTok et le nom d'utilisateur est ajouté automatiquement. Notre outil télécharge la vidéo originale sans ce filigrane, ce qui la rend beaucoup plus propre pour un usage personnel ou créatif.</p>
          </article>
        </section>

        <section className="faq-section">
          <h2 className="section-title">Questions fréquentes</h2>
          <div className="faqs">
            {faqs.map((f) => (
              <div key={f.q} className="faq">
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
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
