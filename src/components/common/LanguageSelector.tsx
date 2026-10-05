import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageCode } from '../../types';
import { Globe } from 'lucide-react';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  ];

  return (
    <div className="relative inline-flex items-center">
      <Globe className="w-4 h-4 text-slate-400 absolute left-2.5 pointer-events-none" />
      <select
        value={language}
        aria-label="Select language"
        onChange={(e) => setLanguage(e.target.value as LanguageCode)}
        className="appearance-none bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium pl-8 pr-7 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer transition-colors"
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code}>
            {l.native}
          </option>
        ))}
      </select>
      <div className="absolute right-2.5 pointer-events-none text-slate-400 text-[10px]">▼</div>
    </div>
  );
};
