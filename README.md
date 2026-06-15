# Yorisoi AI (寄り添いAI)

Connecting care, AI that stays by your side.

## Overview

Yorisoi AI is a multi-agent eldercare platform for health monitoring, safety assessment, care coordination, and AI-led orchestration. The deployed experience centers on a dashboard-driven demo with seeded patient data, live analysis controls, and a full care pipeline that combines specialist agent outputs into a unified care plan.

## Live Demo

- [Production site](https://elderly-care-agent.vercel.app/)
- The dashboard opens with a seeded patient snapshot and a live language switcher.
- The main home screen includes quick actions for predefined scenarios, live analysis, and custom patient entry.

## What The App Does

- Presents a patient dashboard with current health, safety, care, and manager summaries.
- Lets you inspect each specialist agent independently from the Agent Hub.
- Supports live analysis of a custom patient intake form.
- Runs a sequential multi-agent pipeline: Health -> Safety -> Care -> Manager.
- Falls back to validated local patient data when live analysis cannot complete.
- Shows agent collaboration, activity feed, analytics, patient profile, and live API bridge sections on the home page.

## Main Pages

- `/` - dashboard home with the active patient snapshot, quick actions, analytics, and live API bridge.
- `/agents` - agent hub for standalone execution and orchestration overview.
- `/agents/health` - health and wellness agent page.
- `/agents/safety` - safety and emergency agent page.
- `/agents/care` - care coordination agent page.
- `/agents/manager` - AI care manager page.
- `/analyze` - live analysis form for custom patient input.

## Backend Routes

- `/api/health-agent` - runs the health agent for a patient.
- `/api/safety-agent` - runs the safety agent for a patient.
- `/api/care-agent` - runs the care agent for a patient.
- `/api/manager-agent` - runs the manager agent for a patient.
- `/api/analyze` - runs the full pipeline for a selected patient.
- `/api/analyze/live` - runs live analysis from submitted vitals and notes.

## Architecture

- The dashboard is driven by `src/lib/dashboard-data.ts`, which assembles a patient snapshot from validated data and derives the agent summaries shown on the home page.
- The home page loads the snapshot server-side, then renders the dashboard client in `src/components/dashboard/dashboard-client.tsx`.
- The live dashboard sections map to the deployed experience: hero summary, demo quick actions, agent collaboration flow, agent status feed, analytics chart, patient profile, and live AI refresh panel.
- Agent pages use shared layout and UI components from `src/components/agents` and `src/components/dashboard`.
- Language state is managed in `src/lib/language-context.tsx`, with English and Japanese translations available through `src/locales`.
- Prompts and orchestration context live under `src/prompts` and the agent utilities in `src/lib/utils/agents`.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts
- Groq SDK
- Supabase
- Vercel

## Project Structure

- `src/app` - App Router pages, layouts, and API routes.
- `src/components` - dashboard, agent, shared, and UI components.
- `src/lib` - orchestration logic, data helpers, utilities, and translation state.
- `src/data` - validated mock data, scenarios, and seed collections.
- `src/prompts` - agent prompt definitions and project context.
- `src/types` - shared TypeScript types for patients, incidents, medications, and agent responses.

## Setup Guide

### Prerequisites

- Node.js 20 or newer.
- npm.
- A Groq API key for live agent routes and custom analysis.

### Environment Variables

Create a `.env.local` file in the project root with at least this value:

```bash
GROQ_API_KEY=your_groq_api_key
```

Optional overrides:

```bash
GROQ_MODEL=llama-3.3-70b-versatile
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.1
```

### Install And Run

```bash
npm install
npm run dev
```

Open http://localhost:3000 after the dev server starts.

### Verify The App

- The dashboard home page should load with a seeded patient snapshot.
- The Agent Hub should open from `/agents`.
- The live analysis page at `/analyze` should accept custom patient data.
- The agent routes and live analysis routes require `GROQ_API_KEY`.

## Scripts

- `npm run dev` - start the local development server.
- `npm run build` - create a production build.
- `npm run start` - run the production server.
- `npm run lint` - run ESLint.

## Notes

- The app is English-first for UI text.
- Japanese is reserved for branding and proper names.
- The current implementation is an active hackathon build with mocked and validated data sources.
- The deployed footer labels the project as built for Hackathon 2026.
