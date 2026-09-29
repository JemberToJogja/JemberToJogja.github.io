type GameState =
  | "ready"
  | "playing"
  | "won"
  | "lost";

type Cell = {
  row: number;
  col: number;
  mine: boolean;
  adjacent: number;
  revealed: boolean;
  flagged: boolean;
};

type DebuggerGame = {
  board: Cell[];
  state: GameState;
  elapsed: number;
  timerStartedAt: number | null;
};

const ROWS = 8;
const COLS = 7;
const MINES = 10;

const BEST_TIME_KEY =
  "jtj-debugger-best-time";

const GAME_CLASS =
  "jtj-debugger-game";

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
      `[DEBUGGER] Missing element: ${selector}`,
    );
  }

  return element;
}

function injectStyles() {
  if (
    document.head.querySelector(
      '[data-debugger-style="true"]',
    )
  ) {
    return;
  }

  const style =
    document.createElement("style");

  style.dataset.debuggerStyle =
    "true";

  style.textContent = `
    .${GAME_CLASS} {
      width: min(100%, 620px);
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

    .${GAME_CLASS} button {
      font: inherit;
      -webkit-tap-highlight-color: transparent;
    }

    .${GAME_CLASS}-head {
      display: grid;
      gap: 14px;
      margin-bottom: 14px;
    }

    .${GAME_CLASS}-eyebrow {
      display: flex;
      justify-content: space-between;
      gap: 10px;

      color: #63615b;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 7px;
      font-weight: 800;
      line-height: 1.4;
      letter-spacing: .11em;
    }

    .${GAME_CLASS}-title {
      margin: 0;

      color: #eeeae1;

      font-size: clamp(44px, 13vw, 82px);
      font-weight: 950;
      line-height: .82;
      letter-spacing: -.08em;
    }

    .${GAME_CLASS}-subtitle {
      max-width: 520px;
      margin: 0;

      color: #7f7b74;

      font-size: 12px;
      line-height: 1.65;
    }

    .${GAME_CLASS}-panel {
      overflow: hidden;

      background: #242423;
      border: 1px solid #45443f;
    }

    .${GAME_CLASS}-topbar {
      display: grid;
      grid-template-columns: 1fr 50px 1fr;
      gap: 8px;
      align-items: center;

      padding: 10px;

      background: #0d0d0d;
      border-bottom: 1px solid #302f2c;
    }

    .${GAME_CLASS}-counter {
      display: grid;
      gap: 3px;
    }

    .${GAME_CLASS}-counter:last-child {
      justify-items: end;
    }

    .${GAME_CLASS}-counter span {
      color: #5c5a55;

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

    .${GAME_CLASS}-counter strong {
      color: #eeeae1;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 19px;
      font-weight: 900;
      line-height: 1;
      letter-spacing: -.04em;
    }

    .${GAME_CLASS}-face {
      width: 34px;
      height: 34px;

      display: grid;
      place-items: center;

      padding: 0;

      border: 1px solid #4c4b46;
      background: #a9a69e;
      color: #131313;

      cursor: pointer;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 10px;
      font-weight: 950;

      touch-action: manipulation;
    }

    .${GAME_CLASS}-face:active {
      transform: translateY(1px);
    }

    .${GAME_CLASS}-board-wrap {
      padding: 10px;
      background: #2b2b29;
    }

    .${GAME_CLASS}-board {
      width: 100%;
      max-width: 520px;
      margin: 0 auto;

      display: grid;
      grid-template-columns:
        repeat(${COLS}, minmax(0, 1fr));
      gap: 2px;

      padding: 3px;

      background: #62605a;
      border: 1px solid #77746c;

      user-select: none;
    }

    .${GAME_CLASS}-cell {
      min-width: 0;
      aspect-ratio: 1;

      display: grid;
      place-items: center;

      padding: 0;

      border: 0;
      border-radius: 0;

      background: #363633;
      color: #d8d3c9;

      cursor: pointer;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: clamp(12px, 3.5vw, 18px);
      font-weight: 950;
      line-height: 1;

      box-shadow:
        inset 2px 2px 0 #4d4c47,
        inset -2px -2px 0 #242422;

      touch-action: manipulation;
    }

    .${GAME_CLASS}-cell:active {
      transform: translateY(1px);
    }

    .${GAME_CLASS}-cell:focus-visible {
      outline: 2px solid #eeeae1;
      outline-offset: -2px;
    }

    .${GAME_CLASS}-cell.revealed {
      background: #4a4944;
      box-shadow: none;
      cursor: default;
    }

    .${GAME_CLASS}-cell.flagged {
      color: #d07b70;
    }

    .${GAME_CLASS}-cell.mine {
      background: #713e39;
      color: #f4ede3;
      box-shadow: none;
    }

    .${GAME_CLASS}-cell.exploded {
      background: #a65b4f;
      color: #fffaf0;
    }

    .${GAME_CLASS}-cell.wrong-flag {
      background: #4d302d;
      color: #d07b70;
    }

    .${GAME_CLASS}-cell.number-1 {
      color: #c7d3df;
    }

    .${GAME_CLASS}-cell.number-2 {
      color: #b8cfad;
    }

    .${GAME_CLASS}-cell.number-3 {
      color: #d7aca3;
    }

    .${GAME_CLASS}-cell.number-4 {
      color: #b9b6d4;
    }

    .${GAME_CLASS}-cell.number-5 {
      color: #d4aaa0;
    }

    .${GAME_CLASS}-cell.number-6 {
      color: #a9c7c0;
    }

    .${GAME_CLASS}-cell.number-7 {
      color: #e0ddd4;
    }

    .${GAME_CLASS}-cell.number-8 {
      color: #aaa69f;
    }

    .${GAME_CLASS}-toolbar {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;

      padding: 10px;

      border-top: 1px solid #363531;
      background: #171716;
    }

    .${GAME_CLASS}-control {
      min-height: 42px;

      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;

      padding: 0 10px;

      border: 1px solid #3d3c38;
      background: #1f1f1d;
      color: #aaa69e;

      cursor: pointer;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 7px;
      font-weight: 850;
      letter-spacing: .08em;

      touch-action: manipulation;
    }

    .${GAME_CLASS}-control.active {
      background: #eeeae1;
      border-color: #eeeae1;
      color: #121212;
    }

    .${GAME_CLASS}-control:active {
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
      color: #77746d;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 7px;
      font-weight: 850;
      letter-spacing: .08em;
      text-align: center;
    }

    .${GAME_CLASS}-status.success {
      color: #b8d1ad;
      border-color: #384334;
    }

    .${GAME_CLASS}-status.danger {
      color: #d59a91;
      border-color: #493330;
    }

    .${GAME_CLASS}-info {
      display: flex;
      justify-content: space-between;
      gap: 12px;

      margin-top: 10px;
      padding: 11px 0 0;

      border-top: 1px solid #2b2a27;

      color: #5f5d57;

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

    @media (min-width: 700px) {
      .${GAME_CLASS} {
        padding: 34px;
      }

      .${GAME_CLASS}-board-wrap {
        padding: 16px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .${GAME_CLASS}-cell,
      .${GAME_CLASS}-face,
      .${GAME_CLASS}-control {
        transition: none;
      }
    }
  `;

  document.head.appendChild(style);
}

function formatNumber(
  value: number,
): string {
  return String(
    Math.max(
      0,
      Math.min(999, value),
    ),
  ).padStart(3, "0");
}

function getBestTime():
  number | null {
  try {
    const raw =
      localStorage.getItem(
        BEST_TIME_KEY,
      );

    if (!raw) {
      return null;
    }

    const value = Number(raw);

    if (!Number.isFinite(value)) {
      return null;
    }

    return Math.floor(
      Math.max(0, value),
    );
  } catch {
    return null;
  }
}

function saveBestTime(
  value: number,
) {
  try {
    localStorage.setItem(
      BEST_TIME_KEY,
      String(value),
    );
  } catch {
    // Ignore storage errors.
  }
}

function createBoard(): Cell[] {
  const board: Cell[] = [];

  for (
    let row = 0;
    row < ROWS;
    row += 1
  ) {
    for (
      let col = 0;
      col < COLS;
      col += 1
    ) {
      board.push({
        row,
        col,
        mine: false,
        adjacent: 0,
        revealed: false,
        flagged: false,
      });
    }
  }

  return board;
}

function getIndex(
  row: number,
  col: number,
): number {
  return (
    row * COLS + col
  );
}

function getNeighbors(
  row: number,
  col: number,
): number[] {
  const neighbors: number[] =
    [];

  for (
    let rowOffset = -1;
    rowOffset <= 1;
    rowOffset += 1
  ) {
    for (
      let colOffset = -1;
      colOffset <= 1;
      colOffset += 1
    ) {
      if (
        rowOffset === 0 &&
        colOffset === 0
      ) {
        continue;
      }

      const nextRow =
        row + rowOffset;

      const nextCol =
        col + colOffset;

      if (
        nextRow < 0 ||
        nextRow >= ROWS ||
        nextCol < 0 ||
        nextCol >= COLS
      ) {
        continue;
      }

      neighbors.push(
        getIndex(
          nextRow,
          nextCol,
        ),
      );
    }
  }

  return neighbors;
}

function shuffled(
  values: number[],
): number[] {
  const result = [
    ...values,
  ];

  for (
    let index =
      result.length - 1;
    index > 0;
    index -= 1
  ) {
    const randomIndex =
      Math.floor(
        Math.random() *
          (index + 1),
      );

    const temp =
      result[index];

    result[index] =
      result[randomIndex];

    result[randomIndex] =
      temp;
  }

  return result;
}

function plantMines(
  board: Cell[],
  safeIndex: number,
) {
  const firstCell =
    board[safeIndex];

  if (!firstCell) {
    return;
  }

  const blocked =
    new Set<number>([
      safeIndex,
      ...getNeighbors(
        firstCell.row,
        firstCell.col,
      ),
    ]);

  const candidates =
    board
      .map(
        (_, index) =>
          index,
      )
      .filter(
        (index) =>
          !blocked.has(index),
      );

  const mines =
    shuffled(
      candidates,
    ).slice(
      0,
      MINES,
    );

  for (const index of mines) {
    const cell =
      board[index];

    if (cell) {
      cell.mine = true;
    }
  }

  for (
    let index = 0;
    index < board.length;
    index += 1
  ) {
    const cell =
      board[index];

    if (!cell) {
      continue;
    }

    cell.adjacent =
      getNeighbors(
        cell.row,
        cell.col,
      ).filter(
        (neighborIndex) =>
          board[neighborIndex]
            ?.mine === true,
      ).length;
  }
}

function faceForState(
  state: GameState,
): string {
  if (state === "won") {
    return "B)";
  }

  if (state === "lost") {
    return ":(";
  }

  return ":)";
}

export function mountGame(
  root: HTMLElement,
) {
  injectStyles();

  root.innerHTML = `
    <div class="${GAME_CLASS}">
      <div class="${GAME_CLASS}-head">
        <div class="${GAME_CLASS}-eyebrow">
          <span>GAME 02 / PUZZLE</span>
          <span>CLASSIC MODE</span>
        </div>

        <h2 class="${GAME_CLASS}-title">
          DEBUGGER
        </h2>

        <p class="${GAME_CLASS}-subtitle">
          Find the bugs. Do not become one.
          Reveal safe cells, mark suspicious ones,
          and try not to ship the mine.
        </p>
      </div>

      <div class="${GAME_CLASS}-panel">
        <div class="${GAME_CLASS}-topbar">
          <div class="${GAME_CLASS}-counter">
            <span>MINES</span>
            <strong id="debugger-mines">
              ${formatNumber(MINES)}
            </strong>
          </div>

          <button
            type="button"
            class="${GAME_CLASS}-face"
            id="debugger-face"
            aria-label="Restart game"
          >
            :)
          </button>

          <div class="${GAME_CLASS}-counter">
            <span>TIME</span>
            <strong id="debugger-time">
              000
            </strong>
          </div>
        </div>

        <div class="${GAME_CLASS}-board-wrap">
          <div
            class="${GAME_CLASS}-board"
            id="debugger-board"
            role="grid"
            aria-label="Minesweeper board"
          ></div>
        </div>

        <div class="${GAME_CLASS}-toolbar">
          <button
            type="button"
            class="${GAME_CLASS}-control"
            id="debugger-flag"
          >
            ⚑ FLAG MODE
          </button>

          <button
            type="button"
            class="${GAME_CLASS}-control"
            id="debugger-reset"
          >
            ↻ RESTART
          </button>
        </div>
      </div>

      <div
        class="${GAME_CLASS}-status"
        id="debugger-status"
      >
        REVEAL A CELL TO START
      </div>

      <div class="${GAME_CLASS}-info">
        <span id="debugger-best">
          BEST / ---
        </span>

        <span>
          RIGHT CLICK / FLAG
        </span>
      </div>
    </div>
  `;

  const boardElement =
    getRequiredElement<HTMLElement>(
      root,
      "#debugger-board",
    );

  const minesElement =
    getRequiredElement<HTMLElement>(
      root,
      "#debugger-mines",
    );

  const timeElement =
    getRequiredElement<HTMLElement>(
      root,
      "#debugger-time",
    );

  const faceButton =
    getRequiredElement<HTMLButtonElement>(
      root,
      "#debugger-face",
    );

  const flagButton =
    getRequiredElement<HTMLButtonElement>(
      root,
      "#debugger-flag",
    );

  const resetButton =
    getRequiredElement<HTMLButtonElement>(
      root,
      "#debugger-reset",
    );

  const statusElement =
    getRequiredElement<HTMLElement>(
      root,
      "#debugger-status",
    );

  const bestElement =
    getRequiredElement<HTMLElement>(
      root,
      "#debugger-best",
    );

  let game: DebuggerGame = {
    board: createBoard(),
    state: "ready",
    elapsed: 0,
    timerStartedAt: null,
  };

  let timerId:
    ReturnType<
      typeof window.setInterval
    > | null = null;

  let flagMode = false;

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

    game.timerStartedAt =
      Date.now();

    timerId =
      window.setInterval(
        () => {
          if (
            game.state !==
            "playing"
          ) {
            return;
          }

          if (
            game.timerStartedAt ===
            null
          ) {
            return;
          }

          game.elapsed =
            Math.floor(
              (Date.now() -
                game.timerStartedAt) /
                1000,
            );

          timeElement.textContent =
            formatNumber(
              game.elapsed,
            );
        },
        250,
      );
  }

  function updateCounters() {
    const flagCount =
      game.board.filter(
        (cell) =>
          cell.flagged,
      ).length;

    const remaining =
      Math.max(
        0,
        MINES - flagCount,
      );

    minesElement.textContent =
      formatNumber(
        remaining,
      );

    timeElement.textContent =
      formatNumber(
        game.elapsed,
      );

    const best =
      getBestTime();

    bestElement.textContent =
      best === null
        ? "BEST / ---"
        : `BEST / ${formatNumber(best)}`;

    faceButton.textContent =
      faceForState(
        game.state,
      );

    flagButton.classList.toggle(
      "active",
      flagMode,
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

  function handleReveal(
    index: number,
  ) {
    if (
      game.state === "won" ||
      game.state === "lost"
    ) {
      return;
    }

    const cell =
      game.board[index];

    if (!cell) {
      return;
    }

    if (cell.flagged) {
      return;
    }

    if (game.state === "ready") {
      plantMines(
        game.board,
        index,
      );

      game.state =
        "playing";

      startTimer();
    }

    if (cell.revealed) {
      return;
    }

    if (cell.mine) {
      loseGame(index);
      return;
    }

    revealArea(index);

    if (hasWon()) {
      winGame();
      return;
    }

    setStatus(
      "DEBUGGING IN PROGRESS / WATCH THE CELLS",
    );

    render();
  }

  function revealArea(
    startIndex: number,
  ) {
    const queue: number[] = [
      startIndex,
    ];

    const visited =
      new Set<number>();

    while (queue.length > 0) {
      const index =
        queue.shift();

      if (
        index === undefined ||
        visited.has(index)
      ) {
        continue;
      }

      visited.add(index);

      const cell =
        game.board[index];

      if (
        !cell ||
        cell.flagged ||
        cell.mine ||
        cell.revealed
      ) {
        continue;
      }

      cell.revealed =
        true;

      if (
        cell.adjacent === 0
      ) {
        for (const neighborIndex of getNeighbors(
          cell.row,
          cell.col,
        )) {
          const neighbor =
            game.board[
              neighborIndex
            ];

          if (
            neighbor &&
            !neighbor.revealed &&
            !neighbor.flagged &&
            !neighbor.mine
          ) {
            queue.push(
              neighborIndex,
            );
          }
        }
      }
    }
  }

  function handleFlag(
    index: number,
  ) {
    if (
      game.state === "won" ||
      game.state === "lost"
    ) {
      return;
    }

    if (
      game.state === "ready"
    ) {
      setStatus(
        "REVEAL A CELL FIRST",
      );

      return;
    }

    const cell =
      game.board[index];

    if (
      !cell ||
      cell.revealed
    ) {
      return;
    }

    const flags =
      game.board.filter(
        (item) =>
          item.flagged,
      ).length;

    if (
      !cell.flagged &&
      flags >= MINES
    ) {
      setStatus(
        "NO FLAGS LEFT / YOU HAVE USED THEM ALL",
      );

      return;
    }

    cell.flagged =
      !cell.flagged;

    render();
  }

  function hasWon(): boolean {
    return game.board.every(
      (cell) =>
        cell.mine ||
        cell.revealed,
    );
  }

  function loseGame(
    explodedIndex: number,
  ) {
    stopTimer();

    game.state = "lost";

    for (
      let index = 0;
      index < game.board.length;
      index += 1
    ) {
      const cell =
        game.board[index];

      if (!cell) {
        continue;
      }

      if (cell.mine) {
        cell.revealed = true;
      }

      if (
        cell.flagged &&
        !cell.mine
      ) {
        cell.revealed = true;
      }
    }

    setStatus(
      "BUILD FAILED / YOU SHIPPED THE MINE",
      "danger",
    );

    render(
      explodedIndex,
    );

    triggerVibration(
      [70, 40, 110],
    );
  }

  function winGame() {
    stopTimer();

    game.state = "won";

    for (
      let index = 0;
      index < game.board.length;
      index += 1
    ) {
      const cell =
        game.board[index];

      if (
        cell?.mine
      ) {
        cell.flagged =
          true;
      }
    }

    const best =
      getBestTime();

    const newBest =
      best === null ||
      game.elapsed < best;

    if (newBest) {
      saveBestTime(
        game.elapsed,
      );
    }

    setStatus(
      newBest
        ? "BUILD PASSED / NEW BEST TIME"
        : "BUILD PASSED / BUGS CONTAINED",
      "success",
    );

    render();

    triggerVibration(
      45,
    );
  }

  function triggerVibration(
    pattern:
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
        pattern,
      );
    } catch {
      // Ignore vibration errors.
    }
  }

  function render(
    explodedIndex:
      | number
      | undefined = undefined,
  ) {
    boardElement.innerHTML =
      "";

    game.board.forEach(
      (cell, index) => {
        const button =
          document.createElement(
            "button",
          );

        button.type = "button";

        button.className =
          `${GAME_CLASS}-cell`;

        button.dataset.index =
          String(index);

        if (
          cell.revealed
        ) {
          button.classList.add(
            "revealed",
          );
        }

        if (
          cell.flagged
        ) {
          button.classList.add(
            "flagged",
          );
        }

        if (
          cell.mine &&
          game.state === "lost"
        ) {
          button.classList.add(
            "mine",
          );
        }

        if (
          index === explodedIndex
        ) {
          button.classList.add(
            "exploded",
          );
        }

        if (
          game.state === "lost" &&
          cell.flagged &&
          !cell.mine
        ) {
          button.classList.remove(
            "flagged",
          );

          button.classList.add(
            "wrong-flag",
          );

          button.textContent =
            "?";
        } else if (
          cell.mine &&
          game.state === "lost"
        ) {
          button.textContent =
            "×";
        } else if (
          cell.flagged
        ) {
          button.textContent =
            "⚑";
        } else if (
          cell.revealed &&
          cell.adjacent > 0
        ) {
          button.textContent =
            String(
              cell.adjacent,
            );

          button.classList.add(
            `number-${cell.adjacent}`,
          );
        }

        button.setAttribute(
          "aria-label",
          cell.revealed
            ? cell.mine
              ? "Mine"
              : cell.adjacent > 0
                ? `${cell.adjacent} adjacent mines`
                : "Empty cell"
            : cell.flagged
              ? "Flagged cell"
              : "Hidden cell",
        );

        button.addEventListener(
          "click",
          () => {
            if (flagMode) {
              handleFlag(
                index,
              );
            } else {
              handleReveal(
                index,
              );
            }
          },
        );

        button.addEventListener(
          "contextmenu",
          (event) => {
            event.preventDefault();

            handleFlag(index);
          },
        );

        boardElement.appendChild(
          button,
        );
      },
    );

    updateCounters();
  }

  function resetGame() {
    stopTimer();

    game = {
      board: createBoard(),
      state: "ready",
      elapsed: 0,
      timerStartedAt: null,
    };

    flagMode = false;

    setStatus(
      "REVEAL A CELL TO START",
    );

    render();
  }

  flagButton.addEventListener(
    "click",
    () => {
      if (
        game.state === "won" ||
        game.state === "lost"
      ) {
        return;
      }

      flagMode =
        !flagMode;

      setStatus(
        flagMode
          ? "FLAG MODE / TAP CELLS TO MARK THEM"
          : "REVEAL MODE / TAP CELLS TO REVEAL",
      );

      render();
    },
  );

  resetButton.addEventListener(
    "click",
    resetGame,
  );

  faceButton.addEventListener(
    "click",
    resetGame,
  );

  resetGame();

  return () => {
    stopTimer();

    root.innerHTML = "";
  };
}