# Kenny Mentor Presentation MVP

This interactive presentation demonstrates the proposed Kenny Mentor experience with fictional, browser-local data. It is not the production mentorship platform and does not connect to authentication, Supabase, email, Zoom, payments, or a community backend.

## Install and start

From `C:\Users\cfra8\Desktop\kenny_mentor_demo`, install the exact locked dependencies:

```powershell
npm ci
```

Start the presentation server:

```powershell
npm run dev -- --host 127.0.0.1
```

Open:

```text
http://127.0.0.1:5173/
```

The demo is offline-friendly after its local JavaScript bundle has loaded. It uses no external fonts, images, media, credentials, or downloads.

## Reset the demo

Select **Reset Demo** in the persistent presentation toolbar, then confirm the dialog. This clears the locally saved fictional answers, takeaways, assessment result, feedback, review status, and scheduling changes. Clearing browser site data for `127.0.0.1:5173` has the same effect.

## Five-minute presentation sequence

1. **Homepage and purpose (35 seconds).** Introduce Kenny using only the confirmed biography and show the learn–reflect–prepare–act mentorship rhythm.
2. **Mentee dashboard (35 seconds).** Open Mentee View and point out overall progress, the active assignment, business objectives, meeting countdown, and recent feedback.
3. **Assignment and takeaways (40 seconds).** Open *The Magic of Thinking Big*, summarize the original high-level overview and objectives, and enter three brief takeaways.
4. **Assessment and progress update (55 seconds).** Complete the ten-question demo knowledge check. A score of at least 80% completes the assignment, updates progress, and unlocks the certificate. Briefly explain that a lower score opens a 250-word reflection and revised-takeaway path.
5. **Meeting preparation (35 seconds).** Check preparation items, show discussion questions and previous action items, then demonstrate the simulated Zoom dialog.
6. **Mentor console and review (45 seconds).** Switch to Mentor View, select across three fictional mentees, compare statuses, inspect aggregate scores and takeaways, and mark Maya's work reviewed.
7. **Scheduling and certificate (35 seconds).** Propose a sample meeting time, return to Mentee View to show synchronization, and finish on the unlocked certificate.
8. **Production roadmap (20 seconds).** Explain that a later phase adds secure authentication, Supabase persistence, audited relationship controls, and the recursive Operator network described in the approved architecture—none of which is implemented in this MVP.

## What is functional

- Persistent Home, Mentee View, Mentor View, and Reset Demo controls.
- Ten-question scoring with unanswered-question validation and an inclusive 80% pass threshold.
- Passing progress, completion status, and certificate unlock.
- Below-threshold remediation status, a 250-word reflection requirement, revised takeaways, and another attempt.
- Browser-local persistence with invalid-data fallback and a visible warning when storage is unavailable.
- Synchronized mentee and mentor views for results, submitted work, feedback, review status, meeting preparation, and scheduling.
- Accessible resource, Zoom-information, and reset dialogs; keyboard controls and visible focus states.
- Responsive presentation layout and a simple printable certificate view.

## What is simulated

- The role switcher is a presentation control, not authentication or authorization.
- All names, objectives, meetings, resources, results, and notes are fictional demo content.
- Assessment scoring runs locally and is not the production assessment-security design.
- Resource cards are descriptions only; no books, PDFs, audio, video, or conference files are distributed.
- The Zoom action shows an explanatory dialog and has no meeting URL.
- Scheduling, feedback, review, and certificates exist only in this browser's local storage.

## What the production roadmap adds later

- Real identity, invitation, Operator relationship, and direct-edge authorization foundations.
- Supabase persistence, carefully scoped row-level security, safe views or RPCs, and transactional audit events.
- Secure production assessment attempts and server-authoritative scoring.
- Managed resource storage, original media workflows, and file access policies.
- Real meeting-provider integration, notification delivery, community capabilities, and operational monitoring.
- The future recursive Operator network, subject to the approved security architecture and a separate implementation review.
