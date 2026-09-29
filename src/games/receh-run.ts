type GameState =
  | "ready"
  | "playing"
  | "gameover";

type ObstacleType =
  | "pothole"
  | "cone"
  | "dog"
  | "motorbike";

type Obstacle = {
  x: number;
  y: number;
  width: number;
  height: number;
  type: ObstacleType;
  passed: boolean;
};

type DustParticle = {
  x: number;
  y: number;
  size: number;
  velocityX: number;
  velocityY: number;
  life: number;
};

const GAME_CLASS =
  "jtj-receh-run";

const BEST_SCORE_KEY =
  "jtj-receh-run-best";

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
      `[RECEH RUN] Missing element: ${selector}`,
    );
  }

  return element;
}

function getCanvasContext(
  canvas: HTMLCanvasElement,
): CanvasRenderingContext2D {
  const context =
    canvas.getContext("2d");

  if (!context) {
    throw new Error(
      "[RECEH RUN] Canvas 2D context is unavailable.",
    );
  }

  return context;
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
  ).padStart(3, "0");
}

function clamp(
  value: number,
  min: number,
  max: number,
): number {
  return Math.max(
    min,
    Math.min(max, value),
  );
}

function randomBetween(
  min: number,
  max: number,
): number {
  return (
    min +
    Math.random() *
      (max - min)
  );
}

function injectStyles() {
  if (
    document.head.querySelector(
      '[data-receh-run-style="true"]',
    )
  ) {
    return;
  }

  const style =
    document.createElement(
      "style",
    );

  style.dataset.recehRunStyle =
    "true";

  style.textContent = `
    .${GAME_CLASS} {
      width: min(100%, 760px);
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
        92px
      );

      font-weight: 950;
      line-height: .82;
      letter-spacing: -.085em;
    }

    .${GAME_CLASS}-description {
      max-width: 600px;
      margin: 0;

      color: #7d7972;

      font-size: 12px;
      line-height: 1.7;
    }

    .${GAME_CLASS}-panel {
      overflow: hidden;

      background: #171716;
      border: 1px solid #32312e;
    }

    .${GAME_CLASS}-topbar {
      display: grid;
      grid-template-columns:
        1fr
        52px
        1fr;

      gap: 8px;
      align-items: center;

      padding: 10px;

      background: #0d0d0d;
      border-bottom: 1px solid #2a2926;
    }

    .${GAME_CLASS}-stat {
      display: grid;
      gap: 4px;
    }

    .${GAME_CLASS}-stat:last-child {
      justify-items: end;
    }

    .${GAME_CLASS}-stat span {
      color: #57554f;

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

      font-size: 19px;
      font-weight: 900;
      line-height: 1;
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

    .${GAME_CLASS}-canvas-wrap {
      position: relative;

      padding: 8px;

      background: #0a0d10;

      touch-action: none;
      overscroll-behavior: none;
    }

    .${GAME_CLASS}-canvas {
      display: block;

      width: 100%;
      height: auto;

      aspect-ratio: 16 / 10;

      background: #0b0e11;
      border: 1px solid #292b2a;

      touch-action: none;
      user-select: none;

      -webkit-user-select: none;
    }

    .${GAME_CLASS}-controls {
      display: grid;
      gap: 8px;

      padding: 12px;

      background: #111111;
      border-top: 1px solid #292927;
    }

    .${GAME_CLASS}-jump {
      width: 100%;
      min-height: 60px;

      display: flex;
      align-items: center;
      justify-content: center;
      gap: 9px;

      padding: 0 18px;

      border: 1px solid #eeeae1;

      background: #eeeae1;
      color: #111111;

      cursor: pointer;

      font-size: 9px;
      font-weight: 950;
      letter-spacing: .08em;

      touch-action: manipulation;
      user-select: none;
    }

    .${GAME_CLASS}-jump:active {
      transform: translateY(1px);
    }

    .${GAME_CLASS}-hint {
      color: #55524c;

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
      line-height: 1.45;
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

      .${GAME_CLASS}-canvas-wrap {
        padding: 14px;
      }

      .${GAME_CLASS}-jump {
        max-width: 300px;
        margin: 0 auto;
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
          <span>GAME 05 / ARCADE</span>
          <span>INDONESIAN NEIGHBORHOOD</span>
        </div>

        <h2 class="${GAME_CLASS}-title">
          RECEH RUN
        </h2>

        <p class="${GAME_CLASS}-description">
          Run through a suspiciously familiar
          Indonesian neighborhood. Avoid potholes,
          cones, dogs, motorcycles, and whatever
          else the street has prepared.
        </p>
      </div>

      <div class="${GAME_CLASS}-panel">
        <div class="${GAME_CLASS}-topbar">
          <div class="${GAME_CLASS}-stat">
            <span>SCORE</span>

            <strong id="receh-score">
              000
            </strong>
          </div>

          <button
            type="button"
            class="${GAME_CLASS}-restart"
            id="receh-restart"
            aria-label="Restart Receh Run"
          >
            ↻
          </button>

          <div class="${GAME_CLASS}-stat">
            <span>BEST</span>

            <strong id="receh-best">
              000
            </strong>
          </div>
        </div>

        <div class="${GAME_CLASS}-canvas-wrap">
          <canvas
            id="receh-canvas"
            class="${GAME_CLASS}-canvas"
            aria-label="Receh Run game"
          ></canvas>
        </div>

        <div class="${GAME_CLASS}-controls">
          <button
            type="button"
            id="receh-jump"
            class="${GAME_CLASS}-jump"
          >
            TAP TO JUMP
            <span>↑</span>
          </button>

          <div class="${GAME_CLASS}-hint">
            TAP / SPACE / ARROW UP · DOUBLE JUMP AVAILABLE
          </div>
        </div>
      </div>

      <div
        id="receh-status"
        class="${GAME_CLASS}-status"
      >
        TAP TO START RUNNING
      </div>

      <div class="${GAME_CLASS}-footer">
        <span>
          RECEH RUN / SURVIVE THE STREET
        </span>

        <span>
          NO MAP / JUST RUN
        </span>
      </div>
    </div>
  `;

  const canvas =
    getRequiredElement<HTMLCanvasElement>(
      root,
      "#receh-canvas",
    );

  const context =
    getCanvasContext(canvas);

  const scoreElement =
    getRequiredElement<HTMLElement>(
      root,
      "#receh-score",
    );

  const bestElement =
    getRequiredElement<HTMLElement>(
      root,
      "#receh-best",
    );

  const statusElement =
    getRequiredElement<HTMLElement>(
      root,
      "#receh-status",
    );

  const jumpButton =
    getRequiredElement<HTMLButtonElement>(
      root,
      "#receh-jump",
    );

  const restartButton =
    getRequiredElement<HTMLButtonElement>(
      root,
      "#receh-restart",
    );

  let width = 360;
  let height = 225;

  let state: GameState =
    "ready";

  let score = 0;
  let best = getBestScore();

  let distance = 0;

  let playerY = 0;
  let playerVelocityY = 0;

  let jumpsRemaining = 2;

  let obstacleTimer = 0;
  let nextObstacleTime = 1.15;

  let dustTimer = 0;

  let lastFrameTime:
    number | null = null;

  let animationFrame:
    number | null = null;

  let resizeObserver:
    ResizeObserver | null = null;

  let audioContext:
    AudioContext | null = null;

  const obstacles: Obstacle[] =
    [];

  const dust: DustParticle[] =
    [];

  function getGroundY(): number {
    return height * 0.79;
  }

  function getPlayerWidth(): number {
    return Math.max(
      23,
      width * 0.075,
    );
  }

  function getPlayerHeight(): number {
    return Math.max(
      32,
      height * 0.17,
    );
  }

  function getPlayerX(): number {
    return width * 0.18;
  }

  function getSpeed(): number {
    return (
      175 +
      Math.min(
        220,
        score * 2.1,
      )
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

  function updateScore() {
    scoreElement.textContent =
      formatScore(score);

    bestElement.textContent =
      formatScore(best);
  }

  function updateGroundState() {
    const ground =
      getGroundY();

    const playerHeight =
      getPlayerHeight();

    if (
      playerY >=
      ground - playerHeight
    ) {
      playerY =
        ground -
        playerHeight;

      playerVelocityY = 0;
      jumpsRemaining = 2;

      return true;
    }

    return false;
  }

  function jump() {
    if (
      state === "gameover"
    ) {
      startGame();

      performJump();

      return;
    }

    if (
      state === "ready"
    ) {
      startGame();

      performJump();

      return;
    }

    if (
      state !== "playing"
    ) {
      return;
    }

    performJump();
  }

  function performJump() {
    if (
      jumpsRemaining <= 0
    ) {
      return;
    }

    playerVelocityY =
      -Math.max(
        510,
        height * 2.1,
      );

    jumpsRemaining -= 1;

    createDust(
      getPlayerX(),
      getGroundY() - 4,
      4,
    );

    playJumpSound();
  }

  function startGame() {
    state = "playing";

    score = 0;
    distance = 0;

    playerY =
      getGroundY() -
      getPlayerHeight();

    playerVelocityY = 0;

    jumpsRemaining = 2;

    obstacleTimer = 0;

    nextObstacleTime =
      0.8;

    dustTimer = 0;

    obstacles.length = 0;
    dust.length = 0;

    lastFrameTime =
      performance.now();

    setStatus(
      "RUNNING / KEEP YOUR DIGNITY",
    );

    updateScore();
  }

  function endGame() {
    state = "gameover";

    const rounded =
      Math.floor(score);

    if (
      rounded > best
    ) {
      best = rounded;

      saveBestScore(
        best,
      );

      setStatus(
        "NEW BEST / THE STREET HAS BEEN DEFEATED",
        "success",
      );
    } else {
      setStatus(
        "RUN ENDED / TAP TO TRY AGAIN",
        "danger",
      );
    }

    playCrashSound();

    if (
      typeof navigator.vibrate ===
      "function"
    ) {
      try {
        navigator.vibrate([
          80,
          40,
          120,
        ]);
      } catch {
        // Ignore.
      }
    }

    updateScore();
  }

  function spawnObstacle() {
    const speed =
      getSpeed();

    const difficulty =
      Math.min(
        1,
        score / 80,
      );

    const random =
      Math.random();

    let type:
      ObstacleType;

    if (
      random <
      0.3
    ) {
      type = "pothole";
    } else if (
      random <
      0.55
    ) {
      type = "cone";
    } else if (
      random <
      0.82
    ) {
      type = "dog";
    } else {
      type = "motorbike";
    }

    /*
     * Motorbikes are introduced less aggressively.
     */
    if (
      score < 18 &&
      type === "motorbike"
    ) {
      type = "cone";
    }

    let obstacleWidth = 30;
    let obstacleHeight = 25;

    if (
      type === "pothole"
    ) {
      obstacleWidth = 42;
      obstacleHeight = 13;
    }

    if (
      type === "cone"
    ) {
      obstacleWidth = 24;
      obstacleHeight = 31;
    }

    if (
      type === "dog"
    ) {
      obstacleWidth = 52;
      obstacleHeight = 26;
    }

    if (
      type === "motorbike"
    ) {
      obstacleWidth = 55;
      obstacleHeight = 35;
    }

    obstacles.push({
      x:
        width +
        obstacleWidth,
      y:
        getGroundY() -
        obstacleHeight,
      width:
        obstacleWidth,
      height:
        obstacleHeight,
      type,
      passed: false,
    });

    nextObstacleTime =
      clamp(
        randomBetween(
          1.1,
          1.55,
        ) -
          difficulty *
            0.3 -
          speed *
            0.00015,
        0.72,
        1.45,
      );
  }

  function createDust(
    x: number,
    y: number,
    amount: number,
  ) {
    for (
      let index = 0;
      index < amount;
      index += 1
    ) {
      dust.push({
        x:
          x +
          randomBetween(
            -5,
            5,
          ),

        y:
          y +
          randomBetween(
            -2,
            2,
          ),

        size:
          randomBetween(
            1,
            3,
          ),

        velocityX:
          randomBetween(
            -30,
            -8,
          ),

        velocityY:
          randomBetween(
            -35,
            -8,
          ),

        life:
          randomBetween(
            0.25,
            0.5,
          ),
      });
    }
  }

  function updateDust(
    delta: number,
  ) {
    for (
      let index =
        dust.length - 1;
      index >= 0;
      index -= 1
    ) {
      const particle =
        dust[index];

      if (!particle) {
        continue;
      }

      particle.x +=
        particle.velocityX *
        delta;

      particle.y +=
        particle.velocityY *
        delta;

      particle.velocityY +=
        100 * delta;

      particle.life -=
        delta;

      if (
        particle.life <=
        0
      ) {
        dust.splice(
          index,
          1,
        );
      }
    }
  }

  function getPlayerRect() {
    const playerWidth =
      getPlayerWidth();

    const playerHeight =
      getPlayerHeight();

    return {
      x:
        getPlayerX() +
        playerWidth *
          0.18,

      y:
        playerY +
        playerHeight *
          0.12,

      width:
        playerWidth *
        0.62,

      height:
        playerHeight *
        0.82,
    };
  }

  function getObstacleRect(
    obstacle: Obstacle,
  ) {
    let paddingX =
      obstacle.width *
      0.12;

    let paddingY =
      obstacle.height *
      0.1;

    if (
      obstacle.type ===
      "pothole"
    ) {
      paddingX =
        obstacle.width *
        0.05;

      paddingY =
        obstacle.height *
        0.15;
    }

    return {
      x:
        obstacle.x +
        paddingX,

      y:
        obstacle.y +
        paddingY,

      width:
        obstacle.width -
        paddingX * 2,

      height:
        obstacle.height -
        paddingY * 2,
    };
  }

  function intersects(
    first: {
      x: number;
      y: number;
      width: number;
      height: number;
    },
    second: {
      x: number;
      y: number;
      width: number;
      height: number;
    },
  ): boolean {
    return (
      first.x <
        second.x +
          second.width &&
      first.x +
          first.width >
        second.x &&
      first.y <
        second.y +
          second.height &&
      first.y +
          first.height >
        second.y
    );
  }

  function update(
    delta: number,
  ) {
    if (
      state !== "playing"
    ) {
      return;
    }

    const safeDelta =
      clamp(
        delta,
        0,
        0.033,
      );

    const speed =
      getSpeed();

    distance +=
      speed *
      safeDelta;

    score =
      Math.floor(
        distance / 14,
      );

    updateScore();

    if (
      score > best
    ) {
      best = score;
      saveBestScore(
        best,
      );
    }

    playerVelocityY +=
      Math.max(
        1350,
        height * 5.6,
      ) *
      safeDelta;

    playerY +=
      playerVelocityY *
      safeDelta;

    const wasGrounded =
      updateGroundState();

    if (
      wasGrounded
    ) {
      dustTimer +=
        safeDelta;

      if (
        dustTimer >
        0.12
      ) {
        createDust(
          getPlayerX(),
          getGroundY() - 3,
          2,
        );

        dustTimer = 0;
      }
    }

    obstacleTimer +=
      safeDelta;

    if (
      obstacleTimer >=
      nextObstacleTime
    ) {
      obstacleTimer = 0;

      spawnObstacle();
    }

    for (
      let index =
        obstacles.length -
        1;
      index >= 0;
      index -= 1
    ) {
      const obstacle =
        obstacles[index];

      if (!obstacle) {
        continue;
      }

      obstacle.x -=
        speed *
        safeDelta;

      if (
        !obstacle.passed &&
        obstacle.x +
          obstacle.width <
          getPlayerX()
      ) {
        obstacle.passed =
          true;

        createDust(
          obstacle.x,
          obstacle.y +
            obstacle.height,
          1,
        );
      }

      if (
        obstacle.x +
          obstacle.width <
        -80
      ) {
        obstacles.splice(
          index,
          1,
        );
      }
    }

    updateDust(
      safeDelta,
    );

    const playerRect =
      getPlayerRect();

    for (const obstacle of obstacles) {
      const obstacleRect =
        getObstacleRect(
          obstacle,
        );

      if (
        intersects(
          playerRect,
          obstacleRect,
        )
      ) {
        endGame();
        break;
      }
    }
  }

  function drawBackground(
    time: number,
  ) {
    const ground =
      getGroundY();

    context.fillStyle =
      "#0b0e11";

    context.fillRect(
      0,
      0,
      width,
      height,
    );

    /*
     * Moon
     */
    context.fillStyle =
      "#e7dfc8";

    context.beginPath();

    context.arc(
      width * 0.82,
      height * 0.2,
      Math.max(
        18,
        width * 0.06,
      ),
      0,
      Math.PI * 2,
    );

    context.fill();

    /*
     * Stars
     */
    const stars = [
      [0.1, 0.17, 2],
      [0.19, 0.28, 1],
      [0.34, 0.14, 1.5],
      [0.48, 0.24, 1],
      [0.59, 0.11, 1.5],
      [0.72, 0.3, 1],
      [0.91, 0.15, 1.5],
      [0.86, 0.38, 1],
      [0.27, 0.39, 1],
    ];

    for (const star of stars) {
      const x =
        width * star[0];

      const y =
        height * star[1];

      const radius =
        star[2] *
        (
          0.8 +
          Math.sin(
            time * 0.001 +
              x,
          ) *
            0.15
        );

      context.fillStyle =
        "#d9d4c8";

      context.beginPath();

      context.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2,
      );

      context.fill();
    }

    /*
     * Distant houses.
     */
    const horizon =
      ground - height * 0.2;

    context.fillStyle =
      "#151718";

    const buildings = [
      {
        x: 0.02,
        width: 0.13,
        height: 0.12,
      },
      {
        x: 0.15,
        width: 0.16,
        height: 0.18,
      },
      {
        x: 0.31,
        width: 0.11,
        height: 0.13,
      },
      {
        x: 0.43,
        width: 0.19,
        height: 0.2,
      },
      {
        x: 0.63,
        width: 0.13,
        height: 0.15,
      },
      {
        x: 0.77,
        width: 0.18,
        height: 0.2,
      },
    ];

    for (const building of buildings) {
      const buildingX =
        width *
        building.x;

      const buildingWidth =
        width *
        building.width;

      const buildingHeight =
        height *
        building.height;

      context.fillRect(
        buildingX,
        horizon -
          buildingHeight,
        buildingWidth,
        buildingHeight,
      );

      context.fillStyle =
        "#222421";

      const windowSize =
        Math.max(
          2,
          width * 0.007,
        );

      context.fillRect(
        buildingX +
          buildingWidth *
            0.25,
        horizon -
          buildingHeight *
            0.62,
        windowSize,
        windowSize,
      );

      context.fillRect(
        buildingX +
          buildingWidth *
            0.68,
        horizon -
          buildingHeight *
            0.42,
        windowSize,
        windowSize,
      );

      context.fillStyle =
        "#151718";
    }

    /*
     * Utility pole.
     */
    const poleX =
      width * 0.66;

    context.fillStyle =
      "#30302e";

    context.fillRect(
      poleX,
      horizon -
        height * 0.45,
      Math.max(
        3,
        width * 0.012,
      ),
      height * 0.45,
    );

    context.fillRect(
      poleX -
        width * 0.07,
      horizon -
        height * 0.41,
      width * 0.14,
      Math.max(
        3,
        width * 0.009,
      ),
    );

    /*
     * Wires.
     */
    context.strokeStyle =
      "#383834";

    context.lineWidth = 1;

    context.beginPath();

    context.moveTo(
      0,
      horizon -
        height * 0.37,
    );

    context.quadraticCurveTo(
      width * 0.35,
      horizon -
        height * 0.3,
      width * 0.66,
      horizon -
        height * 0.37,
    );

    context.quadraticCurveTo(
      width * 0.82,
      horizon -
        height * 0.43,
      width,
      horizon -
        height * 0.35,
    );

    context.stroke();

    context.beginPath();

    context.moveTo(
      0,
      horizon -
        height * 0.31,
    );

    context.quadraticCurveTo(
      width * 0.35,
      horizon -
        height * 0.25,
      width * 0.66,
      horizon -
        height * 0.31,
    );

    context.quadraticCurveTo(
      width * 0.82,
      horizon -
        height * 0.36,
      width,
      horizon -
        height * 0.29,
    );

    context.stroke();

    /*
     * Road.
     */
    context.fillStyle =
      "#232422";

    context.fillRect(
      0,
      ground,
      width,
      height -
        ground,
    );

    /*
     * Road edge.
     */
    context.fillStyle =
      "#50504b";

    context.fillRect(
      0,
      ground,
      width,
      Math.max(
        2,
        height * 0.008,
      ),
    );

    /*
     * Road lane markers.
     */
    const markerWidth =
      Math.max(
        24,
        width * 0.09,
      );

    const markerGap =
      Math.max(
        34,
        width * 0.11,
      );

    const offset =
      -(
        distance %
        (markerWidth +
          markerGap)
      );

    context.fillStyle =
      "#696760";

    for (
      let x =
        offset;
      x < width + 40;
      x +=
        markerWidth +
        markerGap
    ) {
      context.fillRect(
        x,
        ground +
          height * 0.13,
        markerWidth,
        Math.max(
          2,
          height * 0.007,
        ),
      );
    }

    /*
     * Tiny warung sign.
     */
    const signX =
      width * 0.1;

    const signY =
      horizon -
      height * 0.12;

    context.fillStyle =
      "#373733";

    context.fillRect(
      signX,
      signY,
      width * 0.13,
      height * 0.035,
    );

    context.fillStyle =
      "#aaa69c";

    context.font =
      `800 ${Math.max(
        5,
        width * 0.014,
      )}px monospace`;

    context.textAlign =
      "center";

    context.fillText(
      "WARUNG",
      signX +
        width * 0.065,
      signY +
        height * 0.025,
    );

    context.textAlign =
      "left";
  }

  function drawPlayer(
    time: number,
  ) {
    const x =
      getPlayerX();

    const y =
      playerY;

    const playerWidth =
      getPlayerWidth();

    const playerHeight =
      getPlayerHeight();

    const running =
      state === "playing" &&
      Math.abs(
        playerVelocityY,
      ) < 40;

    const legOffset =
      running
        ? Math.sin(
            time * 0.016,
          ) *
          3
        : 0;

    /*
     * Body.
     */
    context.fillStyle =
      "#eeeae1";

    context.fillRect(
      x +
        playerWidth * 0.23,
      y +
        playerHeight * 0.31,
      playerWidth * 0.48,
      playerHeight * 0.49,
    );

    /*
     * Head.
     */
    context.beginPath();

    context.arc(
      x +
        playerWidth * 0.48,
      y +
        playerHeight * 0.18,
      playerWidth * 0.18,
      0,
      Math.PI * 2,
    );

    context.fill();

    /*
     * Hair.
     */
    context.fillStyle =
      "#111111";

    context.fillRect(
      x +
        playerWidth * 0.35,
      y +
        playerHeight * 0.03,
      playerWidth * 0.26,
      playerHeight * 0.09,
    );

    /*
     * Eye.
     */
    context.fillRect(
      x +
        playerWidth * 0.53,
      y +
        playerHeight * 0.16,
      Math.max(
        2,
        playerWidth * 0.04,
      ),
      Math.max(
        2,
        playerWidth * 0.04,
      ),
    );

    /*
     * Back arm.
     */
    context.strokeStyle =
      "#eeeae1";

    context.lineWidth =
      Math.max(
        2,
        playerWidth * 0.09,
      );

    context.beginPath();

    context.moveTo(
      x +
        playerWidth * 0.27,
      y +
        playerHeight * 0.39,
    );

    context.lineTo(
      x +
        playerWidth * 0.08,
      y +
        playerHeight *
          0.54,
    );

    context.stroke();

    /*
     * Front arm.
     */
    context.beginPath();

    context.moveTo(
      x +
        playerWidth * 0.66,
      y +
        playerHeight * 0.4,
    );

    context.lineTo(
      x +
        playerWidth * 0.87,
      y +
        playerHeight *
          (0.52 +
            Math.abs(
              legOffset,
            ) *
              0.012),
    );

    context.stroke();

    /*
     * Back leg.
     */
    context.beginPath();

    context.moveTo(
      x +
        playerWidth * 0.39,
      y +
        playerHeight * 0.79,
    );

    context.lineTo(
      x +
        playerWidth *
          (0.26 -
            legOffset *
              0.02),
      y +
        playerHeight *
          0.98,
    );

    context.stroke();

    /*
     * Front leg.
     */
    context.beginPath();

    context.moveTo(
      x +
        playerWidth * 0.56,
      y +
        playerHeight * 0.79,
    );

    context.lineTo(
      x +
        playerWidth *
          (0.69 +
            legOffset *
              0.02),
      y +
        playerHeight *
          0.98,
    );

    context.stroke();
  }

  function drawObstacle(
    obstacle: Obstacle,
  ) {
    const {
      x,
      y,
      width: obstacleWidth,
      height: obstacleHeight,
      type,
    } = obstacle;

    if (
      type === "pothole"
    ) {
      context.fillStyle =
        "#0c0c0c";

      context.beginPath();

      context.ellipse(
        x +
          obstacleWidth / 2,
        y +
          obstacleHeight / 2,
        obstacleWidth / 2,
        obstacleHeight / 2,
        0,
        0,
        Math.PI * 2,
      );

      context.fill();

      context.strokeStyle =
        "#4a4944";

      context.lineWidth = 2;

      context.beginPath();

      context.arc(
        x +
          obstacleWidth * 0.33,
        y +
          obstacleHeight * 0.4,
        obstacleWidth * 0.18,
        0,
        Math.PI,
      );

      context.stroke();

      return;
    }

    if (
      type === "cone"
    ) {
      context.fillStyle =
        "#77736a";

      context.beginPath();

      context.moveTo(
        x +
          obstacleWidth / 2,
        y,
      );

      context.lineTo(
        x +
          obstacleWidth,
        y +
          obstacleHeight,
      );

      context.lineTo(
        x,
        y +
          obstacleHeight,
      );

      context.closePath();

      context.fill();

      context.fillStyle =
        "#eeeae1";

      context.fillRect(
        x +
          obstacleWidth *
            0.17,
        y +
          obstacleHeight *
            0.52,
        obstacleWidth *
          0.66,
        Math.max(
          2,
          obstacleHeight *
            0.12,
        ),
      );

      return;
    }

    if (
      type === "dog"
    ) {
      context.fillStyle =
        "#75716a";

      context.fillRect(
        x +
          obstacleWidth *
            0.15,
        y +
          obstacleHeight *
            0.26,
        obstacleWidth *
          0.65,
        obstacleHeight *
          0.58,
      );

      context.beginPath();

      context.arc(
        x +
          obstacleWidth *
            0.18,
        y +
          obstacleHeight *
            0.38,
        obstacleHeight *
          0.29,
        0,
        Math.PI * 2,
      );

      context.fill();

      context.fillStyle =
        "#eeeae1";

      context.fillRect(
        x +
          obstacleWidth *
            0.25,
        y +
          obstacleHeight *
            0.35,
        2,
        2,
      );

      context.strokeStyle =
        "#75716a";

      context.lineWidth =
        Math.max(
          2,
          obstacleWidth *
            0.045,
        );

      context.beginPath();

      context.moveTo(
        x +
          obstacleWidth *
            0.3,
        y +
          obstacleHeight *
            0.76,
      );

      context.lineTo(
        x +
          obstacleWidth *
            0.25,
        y +
          obstacleHeight,
      );

      context.moveTo(
        x +
          obstacleWidth *
            0.68,
        y +
          obstacleHeight *
            0.76,
      );

      context.lineTo(
        x +
          obstacleWidth *
            0.75,
        y +
          obstacleHeight,
      );

      context.stroke();

      return;
    }

    /*
     * Motorbike.
     */
    context.fillStyle =
      "#565550";

    context.fillRect(
      x +
        obstacleWidth *
          0.22,
      y +
        obstacleHeight *
          0.24,
      obstacleWidth *
        0.5,
      obstacleHeight *
        0.42,
    );

    context.fillStyle =
      "#3b3a36";

    context.beginPath();

    context.arc(
      x +
        obstacleWidth *
          0.22,
      y +
        obstacleHeight *
          0.82,
      obstacleHeight *
        0.2,
      0,
      Math.PI * 2,
    );

    context.arc(
      x +
        obstacleWidth *
          0.78,
      y +
        obstacleHeight *
          0.82,
      obstacleHeight *
        0.2,
      0,
      Math.PI * 2,
    );

    context.fill();

    context.fillStyle =
      "#aaa79e";

    context.fillRect(
      x +
        obstacleWidth *
          0.58,
      y +
        obstacleHeight *
          0.04,
      Math.max(
        3,
        obstacleWidth *
          0.06,
      ),
      obstacleHeight *
        0.26,
    );
  }

  function drawDust() {
    for (const particle of dust) {
      context.globalAlpha =
        clamp(
          particle.life *
            2,
          0,
          1,
        );

      context.fillStyle =
        "#77736a";

      context.fillRect(
        particle.x,
        particle.y,
        particle.size,
        particle.size,
      );
    }

    context.globalAlpha = 1;
  }

  function drawOverlay() {
    if (
      state ===
      "playing"
    ) {
      return;
    }

    context.fillStyle =
      "rgba(8, 8, 8, 0.68)";

    context.fillRect(
      0,
      0,
      width,
      height,
    );

    context.textAlign =
      "center";

    if (
      state === "ready"
    ) {
      context.fillStyle =
        "#eeeae1";

      context.font =
        `950 ${Math.max(
          22,
          width * 0.075,
        )}px Inter, sans-serif`;

      context.fillText(
        "RECEH RUN",
        width / 2,
        height * 0.42,
      );

      context.fillStyle =
        "#8b877f";

      context.font =
        `800 ${Math.max(
          7,
          width * 0.018,
        )}px monospace`;

      context.fillText(
        "TAP TO START",
        width / 2,
        height * 0.52,
      );
    }

    if (
      state === "gameover"
    ) {
      context.fillStyle =
        "#eeeae1";

      context.font =
        `950 ${Math.max(
          22,
          width * 0.075,
        )}px Inter, sans-serif`;

      context.fillText(
        "GAME OVER",
        width / 2,
        height * 0.4,
      );

      context.fillStyle =
        "#8b877f";

      context.font =
        `800 ${Math.max(
          7,
          width * 0.018,
        )}px monospace`;

      context.fillText(
        "TAP TO RUN AGAIN",
        width / 2,
        height * 0.51,
      );
    }

    context.textAlign =
      "left";
  }

  function draw(
    time: number,
  ) {
    context.clearRect(
      0,
      0,
      width,
      height,
    );

    drawBackground(
      time,
    );

    for (const obstacle of obstacles) {
      drawObstacle(
        obstacle,
      );
    }

    drawDust();

    drawPlayer(time);

    drawOverlay();
  }

  function resizeCanvas() {
    const rect =
      canvas.getBoundingClientRect();

    if (
      rect.width <= 0 ||
      rect.height <= 0
    ) {
      return;
    }

    width = rect.width;
    height = rect.height;

    const devicePixelRatio =
      Math.min(
        window.devicePixelRatio ||
          1,
        2,
      );

    canvas.width =
      Math.floor(
        width *
          devicePixelRatio,
      );

    canvas.height =
      Math.floor(
        height *
          devicePixelRatio,
      );

    context.setTransform(
      devicePixelRatio,
      0,
      0,
      devicePixelRatio,
      0,
      0,
    );

    if (
      state === "ready"
    ) {
      playerY =
        getGroundY() -
        getPlayerHeight();
    }
  }

  function loop(
    timestamp: number,
  ) {
    if (
      lastFrameTime ===
      null
    ) {
      lastFrameTime =
        timestamp;
    }

    const delta =
      (timestamp -
        lastFrameTime) /
      1000;

    lastFrameTime =
      timestamp;

    update(delta);

    draw(timestamp);

    animationFrame =
      window.requestAnimationFrame(
        loop,
      );
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

  function playJumpSound() {
    ensureAudio();

    if (!audioContext) {
      return;
    }

    const oscillator =
      audioContext.createOscillator();

    const gain =
      audioContext.createGain();

    oscillator.type =
      "square";

    oscillator.frequency.setValueAtTime(
      220,
      audioContext.currentTime,
    );

    oscillator.frequency.exponentialRampToValueAtTime(
      420,
      audioContext.currentTime +
        0.07,
    );

    gain.gain.setValueAtTime(
      0.035,
      audioContext.currentTime,
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime +
        0.09,
    );

    oscillator.connect(gain);
    gain.connect(
      audioContext.destination,
    );

    oscillator.start();

    oscillator.stop(
      audioContext.currentTime +
        0.09,
    );
  }

  function playCrashSound() {
    ensureAudio();

    if (!audioContext) {
      return;
    }

    const oscillator =
      audioContext.createOscillator();

    const gain =
      audioContext.createGain();

    oscillator.type =
      "sawtooth";

    oscillator.frequency.setValueAtTime(
      130,
      audioContext.currentTime,
    );

    oscillator.frequency.exponentialRampToValueAtTime(
      55,
      audioContext.currentTime +
        0.18,
    );

    gain.gain.setValueAtTime(
      0.04,
      audioContext.currentTime,
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime +
        0.2,
    );

    oscillator.connect(gain);
    gain.connect(
      audioContext.destination,
    );

    oscillator.start();

    oscillator.stop(
      audioContext.currentTime +
        0.2,
    );
  }

  function handleAction() {
    jump();
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
        HTMLButtonElement
    ) {
      return;
    }

    if (
      event.key ===
        " " ||
      event.key ===
        "ArrowUp" ||
      event.key ===
        "w" ||
      event.key ===
        "W"
    ) {
      event.preventDefault();

      handleAction();
    }
  }

  jumpButton.addEventListener(
    "click",
    handleAction,
  );

  restartButton.addEventListener(
    "click",
    startGame,
  );

  canvas.addEventListener(
    "pointerdown",
    (event) => {
      event.preventDefault();

      handleAction();
    },
  );

  document.addEventListener(
    "keydown",
    handleKeyboard,
  );

  document.addEventListener(
    "visibilitychange",
    () => {
      if (
        document.hidden
      ) {
        lastFrameTime = null;
      } else {
        lastFrameTime =
          performance.now();
      }
    },
  );

  resizeObserver =
    new ResizeObserver(
      () => {
        resizeCanvas();
      },
    );

  resizeObserver.observe(
    canvas,
  );

  resizeCanvas();

  playerY =
    getGroundY() -
    getPlayerHeight();

  updateScore();

  setStatus(
    "TAP TO START RUNNING",
  );

  animationFrame =
    window.requestAnimationFrame(
      loop,
    );

  return () => {
    if (
      animationFrame !==
      null
    ) {
      window.cancelAnimationFrame(
        animationFrame,
      );

      animationFrame = null;
    }

    resizeObserver?.disconnect();

    resizeObserver = null;

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