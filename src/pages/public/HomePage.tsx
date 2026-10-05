import React from 'react';
import {
  Shield,
  FileText,
  Search,
  MapPin,
  Lock,
  Cpu,
  EyeOff,
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Clock,
  PhoneCall,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '../../context/NavigationContext';
import { useData } from '../../context/DataContext';

export const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const { navigateTo } = useNavigation();
  const { reports } = useData();

  const resolvedCount = reports.filter((r) => r.status === 'Resolved').length;

  return (
    <div className="space-y-16 py-6 sm:py-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-800/90 via-slate-900 to-slate-950 border border-slate-700/80 p-8 sm:p-14 lg:p-20 shadow-2xl">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold tracking-wide uppercase">
            <Shield className="w-3.5 h-3.5" />
            <span>Community Safety & Crime Reporting System</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            {t.hero.heading}
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            {t.hero.subheading}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <button
              onClick={() => navigateTo('report')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center space-x-2 group cursor-pointer"
            >
              <FileText className="w-5 h-5 text-blue-100 group-hover:scale-110 transition-transform" />
              <span>{t.hero.reportButton}</span>
              <ArrowRight className="w-4 h-4 ml-1 opacity-80 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigateTo('track')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold text-base transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Search className="w-5 h-5 text-slate-400" />
              <span>{t.hero.trackButton}</span>
            </button>

            <button
              onClick={() => navigateTo('map')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold text-base transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <MapPin className="w-5 h-5 text-indigo-400" />
              <span>{t.hero.mapButton}</span>
            </button>
          </div>

          {/* Key Trust Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 border-t border-slate-800">
            <div className="flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>256-Bit Encrypted Reports</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <EyeOff className="w-4 h-4 text-blue-400" />
              <span>100% Anonymous Mode Supported</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>Gemini AI-Assisted Classification</span>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Notice Banner */}
      <section className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-6 sm:p-7 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-amber-200">{t.common.safetyNoticeTitle}</h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                {t.hero.emergencyNotice}
              </p>
            </div>
          </div>
          <div className="shrink-0 w-full sm:w-auto">
            <a
              href="tel:112"
              className="inline-flex w-full sm:w-auto items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-md transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{t.hero.emergencyCall}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Designed for Citizens, Law Enforcement, and Administrators
          </h2>
          <p className="text-sm text-slate-400">
            A cohesive platform balancing public safety transparency with strict investigative privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Secure Crime Reporting */}
          <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl shadow-lg hover:border-slate-600 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">{t.features.secureTitle}</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{t.features.secureDesc}</p>
          </div>

          {/* 2. Anonymous Reporting */}
          <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl shadow-lg hover:border-slate-600 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <EyeOff className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">{t.features.anonymousTitle}</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{t.features.anonymousDesc}</p>
          </div>

          {/* 3. AI-Assisted Analysis */}
          <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl shadow-lg hover:border-slate-600 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">{t.features.aiTitle}</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{t.features.aiDesc}</p>
          </div>

          {/* 4. Case Tracking */}
          <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl shadow-lg hover:border-slate-600 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">{t.features.trackingTitle}</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{t.features.trackingDesc}</p>
          </div>

          {/* 5. Crime Map */}
          <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl shadow-lg hover:border-slate-600 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">{t.features.mapTitle}</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{t.features.mapDesc}</p>
          </div>

          {/* 6. Community Safety */}
          <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl shadow-lg hover:border-slate-600 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">{t.features.safetyTitle}</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{t.features.safetyDesc}</p>
          </div>
        </div>
      </section>

      {/* System Metrics Banner */}
      <section className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 sm:p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-extrabold text-white">{reports.length}</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
              Reports Logged
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-blue-400">100%</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
              AI Processed
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-emerald-400">{resolvedCount}</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
              Resolved Cases
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-purple-400">24 / 7</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
              System Availability
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
