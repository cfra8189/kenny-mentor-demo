import type { AssessmentQuestion, DemoMentee, Resource } from './demo-types';

export const mentor = {
  name: 'Kenny',
  eyebrow: 'Practical mentorship for meaningful momentum',
  biography:
    'Kenny is an Indiana native, former college football player, and current business mentor. His approach pairs focused learning with honest reflection, clear objectives, and prepared conversations.',
};

export const assignment = {
  title: 'The Magic of Thinking Big',
  overview:
    'This guided assignment explores how confident thinking, intentional habits, and constructive action can expand what a person believes is possible. The experience uses an original learning framework and does not reproduce book text.',
  objectives: [
    'Recognize how expectations influence choices and follow-through.',
    'Replace limiting assumptions with specific, testable actions.',
    'Practice language that supports confidence and accountability.',
    'Connect a larger vision to one achievable next step.',
    'Prepare evidence-based reflections for a mentor conversation.',
  ],
  takeawayPrompts: [
    'What idea most changed how you view your current opportunity?',
    'What limiting assumption will you challenge this week?',
    'What specific action will demonstrate bigger thinking?',
  ],
};

export const questions: AssessmentQuestion[] = [
  { id: 'q1', prompt: 'Which action best turns an ambitious vision into progress?', choices: ['Wait for certainty', 'Define one measurable next step', 'Avoid outside feedback', 'Change goals every day'], correctChoice: 1 },
  { id: 'q2', prompt: 'A useful response to a limiting assumption is to:', choices: ['Treat it as permanent', 'Hide it from your mentor', 'Test it with a constructive action', 'Replace it with wishful thinking'], correctChoice: 2 },
  { id: 'q3', prompt: 'What most strengthens confidence over time?', choices: ['Consistent preparation and follow-through', 'Never admitting uncertainty', 'Comparing yourself with everyone', 'Taking on every opportunity'], correctChoice: 0 },
  { id: 'q4', prompt: 'When a goal feels too large, the best first move is to:', choices: ['Abandon the goal', 'Break it into meaningful milestones', 'Add more goals', 'Focus only on obstacles'], correctChoice: 1 },
  { id: 'q5', prompt: 'Constructive self-talk should be:', choices: ['Vague and dramatic', 'Specific, credible, and action-oriented', 'Dependent on praise', 'Focused on past mistakes'], correctChoice: 1 },
  { id: 'q6', prompt: 'What makes mentor feedback most valuable?', choices: ['Defending every choice', 'Taking notes without acting', 'Turning insight into a committed next action', 'Waiting until the next meeting'], correctChoice: 2 },
  { id: 'q7', prompt: 'A growth-oriented objective should include:', choices: ['A clear outcome and timeframe', 'Only a broad aspiration', 'Someone else’s priorities', 'No way to measure progress'], correctChoice: 0 },
  { id: 'q8', prompt: 'Preparation improves a mentorship meeting because it:', choices: ['Guarantees agreement', 'Removes all uncertainty', 'Creates space for focused discussion', 'Makes reflection unnecessary'], correctChoice: 2 },
  { id: 'q9', prompt: 'Which response demonstrates accountable thinking?', choices: ['I will try sometime', 'The timing is never right', 'I will complete the outreach plan by Friday', 'Someone else should start'], correctChoice: 2 },
  { id: 'q10', prompt: 'Progress is best reviewed by considering:', choices: ['Only the final outcome', 'Actions, learning, and the next adjustment', 'How easy the work felt', 'Whether anyone noticed'], correctChoice: 1 },
];

export const preparationItems = [
  { id: 'takeaways', label: 'Finalize three learning takeaways' },
  { id: 'objectives', label: 'Review current business objectives' },
  { id: 'questions', label: 'Write two discussion questions' },
];

export const discussionQuestions = [
  'Where am I thinking too narrowly about my next opportunity?',
  'Which weekly behavior would create the greatest momentum?',
  'What evidence should I bring to our next accountability check?',
];

export const previousActionItems = [
  'Draft a concise description of the customer problem.',
  'Identify three people who can offer practical market feedback.',
  'Block two weekly sessions for focused business development.',
];

export const resources: Resource[] = [
  { id: 'book', kind: 'Book', title: assignment.title, summary: 'A guided mindset and action assignment.', detail: 'Read the assigned work, capture three original takeaways, and complete the knowledge check before the next mentor conversation.', duration: 'Two-week focus' },
  { id: 'guide', kind: 'PDF guide', title: 'Objective Builder', summary: 'A simulated worksheet for sharper goals.', detail: 'A presentation-only resource showing how a future downloadable guide could turn broad ambitions into measurable objectives.', duration: '15-minute exercise' },
  { id: 'audio', kind: 'Audio', title: 'Momentum Check-in', summary: 'A simulated short coaching prompt.', detail: 'A placeholder for original audio guidance that could help mentees reflect before weekly planning.', duration: '8 minutes' },
  { id: 'video', kind: 'Video', title: 'Prepare for a Better Mentor Meeting', summary: 'A simulated preparation lesson.', detail: 'A future original video could demonstrate how to arrive with context, questions, decisions, and clear next steps.', duration: '12 minutes' },
  { id: 'conference', kind: 'Conference information', title: 'Major In-Person Conference', summary: 'Orlando, Florida · October 1–4, 2026', detail: 'A major in-person conference in Orlando, Florida, taking place October 1–4, 2026. Additional venue, registration, pricing, and schedule details are not yet specified.', duration: 'October 1–4, 2026' },
];

export const alternativeMeetingTimes = [
  '2026-09-22T15:30:00-04:00',
  '2026-09-24T11:00:00-04:00',
];

export const createInitialMentees = (): DemoMentee[] => [
  {
    id: 'maya', name: 'Maya Thompson', initials: 'MT', welcome: 'Welcome back, Maya. Your preparation is turning ideas into visible momentum.', status: 'on-track', baseProgress: 48,
    assignmentTitle: assignment.title, assessmentStatus: 'not-started', assessmentScore: null, attemptCount: 0, answers: {}, takeaways: ['', '', ''], reflection: '', reviewed: false, certificateDate: null,
    objectives: ['Interview three prospective customers', 'Refine a one-page service offer', 'Practice a confident 60-second introduction'],
    meeting: { title: 'Momentum & Market Clarity', startsAt: '2026-09-18T14:00:00-04:00', proposedTimes: alternativeMeetingTimes, schedulingStatus: 'proposed', preparation: { takeaways: false, objectives: true, questions: false } },
    feedback: [{ id: 'f1', body: 'Your customer questions are getting sharper. Bring the patterns you heard—not just individual comments—to our next conversation.', createdAt: '2026-09-08T16:30:00-04:00' }],
  },
  {
    id: 'jordan', name: 'Jordan Ellis', initials: 'JE', welcome: 'Keep moving one clear commitment at a time.', status: 'needs-review', baseProgress: 63,
    assignmentTitle: 'Customer Discovery Essentials', assessmentStatus: 'passed', assessmentScore: 90, attemptCount: 1, answers: {}, takeaways: ['Ask about behavior, not hypothetical intent.', 'Look for repeated pain points.', 'Summarize evidence before choosing a direction.'], reflection: '', reviewed: false, certificateDate: '2026-09-06',
    objectives: ['Synthesize interview notes', 'Choose one customer segment'],
    meeting: { title: 'Discovery Review', startsAt: '2026-09-20T10:00:00-04:00', proposedTimes: alternativeMeetingTimes, schedulingStatus: 'accepted', preparation: { takeaways: true, objectives: true, questions: true } },
    feedback: [{ id: 'f2', body: 'Assessment complete; submitted work is ready for mentor review.', createdAt: '2026-09-06T13:00:00-04:00' }],
  },
  {
    id: 'andre', name: 'Andre Williams', initials: 'AW', welcome: 'A revised attempt is a chance to make the learning practical.', status: 'remediation-required', baseProgress: 35,
    assignmentTitle: 'Value Proposition Foundations', assessmentStatus: 'remediation-required', assessmentScore: 60, attemptCount: 1, answers: {}, takeaways: ['Start with the customer.', 'Be more specific.', 'Test the message.'], reflection: 'My first attempt showed that I could recognize the vocabulary but had not connected it to actual customer evidence. I need to slow down, review my interview notes, and explain each choice using a real situation before I try again.', reviewed: false, certificateDate: null,
    objectives: ['Rewrite the problem statement', 'Complete a revised assessment'],
    meeting: { title: 'Learning Reset', startsAt: '2026-09-19T09:30:00-04:00', proposedTimes: alternativeMeetingTimes, schedulingStatus: 'accepted', preparation: { takeaways: true, objectives: false, questions: false } },
    feedback: [{ id: 'f3', body: 'Focus the reflection on what evidence would change your decision next time.', createdAt: '2026-09-07T11:15:00-04:00' }],
  },
];

export const presentationCopy = {
  learning: ['Focused reading', 'Business-development practice', 'Reflection and assessment', 'Prepared mentor conversations'],
  process: [
    ['Learn with purpose', 'Complete one focused assignment with clear learning objectives.'],
    ['Reflect and demonstrate', 'Capture takeaways, check understanding, and connect ideas to action.'],
    ['Prepare and meet', 'Bring progress, questions, and next decisions into the mentor conversation.'],
    ['Act and stay accountable', 'Leave with visible objectives and return with evidence of progress.'],
  ],
  businessObjectives: ['Clarify the problem worth solving', 'Build confident outreach habits', 'Test ideas with real conversations'],
};
