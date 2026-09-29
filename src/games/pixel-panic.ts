type GameState =
  | "ready"
  | "arming"
  | "active"
  | "success"
  | "gameover";

const GAME_CLASS = "jtj-pixel-panic";
const BEST_SCORE_KEY = "jtj-pixel-panic-best";

const GRID_SIZE = 3;
const CELL_COUNT = GRID_SIZE * GRID_SIZE;

const START_DELAY = 1200;
const MIN_DELAY = 420;

const INITIAL_LIVES = 3;

function getRequiredElement<T extends Element>(
  root: ParentNode,
  selector: string,
): T {
  const element = root.querySelector<T>(selector);

  if (!element) {
    throw new Error(
      `[PIXEL PANIC] Missing element: ${selector}`,
    );
  }

  return element;
}

function getBestScore(): number {
  try {
    return Number(
      localStorage.getItem(BEST_SCORE_KEY) ?? "0",
    ) || 0;
  } catch {
    return 0;
  }
}

function saveBestScore(score: number) {
  try {
    localStorage.setItem(
      BEST_SCORE_KEY,
      String(Math.max(0, Math.floor(score))),
    );
  } catch {
    // Storage can fail in restricted browser contexts.
  }
}

function formatScore(value: number): string {
  return String(
    Math.max(0, Math.floor(value)),
  ).padStart(5, "0");
}

function injectStyles() {
  if (
    document.head.querySelector(
      '[data-pixel-panic-style="true"]',
    )
  ) {
    return;
  }

  const style = document.createElement("style");

  style.dataset.pixelPanicStyle = "true";

  style.textContent = `
    .${GAME_CLASS} {
      --bg: #090909;
      --panel: #101010;
      --panel-2: #151515;
      --line: #2a2a2a;
      --text: #f4f1e8;
      --muted: #8d8d8d;
      --soft: #1d1d1d;
      --signal: #ffffff;
      --danger: #ff4d4d;
      --success: #73ff9b;

      min-height: min(760px, calc(100svh - 32px));
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 14px;
      box-sizing: border-box;
      background: var(--bg);
      color: var(--text);
      border: 1px solid var(--line);
      font-family:
        ui-monospace,
        SFMono-Regular,
        Menlo,
        Monaco,
        Consolas,
        monospace;
    }

    .${GAME_CLASS} *,
    .${GAME_CLASS} *::before,
    .${GAME_CLASS} *::after {
      box-sizing: border-box;
    }

    .${GAME_CLASS}-topbar {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .${GAME_CLASS}-stat {
      border: 1px solid var(--line);
      background: var(--panel);
      padding: 10px 12px;
    }

    .${GAME_CLASS}-stat-label {
      display: block;
      margin-bottom: 4px;
      color: var(--muted);
      font-size: 9px;
      line-height: 1;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    .${GAME_CLASS}-stat-value {
      display: block;
      font-size: clamp(17px, 5vw, 24px);
      font-weight: 900;
      line-height: 1;
      letter-spacing: -0.04em;
    }

    .${GAME_CLASS}-header {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 2px 0 0;
    }

    .${GAME_CLASS}-eyebrow {
      color: var(--muted);
      font-size: 9px;
      line-height: 1;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    .${GAME_CLASS}-title {
      margin: 0;
      font-size: clamp(28px, 9vw, 52px);
      line-height: 0.92;
      letter-spacing: -0.07em;
    }

    .${GAME_CLASS}-subtitle {
      margin: 0;
      max-width: 38rem;
      color: #aaa;
      font-size: 11px;
      line-height: 1.5;
    }

    .${GAME_CLASS}-hud {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      min-height: 38px;
      border-top: 1px solid var(--line);
      border-bottom: 1px solid var(--line);
      padding: 9px 0;
    }

    .${GAME_CLASS}-state {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      color: var(--muted);
      font-size: 9px;
      line-height: 1;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .${GAME_CLASS}-state-dot {
      width: 7px;
      height: 7px;
      flex: 0 0 auto;
      background: var(--muted);
    }

    .${GAME_CLASS}-round {
      color: var(--text);
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .${GAME_CLASS}-instruction {
      min-height: 54px;
      display: grid;
      place-items: center;
      padding: 10px;
      border: 1px solid var(--line);
      background: var(--panel);
      text-align: center;
      font-size: clamp(12px, 3.8vw, 16px);
      font-weight: 900;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .${GAME_CLASS}-board-shell {
      position: relative;
      display: grid;
      place-items: center;
      padding: 2px;
    }

    .${GAME_CLASS}-board {
      width: min(100%, 430px);
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
      touch-action: manipulation;
      user-select: none;
    }

    .${GAME_CLASS}-cell {
      position: relative;
      aspect-ratio: 1;
      min-width: 0;
      border: 1px solid #292929;
      padding: 0;
      background: var(--soft);
      color: var(--muted);
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      transition:
        transform 90ms ease,
        background-color 90ms ease,
        border-color 90ms ease,
        color 90ms ease;
    }

    .${GAME_CLASS}-cell::before {
      content: "";
      position: absolute;
      inset: 22%;
      border: 1px solid #333;
      pointer-events: none;
    }

    .${GAME_CLASS}-cell:active {
      transform: scale(0.96);
    }

    .${GAME_CLASS}-cell.signal {
      background: var(--signal);
      border-color: var(--signal);
      color: #090909;
    }

    .${GAME_CLASS}-cell.signal::before {
      border-color: #090909;
    }

    .${GAME_CLASS}-cell.success {
      background: var(--success);
      border-color: var(--success);
      color: #07120b;
    }

    .${GAME_CLASS}-cell.success::before {
      border-color: #07120b;
    }

    .${GAME_CLASS}-cell.error {
      background: var(--danger);
      border-color: var(--danger);
      color: #190707;
    }

    .${GAME_CLASS}-cell.error::before {
      border-color: #190707;
    }

    .${GAME_CLASS}-cell:disabled {
      cursor: default;
    }

    .${GAME_CLASS}-cell-number {
      position: absolute;
      left: 8px;
      top: 7px;
      font-size: 8px;
      font-weight: 800;
      letter-spacing: 0.05em;
      opacity: 0.65;
    }

    .${GAME_CLASS}-cell-corner {
      position: absolute;
      right: 8px;
      bottom: 7px;
      font-size: 8px;
      opacity: 0.45;
    }

    .${GAME_CLASS}-panel {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .${GAME_CLASS}-panel-block {
      min-width: 0;
      border: 1px solid var(--line);
      background: var(--panel);
      padding: 10px 12px;
    }

    .${GAME_CLASS}-panel-label {
      display: block;
      margin-bottom: 5px;
      color: var(--muted);
      font-size: 8px;
      line-height: 1;
      letter-spacing: 0.13em;
      text-transform: uppercase;
    }

    .${GAME_CLASS}-panel-value {
      display: block;
      min-height: 18px;
      font-size: 10px;
      font-weight: 800;
      line-height: 1.35;
      text-transform: uppercase;
    }

    .${GAME_CLASS}-lives {
      display: flex;
      gap: 5px;
      margin-top: 2px;
    }

    .${GAME_CLASS}-life {
      width: 18px;
      height: 8px;
      background: #313131;
    }

    .${GAME_CLASS}-life.alive {
      background: var(--text);
    }

    .${GAME_CLASS}-action {
      width: 100%;
      min-height: 58px;
      border: 1px solid var(--text);
      background: var(--text);
      color: #090909;
      font: inherit;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    .${GAME_CLASS}-action:active {
      transform: translateY(1px);
    }

    .${GAME_CLASS}-action:disabled {
      border-color: var(--line);
      background: var(--panel-2);
      color: var(--muted);
      cursor: default;
    }

    .${GAME_CLASS}-footer {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      margin-top: auto;
      color: var(--muted);
      font-size: 8px;
      line-height: 1.4;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .${GAME_CLASS}-footer span:last-child {
      text-align: right;
    }

    .${GAME_CLASS}.is-arming
      .${GAME_CLASS}-state-dot {
      background: var(--signal);
      animation: jtj-pixel-panic-blink 420ms steps(1, end) infinite;
    }

    .${GAME_CLASS}.is-active
      .${GAME_CLASS}-state-dot {
      background: var(--success);
      box-shadow: 0 0 0 4px rgba(115, 255, 155, 0.08);
    }

    .${GAME_CLASS}.is-error
      .${GAME_CLASS}-state-dot {
      background: var(--danger);
    }

    @keyframes jtj-pixel-panic-blink {
      0%,
      100% {
        opacity: 1;
      }

      50% {
        opacity: 0.15;
      }
    }

    @media (min-width: 640px) {
      .${GAME_CLASS} {
        padding: 18px;
        gap: 16px;
      }

      .${GAME_CLASS}-topbar {
        grid-template-columns: repeat(4, 1fr);
      }

      .${GAME_CLASS}-panel {
        grid-template-columns: repeat(3, 1fr);
      }

      .${GAME_CLASS}-action {
        max-width: 430px;
        margin-inline: auto;
      }
    }
  `;

  document.head.appendChild(style);
}

export function mountGame(root: HTMLElement) {
  injectStyles();

  root.innerHTML = `
    <div class="${GAME_CLASS}">
      <div class="${GAME_CLASS}-topbar">
        <div class="${GAME_CLASS}-stat">
          <span class="${GAME_CLASS}-stat-label">Score</span>
          <strong
            id="pixel-score"
            class="${GAME_CLASS}-stat-value"
          >
            00000
          </strong>
        </div>

        <div class="${GAME_CLASS}-stat">
          <span class="${GAME_CLASS}-stat-label">Best</span>
          <strong
            id="pixel-best"
            class="${GAME_CLASS}-stat-value"
          >
            00000
          </strong>
        </div>

        <div class="${GAME_CLASS}-stat">
          <span class="${GAME_CLASS}-stat-label">Combo</span>
          <strong
            id="pixel-combo"
            class="${GAME_CLASS}-stat-value"
          >
            x00
          </strong>
        </div>

        <div class="${GAME_CLASS}-stat">
          <span class="${GAME_CLASS}-stat-label">Reaction</span>
          <strong
            id="pixel-reaction"
            class="${GAME_CLASS}-stat-value"
          >
            ---ms
          </strong>
        </div>
      </div>

      <div class="${GAME_CLASS}-header">
        <span class="${GAME_CLASS}-eyebrow">
          JEMBERTOJOGJA / ARCADE 08
        </span>

        <h2 class="${GAME_CLASS}-title">
          PIXEL PANIC
        </h2>

        <p class="${GAME_CLASS}-subtitle">
          Wait for the signal. Hit the correct pixel.
          Tap early and the pixel gods will know.
        </p>
      </div>

      <div class="${GAME_CLASS}-hud">
        <div class="${GAME_CLASS}-state">
          <span
            id="pixel-state-dot"
            class="${GAME_CLASS}-state-dot"
          ></span>

          <span id="pixel-state">
            READY
          </span>
        </div>

        <div
          id="pixel-round"
          class="${GAME_CLASS}-round"
        >
          ROUND 00
        </div>
      </div>

      <div
        id="pixel-instruction"
        class="${GAME_CLASS}-instruction"
      >
        PRESS START. DON'T PANIC.
      </div>

      <div class="${GAME_CLASS}-board-shell">
        <div
          id="pixel-board"
          class="${GAME_CLASS}-board"
          aria-label="Pixel Panic game board"
        ></div>
      </div>

      <div class="${GAME_CLASS}-panel">
        <div class="${GAME_CLASS}-panel-block">
          <span class="${GAME_CLASS}-panel-label">
            Lives
          </span>

          <div
            id="pixel-lives"
            class="${GAME_CLASS}-lives"
          >
            <span class="${GAME_CLASS}-life alive"></span>
            <span class="${GAME_CLASS}-life alive"></span>
            <span class="${GAME_CLASS}-life alive"></span>
          </div>
        </div>

        <div class="${GAME_CLASS}-panel-block">
          <span class="${GAME_CLASS}-panel-label">
            Difficulty
          </span>

          <strong
            id="pixel-difficulty"
            class="${GAME_CLASS}-panel-value"
          >
            CALM
          </strong>
        </div>
      </div>

      <button
        id="pixel-action"
        class="${GAME_CLASS}-action"
        type="button"
      >
        START PIXEL PANIC ↗
      </button>

      <div class="${GAME_CLASS}-footer">
        <span>
          Touch / Mouse / 1–9
        </span>

        <span>
          Faster every round
        </span>
      </div>
    </div>
  `;

  const game = getRequiredElement<HTMLElement>(
    root,
    `.${GAME_CLASS}`,
  );

  const scoreElement =
    getRequiredElement<HTMLElement>(
      root,
      "#pixel-score",
    );

  const bestElement =
    getRequiredElement<HTMLElement>(
      root,
      "#pixel-best",
    );

  const comboElement =
    getRequiredElement<HTMLElement>(
      root,
      "#pixel-combo",
    );

  const reactionElement =
    getRequiredElement<HTMLElement>(
      root,
      "#pixel-reaction",
    );

  const stateElement =
    getRequiredElement<HTMLElement>(
      root,
      "#pixel-state",
    );

  const roundElement =
    getRequiredElement<HTMLElement>(
      root,
      "#pixel-round",
    );

  const instructionElement =
    getRequiredElement<HTMLElement>(
      root,
      "#pixel-instruction",
    );

  const boardElement =
    getRequiredElement<HTMLElement>(
      root,
      "#pixel-board",
    );

  const livesElement =
    getRequiredElement<HTMLElement>(
      root,
      "#pixel-lives",
    );

  const difficultyElement =
    getRequiredElement<HTMLElement>(
      root,
      "#pixel-difficulty",
    );

  const actionButton =
    getRequiredElement<HTMLButtonElement>(
      root,
      "#pixel-action",
    );

  const cellButtons: HTMLButtonElement[] = [];

  let state: GameState = "ready";

  let score = 0;
  let best = getBestScore();

  let round = 0;
  let combo = 0;
  let lives = INITIAL_LIVES;

  let targetIndex = -1;
  let activatedAt = 0;

  let armTimer: number | null = null;
  let successTimer: number | null = null;

  let audioContext:
    | AudioContext
    | null = null;

  function ensureAudioContext() {
    if (audioContext) return audioContext;

    try {
      audioContext = new AudioContext();
      return audioContext;
    } catch {
      return null;
    }
  }

  function playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = "square",
  ) {
    const context = ensureAudioContext();

    if (!context) return;

    const oscillator =
      context.createOscillator();

    const gain = context.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(
      0.0001,
      context.currentTime,
    );

    gain.gain.exponentialRampToValueAtTime(
      0.055,
      context.currentTime + 0.01,
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      context.currentTime + duration,
    );

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    oscillator.stop(
      context.currentTime + duration,
    );
  }

  function vibrate(
    pattern: number | number[],
  ) {
    if (
      typeof navigator !== "undefined" &&
      "vibrate" in navigator
    ) {
      navigator.vibrate(pattern);
    }
  }

  function clearTimers() {
    if (armTimer !== null) {
      window.clearTimeout(armTimer);
      armTimer = null;
    }

    if (successTimer !== null) {
      window.clearTimeout(successTimer);
      successTimer = null;
    }
  }

  function getDelay(): number {
    return Math.max(
      MIN_DELAY,
      START_DELAY - (round - 1) * 55,
    );
  }

  function getDifficulty(): string {
    if (round >= 12) return "INSANE";
    if (round >= 8) return "FAST";
    if (round >= 5) return "HOT";
    if (round >= 3) return "WARM";
    return "CALM";
  }

  function updateHud() {
    scoreElement.textContent =
      formatScore(score);

    bestElement.textContent =
      formatScore(best);

    comboElement.textContent =
      `x${String(combo).padStart(2, "0")}`;

    roundElement.textContent =
      `ROUND ${String(round).padStart(2, "0")}`;

    difficultyElement.textContent =
      getDifficulty();

    const reactionText =
      activatedAt > 0
        ? reactionElement.textContent
        : "---ms";

    reactionElement.textContent =
      reactionText;
  }

  function updateLives() {
    const lifeElements =
      Array.from(
        livesElement.children,
      );

    lifeElements.forEach(
      (element, index) => {
        element.classList.toggle(
          "alive",
          index < lives,
        );
      },
    );
  }

  function setState(
    nextState: GameState,
    label: string,
  ) {
    state = nextState;
    stateElement.textContent = label;

    game.classList.remove(
      "is-arming",
      "is-active",
      "is-error",
    );

    if (nextState === "arming") {
      game.classList.add("is-arming");
    }

    if (nextState === "active") {
      game.classList.add("is-active");
    }

    if (nextState === "gameover") {
      game.classList.add("is-error");
    }
  }

  function resetCells() {
    cellButtons.forEach((button) => {
      button.classList.remove(
        "signal",
        "success",
        "error",
      );

      button.disabled = true;
    });
  }

  function createBoard() {
    boardElement.innerHTML = "";
    cellButtons.length = 0;

    for (
      let index = 0;
      index < CELL_COUNT;
      index += 1
    ) {
      const button =
        document.createElement("button");

      button.type = "button";
      button.className =
        `${GAME_CLASS}-cell`;

      button.disabled = true;

      button.setAttribute(
        "aria-label",
        `Pixel ${index + 1}`,
      );

      button.innerHTML = `
        <span class="${GAME_CLASS}-cell-number">
          ${String(index + 1).padStart(2, "0")}
        </span>

        <span class="${GAME_CLASS}-cell-corner">
          0x${(index + 1)
            .toString(16)
            .toUpperCase()
            .padStart(2, "0")}
        </span>
      `;

      button.addEventListener(
        "click",
        () => {
          handleCellInput(index);
        },
      );

      boardElement.appendChild(button);
      cellButtons.push(button);
    }
  }

  function pickTarget(): number {
    let next =
      Math.floor(
        Math.random() * CELL_COUNT,
      );

    while (next === targetIndex) {
      next =
        Math.floor(
          Math.random() * CELL_COUNT,
        );
    }

    return next;
  }

  function startRound() {
    clearTimers();

    resetCells();

    round += 1;

    targetIndex = pickTarget();
    activatedAt = 0;

    setState(
      "arming",
      "ARMING",
    );

    instructionElement.textContent =
      "WAIT FOR THE PIXEL";

    reactionElement.textContent =
      "---ms";

    updateHud();

    armTimer = window.setTimeout(
      () => {
        armTimer = null;

        state = "active";

        setState(
          "active",
          "PANIC",
        );

        instructionElement.textContent =
          "TAP THE SIGNAL";

        const target =
          cellButtons[targetIndex];

        if (!target) return;

        target.classList.add("signal");
        target.disabled = false;

        cellButtons.forEach(
          (button, index) => {
            if (index !== targetIndex) {
              button.disabled = false;
            }
          },
        );

        activatedAt =
          performance.now();

        playTone(
          880,
          0.08,
          "square",
        );

        vibrate(12);
      },
      getDelay(),
    );
  }

  function calculatePoints(
    reaction: number,
  ): number {
    const speedBonus = Math.max(
      80,
      500 - Math.floor(reaction),
    );

    const comboBonus =
      combo * 40;

    const roundBonus =
      round * 25;

    return (
      speedBonus +
      comboBonus +
      roundBonus
    );
  }

  function handleCellInput(
    index: number,
  ) {
    if (state !== "active") return;

    const clicked =
      cellButtons[index];

    if (!clicked) return;

    if (index !== targetIndex) {
      clicked.classList.add("error");

      lives -= 1;
      combo = 0;

      updateLives();
      updateHud();

      playTone(
        120,
        0.14,
        "sawtooth",
      );

      vibrate([35, 25, 50]);

      instructionElement.textContent =
        lives > 0
          ? "WRONG PIXEL"
          : "SYSTEM PANIC";

      setState(
        lives > 0
          ? "arming"
          : "gameover",
        lives > 0
          ? "MISS"
          : "CRASH",
      );

      cellButtons.forEach(
        (button) => {
          button.disabled = true;
        },
      );

      if (lives <= 0) {
        endGame();
        return;
      }

      successTimer =
        window.setTimeout(
          () => {
            successTimer = null;
            startRound();
          },
          650,
        );

      return;
    }

    const reaction =
      Math.max(
        1,
        Math.round(
          performance.now() -
            activatedAt,
        ),
      );

    const gained =
      calculatePoints(reaction);

    score += gained;
    combo += 1;

    if (score > best) {
      best = score;
      saveBestScore(best);
    }

    reactionElement.textContent =
      `${reaction}ms`;

    clicked.classList.remove(
      "signal",
    );

    clicked.classList.add("success");

    cellButtons.forEach(
      (button) => {
        button.disabled = true;
      },
    );

    state = "success";
    setState(
      "success",
      "CLEAR",
    );

    instructionElement.textContent =
      `+${gained} / ${reaction}ms`;

    playTone(
      620 + Math.min(combo, 10) * 24,
      0.08,
      "square",
    );

    vibrate(18);

    updateHud();

    successTimer =
      window.setTimeout(
        () => {
          successTimer = null;
          startRound();
        },
        430,
      );
  }

  function startGame() {
    clearTimers();

    score = 0;
    round = 0;
    combo = 0;
    lives = INITIAL_LIVES;
    targetIndex = -1;
    activatedAt = 0;

    actionButton.disabled = true;
    actionButton.textContent =
      "PIXEL PANIC RUNNING";

    instructionElement.textContent =
      "WAIT FOR THE PIXEL";

    reactionElement.textContent =
      "---ms";

    updateLives();
    updateHud();

    startRound();
  }

  function endGame() {
    clearTimers();

    state = "gameover";
    setState(
      "gameover",
      "CRASH",
    );

    resetCells();

    if (score > best) {
      best = score;
      saveBestScore(best);
    }

    instructionElement.textContent =
      `FINAL ${formatScore(score)}`;

    actionButton.disabled = false;
    actionButton.textContent =
      "RESTART PIXEL PANIC ↗";

    updateHud();

    playTone(
      90,
      0.22,
      "sawtooth",
    );

    vibrate([60, 30, 90]);
  }

  function handleKeyboard(
    event: KeyboardEvent,
  ) {
    const target =
      event.target;

    if (
      target instanceof
        HTMLInputElement ||
      target instanceof
        HTMLTextAreaElement ||
      target instanceof
        HTMLSelectElement
    ) {
      return;
    }

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      if (
        state === "ready" ||
        state === "gameover"
      ) {
        event.preventDefault();
        startGame();
      }

      return;
    }

    const numeric =
      Number(event.key);

    if (
      Number.isInteger(numeric) &&
      numeric >= 1 &&
      numeric <= 9
    ) {
      event.preventDefault();
      handleCellInput(
        numeric - 1,
      );
    }

    if (event.key === "Escape") {
      clearTimers();

      state = "ready";

      resetCells();

      actionButton.disabled = false;
      actionButton.textContent =
        "START PIXEL PANIC ↗";

      instructionElement.textContent =
        "PRESS START. DON'T PANIC.";

      setState(
        "ready",
        "READY",
      );

      round = 0;
      combo = 0;
      score = 0;
      lives = INITIAL_LIVES;

      updateLives();
      updateHud();
    }
  }

  actionButton.addEventListener(
    "click",
    () => {
      if (
        state === "ready" ||
        state === "gameover"
      ) {
        startGame();
      }
    },
  );

  createBoard();
  resetCells();
  updateLives();
  updateHud();

  instructionElement.textContent =
    "PRESS START. DON'T PANIC.";

  setState(
    "ready",
    "READY",
  );

  document.addEventListener(
    "keydown",
    handleKeyboard,
  );

  return () => {
    clearTimers();

    document.removeEventListener(
      "keydown",
      handleKeyboard,
    );

    if (audioContext) {
      void audioContext.close();
      audioContext = null;
    }

    root.innerHTML = "";
  };
}