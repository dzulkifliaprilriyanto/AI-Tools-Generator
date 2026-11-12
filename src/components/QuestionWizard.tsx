import React, { useState, useEffect } from 'react';
import { QuestionItem, OptionRecommendation, ThemeStyle, ThemeColor } from '../types';
import { ArrowRight, ArrowLeft, Check, Sparkles, Edit3, HelpCircle, Palette } from 'lucide-react';

interface QuestionWizardProps {
  question: QuestionItem;
  questionNumber: number;
  totalQuestionsEstimate: number;
  currentAnswerText?: string;
  currentOptionId?: string;
  isCustomAnswer?: boolean;
  onAnswerSubmit: (answerText: string, optionId?: string, isCustom?: boolean, reason?: string) => void;
  onNavigateBack: () => void;
  onSkipToReview?: () => void;
  canNavigateBack: boolean;
  isLoadingNext?: boolean;
  themeStyle?: ThemeStyle;
  themeColor?: ThemeColor;
  onOpenCustomizer?: () => void;
}

export const QuestionWizard: React.FC<QuestionWizardProps> = ({
  question,
  questionNumber,
  totalQuestionsEstimate,
  currentAnswerText = '',
  currentOptionId = '',
  isCustomAnswer = false,
  onAnswerSubmit,
  onNavigateBack,
  onSkipToReview,
  canNavigateBack,
  isLoadingNext = false,
  themeColor = 'emerald',
  onOpenCustomizer,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(currentOptionId);
  const [customText, setCustomText] = useState<string>(isCustomAnswer ? currentAnswerText : '');
  const [showCustomInput, setShowCustomInput] = useState<boolean>(isCustomAnswer || false);

  // Sync when question changes
  useEffect(() => {
    setSelectedOptionId(currentOptionId);
    setCustomText(isCustomAnswer ? currentAnswerText : '');
    setShowCustomInput(isCustomAnswer);
  }, [question.id, currentOptionId, currentAnswerText, isCustomAnswer]);

  const handleSelectOption = (opt: OptionRecommendation) => {
    setSelectedOptionId(opt.id);
    setShowCustomInput(false);
  };

  const handleToggleCustom = () => {
    setShowCustomInput(true);
    setSelectedOptionId('custom');
  };

  const handleContinue = () => {
    if (showCustomInput) {
      if (!customText.trim()) return;
      onAnswerSubmit(customText.trim(), 'custom', true);
    } else {
      const selected = question.options.find((o) => o.id === selectedOptionId);
      if (selected) {
        onAnswerSubmit(selected.label, selected.id, false, selected.reason);
      }
    }
  };

  const isContinueEnabled = showCustomInput
    ? customText.trim().length > 0
    : !!selectedOptionId && selectedOptionId !== 'custom';

  const progressPercent = Math.min(
    100,
    Math.round(((questionNumber - 1) / Math.max(totalQuestionsEstimate, 6)) * 100)
  );

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

  const getSelectedBorderClass = () => {
    switch (themeColor) {
      case 'indigo':
        return 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-500/10 ring-1 ring-indigo-500';
      case 'monochrome':
        return 'border-slate-900 dark:border-white bg-slate-100/70 dark:bg-slate-800/60 ring-1 ring-slate-900 dark:ring-white';
      case 'nordic':
        return 'border-cyan-500 bg-cyan-50/70 dark:bg-cyan-500/10 ring-1 ring-cyan-500';
      case 'emerald':
      default:
        return 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-500/10 ring-1 ring-emerald-500';
    }
  };

  const getSelectedCheckClass = () => {
    switch (themeColor) {
      case 'indigo':
        return 'border-indigo-600 bg-indigo-600 text-white';
      case 'monochrome':
        return 'border-slate-900 dark:border-white bg-slate-900 dark:bg-white text-white dark:text-slate-900';
      case 'nordic':
        return 'border-cyan-600 bg-cyan-600 text-white';
      case 'emerald':
      default:
        return 'border-emerald-600 bg-emerald-600 text-white';
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Progress & Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-[11px]">
              PANDUAN ADAPTIF
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums font-semibold text-slate-700 dark:text-slate-300">
              Pertanyaan {questionNumber} dari ~{totalQuestionsEstimate}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {onOpenCustomizer && (
              <button
                type="button"
                onClick={onOpenCustomizer}
                className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer"
              >
                <Palette className="w-3 h-3 text-emerald-500" />
                <span>Desain</span>
              </button>
            )}

            {onSkipToReview && questionNumber >= 3 && (
              <button
                type="button"
                onClick={onSkipToReview}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline underline-offset-4 font-semibold transition-colors cursor-pointer"
              >
                Selesaikan Tinjauan
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 sm:p-8 shadow-sm dark:shadow-xl mb-6 transition-colors">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 leading-snug">
          {question.title}
        </h2>
        {question.description && (
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
            {question.description}
          </p>
        )}

        {/* Recommendation Options */}
        <div className="space-y-3 mb-6">
          {question.options.map((option) => {
            const isSelected = selectedOptionId === option.id && !showCustomInput;

            return (
              <div
                key={option.id}
                onClick={() => handleSelectOption(option)}
                className={`relative rounded-xl p-4 border transition-all cursor-pointer ${
                  isSelected
                    ? getSelectedBorderClass()
                    : option.recommended
                    ? 'border-emerald-300/60 dark:border-slate-700 bg-white dark:bg-slate-900/90 hover:border-emerald-400 dark:hover:border-slate-600'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    {/* Recommended Tag indicator */}
                    {option.recommended && (
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 mb-1.5 bg-emerald-100 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                        <Sparkles className="h-3 w-3" />
                        <span>Rekomendasi AI Studio</span>
                      </div>
                    )}

                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1 leading-snug">
                      {option.label}
                    </div>

                    {option.reason && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {option.reason}
                      </div>
                    )}
                  </div>

                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all mt-0.5 ${
                      isSelected
                        ? getSelectedCheckClass()
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-transparent'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Custom Answer Option Toggle */}
          {question.allowCustom && (
            <div
              onClick={handleToggleCustom}
              className={`rounded-xl p-4 border transition-all cursor-pointer ${
                showCustomInput
                  ? getSelectedBorderClass()
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <Edit3 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Ketik Jawaban Khusus Sesuai Keinginan Anda Sendiri</span>
                </div>
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                    showCustomInput
                      ? getSelectedCheckClass()
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-transparent'
                  }`}
                >
                  {showCustomInput && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
              </div>

              {showCustomInput && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
                  <textarea
                    rows={3}
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Tuliskan format atau kebutuhan spesifik Anda di sini..."
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-y"
                    autoFocus
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-6">
          <button
            type="button"
            onClick={onNavigateBack}
            disabled={!canNavigateBack || isLoadingNext}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali</span>
          </button>

          <button
            type="button"
            onClick={handleContinue}
            disabled={!isContinueEnabled || isLoadingNext}
            className={`inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold text-white shadow-md hover:shadow-lg transition-all focus-visible:outline focus-visible:outline-2 cursor-pointer ${getPrimaryButtonColor()} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoadingNext ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <span>Lanjut</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Helpful Hint */}
      <div className="text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
        <HelpCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>Rekomendasi bertanda bintang adalah opsi standar paling aman untuk Google AI Studio & API Google Device.</span>
      </div>
    </div>
  );
};
