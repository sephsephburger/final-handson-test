# TODO

## P1 (MVP)
- [ ] Set up local env: `python -m venv .venv`, activate, then `python -m pip install -e .`; add `pytest`, `black`, and `ruff` to `pyproject.toml`.
- [x] Pick frontend stack for the web app (SPA is acceptable) and wire it to Python tooling; keep `main.py` as entry point or replace with a simple web server that serves the UI.
- [x] Establish project layout (e.g., `src/`, `public/`, `tests/`) and update `README.md` accordingly.
- [x] Implement Focus, Short Break, Long Break modes with start/pause/resume/skip and a visible current mode indicator.
- [x] Use timestamp-based countdown to prevent drift; update the tab title with remaining time.
- [x] Suggest next mode after Focus, honoring configurable long-break interval.
- [x] Build settings panel for focus/break durations, long-break interval, auto-start toggles, alarm sound + volume, and notification opt-in; apply to upcoming sessions.
- [x] Persist settings locally (e.g., browser storage); keep `.python-version` and `pyproject.toml` in sync if bumping runtime.
- [x] Provide a "test alarm" and clear explanation when audio autoplay is blocked or notifications are denied.
- [x] On session end, play alarm, trigger notification when permitted, and show an in-app banner until dismissed or next session starts.
- [x] Store session end timestamps to restore running timers after refresh; show "Session finished" if it ended while away.
- [x] Build lightweight task list with add/edit, notes, reorder, active task, complete, clear completed, and Pomodoro estimates.
- [x] On Focus completion, optionally auto-increment the active task's completed count (toggle this behavior).
- [x] Show daily metrics: completed Pomodoros, focused minutes, and estimated finish time based on remaining estimates.
- [x] Reset daily progress by local date; allow manual reset.
- [x] Deliver responsive layout for desktop and mobile; ensure keyboard navigation, focus states, screen reader labels; keep timer legible and tasks optionally collapsible.
- [ ] Add `tests/` with `pytest` covering timer transitions, persistence, auto-start toggles, notification gating, task auto-increment toggle, and daily reset logic; run `python -m pytest` before PRs.
- [ ] Add lint/format tools (`ruff`, `black`) to `pyproject.toml` and run before PRs.

## P2 (Polish & Delivery)
- [x] Refine `README.md` with final setup/run/build commands (e.g., `python main.py` or new server command).
- [ ] Keep commits concise and imperative; PRs should link to PRD sections, list new commands/config, and include screenshots or terminal output for UX changes.
- [ ] Decide defaults: task list visible by default or behind a toggle; alarm sounds and volumes; whether task auto-increment is on or off by default.
