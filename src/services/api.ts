import { AIAnalysisResult, QuestionItem, ValidationResult } from '../types';

export async function analyzeIdeaApi(idea: string): Promise<AIAnalysisResult> {
  const response = await fetch('/api/analyze-idea', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Gagal menganalisis ide (Kode ${response.status})`);
  }

  return response.json();
}

export async function generateNextQuestionApi(payload: {
  originalIdea: string;
  projectName?: string;
  category?: string;
  purpose?: string;
  questionNumber: number;
  previousAnswers: Array<{ questionTitle: string; answerText: string; categoryKey?: string }>;
  confirmedRequirements?: Record<string, any>;
}): Promise<{ isComplete: boolean; question?: QuestionItem; message?: string }> {
  const response = await fetch('/api/generate-next-question', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Gagal memuat pertanyaan berikutnya (Kode ${response.status})`);
  }

  return response.json();
}

export async function generateMasterPromptApi(payload: {
  originalIdea: string;
  projectName: string;
  category: string;
  purpose: string;
  targetUsers: string[];
  coreFeatures: string[];
  confirmedRequirements: Record<string, any>;
  answers: Array<{ questionTitle: string; answerText: string }>;
  assumptions?: string[];
  themeConfig?: {
    style: string;
    color: string;
    font: string;
  };
}): Promise<{ prompt: string }> {
  const response = await fetch('/api/generate-master-prompt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Gagal menghasilkan Master Prompt (Kode ${response.status})`);
  }

  return response.json();
}

export async function validatePromptApi(payload: {
  originalIdea: string;
  confirmedRequirements: Record<string, any>;
  generatedPrompt: string;
}): Promise<ValidationResult> {
  const response = await fetch('/api/validate-prompt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Gagal memvalidasi prompt (Kode ${response.status})`);
  }

  return response.json();
}
