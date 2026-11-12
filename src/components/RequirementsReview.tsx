import React, { useState } from 'react';
import { ProjectState, ThemeStyle, ThemeColor, ThemeFont } from '../types';
import { Sparkles, ArrowLeft, ArrowRight, CheckCircle2, HelpCircle, Edit2, Check, Plus, Trash2, Info, Palette, Smartphone } from 'lucide-react';

interface RequirementsReviewProps {
  project: ProjectState;
  onUpdateProject: (updated: Partial<ProjectState>) => void;
  onGeneratePrompt: () => void;
  onBackToQuestions: () => void;
  onJumpToQuestion: (index: number) => void;
  isGeneratingPrompt?: boolean;
  themeStyle?: ThemeStyle;
  themeColor?: ThemeColor;
  themeFont?: ThemeFont;
  onOpenCustomizer?: () => void;
}

export const RequirementsReview: React.FC<RequirementsReviewProps> = ({
  project,
  onUpdateProject,
  onGeneratePrompt,
  onBackToQuestions,
  onJumpToQuestion,
  isGeneratingPrompt = false,
  themeStyle = 'minimal',
  themeColor = 'emerald',
  themeFont = 'jakarta',
  onOpenCustomizer,
}) => {
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [name, setName] = useState(project.projectName || 'AI Productivity Suite');
  const [purpose, setPurpose] = useState(project.purpose || '');
  const [newFeatureText, setNewFeatureText] = useState('');
  const [features, setFeatures] = useState<string[]>(
    project.suggestedFeatures.length > 0
      ? project.suggestedFeatures
      : ['Input teks cerdas dengan validasi', 'Pemrosesan model Gemini 3.8 Flash', 'Ekspor hasil TXT/Salin']
  );

  const handleSaveMeta = () => {
    onUpdateProject({
      projectName: name,
      purpose: purpose,
      suggestedFeatures: features,
      confirmedRequirements: {
        ...project.confirmedRequirements,
        toolName: name,
        purpose: purpose,
        coreFeatures: features,
      },
    });
    setIsEditingMeta(false);
  };

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    const updated = [...features, newFeatureText.trim()];
    setFeatures(updated);
    setNewFeatureText('');
    onUpdateProject({
      suggestedFeatures: updated,
      confirmedRequirements: {
        ...project.confirmedRequirements,
        coreFeatures: updated,
      },
    });
  };

  const handleRemoveFeature = (idx: number) => {
    const updated = features.filter((_, i) => i !== idx);
    setFeatures(updated);
    onUpdateProject({
      suggestedFeatures: updated,
      confirmedRequirements: {
        ...project.confirmedRequirements,
        coreFeatures: updated,
      },
    });
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
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1 tracking-wider uppercase">
            <CheckCircle2 className="h-4 w-4" />
            <span>TINJAUAN & SPESIFIKASI AKHIR</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Ringkasan Rencana AI Tool
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Periksa seluruh kebutuhan terkonfirmasi. Jika sudah sesuai, klik tombol di bawah untuk menghasilkan Master Prompt.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onOpenCustomizer && (
            <button
              type="button"
              onClick={onOpenCustomizer}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-sm"
            >
              <Palette className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Ganti Tema</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (isEditingMeta) handleSaveMeta();
              else setIsEditingMeta(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 transition-colors shrink-0 cursor-pointer shadow-sm"
          >
            {isEditingMeta ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Simpan Perubahan</span>
              </>
            ) : (
              <>
                <Edit2 className="h-3.5 w-3.5" />
                <span>Ubah Nama & Tujuan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Identity Box */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 shadow-sm dark:shadow-md mb-6 transition-colors">
        {isEditingMeta ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Nama Aplikasi AI
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Tujuan Utama
              </label>
              <textarea
                rows={2}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none resize-y"
              />
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Identitas Produk
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Kategori: {project.category || 'Produktivitas & AI'}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {project.projectName || name}
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {project.purpose || purpose}
            </p>
          </div>
        )}
      </div>

      {/* Google Device & Nano Banana Auto-Wiring Card */}
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-6 shadow-sm mb-6 relative">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
              G
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-emerald-300 flex items-center gap-2">
                <span>Integrasi Otomatis: API Google Device, Gemini & Nano Banana</span>
                <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.2 rounded-full font-semibold">
                  Tersambung
                </span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Master Prompt otomatis menyertakan instruksi integrasi langsung tanpa konfigurasi manual rumit.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-emerald-500/20">
            <div className="font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Google Device Sign-In</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Autentikasi akun Google yang terpasang di perangkat pengguna via One-Tap client token.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-emerald-500/20">
            <div className="font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Gemini 3.8 Flash AI</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Mesin reasoning dan pemrosesan data berbasis server-side proxy yang aman.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-emerald-500/20">
            <div className="font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
              <span className="text-sm">🍌</span>
              <span>Nano Banana 2.1 Assets</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Pembuatan aset visual, grafis antarmuka, dan ikon otomatis via model Nano Banana.
            </p>
          </div>
        </div>
      </div>

      {/* Selected UI Design Theme Banner */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-4.5 shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
            <Palette className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              Spesifikasi Desain UI yang Akan Disuntikkan ke Master Prompt:
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 capitalize mt-0.5">
              Gaya: <strong className="text-slate-800 dark:text-slate-200">{themeStyle}</strong> · Warna: <strong className="text-slate-800 dark:text-slate-200">{themeColor}</strong> · Font: <strong className="text-slate-800 dark:text-slate-200">{themeFont}</strong>
            </div>
          </div>
        </div>

        {onOpenCustomizer && (
          <button
            type="button"
            onClick={onOpenCustomizer}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0"
          >
            Ubah Pilihan Desain →
          </button>
        )}
      </div>

      {/* Confirmed Requirements from Questions */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 shadow-sm dark:shadow-md mb-6 transition-colors">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Kebutuhan yang Sudah Anda Konfirmasi
            </h3>
          </div>
          <span className="text-xs text-emerald-700 dark:text-emerald-400 font-mono font-semibold">
            {project.answers.length} Pertanyaan Terjawab
          </span>
        </div>

        {project.answers.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 italic">
            Belum ada pertanyaan yang dijawab. Menggunakan setelan standar yang disarankan.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {project.answers.map((ans, idx) => (
              <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    {ans.questionTitle}
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {ans.answerText}
                  </div>
                  {ans.recommendedReason && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Alasan: {ans.recommendedReason}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onJumpToQuestion(idx)}
                  className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-bold self-start sm:self-center px-2 py-1 rounded hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Edit2 className="h-3 w-3" />
                  <span>Ubah</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Core Features List (Editable) */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 shadow-sm dark:shadow-md mb-6 transition-colors">
        <div className="flex items-center justify-between gap-2 mb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Daftar Fitur yang Akan Dibuat
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
            {features.length} Fitur
          </span>
        </div>

        <ul className="space-y-2.5 mb-4">
          {features.map((feat, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 text-xs text-slate-800 dark:text-slate-200"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-emerald-100 dark:bg-slate-800 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                  {idx + 1}
                </span>
                <span className="leading-snug font-medium">{feat}</span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveFeature(idx)}
                className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors p-1"
                title="Hapus fitur ini"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>

        {/* Add Feature input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ketik fitur tambahan di sini (misal: 'Dukungan ekspor ke file Excel/CSV')..."
            value={newFeatureText}
            onChange={(e) => setNewFeatureText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddFeature();
              }
            }}
            className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddFeature}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Tambah</span>
          </button>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800 pt-6">
        <button
          type="button"
          onClick={onBackToQuestions}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Pertanyaan</span>
        </button>

        <button
          type="button"
          onClick={onGeneratePrompt}
          disabled={isGeneratingPrompt}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3 text-sm font-bold shadow-md hover:shadow-lg transition-all focus-visible:outline focus-visible:outline-2 cursor-pointer ${getPrimaryButtonColor()} disabled:opacity-50`}
        >
          {isGeneratingPrompt ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Menyusun Master Prompt...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Hasilkan Master Prompt Sekarang</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
