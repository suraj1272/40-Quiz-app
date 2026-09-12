import React from 'react';

export default function CompanyLogo({ size = "md", showSubtitle = true }) {
  const isLarge = size === "lg";
  const iconSize = isLarge ? "w-12 h-12" : "w-9 h-9";
  const titleSize = isLarge ? "text-2xl" : "text-xl";

  return (
    <div className="flex items-center gap-3 select-none">
      <div className={`${iconSize} rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-black text-xl tracking-wider`}>
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      <div>
        <div className={`font-bold tracking-tight text-slate-900 ${titleSize} flex items-center gap-1.5`}>
          <span>TTS</span>
          <span className="text-blue-600 font-extrabold">ASSESSMENT</span>
        </div>
        {showSubtitle && (
          <p className="text-xs font-medium text-slate-600 uppercase tracking-widest">
            Certified Evaluation Portal
          </p>
        )}
      </div>
    </div>
  );
}
