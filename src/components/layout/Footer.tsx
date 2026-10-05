import React from 'react';
import { Shield, AlertCircle, Phone, Lock, HeartHandshake } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '../../context/NavigationContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const { navigateTo } = useNavigation();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      {/* Emergency Alert Banner */}
      <div className="bg-red-950/40 border-b border-red-900/40 px-4 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center space-x-2.5 text-red-300 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>
              <strong>Emergency Notice:</strong> Crime Watch is an academic incident reporting system. It is <strong>NOT</strong> an emergency dispatch service. For life-threatening emergencies or in-progress crimes, immediately dial <strong>112 / 100</strong>.
            </span>
          </div>
          <div className="shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 text-red-300 border border-red-500/40 font-semibold text-xs tracking-wide">
              <Phone className="w-3.5 h-3.5 text-red-400" />
              Emergency Helpline: 112 / 100
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white">Crime Watch</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              An academic Software Engineering prototype for AI-assisted community safety, crime reporting, and transparent case workflows.
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Confidentiality & Role Protections Enforced</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Citizen Actions
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigateTo('report')} className="hover:text-white transition-colors">
                  {t.nav.reportCrime}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('track')} className="hover:text-white transition-colors">
                  {t.nav.trackReport}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('map')} className="hover:text-white transition-colors">
                  {t.nav.crimeMap}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy & Confidentiality
                </button>
              </li>
            </ul>
          </div>

          {/* Authorized Portals */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Role Access
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigateTo('login')} className="hover:text-white transition-colors">
                  Citizen Portal
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('login')} className="hover:text-white transition-colors">
                  Police Department Access
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('login')} className="hover:text-white transition-colors">
                  System Administration
                </button>
              </li>
              <li>
                <span className="text-slate-500">Security Clearance Required</span>
              </li>
            </ul>
          </div>

          {/* Safety Principles */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              AI Safety Principles
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-2">
              Crime Watch utilizes AI strictly as advisory assistance for preliminary category suggestion.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div>• Cannot determine guilt or innocence</div>
              <div>• Cannot automatically dismiss reports</div>
              <div>• Human officer review required for low confidence</div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Crime Watch. Academic Software Engineering Prototype.</p>
          <div className="flex items-center space-x-6">
            <button onClick={() => navigateTo('privacy')} className="hover:text-slate-300">
              Privacy Policy
            </button>
            <button onClick={() => navigateTo('map')} className="hover:text-slate-300">
              Public Map
            </button>
            <span className="text-slate-600">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
