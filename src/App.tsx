import React, { useState, useEffect, useCallback } from 'react';
import { ProjectState, AIAnalysisResult, QuestionItem, ValidationResult, ThemeStyle, ThemeColor, ThemeFont } from './types';
import {
  getSavedProjects,
  saveProject,
  getActiveProjectId,
  deleteSavedProject,
  createNewProjectState,
} from './services/storage';
import {
  analyzeIdeaApi,
  generateNextQuestionApi,
  generateMasterPromptApi,
  validatePromptApi,
} from './services/api';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AnalysisScreen } from './components/AnalysisScreen';
import { QuestionWizard } from './components/QuestionWizard';
import { RequirementsReview } from './components/RequirementsReview';
import { MasterPromptView } from './components/MasterPromptView';
import { ProjectHistoryModal } from './components/ProjectHistoryModal';
import { BeginnerGuideModal } from './components/BeginnerGuideModal';
import { ThemeCustomizerModal } from './components/ThemeCustomizerModal';
import { ErrorAlert } from './components/ErrorAlert';

export default function App() {
  const [projectsList, setProjectsList] = useState<ProjectState[]>([]);
  const [project, setProject] = useState<ProjectState>(() => {
    const saved = getSavedProjects();
    const activeId = getActiveProjectId();
    if (activeId) {
      const found = saved.find((p) => p.id === activeId);
      if (found) return found;
    }
    return saved.length > 0 ? saved[0] : createNewProjectState();
  });

  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [retryAction, setRetryAction] = useState<(() => void) | null>(null);

  // Dark/Light mode theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('klick_theme');
      if (saved) return saved === 'dark';
      return document.documentElement.classList.contains('dark');
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('klick_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('klick_theme', 'light');
      }
    } catch (e) {
      console.error(e);
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // Design, Color, and Font Customization states
  const [themeStyle, setThemeStyle] = useState<ThemeStyle>(() => {
    try {
      const saved = localStorage.getItem('klick_theme_style') || localStorage.getItem('klick_lego_style');
      if (saved === 'minimal' || saved === 'editorial' || saved === 'studio') return saved;
      return 'minimal';
    } catch {
      return 'minimal';
    }
  });

  const [themeColor, setThemeColor] = useState<ThemeColor>(() => {
    try {
      const saved = localStorage.getItem('klick_theme_color') || localStorage.getItem('klick_lego_color');
      if (saved === 'emerald' || saved === 'indigo' || saved === 'monochrome' || saved === 'nordic') return saved;
      return 'emerald';
    } catch {
      return 'emerald';
    }
  });

  const [themeFont, setThemeFont] = useState<ThemeFont>(() => {
    try {
      const saved = localStorage.getItem('klick_theme_font') || localStorage.getItem('klick_lego_font');
      if (saved === 'jakarta' || saved === 'outfit' || saved === 'mono') return saved;
      return 'jakarta';
    } catch {
      return 'jakarta';
    }
  });

  const [customizerModalOpen, setCustomizerModalOpen] = useState(false);

  const handleUpdateThemeStyle = (newStyle: ThemeStyle) => {
    setThemeStyle(newStyle);
    try {
      localStorage.setItem('klick_theme_style', newStyle);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateThemeColor = (newColor: ThemeColor) => {
    setThemeColor(newColor);
    try {
      localStorage.setItem('klick_theme_color', newColor);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateThemeFont = (newFont: ThemeFont) => {
    setThemeFont(newFont);
    try {
      localStorage.setItem('klick_theme_font', newFont);
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetTheme = () => {
    handleUpdateThemeStyle('minimal');
    handleUpdateThemeColor('emerald');
    handleUpdateThemeFont('jakarta');
  };

  // Sync projects list from storage on mount
  useEffect(() => {
    const saved = getSavedProjects();
    setProjectsList(saved);
  }, []);

  // Save current project state changes to localStorage
  const updateProject = useCallback((patch: Partial<ProjectState>) => {
    setProject((prev) => {
      const updated = { ...prev, ...patch, updatedAt: new Date().toISOString() };
      saveProject(updated);
      setProjectsList(getSavedProjects());
      return updated;
    });
  }, []);

  // Step 1: Analyze Idea
  const handleStartAnalysis = async (idea: string) => {
    setIsLoading(true);
    setLoadingText('Menganalisis ide produk dengan Gemini AI...');
    setErrorMessage('');
    setRetryAction(() => () => handleStartAnalysis(idea));

    try {
      const analysis = await analyzeIdeaApi(idea);
      setAnalysisResult(analysis);

      updateProject({
        originalIdea: idea,
        projectName: analysis.toolName,
        category: analysis.category,
        purpose: analysis.purpose,
        targetUsers: analysis.targetUsers,
        suggestedFeatures: analysis.suggestedFeatures,
        missingRequirements: analysis.missingRequirements,
        complexity: analysis.complexity,
        assumptions: analysis.assumptions,
        confirmedRequirements: {
          toolName: analysis.toolName,
          category: analysis.category,
          purpose: analysis.purpose,
          targetUsers: analysis.targetUsers,
          coreFeatures: analysis.suggestedFeatures,
          inputFormats: analysis.confirmedRequirements?.inputFormats || [],
          outputFormats: analysis.confirmedRequirements?.outputFormats || [],
          uiPreferences: analysis.confirmedRequirements?.uiPreferences || [],
          aiIntegration: analysis.confirmedRequirements?.aiIntegration || [],
          storageRequirements: analysis.confirmedRequirements?.storageRequirements || [],
          additionalConstraints: analysis.confirmedRequirements?.additionalConstraints || [],
        },
        currentStep: 'analyzing',
      });
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Gagal menganalisis ide. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Proceed from Analysis to First Adaptive Question
  const handleProceedToQuestions = async () => {
    setIsLoading(true);
    setLoadingText('Menyiapkan pertanyaan spesifikasi adaptif...');
    setErrorMessage('');
    setRetryAction(() => () => handleProceedToQuestions());

    try {
      const res = await generateNextQuestionApi({
        originalIdea: project.originalIdea,
        projectName: project.projectName,
        category: project.category,
        purpose: project.purpose,
        questionNumber: 1,
        previousAnswers: [],
        confirmedRequirements: project.confirmedRequirements,
      });

      if (res.question) {
        updateProject({
          questions: [res.question],
          currentQuestionIndex: 0,
          currentStep: 'questions',
        });
      } else {
        // Direct to review if no initial question needed
        updateProject({ currentStep: 'review' });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Gagal menyiapkan pertanyaan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Answer Submit in Question Wizard
  const handleAnswerSubmit = async (
    answerText: string,
    optionId?: string,
    isCustom = false,
    reason?: string
  ) => {
    const currentQ = project.questions[project.currentQuestionIndex];
    if (!currentQ) return;

    // Build answer object
    const newAnswer = {
      questionId: currentQ.id,
      questionTitle: currentQ.title,
      categoryKey: currentQ.categoryKey,
      selectedOptionId: optionId,
      answerText,
      isCustom,
      recommendedReason: reason,
      timestamp: Date.now(),
    };

    // Update answers list (replace if already exists for this question)
    const existingIndex = project.answers.findIndex((a) => a.questionId === currentQ.id);
    let updatedAnswers = [...project.answers];
    if (existingIndex >= 0) {
      updatedAnswers[existingIndex] = newAnswer;
    } else {
      updatedAnswers.push(newAnswer);
    }

    // Update confirmed requirements based on question category
    const updatedRequirements = { ...project.confirmedRequirements };
    if (currentQ.categoryKey === 'inputFormats') {
      updatedRequirements.inputFormats = [answerText];
    } else if (currentQ.categoryKey === 'outputFormats') {
      updatedRequirements.outputFormats = [answerText];
    } else if (currentQ.categoryKey === 'uiPreferences') {
      updatedRequirements.uiPreferences = [answerText];
    } else if (currentQ.categoryKey === 'aiIntegration') {
      updatedRequirements.aiIntegration = [answerText];
    } else if (currentQ.categoryKey === 'storageRequirements') {
      updatedRequirements.storageRequirements = [answerText];
    }

    const nextQuestionNumber = project.currentQuestionIndex + 2;

    // If we're revisiting an earlier question and next question already exists in array:
    if (project.currentQuestionIndex < project.questions.length - 1) {
      updateProject({
        answers: updatedAnswers,
        confirmedRequirements: updatedRequirements,
        currentQuestionIndex: project.currentQuestionIndex + 1,
      });
      return;
    }

    // Otherwise, query next question from AI engine
    setIsLoading(true);
    setLoadingText('Menganalisis jawaban & menyiapkan pertanyaan lanjutan...');
    setErrorMessage('');
    setRetryAction(() => () => handleAnswerSubmit(answerText, optionId, isCustom, reason));

    try {
      const res = await generateNextQuestionApi({
        originalIdea: project.originalIdea,
        projectName: project.projectName,
        category: project.category,
        purpose: project.purpose,
        questionNumber: nextQuestionNumber,
        previousAnswers: updatedAnswers.map((a) => ({
          questionTitle: a.questionTitle,
          answerText: a.answerText,
          categoryKey: a.categoryKey,
        })),
        confirmedRequirements: updatedRequirements,
      });

      if (res.isComplete || !res.question || nextQuestionNumber > 7) {
        // Finished questions -> Proceed to Review
        updateProject({
          answers: updatedAnswers,
          confirmedRequirements: updatedRequirements,
          currentStep: 'review',
        });
      } else {
        updateProject({
          answers: updatedAnswers,
          confirmedRequirements: updatedRequirements,
          questions: [...project.questions, res.question],
          currentQuestionIndex: project.currentQuestionIndex + 1,
        });
      }
    } catch (err: any) {
      console.error(err);
      // If error on next question, still save answer and allow advancing to review
      updateProject({
        answers: updatedAnswers,
        confirmedRequirements: updatedRequirements,
        currentStep: 'review',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate backward in question wizard
  const handleNavigateBackInQuestions = () => {
    if (project.currentQuestionIndex > 0) {
      updateProject({
        currentQuestionIndex: project.currentQuestionIndex - 1,
      });
    } else {
      updateProject({ currentStep: 'analyzing' });
    }
  };

  // Jump directly to an answered question from review
  const handleJumpToQuestion = (index: number) => {
    if (index >= 0 && index < project.questions.length) {
      updateProject({
        currentQuestionIndex: index,
        currentStep: 'questions',
      });
    }
  };

  // Step 4: Generate Master Prompt
  const handleGenerateMasterPrompt = async () => {
    setIsLoading(true);
    setLoadingText('Menyusun Master Prompt implementasi 17 seksi lengkap...');
    setErrorMessage('');
    setRetryAction(() => () => handleGenerateMasterPrompt());

    try {
      const res = await generateMasterPromptApi({
        originalIdea: project.originalIdea,
        projectName: project.projectName,
        category: project.category,
        purpose: project.purpose,
        targetUsers: project.targetUsers,
        coreFeatures: project.suggestedFeatures,
        confirmedRequirements: project.confirmedRequirements,
        answers: project.answers.map((a) => ({
          questionTitle: a.questionTitle,
          answerText: a.answerText,
        })),
        assumptions: project.assumptions,
        themeConfig: {
          style: themeStyle,
          color: themeColor,
          font: themeFont,
        },
      });

      // Run validation on the generated prompt
      let valResult: ValidationResult | null = null;
      try {
        valResult = await validatePromptApi({
          originalIdea: project.originalIdea,
          confirmedRequirements: project.confirmedRequirements,
          generatedPrompt: res.prompt,
        });
      } catch (valErr) {
        console.warn('Validation API failed, using fallback metrics', valErr);
      }

      updateProject({
        generatedPrompt: res.prompt,
        validationResult: valResult,
        currentStep: 'result',
      });
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Gagal menghasilkan Master Prompt. Silakan coba kembali.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle New Project
  const handleNewProject = () => {
    const newProj = createNewProjectState();
    saveProject(newProj);
    setProject(newProj);
    setAnalysisResult(null);
    setErrorMessage('');
    setProjectsList(getSavedProjects());
  };

  // Switch to another project
  const handleSelectProject = (proj: ProjectState) => {
    setProject(proj);
    saveProject(proj);
    setErrorMessage('');
  };

  // Delete project from storage
  const handleDeleteProject = (projId: string) => {
    const updated = deleteSavedProject(projId);
    setProjectsList(updated);
    if (project.id === projId) {
      if (updated.length > 0) {
        setProject(updated[0]);
      } else {
        handleNewProject();
      }
    }
  };

  // Prepare current question data
  const currentQuestion: QuestionItem | undefined =
    project.questions && project.questions[project.currentQuestionIndex];
  const currentAnswer = project.answers.find(
    (a) => a.questionId === currentQuestion?.id
  );

  return (
    <div
      className={`min-h-screen bg-slate-50 dark:bg-[#0B132B] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-150 ${
        themeFont === 'outfit'
          ? 'font-theme-outfit'
          : themeFont === 'mono'
          ? 'font-theme-mono'
          : 'font-theme-jakarta'
      }`}
    >
      {/* Top Header */}
      <Header
        currentStep={project.currentStep}
        onNewProject={handleNewProject}
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenGuide={() => setGuideOpen(true)}
        onOpenCustomizer={() => setCustomizerModalOpen(true)}
        savedCount={projectsList.length}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        themeStyle={themeStyle}
        themeColor={themeColor}
        themeFont={themeFont}
      />

      {/* Global Loading Bar indicator */}
      {isLoading && (
        <div className="fixed top-16 left-0 right-0 z-50 bg-emerald-500/10 dark:bg-emerald-500/10 border-b border-emerald-500/20 backdrop-blur-sm py-2 px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-emerald-600 dark:border-emerald-400 border-t-transparent" />
            <span>{loadingText || 'Sedang memproses...'}</span>
          </div>
        </div>
      )}

      {/* Error Banner */}
      <div className="px-4">
        <ErrorAlert
          message={errorMessage}
          onRetry={retryAction || undefined}
          onDismiss={() => setErrorMessage('')}
        />
      </div>

      {/* Main Viewport Routing */}
      <main className="flex-1 pb-16">
        {project.currentStep === 'welcome' && (
          <WelcomeScreen
            initialIdea={project.originalIdea}
            onStartAnalysis={handleStartAnalysis}
            onOpenGuide={() => setGuideOpen(true)}
            onOpenCustomizer={() => setCustomizerModalOpen(true)}
            isLoading={isLoading}
            themeStyle={themeStyle}
            themeColor={themeColor}
            themeFont={themeFont}
          />
        )}

        {project.currentStep === 'analyzing' && (
          <AnalysisScreen
            analysis={
              analysisResult || {
                toolName: project.projectName || 'AI Productivity Suite',
                category: project.category || 'Produktivitas & Otomasi',
                purpose: project.purpose || `Aplikasi AI untuk: ${project.originalIdea}`,
                targetUsers: project.targetUsers.length > 0 ? project.targetUsers : ['Pengguna Bisnis', 'Pengguna Non-Teknis'],
                suggestedFeatures: project.suggestedFeatures.length > 0 ? project.suggestedFeatures : ['Input fleksibel', 'Pemrosesan Gemini AI', 'Ekspor hasil'],
                missingRequirements: project.missingRequirements.length > 0 ? project.missingRequirements : ['Format masukan', 'Format luaran', 'Gaya desain'],
                complexity: project.complexity || 'Menengah',
                assumptions: project.assumptions.length > 0 ? project.assumptions : ['Web app responsif di Google AI Studio'],
                confirmedRequirements: project.confirmedRequirements,
              }
            }
            originalIdea={project.originalIdea}
            onProceedToQuestions={handleProceedToQuestions}
            onEditIdea={() => updateProject({ currentStep: 'welcome' })}
            isLoadingNext={isLoading}
          />
        )}

        {project.currentStep === 'questions' && currentQuestion && (
          <QuestionWizard
            question={currentQuestion}
            questionNumber={project.currentQuestionIndex + 1}
            totalQuestionsEstimate={Math.max(6, project.questions.length)}
            currentAnswerText={currentAnswer?.answerText}
            currentOptionId={currentAnswer?.selectedOptionId}
            isCustomAnswer={currentAnswer?.isCustom}
            onAnswerSubmit={handleAnswerSubmit}
            onNavigateBack={handleNavigateBackInQuestions}
            onSkipToReview={() => updateProject({ currentStep: 'review' })}
            canNavigateBack={true}
            isLoadingNext={isLoading}
            themeStyle={themeStyle}
            themeColor={themeColor}
            onOpenCustomizer={() => setCustomizerModalOpen(true)}
          />
        )}

        {project.currentStep === 'review' && (
          <RequirementsReview
            project={project}
            onUpdateProject={updateProject}
            onGeneratePrompt={handleGenerateMasterPrompt}
            onBackToQuestions={() => {
              if (project.questions.length > 0) {
                updateProject({
                  currentStep: 'questions',
                  currentQuestionIndex: Math.max(0, project.questions.length - 1),
                });
              } else {
                updateProject({ currentStep: 'analyzing' });
              }
            }}
            onJumpToQuestion={handleJumpToQuestion}
            isGeneratingPrompt={isLoading}
            themeStyle={themeStyle}
            themeColor={themeColor}
            themeFont={themeFont}
            onOpenCustomizer={() => setCustomizerModalOpen(true)}
          />
        )}

        {project.currentStep === 'result' && (
          <MasterPromptView
            projectName={project.projectName || 'AI Tool Master Prompt'}
            prompt={project.generatedPrompt}
            validation={project.validationResult}
            onRegenerate={handleGenerateMasterPrompt}
            onEditRequirements={() => updateProject({ currentStep: 'review' })}
            isRegenerating={isLoading}
            themeStyle={themeStyle}
            themeColor={themeColor}
          />
        )}
      </main>

      {/* Modern Theme Customizer Modal */}
      <ThemeCustomizerModal
        isOpen={customizerModalOpen}
        onClose={() => setCustomizerModalOpen(false)}
        style={themeStyle}
        color={themeColor}
        font={themeFont}
        onChangeStyle={handleUpdateThemeStyle}
        onChangeColor={handleUpdateThemeColor}
        onChangeFont={handleUpdateThemeFont}
        onReset={handleResetTheme}
      />

      {/* Beginner Guide Modal */}
      <BeginnerGuideModal
        isOpen={guideOpen}
        onClose={() => setGuideOpen(false)}
      />

      {/* Project History Modal */}
      <ProjectHistoryModal
        isOpen={historyOpen}
        projects={projectsList}
        activeProjectId={project.id}
        onClose={() => setHistoryOpen(false)}
        onSelectProject={handleSelectProject}
        onDeleteProject={handleDeleteProject}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0B132B] py-6 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <strong className="text-slate-700 dark:text-slate-300">Klick Assets Generator</strong> — AI Tool Builder untuk Google AI Studio.
          </div>
          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
            <span>Privasi Lokal</span>
            <span aria-hidden="true">·</span>
            <span>Gemini AI Engine</span>
            <span aria-hidden="true">·</span>
            <span>17 Seksi Master Prompt</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
