type GameState =
  | "ready"
  | "memorizing"
  | "input"
  | "gameover";

const GAME_CLASS =
  "jtj-stack-trace";

const BEST_SCORE_KEY =
  "jtj-stack-trace-best";

const NODE_COUNT = 9;

const MAX_SEQUENCE_LENGTH = 14;

const INITIAL_SEQUENCE_LENGTH = 3;

const SYMBOLS = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
];

const HEX_LABELS = [
  "0x01",
  "0x02",
  "0x03",
  "0x04",
  "0x05",
  "0x06",
  "0x07",
  "0x08",
  "0x09",
];

function getRequiredElement<
  T extends Element,
>(
  root: ParentNode,
  selector: string,
): T {
  const element =
    root.querySelector<T>(
      selector,
    );

  if (!element) {
    throw new Error(
      `[STACK TRACE] Missing element: ${selector}`,
    );
  }

  return element;
}

function getBestScore(): number {
  try {
    const raw =
      localStorage.getItem(
        BEST_SCORE_KEY,
      );

    if (!raw) {
      return 0;
    }

    const value =
      Number(raw);

    if (
      !Number.isFinite(value)
    ) {
      return 0;
    }

    return Math.max(
      0,
      Math.floor(value),
    );
  } catch {
    return 0;
  }
}

function saveBestScore(
  score: number,
) {
  try {
    localStorage.setItem(
      BEST_SCORE_KEY,
      String(
        Math.max(
          0,
          Math.floor(score),
        ),
      ),
    );
  } catch {
    // Ignore localStorage failures.
  }
}

function formatScore(
  value: number,
): string {
  return String(
    Math.max(
      0,
      Math.floor(value),
    ),
  ).padStart(5, "0");
}

function injectStyles() {
  if (
    document.head.querySelector(
      '[data-stack-trace-style="true"]',
    )
  ) {
    return;
  }

  const style =
    document.createElement(
      "style",
    );

  style.dataset.stackTraceStyle =
    "true";

  style.textContent = `
    .${GAME_CLASS} {
      width: min(100%, 700px);
      margin: 0 auto;
      padding: 16px;

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

    .${GAME_CLASS} button {
      font: inherit;
      -webkit-tap-highlight-color: transparent;
    }

    .${GAME_CLASS}-head {
      display: grid;
      gap: 12px;
      margin-bottom: 15px;
    }

    .${GAME_CLASS}-eyebrow {
      display: flex;
      align-items: center;
      justify-content: space-between;

      gap: 12px;

      color: #5e5c56;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 7px;
      font-weight: 800;

      letter-spacing: .1em;
    }

    .${GAME_CLASS}-title {
      margin: 0;

      color: #eeeae1;

      font-size: clamp(
        45px,
        13vw,
        92px
      );

      font-weight: 950;

      line-height: .82;

      letter-spacing: -.085em;
    }

    .${GAME_CLASS}-description {
      max-width: 590px;

      margin: 0;

      color: #7d7972;

      font-size: 12px;

      line-height: 1.7;
    }

    .${GAME_CLASS}-panel {
      overflow: hidden;

      background: #161616;

      border: 1px solid #333230;
    }

    .${GAME_CLASS}-topbar {
      display: grid;

      grid-template-columns:
        repeat(4, 1fr);

      background: #0d0d0d;

      border-bottom:
        1px solid #292927;
    }

    .${GAME_CLASS}-stat {
      min-height: 66px;

      display: flex;

      flex-direction: column;

      justify-content: center;

      gap: 4px;

      padding: 9px 11px;

      border-right:
        1px solid #272623;
    }

    .${GAME_CLASS}-stat:last-child {
      border-right: 0;
    }

    .${GAME_CLASS}-stat span {
      color: #56534d;

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

    .${GAME_CLASS}-stat strong {
      color: #eeeae1;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 17px;

      font-weight: 900;

      line-height: 1;
    }

    .${GAME_CLASS}-terminal {
      padding: 14px;

      background: #0b0b0b;

      border-bottom:
        1px solid #282826;
    }

    .${GAME_CLASS}-terminal-bar {
      display: flex;

      align-items: center;

      justify-content: space-between;

      gap: 12px;

      margin-bottom: 14px;
    }

    .${GAME_CLASS}-terminal-left {
      display: flex;

      align-items: center;

      gap: 6px;
    }

    .${GAME_CLASS}-terminal-dot {
      width: 7px;
      height: 7px;

      border-radius: 50%;

      background: #44433f;
    }

    .${GAME_CLASS}-terminal-path {
      color: #44423d;

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

    .${GAME_CLASS}-terminal-state {
      color: #77736c;

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

    .${GAME_CLASS}-trace-box {
      min-height: 75px;

      display: flex;

      flex-direction: column;

      justify-content: center;

      gap: 8px;

      padding: 14px;

      background: #121212;

      border: 1px solid #292927;
    }

    .${GAME_CLASS}-trace-label {
      color: #4e4c47;

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

    .${GAME_CLASS}-trace {
      min-height: 25px;

      display: flex;

      align-items: center;

      justify-content: center;

      flex-wrap: wrap;

      gap: 6px;
    }

    .${GAME_CLASS}-trace-item {
      min-width: 32px;

      padding: 6px 7px;

      background: #242422;

      border: 1px solid #3a3935;

      color: #aaa69e;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 8px;

      font-weight: 900;

      text-align: center;
    }

    .${GAME_CLASS}-trace-item.done {
      background: #394235;

      border-color: #505c4a;

      color: #c2d0b9;
    }

    .${GAME_CLASS}-trace-item.current {
      background: #eeeae1;

      border-color: #eeeae1;

      color: #111111;
    }

    .${GAME_CLASS}-trace-item.error {
      background: #5a3833;

      border-color: #764940;

      color: #f1d9d4;
    }

    .${GAME_CLASS}-instruction {
      margin-top: 11px;

      color: #6b6760;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 6px;

      font-weight: 800;

      line-height: 1.5;

      letter-spacing: .09em;

      text-align: center;
    }

    .${GAME_CLASS}-nodes {
      padding: 13px;

      background: #1a1a19;
    }

    .${GAME_CLASS}-node-grid {
      display: grid;

      grid-template-columns:
        repeat(3, 1fr);

      gap: 8px;

      max-width: 470px;

      margin: 0 auto;
    }

    .${GAME_CLASS}-node {
      min-height: 76px;

      position: relative;

      display: flex;

      flex-direction: column;

      align-items: center;

      justify-content: center;

      gap: 5px;

      padding: 8px;

      border:
        1px solid #35342f;

      background: #222220;

      color: #aaa69e;

      cursor: pointer;

      touch-action: manipulation;

      user-select: none;

      -webkit-user-select: none;

      transition:
        transform 80ms ease,
        background-color 80ms ease,
        border-color 80ms ease,
        color 80ms ease;
    }

    .${GAME_CLASS}-node-number {
      color: #eeeae1;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 18px;

      font-weight: 950;

      line-height: 1;
    }

    .${GAME_CLASS}-node-hex {
      color: #54514b;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 6px;

      font-weight: 800;

      letter-spacing: .05em;
    }

    .${GAME_CLASS}-node:active {
      transform: scale(.96);
    }

    .${GAME_CLASS}-node.showing {
      background: #eeeae1;

      border-color: #eeeae1;

      color: #111111;

      transform: scale(.96);
    }

    .${GAME_CLASS}-node.showing
      .${GAME_CLASS}-node-number {
      color: #111111;
    }

    .${GAME_CLASS}-node.showing
      .${GAME_CLASS}-node-hex {
      color: #66625b;
    }

    .${GAME_CLASS}-node.correct {
      background: #354134;

      border-color: #57654f;

      color: #c4d2bc;
    }

    .${GAME_CLASS}-node.correct
      .${GAME_CLASS}-node-number {
      color: #d5e0ce;
    }

    .${GAME_CLASS}-node.error {
      background: #583833;

      border-color: #794b43;

      color: #f0d6d1;
    }

    .${GAME_CLASS}-node.disabled {
      cursor: default;

      opacity: .58;
    }

    .${GAME_CLASS}-bottom {
      display: grid;

      gap: 8px;

      padding: 12px;

      background: #111111;

      border-top:
        1px solid #292927;
    }

    .${GAME_CLASS}-action {
      min-height: 56px;

      display: flex;

      align-items: center;

      justify-content: center;

      gap: 9px;

      padding: 0 18px;

      border:
        1px solid #eeeae1;

      background: #eeeae1;

      color: #111111;

      cursor: pointer;

      font-size: 9px;

      font-weight: 950;

      letter-spacing: .08em;

      touch-action: manipulation;
    }

    .${GAME_CLASS}-action:active {
      transform: translateY(1px);
    }

    .${GAME_CLASS}-status {
      min-height: 48px;

      display: grid;

      place-items: center;

      margin-top: 10px;

      padding: 12px;

      background: #111111;

      border:
        1px solid #2c2b28;

      color: #77736c;

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
      color: #bfd2b5;

      border-color: #3a4535;
    }

    .${GAME_CLASS}-status.danger {
      color: #d89a91;

      border-color: #4a322f;
    }

    .${GAME_CLASS}-footer {
      display: flex;

      align-items: center;

      justify-content: space-between;

      gap: 12px;

      margin-top: 10px;

      padding-top: 10px;

      border-top:
        1px solid #2a2926;

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

    @media (max-width: 520px) {
      .${GAME_CLASS}-topbar {
        grid-template-columns:
          repeat(2, 1fr);
      }

      .${GAME_CLASS}-stat:nth-child(2) {
        border-right: 0;
      }

      .${GAME_CLASS}-stat:nth-child(-n + 2) {
        border-bottom:
          1px solid #272623;
      }

      .${GAME_CLASS}-node {
        min-height: 82px;
      }
    }

    @media (min-width: 700px) {
      .${GAME_CLASS} {
        padding: 30px;
      }

      .${GAME_CLASS}-node {
        min-height: 88px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .${GAME_CLASS}-node,
      .${GAME_CLASS}-action {
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
          <span>GAME 07 / MEMORY</span>
          <span>TRACE THE FAILURE</span>
        </div>

        <h2 class="${GAME_CLASS}-title">
          STACK TRACE
        </h2>

        <p class="${GAME_CLASS}-description">
          The system crashed. Obviously.
          Memorize the node sequence, then
          trace it back in the correct order.
        </p>
      </div>

      <div class="${GAME_CLASS}-panel">
        <div class="${GAME_CLASS}-topbar">
          <div class="${GAME_CLASS}-stat">
            <span>SCORE</span>
            <strong id="stack-score">
              00000
            </strong>
          </div>

          <div class="${GAME_CLASS}-stat">
            <span>BEST</span>
            <strong id="stack-best">
              00000
            </strong>
          </div>

          <div class="${GAME_CLASS}-stat">
            <span>ROUND</span>
            <strong id="stack-round">
              001
            </strong>
          </div>

          <div class="${GAME_CLASS}-stat">
            <span>LIVES</span>
            <strong id="stack-lives">
              ♥♥♥
            </strong>
          </div>
        </div>

        <div class="${GAME_CLASS}-terminal">
          <div class="${GAME_CLASS}-terminal-bar">
            <div
              class="${GAME_CLASS}-terminal-left"
            >
              <span
                class="${GAME_CLASS}-terminal-dot"
              ></span>

              <span
                class="${GAME_CLASS}-terminal-dot"
              ></span>

              <span
                class="${GAME_CLASS}-terminal-dot"
              ></span>

              <span
                class="${GAME_CLASS}-terminal-path"
              >
                /var/log/jtj/app
              </span>
            </div>

            <span
              id="stack-terminal-state"
              class="${GAME_CLASS}-terminal-state"
            >
              READY
            </span>
          </div>

          <div class="${GAME_CLASS}-trace-box">
            <span
              class="${GAME_CLASS}-trace-label"
            >
              EXECUTION TRACE
            </span>

            <div
              id="stack-trace"
              class="${GAME_CLASS}-trace"
            ></div>
          </div>

          <div
            id="stack-instruction"
            class="${GAME_CLASS}-instruction"
          >
            MEMORIZE THE TRACE
          </div>
        </div>

        <div class="${GAME_CLASS}-nodes">
          <div
            id="stack-node-grid"
            class="${GAME_CLASS}-node-grid"
          ></div>
        </div>

        <div class="${GAME_CLASS}-bottom">
          <button
            id="stack-action"
            type="button"
            class="${GAME_CLASS}-action"
          >
            START TRACE
            <span>↗</span>
          </button>
        </div>
      </div>

      <div
        id="stack-status"
        class="${GAME_CLASS}-status"
      >
        MEMORIZE THE TRACE AND REPLAY IT
      </div>

      <div class="${GAME_CLASS}-footer">
        <span>
          07 / TRACE THE BUG
        </span>

        <span>
          1–9 / KEYBOARD NODES
        </span>
      </div>
    </div>
  `;

  const scoreElement =
    getRequiredElement<HTMLElement>(
      root,
      "#stack-score",
    );

  const bestElement =
    getRequiredElement<HTMLElement>(
      root,
      "#stack-best",
    );

  const roundElement =
    getRequiredElement<HTMLElement>(
      root,
      "#stack-round",
    );

  const livesElement =
    getRequiredElement<HTMLElement>(
      root,
      "#stack-lives",
    );

  const statusElement =
    getRequiredElement<HTMLElement>(
      root,
      "#stack-status",
    );

  const terminalStateElement =
    getRequiredElement<HTMLElement>(
      root,
      "#stack-terminal-state",
    );

  const instructionElement =
    getRequiredElement<HTMLElement>(
      root,
      "#stack-instruction",
    );

  const traceElement =
    getRequiredElement<HTMLElement>(
      root,
      "#stack-trace",
    );

  const nodeGrid =
    getRequiredElement<HTMLElement>(
      root,
      "#stack-node-grid",
    );

  const actionButton =
    getRequiredElement<HTMLButtonElement>(
      root,
      "#stack-action",
    );

  const nodeButtons: HTMLButtonElement[] =
    [];

  let state: GameState =
    "ready";

  let score = 0;

  let best =
    getBestScore();

  let round = 1;

  let lives = 3;

  let combo = 0;

  let sequence: number[] =
    [];

  let inputIndex = 0;

  let perfectRound = true;

  let timers: number[] =
    [];

  let audioContext:
    AudioContext | null = null;

  function clearTimers() {
    for (const timer of timers) {
      window.clearTimeout(
        timer,
      );
    }

    timers = [];
  }

  function wait(
    milliseconds: number,
  ): Promise<void> {
    return new Promise(
      (resolve) => {
        const timer =
          window.setTimeout(
            () => {
              timers =
                timers.filter(
                  (item) =>
                    item !== timer,
                );

              resolve();
            },
            milliseconds,
          );

        timers.push(
          timer,
        );
      },
    );
  }

  function updateHud() {
    scoreElement.textContent =
      formatScore(
        score,
      );

    bestElement.textContent =
      formatScore(
        best,
      );

    roundElement.textContent =
      String(
        round,
      ).padStart(
        3,
        "0",
      );

    livesElement.textContent =
      "♥".repeat(
        Math.max(
          0,
          lives,
        ),
      ) +
      "♡".repeat(
        Math.max(
          0,
          3 - lives,
        ),
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

  function buildNodes() {
    nodeGrid.innerHTML =
      "";

    nodeButtons.length =
      0;

    for (
      let index = 0;
      index < NODE_COUNT;
      index += 1
    ) {
      const button =
        document.createElement(
          "button",
        );

      button.type =
        "button";

      button.className =
        `${GAME_CLASS}-node`;

      button.dataset.node =
        String(index);

      button.setAttribute(
        "aria-label",
        `Trace node ${index + 1}`,
      );

      button.innerHTML = `
        <span
          class="${GAME_CLASS}-node-number"
        >
          ${SYMBOLS[index] ?? ""}
        </span>

        <span
          class="${GAME_CLASS}-node-hex"
        >
          ${HEX_LABELS[index] ?? ""}
        </span>
      `;

      button.addEventListener(
        "click",
        () => {
          handleNodeInput(
            index,
          );
        },
      );

      nodeGrid.appendChild(
        button,
      );

      nodeButtons.push(
        button,
      );
    }
  }

  function createSequence(
    length: number,
  ): number[] {
    const result: number[] =
      [];

    while (
      result.length <
      length
    ) {
      const candidate =
        Math.floor(
          Math.random() *
            NODE_COUNT,
        );

      const previous =
        result[
          result.length - 1
        ];

      if (
        candidate ===
        previous
      ) {
        continue;
      }

      result.push(
        candidate,
      );
    }

    return result;
  }

  function getShowDuration(): number {
    return Math.max(
      250,
      520 -
        (round - 1) * 24,
    );
  }

  function getGapDuration(): number {
    return Math.max(
      70,
      125 -
        (round - 1) * 5,
    );
  }

  function getSequenceLength(): number {
    return Math.min(
      MAX_SEQUENCE_LENGTH,
      INITIAL_SEQUENCE_LENGTH +
        Math.floor(
          (round - 1) /
            2,
        ),
    );
  }

  function resetNodeStyles() {
    for (const button of nodeButtons) {
      button.classList.remove(
        "showing",
        "correct",
        "error",
        "disabled",
      );
    }
  }

  function setNodesDisabled(
    disabled: boolean,
  ) {
    for (const button of nodeButtons) {
      button.disabled =
        disabled;

      button.classList.toggle(
        "disabled",
        disabled,
      );
    }
  }

  function renderTrace() {
    traceElement.innerHTML =
      "";

    if (
      sequence.length ===
      0
    ) {
      return;
    }

    for (
      let index = 0;
      index < sequence.length;
      index += 1
    ) {
      const value =
        sequence[index];

      if (
        value === undefined
      ) {
        continue;
      }

      const item =
        document.createElement(
          "span",
        );

      item.className =
        `${GAME_CLASS}-trace-item`;

      item.textContent =
        SYMBOLS[value] ??
        "--";

      if (
        state === "input"
      ) {
        if (
          index <
          inputIndex
        ) {
          item.classList.add(
            "done",
          );
        }

        if (
          index ===
          inputIndex
        ) {
          item.classList.add(
            "current",
          );
        }
      }

      traceElement.appendChild(
        item,
      );
    }
  }

  function updateInstruction(
    message: string,
  ) {
    instructionElement.textContent =
      message;
  }

  function ensureAudio() {
    if (
      audioContext
    ) {
      return;
    }

    try {
      audioContext =
        new AudioContext();
    } catch {
      audioContext = null;
    }
  }

  function playTone(
    frequency: number,
    duration = 0.06,
  ) {
    ensureAudio();

    if (
      !audioContext
    ) {
      return;
    }

    const oscillator =
      audioContext.createOscillator();

    const gain =
      audioContext.createGain();

    oscillator.type =
      "square";

    oscillator.frequency.setValueAtTime(
      frequency,
      audioContext.currentTime,
    );

    gain.gain.setValueAtTime(
      0.025,
      audioContext.currentTime,
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime +
        duration,
    );

    oscillator.connect(gain);

    gain.connect(
      audioContext.destination,
    );

    oscillator.start();

    oscillator.stop(
      audioContext.currentTime +
        duration,
    );
  }

  function playSequenceTone(
    position: number,
  ) {
    const frequencies = [
      220,
      247,
      277,
      294,
      330,
      370,
      415,
      440,
      494,
    ];

    playTone(
      frequencies[
        position %
          frequencies.length
      ] ?? 330,
      0.08,
    );
  }

  function vibrate(
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

  async function startGame() {
    clearTimers();

    state = "memorizing";

    score = 0;
    round = 1;
    lives = 3;
    combo = 0;

    sequence = [];

    inputIndex = 0;

    perfectRound = true;

    actionButton.disabled =
      true;

    actionButton.textContent =
      "TRACE RUNNING";

    updateHud();

    await startRound();
  }

  async function startRound() {
    clearTimers();

    state = "memorizing";

    inputIndex = 0;

    perfectRound = true;

    sequence =
      createSequence(
        getSequenceLength(),
      );

    resetNodeStyles();

    setNodesDisabled(
      true,
    );

    renderTrace();

    terminalStateElement.textContent =
      "MEMORY";

    updateInstruction(
      "MEMORIZE THE TRACE",
    );

    setStatus(
      `ROUND ${String(
        round,
      ).padStart(2, "0")} / MEMORIZE`,
    );

    await wait(420);

    for (
      let index = 0;
      index < sequence.length;
      index += 1
    ) {
      if (
        state !==
        "memorizing"
      ) {
        return;
      }

      const node =
        sequence[index];

      if (
        node === undefined
      ) {
        continue;
      }

      const button =
        nodeButtons[node];

      if (
        !button
      ) {
        continue;
      }

      resetNodeStyles();

      button.classList.add(
        "showing",
      );

      playSequenceTone(
        index,
      );

      await wait(
        getShowDuration(),
      );

      button.classList.remove(
        "showing",
      );

      await wait(
        getGapDuration(),
      );
    }

    if (
      state !==
      "memorizing"
    ) {
      return;
    }

    state = "input";

    inputIndex = 0;

    resetNodeStyles();

    setNodesDisabled(
      false,
    );

    renderTrace();

    terminalStateElement.textContent =
      "TRACE";

    updateInstruction(
      `REPLAY ${sequence.length} NODES`,
    );

    setStatus(
      "TRACE THE SEQUENCE",
    );
  }

  async function handleNodeInput(
    nodeIndex: number,
  ) {
    if (
      state !== "input"
    ) {
      return;
    }

    const expected =
      sequence[inputIndex];

    if (
      expected ===
      undefined
    ) {
      return;
    }

    const button =
      nodeButtons[nodeIndex];

    if (!button) {
      return;
    }

    if (
      nodeIndex ===
      expected
    ) {
      button.classList.add(
        "correct",
      );

      playTone(
        430 +
          inputIndex * 20,
        0.055,
      );

      vibrate(14);

      inputIndex += 1;

      renderTrace();

      if (
        inputIndex >=
        sequence.length
      ) {
        await completeRound();

        return;
      }

      return;
    }

    button.classList.add(
      "error",
    );

    perfectRound = false;

    combo = 0;

    playTone(
      110,
      0.11,
    );

    vibrate(
      [25, 25],
    );

    lives -= 1;

    updateHud();

    const traceItems =
      Array.from(
        traceElement.children,
      );

    const currentTrace =
      traceItems[
        inputIndex
      ];

    if (
      currentTrace instanceof
      HTMLElement
    ) {
      currentTrace.classList.add(
        "error",
      );
    }

    if (
      lives <= 0
    ) {
      endGame();

      return;
    }

    state = "memorizing";

    setNodesDisabled(
      true,
    );

    terminalStateElement.textContent =
      "ERROR";

    updateInstruction(
      "TRACE MISMATCH / RELOAD ROUND",
    );

    setStatus(
      `WRONG NODE / ${lives} ${
        lives === 1
          ? "LIFE"
          : "LIVES"
      } LEFT`,
      "danger",
    );

    await wait(650);

    if (
      lives <= 0
    ) {
      return;
    }

    await replayCurrentRound();
  }

  async function replayCurrentRound() {
    state = "memorizing";

    inputIndex = 0;

    resetNodeStyles();

    renderTrace();

    terminalStateElement.textContent =
      "RELOAD";

    updateInstruction(
      "RELOADING TRACE",
    );

    await wait(350);

    for (
      let index = 0;
      index < sequence.length;
      index += 1
    ) {
      if (
        state !==
        "memorizing"
      ) {
        return;
      }

      const node =
        sequence[index];

      if (
        node === undefined
      ) {
        continue;
      }

      const button =
        nodeButtons[node];

      if (!button) {
        continue;
      }

      resetNodeStyles();

      button.classList.add(
        "showing",
      );

      playSequenceTone(
        index,
      );

      await wait(
        Math.max(
          250,
          getShowDuration() +
            40,
        ),
      );

      button.classList.remove(
        "showing",
      );

      await wait(
        Math.max(
          70,
          getGapDuration(),
        ),
      );
    }

    state = "input";

    inputIndex = 0;

    resetNodeStyles();

    setNodesDisabled(
      false,
    );

    renderTrace();

    terminalStateElement.textContent =
      "TRACE";

    updateInstruction(
      `REPLAY ${sequence.length} NODES`,
    );

    setStatus(
      "TRY THE TRACE AGAIN",
    );
  }

  async function completeRound() {
    if (
      state !== "input"
    ) {
      return;
    }

    const roundBonus =
      round * 100;

    const comboBonus =
      combo * 35;

    const perfectBonus =
      perfectRound
        ? round * 40
        : 0;

    const gained =
      roundBonus +
      comboBonus +
      perfectBonus;

    score += gained;

    combo += 1;

    if (
      score > best
    ) {
      best = score;

      saveBestScore(
        best,
      );
    }

    playTone(
      660,
      0.1,
    );

    playTone(
      880,
      0.14,
    );

    vibrate(
      [18, 20, 35],
    );

    setNodesDisabled(
      true,
    );

    state = "memorizing";

    terminalStateElement.textContent =
      "PASS";

    updateInstruction(
      perfectRound
        ? "PERFECT TRACE"
        : "TRACE COMPLETE",
    );

    setStatus(
      perfectRound
        ? `PERFECT / +${gained} / COMBO x${combo}`
        : `ROUND CLEAR / +${gained} / COMBO x${combo}`,
      "success",
    );

    updateHud();

    await wait(850);

    round += 1;

    await startRound();
  }

  function endGame() {
    clearTimers();

    state = "gameover";

    setNodesDisabled(
      true,
    );

    terminalStateElement.textContent =
      "CRASH";

    updateInstruction(
      "STACK OVERFLOW",
    );

    const newBest =
      score >= best &&
      score > 0;

    if (
      newBest
    ) {
      best = score;

      saveBestScore(
        best,
      );
    }

    setStatus(
      newBest
        ? `NEW BEST / ${formatScore(
            score,
          )}`
        : `TRACE FAILED / SCORE ${formatScore(
            score,
          )}`,
      "danger",
    );

    actionButton.disabled =
      false;

    actionButton.textContent =
      "RESTART TRACE ↗";

    updateHud();

    vibrate([
      60,
      35,
      100,
    ]);
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
      event.key ===
        " " ||
      event.key ===
        "Enter"
    ) {
      if (
        state === "ready" ||
        state ===
          "gameover"
      ) {
        event.preventDefault();

        void startGame();
      }

      return;
    }

    const value =
      Number(event.key);

    if (
      value >= 1 &&
      value <= 9
    ) {
      event.preventDefault();

      void handleNodeInput(
        value - 1,
      );
    }

    if (
      event.key ===
      "Escape"
    ) {
      clearTimers();

      state = "ready";

      setNodesDisabled(
        true,
      );

      actionButton.disabled =
        false;

      actionButton.textContent =
        "START TRACE";

      terminalStateElement.textContent =
        "READY";

      updateInstruction(
        "MEMORIZE THE TRACE",
      );

      setStatus(
        "TRACE ABORTED",
      );
    }
  }

  actionButton.addEventListener(
    "click",
    () => {
      if (
        state === "ready" ||
        state ===
          "gameover"
      ) {
        void startGame();
      }
    },
  );

  buildNodes();

  setNodesDisabled(
    true,
  );

  updateHud();

  setStatus(
    "MEMORIZE THE TRACE AND REPLAY IT",
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

    if (
      audioContext
    ) {
      void audioContext.close();

      audioContext = null;
    }

    root.innerHTML = "";
  };
}