import React from 'react';
import { AIAnalysisResult } from '../types';
import { ArrowRight, ArrowLeft, CheckCircle2, HelpCircle, Sparkles, Users, Cpu, FileQuestion, Info } from 'lucide-react';

interface AnalysisScreenProps {
  analysis: AIAnalysisResult;
  originalIdea: string;
  onProceedToQuestions: () => void;
  onEditIdea: () => void;
  isLoadingNext?: boolean;
}

export const AnalysisScreen: React.FC<AnalysisScreenProps> = ({
  analysis,
  originalIdea,
  onProceedToQuestions,
  onEditIdea,
  isLoadingNext = false,
}) => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Banner / Heading */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2 uppercase tracking-wider">
          <Sparkles className="h-4 w-4" />
          <span>HASIL ANALISIS AWAL OLEH AI</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {analysis.toolName}
        </h2>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-2">
          <span>Kategori: <strong className="text-slate-700 dark:text-slate-200">{analysis.category}</strong></span>
          <span aria-hidden="true">·</span>
          <span>Tingkat Kerumitan: <strong className="text-slate-700 dark:text-slate-200">{analysis.complexity}</strong></span>
        </div>
      </div>

      {/* Friendly Guide Callout for Lay Users */}
      <div className="mb-6 p-4 rounded-xl border border-emerald-500/20 bg-emerald-50/70 dark:bg-emerald-950/20 text-xs text-emerald-900 dark:text-emerald-300 flex items-start gap-3">
        <Info className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Kabar Baik!</strong> AI telah memahami ide Anda dan merumuskan rencana dasar di bawah ini. Anda tidak perlu mengubah apa pun sekarang—pada langkah berikutnya, kami akan memandu Anda memilih detail seperti cara memasukkan data dan tampilan hasil yang Anda inginkan.
        </div>
      </div>

      {/* Primary Purpose Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 shadow-sm dark:shadow-md mb-6 transition-colors">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Tujuan Utama Aplikasi
        </h3>
        <p className="text-base text-slate-900 dark:text-slate-100 leading-relaxed font-semibold">
          {analysis.purpose}
        </p>

        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Ide Asal Anda: </span>
          <span className="italic">"{originalIdea}"</span>
        </div>
      </div>

      {/* Grid: Target Users & Suggested Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Target Users */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 shadow-sm dark:shadow-md transition-colors">
          <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-slate-100">
            <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold">Siapa yang Akan Menggunakan?</h3>
          </div>
          <ul className="space-y-2.5">
            {analysis.targetUsers.map((user, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-snug font-medium">{user}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Suggested Features */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 shadow-sm dark:shadow-md transition-colors">
          <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-slate-100">
            <Cpu className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold">Fitur-Fitur Utama yang Disarankan</h3>
          </div>
          <ul className="space-y-2.5">
            {analysis.suggestedFeatures.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <span className="flex h-4 w-4 items-center justify-center rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                  {idx + 1}
                </span>
                <span className="leading-snug">{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Missing Requirements & AI Assumptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Missing Requirements */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 shadow-sm dark:shadow-md transition-colors">
          <div className="flex items-center gap-2 mb-3 text-slate-900 dark:text-slate-100">
            <FileQuestion className="h-4 w-4 text-amber-500 dark:text-amber-400" />
            <h3 className="text-sm font-bold">Hal yang Akan Kita Tentukan Bersama</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Poin di bawah ini akan ditanyakan satu per satu di wizard berikutnya:
          </p>
          <ul className="space-y-2">
            {analysis.missingRequirements.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                <span className="text-amber-500 font-bold shrink-0">?</span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* AI Assumptions */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 shadow-sm dark:shadow-md transition-colors">
          <div className="flex items-center gap-2 mb-3 text-slate-900 dark:text-slate-100">
            <HelpCircle className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <h3 className="text-sm font-bold">Standar Otomatis AI</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Standar teknis terbaik yang disiapkan otomatis agar aplikasi lancar:
          </p>
          <ul className="space-y-2">
            {analysis.assumptions.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                <span className="text-emerald-500 font-bold shrink-0">·</span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800 pt-6">
        <button
          type="button"
          onClick={onEditIdea}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Ubah Ide Dasar</span>
        </button>

        <button
          type="button"
          onClick={onProceedToQuestions}
          disabled={isLoadingNext}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 px-6 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 cursor-pointer"
        >
          {isLoadingNext ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Menyiapkan Pertanyaan...</span>
            </>
          ) : (
            <>
              <span>Mulai Wawancara Spesifikasi</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
