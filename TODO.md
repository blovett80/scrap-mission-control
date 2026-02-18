# Mission Control — Project TODO

> NextJS + Convex + shadcn/ui dashboard for OpenClaw management

## Phase 1: Setup & Foundation
- [x] Initialize NextJS project with shadcn/ui
- [x] Setup Convex database (schema + provider)
- [x] Configure TypeScript types for all data models
- [x] Setup project structure (components, pages, convex schema)
- [x] Create basic layout with navigation
- [x] Create all 6 tool page layouts (Tasks, Content, Calendar, Memory, Team, Office)
- [x] Install shadcn UI components (button, card, input)

## Phase 2: Tasks Board
- [x] Design task schema
- [x] Build task board UI (columns, cards)
- [x] Real-time updates via Convex
- [x] Task creation/deletion
- [ ] Task editing (title/description)
- [ ] Drag-and-drop between columns
- [ ] **Integration hook:** API endpoint for OpenClaw to read/write tasks

## Phase 3: Content Pipeline
- [x] Design content schema
- [ ] Build kanban-style pipeline UI
- [ ] Rich text editing for scripts
- [ ] Image upload for thumbnails
- [ ] Wire up with Convex backend
- [ ] **Integration:** OpenClaw can generate thumbnails via AI

## Phase 4: Calendar
- [x] Design scheduled task schema
- [ ] Build calendar view (month/week/day)
- [ ] Wire up with Convex backend
- [ ] Show OpenClaw cron jobs
- [ ] **Integration:** Sync with OpenClaw cron system

## Phase 5: Memory
- [x] Design memory schema
- [ ] Memory document viewer (reads from ~/workspace/memory/)
- [ ] Full-text search across all memories
- [ ] Beautiful document rendering
- [ ] **Integration:** Index memories for search

## Phase 6: Team
- [x] Design agent schema
- [ ] Team directory view with real data
- [ ] Agent creation/management
- [ ] **Integration:** Track subagents spawned by OpenClaw

## Phase 7: Office
- [ ] Visual office layout with avatars
- [ ] Real-time agent status (working at computer, idle)
- [ ] Click agent to see what they're working on
- [ ] **Integration:** Poll OpenClaw subagent status

## Phase 8: OpenClaw Integration
- [ ] REST API for OpenClaw to read/write all data
- [ ] WebSocket or polling for real-time updates
- [ ] Authentication (API key)
- [ ] Document integration endpoints

## Active Tasks (in Tasks Board)
Check the Tasks page in Mission Control for current work items.

## Tech Stack
- **Frontend:** Next.js 14 + React + TypeScript + Tailwind CSS + shadcn/ui
- **Backend/DB:** Convex (real-time sync)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **File Storage:** Local filesystem (memories) + Convex (app data)
