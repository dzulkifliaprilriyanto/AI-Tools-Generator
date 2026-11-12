import React, { useState } from 'react';
import { ValidationResult, ThemeStyle, ThemeColor } from '../types';
import {
  Copy,
  Check,
  Download,
  RefreshCw,
  Edit,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Code,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Sparkles,
} from 'lucide-react';

interface MasterPromptViewProps {
  projectName: string;
  prompt: string;
  validation: ValidationResult | null;
  onRegenerate: () => void;
  onEditRequirements: () => void;
  isRegenerating?: boolean;
  themeStyle?: ThemeStyle;
  themeColor?: ThemeColor;
}

export const MasterPromptView: React.FC<MasterPromptViewProps> = ({
  projectName,
  prompt,
  validation,
  onRegenerate,
  onEditRequirements,
  isRegenerating = false,
  themeColor = 'emerald',
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'formatted' | 'raw' | 'integration'>('formatted');
  const [showValidationDetails, setShowValidationDetails] = useState(false);

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleDownloadTxt = () => {
    const filename = `${projectName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_master_prompt.txt`;
    const blob = new Blob([prompt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getPrimaryButtonColor = () => {
    switch (themeColor) {
      case 'indigo':
        return 'bg-indigo-600 hover:bg-indigo-500 text-white';
      case 'monochrome':
        return 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border border-slate-700';
      case 'nordic':
        return 'bg-cyan-600 hover:bg-cyan-500 text-white';
      case 'emerald':
      default:
        return 'bg-emerald-600 hover:bg-emerald-500 text-white';
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1 tracking-wider uppercase">
            <FileText className="h-4 w-4" />
            <span>MASTER PROMPT SIAP PAKAI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {projectName}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Instruksi lengkap 17 seksi dengan koneksi otomatis ke Google Device, Gemini 3.8 Flash, dan Nano Banana.
          </p>
        </div>

        {/* Action Button Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopyPrompt}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-md hover:shadow-lg transition-all focus-visible:outline focus-visible:outline-2 whitespace-nowrap cursor-pointer ${getPrimaryButtonColor()}`}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span>Tersalin ke Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Salin Seluruh Prompt</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadTxt}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-colors whitespace-nowrap cursor-pointer shadow-sm"
            title="Unduh sebagai file .txt"
          >
            <Download className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Unduh TXT</span>
          </button>

          <button
            type="button"
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 disabled:opacity-50 transition-colors whitespace-nowrap cursor-pointer shadow-sm"
            title="Susun ulang prompt dengan variasi kalimat baru"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-slate-400 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{isRegenerating ? 'Menyusun...' : 'Susun Ulang'}</span>
          </button>

          <button
            type="button"
            onClick={onEditRequirements}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 px-3 py-2.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors whitespace-nowrap cursor-pointer shadow-sm"
          >
            <Edit className="h-3.5 w-3.5" />
            <span>Edit Kebutuhan</span>
          </button>
        </div>
      </div>

      {/* Auto-Integration Status Badge */}
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-950/20 p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
            ✓
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
              <span>Otomatis Terhubung: Akun Google Device + Gemini 3.8 Flash + Nano Banana API</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
              Instruksi teknis client token GIS dan server-side proxy telah disertakan lengkap di dalam Master Prompt.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('integration')}
          className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline shrink-0 self-start sm:self-auto cursor-pointer"
        >
          Lihat Rincian Integrasi API →
        </button>
      </div>

      {/* Guide Banner for Lay Users */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-5 mb-6 transition-colors shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0">
            <ExternalLink className="h-5 w-5" />
          </div>
          <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              Cara Menjalankannya di Google AI Studio (3 Langkah Praktis):
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-300 mt-1">
              <li>Klik tombol <strong>"Salin Seluruh Prompt"</strong> di bagian atas.</li>
              <li>Buka halaman <strong>Google AI Studio Build</strong> di tab baru peramban Anda.</li>
              <li>Tempelkan (<strong>Ctrl+V</strong> atau <strong>Cmd+V</strong>) ke dalam kotak input AI Studio, lalu tekan Enter. AI Studio akan membaca spesifikasi dan langsung membangun aplikasi lengkap!</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Quality Validator Bar */}
      {validation && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-4 sm:p-5 shadow-sm dark:shadow-md mb-6 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl border shrink-0 ${
                  validation.isValid
                    ? 'border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                }`}
              >
                {validation.isValid ? (
                  <ShieldCheck className="h-5 w-5" />
                ) : (
                  <AlertTriangle className="h-5 w-5" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Skor Kualitas Arsitektur Master Prompt
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {validation.overallScore}/100
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                  {validation.summary}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowValidationDetails(!showValidationDetails)}
              className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-semibold self-start sm:self-auto shrink-0 cursor-pointer"
            >
              <span>{showValidationDetails ? 'Sembunyikan Poin Uji' : 'Lihat 8 Poin Cek Kualitas'}</span>
              {showValidationDetails ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          </div>

          {/* Expanded Checks List */}
          {showValidationDetails && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {validation.checks.map((check) => (
                  <div
                    key={check.id}
                    className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/50 text-xs"
                  >
                    <div className="mt-0.5 shrink-0">
                      {check.passed ? (
                        <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">
                        {check.label}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px] leading-snug">
                        {check.note}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('formatted')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'formatted'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Tampilan Rapi</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('integration')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'integration'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Koneksi Google & Nano Banana</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('raw')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'raw'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Code className="h-3.5 w-3.5" />
            <span>Teks Mentah (Raw)</span>
          </button>
        </div>

        <div className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
          {prompt.split(/\s+/).length} Kata · {prompt.length} Karakter
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'integration' ? (
        <div className="rounded-2xl border border-emerald-500/30 bg-white dark:bg-[#0F172A] p-6 shadow-sm mb-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Spesifikasi Otomatis API Google Device & Nano Banana
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Prompt yang dihasilkan secara otomatis menyertakan instruksi teknis untuk mengaktifkan konektivitas akun Google pengguna serta model kecerdasan buatan visual:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
              <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" />
                1. Google Device Account & One-Tap Sign-In
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Mendeteksi sesi akun Google di peramban pengguna melalui Google Identity Services (GIS), memungkinkan penyimpanan profil pengguna dan sinkronisasi tanpa registrasi manual.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
              <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                2. Google Gemini 3.8 Flash AI
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Menjalankan penalaran bahasa, ekstraksi poin, sintesis data, dan pembuatan rekomendasi melalui SDK resmi @google/genai di sisi server (Server-Side).
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
              <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-1 flex items-center gap-1.5">
                <span className="text-sm">🍌</span>
                3. Nano Banana 2.1 Asset Generator
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Model generasi visual terarah untuk merender aset grafis, ikon antarmuka, avatar, dan banner promosi secara otomatis untuk tool yang dibuat.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
              <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1.5">
                <span>📱</span>
                4. Local Device Hardware APIs
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Memanfaatkan API lokal perangkat: Clipboard API (salin 1 klik), Web Share API (bagikan langsung ke WhatsApp/Email di ponsel), dan Offline Storage.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 sm:p-8 shadow-sm dark:shadow-2xl overflow-hidden transition-colors">
          {activeTab === 'formatted' ? (
            <div className="text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans selection:bg-emerald-500 selection:text-white">
              {prompt}
            </div>
          ) : (
            <pre className="font-mono text-xs text-slate-800 dark:text-slate-300 leading-relaxed overflow-x-auto whitespace-pre p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 selection:bg-emerald-500 selection:text-white">
              {prompt}
            </pre>
          )}
        </div>
      )}

      {/* Bottom Floating Copy Reminder */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Tip: Prompt ini dapat Anda simpan sebagai file TXT untuk dokumentasi proyek Anda.
        </span>

        <button
          type="button"
          onClick={handleCopyPrompt}
          className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold shadow-md hover:shadow-lg transition-all focus-visible:outline focus-visible:outline-2 cursor-pointer w-full sm:w-auto justify-center ${getPrimaryButtonColor()}`}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              <span>Tersalin ke Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Salin Seluruh Master Prompt</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
