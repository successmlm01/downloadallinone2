"use client"

import { type Lang } from "@/lib/translations"

const FLAGS: Record<Lang, string> = { en: "🇬🇧", fr: "🇫🇷", ar: "🇸🇦" }
const LABELS: Record<Lang, string> = { en: "EN", fr: "FR", ar: "AR" }

export default function LanguageSwitcher({
  current,
  onChange,
}: {
  current: Lang
  onChange: (l: Lang) => void
}) {
  return (
    <div className="ls-wrap">
      <style>{`
        .ls-wrap{display:flex;gap:4px;align-items:center}
        .ls-btn{
          display:flex;align-items:center;gap:5px;
          padding:5px 10px;border-radius:8px;border:1px solid transparent;
          background:transparent;color:rgba(238,234,224,0.4);
          font-family:'Syne',sans-serif;font-size:12px;font-weight:700;
          cursor:pointer;transition:all .15s;letter-spacing:.04em;
        }
        .ls-btn:hover{color:#eeeae0;background:rgba(255,255,255,0.06)}
        .ls-btn.active{color:#eeeae0;background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.12)}
        .ls-flag{font-size:14px;line-height:1}
      `}</style>
      {(["en","fr","ar"] as Lang[]).map(l => (
        <button
          key={l}
          className={`ls-btn${current===l?" active":""}`}
          onClick={() => onChange(l)}
          title={l==="en"?"English":l==="fr"?"Français":"العربية"}
        >
          <span className="ls-flag">{FLAGS[l]}</span>
          {LABELS[l]}
        </button>
      ))}
    </div>
  )
}
