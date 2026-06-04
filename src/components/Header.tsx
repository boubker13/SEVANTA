import React from "react";
import { Anchor, Globe, Ship, Percent, Coins } from "lucide-react";
import SevantaLogo from "./SevantaLogo";

interface HeaderProps {
  lang: "ar" | "en";
  setLang: (lang: "ar" | "en") => void;
  listingCount: number;
}

export default function Header({ lang, setLang, listingCount }: HeaderProps) {
  const isAr = lang === "ar";

  return (
    <header className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white shadow-2xl py-3 px-6 border-b-4 border-cyan-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Identity as requested in user uploaded image */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950 p-1 rounded-full shadow-lg border-2 border-cyan-400 hover:scale-105 active:scale-95 transition-all duration-300">
            <SevantaLogo size={68} className="animate-fade-in" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-extrabold text-3xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-sky-100 font-sans" style={{ fontVariant: 'lowercase' }}>
                sevanta
              </span>
              <span className="text-[10px] text-cyan-300 border border-cyan-400/40 px-2 py-0.5 rounded-full font-mono">
                {isAr ? "الوساطة الجزائرية" : "Algerian Brokerage"}
              </span>
            </div>
            <p className="text-xs tracking-wider opacity-90 text-cyan-100 font-sans mt-0.5">
              {isAr 
                ? "وساطة موثوقة • تجارة بلا حدود" 
                : "TRUSTED MEDIATION • TRADE WITHOUT LIMITS"}
            </p>
          </div>
        </div>

        {/* Platform metrics & Info rails */}
        <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm">
          
          <div className="bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5 flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>
              {isAr ? "عمولة سيفانتا الضامنة:" : "Sevanta Broker Fee:"} <strong className="text-amber-400">1.5%</strong>
            </span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5 flex items-center gap-2">
            <Anchor className="w-4 h-4 text-cyan-400" />
            <span>
              {isAr ? "العتاد النشط:" : "Active Gear:"} <strong className="text-cyan-400">{listingCount}</strong>
            </span>
          </div>

          {/* Bilingual Toggle */}
          <button
            id="lang-toggle-btn"
            onClick={() => setLang(isAr ? "en" : "ar")}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-1.5 rounded-lg transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md hover:scale-105 active:scale-95"
          >
            <Globe className="w-4 h-4" />
            <span>{isAr ? "English" : "العربية"}</span>
          </button>

        </div>
      </div>
    </header>
  );
}
