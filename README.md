LifeLens AI is a role-based health and longevity coaching web app built with React, TypeScript, Vite, Firebase, and Google Gemini. It combines patient self-tracking, doctor-side monitoring, AI-generated meal planning, workout recommendations, medication adherence, family health linking, and a conversational AI coach in a single interface.

This project is designed around two user types:

- `Patient`: logs daily health data, views AI-generated plans, tracks progress, records medication adherence, and chats with the AI coach.
- `Doctor`: manages patient records, reviews daily logs, prescribes pills, links family members, and inspects family-level hereditary risk patterns.

## What This Project Does

The app collects health and lifestyle metrics, stores them in Firebase, generates a personalized plan, and keeps the experience synced in real time using Firestore listeners.

Core flow:

1. A user signs up as either a patient or a doctor.
2. A patient completes a health profile with baseline metrics.
3. The app generates a personalized plan using Gemini-backed nutrition generation plus local workout and longevity logic.
4. The user logs daily vitals and symptoms.
5. Health logs update dashboards, medication status, family risk views, progress charts, and AI chat context.
6. Doctors can review patients, prescribe medications, and link related family members for broader health context.

## Main Features

### 1. Authentication and role-based access

- Firebase Authentication with email/password sign-in and sign-up
- Separate patient and doctor flows from the same login screen
- Automatic routing into the correct dashboard after authentication
- Firestore-backed profile creation after Auth account creation
- Session reset logic that forces the app to open on the login screen on first load of a browser session

### 2. Patient health profile onboarding

Patients can create or update a detailed profile that includes:

- Name, email, age, gender
- Height and weight
- Activity level
- Fitness goal
- Food preference
- Existing health issues
- Resting heart rate
- Daily sleep
- Daily steps
- Systolic blood pressure
- Smoking status
- Diet quality
- Stress level

This profile is used as the base input for plan generation and future daily check-ins.

### 3. Doctor profile onboarding

Doctors have a lighter onboarding flow than patients:

- Account creation via Firebase Auth
- Firestore doctor profile creation with role metadata
- Editable doctor display name
- Read-only email display

### 4. AI-powered meal planning

The nutrition layer is generated in `services/geminiService.ts`.

What it does:

- Builds a prompt from the user profile plus recent health context
- Uses the Gemini Generate Content API
- Requests strict JSON output for safer parsing
- Produces:
  - Daily calorie target
  - Protein, carbs, and fats
  - Hydration guidance
  - Example breakfast, lunch, dinner, and snack items
- Falls back to a deterministic local meal plan if the AI call fails or if parsing fails

The generated plan is personalized using:

- Weight
- Height
- Age
- Goal
- Activity level
- Food preference
- Health issues
- Recent health score average
- Recent average steps

### 5. Fitness and longevity plan generation

The complete plan object includes:

- `dietPlan`
- `workoutPlan`
- `summary`
- `longevityAnalysis`

Current implementation behavior:

- Nutrition is generated via Gemini first
- Workout and longevity sections are assembled from local defaults and structured app logic
- The final plan is stored in Firestore under the `plans` collection
- Plan regeneration is supported from the dashboard, meal plan view, and workout plan view

### 6. Longevity analysis dashboard

The patient dashboard presents a health-intelligence view with:

- Health score
- Estimated biological age
- BMI and BMI status
- Longevity drivers
- Positive and negative impact factors
- Biological age comparison against chronological age
- Current vitals snapshot
- Medication completion status for the day

This is presented as a high-visual glassmorphic dashboard with theme-aware styling.

### 7. Daily check-in system

Patients are prompted to complete a daily check-in when they reach the dashboard and have not logged for the current day.

Daily check-in captures:

- Weight
- Resting heart rate
- Sleep hours
- Steps
- Blood pressure
- Stress level
- Free-text feedback and symptoms
- Medication taken status

Special behavior:

- Cancer-related users get a more detailed feedback prompt
- The check-in writes both profile updates and a dated `healthLogs` entry
- Medication adherence is included in the same daily log

### 8. Automatic daily log creation on login

When a patient logs in and has not yet created a health log for the day, the app can auto-create a log entry using:

- Current weight
- Existing health score
- Existing biological age
- Current step count

This helps keep progress tracking continuous even before a manual check-in is completed.

### 9. Progress analytics and charting

The progress screen uses Recharts to visualize historical trends.

Tracked trend outputs include:

- Health score over time
- Biological age over time
- Empty states for no history
- Single-entry summary state
- Multi-entry chart view with tooltip support

### 10. AI coach chat

The `AICoach` component is a conversational assistant that uses Gemini with rich runtime context.

The AI coach receives:

- User demographic data
- Current health metrics
- Last 7 days of health logs
- Weight trend
- Active diet plan and macros
- Active workout plan summary
- Recent feedback notes
- Longevity analysis insights

Capabilities:

- Context-aware welcome message
- Suggested quick prompts
- Markdown rendering for responses
- Copy-to-clipboard for AI replies
- Fallback educational responses when the live API call fails

The coach is intended to provide personalized advice rather than generic wellness responses.

### 11. Medication management

Medication features are split between doctor and patient experiences.

Doctor side:

- Add prescribed pills to a patient
- Remove prescribed pills
- Review medication adherence in health logs

Patient side:

- View currently prescribed pills
- Mark today’s medication as taken or pending
- Sync adherence into today’s health log
- See medication compliance in dashboard and timeline views

### 12. Doctor dashboard

The doctor dashboard provides:

- Real-time patient directory
- Selectable patient detail panel
- Patient demographic summary
- Health issue summary
- Medication management
- Family tree entry point
- Family linking modal
- Historical timeline of daily health logs
- Visibility into:
  - Medication adherence
  - Health score
  - Biological age
  - Weight
  - Steps
  - Patient feedback

### 13. Family health linking and hereditary awareness

Patients can be grouped by a shared `familyId`.

Family features include:

- Relationship tagging:
  - Father
  - Mother
  - Child
  - Sibling
  - Grandparent
  - Self
  - Other
- Grouped family visualization by relationship
- Doctor ability to create a family link or add additional members
- Detection of common hereditary risks from health issue text:
  - Diabetes
  - Cancer
  - BP
  - Thyroid
  - Heart Disease
- Clinical recommendation card for grouped family risk patterns

### 14. Workout routine view with local completion tracking

Workout data comes from the generated plan and is displayed as a task-like routine.

Features:

- Exercise list with sets, reps, and notes
- Per-exercise completion toggle
- Completion state saved in `localStorage`
- Persistence key derived from the current workout plan structure
- Regeneration support for a new routine

### 15. Theme system and UI styling

The visual system is defined primarily in `index.html` with CSS variables and Tailwind utility usage.

UI traits:

- Custom light and dark theme tokens
- Persisted theme preference in `localStorage`
- Glassmorphism-style cards
- Gradient accent system
- Bento-style dashboard cards
- Typography using `Syne` and `DM Sans`
- Markdown styling for AI responses
- Responsive layout

## Technical Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS v4 plugin plus CDN-configured Tailwind utilities in `index.html`
- Motion for animated chat/message transitions
- React Markdown for coach responses
- Recharts for progress charts

### Backend and data

- Firebase Authentication
- Cloud Firestore
- Firebase config loaded from `firebase-applet-config.json`

### AI

- Google Gemini Generate Content API
- Primary model: `gemini-2.0-flash-exp`
- Fallback model: `gemini-2.0-flash`

### Deployment

- Vercel-ready SPA rewrite config in `vercel.json`

## Real-Time Data Behavior

The app relies heavily on Firestore `onSnapshot` listeners.

Real-time subscriptions include:

- Current user profile
- All patients for doctor users
- Current user plan
- Family members for the active family context

This means updates from one screen are reflected across other screens without a manual reload.

## Data Model Overview

### `UserProfile`

Important fields:

- `id`
- `email`
- `role`
- `name`
- `age`
- `height`
- `weight`
- `gender`
- `activityLevel`
- `fitnessGoal`
- `foodPreference`
- `healthIssues`
- `prescribedPills`
- `healthLogs`
- `weightLogs`
- `restingHeartRate`
- `dailySleep`
- `dailySteps`
- `systolicBP`
- `smokingStatus`
- `dietQuality`
- `stressLevel`
- `familyId`
- `familyRelationship`

### `HealthLog`

Each daily entry can include:

- `date`
- `weight`
- `healthScore`
- `bioAge`
- `steps`
- `dailyFeedback`
- `symptoms`
- `medicationTaken`

### `GeneratedPlan`

Contains:

- Meal plan with daily macros and sample meals
- Workout frequency and routine
- Summary
- Optional longevity analysis block

## Firestore Collections

Based on the app code, the project expects at least these documents/collections:

- `users/{uid}`
- `plans/{uid}`
- `test/connection` used during connection validation

## Project Structure

```text
.
├── App.tsx
├── index.tsx
├── index.html
├── types.ts
├── firebase.ts
├── firebase-applet-config.json
├── firestore.rules
├── vercel.json
├── vite.config.ts
├── components/
│   ├── AICoach.tsx
│   ├── DailyCheckIn.tsx
│   ├── DashboardHome.tsx
│   ├── DoctorDashboard.tsx
│   ├── DoctorProfile.tsx
│   ├── FamilyTreeView.tsx
│   ├── InputForm.tsx
│   ├── Login.tsx
│   ├── MealPlanView.tsx
│   ├── MedicationView.tsx
│   ├── PlanDisplay.tsx
│   ├── ProgressView.tsx
│   ├── Sidebar.tsx
│   └── WorkoutPlanView.tsx
└── services/
    └── geminiService.ts
```

## Screen-by-Screen Breakdown

### Login

- Sign in or register
- Choose role: patient or doctor
- Handles password validation for registration

### Profile

- Patient: full health metrics form
- Doctor: name editor
- Patient profile submission immediately triggers plan generation

### Dashboard

- Patient: health overview, biological age, longevity drivers, vitals snapshot
- Doctor: patient management dashboard

### Meal Plan

- Displays AI nutrition output
- Shows daily macros and sample meals
- Supports plan regeneration

### Workout Plan

- Displays exercise routine
- Lets user mark exercises complete
- Saves completion progress locally

### Progress

- Trend charts for health score and biological age
- Reset history action

### AI Coach

- Chat interface with suggested prompts
- Personalized Gemini responses

### Medications

- Shows active prescriptions
- Lets patient mark medication as taken for today

### Family Tree

- Displays grouped family relationships
- Shows health issues and hereditary risk awareness
- Allows doctors to build family links

## Environment Variables

### Required

The app expects a Gemini API key.

Important implementation note:

- `vite.config.ts` maps `GEMINI_API_KEY` from your `.env` file into `import.meta.env.VITE_GEMINI_API_KEY`
- That means the current project setup expects this in `.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Recommended `.env`

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Firebase

Firebase configuration is currently sourced from:

- `firebase-applet-config.json`

If you move Firebase config into environment variables later, you will need to update `firebase.ts` accordingly.

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Add your environment file

Create `.env` in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Verify Firebase config

Make sure `firebase-applet-config.json` points to a valid Firebase project and Firestore database.

### 4. Run the app

```bash
npm run dev
```

### 5. Type-check

```bash
npm run lint
```

### 6. Production build

```bash
npm run build
```

### 7. Preview production build

```bash
npm run preview
```

## Deployment Notes

### Vercel

The included `vercel.json` rewrites all routes to `index.html`, which is required for this single-page app structure:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Error Handling Strategy

The app includes:

- A top-level React error boundary
- Structured Firestore error logging in `firebase.ts`
- JSON-stringified Firestore error detail payloads
- Fallback meal plans when Gemini fails
- Fallback AI coach educational replies when chat generation fails

## Notable Implementation Details

### Firestore error helper

`handleFirestoreError` captures:

- Error message
- Operation type
- Firestore path
- Current auth context
- Auth provider metadata

This makes debugging permission and document issues easier during development.

### Medication status logic

Medication adherence is stored inside daily `healthLogs`, not in a separate medication log collection.

### Workout completion storage

Exercise completion is client-side only and stored in `localStorage`.

### Theme persistence

Theme preference is stored in `localStorage` under:

- `fitcoach_theme`

## Current Limitations and Practical Notes

- Workout generation is currently template-based rather than AI-generated.
- Longevity scoring is currently default-driven and not yet medically validated.
- The doctor dashboard currently lists all users with the patient role rather than assigned subsets.
- Family hereditary analysis is keyword-based from `healthIssues`, not diagnosis-code based.
- Gemini calls are made directly from the frontend, so API key handling should be reviewed before production hardening.
- The sample `.env.example` in the repo currently contains a concrete value and should be replaced with a placeholder before sharing publicly.

## Best Use Cases

- Personal health tracking app
- Longevity coaching prototype
- AI wellness assistant demo
- Doctor-patient monitoring dashboard
- Family health visualization prototype
- Firebase + Gemini full-stack frontend reference

## Scripts

```json
{
  "dev": "vite",
  "build": "vite build",
  "lint": "tsc --noEmit",
  "preview": "vite preview"
}
```

## Summary

LifeLens AI is a feature-rich health intelligence app that combines:

- role-based authentication
- health profile onboarding
- AI meal generation
- workout planning
- biological age and longevity views
- daily check-ins
- progress analytics
- medication adherence tracking
- doctor-side patient review
- family health linking
- conversational AI coaching

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
