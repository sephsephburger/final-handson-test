# Repository Guidelines

## Project Structure & Module Organization
- Core entrypoint lives in `main.py` and currently prints a placeholder greeting; expand timer logic here or split into helper modules kept alongside it for now.
- Metadata and Python version are defined in `pyproject.toml` and `.python-version` (Python 3.11). Keep these in sync when adding dependencies.
- Product direction is captured in `PRD.md`; align feature work with the documented timer modes and workflow.
- Docs sit in the repo root (`README.md`, this file). Add new docs here unless you introduce a dedicated `docs/` folder.

## Environment, Build, Test, and Development Commands
- Create a virtual environment: `python -m venv .venv` then `.\.venv\Scripts\activate` (Windows) or `source .venv/bin/activate` (Unix).
- Install the package in editable mode (dependencies are currently empty): `python -m pip install -e .`
- Run the app locally: `python main.py`
- If you add tests with pytest: `python -m pip install pytest` then `python -m pytest`

## Coding Style & Naming Conventions
- Follow PEP 8: 4-space indentation, 88–100 character lines, and meaningful naming.
- Functions and variables use `lower_snake_case`; classes use `CamelCase`; constants are `UPPER_SNAKE_CASE`.
- Prefer small, pure functions for timer transitions and duration calculations; add docstrings when behavior is non-obvious.
- No linters are configured yet; if you add them, favor `black` and `ruff` in `pyproject.toml` and run them before pushing.

## Testing Guidelines
- Use `pytest` with tests placed under `tests/`, naming files `test_*.py` and functions `test_*`.
- Cover timer state changes, duration customization, and persistence behavior as you implement them; mock external side effects like notifications.
- Target fast, deterministic tests; keep fixtures minimal and scoped to functions unless sharing setup is necessary.

## Commit & Pull Request Guidelines
- Commit messages: concise, present tense, imperative (e.g., `Add timer mode switching`). Keep related changes together.
- Pull requests: describe the change, link to relevant PRD sections, note any new commands or config, and include screenshots or terminal output if user-facing behavior changes.
- Ensure the branch is rebased on main and that tests/lint (if added) pass before requesting review.

## Security & Configuration Tips
- Do not commit secrets or tokens; use environment variables for any future integrations.
- Respect the pinned Python version (3.11). Update `.python-version` and `pyproject.toml` together if you bump it.
