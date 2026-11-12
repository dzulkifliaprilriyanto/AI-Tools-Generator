import React from 'react';
import { X, Lightbulb, MessageSquare, CheckCircle, ArrowRight, ExternalLink } from 'lucide-react';

interface BeginnerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BeginnerGuideModal: React.FC<BeginnerGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 sm:p-7 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Panduan Mudah untuk Pemula
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cara membuat AI Tool tanpa perlu mengerti bahasa pemrograman
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 3 Step Cards */}
        <div className="py-5 overflow-y-auto space-y-3.5">
          {/* Step 1 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/50">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white font-mono text-xs font-bold">
              1
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                Tulis Ide Anda dalam Bahasa Sehari-hari
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Ceritakan masalah yang ingin Anda selesaikan. Tidak perlu bahasa teknis. Contoh: <em>"Saya butuh alat pembuat draf balasan keluhan pembeli di WhatsApp."</em> Anda juga bisa memilih contoh siap pakai di layar beranda.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/50">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white font-mono text-xs font-bold">
              2
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                Pilih Rekomendasi Cerdas dari AI
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Sistem akan memandu Anda melalui 5-6 pertanyaan singkat. Setiap pertanyaan memiliki rekomendasi terbaik yang ditandai bintang hijau. Anda tinggal klik rekomendasi tersebut atau mengetik jawaban Anda sendiri.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/50">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white font-mono text-xs font-bold">
              3
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                Salin Master Prompt ke Google AI Studio
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Di akhir proses, Anda akan mendapatkan <strong>Master Prompt</strong> berstandar profesional. Klik tombol <strong>"Salin Seluruh Prompt"</strong>, lalu buka Google AI Studio Build dan tempelkan (Paste) di sana. Mesin AI Studio akan menyusun aplikasi untuk Anda!
              </p>
            </div>
          </div>

          {/* Tips Box */}
          <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
            <CheckCircle className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
            <div className="leading-relaxed">
              <strong>Tips Penting:</strong> Jawaban dan draf proyek Anda otomatis tersimpan di peramban ini. Anda bisa kembali ke langkah sebelumnya kapan saja tanpa takut data hilang.
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Mudah, cepat, dan 100% otomatis
          </span>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all"
          >
            <span>Saya Mengerti, Mulai Sekarang</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
