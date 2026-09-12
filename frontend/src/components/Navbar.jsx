import React from 'react';
import CompanyLogo from './CompanyLogo';
import { User, ShieldCheck } from 'lucide-react';

export default function Navbar({ candidate, showProctorBadge = false, timerComponent = null }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <CompanyLogo size="md" showSubtitle={false} />

        <div className="flex items-center gap-4">
          {timerComponent && (
            <div>{timerComponent}</div>
          )}

          {candidate && (
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-slate-900 leading-tight">
                  {candidate.name}
                </div>
                <div className="text-[11px] text-slate-500 leading-tight">
                  {candidate.email}
                </div>
              </div>
            </div>
          )}

          {showProctorBadge && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline">Proctored Session</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
