import React from 'react';
import { Shield, Lock, EyeOff, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 space-y-8 text-slate-300">
      <div className="space-y-3 pb-6 border-b border-slate-800">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5" />
          <span>Crime Watch Governance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Privacy Policy & Confidentiality Notice
        </h1>
        <p className="text-sm text-slate-400">
          How Crime Watch collects, encrypts, and handles incident reporting data while protecting citizen privacy.
        </p>
      </div>

      {/* Realistic Confidentiality Disclaimer */}
      <div className="bg-amber-950/20 border border-amber-600/30 rounded-2xl p-5 text-xs text-amber-200 space-y-1.5">
        <div className="font-bold flex items-center gap-2 text-sm text-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          Notice on Legal & Technical Limitations
        </div>
        <p className="leading-relaxed">
          While Crime Watch enforces rigorous application-level data segregation, role-based access control (RBAC), and encryption protocols, no digital system can claim absolute confidentiality against valid court subpoenas, judicial warrants, or severe cyber threat vectors.
        </p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed">
        <section className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-400" />
            1. Information We Collect
          </h2>
          <p>Crime Watch collects information solely to facilitate community safety reporting and investigative workflows:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
            <li>
              <strong>Registered Reports:</strong> Name, verified email address, optional contact telephone number, incident timestamp, approximate location, incident narrative, and uploaded evidence attachments.
            </li>
            <li>
              <strong>Anonymous Reports:</strong> Incident description, date, time, location coordinates, category, and optional non-identifying media files. No IP addresses or account linkages are attached to the public record.
            </li>
          </ul>
        </section>

        <section className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-emerald-400" />
            2. Separation of Public and Confidential Data
          </h2>
          <p>Crime Watch enforces strict structural boundaries between public knowledge and active police case material:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-700">
              <strong className="text-emerald-400 block mb-1">Public Display Data:</strong>
              General crime category, broad municipal sector (district), date, and high-level case progress milestone.
            </div>
            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-700">
              <strong className="text-red-400 block mb-1">Strictly Restricted Data:</strong>
              Reporter identity, email, phone number, specific home addresses, internal detective notes, and sensitive evidence.
            </div>
          </div>
        </section>

        <section className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            3. AI Advisory Role & Data Handling
          </h2>
          <p>
            When reports are evaluated by the AI classification engine, narrative text is processed solely to extract category suggestions, confidence estimations, and priority urgency markers.
          </p>
          <p className="text-xs text-slate-400">
            AI classifications are strictly non-binding recommendations for human officers and cannot automatically convict, identify individuals as criminals, or reject submissions without human review.
          </p>
        </section>
      </div>
    </div>
  );
};
