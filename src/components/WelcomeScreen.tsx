import React, { useState } from 'react';
import { ArrowRight, Lightbulb, Terminal, Layers, ShieldCheck, Zap, Sparkles, HelpCircle, Palette, Smartphone, CheckCircle } from 'lucide-react';
import { ThemeStyle, ThemeColor, ThemeFont } from '../types';

interface WelcomeScreenProps {
  initialIdea: string;
  onStartAnalysis: (idea: string) => void;
  onOpenGuide?: () => void;
  onOpenCustomizer?: () => void;
  isLoading?: boolean;
  themeStyle?: ThemeStyle;
  themeColor?: ThemeColor;
  themeFont?: ThemeFont;
}

const EXAMPLE_IDEAS = [
  {
    title: 'Analisis Sentimen Ulasan Toko Online',
    description: 'Aplikasi pembaca ulasan pembeli otomatis yang mengelompokkan keluhan pengiriman atau barang rusak, lalu membuat draf balasan sopan.',
    category: 'E-Commerce & Toko Online',
    tag: 'Sangat Populer',
  },
  {
    title: 'Generator Konten Media Sosial Multi-Format',
    description: 'Alat peracik ide dan draf postingan untuk Instagram, LinkedIn, dan X yang disesuaikan dengan nada bicara merek dan target pembeli.',
    category: 'Pemasaran & Konten',
    tag: 'Praktis',
  },
  {
    title: 'Sistem Evaluasi Esai Siswa Berdasarkan Rubrik',
    description: 'Aplikasi penilaian tulisan siswa yang memberikan umpan balik konstruktif, skor per kriteria rubrik, dan saran perbaikan langsung.',
    category: 'Pendidikan & Akademik',
    tag: 'Edukasi',
  },
  {
    title: 'Asisten Pembuat SOP Operasional Bisnis UMKM',
    description: 'Generator Standard Operating Procedure (SOP) terstruktur dari catatan alur kerja kasar toko, kafe, atau usaha rumahan.',
    category: 'Operasional Bisnis',
    tag: 'Efisiensi',
  },
  {
    title: 'Estimator Biaya & Ruang Lingkup Proyek Jasa',
    description: 'Kalkulator pintar yang menguraikan rincian pekerjaan, memperkirakan waktu pengerjaan, dan menghasilkan penawaran harga rapi.',
    category: 'Freelance & Agensi',
    tag: 'Keuangan',
  },
  {
    title: 'Generator Aset Grafis & Ikon dengan Nano Banana',
    description: 'Alat perancang otomatis ikon antarmuka dan aset visual AI Studio yang terhubung ke model Gemini Nano Banana 2.1.',
    category: 'Desain & Grafis AI',
    tag: 'Kreatif',
  },
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  initialIdea,
  onStartAnalysis,
  onOpenGuide,
  onOpenCustomizer,
  isLoading = false,
  themeStyle = 'minimal',
  themeColor = 'emerald',
}) => {
  const [idea, setIdea] = useState(initialIdea);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) {
      setErrorMsg('Tuliskan ide aplikasi AI Anda terlebih dahulu.');
      return;
    }
    if (idea.trim().length < 5) {
      setErrorMsg('Tuliskan sedikit lebih jelas agar AI memahaminya (minimal 5 karakter).');
      return;
    }
    setErrorMsg('');
    onStartAnalysis(idea.trim());
  };

  const handleSelectExample = (exampleDesc: string) => {
    setIdea(exampleDesc);
    setErrorMsg('');
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
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Top Subtle Pill/Kicker */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-3 tracking-wide">
          <Zap className="h-3.5 w-3.5" />
          <span>KLICK ASSETS GENERATOR · AI TOOL BUILDER</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 [text-wrap:balance]">
          Ubah Ide Menjadi AI Tools Profesional
        </h1>

        <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed [text-wrap:balance]">
          Panduan cerdas bertahap untuk menyusun Master Prompt siap pakai di Google AI Studio. Cukup ceritakan kebutuhan Anda, biarkan AI merancang spesifikasi lengkap dan menghubungkannya otomatis ke API Google Device Anda.
        </p>

        {/* Action helper bar */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs">
          {onOpenGuide && (
            <button
              type="button"
              onClick={onOpenGuide}
              className="inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400 hover:underline transition-colors cursor-pointer"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Panduan 3 Langkah Mudah</span>
            </button>
          )}

          {onOpenCustomizer && (
            <>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <button
                type="button"
                onClick={onOpenCustomizer}
                className="inline-flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <Palette className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Kustomisasi Gaya & Warna</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 5-Step Progress Overview */}
      <div className="mb-8 p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
          <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
            Alur Pembuatan Bertahap (Step-by-Step Workflow)
          </span>
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            Terhubung Google Device & Nano Banana
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-semibold">LANGKAH 1</div>
            <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">Tulis Ide</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-semibold">LANGKAH 2</div>
            <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">Analisis Gemini</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-semibold">LANGKAH 3</div>
            <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">Pertanyaan Adaptif</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-semibold">LANGKAH 4</div>
            <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">Tinjau Spesifikasi</div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 col-span-2 sm:col-span-1">
            <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-500 font-bold">LANGKAH 5</div>
            <div className="font-bold text-emerald-800 dark:text-emerald-300 mt-0.5">Master Prompt</div>
          </div>
        </div>
      </div>

      {/* Main Idea Input Form */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 sm:p-8 shadow-sm dark:shadow-xl mb-8 transition-colors">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="idea-input" className="block text-sm font-bold text-slate-800 dark:text-slate-100">
              Ceritakan ide alat atau aplikasi AI yang ingin Anda buat
            </label>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Bahasa Indonesia sehari-hari
            </span>
          </div>

          <div className="relative mb-3">
            <textarea
              id="idea-input"
              rows={4}
              value={idea}
              onChange={(e) => {
                setIdea(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Contoh: Saya ingin aplikasi web untuk membaca ulasan pembeli di toko saya, mengelompokkan keluhan barang rusak atau pengiriman lama, lalu membuat draf balasan sopan otomatis untuk admin dan terhubung dengan akun Google di perangkat saya..."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/90 px-4 py-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all resize-y min-h-[120px]"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {errorMsg ? (
                <span className="text-rose-600 dark:text-rose-400 font-semibold">{errorMsg}</span>
              ) : (
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Otomatis dihubungkan ke Google Device, Gemini 3.8 Flash & Nano Banana</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !idea.trim()}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold shadow-md hover:shadow-lg transition-all focus-visible:outline focus-visible:outline-2 shrink-0 cursor-pointer ${getPrimaryButtonColor()} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Menganalisis Ide...</span>
                </>
              ) : (
                <>
                  <span>Mulai Buat AI Tool</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Suggested Example Ideas (Clean unboxed metadata) */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wider uppercase">
            <Lightbulb className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Pilih Contoh Ide Siap Pakai:</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
            Klik kartu untuk mengisi formulir
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {EXAMPLE_IDEAS.map((ex, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectExample(ex.description)}
              className="group text-left p-4.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-emerald-500/40 dark:hover:border-slate-700 transition-all cursor-pointer shadow-sm hover:shadow"
            >
              {/* Unboxed Metadata (Zero-Pill Discipline) */}
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">{ex.category}</span>
                <span aria-hidden="true">·</span>
                <span>{ex.tag}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-1">
                {ex.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {ex.description}
              </p>

              <div className="mt-2.5 flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                <span>Gunakan ide ini</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Trust & Workflow Badges */}
      <div className="border-t border-slate-200 dark:border-slate-800/80 pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700/50 shrink-0">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 mb-0.5">Pertanyaan Adaptif</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                5–7 pertanyaan relevan sesuai industri alat Anda tanpa istilah teknis rumit.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700/50 shrink-0">
              <Terminal className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 mb-0.5">Master Prompt 17 Seksi</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Spesifikasi terstruktur yang langsung dieksekusi oleh Google AI Studio.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700/50 shrink-0">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 mb-0.5">Privasi Lokal</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Proyek dan riwayat tersimpan aman di peramban lokal perangkat Anda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
