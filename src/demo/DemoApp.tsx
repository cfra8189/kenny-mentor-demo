import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  alternativeMeetingTimes,
  assignment,
  discussionQuestions,
  mentor,
  preparationItems,
  presentationCopy,
  previousActionItems,
  questions,
  resources,
} from './demo-content';
import { readDemoState, resetDemoState, saveDemoState, scoreAssessment, wordCount } from './demo-state';
import type { DemoMentee, DemoState, DemoView, Resource } from './demo-types';
import { Modal } from './components/Modal';
import { PresentationToolbar } from './components/PresentationToolbar';

const formatDateTime = (value: string) => new Intl.DateTimeFormat('en-US', {
  weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
}).format(new Date(value));

const formatDate = (value: string) => new Intl.DateTimeFormat('en-US', {
  month: 'long', day: 'numeric', year: 'numeric',
}).format(new Date(value.length === 10 ? `${value}T12:00:00` : value));

const statusLabel = (value: DemoMentee['status'] | DemoMentee['assessmentStatus']) => value.split('-').map((word) => word[0].toUpperCase() + word.slice(1)).join(' ');

function useCountdown(startsAt: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const milliseconds = Math.max(0, new Date(startsAt).getTime() - now);
  const days = Math.floor(milliseconds / 86_400_000);
  const hours = Math.floor((milliseconds / 3_600_000) % 24);
  const minutes = Math.floor((milliseconds / 60_000) % 60);
  const seconds = Math.floor((milliseconds / 1000) % 60);
  return milliseconds === 0 ? 'Meeting time has arrived' : `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function ProgressBar({ value, label = 'Overall progress' }: { value: number; label?: string }) {
  return (
    <div className="demo-progress" aria-label={`${label}: ${value}%`}>
      <div className="demo-progress__labels"><span>{label}</span><strong>{value}%</strong></div>
      <div className="demo-progress__track"><span style={{ width: `${value}%` }} /></div>
    </div>
  );
}

function StatusPill({ value }: { value: string }) {
  const tone = value.includes('remediation') ? 'danger' : value.includes('review') || value.includes('proposed') ? 'warning' : 'success';
  return <span className={`demo-status demo-status--${tone}`}>{statusLabel(value as DemoMentee['status'])}</span>;
}

function HomeView({ onNavigate, onResource }: { onNavigate: (view: DemoView) => void; onResource: (resource: Resource) => void }) {
  return (
    <main>
      <section className="home-hero">
        <div className="home-hero__content">
          <p className="demo-eyebrow">{mentor.eyebrow}</p>
          <h1>Turn learning into<br /><em>forward motion.</em></h1>
          <p className="hero-lede">A private, organized space where mentees learn with intention, prepare for meaningful conversations, and keep their business goals moving.</p>
          <div className="button-row">
            <button className="demo-button" type="button" onClick={() => onNavigate('mentee')}>Explore as a Mentee <span aria-hidden="true">→</span></button>
            <button className="demo-button demo-button--secondary" type="button" onClick={() => onNavigate('mentor')}>Open Mentor Console</button>
          </div>
          <div className="trust-row" aria-label="Platform qualities"><span>Focused learning</span><span>Prepared meetings</span><span>Visible progress</span></div>
        </div>
        <aside className="mentor-card" aria-label="About Kenny">
          <div className="mentor-card__portrait" aria-hidden="true"><span>K</span></div>
          <div><p className="demo-eyebrow">Your mentor</p><h2>Kenny</h2><p>{mentor.biography}</p></div>
        </aside>
      </section>

      <section className="section-block" id="about">
        <div className="section-heading"><p className="demo-eyebrow">What mentees can build</p><h2>Clarity grows through practice.</h2><p>The platform keeps development resources, evidence of understanding, business objectives, and meeting preparation in one calm workspace.</p></div>
        <div className="feature-grid">
          {presentationCopy.learning.map((item, index) => <article className="feature-card" key={item}><span>0{index + 1}</span><h3>{item}</h3><p>{['Work through selected ideas with a clear reason for learning.', 'Apply each lesson to an active opportunity or challenge.', 'Capture what changed and demonstrate real understanding.', 'Arrive ready to discuss decisions, obstacles, and next actions.'][index]}</p></article>)}
        </div>
      </section>

      <section className="section-block process-section">
        <div className="section-heading"><p className="demo-eyebrow">The mentorship process</p><h2>A steady rhythm from insight to action.</h2></div>
        <ol className="process-list">
          {presentationCopy.process.map(([title, detail], index) => <li key={title}><span>{index + 1}</span><div><h3>{title}</h3><p>{detail}</p></div></li>)}
        </ol>
      </section>

      <section className="section-block">
        <div className="section-heading resource-heading"><div><p className="demo-eyebrow">Featured resources</p><h2>Everything needed for the next step.</h2></div><p>Original demo descriptions only. No external files or downloads.</p></div>
        <div className="resource-grid">
          {resources.map((resource) => <button className="resource-card" type="button" key={resource.id} onClick={() => onResource(resource)}><span className="resource-card__kind">{resource.kind}</span><span className="resource-card__icon" aria-hidden="true">{resource.kind[0]}</span><strong>{resource.title}</strong><small>{resource.summary}</small><span className="resource-card__action">View details →</span></button>)}
        </div>
      </section>

      <section className="objective-banner"><div><p className="demo-eyebrow">Business-development objectives</p><h2>Keep the work connected to a real outcome.</h2></div><ul>{presentationCopy.businessObjectives.map((item) => <li key={item}>{item}</li>)}</ul></section>
    </main>
  );
}

interface MenteeViewProps {
  mentee: DemoMentee;
  onChange: (change: (mentee: DemoMentee) => DemoMentee) => void;
  onZoom: () => void;
  onResource: (resource: Resource) => void;
}

function MenteeView({ mentee, onChange, onZoom, onResource }: MenteeViewProps) {
  const [assessmentError, setAssessmentError] = useState('');
  const [scheduleMode, setScheduleMode] = useState(false);
  const countdown = useCountdown(mentee.meeting.startsAt);
  const progress = mentee.assessmentStatus === 'passed' ? 82 : mentee.baseProgress;
  const preparedCount = Object.values(mentee.meeting.preparation).filter(Boolean).length;
  const latestFeedback = mentee.feedback[mentee.feedback.length - 1];

  const updateTakeaway = (index: number, value: string) => onChange((current) => {
    const takeaways: [string, string, string] = [...current.takeaways];
    takeaways[index] = value;
    return { ...current, takeaways };
  });

  const submitAssessment = (event: FormEvent) => {
    event.preventDefault();
    if (questions.some((question) => mentee.answers[question.id] === undefined)) {
      setAssessmentError('Answer all 10 questions before submitting. Your current selections are saved.');
      return;
    }
    if (mentee.takeaways.some((takeaway) => !takeaway.trim())) {
      setAssessmentError('Complete all three takeaway fields before submitting.');
      return;
    }
    if (mentee.assessmentStatus === 'remediation-required' && wordCount(mentee.reflection) < 250) {
      setAssessmentError(`Complete a reflection of at least 250 words before trying again (${wordCount(mentee.reflection)}/250 words).`);
      return;
    }
    const result = scoreAssessment(mentee.answers);
    onChange((current) => ({
      ...current,
      assessmentScore: result.score,
      assessmentStatus: result.passed ? 'passed' : 'remediation-required',
      status: result.passed ? 'needs-review' : 'remediation-required',
      attemptCount: current.attemptCount + 1,
      reviewed: false,
      certificateDate: result.passed ? new Date().toISOString().slice(0, 10) : null,
    }));
    setAssessmentError(result.passed ? '' : 'This attempt scored below 80%. Complete the reflection and revise all three takeaways before trying again.');
    document.getElementById('assessment-result')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <main className="dashboard-page">
      <section className="dashboard-intro">
        <div><p className="demo-eyebrow">Mentee workspace</p><h1>Good morning, {mentee.name.split(' ')[0]}.</h1><p>{mentee.welcome}</p></div>
        <div className="avatar" aria-hidden="true">{mentee.initials}</div>
      </section>

      <section className="dashboard-grid dashboard-grid--summary">
        <article className="panel progress-panel"><div className="panel-heading"><div><p className="panel-kicker">Your journey</p><h2>Overall progress</h2></div><strong className="large-stat">{progress}%</strong></div><ProgressBar value={progress} label="Program completion" /><p className="panel-note">{mentee.assessmentStatus === 'passed' ? 'Assignment complete—your certificate is unlocked.' : 'Complete the current assignment to reach your next milestone.'}</p></article>
        <article className="panel assignment-summary"><div><p className="panel-kicker">Current assignment</p><h2>{mentee.assignmentTitle}</h2><p>{assignment.overview}</p></div><StatusPill value={mentee.assessmentStatus} /></article>
        <article className="panel meeting-summary"><p className="panel-kicker">Next mentor meeting</p><h2>{mentee.meeting.title}</h2><p className="meeting-time">{formatDateTime(mentee.meeting.startsAt)}</p><div className="countdown"><span>Starts in</span><strong aria-live="polite">{countdown}</strong></div><button className="text-button" type="button" onClick={onZoom}>Open meeting details →</button></article>
      </section>

      <section className="panel learning-panel">
        <div className="learning-header"><div><p className="panel-kicker">Focused learning assignment</p><h2>{assignment.title}</h2><p>{assignment.overview}</p></div><div className="book-mark" aria-hidden="true">THINK<br />BIGGER</div></div>
        <div className="learning-objectives"><h3>Five learning objectives</h3><ol>{assignment.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ol></div>
        <div className="takeaway-grid">
          {assignment.takeawayPrompts.map((prompt, index) => <label key={prompt}><span>Takeaway {index + 1}</span><small>{prompt}</small><textarea rows={4} value={mentee.takeaways[index]} onChange={(event) => updateTakeaway(index, event.target.value)} placeholder="Capture your thinking in your own words…" /></label>)}
        </div>
      </section>

      <section className="panel assessment-panel" id="assessment">
        <div className="panel-heading"><div><p className="panel-kicker">Knowledge check</p><h2>Show what you understand</h2><p>Ten original questions · 80% required to pass · Demo scoring only</p></div>{mentee.assessmentScore !== null && <div id="assessment-result" className={`score-badge ${mentee.assessmentStatus === 'passed' ? 'score-badge--pass' : 'score-badge--fail'}`}><strong>{mentee.assessmentScore}%</strong><span>{mentee.assessmentStatus === 'passed' ? 'Passed' : 'Try again'}</span></div>}</div>
        {mentee.assessmentStatus === 'passed' ? (
          <div className="success-message"><strong>Assignment complete.</strong><span>Your progress is updated, Kenny can see your result, and your completion certificate is ready below.</span></div>
        ) : (
          <form onSubmit={submitAssessment} noValidate>
            {mentee.assessmentStatus === 'remediation-required' && <div className="remediation-box"><h3>Reflection before your next attempt</h3><p>Use at least 250 words to explain what you misunderstood, what evidence changed your thinking, and how you will apply the lesson. Revise all three takeaways above as well.</p><label>Remediation reflection <span className="word-count">{wordCount(mentee.reflection)}/250 words</span><textarea rows={9} value={mentee.reflection} onChange={(event) => onChange((current) => ({ ...current, reflection: event.target.value }))} placeholder="Reflect on your first attempt…" /></label></div>}
            <div className="question-list">
              {questions.map((question, questionIndex) => <fieldset key={question.id}><legend><span>{questionIndex + 1}</span>{question.prompt}</legend>{question.choices.map((choice, choiceIndex) => <label className="choice" key={choice}><input type="radio" name={question.id} value={choiceIndex} checked={mentee.answers[question.id] === choiceIndex} onChange={() => onChange((current) => ({ ...current, answers: { ...current.answers, [question.id]: choiceIndex } }))} /><span>{choice}</span></label>)}</fieldset>)}
            </div>
            {assessmentError && <div className="form-error" role="alert">{assessmentError}</div>}
            <div className="assessment-actions"><p>{Object.keys(mentee.answers).length} of {questions.length} answered · Attempt {mentee.attemptCount + 1}</p><button className="demo-button" type="submit">Submit assessment</button></div>
          </form>
        )}
      </section>

      <section className="dashboard-grid dashboard-grid--details">
        <article className="panel">
          <div className="panel-heading"><div><p className="panel-kicker">Meeting preparation</p><h2>Arrive ready to decide.</h2></div><span className="fraction-stat">{preparedCount}/3</span></div>
          <div className="checklist">{preparationItems.map((item) => <label key={item.id}><input type="checkbox" checked={Boolean(mentee.meeting.preparation[item.id])} onChange={(event) => onChange((current) => ({ ...current, meeting: { ...current.meeting, preparation: { ...current.meeting.preparation, [item.id]: event.target.checked } } }))} /><span>{item.label}</span></label>)}</div>
          <h3>Discussion questions</h3><ul className="clean-list">{discussionQuestions.map((question) => <li key={question}>{question}</li>)}</ul>
          <h3>Previous action items</h3><ul className="clean-list checked-list">{previousActionItems.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
        <div className="stacked-panels">
          <article className="panel"><p className="panel-kicker">Current objectives</p><h2>Business development</h2><ul className="objective-list">{mentee.objectives.map((objective, index) => <li key={objective}><span>0{index + 1}</span>{objective}</li>)}</ul></article>
          <article className="panel feedback-panel"><p className="panel-kicker">Recent mentor feedback</p><blockquote>{latestFeedback?.body ?? 'No feedback has been added yet.'}</blockquote>{latestFeedback && <small>{mentor.name} · {formatDate(latestFeedback.createdAt)}</small>}</article>
        </div>
      </section>

      <section className="panel scheduling-panel">
        <div><p className="panel-kicker">Meeting schedule</p><h2>{mentee.meeting.title}</h2><p className="meeting-time">{formatDateTime(mentee.meeting.startsAt)}</p><StatusPill value={mentee.meeting.schedulingStatus} /></div>
        <div className="schedule-actions">
          {!scheduleMode ? <><button className="demo-button" type="button" onClick={() => onChange((current) => ({ ...current, meeting: { ...current.meeting, schedulingStatus: 'accepted' } }))}>Accept proposed time</button><button className="demo-button demo-button--secondary" type="button" onClick={() => setScheduleMode(true)}>Request alternative</button></> : <fieldset><legend>Select an alternative sample time</legend>{mentee.meeting.proposedTimes.map((time) => <button className="alternative-time" type="button" key={time} onClick={() => { onChange((current) => ({ ...current, meeting: { ...current.meeting, startsAt: time, schedulingStatus: 'alternative-requested' } })); setScheduleMode(false); }}>{formatDateTime(time)}</button>)}<button className="text-button" type="button" onClick={() => setScheduleMode(false)}>Cancel</button></fieldset>}
        </div>
      </section>

      <section className="section-block dashboard-resources"><div className="section-heading"><p className="demo-eyebrow">Development library</p><h2>Resources for the work ahead.</h2></div><div className="resource-grid">{resources.map((resource) => <button className="resource-card compact" type="button" key={resource.id} onClick={() => onResource(resource)}><span className="resource-card__kind">{resource.kind}</span><strong>{resource.title}</strong><small>{resource.duration}</small></button>)}</div></section>

      {mentee.assessmentStatus === 'passed' && mentee.certificateDate && <section className="certificate"><div className="certificate__seal">KM</div><p className="demo-eyebrow">Certificate of completion</p><h2>{mentee.name}</h2><p>has completed the learning assignment</p><h3>{mentee.assignmentTitle}</h3><div className="certificate__meta"><span><small>Completion date</small>{formatDate(mentee.certificateDate)}</span><span><small>Mentor</small>{mentor.name}</span><span><small>Experience</small>Interactive MVP</span></div></section>}
    </main>
  );
}

interface MentorViewProps {
  state: DemoState;
  selectedId: string;
  onSelect: (id: string) => void;
  onChange: (id: string, change: (mentee: DemoMentee) => DemoMentee) => void;
}

function MentorView({ state, selectedId, onSelect, onChange }: MentorViewProps) {
  const mentee = state.mentees.find((item) => item.id === selectedId) ?? state.mentees[0];
  const [feedbackDraft, setFeedbackDraft] = useState('');
  const [notice, setNotice] = useState('');
  const preparedCount = Object.values(mentee.meeting.preparation).filter(Boolean).length;
  const progress = mentee.assessmentStatus === 'passed' ? 82 : mentee.baseProgress;

  const addFeedback = (event: FormEvent) => {
    event.preventDefault();
    if (!feedbackDraft.trim()) { setNotice('Write a feedback note before saving.'); return; }
    onChange(mentee.id, (current) => ({ ...current, feedback: [...current.feedback, { id: `feedback-${Date.now()}`, body: feedbackDraft.trim(), createdAt: new Date().toISOString() }] }));
    setFeedbackDraft('');
    setNotice('Feedback saved and visible in Mentee View.');
  };

  return (
    <main className="mentor-console">
      <section className="console-header"><div><p className="demo-eyebrow">Mentor console</p><h1>Welcome, Kenny.</h1><p>Review understanding, prepare your next conversation, and keep each mentee moving.</p></div><div className="console-stat"><strong>{state.mentees.length}</strong><span>Active mentees</span></div></section>
      <div className="console-layout">
        <aside className="mentee-list" aria-label="Mentee roster"><h2>Mentees</h2>{state.mentees.map((item) => <button type="button" key={item.id} className={item.id === mentee.id ? 'mentee-list__item active' : 'mentee-list__item'} onClick={() => { onSelect(item.id); setNotice(''); }} aria-pressed={item.id === mentee.id}><span className="avatar small-avatar">{item.initials}</span><span><strong>{item.name}</strong><small>{item.assignmentTitle}</small></span><StatusPill value={item.status} /></button>)}</aside>
        <section className="console-detail">
          <div className="mentee-detail-header"><div className="avatar">{mentee.initials}</div><div><p className="panel-kicker">Selected mentee</p><h2>{mentee.name}</h2><p>{mentee.assignmentTitle}</p></div><StatusPill value={mentee.status} /></div>
          <div className="metric-grid"><article><span>Overall progress</span><strong>{progress}%</strong><ProgressBar value={progress} label="Overall progress" /></article><article><span>Assessment score</span><strong>{mentee.assessmentScore === null ? '—' : `${mentee.assessmentScore}%`}</strong><small>{statusLabel(mentee.assessmentStatus)}</small></article><article><span>Meeting preparation</span><strong>{preparedCount}/3</strong><small>{preparedCount === 3 ? 'Ready to meet' : 'Items remaining'}</small></article><article><span>Review status</span><strong>{mentee.reviewed ? 'Reviewed' : 'Open'}</strong><small>{mentee.attemptCount} assessment attempt{mentee.attemptCount === 1 ? '' : 's'}</small></article></div>

          <div className="console-cards">
            <article className="panel"><div className="panel-heading"><div><p className="panel-kicker">Submitted understanding</p><h2>Three takeaways</h2></div>{mentee.takeaways.some(Boolean) && !mentee.reviewed && <button className="demo-button demo-button--small" type="button" onClick={() => { onChange(mentee.id, (current) => ({ ...current, reviewed: true, status: current.assessmentStatus === 'passed' ? 'on-track' : current.status })); setNotice('Submitted work marked reviewed.'); }}>Mark work reviewed</button>}</div>{mentee.takeaways.some(Boolean) ? <ol className="submitted-list">{mentee.takeaways.map((takeaway, index) => <li key={`${mentee.id}-${index}`}><span>0{index + 1}</span><p>{takeaway || 'No takeaway submitted.'}</p></li>)}</ol> : <p className="empty-state">No takeaways submitted yet.</p>}{mentee.reflection && <><h3>Remediation reflection</h3><p className="reflection-copy">{mentee.reflection}</p></>}</article>
            <article className="panel"><p className="panel-kicker">Current objectives</p><h2>Next business outcomes</h2><ul className="objective-list">{mentee.objectives.map((objective, index) => <li key={objective}><span>0{index + 1}</span>{objective}</li>)}</ul></article>
            <article className="panel"><p className="panel-kicker">Meeting preparation</p><h2>{mentee.meeting.title}</h2><p className="meeting-time">{formatDateTime(mentee.meeting.startsAt)}</p><div className="checklist read-only">{preparationItems.map((item) => <div key={item.id}><span aria-hidden="true">{mentee.meeting.preparation[item.id] ? '✓' : '○'}</span>{item.label}</div>)}</div><StatusPill value={mentee.meeting.schedulingStatus} /><h3>Propose a sample time</h3><div className="proposal-row">{alternativeMeetingTimes.map((time) => <button className="alternative-time" type="button" key={time} onClick={() => { onChange(mentee.id, (current) => ({ ...current, meeting: { ...current.meeting, startsAt: time, schedulingStatus: 'proposed' } })); setNotice('New sample meeting time proposed and visible in Mentee View.'); }}>{formatDateTime(time)}</button>)}</div></article>
            <article className="panel"><p className="panel-kicker">Mentor feedback</p><h2>Add a private coaching note</h2><form onSubmit={addFeedback}><label htmlFor="mentor-feedback">Feedback for {mentee.name.split(' ')[0]}</label><textarea id="mentor-feedback" rows={5} value={feedbackDraft} onChange={(event) => setFeedbackDraft(event.target.value)} placeholder="Add a clear, encouraging next step…" /><div className="form-footer"><small>This demo note will appear in Mentee View.</small><button className="demo-button demo-button--small" type="submit">Save feedback</button></div></form></article>
          </div>
          {notice && <div className="toast" role="status">{notice}</div>}
        </section>
      </div>
    </main>
  );
}

export function DemoApp() {
  const [state, setState] = useState<DemoState>(() => readDemoState());
  const [view, setView] = useState<DemoView>('home');
  const [selectedMentorMentee, setSelectedMentorMentee] = useState(state.activeMenteeId);
  const [resource, setResource] = useState<Resource | null>(null);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);

  useEffect(() => setStorageAvailable(saveDemoState(state)), [state]);

  const activeMentee = useMemo(() => state.mentees.find((mentee) => mentee.id === state.activeMenteeId) ?? state.mentees[0], [state]);
  const changeMentee = useCallback((id: string, change: (mentee: DemoMentee) => DemoMentee) => {
    setState((current) => ({ ...current, mentees: current.mentees.map((mentee) => mentee.id === id ? change(mentee) : mentee) }));
  }, []);
  const navigate = (nextView: DemoView) => { setView(nextView); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const confirmReset = () => {
    const next = resetDemoState();
    setState(next); setSelectedMentorMentee(next.activeMenteeId); setView('home'); setResetOpen(false); setStorageAvailable(true);
  };

  return (
    <div className="demo-app">
      <PresentationToolbar view={view} onNavigate={navigate} onReset={() => setResetOpen(true)} />
      {!storageAvailable && <div className="storage-warning" role="status">Local saving is unavailable in this browser session. You can continue exploring, but changes may not survive a refresh.</div>}
      {view === 'home' && <HomeView onNavigate={navigate} onResource={setResource} />}
      {view === 'mentee' && <MenteeView mentee={activeMentee} onChange={(change) => changeMentee(activeMentee.id, change)} onZoom={() => setZoomOpen(true)} onResource={setResource} />}
      {view === 'mentor' && <MentorView state={state} selectedId={selectedMentorMentee} onSelect={setSelectedMentorMentee} onChange={changeMentee} />}
      <footer className="demo-footer"><strong>Kenny Mentor</strong><span>Interactive presentation MVP · Local demo data only</span></footer>

      {resource && <Modal title={resource.title} onClose={() => setResource(null)} actions={<button className="demo-button" type="button" onClick={() => setResource(null)}>Done</button>}><p className="modal-kicker">{resource.kind} · {resource.duration}</p><p>{resource.detail}</p><div className="simulation-note">Presentation preview only—no external file or download is attached.</div></Modal>}
      {zoomOpen && <Modal title="Meeting link preview" onClose={() => setZoomOpen(false)} actions={<button className="demo-button" type="button" onClick={() => setZoomOpen(false)}>Got it</button>}><p>The confirmed Zoom meeting link would open here.</p><div className="simulation-note">No real Zoom URL is used in this interactive MVP.</div></Modal>}
      {resetOpen && <Modal title="Reset the interactive demo?" onClose={() => setResetOpen(false)} actions={<><button className="demo-button demo-button--secondary" type="button" onClick={() => setResetOpen(false)}>Keep my changes</button><button className="demo-button demo-button--danger" type="button" onClick={confirmReset}>Reset demo</button></>}><p>This restores all fictional mentees, answers, takeaways, feedback, progress, and meeting times to their presentation defaults.</p></Modal>}
    </div>
  );
}
