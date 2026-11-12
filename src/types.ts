export interface OptionRecommendation {
  id: string;
  label: string;
  recommended: boolean;
  reason: string;
}

export interface QuestionItem {
  id: string;
  title: string;
  description?: string;
  options: OptionRecommendation[];
  allowCustom: boolean;
  categoryKey?: string;
}

export interface AnsweredQuestion {
  questionId: string;
  questionTitle: string;
  categoryKey?: string;
  selectedOptionId?: string;
  answerText: string;
  isCustom: boolean;
  recommendedReason?: string;
  timestamp: number;
}

export interface AIAnalysisResult {
  toolName: string;
  category: string;
  purpose: string;
  targetUsers: string[];
  suggestedFeatures: string[];
  missingRequirements: string[];
  complexity: 'Sederhana' | 'Menengah' | 'Kompleks';
  assumptions: string[];
  confirmedRequirements: Record<string, any>;
}

export interface ValidationCheck {
  id: string;
  label: string;
  passed: boolean;
  note: string;
}

export interface ValidationResult {
  isValid: boolean;
  overallScore: number; // 0 - 100
  checks: ValidationCheck[];
  warnings: string[];
  summary: string;
}

export interface ProjectState {
  id: string;
  createdAt: string;
  updatedAt: string;
  originalIdea: string;
  projectName: string;
  category: string;
  purpose: string;
  targetUsers: string[];
  suggestedFeatures: string[];
  missingRequirements: string[];
  complexity: 'Sederhana' | 'Menengah' | 'Kompleks';
  confirmedRequirements: {
    toolName: string;
    category: string;
    purpose: string;
    targetUsers: string[];
    coreFeatures: string[];
    inputFormats: string[];
    outputFormats: string[];
    uiPreferences: string[];
    aiIntegration: string[];
    storageRequirements: string[];
    additionalConstraints: string[];
  };
  assumptions: string[];
  questions: QuestionItem[];
  answers: AnsweredQuestion[];
  currentQuestionIndex: number;
  currentStep: 'welcome' | 'analyzing' | 'questions' | 'review' | 'result';
  generatedPrompt: string;
  validationResult: ValidationResult | null;
}

export type ThemeStyle = 'minimal' | 'editorial' | 'studio';
export type ThemeColor = 'emerald' | 'indigo' | 'monochrome' | 'nordic';
export type ThemeFont = 'jakarta' | 'outfit' | 'mono';

export interface ThemeConfig {
  style: ThemeStyle;
  color: ThemeColor;
  font: ThemeFont;
}

// Backward compatibility aliases
export type LegoStyle = 'studs' | 'clean' | 'retro' | ThemeStyle;
export type LegoColor = 'classic' | 'emerald' | 'sunset' | 'stealth' | ThemeColor;
export type LegoFont = 'lego' | 'modern' | 'tech' | ThemeFont;
export type LegoThemeConfig = ThemeConfig;

