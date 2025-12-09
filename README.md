# Pomodoro Timer Web App

A focused Pomodoro timer with configurable Focus/Break cycles, audible and visual alerts, lightweight tasks, and daily progress tracking. This repo also acts as a working demo of "The Holy Trinity of AI Development" (PRD + TODO + AGENTS) from the attached presentation.

## Quick links
- PRD (the "What/Why"): `PRD.md`
- TODO roadmap (the "When"): `TODO.md`
- AGENTS rules (the "How"): `AGENTS.md`
- App entrypoint/server: `main.py`
- Static UI: `public/index.html`, `public/app.js`, `public/styles.css`

## Run locally
1) Install Python 3.11 (see `.python-version`).  
2) Create a venv: `python -m venv .venv` then `.\.venv\Scripts\activate` (Windows) or `source .venv/bin/activate` (macOS/Linux).  
3) Install in editable mode (no external deps yet): `python -m pip install -e .`  
4) Serve the app: `python main.py --port 8000` (default 8000).  
5) Open `http://localhost:8000` in a browser.

## What you get
- Timer modes: Focus, Short Break, Long Break with start/pause/resume/skip and a visible current mode indicator.
- Intelligent flow: tab-title countdown and suggested next mode based on a configurable long-break interval.
- Settings: durations, auto-start toggles, alarm tone/volume, notification opt-in, and optional auto-increment of the active task on Focus completion (all persisted locally).
- Tasks: add/edit, notes, reorder, pick an active task, complete/undo, clear completed, and quick +/-1 estimate adjustments.
- Daily metrics: completed Pomodoros, focused minutes, and estimated finish time with manual reset.
- Signals: "test alarm" button, in-app banner when a session ends, and a notification permission helper.

## How this repo reflects "The Holy Trinity of AI Development"
The presentation frames AI-assisted delivery the same way big tech ships software: strong documents reduce risk and control agent behavior.
- Working Backwards / Design Docs / Context Anchors: PRDs are the source of truth that prevent scope creep and hallucinated features.
- Three contexts the agent must read: PRD -> TODO -> AGENTS -> then code. You review and iterate.

Use the bundled docs as live examples for the talk:
- PRD.md ("What/Why") - Goal, strict tech stack, numbered features, constraints, use cases, and acceptance criteria to keep scope tight.
- TODO.md ("When") - Phased, atomic tasks with checkboxes; ask the AI to "do Task N," then mark `[x]` when done.
- AGENTS.md ("How") - System prompt for coding style, stack constraints, and dev commands; expand it whenever the AI makes a mistake.

Best practices surfaced in the deck:
- Be specific and keep PRD/TODO/AGENTS updated as requirements shift.
- Keep tasks small and sequential; one clear ask per AI prompt.
- Link PRD sections in PRs, and add rules to AGENTS when something goes wrong to prevent repeats.

## Repo structure (orientation for the demo)
- `main.py` - Minimal threaded HTTP server that serves the static UI from `public/`.
- `public/` - `index.html` shell, `styles.css` for layout/visuals, `app.js` for timer logic, settings, tasks, storage, and notifications.
- `PRD.md` - Product direction and constraints for the Pomodoro experience.
- `TODO.md` - Delivery plan and remaining work (tests/lint still pending).
- `AGENTS.md` - Guidance for contributors/AI runs (PEP 8, testing hints, commit/PR expectations).
