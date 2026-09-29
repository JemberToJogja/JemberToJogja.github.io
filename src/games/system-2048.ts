type Direction =
  | "up"
  | "down"
  | "left"
  | "right";

type GameState = {
  board: number[];
  score: number;
  best: number;
  won: boolean;
  gameOver: boolean;
};

const SIZE = 4;

const BEST_SCORE_KEY =
  "jtj-system-2048-best-score";

const GAME_CLASS =
  "jtj-system-2048";

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
      `[SYSTEM 2048] Missing element: ${selector}`,
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

    if (!Number.isFinite(value)) {
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
    // Ignore storage errors.
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
      '[data-system-2048-style="true"]',
    )
  ) {
    return;
  }

  const style =
    document.createElement(
      "style",
    );

  style.dataset.system2048Style =
    "true";

  style.textContent = `
    .${GAME_CLASS} {
      width: min(100%, 640px);
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
        44px,
        13vw,
        90px
      );

      font-weight: 950;
      line-height: .82;
      letter-spacing: -.085em;
    }

    .${GAME_CLASS}-description {
      max-width: 570px;
      margin: 0;

      color: #7d7972;

      font-size: 12px;
      line-height: 1.7;
    }

    .${GAME_CLASS}-panel {
      overflow: hidden;

      background: #242423;
      border: 1px solid #45443f;
    }

    .${GAME_CLASS}-topbar {
      display: grid;
      grid-template-columns:
        minmax(0, 1fr)
        50px
        minmax(0, 1fr);

      gap: 8px;
      align-items: center;

      padding: 10px;

      background: #0d0d0d;
      border-bottom: 1px solid #302f2c;
    }

    .${GAME_CLASS}-score {
      display: grid;
      gap: 4px;
    }

    .${GAME_CLASS}-score:last-child {
      justify-items: end;
    }

    .${GAME_CLASS}-score span {
      color: #5a5852;

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

    .${GAME_CLASS}-score strong {
      color: #eeeae1;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 18px;
      font-weight: 900;
      line-height: 1;
      letter-spacing: -.04em;
    }

    .${GAME_CLASS}-restart {
      width: 38px;
      height: 38px;

      display: grid;
      place-items: center;

      padding: 0;

      border: 1px solid #4b4a45;
      background: #aaa79f;
      color: #111111;

      cursor: pointer;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 15px;
      font-weight: 950;

      touch-action: manipulation;
    }

    .${GAME_CLASS}-restart:active {
      transform: translateY(1px);
    }

    .${GAME_CLASS}-board-wrap {
      padding: 10px;

      background: #353430;

      touch-action: none;
    }

    .${GAME_CLASS}-board {
      position: relative;

      width: 100%;
      max-width: 540px;

      aspect-ratio: 1;

      margin: 0 auto;
      padding: 7px;

      display: grid;
      grid-template-columns:
        repeat(4, minmax(0, 1fr));
      gap: 7px;

      background: #5c5952;

      touch-action: none;
      user-select: none;

      overscroll-behavior: none;
      -webkit-user-select: none;
    }

    .${GAME_CLASS}-cell {
      min-width: 0;
      aspect-ratio: 1;

      display: grid;
      place-items: center;

      background: #474641;
      border: 0;

      color: #4d4a44;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: clamp(
        24px,
        9vw,
        56px
      );

      font-weight: 950;
      line-height: 1;

      letter-spacing: -.07em;
    }

    .${GAME_CLASS}-tile {
      min-width: 0;

      display: grid;
      place-items: center;

      border: 0;

      color: #f0ece3;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: clamp(
        24px,
        9vw,
        56px
      );

      font-weight: 950;
      line-height: 1;

      letter-spacing: -.08em;

      overflow: hidden;
    }

    .${GAME_CLASS}-tile[data-value="2"] {
      background: #5a5750;
    }

    .${GAME_CLASS}-tile[data-value="4"] {
      background: #67645d;
    }

    .${GAME_CLASS}-tile[data-value="8"] {
      background: #756c5a;
    }

    .${GAME_CLASS}-tile[data-value="16"] {
      background: #805f4f;
    }

    .${GAME_CLASS}-tile[data-value="32"] {
      background: #8b5447;
    }

    .${GAME_CLASS}-tile[data-value="64"] {
      background: #91473c;
    }

    .${GAME_CLASS}-tile[data-value="128"] {
      background: #756a50;
      font-size: clamp(
        20px,
        7vw,
        44px
      );
    }

    .${GAME_CLASS}-tile[data-value="256"] {
      background: #69604b;
      font-size: clamp(
        20px,
        7vw,
        44px
      );
    }

    .${GAME_CLASS}-tile[data-value="512"] {
      background: #5d5546;
      font-size: clamp(
        20px,
        7vw,
        44px
      );
    }

    .${GAME_CLASS}-tile[data-value="1024"] {
      background: #4f493f;
      font-size: clamp(
        17px,
        5.8vw,
        37px
      );
    }

    .${GAME_CLASS}-tile[data-value="2048"] {
      background: #eeeae1;
      color: #121212;
      font-size: clamp(
        17px,
        5.8vw,
        37px
      );
    }

    .${GAME_CLASS}-tile[data-value="4096"],
    .${GAME_CLASS}-tile[data-value="8192"] {
      background: #31312f;
      font-size: clamp(
        16px,
        5vw,
        31px
      );
    }

    /* =========================================================
       CONTROLS
    ========================================================= */

    .${GAME_CLASS}-controls {
      padding: 14px 12px 16px;

      background: #111111;
      border-top: 1px solid #292927;

      touch-action: manipulation;
    }

    .${GAME_CLASS}-controls-label {
      margin-bottom: 11px;

      color: #54514b;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 6px;
      font-weight: 800;
      letter-spacing: .12em;
      text-align: center;
    }

    .${GAME_CLASS}-dpad {
      width: min(100%, 260px);

      margin: 0 auto;

      display: grid;
      grid-template-columns:
        repeat(3, 1fr);
      grid-template-rows:
        repeat(2, 62px);

      gap: 8px;
    }

    .${GAME_CLASS}-move {
      min-width: 0;
      min-height: 62px;

      display: grid;
      place-items: center;

      padding: 0;

      border: 1px solid #44423d;

      background: #20201e;
      color: #d6d1c8;

      cursor: pointer;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 25px;
      font-weight: 900;
      line-height: 1;

      touch-action: manipulation;
      user-select: none;

      transition:
        background-color 80ms ease,
        color 80ms ease,
        transform 80ms ease,
        border-color 80ms ease;
    }

    .${GAME_CLASS}-move:active {
      background: #eeeae1;
      border-color: #eeeae1;
      color: #111111;
      transform: scale(.96);
    }

    .${GAME_CLASS}-move[data-direction="up"] {
      grid-column: 2;
      grid-row: 1;
    }

    .${GAME_CLASS}-move[data-direction="left"] {
      grid-column: 1;
      grid-row: 2;
    }

    .${GAME_CLASS}-move[data-direction="down"] {
      grid-column: 2;
      grid-row: 2;
    }

    .${GAME_CLASS}-move[data-direction="right"] {
      grid-column: 3;
      grid-row: 2;
    }

    .${GAME_CLASS}-gesture-hint {
      margin-top: 12px;

      color: #4f4d48;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 6px;
      font-weight: 800;
      letter-spacing: .1em;
      text-align: center;
    }

    .${GAME_CLASS}-status {
      min-height: 48px;

      display: grid;
      place-items: center;

      margin-top: 10px;
      padding: 12px;

      border: 1px solid #2b2a27;
      background: #111111;
      color: #77736c;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 7px;
      font-weight: 850;
      line-height: 1.5;
      letter-spacing: .08em;
      text-align: center;
    }

    .${GAME_CLASS}-status.success {
      color: #bfd2b5;
      border-color: #394434;
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
        padding: 30px;
      }

      .${GAME_CLASS}-board-wrap {
        padding: 16px;
      }

      .${GAME_CLASS}-dpad {
        width: 280px;
      }

      .${GAME_CLASS}-move {
        min-height: 66px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .${GAME_CLASS}-move {
        transition: none;
      }
    }
  `;

  document.head.appendChild(
    style,
  );
}

function createEmptyBoard(): number[] {
  return Array.from(
    {
      length: SIZE * SIZE,
    },
    () => 0,
  );
}

function getEmptyIndexes(
  board: number[],
): number[] {
  const indexes: number[] =
    [];

  board.forEach(
    (value, index) => {
      if (value === 0) {
        indexes.push(index);
      }
    },
  );

  return indexes;
}

function addRandomTile(
  board: number[],
): boolean {
  const empty =
    getEmptyIndexes(board);

  if (empty.length === 0) {
    return false;
  }

  const randomSlot =
    Math.floor(
      Math.random() *
        empty.length,
    );

  const index =
    empty[randomSlot];

  if (index === undefined) {
    return false;
  }

  board[index] =
    Math.random() < 0.9
      ? 2
      : 4;

  return true;
}

function slideLine(
  line: number[],
): {
  line: number[];
  score: number;
  moved: boolean;
} {
  const filtered =
    line.filter(
      (value) =>
        value !== 0,
    );

  const result: number[] =
    [];

  let score = 0;

  for (
    let index = 0;
    index < filtered.length;
    index += 1
  ) {
    const current =
      filtered[index];

    const next =
      filtered[index + 1];

    if (
      current !== undefined &&
      next !== undefined &&
      current === next
    ) {
      const merged =
        current * 2;

      result.push(
        merged,
      );

      score += merged;

      index += 1;
    } else if (
      current !== undefined
    ) {
      result.push(
        current,
      );
    }
  }

  while (
    result.length < SIZE
  ) {
    result.push(0);
  }

  const moved =
    result.some(
      (value, index) =>
        value !== line[index],
    );

  return {
    line: result,
    score,
    moved,
  };
}

function readLine(
  board: number[],
  direction: Direction,
  lineIndex: number,
): number[] {
  const line: number[] =
    [];

  for (
    let offset = 0;
    offset < SIZE;
    offset += 1
  ) {
    let row = lineIndex;
    let col = offset;

    if (direction === "up") {
      row = offset;
      col = lineIndex;
    }

    if (
      direction === "down"
    ) {
      row =
        SIZE -
        1 -
        offset;

      col = lineIndex;
    }

    if (
      direction === "left"
    ) {
      row = lineIndex;
      col = offset;
    }

    if (
      direction === "right"
    ) {
      row = lineIndex;

      col =
        SIZE -
        1 -
        offset;
    }

    line.push(
      board[
        row * SIZE + col
      ] ?? 0,
    );
  }

  return line;
}

function writeLine(
  board: number[],
  direction: Direction,
  lineIndex: number,
  line: number[],
) {
  for (
    let offset = 0;
    offset < SIZE;
    offset += 1
  ) {
    let row = lineIndex;
    let col = offset;

    if (direction === "up") {
      row = offset;
      col = lineIndex;
    }

    if (
      direction === "down"
    ) {
      row =
        SIZE -
        1 -
        offset;

      col = lineIndex;
    }

    if (
      direction === "left"
    ) {
      row = lineIndex;
      col = offset;
    }

    if (
      direction === "right"
    ) {
      row = lineIndex;

      col =
        SIZE -
        1 -
        offset;
    }

    board[
      row * SIZE + col
    ] = line[offset] ?? 0;
  }
}

function moveBoard(
  board: number[],
  direction: Direction,
): {
  board: number[];
  score: number;
  moved: boolean;
} {
  const next = [
    ...board,
  ];

  let score = 0;
  let moved = false;

  for (
    let lineIndex = 0;
    lineIndex < SIZE;
    lineIndex += 1
  ) {
    const line =
      readLine(
        next,
        direction,
        lineIndex,
      );

    const result =
      slideLine(line);

    writeLine(
      next,
      direction,
      lineIndex,
      result.line,
    );

    score +=
      result.score;

    if (result.moved) {
      moved = true;
    }
  }

  if (moved) {
    addRandomTile(next);
  }

  return {
    board: next,
    score,
    moved,
  };
}

function hasMoves(
  board: number[],
): boolean {
  if (
    board.some(
      (value) =>
        value === 0,
    )
  ) {
    return true;
  }

  for (
    let row = 0;
    row < SIZE;
    row += 1
  ) {
    for (
      let col = 0;
      col < SIZE;
      col += 1
    ) {
      const current =
        board[
          row * SIZE + col
        ];

      if (
        current === undefined
      ) {
        continue;
      }

      if (
        col + 1 < SIZE &&
        board[
          row * SIZE +
            col +
            1
        ] === current
      ) {
        return true;
      }

      if (
        row + 1 < SIZE &&
        board[
          (row + 1) *
            SIZE +
            col
        ] === current
      ) {
        return true;
      }
    }
  }

  return false;
}

function hasWon(
  board: number[],
): boolean {
  return board.some(
    (value) =>
      value >= 2048,
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
    // Ignore.
  }
}

export function mountGame(
  root: HTMLElement,
) {
  injectStyles();

  root.innerHTML = `
    <div class="${GAME_CLASS}">
      <div class="${GAME_CLASS}-head">
        <div class="${GAME_CLASS}-eyebrow">
          <span>GAME 04 / PUZZLE</span>
          <span>SYSTEM TEST</span>
        </div>

        <h2 class="${GAME_CLASS}-title">
          SYSTEM 2048
        </h2>

        <p class="${GAME_CLASS}-description">
          Merge numbers, build bigger numbers,
          and slowly forget why this was supposed
          to be a five-minute break.
        </p>
      </div>

      <div class="${GAME_CLASS}-panel">
        <div class="${GAME_CLASS}-topbar">
          <div class="${GAME_CLASS}-score">
            <span>SCORE</span>
            <strong id="system-2048-score">
              00000
            </strong>
          </div>

          <button
            type="button"
            class="${GAME_CLASS}-restart"
            id="system-2048-restart"
            aria-label="Restart 2048"
          >
            ↻
          </button>

          <div class="${GAME_CLASS}-score">
            <span>BEST</span>
            <strong id="system-2048-best">
              00000
            </strong>
          </div>
        </div>

        <div class="${GAME_CLASS}-board-wrap">
          <div
            class="${GAME_CLASS}-board"
            id="system-2048-board"
            aria-label="2048 game board"
            role="application"
          ></div>
        </div>

        <div class="${GAME_CLASS}-controls">
          <div class="${GAME_CLASS}-controls-label">
            SWIPE BOARD OR USE CONTROLS
          </div>

          <div class="${GAME_CLASS}-dpad">
            <button
              type="button"
              class="${GAME_CLASS}-move"
              data-direction="up"
              aria-label="Move up"
            >
              ↑
            </button>

            <button
              type="button"
              class="${GAME_CLASS}-move"
              data-direction="left"
              aria-label="Move left"
            >
              ←
            </button>

            <button
              type="button"
              class="${GAME_CLASS}-move"
              data-direction="down"
              aria-label="Move down"
            >
              ↓
            </button>

            <button
              type="button"
              class="${GAME_CLASS}-move"
              data-direction="right"
              aria-label="Move right"
            >
              →
            </button>
          </div>

          <div class="${GAME_CLASS}-gesture-hint">
            TOUCH + DRAG IN ANY DIRECTION
          </div>
        </div>
      </div>

      <div
        id="system-2048-status"
        class="${GAME_CLASS}-status"
      >
        SWIPE TO MOVE
      </div>

      <div class="${GAME_CLASS}-footer">
        <span>
          2048 / KEEP GOING
        </span>

        <span>
          MERGE / REPEAT / REGRET
        </span>
      </div>
    </div>
  `;

  const boardElement =
    getRequiredElement<HTMLElement>(
      root,
      "#system-2048-board",
    );

  const scoreElement =
    getRequiredElement<HTMLElement>(
      root,
      "#system-2048-score",
    );

  const bestElement =
    getRequiredElement<HTMLElement>(
      root,
      "#system-2048-best",
    );

  const restartButton =
    getRequiredElement<HTMLButtonElement>(
      root,
      "#system-2048-restart",
    );

  const statusElement =
    getRequiredElement<HTMLElement>(
      root,
      "#system-2048-status",
    );

  const directionButtons =
    Array.from(
      root.querySelectorAll<HTMLButtonElement>(
        "[data-direction]",
      ),
    );

  let state: GameState = {
    board: createEmptyBoard(),
    score: 0,
    best: getBestScore(),
    won: false,
    gameOver: false,
  };

  let continueAfterWin =
    false;

  let pointerStartX:
    number | null = null;

  let pointerStartY:
    number | null = null;

  let pointerId:
    number | null = null;

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

  function updateScore() {
    scoreElement.textContent =
      formatScore(
        state.score,
      );

    bestElement.textContent =
      formatScore(
        state.best,
      );
  }

  function render() {
    boardElement.innerHTML =
      "";

    state.board.forEach(
      (value, index) => {
        const cell =
          document.createElement(
            "div",
          );

        cell.className =
          `${GAME_CLASS}-cell`;

        if (value > 0) {
          const tile =
            document.createElement(
              "div",
            );

          tile.className =
            `${GAME_CLASS}-tile`;

          tile.dataset.value =
            String(value);

          tile.textContent =
            String(value);

          cell.appendChild(
            tile,
          );
        }

        cell.dataset.index =
          String(index);

        boardElement.appendChild(
          cell,
        );
      },
    );

    updateScore();
  }

  function createGame() {
    state = {
      board:
        createEmptyBoard(),
      score: 0,
      best: getBestScore(),
      won: false,
      gameOver: false,
    };

    continueAfterWin =
      false;

    addRandomTile(
      state.board,
    );

    addRandomTile(
      state.board,
    );

    setStatus(
      "SWIPE TO MOVE",
    );

    render();
  }

  function move(
    direction: Direction,
  ) {
    if (
      state.gameOver
    ) {
      return;
    }

    if (
      state.won &&
      !continueAfterWin
    ) {
      return;
    }

    const result =
      moveBoard(
        state.board,
        direction,
      );

    if (!result.moved) {
      if (
        !hasMoves(
          state.board,
        )
      ) {
        state.gameOver =
          true;

        setStatus(
          "SYSTEM HALTED / NO MOVES LEFT",
          "danger",
        );

        render();

        vibrate(
          [60, 40, 90],
        );
      }

      return;
    }

    state.board =
      result.board;

    state.score +=
      result.score;

    if (
      state.score >
      state.best
    ) {
      state.best =
        state.score;

      saveBestScore(
        state.best,
      );
    }

    if (
      !state.won &&
      hasWon(
        state.board,
      )
    ) {
      state.won = true;

      setStatus(
        "2048 REACHED / TAP RESTART OR KEEP GOING",
        "success",
      );

      vibrate(
        [35, 25, 55],
      );
    } else if (
      !hasMoves(
        state.board,
      )
    ) {
      state.gameOver =
        true;

      setStatus(
        "SYSTEM HALTED / NO MOVES LEFT",
        "danger",
      );

      vibrate(
        [60, 40, 90],
      );
    } else {
      setStatus(
        "SYSTEM ONLINE / KEEP MERGING",
      );
    }

    render();
  }

  function handleKey(
    event: KeyboardEvent,
  ) {
    const target =
      event.target;

    if (
      target instanceof
        HTMLInputElement ||
      target instanceof
        HTMLTextAreaElement
    ) {
      return;
    }

    const directionMap: Record<
      string,
      Direction | undefined
    > = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      w: "up",
      W: "up",
      s: "down",
      S: "down",
      a: "left",
      A: "left",
      d: "right",
      D: "right",
    };

    const direction =
      directionMap[
        event.key
      ];

    if (!direction) {
      return;
    }

    event.preventDefault();

    move(direction);
  }

  function handlePointerDown(
    event: PointerEvent,
  ) {
    if (
      state.gameOver
    ) {
      return;
    }

    pointerStartX =
      event.clientX;

    pointerStartY =
      event.clientY;

    pointerId =
      event.pointerId;

    try {
      boardElement.setPointerCapture(
        event.pointerId,
      );
    } catch {
      // Ignore.
    }
  }

  function resetPointer() {
    pointerStartX = null;
    pointerStartY = null;
    pointerId = null;
  }

  function handlePointerUp(
    event: PointerEvent,
  ) {
    if (
      pointerStartX ===
        null ||
      pointerStartY ===
        null
    ) {
      resetPointer();
      return;
    }

    if (
      pointerId !== null &&
      event.pointerId !==
        pointerId
    ) {
      return;
    }

    const deltaX =
      event.clientX -
      pointerStartX;

    const deltaY =
      event.clientY -
      pointerStartY;

    resetPointer();

    const distance =
      Math.sqrt(
        deltaX * deltaX +
          deltaY * deltaY,
      );

    /*
     * Small movements should never accidentally
     * trigger a game move.
     */
    if (
      distance < 22
    ) {
      return;
    }

    /*
     * Determine the dominant axis.
     * This makes diagonal swipes predictable.
     */
    if (
      Math.abs(deltaX) >
      Math.abs(deltaY)
    ) {
      move(
        deltaX > 0
          ? "right"
          : "left",
      );
    } else {
      move(
        deltaY > 0
          ? "down"
          : "up",
      );
    }
  }

  function handlePointerCancel() {
    resetPointer();
  }

  directionButtons.forEach(
    (button) => {
      button.addEventListener(
        "click",
        () => {
          const value =
            button.dataset
              .direction;

          if (
            value === "up" ||
            value === "down" ||
            value === "left" ||
            value === "right"
          ) {
            move(value);
          }
        },
      );
    },
  );

  restartButton.addEventListener(
    "click",
    createGame,
  );

  document.addEventListener(
    "keydown",
    handleKey,
  );

  boardElement.addEventListener(
    "pointerdown",
    handlePointerDown,
  );

  boardElement.addEventListener(
    "pointerup",
    handlePointerUp,
  );

  boardElement.addEventListener(
    "pointercancel",
    handlePointerCancel,
  );

  boardElement.addEventListener(
    "lostpointercapture",
    handlePointerCancel,
  );

  createGame();

  return () => {
    document.removeEventListener(
      "keydown",
      handleKey,
    );

    directionButtons.forEach(
      (button) => {
        /*
         * Buttons live inside root and disappear with root.
         * No extra global listeners exist here.
         */
      },
    );

    resetPointer();

    root.innerHTML = "";
  };
}