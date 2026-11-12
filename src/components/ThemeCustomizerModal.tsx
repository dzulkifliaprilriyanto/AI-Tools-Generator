import React from 'react';
import { ThemeStyle, ThemeColor, ThemeFont } from '../types';
import { Sparkles, Check, RotateCcw, X, Palette, Box, Type, Eye } from 'lucide-react';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  style: ThemeStyle;
  color: ThemeColor;
  font: ThemeFont;
  onChangeStyle: (style: ThemeStyle) => void;
  onChangeColor: (color: ThemeColor) => void;
  onChangeFont: (font: ThemeFont) => void;
  onReset: () => void;
}

export function ThemeCustomizerModal({
  isOpen,
  onClose,
  style,
  color,
  font,
  onChangeStyle,
  onChangeColor,
  onChangeFont,
  onReset,
}: ThemeCustomizerModalProps) {
  if (!isOpen) return null;

  const styleOptions: Array<{
    id: ThemeStyle;
    title: string;
    desc: string;
    badge: string;
  }> = [
    {
      id: 'minimal',
      title: 'Modern Minimalist SaaS',
      desc: 'Desain bersih dengan garis hairline tipis, elevasi tunggal datar, dan fokus fungsional tinggi.',
      badge: 'Paling Populer',
    },
    {
      id: 'editorial',
      title: 'Editorial Swiss Clean',
      desc: 'Tata letak berjarak lega, hierarki tipografi tajam, dan pembatas presisi tanpa ornamen berlebih.',
      badge: 'Elegan',
    },
    {
      id: 'studio',
      title: 'Neo-Modern Studio',
      desc: 'Sentuhan glassmorphism lembut, border bercahaya halus di mode gelap, dan aksen tajam.',
      badge: 'Futuristik',
    },
  ];

  const colorOptions: Array<{
    id: ThemeColor;
    title: string;
    desc: string;
    swatches: string[];
    accentHex: string;
    bgHex: string;
  }> = [
    {
      id: 'emerald',
      title: 'Emerald Prestige (Default)',
      desc: 'Latar deep navy dengan aksen hijau zamrud yang elegan dan profesional.',
      swatches: ['#0B132B', '#1E293B', '#10B981'],
      accentHex: '#10B981',
      bgHex: '#0B132B',
    },
    {
      id: 'indigo',
      title: 'Royal Indigo & Slate',
      desc: 'Nuansa slate modern dengan aksen indigo biru khas produk enterprise Silicon Valley.',
      swatches: ['#0F172A', '#1E293B', '#6366F1'],
      accentHex: '#6366F1',
      bgHex: '#0F172A',
    },
    {
      id: 'monochrome',
      title: 'Monochrome Luxe',
      desc: 'Kontras hitam murni, abu-abu platinum, dan putih bersih beraliran minimalis mewah.',
      swatches: ['#09090B', '#27272A', '#FAFAFA'],
      accentHex: '#E4E4E7',
      bgHex: '#09090B',
    },
    {
      id: 'nordic',
      title: 'Nordic Teal & Mint',
      desc: 'Suasana sejuk nordik dengan palet cyan teal dan aksen mint segar berfokus tinggi.',
      swatches: ['#0D1B2A', '#1B263B', '#06B6D4'],
      accentHex: '#06B6D4',
      bgHex: '#0D1B2A',
    },
  ];

  const fontOptions: Array<{
    id: ThemeFont;
    title: string;
    desc: string;
    sample: string;
    fontClass: string;
  }> = [
    {
      id: 'jakarta',
      title: 'Plus Jakarta Sans',
      desc: 'Font sans geometris kontemporer, tajam, dan sangat mudah dibaca di layar aplikasi SaaS.',
      sample: 'Aa Klick Pro 123',
      fontClass: 'font-theme-jakarta',
    },
    {
      id: 'outfit',
      title: 'Outfit Display',
      desc: 'Huruf modern berlekuk halus dan anggun yang memberikan kesan premium dan ramah.',
      sample: 'Aa Studio AI 123',
      fontClass: 'font-theme-outfit',
    },
    {
      id: 'mono',
      title: 'JetBrains Mono',
      desc: 'Tipografi monospace presisi pengembang dengan tabular-nums untuk arsitektur teknis.',
      sample: 'Aa prompt_build()',
      fontClass: 'font-theme-mono',
    },
  ];

  const getActiveFontClass = () => {
    if (font === 'outfit') return 'font-theme-outfit';
    if (font === 'mono') return 'font-theme-mono';
    return 'font-theme-jakarta';
  };

  const getActiveButtonClass = () => {
    switch (color) {
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#0F172A] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Kustomisasi Desain & Antarmuka
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pilihan ini otomatis mengubah tampilan aplikasi dan spesifikasi Master Prompt Anda
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Live Mini Preview Box */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2.5">
              <span className="flex items-center gap-1.5 font-medium">
                <Eye className="w-3.5 h-3.5 text-emerald-500" />
                Pratinjau Hasil Desain:
              </span>
              <span className="text-[11px] font-mono capitalize">
                {style} · {color} · {font}
              </span>
            </div>

            {/* Mock Card Preview */}
            <div className={`p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 shadow-sm ${getActiveFontClass()}`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Tool AI Siap Bangun
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Otomatis terhubung ke Google Device, Gemini 3.8 Flash, dan Nano Banana.
                  </p>
                </div>

                <div
                  className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all ${getActiveButtonClass()}`}
                >
                  <span>Mulai Rakit</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          </div>

          {/* 1. Selector: Gaya Desain (Style) */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-emerald-500" />
              1. Gaya Desain (Layout & Aesthetic Style)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {styleOptions.map((opt) => {
                const isSelected = style === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onChangeStyle(opt.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 dark:border-emerald-400 bg-emerald-500/5 dark:bg-emerald-500/10 ring-1 ring-emerald-500'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          {opt.badge}
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {opt.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {opt.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Selector: Warna Tampilan (Color Palette) */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-emerald-500" />
              2. Palet Warna (Color Palette)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {colorOptions.map((opt) => {
                const isSelected = color === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onChangeColor(opt.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all relative flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 dark:border-emerald-400 bg-emerald-500/5 dark:bg-emerald-500/10 ring-1 ring-emerald-500'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/40'
                    }`}
                  >
                    <div className="flex flex-col gap-1 pt-1">
                      <div className="flex items-center gap-1.5">
                        {opt.swatches.map((c, i) => (
                          <span
                            key={i}
                            className="w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/10 shadow-sm"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                          {opt.title}
                        </span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 ml-1 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Selector: Font Desain (Font Family) */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-emerald-500" />
              3. Font Tipografi (Typography)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {fontOptions.map((opt) => {
                const isSelected = font === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onChangeFont(opt.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 dark:border-emerald-400 bg-emerald-500/5 dark:bg-emerald-500/10 ring-1 ring-emerald-500'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {opt.title}
                        </span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        )}
                      </div>
                      <div className={`text-sm font-semibold my-1 text-slate-700 dark:text-slate-300 ${opt.fontClass}`}>
                        {opt.sample}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 flex items-center justify-between">
          <button
            type="button"
            onClick={onReset}
            className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset ke Standar
          </button>

          <button
            type="button"
            onClick={onClose}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer ${getActiveButtonClass()}`}
          >
            <span>Terapkan Desain</span>
            <Check className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
