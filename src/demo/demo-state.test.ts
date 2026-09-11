import { createDefaultState, DEMO_STORAGE_KEY, PASSING_SCORE, readDemoState, resetDemoState, saveDemoState, scoreAssessment } from './demo-state';
import { questions } from './demo-content';

const correctAnswers = Object.fromEntries(questions.map((question) => [question.id, question.correctChoice]));

describe('demo assessment scoring', () => {
  it('calculates a complete assessment score', () => {
    expect(scoreAssessment(correctAnswers)).toEqual({ correct: 10, total: 10, score: 100, passed: true });
  });

  it('passes at the exact 80 percent threshold', () => {
    const answers = { ...correctAnswers, q9: 0, q10: 0 };
    expect(scoreAssessment(answers)).toMatchObject({ score: PASSING_SCORE, passed: true });
  });

  it('requires remediation below 80 percent', () => {
    const answers = { ...correctAnswers, q8: 0, q9: 0, q10: 0 };
    expect(scoreAssessment(answers)).toMatchObject({ score: 70, passed: false });
  });
});

describe('demo state persistence', () => {
  beforeEach(() => localStorage.clear());

  it('saves changes and restores them', () => {
    const state = createDefaultState();
    state.mentees[0].takeaways[0] = 'A locally persisted insight';
    expect(saveDemoState(state)).toBe(true);
    expect(readDemoState().mentees[0].takeaways[0]).toBe('A locally persisted insight');
  });

  it('falls back safely when stored data is invalid', () => {
    localStorage.setItem(DEMO_STORAGE_KEY, '{bad json');
    expect(readDemoState()).toEqual(createDefaultState());
  });

  it('clears persisted changes when reset', () => {
    saveDemoState({ ...createDefaultState(), activeMenteeId: 'jordan' });
    const reset = resetDemoState();
    expect(localStorage.getItem(DEMO_STORAGE_KEY)).toBeNull();
    expect(reset.activeMenteeId).toBe('maya');
  });
});
