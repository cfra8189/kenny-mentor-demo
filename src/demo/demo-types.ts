export type DemoView = 'home' | 'mentee' | 'mentor';
export type MenteeStatus = 'on-track' | 'needs-review' | 'remediation-required';
export type AssessmentStatus = 'not-started' | 'passed' | 'remediation-required';
export type ResourceKind = 'Book' | 'PDF guide' | 'Audio' | 'Video' | 'Conference information';

export interface AssessmentQuestion {
  id: string;
  prompt: string;
  choices: string[];
  correctChoice: number;
}

export interface Resource {
  id: string;
  kind: ResourceKind;
  title: string;
  summary: string;
  detail: string;
  duration: string;
}

export interface Meeting {
  title: string;
  startsAt: string;
  proposedTimes: string[];
  schedulingStatus: 'proposed' | 'accepted' | 'alternative-requested';
  preparation: Record<string, boolean>;
}

export interface FeedbackNote {
  id: string;
  body: string;
  createdAt: string;
}

export interface DemoMentee {
  id: string;
  name: string;
  initials: string;
  welcome: string;
  status: MenteeStatus;
  baseProgress: number;
  assignmentTitle: string;
  assessmentStatus: AssessmentStatus;
  assessmentScore: number | null;
  attemptCount: number;
  answers: Record<string, number>;
  takeaways: [string, string, string];
  reflection: string;
  reviewed: boolean;
  certificateDate: string | null;
  objectives: string[];
  meeting: Meeting;
  feedback: FeedbackNote[];
}

export interface DemoState {
  version: 1;
  mentees: DemoMentee[];
  activeMenteeId: string;
}

export interface AssessmentResult {
  correct: number;
  total: number;
  score: number;
  passed: boolean;
}
