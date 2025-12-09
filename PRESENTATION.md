# Pomodoro Timer Demo — One-Pager

Use this as a quick, slide-friendly reference while presenting.

## The Holy Trinity (Agent Context)
- PRD.md — What/Why: goal, tech stack, numbered features, constraints, use cases, acceptance criteria.
- TODO.md — When: phased, atomic tasks with checkboxes; prompt the AI with one task at a time.
- AGENTS.md — How: coding rules, stack constraints, commands, testing expectations; expand when the AI errs.
- Flow: AI reads PRD → TODO → AGENTS → writes code → you review. Prevents scope creep and hallucinations.

## Why Docs Matter (Talk Track)
- Mirrors Amazon “Working Backwards” and Google “Design Docs”: align early, avoid rework.
- Documents are the control surface for AI: clear intent → safer outputs.
- Keep them living: tighten scope, add rules after mistakes, link PRD sections in PRs.

## Demo Map (Repo)
- `main.py` — tiny HTTP server for the static app.
- `public/index.html`, `public/app.js`, `public/styles.css` — UI, logic, persistence, notifications.
- `PRD.md`, `TODO.md`, `AGENTS.md` — the Trinity in action.

## App Highlights (Show Live)
- Timer: Focus/Short Break/Long Break; start/pause/resume/skip; tab-title countdown; next-mode suggestions.
- Settings: durations, auto-start toggles, alarm tone/volume, notification opt-in, optional task auto-increment; all persisted locally.
- Tasks: add/edit, notes, reorder, active task, complete/undo, clear completed, quick +/-1 estimates.
- Signals & metrics: test alarm, end-of-session banner, notifications helper, daily counts, focused minutes, ETA, manual reset.

## How to Run (remind audience)
```bash
python -m venv .venv
.\.venv\Scripts\activate   # or source .venv/bin/activate
python -m pip install -e .
python main.py --port 8000
```
Open http://localhost:8000.

## Call to Action
- Ask: “Do Task N from TODO” to let the AI execute safely.
- Update PRD/TODO/AGENTS after changes or incidents.
- Add tests + lint next (`pytest`, `ruff`, `black`) to lock quality.
