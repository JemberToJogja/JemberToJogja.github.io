type GameState =
  | "ready"
  | "playing"
  | "gameover";

type EnemyType =
  | "thief"
  | "cat"
  | "kid"
  | "motorbike";

type Enemy = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  hp: number;
  maxHp: number;
  type: EnemyType;
  value: number;
  hitFlash: number;
  passed: boolean;
};

type Particle = {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  life: number;
  maxLife: number;
  size: number;
  text?: string;
};

const GAME_CLASS =
  "jtj-warung-defense";

const BEST_SCORE_KEY =
  "jtj-warung-defense-best";

const MAX_LIVES = 3;

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
      `[WARUNG DEFENSE] Missing element: ${selector}`,
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
      "[WARUNG DEFENSE] Canvas 2D context is unavailable.",
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
      '[data-warung-defense-style="true"]',
    )
  ) {
    return;
  }

  const style =
    document.createElement(
      "style",
    );

  style.dataset.warungDefenseStyle =
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
        43px,
        12.5vw,
        90px
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
        repeat(4, 1fr);

      background: #0d0d0d;
      border-bottom: 1px solid #2a2926;
    }

    .${GAME_CLASS}-stat {
      min-height: 64px;

      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 4px;

      padding: 9px 11px;

      border-right: 1px solid #262522;
    }

    .${GAME_CLASS}-stat:last-child {
      border-right: 0;
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

      font-size: 17px;
      font-weight: 900;
      line-height: 1;
    }

    .${GAME_CLASS}-canvas-wrap {
      padding: 8px;

      background: #0b0c0b;

      touch-action: none;
      overscroll-behavior: none;
    }

    .${GAME_CLASS}-canvas {
      display: block;

      width: 100%;
      height: auto;

      aspect-ratio: 16 / 10;

      background: #111211;
      border: 1px solid #292b28;

      touch-action: none;
      user-select: none;

      -webkit-user-select: none;
    }

    .${GAME_CLASS}-controls {
      display: grid;
      gap: 8px;

      padding: 12px;

      background: #101010;
      border-top: 1px solid #292927;
    }

    .${GAME_CLASS}-defend {
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

    .${GAME_CLASS}-defend:active {
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
      line-height: 1.4;
      letter-spacing: .09em;

      text-align: center;
    }

    .${GAME_CLASS}-restart {
      min-height: 44px;

      display: flex;
      align-items: center;
      justify-content: center;

      border: 1px solid #3d3c38;
      background: #1d1d1c;
      color: #aaa69e;

      cursor: pointer;

      font-size: 8px;
      font-weight: 850;
      letter-spacing: .08em;

      touch-action: manipulation;
    }

    .${GAME_CLASS}-restart:active {
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

    @media (max-width: 520px) {
      .${GAME_CLASS}-topbar {
        grid-template-columns:
          repeat(2, 1fr);
      }

      .${GAME_CLASS}-stat:nth-child(2) {
        border-right: 0;
      }

      .${GAME_CLASS}-stat:nth-child(-n + 2) {
        border-bottom: 1px solid #262522;
      }
    }

    @media (min-width: 700px) {
      .${GAME_CLASS} {
        padding: 30px;
      }

      .${GAME_CLASS}-canvas-wrap {
        padding: 14px;
      }

      .${GAME_CLASS}-controls {
        grid-template-columns:
          1fr
          180px;
        align-items: center;
      }

      .${GAME_CLASS}-defend {
        max-width: 320px;
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
          <span>GAME 06 / DEFENSE</span>
          <span>PROTECT THE SNACKS</span>
        </div>

        <h2 class="${GAME_CLASS}-title">
          WARUNG DEFENSE
        </h2>

        <p class="${GAME_CLASS}-description">
          Protect the warung. Defend the snacks.
          Tap incoming trouble before it reaches
          the counter. Ask questions later.
        </p>
      </div>

      <div class="${GAME_CLASS}-panel">
        <div class="${GAME_CLASS}-topbar">
          <div class="${GAME_CLASS}-stat">
            <span>SCORE</span>
            <strong id="warung-score">
              000
            </strong>
          </div>

          <div class="${GAME_CLASS}-stat">
            <span>BEST</span>
            <strong id="warung-best">
              000
            </strong>
          </div>

          <div class="${GAME_CLASS}-stat">
            <span>WAVE</span>
            <strong id="warung-wave">
              001
            </strong>
          </div>

          <div class="${GAME_CLASS}-stat">
            <span>LIVES</span>
            <strong id="warung-lives">
              ♥♥♥
            </strong>
          </div>
        </div>

        <div class="${GAME_CLASS}-canvas-wrap">
          <canvas
            id="warung-canvas"
            class="${GAME_CLASS}-canvas"
            aria-label="Warung Defense game"
          ></canvas>
        </div>

        <div class="${GAME_CLASS}-controls">
          <div class="${GAME_CLASS}-hint">
            TAP AN ENEMY / TAP DEFEND TO HIT THE NEAREST THREAT
          </div>

          <div>
            <button
              id="warung-defend"
              type="button"
              class="${GAME_CLASS}-defend"
            >
              DEFEND WARUNG
              <span>↗</span>
            </button>

            <button
              id="warung-restart"
              type="button"
              class="${GAME_CLASS}-restart"
            >
              ↻ RESTART
            </button>
          </div>
        </div>
      </div>

      <div
        id="warung-status"
        class="${GAME_CLASS}-status"
      >
        TAP TO START DEFENSE
      </div>

      <div class="${GAME_CLASS}-footer">
        <span>
          WARUNG DEFENSE / SNACK SECURITY
        </span>

        <span>
          TAP / DEFEND / SURVIVE
        </span>
      </div>
    </div>
  `;

  const canvas =
    getRequiredElement<HTMLCanvasElement>(
      root,
      "#warung-canvas",
    );

  const context =
    getCanvasContext(canvas);

  const scoreElement =
    getRequiredElement<HTMLElement>(
      root,
      "#warung-score",
    );

  const bestElement =
    getRequiredElement<HTMLElement>(
      root,
      "#warung-best",
    );

  const waveElement =
    getRequiredElement<HTMLElement>(
      root,
      "#warung-wave",
    );

  const livesElement =
    getRequiredElement<HTMLElement>(
      root,
      "#warung-lives",
    );

  const statusElement =
    getRequiredElement<HTMLElement>(
      root,
      "#warung-status",
    );

  const defendButton =
    getRequiredElement<HTMLButtonElement>(
      root,
      "#warung-defend",
    );

  const restartButton =
    getRequiredElement<HTMLButtonElement>(
      root,
      "#warung-restart",
    );

  let width = 360;
  let height = 225;

  let state: GameState =
    "ready";

  let score = 0;
  let best = getBestScore();

  let lives =
    MAX_LIVES;

  let wave = 1;

  let combo = 0;

  let spawnTimer = 0;

  let nextSpawn =
    1.05;

  let elapsed =
    0;

  let lastTimestamp:
    number | null = null;

  let animationFrame:
    number | null = null;

  let resizeObserver:
    ResizeObserver | null = null;

  let pointerInside =
    false;

  const enemies: Enemy[] =
    [];

  const particles: Particle[] =
    [];

  const WARUNG_X =
    0.16;

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

  function updateHud() {
    scoreElement.textContent =
      formatScore(score);

    bestElement.textContent =
      formatScore(best);

    waveElement.textContent =
      String(
        wave,
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
        MAX_LIVES -
          Math.max(
            0,
            lives,
          ),
      );
  }

  function getGroundY() {
    return height * 0.8;
  }

  function getWarungX() {
    return width * WARUNG_X;
  }

  function getSpeedMultiplier() {
    return (
      1 +
      Math.min(
        1.4,
        (wave - 1) *
          0.11,
      )
    );
  }

  function startGame() {
    state = "playing";

    score = 0;
    lives = MAX_LIVES;
    wave = 1;
    combo = 0;
    elapsed = 0;

    spawnTimer = 0;
    nextSpawn = 0.9;

    enemies.length = 0;
    particles.length = 0;

    lastTimestamp =
      performance.now();

    setStatus(
      "DEFENSE ACTIVE / PROTECT THE WARUNG",
    );

    updateHud();
  }

  function endGame() {
    state = "gameover";

    const finalScore =
      Math.floor(score);

    if (
      finalScore > best
    ) {
      best = finalScore;

      saveBestScore(
        best,
      );

      setStatus(
        "NEW BEST / THE SNACKS SURVIVED LONG ENOUGH",
        "success",
      );
    } else {
      setStatus(
        "WARUNG OVERRUN / TAP DEFEND TO TRY AGAIN",
        "danger",
      );
    }

    if (
      typeof navigator.vibrate ===
      "function"
    ) {
      try {
        navigator.vibrate([
          75,
          40,
          110,
        ]);
      } catch {
        // Ignore.
      }
    }

    updateHud();
  }

  function spawnEnemy() {
    const random =
      Math.random();

    const difficulty =
      Math.min(
        1,
        wave / 12,
      );

    let type:
      EnemyType;

    if (
      random <
      0.36
    ) {
      type = "thief";
    } else if (
      random <
      0.58
    ) {
      type = "cat";
    } else if (
      random <
      0.82
    ) {
      type = "kid";
    } else {
      type = "motorbike";
    }

    if (
      wave < 3 &&
      type ===
        "motorbike"
    ) {
      type = "kid";
    }

    let radius = 15;
    let speed = 48;
    let hp = 1;
    let value = 10;

    if (
      type === "thief"
    ) {
      radius = 16;
      speed = 54;
      hp = 1;
      value = 10;
    }

    if (
      type === "cat"
    ) {
      radius = 12;
      speed = 74;
      hp = 1;
      value = 12;
    }

    if (
      type === "kid"
    ) {
      radius = 15;
      speed = 63;
      hp = 1;
      value = 15;
    }

    if (
      type === "motorbike"
    ) {
      radius = 20;
      speed = 39;
      hp = wave >= 8 ? 2 : 1;
      value = 30;
    }

    const enemy: Enemy = {
      x:
        width +
        radius *
          2,

      y:
        getGroundY() -
        radius -
        randomBetween(
          -1,
          3,
        ),

      radius,
      speed:
        speed *
        getSpeedMultiplier(),

      hp,
      maxHp: hp,
      type,
      value,
      hitFlash: 0,
      passed: false,
    };

    enemies.push(
      enemy,
    );

    nextSpawn =
      clamp(
        randomBetween(
          0.7,
          1.25,
        ) -
          difficulty *
            0.16,
        0.5,
        1.25,
      );
  }

  function createParticle(
    x: number,
    y: number,
    text?: string,
  ) {
    for (
      let index = 0;
      index < 5;
      index += 1
    ) {
      particles.push({
        x,
        y,
        velocityX:
          randomBetween(
            -70,
            70,
          ),
        velocityY:
          randomBetween(
            -90,
            -25,
          ),
        life:
          randomBetween(
            0.35,
            0.65,
          ),
        maxLife: 0.65,
        size:
          randomBetween(
            1,
            3,
          ),
      });
    }

    if (text) {
      particles.push({
        x,
        y:
          y -
          12,
        velocityX: 0,
        velocityY: -32,
        life: 0.65,
        maxLife: 0.65,
        size: 1,
        text,
      });
    }
  }

  function updateParticles(
    delta: number,
  ) {
    for (
      let index =
        particles.length -
        1;
      index >= 0;
      index -= 1
    ) {
      const particle =
        particles[index];

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
        105 * delta;

      particle.life -=
        delta;

      if (
        particle.life <=
        0
      ) {
        particles.splice(
          index,
          1,
        );
      }
    }
  }

  function hitEnemy(
    enemy: Enemy,
  ) {
    enemy.hp -= 1;

    enemy.hitFlash =
      0.15;

    if (
      enemy.hp > 0
    ) {
      combo = 0;

      createParticle(
        enemy.x,
        enemy.y,
        "HIT",
      );

      setStatus(
        "THAT ONE TOOK TWO HITS",
      );

      return;
    }

    const comboBonus =
      Math.min(
        5,
        combo,
      );

    combo += 1;

    const gained =
      enemy.value +
      comboBonus *
        2;

    score += gained;

    if (
      score > best
    ) {
      best = score;

      saveBestScore(
        best,
      );
    }

    createParticle(
      enemy.x,
      enemy.y,
      `+${gained}`,
    );

    enemies.splice(
      enemies.indexOf(
        enemy,
      ),
      1,
    );

    setStatus(
      combo >= 3
        ? `COMBO x${combo} / KEEP DEFENDING`
        : "THREAT CLEARED / PROTECT THE SNACKS",
      "success",
    );

    if (
      typeof navigator.vibrate ===
      "function"
    ) {
      try {
        navigator.vibrate(
          25,
        );
      } catch {
        // Ignore.
      }
    }
  }

  function defendNearest() {
    if (
      state === "ready"
    ) {
      startGame();
    }

    if (
      state ===
      "gameover"
    ) {
      startGame();
      return;
    }

    if (
      state !== "playing"
    ) {
      return;
    }

    let closest:
      Enemy | null = null;

    let closestDistance =
      Number.POSITIVE_INFINITY;

    for (const enemy of enemies) {
      const distance =
        Math.abs(
          enemy.x -
            getWarungX(),
        );

      if (
        distance <
        closestDistance
      ) {
        closest =
          enemy;

        closestDistance =
          distance;
      }
    }

    if (!closest) {
      combo = 0;

      setStatus(
        "NICE TRY / THERE IS NOBODY TO DEFEND AGAINST YET",
      );

      return;
    }

    hitEnemy(
      closest,
    );

    updateHud();
  }

  function attackAt(
    x: number,
    y: number,
  ) {
    if (
      state === "ready"
    ) {
      startGame();
    }

    if (
      state ===
      "gameover"
    ) {
      startGame();
      return;
    }

    if (
      state !== "playing"
    ) {
      return;
    }

    let closest:
      Enemy | null = null;

    let closestDistance =
      Number.POSITIVE_INFINITY;

    for (const enemy of enemies) {
      const dx =
        enemy.x - x;

      const dy =
        enemy.y - y;

      const distance =
        Math.sqrt(
          dx * dx +
            dy * dy,
        );

      /*
       * A generous hit radius makes this
       * comfortable on mobile.
       */
      const hitRadius =
        enemy.radius +
        28;

      if (
        distance <=
          hitRadius &&
        distance <
          closestDistance
      ) {
        closest =
          enemy;

        closestDistance =
          distance;
      }
    }

    if (closest) {
      hitEnemy(
        closest,
      );
    } else {
      combo = 0;

      setStatus(
        "MISS / TAP THE THREAT",
      );
    }

    updateHud();
  }

  function loseLife(
    enemy: Enemy,
  ) {
    if (
      enemy.passed
    ) {
      return;
    }

    enemy.passed = true;

    lives -= 1;

    combo = 0;

    createParticle(
      getWarungX(),
      enemy.y,
      "-1",
    );

    setStatus(
      lives > 0
        ? "THE WARUNG TOOK A HIT"
        : "THE WARUNG HAS BEEN OVERRUN",
      lives > 0
        ? "danger"
        : "danger",
    );

    if (
      typeof navigator.vibrate ===
      "function"
    ) {
      try {
        navigator.vibrate(
          lives > 0
            ? 45
            : [
                80,
                40,
                100,
              ],
        );
      } catch {
        // Ignore.
      }
    }

    if (
      lives <= 0
    ) {
      endGame();
    }
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

    elapsed +=
      safeDelta;

    wave =
      1 +
      Math.floor(
        elapsed / 12,
      );

    spawnTimer +=
      safeDelta;

    if (
      spawnTimer >=
      nextSpawn
    ) {
      spawnTimer = 0;

      spawnEnemy();
    }

    for (
      let index =
        enemies.length -
        1;
      index >= 0;
      index -= 1
    ) {
      const enemy =
        enemies[index];

      if (!enemy) {
        continue;
      }

      enemy.x -=
        enemy.speed *
        safeDelta;

      enemy.hitFlash =
        Math.max(
          0,
          enemy.hitFlash -
            safeDelta,
        );

      if (
        !enemy.passed &&
        enemy.x -
          enemy.radius <=
          getWarungX()
      ) {
        loseLife(
          enemy,
        );

        enemies.splice(
          index,
          1,
        );

        continue;
      }

      if (
        enemy.x +
          enemy.radius <
        -30
      ) {
        enemies.splice(
          index,
          1,
        );
      }
    }

    updateParticles(
      safeDelta,
    );

    updateHud();
  }

  function drawBackground(
    time: number,
  ) {
    context.fillStyle =
      "#0b0e0d";

    context.fillRect(
      0,
      0,
      width,
      height,
    );

    /*
     * Sky / moon.
     */
    context.fillStyle =
      "#ded6bf";

    context.beginPath();

    context.arc(
      width * 0.83,
      height * 0.19,
      Math.max(
        15,
        width * 0.05,
      ),
      0,
      Math.PI * 2,
    );

    context.fill();

    /*
     * Stars.
     */
    const stars = [
      [0.08, 0.15],
      [0.19, 0.23],
      [0.32, 0.12],
      [0.46, 0.2],
      [0.61, 0.12],
      [0.71, 0.3],
      [0.91, 0.14],
      [0.86, 0.33],
    ];

    for (
      let index = 0;
      index < stars.length;
      index += 1
    ) {
      const star =
        stars[index];

      if (!star) {
        continue;
      }

      const alpha =
        0.55 +
        Math.sin(
          time * 0.002 +
            index,
        ) *
          0.2;

      context.globalAlpha =
        clamp(
          alpha,
          0.2,
          1,
        );

      context.fillStyle =
        "#d9d4c8";

      context.fillRect(
        width * star[0],
        height * star[1],
        2,
        2,
      );
    }

    context.globalAlpha = 1;

    /*
     * Distant buildings.
     */
    const horizon =
      height * 0.54;

    context.fillStyle =
      "#161a18";

    const buildings = [
      [0.02, 0.14, 0.18],
      [0.16, 0.11, 0.12],
      [0.29, 0.16, 0.2],
      [0.46, 0.1, 0.14],
      [0.57, 0.2, 0.2],
      [0.78, 0.12, 0.16],
      [0.9, 0.13, 0.22],
    ];

    for (const building of buildings) {
      const x =
        width *
        building[0];

      const buildingWidth =
        width *
        building[1];

      const buildingHeight =
        height *
        building[2];

      context.fillRect(
        x,
        horizon -
          buildingHeight,
        buildingWidth,
        buildingHeight,
      );
    }

    /*
     * Wires.
     */
    context.strokeStyle =
      "#393d39";

    context.lineWidth = 1;

    context.beginPath();

    context.moveTo(
      0,
      height * 0.36,
    );

    context.quadraticCurveTo(
      width * 0.34,
      height * 0.3,
      width,
      height * 0.38,
    );

    context.stroke();

    context.beginPath();

    context.moveTo(
      0,
      height * 0.42,
    );

    context.quadraticCurveTo(
      width * 0.42,
      height * 0.35,
      width,
      height * 0.44,
    );

    context.stroke();

    /*
     * Street.
     */
    const ground =
      getGroundY();

    context.fillStyle =
      "#262824";

    context.fillRect(
      0,
      ground,
      width,
      height -
        ground,
    );

    context.fillStyle =
      "#57584f";

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
     * Moving lane markers.
     */
    const markerWidth =
      Math.max(
        22,
        width * 0.08,
      );

    const markerGap =
      Math.max(
        28,
        width * 0.12,
      );

    const offset =
      -(
        (elapsed *
          90) %
        (markerWidth +
          markerGap)
      );

    context.fillStyle =
      "#686760";

    for (
      let x = offset;
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
        2,
      );
    }

    /*
     * Roadside plants.
     */
    context.fillStyle =
      "#0e110f";

    context.fillRect(
      width * 0.57,
      ground -
        height * 0.09,
      5,
      height * 0.09,
    );

    context.beginPath();

    context.arc(
      width * 0.57,
      ground -
        height * 0.12,
      width * 0.06,
      0,
      Math.PI * 2,
    );

    context.fill();
  }

  function drawWarung() {
    const x =
      getWarungX();

    const ground =
      getGroundY();

    const boothWidth =
      width * 0.17;

    const boothHeight =
      height * 0.28;

    const boothY =
      ground -
      boothHeight;

    /*
     * Shadow.
     */
    context.fillStyle =
      "#101110";

    context.fillRect(
      x -
        boothWidth *
          0.15,
      ground -
        3,
      boothWidth *
        1.25,
      4,
    );

    /*
     * Main booth.
     */
    context.fillStyle =
      "#574f42";

    context.fillRect(
      x -
        boothWidth *
          0.08,
      boothY +
        boothHeight *
          0.2,
      boothWidth,
      boothHeight *
        0.8,
    );

    /*
     * Roof.
     */
    context.fillStyle =
      "#292a27";

    context.fillRect(
      x -
        boothWidth *
          0.13,
      boothY,
      boothWidth *
        1.12,
      boothHeight *
        0.2,
    );

    /*
     * Counter.
     */
    context.fillStyle =
      "#8b806b";

    context.fillRect(
      x -
        boothWidth *
          0.03,
      boothY +
        boothHeight *
          0.55,
      boothWidth *
        0.9,
      boothHeight *
        0.13,
    );

    /*
     * Hanging sign.
     */
    context.fillStyle =
      "#eeeae1";

    context.fillRect(
      x +
        boothWidth *
          0.08,
      boothY +
        boothHeight *
          0.04,
      boothWidth *
        0.66,
      boothHeight *
        0.12,
    );

    context.fillStyle =
      "#222220";

    context.font =
      `900 ${Math.max(
        5,
        width * 0.015,
      )}px monospace`;

    context.textAlign =
      "center";

    context.fillText(
      "WARUNG",
      x +
        boothWidth *
          0.41,
      boothY +
        boothHeight *
          0.125,
    );

    context.textAlign =
      "left";

    /*
     * Snack shelves.
     */
    context.fillStyle =
      "#272724";

    context.fillRect(
      x +
        boothWidth *
          0.08,
      boothY +
        boothHeight *
          0.3,
      boothWidth *
        0.7,
      2,
    );

    context.fillRect(
      x +
        boothWidth *
          0.08,
      boothY +
        boothHeight *
          0.42,
      boothWidth *
        0.7,
      2,
    );

    /*
     * Snack packs.
     */
    const snackColors = [
      "#b1a68f",
      "#817b69",
      "#c7bca4",
      "#6e7169",
    ];

    for (
      let index = 0;
      index < 4;
      index += 1
    ) {
      context.fillStyle =
        snackColors[index] ??
        "#aaa";

      context.fillRect(
        x +
          boothWidth *
            (0.12 +
              index *
                0.17),
        boothY +
          boothHeight *
            0.34,
        boothWidth *
          0.1,
        boothHeight *
          0.06,
      );
    }

    /*
     * Warning line in front.
     */
    context.strokeStyle =
      "#5b5b54";

    context.lineWidth = 1;

    context.setLineDash([
      4,
      5,
    ]);

    context.beginPath();

    context.moveTo(
      x +
        boothWidth *
          0.95,
      ground -
        height * 0.01,
    );

    context.lineTo(
      x +
        boothWidth *
          0.95,
      ground -
        height * 0.2,
    );

    context.stroke();

    context.setLineDash([]);
  }

  function drawEnemy(
    enemy: Enemy,
  ) {
    const flash =
      enemy.hitFlash > 0;

    const fill =
      flash
        ? "#eeeae1"
        : enemy.type ===
            "thief"
          ? "#7b6b58"
          : enemy.type ===
              "cat"
            ? "#686963"
            : enemy.type ===
                "kid"
              ? "#807b6d"
              : "#555651";

    context.fillStyle =
      fill;

    if (
      enemy.type ===
      "motorbike"
    ) {
      /*
       * Body.
       */
      context.fillRect(
        enemy.x -
          enemy.radius *
            1.1,
        enemy.y -
          enemy.radius *
            0.35,
        enemy.radius *
          2.2,
        enemy.radius *
          0.7,
      );

      /*
       * Wheels.
       */
      context.beginPath();

      context.arc(
        enemy.x -
          enemy.radius *
            0.75,
        enemy.y +
          enemy.radius *
            0.7,
        enemy.radius *
          0.34,
        0,
        Math.PI * 2,
      );

      context.arc(
        enemy.x +
          enemy.radius *
            0.75,
        enemy.y +
          enemy.radius *
            0.7,
        enemy.radius *
          0.34,
        0,
        Math.PI * 2,
      );

      context.fill();

      context.fillStyle =
        "#222321";

      context.fillRect(
        enemy.x +
          enemy.radius *
            0.42,
        enemy.y -
          enemy.radius *
            0.86,
        Math.max(
          2,
          enemy.radius *
            0.12,
        ),
        enemy.radius *
          0.5,
      );
    } else {
      context.beginPath();

      context.arc(
        enemy.x,
        enemy.y,
        enemy.radius,
        0,
        Math.PI * 2,
      );

      context.fill();

      /*
       * Head.
       */
      context.fillStyle =
        "#4a4b47";

      context.beginPath();

      context.arc(
        enemy.x,
        enemy.y -
          enemy.radius *
            0.55,
        enemy.radius *
          0.58,
        0,
        Math.PI * 2,
      );

      context.fill();

      /*
       * Eyes.
       */
      context.fillStyle =
        "#eeeae1";

      context.fillRect(
        enemy.x -
          enemy.radius *
            0.28,
        enemy.y -
          enemy.radius *
            0.64,
        2,
        2,
      );

      context.fillRect(
        enemy.x +
          enemy.radius *
            0.18,
        enemy.y -
          enemy.radius *
            0.64,
        2,
        2,
      );

      /*
       * Cat ears.
       */
      if (
        enemy.type ===
        "cat"
      ) {
        context.fillStyle =
          "#686963";

        context.beginPath();

        context.moveTo(
          enemy.x -
            enemy.radius *
              0.7,
          enemy.y -
            enemy.radius *
              0.9,
        );

        context.lineTo(
          enemy.x -
            enemy.radius *
              0.25,
          enemy.y -
            enemy.radius *
              1.45,
        );

        context.lineTo(
          enemy.x,
          enemy.y -
            enemy.radius *
              0.92,
        );

        context.closePath();

        context.fill();

        context.beginPath();

        context.moveTo(
          enemy.x,
          enemy.y -
            enemy.radius *
              0.92,
        );

        context.lineTo(
          enemy.x +
            enemy.radius *
              0.25,
          enemy.y -
            enemy.radius *
              1.45,
        );

        context.lineTo(
          enemy.x +
            enemy.radius *
              0.7,
          enemy.y -
            enemy.radius *
              0.9,
        );

        context.closePath();

        context.fill();
      }
    }

    /*
     * HP bar for stronger enemies.
     */
    if (
      enemy.maxHp > 1
    ) {
      const barWidth =
        enemy.radius *
        2;

      const barX =
        enemy.x -
        barWidth / 2;

      const barY =
        enemy.y -
        enemy.radius *
          1.65;

      context.fillStyle =
        "#292a27";

      context.fillRect(
        barX,
        barY,
        barWidth,
        3,
      );

      context.fillStyle =
        "#bbb5a6";

      context.fillRect(
        barX,
        barY,
        barWidth *
          (enemy.hp /
            enemy.maxHp),
        3,
      );
    }
  }

  function drawParticles() {
    for (const particle of particles) {
      const alpha =
        clamp(
          particle.life /
            particle.maxLife,
          0,
          1,
        );

      context.globalAlpha =
        alpha;

      if (particle.text) {
        context.fillStyle =
          "#eeeae1";

        context.font =
          `900 ${Math.max(
            8,
            width * 0.018,
          )}px monospace`;

        context.textAlign =
          "center";

        context.fillText(
          particle.text,
          particle.x,
          particle.y,
        );

        context.textAlign =
          "left";
      } else {
        context.fillStyle =
          "#aaa397";

        context.fillRect(
          particle.x,
          particle.y,
          particle.size,
          particle.size,
        );
      }
    }

    context.globalAlpha = 1;
  }

  function drawOverlay() {
    if (
      state === "playing"
    ) {
      return;
    }

    context.fillStyle =
      "rgba(7, 8, 7, 0.7)";

    context.fillRect(
      0,
      0,
      width,
      height,
    );

    context.textAlign =
      "center";

    context.fillStyle =
      "#eeeae1";

    context.font =
      `950 ${Math.max(
        22,
        width * 0.07,
      )}px Inter, sans-serif`;

    if (
      state === "ready"
    ) {
      context.fillText(
        "WARUNG DEFENSE",
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
      context.fillText(
        "WARUNG OVERRUN",
        width / 2,
        height * 0.41,
      );

      context.fillStyle =
        "#8b877f";

      context.font =
        `800 ${Math.max(
          7,
          width * 0.018,
        )}px monospace`;

      context.fillText(
        "TAP DEFEND TO TRY AGAIN",
        width / 2,
        height * 0.52,
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

    drawWarung();

    for (const enemy of enemies) {
      drawEnemy(
        enemy,
      );
    }

    drawParticles();

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

    const dpr =
      Math.min(
        window.devicePixelRatio ||
          1,
        2,
      );

    canvas.width =
      Math.floor(
        width * dpr,
      );

    canvas.height =
      Math.floor(
        height * dpr,
      );

    context.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0,
    );
  }

  function getPointerPosition(
    event: PointerEvent,
  ) {
    const rect =
      canvas.getBoundingClientRect();

    const x =
      ((event.clientX -
        rect.left) /
        rect.width) *
      width;

    const y =
      ((event.clientY -
        rect.top) /
        rect.height) *
      height;

    return {
      x,
      y,
    };
  }

  function handleCanvasPointer(
    event: PointerEvent,
  ) {
    event.preventDefault();

    const position =
      getPointerPosition(
        event,
      );

    attackAt(
      position.x,
      position.y,
    );
  }

  function loop(
    timestamp: number,
  ) {
    if (
      lastTimestamp ===
      null
    ) {
      lastTimestamp =
        timestamp;
    }

    const delta =
      (timestamp -
        lastTimestamp) /
      1000;

    lastTimestamp =
      timestamp;

    update(delta);

    draw(timestamp);

    animationFrame =
      window.requestAnimationFrame(
        loop,
      );
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
        HTMLSelectElement ||
      target instanceof
        HTMLButtonElement
    ) {
      return;
    }

    if (
      event.key ===
        " " ||
      event.key ===
        "Enter" ||
      event.key ===
        "ArrowUp" ||
      event.key ===
        "e" ||
      event.key ===
        "E"
    ) {
      event.preventDefault();

      defendNearest();
    }
  }

  defendButton.addEventListener(
    "click",
    defendNearest,
  );

  restartButton.addEventListener(
    "click",
    startGame,
  );

  canvas.addEventListener(
    "pointerdown",
    handleCanvasPointer,
  );

  canvas.addEventListener(
    "pointerenter",
    () => {
      pointerInside = true;
    },
  );

  canvas.addEventListener(
    "pointerleave",
    () => {
      pointerInside = false;
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
        lastTimestamp = null;
      } else {
        lastTimestamp =
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

  updateHud();

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

    root.innerHTML = "";
  };
}