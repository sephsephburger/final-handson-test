## Pomodoro Timer Web App

A simple, responsive Pomodoro timer with configurable focus/break durations, optional auto-start behavior, alarm + notifications, lightweight tasks with estimates, and daily progress tracking.

### Setup
1) Python 3.11 (see `.python-version`).  
2) Create and activate a virtual env: `python -m venv .venv` then `.\.venv\Scripts\activate` (Windows) or `source .venv/bin/activate` (macOS/Linux).  
3) Install the project in editable mode: `python -m pip install -e .`

### Run the app
```
python main.py --port 8000
```
Then open http://localhost:8000.

### Features
- Focus, Short Break, Long Break modes with start/pause/resume/skip, tab-title countdown, and mode suggestions based on long break interval.
- Settings for durations, auto-start toggles, alarm tone/volume, notification opt-in, and auto-increment of the active task on focus completion; persisted locally.
- Task list with notes, estimates, active task selection, done/undo, reordering, clear completed, and quick +1/-1 adjustment.
- Daily metrics for completed Pomodoros, focused minutes, estimated finish time, and manual reset.
- “Test alarm” button, in-app banner for session end, and notification permission helper.

### Notes and next steps
- No external dependencies are required to run; assets live under `public/`.  
- Linting/tests are not wired yet; plan to add `black`, `ruff`, and `pytest` in `pyproject.toml` plus `tests/` coverage for timer state, persistence, and task logic.  
- If a browser blocks audio autoplay, interact with the page once and retry the alarm test; notifications require explicit permission.
