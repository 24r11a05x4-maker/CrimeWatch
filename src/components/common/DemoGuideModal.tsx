import React, { useState } from 'react';
import {
  HelpCircle,
  X,
  User,
  Shield,
  Search,
  MapPin,
  Lock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { useData } from '../../context/DataContext';

export const DemoGuideModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { demoLogin, currentUser } = useAuth();
  const { navigateTo, setTrackRefQuery, setSelectedReportId } = useNavigation();
  const { reports } = useData();

  const latestReport = reports[0]; // Most recent report

  const handleRunDemo = (demoNumber: number) => {
    switch (demoNumber) {
      case 1:
        // Citizen report submission
        demoLogin('Citizen');
        navigateTo('report');
        break;
      case 2:
        // AI Classification inspection
        demoLogin('Police Officer');
        if (latestReport) {
          setSelectedReportId(latestReport.id);
          navigateTo('police-detail', latestReport.id);
        } else {
          navigateTo('police-cases');
        }
        break;
      case 3:
        // Police case management
        demoLogin('Police Officer');
        if (latestReport) {
          setSelectedReportId(latestReport.id);
          navigateTo('police-detail', latestReport.id);
        } else {
          navigateTo('police-cases');
        }
        break;
      case 4:
        // Citizen Tracking
        if (latestReport) {
          setTrackRefQuery(latestReport.referenceId);
        }
        navigateTo('track');
        break;
      case 5:
        // Crime Map & Analytics
        navigateTo('map');
        break;
      case 6:
        // Admin & Security Audit
        demoLogin('Administrator');
        navigateTo('admin-dashboard');
        break;
      default:
        break;
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-2xl border border-blue-400/40 text-xs font-bold transition-all transform hover:scale-105 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-blue-200" />
          <span>Evaluation Demo Guide (6 Workflows)</span>
        </button>
      ) : (
        <div className="w-[360px] sm:w-[420px] bg-slate-900/98 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 text-slate-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900/60 to-indigo-900/60 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <h3 className="font-bold text-sm text-white">Crime Watch Demo Guide</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body with 6 Interactive Demos */}
          <div className="p-4 space-y-2.5 max-h-[70vh] overflow-y-auto text-xs">
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Crime Watch implements the complete interconnected SRS workflow across a single shared data store. Click any workflow below to test:
            </p>

            {/* Demo 1 */}
            <div className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl space-y-1.5 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-[11px] flex items-center justify-center text-white">1</span>
                  Citizen Report Submission
                </span>
                <button
                  onClick={() => handleRunDemo(1)}
                  className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] cursor-pointer"
                >
                  Start Demo 1
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Log in as Ananya Reddy (Citizen) → choose Registered or Anonymous → submit report with location & evidence → receive Reference ID (e.g., CW-2026-0001).
              </p>
            </div>

            {/* Demo 2 */}
            <div className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl space-y-1.5 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-purple-600 text-[11px] flex items-center justify-center text-white">2</span>
                  AI Crime Classification
                </span>
                <button
                  onClick={() => handleRunDemo(2)}
                  className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-semibold text-[11px] cursor-pointer"
                >
                  View AI Demo
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Inspect real-time Gemini AI category extraction, confidence score, reasoning, urgency flag, and human review recommendation.
              </p>
            </div>

            {/* Demo 3 */}
            <div className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl space-y-1.5 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-[11px] flex items-center justify-center text-white">3</span>
                  Police Case Management
                </span>
                <button
                  onClick={() => handleRunDemo(3)}
                  className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] cursor-pointer"
                >
                  Test Police Flow
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Log in as Sub-Inspector Arjun Rao → open case file → review AI suggestion → update status to "Investigation in Progress" → append internal police note.
              </p>
            </div>

            {/* Demo 4 */}
            <div className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl space-y-1.5 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-[11px] flex items-center justify-center text-white">4</span>
                  Citizen Status Tracking
                </span>
                <button
                  onClick={() => handleRunDemo(4)}
                  className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] cursor-pointer"
                >
                  Track Latest Ref
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Track reference ID ({latestReport ? latestReport.referenceId : 'CW-2026-0001'}) → observe updated status milestone. Verify police internal notes are strictly hidden.
              </p>
            </div>

            {/* Demo 5 */}
            <div className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl space-y-1.5 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-600 text-[11px] flex items-center justify-center text-white">5</span>
                  Crime Map & Analytics
                </span>
                <button
                  onClick={() => handleRunDemo(5)}
                  className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-[11px] cursor-pointer"
                >
                  Open Map/Charts
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                View geolocated pin on interactive Leaflet map with category/date filters. Open analytics to verify dynamic report statistics.
              </p>
            </div>

            {/* Demo 6 */}
            <div className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl space-y-1.5 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-[11px] flex items-center justify-center text-white">6</span>
                  Admin & Security Audit
                </span>
                <button
                  onClick={() => handleRunDemo(6)}
                  className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold text-[11px] cursor-pointer"
                >
                  Admin Console
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Log in as Joint Commissioner Priya Nair (Admin) → manage user statuses/roles → review master JSON export → inspect tamper-evident audit logs.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
