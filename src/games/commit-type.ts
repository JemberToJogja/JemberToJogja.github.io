type GameState =
  | "ready"
  | "playing"
  | "finished";

type RoundResult = {
  text: string;
  accuracy: number;
  elapsed: number;
  wpm: number;
};

const GAME_CLASS =
  "jtj-commit-type";

const BEST_WPM_KEY =
  "jtj-commit-type-best-wpm";

const TARGETS = [
  "fix: somehow works",
  "feat: add another questionable feature",
  "refactor: remove code that was definitely needed",
  "chore: convince the build to cooperate",
  "fix: stop touching production",
];

function getRequiredElement<
  T extends Element,
>(
  root: ParentNode,
  selector: string,
): T {
  const element =
    root.querySelector<T>(selector);

  if (!element) {
    throw new Error(
      `[COMMIT TYPE] Missing element: ${selector}`,
    );
  }

  return element;
}

function formatTime(
  milliseconds: number,
): string {
  const seconds = Math.max(
    0,
    Math.floor(
      milliseconds / 1000,
    ),
  );

  const minutes =
    Math.floor(seconds / 60);

  const remaining =
    seconds % 60;

  return `${String(minutes).padStart(
    2,
    "0",
  )}:${String(remaining).padStart(
    2,
    "0",
  )}`;
}

function formatInteger(
  value: number,
): string {
  return String(
    Math.max(
      0,
      Math.round(value),
    ),
  ).padStart(3, "0");
}

function getBestWpm():
  number | null {
  try {
    const value =
      localStorage.getItem(
        BEST_WPM_KEY,
      );

    if (!value) {
      return null;
    }

    const parsed =
      Number(value);

    if (
      !Number.isFinite(parsed)
    ) {
      return null;
    }

    return Math.max(
      0,
      Math.round(parsed),
    );
  } catch {
    return null;
  }
}

function saveBestWpm(
  value: number,
) {
  try {
    localStorage.setItem(
      BEST_WPM_KEY,
      String(
        Math.max(
          0,
          Math.round(value),
        ),
      ),
    );
  } catch {
    // Ignore localStorage errors.
  }
}

function injectStyles() {
  if (
    document.head.querySelector(
      '[data-commit-type-style="true"]',
    )
  ) {
    return;
  }

  const style =
    document.createElement("style");

  style.dataset.commitTypeStyle =
    "true";

  style.textContent = `
    .${GAME_CLASS} {
      width: min(100%, 760px);
      margin: 0 auto;
      padding: 18px;

      color: #eeeae1;

      font-family:
        Inter,
        ui-sans-serif,
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;
    }

    .${GAME_CLASS} * {
      box-sizing: border-box;
    }

    .${GAME_CLASS} button,
    .${GAME_CLASS} input,
    .${GAME_CLASS} textarea {
      font: inherit;
      -webkit-tap-highlight-color: transparent;
    }

    .${GAME_CLASS}-head {
      display: grid;
      gap: 13px;
      margin-bottom: 16px;
    }

    .${GAME_CLASS}-eyebrow {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;

      color: #605e58;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 7px;
      font-weight: 800;
      letter-spacing: .1em;
      line-height: 1.4;
    }

    .${GAME_CLASS}-title {
      margin: 0;

      color: #eeeae1;

      font-size: clamp(46px, 13vw, 92px);
      font-weight: 950;
      line-height: .82;
      letter-spacing: -.085em;
    }

    .${GAME_CLASS}-description {
      max-width: 580px;
      margin: 0;

      color: #7d7972;

      font-size: 12px;
      line-height: 1.7;
    }

    .${GAME_CLASS}-panel {
      overflow: hidden;

      background: #151515;
      border: 1px solid #30302e;
    }

    .${GAME_CLASS}-panel-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;

      min-height: 44px;
      padding: 0 12px;

      background: #0e0e0e;
      border-bottom: 1px solid #292927;

      color: #62605a;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 6px;
      font-weight: 800;
      letter-spacing: .1em;
    }

    .${GAME_CLASS}-terminal {
      padding: 18px;
      background: #0b0b0b;
    }

    .${GAME_CLASS}-terminal-top {
      display: flex;
      align-items: center;
      justify-content: space-between;

      margin-bottom: 18px;
    }

    .${GAME_CLASS}-dots {
      display: flex;
      gap: 5px;
    }

    .${GAME_CLASS}-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #3e3d39;
    }

    .${GAME_CLASS}-terminal-path {
      color: #45433f;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 6px;
      font-weight: 800;
      letter-spacing: .08em;
    }

    .${GAME_CLASS}-prompt {
      display: grid;
      gap: 10px;

      padding: 14px;

      border: 1px solid #292927;
      background: #111111;
    }

    .${GAME_CLASS}-prompt-label {
      color: #4f4d48;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 6px;
      font-weight: 800;
      letter-spacing: .09em;
    }

    .${GAME_CLASS}-target {
      min-height: 76px;

      color: #eeeae1;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: clamp(
        16px,
        4.5vw,
        24px
      );

      font-weight: 750;
      line-height: 1.65;

      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }

    .${GAME_CLASS}-char {
      position: relative;
    }

    .${GAME_CLASS}-char.correct {
      color: #a9c09e;
    }

    .${GAME_CLASS}-char.incorrect {
      color: #d69288;
      text-decoration: underline;
      text-decoration-color: #d69288;
      text-decoration-thickness: 2px;
      text-underline-offset: 3px;
    }

    .${GAME_CLASS}-char.current {
      color: #111111;
      background: #eeeae1;
    }

    .${GAME_CLASS}-char.pending {
      color: #605d57;
    }

    .${GAME_CLASS}-input-wrap {
      display: grid;
      gap: 8px;
      margin-top: 14px;
    }

    .${GAME_CLASS}-input-label {
      color: #4d4b46;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 6px;
      font-weight: 800;
      letter-spacing: .09em;
    }

    .${GAME_CLASS}-input {
      width: 100%;
      min-height: 108px;

      resize: vertical;

      padding: 13px;

      border: 1px solid #34332f;
      outline: none;

      background: #151515;
      color: #eeeae1;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 14px;
      line-height: 1.6;

      caret-color: #eeeae1;

      appearance: none;
      -webkit-appearance: none;

      border-radius: 0;

      touch-action: manipulation;
    }

    .${GAME_CLASS}-input::placeholder {
      color: #4a4843;
    }

    .${GAME_CLASS}-input:focus {
      border-color: #67645e;
    }

    .${GAME_CLASS}-stats {
      display: grid;
      grid-template-columns:
        repeat(2, minmax(0, 1fr));

      border-top: 1px solid #292927;
    }

    .${GAME_CLASS}-stat {
      min-height: 70px;

      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 5px;

      padding: 10px 12px;

      border-right: 1px solid #292927;
      border-bottom: 1px solid #292927;
    }

    .${GAME_CLASS}-stat:nth-child(2n) {
      border-right: 0;
    }

    .${GAME_CLASS}-stat:nth-child(n + 3) {
      border-bottom: 0;
    }

    .${GAME_CLASS}-stat span {
      color: #55534e;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 6px;
      font-weight: 800;
      letter-spacing: .09em;
    }

    .${GAME_CLASS}-stat strong {
      color: #eeeae1;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 22px;
      font-weight: 900;
      line-height: 1;
      letter-spacing: -.04em;
    }

    .${GAME_CLASS}-bottom {
      display: grid;
      gap: 9px;
      padding: 12px;

      background: #111111;
      border-top: 1px solid #292927;
    }

    .${GAME_CLASS}-button {
      min-height: 45px;

      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;

      padding: 0 14px;

      border: 1px solid #eeeae1;
      background: #eeeae1;
      color: #111111;

      cursor: pointer;

      font-size: 8px;
      font-weight: 900;
      letter-spacing: .08em;

      touch-action: manipulation;
    }

    .${GAME_CLASS}-button.secondary {
      border-color: #3c3b37;
      background: #1b1b1a;
      color: #aaa69e;
    }

    .${GAME_CLASS}-button:active {
      transform: translateY(1px);
    }

    .${GAME_CLASS}-status {
      min-height: 48px;

      display: grid;
      place-items: center;

      margin-top: 10px;
      padding: 12px;

      border: 1px solid #2b2a27;
      background: #111111;
      color: #6d6962;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 7px;
      font-weight: 850;
      line-height: 1.45;
      letter-spacing: .08em;
      text-align: center;
    }

    .${GAME_CLASS}-status.success {
      color: #b9d0ae;
      border-color: #384333;
    }

    .${GAME_CLASS}-status.danger {
      color: #d59a91;
      border-color: #493330;
    }

    .${GAME_CLASS}-footer {
      display: flex;
      justify-content: space-between;
      gap: 12px;

      margin-top: 10px;
      padding-top: 10px;

      border-top: 1px solid #2a2926;

      color: #55524c;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 6px;
      font-weight: 800;
      letter-spacing: .08em;
    }

    @media (min-width: 700px) {
      .${GAME_CLASS} {
        padding: 34px;
      }

      .${GAME_CLASS}-stats {
        grid-template-columns:
          repeat(4, minmax(0, 1fr));
      }

      .${GAME_CLASS}-stat {
        border-right: 1px solid #292927;
        border-bottom: 0;
      }

      .${GAME_CLASS}-stat:nth-child(2n) {
        border-right: 1px solid #292927;
      }

      .${GAME_CLASS}-stat:last-child {
        border-right: 0;
      }

      .${GAME_CLASS}-bottom {
        grid-template-columns:
          1fr 160px;
        align-items: center;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .${GAME_CLASS}-button {
        transition: none;
      }
    }
  `;

  document.head.appendChild(
    style,
  );
}

export function mountGame(
  root: HTMLElement,
) {
  injectStyles();

  root.innerHTML = `
    <div class="${GAME_CLASS}">
      <div class="${GAME_CLASS}-head">
        <div class="${GAME_CLASS}-eyebrow">
          <span>GAME 03 / SKILL</span>
          <span>NO AI GENERATED EXCUSES</span>
        </div>

        <h2 class="${GAME_CLASS}-title">
          COMMIT TYPE
        </h2>

        <p class="${GAME_CLASS}-description">
          Type the commit message before the build
          gives up on you. Speed matters.
          Accuracy also matters. Unfortunately,
          both matter.
        </p>
      </div>

      <div class="${GAME_CLASS}-panel">
        <div class="${GAME_CLASS}-panel-top">
          <span id="commit-round-label">
            ROUND 01 / 05
          </span>

          <span id="commit-progress-label">
            READY
          </span>
        </div>

        <div class="${GAME_CLASS}-terminal">
          <div class="${GAME_CLASS}-terminal-top">
            <div class="${GAME_CLASS}-dots">
              <span class="${GAME_CLASS}-dot"></span>
              <span class="${GAME_CLASS}-dot"></span>
              <span class="${GAME_CLASS}-dot"></span>
            </div>

            <span class="${GAME_CLASS}-terminal-path">
              git://questionable-branch
            </span>
          </div>

          <div class="${GAME_CLASS}-prompt">
            <span class="${GAME_CLASS}-prompt-label">
              TARGET COMMIT MESSAGE
            </span>

            <div
              class="${GAME_CLASS}-target"
              id="commit-target"
              aria-live="polite"
            ></div>

            <div class="${GAME_CLASS}-input-wrap">
              <label
                class="${GAME_CLASS}-input-label"
                for="commit-input"
              >
                TYPE HERE
              </label>

              <textarea
                id="commit-input"
                class="${GAME_CLASS}-input"
                rows="3"
                spellcheck="false"
                autocomplete="off"
                autocapitalize="none"
                autocorrect="off"
                placeholder="Start typing..."
                disabled
              ></textarea>
            </div>
          </div>
        </div>

        <div class="${GAME_CLASS}-stats">
          <div class="${GAME_CLASS}-stat">
            <span>WPM</span>
            <strong id="commit-wpm">
              000
            </strong>
          </div>

          <div class="${GAME_CLASS}-stat">
            <span>ACCURACY</span>
            <strong id="commit-accuracy">
              100%
            </strong>
          </div>

          <div class="${GAME_CLASS}-stat">
            <span>TIME</span>
            <strong id="commit-time">
              00:00
            </strong>
          </div>

          <div class="${GAME_CLASS}-stat">
            <span>STREAK</span>
            <strong id="commit-streak">
              000
            </strong>
          </div>
        </div>

        <div class="${GAME_CLASS}-bottom">
          <button
            id="commit-action"
            class="${GAME_CLASS}-button"
            type="button"
          >
            START CHALLENGE
            <span>↗</span>
          </button>

          <button
            id="commit-reset"
            class="${GAME_CLASS}-button secondary"
            type="button"
          >
            ↻ RESET
          </button>
        </div>
      </div>

      <div
        id="commit-status"
        class="${GAME_CLASS}-status"
      >
        START THE CHALLENGE AND TYPE THE MESSAGE
      </div>

      <div class="${GAME_CLASS}-footer">
        <span id="commit-best">
          BEST / --- WPM
        </span>

        <span>
          5 ROUNDS / ONE FINAL SCORE
        </span>
      </div>
    </div>
  `;

  const targetElement =
    getRequiredElement<HTMLElement>(
      root,
      "#commit-target",
    );

  const inputElement =
    getRequiredElement<HTMLTextAreaElement>(
      root,
      "#commit-input",
    );

  const wpmElement =
    getRequiredElement<HTMLElement>(
      root,
      "#commit-wpm",
    );

  const accuracyElement =
    getRequiredElement<HTMLElement>(
      root,
      "#commit-accuracy",
    );

  const timeElement =
    getRequiredElement<HTMLElement>(
      root,
      "#commit-time",
    );

  const streakElement =
    getRequiredElement<HTMLElement>(
      root,
      "#commit-streak",
    );

  const roundLabel =
    getRequiredElement<HTMLElement>(
      root,
      "#commit-round-label",
    );

  const progressLabel =
    getRequiredElement<HTMLElement>(
      root,
      "#commit-progress-label",
    );

  const statusElement =
    getRequiredElement<HTMLElement>(
      root,
      "#commit-status",
    );

  const actionButton =
    getRequiredElement<HTMLButtonElement>(
      root,
      "#commit-action",
    );

  const resetButton =
    getRequiredElement<HTMLButtonElement>(
      root,
      "#commit-reset",
    );

  const bestElement =
    getRequiredElement<HTMLElement>(
      root,
      "#commit-best",
    );

  let state: GameState =
    "ready";

  let roundIndex = 0;

  let currentTarget =
    TARGETS[0] ?? "";

  let startTime:
    number | null = null;

  let elapsed =
    0;

  let timerId:
    number | null = null;

  let totalTyped =
    0;

  let totalCorrect =
    0;

  let currentStreak =
    0;

  let bestStreak =
    0;

  let roundResults:
    RoundResult[] = [];

  function updateBest() {
    const best =
      getBestWpm();

    bestElement.textContent =
      best === null
        ? "BEST / --- WPM"
        : `BEST / ${formatInteger(
            best,
          )} WPM`;
  }

  function stopTimer() {
    if (timerId !== null) {
      window.clearInterval(
        timerId,
      );

      timerId = null;
    }
  }

  function startTimer() {
    stopTimer();

    timerId =
      window.setInterval(
        () => {
          if (
            state !==
            "playing"
          ) {
            return;
          }

          if (
            startTime ===
            null
          ) {
            return;
          }

          elapsed =
            Date.now() -
            startTime;

          timeElement.textContent =
            formatTime(
              elapsed,
            );

          updateLiveStats();
        },
        250,
      );
  }

  function getAccuracy(): number {
    if (
      totalTyped <= 0
    ) {
      return 100;
    }

    return Math.max(
      0,
      Math.min(
        100,
        (totalCorrect /
          totalTyped) *
          100,
      ),
    );
  }

  function getWpm(): number {
    if (
      startTime ===
      null
    ) {
      return 0;
    }

    const now =
      elapsed > 0
        ? elapsed
        : Date.now() -
          startTime;

    const minutes =
      now / 60000;

    if (minutes <= 0) {
      return 0;
    }

    const words =
      totalCorrect / 5;

    return (
      words / minutes
    );
  }

  function updateLiveStats() {
    wpmElement.textContent =
      formatInteger(
        getWpm(),
      );

    accuracyElement.textContent =
      `${Math.round(
        getAccuracy(),
      )}%`;

    streakElement.textContent =
      formatInteger(
        currentStreak,
      );
  }

  function setStatus(
    message: string,
    type:
      | ""
      | "success"
      | "danger" = "",
  ) {
    statusElement.textContent =
      message;

    statusElement.className =
      `${GAME_CLASS}-status`;

    if (type) {
      statusElement.classList.add(
        type,
      );
    }
  }

  function renderTarget(
    typed: string,
  ) {
    targetElement.innerHTML =
      "";

    for (
      let index = 0;
      index <
      currentTarget.length;
      index += 1
    ) {
      const character =
        currentTarget[index] ??
        "";

      const span =
        document.createElement(
          "span",
        );

      span.className =
        `${GAME_CLASS}-char`;

      span.textContent =
        character === " "
          ? "\u00A0"
          : character;

      const typedCharacter =
        typed[index];

      if (
        typedCharacter ===
        undefined
      ) {
        span.classList.add(
          "pending",
        );
      } else if (
        typedCharacter ===
        character
      ) {
        span.classList.add(
          "correct",
        );
      } else {
        span.classList.add(
          "incorrect",
        );
      }

      if (
        index === typed.length
      ) {
        span.classList.add(
          "current",
        );
      }

      targetElement.appendChild(
        span,
      );
    }
  }

  function renderRoundInfo() {
    roundLabel.textContent =
      `ROUND ${String(
        roundIndex + 1,
      ).padStart(
        2,
        "0",
      )} / ${String(
        TARGETS.length,
      ).padStart(2, "0")}`;

    progressLabel.textContent =
      state === "ready"
        ? "READY"
        : `${Math.min(
            inputElement.value.length,
            currentTarget.length,
          )} / ${
            currentTarget.length
          }`;
  }

  function loadRound(
    index: number,
  ) {
    roundIndex =
      Math.max(
        0,
        Math.min(
          TARGETS.length - 1,
          index,
        ),
      );

    currentTarget =
      TARGETS[
        roundIndex
      ] ?? "";

    inputElement.value =
      "";

    renderTarget("");

    renderRoundInfo();
  }

  function resetStats() {
    totalTyped = 0;
    totalCorrect = 0;
    currentStreak = 0;
    bestStreak = 0;
    elapsed = 0;
    startTime = null;
    roundResults = [];

    wpmElement.textContent =
      "000";

    accuracyElement.textContent =
      "100%";

    timeElement.textContent =
      "00:00";

    streakElement.textContent =
      "000";
  }

  function resetGame() {
    stopTimer();

    state = "ready";

    resetStats();

    loadRound(0);

    inputElement.disabled =
      true;

    actionButton.disabled =
      false;

    actionButton.textContent =
      "";

    const actionText =
      document.createElement(
        "span",
      );

    actionText.textContent =
      "START CHALLENGE";

    actionButton.appendChild(
      actionText,
    );

    const arrow =
      document.createElement(
        "span",
      );

    arrow.textContent = "↗";

    actionButton.appendChild(
      arrow,
    );

    setStatus(
      "START THE CHALLENGE AND TYPE THE MESSAGE",
    );

    updateBest();
    renderRoundInfo();
  }

  function beginGame() {
    stopTimer();

    state = "playing";

    resetStats();

    loadRound(0);

    inputElement.disabled =
      false;

    inputElement.value =
      "";

    startTime =
      Date.now();

    startTimer();

    setStatus(
      "TYPE THE MESSAGE / NO BACKSPACE SHAME",
    );

    actionButton.disabled =
      true;

    actionButton.textContent =
      "CHALLENGE RUNNING";

    inputElement.focus();

    renderRoundInfo();
    renderTarget("");
  }

  function finishRound() {
    const now =
      Date.now();

    const roundElapsed =
      startTime === null
        ? 0
        : now - startTime;

    const input =
      inputElement.value;

    let correct = 0;

    const length =
      Math.min(
        input.length,
        currentTarget.length,
      );

    for (
      let index = 0;
      index < length;
      index += 1
    ) {
      if (
        input[index] ===
        currentTarget[index]
      ) {
        correct += 1;
      }
    }

    const attempted =
      Math.max(
        input.length,
        currentTarget.length,
      );

    const accuracy =
      attempted === 0
        ? 100
        : (correct /
            attempted) *
          100;

    const minutes =
      Math.max(
        roundElapsed / 60000,
        1 / 60000,
      );

    const wpm =
      (correct / 5) /
      minutes;

    roundResults.push({
      text: currentTarget,
      accuracy,
      elapsed:
        roundElapsed,
      wpm,
    });

    currentStreak += 1;

    bestStreak =
      Math.max(
        bestStreak,
        currentStreak,
      );

    triggerVibration(30);

    if (
      roundIndex <
      TARGETS.length - 1
    ) {
      roundIndex += 1;

      currentTarget =
        TARGETS[
          roundIndex
        ] ?? "";

      inputElement.value =
        "";

      renderTarget("");

      renderRoundInfo();

      setStatus(
        `ROUND CLEARED / STREAK ${currentStreak}`,
        "success",
      );

      inputElement.focus();

      return;
    }

    finishGame();
  }

  function finishGame() {
    stopTimer();

    state = "finished";

    inputElement.disabled =
      true;

    elapsed =
      startTime === null
        ? 0
        : Date.now() -
          startTime;

    const finalWpm =
      getWpm();

    const finalAccuracy =
      getAccuracy();

    const best =
      getBestWpm();

    const newBest =
      best === null ||
      finalWpm > best;

    if (newBest) {
      saveBestWpm(
        finalWpm,
      );
    }

    wpmElement.textContent =
      formatInteger(
        finalWpm,
      );

    accuracyElement.textContent =
      `${Math.round(
        finalAccuracy,
      )}%`;

    timeElement.textContent =
      formatTime(
        elapsed,
      );

    streakElement.textContent =
      formatInteger(
        bestStreak,
      );

    progressLabel.textContent =
      "COMPLETE";

    roundLabel.textContent =
      "BUILD / PASSED";

    actionButton.disabled =
      false;

    actionButton.textContent =
      "PLAY AGAIN ↗";

    setStatus(
      newBest
        ? `BUILD PASSED / NEW BEST / ${formatInteger(
            finalWpm,
          )} WPM`
        : `BUILD PASSED / ${formatInteger(
            finalWpm,
          )} WPM / ${Math.round(
            finalAccuracy,
          )}% ACCURACY`,
      "success",
    );

    updateBest();

    triggerVibration([
      35,
      30,
      55,
    ]);
  }

  function handleInput() {
    if (
      state !==
      "playing"
    ) {
      return;
    }

    const typed =
      inputElement.value;

    totalTyped =
      0;

    totalCorrect =
      0;

    for (
      let index = 0;
      index < typed.length;
      index += 1
    ) {
      totalTyped += 1;

      if (
        typed[index] ===
        currentTarget[index]
      ) {
        totalCorrect += 1;
        currentStreak =
          Math.max(
            currentStreak,
            1,
          );
      }
    }

    currentStreak =
      Math.max(
        0,
        currentStreak,
      );

    /*
     * Count a mismatch without allowing it to
     * permanently destroy the challenge.
     */
    if (
      typed.length >
      0
    ) {
      const lastIndex =
        typed.length - 1;

      if (
        typed[lastIndex] !==
        currentTarget[lastIndex]
      ) {
        currentStreak = 0;

        triggerVibration(
          20,
        );
      }
    }

    if (
      typed.length ===
        currentTarget.length &&
      typed === currentTarget
    ) {
      finishRound();
      return;
    }

    renderTarget(
      typed,
    );

    renderRoundInfo();

    updateLiveStats();

    if (
      typed.length >
      currentTarget.length
    ) {
      setStatus(
        "TOO MUCH COMMIT / DELETE THE EXTRA CHARACTERS",
        "danger",
      );
    } else if (
      typed.length > 0
    ) {
      setStatus(
        "KEEP GOING / THE BUILD IS WATCHING",
      );
    }
  }

  function triggerVibration(
    value:
      | number
      | number[],
  ) {
    if (
      typeof navigator.vibrate !==
      "function"
    ) {
      return;
    }

    try {
      navigator.vibrate(
        value,
      );
    } catch {
      // Ignore vibration errors.
    }
  }

  actionButton.addEventListener(
    "click",
    () => {
      if (
        state === "finished"
      ) {
        beginGame();
        return;
      }

      if (
        state === "ready"
      ) {
        beginGame();
      }
    },
  );

  resetButton.addEventListener(
    "click",
    resetGame,
  );

  inputElement.addEventListener(
    "input",
    handleInput,
  );

  resetGame();

  return () => {
    stopTimer();

    root.innerHTML = "";
  };
}