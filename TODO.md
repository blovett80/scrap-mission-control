# Mission Control — Project TODO

> NextJS + Convex + shadcn/ui dashboard for OpenClaw management

## Phase 1: Setup & Foundation
- [ ] Initialize NextJS project with shadcn/ui
- [ ] Setup Convex database
- [ ] Configure TypeScript types for all data models
- [ ] Setup project structure (components, pages, convex schema)
- [ ] Create basic layout with navigation

## Phase 2: Tasks Board
- [ ] Design task schema (id, title, status, assignee: 'me'|'assistant', createdAt, updatedAt)
- [ ] Build task board UI (columns: backlog, in-progress, done)
- [ ] Add task creation/editing
- [ ] Real-time updates via Convex
- [ ] **Integration hook:** API endpoint for OpenClaw to read/write tasks

**Prompt:** "Please build a task board for us that tracks all the tasks we are working on. I should be able to see the status of every task and who the task is assigned to, me or you. Moving forward please put all tasks you work on into this board and update it in real time."

## Phase 3: Content Pipeline
- [ ] Design content schema (id, title, stage: idea|script|thumbnail|filming|published, script, thumbnailUrl)
- [ ] Build kanban-style pipeline UI
- [ ] Rich text editing for scripts
- [ ] Image upload for thumbnails
- [ ] **Integration hook:** OpenClaw can generate thumbnails via local image model

**Prompt:** "Please build me a content pipeline tool. I want it to have every stage of content creation in it. I should be able to edit ideas and put full scripts in it and attach images if need be. I want you to manage this pipeline with me and add wherever you can."

## Phase 4: Calendar
- [ ] Design scheduled task schema (id, title, scheduledAt, recurrence, completed)
- [ ] Build calendar view (month/week/day)
- [ ] Show OpenClaw cron jobs and scheduled tasks
- [ ] **Integration hook:** Sync with OpenClaw cron system

**Prompt:** "Please build a calendar for us in the mission control. All your scheduled tasks and cron jobs should live here. Anytime I have you schedule a task, put it in the calendar so I can ensure you are doing them correctly."

## Phase 5: Memory
- [ ] Memory document viewer (reads from ~/workspace/memory/)
- [ ] Full-text search across all memories
- [ ] Beautiful document rendering
- [ ] **Integration hook:** Index memories for search

**Prompt:** "Please build a memory screen in our mission control. It should list all your memories in beautiful documents. We should also have a search component so I can quickly search through all our memories."

## Phase 6: Team
- [ ] Agent schema (id, name, role, responsibilities, status: active|idle)
- [ ] Team directory view
- [ ] Agent creation/management
- [ ] **Integration hook:** Track subagents spawned by OpenClaw

**Prompt:** "Please build me a team structure screen. It should show you, plus all the subagents you regularly spin up to do work. If you haven't thought about which sub agents you spin up, please create them and organize them by roles and responsibilities. This should be developers, writers, and designers as examples."

## Phase 7: Office
- [ ] Visual office layout with avatars
- [ ] Real-time agent status (working at computer, idle)
- [ ] Click agent to see what they're working on
- [ ] **Integration hook:** Poll OpenClaw subagent status

**Prompt:** "Please build me a digital office screen where I can view each agent working. They should be represented by individual avatars and have their own work areas and computers. When they are working they should be at their computer. I should be able to quickly view the status of every team member."

## Phase 8: OpenClaw Integration
- [ ] REST API for OpenClaw to read/write all data
- [ ] WebSocket or polling for real-time updates
- [ ] Authentication (API key)
- [ ] Document integration endpoints for all tools

## Tech Stack
- **Frontend:** Next.js 14 + React + TypeScript + Tailwind CSS + shadcn/ui
- **Backend/DB:** Convex (real-time sync)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **File Storage:** Local filesystem (memories) + Convex (app data)

## Current Phase: Phase 1 — Setup
