import React, { useState } from 'react';
import { X, Key, Shield, Check, Info } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, onSave, currentSettings }) {
  const [githubToken, setGithubToken] = useState(currentSettings.githubToken || '');
  const [aiApiKey, setAiApiKey] = useState(currentSettings.aiApiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSave({
      githubToken: githubToken.trim(),
      aiApiKey: aiApiKey.trim(),
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setGithubToken('');
    setAiApiKey('');
    onSave({ githubToken: '', aiApiKey: '' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-bold text-white">API & Token Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              GitHub Personal Access Token (Optional)
            </label>
            <input
              type="password"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <Info className="w-3 h-3 text-slate-500 shrink-0" />
              Bypasses GitHub's 60 req/hr unauthenticated limit up to 5,000 req/hr.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Google Gemini API Key (Optional)
            </label>
            <input
              type="password"
              value={aiApiKey}
              onChange={(e) => setAiApiKey(e.target.value)}
              placeholder="AIzaSyxxxxxxxxxxxxxxxxxxxx"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <Info className="w-3 h-3 text-slate-500 shrink-0" />
              Not required! Our built-in dynamic engine generates roasts even without a key.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Keys are stored strictly in your local browser storage and never saved to a database.</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-slate-500 hover:text-slate-300 underline"
            >
              Clear saved keys
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 shadow-md transition-all"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Settings</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
