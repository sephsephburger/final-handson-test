(() => {
  const STORAGE_KEYS = {
    settings: "pomodoro:settings",
    tasks: "pomodoro:tasks",
    session: "pomodoro:session",
    daily: "pomodoro:daily",
  };

  const defaultSettings = {
    focusMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartFocus: false,
    alarmSound: "beep",
    volume: 0.6,
    notifications: false,
    autoIncrement: true,
  };

  const els = {
    timeRemaining: document.getElementById("time-remaining"),
    activeTaskLabel: document.getElementById("active-task-label"),
    startBtn: document.getElementById("start-btn"),
    pauseBtn: document.getElementById("pause-btn"),
    resumeBtn: document.getElementById("resume-btn"),
    skipBtn: document.getElementById("skip-btn"),
    modeButtons: Array.from(document.querySelectorAll(".mode-btn")),
    sessionBanner: document.getElementById("session-banner"),
    testAlarm: document.getElementById("test-alarm-btn"),
    notificationBtn: document.getElementById("notification-permission-btn"),
    taskForm: document.getElementById("task-form"),
    taskList: document.getElementById("task-list"),
    taskTitle: document.getElementById("task-title"),
    taskNotes: document.getElementById("task-notes"),
    taskEstimate: document.getElementById("task-estimate"),
    clearCompleted: document.getElementById("clear-completed"),
    toggleTaskPanel: document.getElementById("toggle-task-panel"),
    focusMinutes: document.getElementById("focus-minutes"),
    shortBreakMinutes: document.getElementById("short-break-minutes"),
    longBreakMinutes: document.getElementById("long-break-minutes"),
    longBreakInterval: document.getElementById("long-break-interval"),
    autoStartBreaks: document.getElementById("auto-start-breaks"),
    autoStartFocus: document.getElementById("auto-start-focus"),
    alarmVolume: document.getElementById("alarm-volume"),
    alarmSound: document.getElementById("alarm-sound"),
    notificationOptIn: document.getElementById("notification-opt-in"),
    autoIncrement: document.getElementById("auto-increment"),
    saveSettings: document.getElementById("save-settings"),
    metricPomodoros: document.getElementById("metric-pomodoros"),
    metricMinutes: document.getElementById("metric-minutes"),
    metricFinish: document.getElementById("metric-finish"),
    metricNextMode: document.getElementById("metric-next-mode"),
    resetDay: document.getElementById("reset-day"),
    tabTitleHelper: document.getElementById("tab-title-helper"),
  };

  let settings = loadSettings();
  let tasks = loadTasks();
  let daily = loadDaily();
  let state = loadSession(settings);
  let ticker = null;

  hydrateSettingsForm(settings);
  renderTasks();
  renderProgress();
  renderTimer();
  ensureNotificationButton();
  resumeIfNeeded();

  bindControls();

  function getTodayKey() {
    const now = new Date();
    return [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");
  }

  function loadSettings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.settings);
      return raw ? { ...defaultSettings, ...JSON.parse(raw) } : { ...defaultSettings };
    } catch (err) {
      console.warn("Failed to read settings, using defaults", err);
      return { ...defaultSettings };
    }
  }

  function saveSettings() {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
  }

  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.tasks);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.warn("Failed to read tasks, starting empty", err);
      return [];
    }
  }

  function saveTasks() {
    localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
  }

  function loadDaily() {
    const today = getTodayKey();
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.daily);
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed && parsed.date === today) {
        return parsed;
      }
    } catch (err) {
      console.warn("Failed to read daily metrics", err);
    }
    const fresh = { date: today, pomodoros: 0, minutes: 0 };
    localStorage.setItem(STORAGE_KEYS.daily, JSON.stringify(fresh));
    return fresh;
  }

  function saveDaily() {
    localStorage.setItem(STORAGE_KEYS.daily, JSON.stringify(daily));
  }

  function defaultState(currentSettings) {
    return {
      mode: "focus",
      running: false,
      remainingSeconds: currentSettings.focusMinutes * 60,
      endTime: null,
      completedFocus: 0,
    };
  }

  function loadSession(currentSettings) {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.session);
      const parsed = raw ? JSON.parse(raw) : null;
      if (!parsed) return defaultState(currentSettings);
      const next = { ...defaultState(currentSettings), ...parsed };
      return next;
    } catch (err) {
      console.warn("Failed to read session state", err);
      return defaultState(currentSettings);
    }
  }

  function saveSession() {
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(state));
  }

  function bindControls() {
    els.modeButtons.forEach((btn) =>
      btn.addEventListener("click", () => setMode(btn.dataset.mode))
    );

    els.startBtn.addEventListener("click", () => startTimer());
    els.pauseBtn.addEventListener("click", () => pauseTimer());
    els.resumeBtn.addEventListener("click", () => resumeTimer());
    els.skipBtn.addEventListener("click", () => skipSession());
    els.testAlarm.addEventListener("click", () => playAlarm(true));
    els.notificationBtn.addEventListener("click", requestNotificationPermission);
    els.resetDay.addEventListener("click", resetDaily);
    els.toggleTaskPanel.addEventListener("click", toggleTasks);
    els.clearCompleted.addEventListener("click", clearCompletedTasks);

    els.taskForm.addEventListener("submit", (e) => {
      e.preventDefault();
      addTask();
    });

    els.taskList.addEventListener("click", onTaskAction);
    els.sessionBanner.addEventListener("click", (e) => {
      if (e.target.dataset.action === "dismiss-banner") {
        hideBanner();
      }
    });

    els.saveSettings.addEventListener("click", () => {
      updateSettingsFromForm();
      persistSettingsAndSession();
      banner("Settings saved and applied to upcoming sessions.");
    });
  }

  function hydrateSettingsForm(data) {
    els.focusMinutes.value = data.focusMinutes;
    els.shortBreakMinutes.value = data.shortBreakMinutes;
    els.longBreakMinutes.value = data.longBreakMinutes;
    els.longBreakInterval.value = data.longBreakInterval;
    els.autoStartBreaks.checked = data.autoStartBreaks;
    els.autoStartFocus.checked = data.autoStartFocus;
    els.alarmVolume.value = data.volume;
    els.alarmSound.value = data.alarmSound;
    els.notificationOptIn.checked = data.notifications;
    els.autoIncrement.checked = data.autoIncrement;
  }

  function updateSettingsFromForm() {
    settings = {
      ...settings,
      focusMinutes: clamp(Number(els.focusMinutes.value) || 25, 1, 120),
      shortBreakMinutes: clamp(Number(els.shortBreakMinutes.value) || 5, 1, 60),
      longBreakMinutes: clamp(Number(els.longBreakMinutes.value) || 15, 1, 90),
      longBreakInterval: clamp(Number(els.longBreakInterval.value) || 4, 1, 10),
      autoStartBreaks: Boolean(els.autoStartBreaks.checked),
      autoStartFocus: Boolean(els.autoStartFocus.checked),
      alarmSound: els.alarmSound.value,
      volume: clamp(Number(els.alarmVolume.value) || 0.6, 0, 1),
      notifications: Boolean(els.notificationOptIn.checked),
      autoIncrement: Boolean(els.autoIncrement.checked),
    };
    saveSettings();
    state.remainingSeconds = getDurationForMode(state.mode) * 60;
    saveSession();
    renderTimer();
    ensureNotificationButton();
  }

  function ensureNotificationButton() {
    const status = Notification?.permission ?? "default";
    if (status === "granted") {
      els.notificationBtn.textContent = "Notifications enabled";
      els.notificationBtn.disabled = true;
      settings.notifications = true;
      els.notificationOptIn.checked = true;
      saveSettings();
    } else {
      els.notificationBtn.textContent = "Enable notifications";
      els.notificationBtn.disabled = false;
    }
  }

  function requestNotificationPermission() {
    if (!("Notification" in window)) {
      banner("Notifications are not supported in this browser.");
      return;
    }
    Notification.requestPermission().then(() => ensureNotificationButton());
  }

  function setMode(mode) {
    if (state.running && !confirm("Switching modes will stop the current timer. Continue?")) {
      return;
    }
    hideBanner();
    stopTimer();
    state.mode = mode;
    state.remainingSeconds = getDurationForMode(mode) * 60;
    saveSession();
    renderTimer();
  }

  function startTimer() {
    if (state.running) return;
    hideBanner();
    state.running = true;
    state.endTime = Date.now() + state.remainingSeconds * 1000;
    saveSession();
    tick();
    ticker = setInterval(tick, 500);
    renderTimer();
  }

  function resumeTimer() {
    if (state.running || state.remainingSeconds <= 0) return;
    startTimer();
  }

  function pauseTimer() {
    if (!state.running) return;
    stopTimer(true);
  }

  function stopTimer(preserveRemaining = false) {
    state.running = false;
    state.endTime = null;
    if (!preserveRemaining) {
      state.remainingSeconds = getDurationForMode(state.mode) * 60;
    }
    if (ticker) {
      clearInterval(ticker);
      ticker = null;
    }
    saveSession();
    renderTimer();
  }

  function skipSession() {
    const confirmSkip = confirm("Skip this session and move to the next mode?");
    if (!confirmSkip) return;
    stopTimer(false);
    const nextMode = nextSuggestedMode();
    state.mode = nextMode;
    state.remainingSeconds = getDurationForMode(nextMode) * 60;
    saveSession();
    renderTimer();
    banner("Session skipped.");
  }

  function tick() {
    if (!state.running || state.endTime === null) return;
    const remaining = Math.max(0, Math.round((state.endTime - Date.now()) / 1000));
    state.remainingSeconds = remaining;
    renderTimer();
    if (remaining <= 0) {
      stopTimer(true);
      completeSession();
    }
  }

  function completeSession() {
    const finishedMode = state.mode;
    if (finishedMode === "focus") {
      state.completedFocus += 1;
      daily.pomodoros += 1;
      daily.minutes += settings.focusMinutes;
      incrementActiveTaskIfNeeded();
      saveDaily();
    }

    playAlarm();
    maybeNotify(`${labelForMode(finishedMode)} complete`);
    banner(`${labelForMode(finishedMode)} finished. Good work!`);

    const nextMode = nextSuggestedMode();
    state.mode = nextMode;
    state.remainingSeconds = getDurationForMode(nextMode) * 60;
    saveSession();
    renderProgress();
    renderTimer();

    if (shouldAutoStart(nextMode)) {
      startTimer();
    }
  }

  function shouldAutoStart(mode) {
    if (mode === "focus") return settings.autoStartFocus;
    return settings.autoStartBreaks;
  }

  function resumeIfNeeded() {
    if (state.running && state.endTime) {
      const remaining = Math.round((state.endTime - Date.now()) / 1000);
      if (remaining > 0) {
        state.remainingSeconds = remaining;
        state.running = false;
        startTimer();
      } else {
        state.running = false;
        state.remainingSeconds = 0;
        renderTimer();
        completeSession();
      }
    }
  }

  function getDurationForMode(mode) {
    switch (mode) {
      case "short_break":
        return settings.shortBreakMinutes;
      case "long_break":
        return settings.longBreakMinutes;
      default:
        return settings.focusMinutes;
    }
  }

  function labelForMode(mode) {
    if (mode === "short_break") return "Short break";
    if (mode === "long_break") return "Long break";
    return "Focus";
  }

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(totalSeconds % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  function renderTimer() {
    els.timeRemaining.textContent = formatTime(state.remainingSeconds);
    const active = tasks.find((t) => t.active);
    els.activeTaskLabel.textContent = active ? `Working on: ${active.title}` : "No active task";

    const fullDurationSeconds = getDurationForMode(state.mode) * 60;
    const hasProgress = state.remainingSeconds < fullDurationSeconds;
    els.modeButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.mode === state.mode);
    });

    els.startBtn.style.display =
      state.running || hasProgress || state.remainingSeconds < 1 ? "none" : "inline-block";
    els.pauseBtn.style.display = state.running ? "inline-block" : "none";
    els.resumeBtn.style.display =
      !state.running && hasProgress && state.remainingSeconds > 0 ? "inline-block" : "none";

    document.title = state.running
      ? `${formatTime(state.remainingSeconds)} — Pomodoro`
      : "Pomodoro Timer";
    els.tabTitleHelper.textContent = document.title;

    els.metricNextMode.textContent = labelForMode(nextSuggestedMode());
  }

  function renderTasks() {
    els.taskList.innerHTML = "";
    if (!tasks.length) {
      const li = document.createElement("li");
      li.className = "task-item";
      li.textContent = "No tasks yet. Add one to stay organized.";
      els.taskList.appendChild(li);
      return;
    }

    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = `task-item${task.active ? " active" : ""}`;
      li.dataset.id = task.id;

      const row = document.createElement("div");
      row.className = "task-row";

      const main = document.createElement("div");
      main.className = "task-main";
      const title = document.createElement("div");
      title.textContent = task.title;
      if (task.done) title.style.textDecoration = "line-through";
      const notes = document.createElement("p");
      notes.className = "muted";
      notes.textContent = task.notes || "";

      const meta = document.createElement("div");
      meta.className = "task-actions";
      const estimate = document.createElement("span");
      estimate.className = "pill";
      estimate.textContent = `Est: ${task.estimate} • Done: ${task.completed}`;

      const active = document.createElement("span");
      active.className = "pill";
      active.textContent = task.active ? "Active" : "Set active";
      active.dataset.action = "activate";

      meta.appendChild(estimate);
      meta.appendChild(active);
      main.appendChild(title);
      if (task.notes) main.appendChild(notes);
      main.appendChild(meta);

      const actions = document.createElement("div");
      actions.className = "task-actions";
      actions.innerHTML = `
        <button data-action="done" class="ghost small">${task.done ? "Undo" : "Done"}</button>
        <button data-action="inc" class="ghost small">+1</button>
        <button data-action="dec" class="ghost small">-1</button>
        <button data-action="up" class="ghost small" ${index === 0 ? "disabled" : ""}>Move up</button>
        <button data-action="down" class="ghost small" ${
          index === tasks.length - 1 ? "disabled" : ""
        }>Move down</button>
      `;

      row.appendChild(main);
      row.appendChild(actions);
      li.appendChild(row);
      els.taskList.appendChild(li);
    });
    saveTasks();
    renderProgress();
  }

  function addTask() {
    const title = els.taskTitle.value.trim();
    if (!title) return;
    const notes = els.taskNotes.value.trim();
    const estimate = clamp(Number(els.taskEstimate.value) || 1, 1, 12);
    const task = {
      id: crypto.randomUUID ? crypto.randomUUID() : `task-${Date.now()}`,
      title,
      notes,
      estimate,
      completed: 0,
      done: false,
      active: tasks.length === 0,
    };
    tasks.push(task);
    saveTasks();
    els.taskForm.reset();
    els.taskEstimate.value = "1";
    renderTasks();
    banner("Task added.");
  }

  function onTaskAction(event) {
    const action = event.target.dataset.action;
    if (!action) return;
    const li = event.target.closest("li");
    const id = li?.dataset.id;
    if (!id) return;
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return;
    const task = tasks[index];

    switch (action) {
      case "done":
        task.done = !task.done;
        if (task.done) task.active = false;
        break;
      case "inc":
        task.completed = Math.min(task.completed + 1, task.estimate);
        break;
      case "dec":
        task.completed = Math.max(task.completed - 1, 0);
        break;
      case "activate":
        tasks = tasks.map((t) => ({ ...t, active: t.id === id && !task.done }));
        break;
      case "up":
        if (index > 0) {
          [tasks[index - 1], tasks[index]] = [tasks[index], tasks[index - 1]];
        }
        break;
      case "down":
        if (index < tasks.length - 1) {
          [tasks[index + 1], tasks[index]] = [tasks[index], tasks[index + 1]];
        }
        break;
      default:
        break;
    }
    saveTasks();
    renderTasks();
  }

  function clearCompletedTasks() {
    tasks = tasks.filter((t) => !t.done);
    if (!tasks.some((t) => t.active) && tasks.length) {
      tasks[0].active = true;
    }
    saveTasks();
    renderTasks();
  }

  function toggleTasks() {
    const isHidden = els.taskList.style.display === "none";
    els.taskList.style.display = isHidden ? "grid" : "none";
    els.taskForm.style.display = isHidden ? "grid" : "none";
    els.toggleTaskPanel.textContent = isHidden ? "Collapse" : "Expand";
  }

  function incrementActiveTaskIfNeeded() {
    if (!settings.autoIncrement) return;
    const active = tasks.find((t) => t.active && !t.done);
    if (!active) return;
    active.completed = Math.min(active.completed + 1, active.estimate);
    if (active.completed >= active.estimate) {
      active.done = true;
      active.active = false;
    }
    saveTasks();
    renderTasks();
  }

  function renderProgress() {
    daily = loadDaily();
    els.metricPomodoros.textContent = daily.pomodoros;
    els.metricMinutes.textContent = daily.minutes;
    els.metricFinish.textContent = estimateFinishTime();
    els.metricNextMode.textContent = labelForMode(nextSuggestedMode());
  }

  function estimateFinishTime() {
    const remainingPoms = tasks
      .filter((t) => !t.done)
      .reduce((acc, t) => acc + Math.max(0, (t.estimate || 0) - (t.completed || 0)), 0);
    if (remainingPoms === 0) return "--";
    const totalMinutes = remainingPoms * settings.focusMinutes;
    const eta = new Date(Date.now() + totalMinutes * 60 * 1000);
    return eta.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function nextSuggestedMode() {
    if (state.mode === "focus") {
      const nextFocusCount = state.completedFocus + 1;
      if (nextFocusCount % settings.longBreakInterval === 0) return "long_break";
      return "short_break";
    }
    return "focus";
  }

  function banner(message) {
    els.sessionBanner.innerHTML = `<span>${message}</span><button class="ghost small" data-action="dismiss-banner">Dismiss</button>`;
    els.sessionBanner.classList.remove("hidden");
  }

  function hideBanner() {
    els.sessionBanner.classList.add("hidden");
    els.sessionBanner.innerHTML = "";
  }

  function playAlarm(isTest = false) {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const tone = settings.alarmSound === "soft" ? 440 : 880;
      osc.type = "sine";
      osc.frequency.value = tone;
      gain.gain.value = settings.volume;
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + (isTest ? 0.4 : 1));
    } catch (err) {
      console.warn("Alarm failed", err);
      banner("Alarm blocked by browser. Enable sound/interaction to hear alerts.");
    }
  }

  function maybeNotify(body) {
    if (!settings.notifications || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    new Notification("Pomodoro Timer", { body });
  }

  function resetDaily() {
    daily = { date: getTodayKey(), pomodoros: 0, minutes: 0 };
    saveDaily();
    renderProgress();
  }

  function persistSettingsAndSession() {
    saveSettings();
    saveSession();
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }
})();
