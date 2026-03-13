import type { Metadata } from "next"
import DownloaderTool from "@/components/DownloaderTool"

export const metadata: Metadata = {
  title: "YouTube Downloader — Télécharger vidéos YouTube en HD, 1080p, 4K",
  description: "Télécharge gratuitement n'importe quelle vidéo YouTube en HD, 1080p ou 4K avec audio. Rapide, gratuit, sans inscription. Colle le lien et télécharge en quelques secondes.",
  keywords: "télécharger vidéo youtube, youtube downloader, download youtube gratuit, youtube en mp4, télécharger youtube hd",
  openGraph: {
    title: "YouTube Downloader Gratuit — HD, 1080p, 4K",
    description: "Télécharge n'importe quelle vidéo YouTube gratuitement en quelques secondes.",
    url: "https://downloadallinone2.vercel.app/youtube-downloader",
    siteName: "DownloadAllInOne",
    type: "website",
  },
  alternates: { canonical: "https://downloadallinone2.vercel.app/youtube-downloader" },
}

const faqs = [
  { q: "Comment télécharger une vidéo YouTube ?", a: "Colle le lien de la vidéo YouTube dans le champ ci-dessus, clique sur Analyser, choisis la qualité souhaitée (720p, 1080p ou 4K) puis clique sur Télécharger." },
  { q: "Est-ce gratuit ?", a: "Oui, DownloadAllInOne est entièrement gratuit et sans inscription. Aucun compte n'est nécessaire." },
  { q: "Quelles qualités sont disponibles ?", a: "Selon la vidéo, tu peux télécharger en 360p, 480p, 720p HD, 1080p Full HD ou 4K Ultra HD avec audio inclus." },
  { q: "Puis-je télécharger des playlists YouTube ?", a: "Pour l'instant, notre outil télécharge une vidéo à la fois. Le support des playlists arrive prochainement." },
  { q: "Le téléchargement YouTube est-il légal ?", a: "Télécharger des vidéos pour usage personnel est toléré dans de nombreux pays. Évite de redistribuer le contenu sans autorisation du créateur." },
]

export default function YouTubeDownloader() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #07080d; color: #eeeae0; font-family: 'Inter', sans-serif; }
        .bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(ellipse 60% 50% at 20% 50%, rgba(255,0,0,0.06) 0%, transparent 65%),
                      radial-gradient(ellipse 50% 40% at 80% 20%, rgba(255,100,0,0.04) 0%, transparent 60%);
        }
        main { position: relative; z-index: 1; }

        /* Hero */
        .hero {
          display: flex; flex-direction: column; align-items: center;
          text-align: center; padding: 80px 24px 60px; gap: 20px;
        }
        .yt-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,0,0,0.1); border: 1px solid rgba(255,0,0,0.25);
          border-radius: 100px; padding: 6px 16px;
          font-size: 13px; font-weight: 600; color: #ff6060;
        }
        .yt-icon { font-size: 16px; }
        h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(36px, 6vw, 68px);
          font-weight: 800; letter-spacing: -2px; line-height: 1;
          color: #eeeae0;
        }
        h1 span { color: #FF0000; }
        .hero-sub { font-size: 17px; color: rgba(238,234,224,0.5); max-width: 520px; line-height: 1.6; }
        .hero-stats { display: flex; gap: 32px; margin-top: 8px; flex-wrap: wrap; justify-content: center; }
        .stat { text-align: center; }
        .stat-num { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; color: #FF0000; }
        .stat-label { font-size: 12px; color: rgba(238,234,224,0.4); margin-top: 2px; }

        /* Tool section */
        .tool-section { display: flex; justify-content: center; padding: 0 24px 80px; }

        /* Steps */
        .steps-section { padding: 80px 24px; background: rgba(255,255,255,0.02); border-top: 1px solid rgba(255,255,255,0.05); }
        .section-title { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; text-align: center; margin-bottom: 48px; color: #eeeae0; }
        .steps { display: flex; gap: 24px; max-width: 900px; margin: 0 auto; flex-wrap: wrap; justify-content: center; }
        .step { flex: 1; min-width: 220px; max-width: 280px; text-align: center; }
        .step-num { width: 48px; height: 48px; border-radius: 50%; background: rgba(255,0,0,0.1); border: 1px solid rgba(255,0,0,0.25); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: #FF0000; margin: 0 auto 16px; }
        .step h3 { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; margin-bottom: 8px; }
        .step p { font-size: 14px; color: rgba(238,234,224,0.5); line-height: 1.6; }

        /* Features */
        .features-section { padding: 80px 24px; }
        .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; max-width: 900px; margin: 0 auto; }
        .feature { padding: 24px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; }
        .feature-icon { font-size: 28px; margin-bottom: 12px; }
        .feature h3 { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; margin-bottom: 8px; }
        .feature p { font-size: 13px; color: rgba(238,234,224,0.5); line-height: 1.6; }

        /* FAQ */
        .faq-section { padding: 80px 24px; background: rgba(255,255,255,0.02); border-top: 1px solid rgba(255,255,255,0.05); }
        .faqs { max-width: 700px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; }
        .faq { padding: 20px 24px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; }
        .faq h3 { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; margin-bottom: 8px; color: #eeeae0; }
        .faq p { font-size: 14px; color: rgba(238,234,224,0.55); line-height: 1.6; }

        /* Article SEO */
        .article-section { padding: 80px 24px; }
        .article { max-width: 700px; margin: 0 auto; }
        .article h2 { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; margin-bottom: 16px; margin-top: 40px; color: #eeeae0; }
        .article h2:first-child { margin-top: 0; }
        .article p { font-size: 15px; color: rgba(238,234,224,0.6); line-height: 1.8; margin-bottom: 16px; }
        .article ul { padding-left: 20px; margin-bottom: 16px; }
        .article li { font-size: 15px; color: rgba(238,234,224,0.6); line-height: 1.8; margin-bottom: 6px; }

        /* Nav */
        nav { padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: space-between; }
        .nav-logo { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: #eeeae0; text-decoration: none; }
        .nav-links { display: flex; gap: 24px; }
        .nav-links a { font-size: 13px; color: rgba(238,234,224,0.5); text-decoration: none; transition: color 0.2s; }
        .nav-links a:hover { color: #eeeae0; }

        /* Footer */
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
          <div className="yt-badge"><span className="yt-icon">▶</span> YouTube Downloader</div>
          <h1>Télécharger une vidéo <span>YouTube</span> gratuitement</h1>
          <p className="hero-sub">Télécharge n'importe quelle vidéo YouTube en HD, 1080p ou 4K avec audio. Gratuit, rapide, sans inscription.</p>
          <div className="hero-stats">
            <div className="stat"><div className="stat-num">4K</div><div className="stat-label">Qualité max</div></div>
            <div className="stat"><div className="stat-num">100%</div><div className="stat-label">Gratuit</div></div>
            <div className="stat"><div className="stat-num">0</div><div className="stat-label">Inscription requise</div></div>
          </div>
        </section>

        <section className="tool-section">
          <DownloaderTool placeholder="https://www.youtube.com/watch?v=..." accentColor="#FF0000" />
        </section>

        <section className="steps-section">
          <h2 className="section-title">Comment télécharger une vidéo YouTube ?</h2>
          <div className="steps">
            {[
              { n: "1", title: "Copie le lien", desc: "Va sur YouTube, ouvre la vidéo et copie l'URL depuis la barre d'adresse." },
              { n: "2", title: "Colle et analyse", desc: "Colle le lien dans le champ ci-dessus et clique sur Analyser." },
              { n: "3", title: "Choisis la qualité", desc: "Sélectionne la qualité voulue : 720p, 1080p HD ou 4K Ultra HD." },
              { n: "4", title: "Télécharge", desc: "Clique sur Télécharger. La vidéo se sauvegarde sur ton appareil." },
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
          <h2 className="section-title">Pourquoi choisir notre YouTube Downloader ?</h2>
          <div className="features">
            {[
              { icon: "🎬", title: "Haute qualité jusqu'à 4K", desc: "Télécharge en 720p, 1080p Full HD ou 4K Ultra HD selon la qualité d'origine de la vidéo." },
              { icon: "🔊", title: "Vidéo + audio inclus", desc: "Contrairement à d'autres outils, nos téléchargements incluent toujours la piste audio synchronisée." },
              { icon: "⚡", title: "Ultra rapide", desc: "Analyse et génération du lien en moins de 5 secondes grâce à notre infrastructure dédiée." },
              { icon: "🔒", title: "Sécurisé et privé", desc: "Aucun compte requis, aucune donnée conservée. Tes téléchargements restent privés." },
              { icon: "📱", title: "Compatible tous appareils", desc: "Fonctionne sur iPhone, Android, Mac, Windows et Linux directement depuis le navigateur." },
              { icon: "💯", title: "100% gratuit", desc: "Aucun abonnement, aucune limite cachée. Télécharge autant de vidéos que tu veux." },
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
            <h2>Comment télécharger des vidéos YouTube en 2026</h2>
            <p>Télécharger des vidéos YouTube est devenu une pratique courante pour garder du contenu hors ligne, regarder des tutoriels sans connexion internet ou sauvegarder des vidéos importantes. Notre YouTube Downloader gratuit te permet de le faire en quelques clics.</p>
            <h2>Quels formats sont disponibles ?</h2>
            <p>Notre outil supporte tous les formats proposés par YouTube :</p>
            <ul>
              <li><strong>144p / 240p / 360p</strong> — Idéal pour économiser de l'espace</li>
              <li><strong>480p</strong> — Bonne qualité pour mobile</li>
              <li><strong>720p HD</strong> — Haute définition standard</li>
              <li><strong>1080p Full HD</strong> — Qualité cinéma</li>
              <li><strong>1440p / 2160p 4K</strong> — Ultra Haute Définition</li>
            </ul>
            <h2>Est-ce légal de télécharger des vidéos YouTube ?</h2>
            <p>Télécharger des vidéos YouTube pour un usage personnel et privé est généralement toléré dans la plupart des pays. Cependant, il est important de respecter les droits d'auteur et de ne pas redistribuer le contenu téléchargé sans l'autorisation du créateur original. Les conditions d'utilisation de YouTube interdisent techniquement le téléchargement, sauf pour les vidéos proposant l'option officielle de téléchargement.</p>
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
