import { ProjectState } from '../types';

const STORAGE_KEY = 'klick_assets_projects_v1';
const ACTIVE_PROJECT_KEY = 'klick_assets_active_project_id';

export function getSavedProjects(): ProjectState[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load projects from localStorage', e);
    return [];
  }
}

export function saveProject(project: ProjectState): void {
  try {
    const existing = getSavedProjects();
    const index = existing.findIndex((p) => p.id === project.id);
    let updated: ProjectState[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = { ...project, updatedAt: new Date().toISOString() };
    } else {
      updated = [project, ...existing];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(ACTIVE_PROJECT_KEY, project.id);
  } catch (e) {
    console.error('Failed to save project to localStorage', e);
  }
}

export function getActiveProjectId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_PROJECT_KEY);
  } catch {
    return null;
  }
}

export function deleteSavedProject(id: string): ProjectState[] {
  try {
    const existing = getSavedProjects();
    const filtered = existing.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    if (getActiveProjectId() === id) {
      localStorage.removeItem(ACTIVE_PROJECT_KEY);
    }
    return filtered;
  } catch (e) {
    console.error('Failed to delete project', e);
    return [];
  }
}

export function createNewProjectState(idea = ''): ProjectState {
  const now = new Date().toISOString();
  return {
    id: 'proj_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    createdAt: now,
    updatedAt: now,
    originalIdea: idea,
    projectName: '',
    category: '',
    purpose: '',
    targetUsers: [],
    suggestedFeatures: [],
    missingRequirements: [],
    complexity: 'Menengah',
    confirmedRequirements: {
      toolName: '',
      category: '',
      purpose: '',
      targetUsers: [],
      coreFeatures: [],
      inputFormats: [],
      outputFormats: [],
      uiPreferences: [],
      aiIntegration: [],
      storageRequirements: [],
      additionalConstraints: [],
    },
    assumptions: [],
    questions: [],
    answers: [],
    currentQuestionIndex: 0,
    currentStep: 'welcome',
    generatedPrompt: '',
    validationResult: null,
  };
}
