import React from 'react';
import { Sparkles, FolderArchive, PlusCircle, CheckCircle2, Sun, Moon, HelpCircle, Palette } from 'lucide-react';
import { ThemeStyle, ThemeColor, ThemeFont } from '../types';

interface HeaderProps {
  currentStep: 'welcome' | 'analyzing' | 'questions' | 'review' | 'result';
  onNewProject: () => void;
  onOpenHistory: () => void;
  onOpenGuide: () => void;
  onOpenCustomizer: () => void;
  savedCount: number;
  isDark: boolean;
  onToggleTheme: () => void;
  themeStyle: ThemeStyle;
  themeColor: ThemeColor;
  themeFont: ThemeFont;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onNewProject,
  onOpenHistory,
  onOpenGuide,
  onOpenCustomizer,
  savedCount,
  isDark,
  onToggleTheme,
  themeColor,
}) => {
  const steps = [
    { id: 'welcome', label: '1. Ide' },
    { id: 'analyzing', label: '2. Analisis' },
    { id: 'questions', label: '3. Pertanyaan' },
    { id: 'review', label: '4. Tinjauan' },
    { id: 'result', label: '5. Master Prompt' },
  ];

  const getStepStatus = (stepId: string) => {
    const order = ['welcome', 'analyzing', 'questions', 'review', 'result'];
    const currentIndex = order.indexOf(currentStep);
    const stepIndex = order.indexOf(stepId);
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'upcoming';
  };

  const getAccentColorDot = () => {
    switch (themeColor) {
      case 'indigo':
        return '#6366F1';
      case 'monochrome':
        return '#A1A1AA';
      case 'nordic':
        return '#06B6D4';
      case 'emerald':
      default:
        return '#10B981';
    }
  };

  const getCtaButtonClass = () => {
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
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-[#0B132B]/90 backdrop-blur-md transition-colors duration-150">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
              Klick Assets Generator
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs text-slate-500 dark:text-slate-400 font-normal">
              AI Tool Builder
            </span>
          </div>
        </div>

        {/* Zone 2: Workflow Stepper (Single line text links) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium">
          {steps.map((s) => {
            const status = getStepStatus(s.id);
            return (
              <div
                key={s.id}
                className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
                  status === 'active'
                    ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                    : status === 'completed'
                    ? 'text-slate-700 dark:text-slate-300'
                    : 'text-slate-400 dark:text-slate-600'
                }`}
              >
                {status === 'completed' && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                <span>{s.label}</span>
              </div>
            );
          })}
        </nav>

        {/* Zone 3: Controls (Theme Customizer, Theme Toggle, Guide, History, New Project) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Design Customizer Button */}
          <button
            type="button"
            onClick={onOpenCustomizer}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer shadow-sm"
            title="Kustomisasi Gaya, Warna, dan Font Tampilan"
            aria-label="Kustomisasi Desain"
          >
            <Palette className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden md:inline">Desain</span>
            <span
              className="w-2 h-2 rounded-full shadow-inner shrink-0"
              style={{ backgroundColor: getAccentColorDot() }}
            />
          </button>

          {/* Dark / Light Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 transition-colors cursor-pointer"
            title={isDark ? 'Mode Terang (Light Mode)' : 'Mode Gelap (Dark Mode)'}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </button>

          {/* Quick Guide for Beginners */}
          <button
            type="button"
            onClick={onOpenGuide}
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 transition-colors whitespace-nowrap cursor-pointer"
            title="Panduan cara pakai untuk pemula"
          >
            <HelpCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Panduan</span>
          </button>

          {/* Project History */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap cursor-pointer"
            title="Buka riwayat proyek tersimpan"
          >
            <FolderArchive className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">Riwayat</span>
            {savedCount > 0 && (
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 tabular-nums font-semibold">({savedCount})</span>
            )}
          </button>

          {/* New Project CTA */}
          <button
            type="button"
            onClick={onNewProject}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold shadow-sm transition-all whitespace-nowrap cursor-pointer ${getCtaButtonClass()}`}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Proyek Baru</span>
            <span className="sm:hidden">Baru</span>
          </button>
        </div>
      </div>
    </header>
  );
};
