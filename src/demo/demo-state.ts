import { createInitialMentees, questions } from './demo-content';
import type { AssessmentResult, DemoState } from './demo-types';

export const DEMO_STORAGE_KEY = 'kenny-mentor.presentation-mvp.v1';
export const PASSING_SCORE = 80;

export const createDefaultState = (): DemoState => ({
  version: 1,
  mentees: createInitialMentees(),
  activeMenteeId: 'maya',
});

const isDemoState = (value: unknown): value is DemoState => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<DemoState>;
  return candidate.version === 1 && Array.isArray(candidate.mentees) && candidate.mentees.length > 0 && typeof candidate.activeMenteeId === 'string';
};

export const readDemoState = (storage: Pick<Storage, 'getItem'> = localStorage): DemoState => {
  try {
    const stored = storage.getItem(DEMO_STORAGE_KEY);
    if (!stored) return createDefaultState();
    const parsed: unknown = JSON.parse(stored);
    return isDemoState(parsed) ? parsed : createDefaultState();
  } catch {
    return createDefaultState();
  }
};

export const saveDemoState = (state: DemoState, storage: Pick<Storage, 'setItem'> = localStorage): boolean => {
  try {
    storage.setItem(DEMO_STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
};

export const resetDemoState = (storage: Pick<Storage, 'removeItem'> = localStorage): DemoState => {
  try {
    storage.removeItem(DEMO_STORAGE_KEY);
  } catch {
    // The in-memory reset still succeeds if storage is unavailable.
  }
  return createDefaultState();
};

export const scoreAssessment = (answers: Record<string, number>): AssessmentResult => {
  const correct = questions.reduce((total, question) => total + (answers[question.id] === question.correctChoice ? 1 : 0), 0);
  const score = Math.round((correct / questions.length) * 100);
  return { correct, total: questions.length, score, passed: score >= PASSING_SCORE };
};

export const wordCount = (value: string): number => value.trim().split(/\s+/).filter(Boolean).length;
