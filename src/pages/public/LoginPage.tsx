import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, UserCheck, Key, AlertCircle, Info, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const { login, demoLogin } = useAuth();
  const { navigateTo } = useNavigation();

  const [email, setEmail] = useState('ananya@crimewatch.demo');
  const [password, setPassword] = useState('••••••••');
  const [role, setRole] = useState<UserRole>('Citizen');
  const [error, setError] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = login(email, role);
    if (!result.success) {
      setError(result.error || 'Failed to authenticate.');
      return;
    }

    // Route to appropriate role dashboard
    if (role === 'Citizen') navigateTo('citizen-overview');
    else if (role === 'Police Officer') navigateTo('police-dashboard');
    else if (role === 'Administrator') navigateTo('admin-dashboard');
  };

  const handleQuickDemo = (targetRole: UserRole) => {
    demoLogin(targetRole);
    if (targetRole === 'Citizen') navigateTo('citizen-overview');
    else if (targetRole === 'Police Officer') navigateTo('police-dashboard');
    else if (targetRole === 'Administrator') navigateTo('admin-dashboard');
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-14 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center mx-auto text-blue-400 mb-3">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Log in to Crime Watch</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Enter your authorized credentials or select an academic demo profile below.
        </p>
      </div>

      {/* Demo Switcher Quick Buttons */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-xl space-y-2.5">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Quick Demo Access (1-Click)</span>
          <span className="text-[10px] text-blue-400 font-mono">Academic Preview</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemo('Citizen')}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-blue-600/20 hover:border-blue-500/40 border border-slate-700 text-left transition-all group"
          >
            <span className="block text-xs font-bold text-white group-hover:text-blue-300">Citizen</span>
            <span className="block text-[10px] text-slate-400 truncate">Ananya Reddy</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('Police Officer')}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-blue-600/20 hover:border-blue-500/40 border border-slate-700 text-left transition-all group"
          >
            <span className="block text-xs font-bold text-white group-hover:text-blue-300">Police</span>
            <span className="block text-[10px] text-slate-400 truncate">SI Arjun Rao</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('Administrator')}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-blue-600/20 hover:border-blue-500/40 border border-slate-700 text-left transition-all group"
          >
            <span className="block text-xs font-bold text-white group-hover:text-blue-300">Admin</span>
            <span className="block text-[10px] text-slate-400 truncate">Joint Comm. Priya Nair</span>
          </button>
        </div>
      </div>

      {/* Login Form */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-5">
        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Access Role *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Citizen', 'Police Officer', 'Administrator'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRole(r);
                    if (r === 'Citizen') setEmail('ananya@crimewatch.demo');
                    else if (r === 'Police Officer') setEmail('police@crimewatch.demo');
                    else if (r === 'Administrator') setEmail('admin@crimewatch.demo');
                  }}
                  className={`py-2 px-1 text-center text-xs font-medium rounded-lg border transition-all ${
                    role === r
                      ? 'bg-blue-600 border-blue-500 text-white font-semibold shadow-md'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {r.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@crimewatch.demo"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Password *
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-900/40 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Log In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-700/60 text-center">
          <p className="text-xs text-slate-400">
            Don't have a citizen account?{' '}
            <button
              onClick={() => navigateTo('register')}
              className="text-blue-400 hover:text-blue-300 font-semibold"
            >
              Register here
            </button>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Reset Account Password</h3>
            {forgotSent ? (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 rounded-xl">
                  Password reset link dispatched to <strong>{forgotEmail}</strong>. (Simulated)
                </div>
                <button
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSent(false);
                  }}
                  className="w-full py-2 bg-slate-700 hover:bg-slate-650 text-white rounded-xl text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  Enter your email address to receive password reset instructions.
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (forgotEmail) setForgotSent(true);
                    }}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs text-white font-semibold"
                  >
                    Send Reset Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
