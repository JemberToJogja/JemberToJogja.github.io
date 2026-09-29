// src/games/kuntilanak.ts

type GameState =
  | "ready"
  | "playing"
  | "paused"
  | "gameover";

type ObstacleType =
  | "tree"
  | "pole"
  | "roof";

interface Player {
  x: number;
  y: number;
  velocityY: number;
  rotation: number;
  flapAnimation: number;
}

interface Obstacle {
  x: number;
  gapCenter: number;
  gapHeight: number;
  width: number;
  type: ObstacleType;
  passed: boolean;
}

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  phase: number;
}

interface Building {
  x: number;
  width: number;
  height: number;
}

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const STORAGE_KEY =
  "jembertojogja.kuntilanak.best.v2";

const COLORS = {
  sky: "#080a0d",
  skyTop: "#0e1216",
  skyline: "#11161b",
  skylineLight: "#181e24",

  moon: "#efe7d0",
  moonShadow: "#d0c6ab",
  star: "#d9d4c5",

  tree: "#20342a",
  treeDark: "#17261f",
  trunk: "#624735",

  pole: "#70757a",
  poleDark: "#41474d",
  cable: "#24292e",

  roof: "#674b41",
  roofDark: "#42322e",
  roofTile: "#8d6256",
  building: "#302625",

  ground: "#101419",
  groundLine: "#292f35",

  ghost: "#eee9dc",
  ghostShadow: "#c5bdad",
  hair: "#121214",
  face: "#211b1d",
  mouth: "#b9474e",

  text: "#f0eadc",
  muted: "#969189",
  accent: "#e8bf68",

  danger: "#d8645c",
};

const PHYSICS = {
  gravity: 1010,
  flapVelocity: -365,
  maximumFall: 575,
  maximumRise: -440,
};

const WORLD = {
  groundHeight: 62,

  startSpeed: 182,
  maximumSpeed: 315,
  speedIncrease: 4.7,

  startGap: 205,
  minimumGap: 164,

  firstSpawnDelay: 1.25,
  baseSpawnDistance: 255,
  minimumSpawnDistance: 215,
};

function requireElement<T extends Element>(
  root: ParentNode,
  selector: string,
  label: string,
): T {
  const element =
    root.querySelector<T>(selector);

  if (!element) {
    throw new Error(
      `[Kuntilanak Fly] Missing ${label}: ${selector}`,
    );
  }

  return element;
}

function requireCanvasContext(
  canvas: HTMLCanvasElement,
): CanvasRenderingContext2D {
  const context =
    canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
    });

  if (!context) {
    throw new Error(
      "[Kuntilanak Fly] Could not create 2D canvas context.",
    );
  }

  return context;
}

export function mountGame(root: HTMLElement) {
  root.innerHTML = `
    <section
      class="kj-game"
      aria-label="Kuntilanak Fly"
    >
      <canvas
        class="kj-canvas"
        aria-label="Kuntilanak Fly game"
      ></canvas>

      <div class="kj-hud">
        <div class="kj-score-block">
          <span>SCORE</span>
          <strong data-score>0</strong>
        </div>

        <div class="kj-right-hud">
          <div class="kj-score-block">
            <span>BEST</span>
            <strong data-best>0</strong>
          </div>

          <button
            class="kj-pause"
            type="button"
            data-pause
            aria-label="Pause game"
          >
            II
          </button>
        </div>
      </div>

      <div
        class="kj-overlay"
        data-overlay
      >
        <div class="kj-overlay-card">
          <div
            class="kj-kicker"
            data-overlay-kicker
          >
            JEMBER → JOGJA / NIGHT SHIFT
          </div>

          <h2 data-overlay-title>
            KUNTILANAK FLY
          </h2>

          <p data-overlay-copy>
            Fly through the Indonesian night.
            Do not hit the pole.
          </p>

          <div
            class="kj-final-score"
            data-overlay-score
            hidden
          >
            <div>
              <span>SCORE</span>
              <strong data-final-score>0</strong>
            </div>

            <div>
              <span>BEST</span>
              <strong data-final-best>0</strong>
            </div>
          </div>

          <button
            class="kj-main-button"
            type="button"
            data-action
          >
            TAP TO FLY
          </button>

          <div
            class="kj-hint"
            data-hint
          >
            TAP ANYWHERE TO FLY
          </div>
        </div>
      </div>

      <div
        class="kj-touch-hint"
        data-touch-hint
      >
        <span>TAP</span>
        <b>↑</b>
        <span>FLY</span>
      </div>

      <div class="kj-bottom-label">
        <span>TREES</span>
        <i>•</i>
        <span>POLES</span>
        <i>•</i>
        <span>ROOFTOPS</span>
      </div>
    </section>
  `;

  const game =
    requireElement<HTMLElement>(
      root,
      ".kj-game",
      "game root",
    );

  const canvas =
    requireElement<HTMLCanvasElement>(
      game,
      ".kj-canvas",
      "canvas",
    );

  const context =
    requireCanvasContext(canvas);

  const scoreElement =
    requireElement<HTMLElement>(
      game,
      "[data-score]",
      "score element",
    );

  const bestElement =
    requireElement<HTMLElement>(
      game,
      "[data-best]",
      "best element",
    );

  const overlay =
    requireElement<HTMLElement>(
      game,
      "[data-overlay]",
      "overlay",
    );

  const overlayKicker =
    requireElement<HTMLElement>(
      game,
      "[data-overlay-kicker]",
      "overlay kicker",
    );

  const overlayTitle =
    requireElement<HTMLElement>(
      game,
      "[data-overlay-title]",
      "overlay title",
    );

  const overlayCopy =
    requireElement<HTMLElement>(
      game,
      "[data-overlay-copy]",
      "overlay copy",
    );

  const overlayScore =
    requireElement<HTMLElement>(
      game,
      "[data-overlay-score]",
      "overlay score",
    );

  const finalScoreElement =
    requireElement<HTMLElement>(
      game,
      "[data-final-score]",
      "final score",
    );

  const finalBestElement =
    requireElement<HTMLElement>(
      game,
      "[data-final-best]",
      "final best",
    );

  const actionButton =
    requireElement<HTMLButtonElement>(
      game,
      "[data-action]",
      "action button",
    );

  const pauseButton =
    requireElement<HTMLButtonElement>(
      game,
      "[data-pause]",
      "pause button",
    );

  const hintElement =
    requireElement<HTMLElement>(
      game,
      "[data-hint]",
      "hint",
    );

  const touchHint =
    requireElement<HTMLElement>(
      game,
      "[data-touch-hint]",
      "touch hint",
    );

  let width = 360;
  let height = 640;
  let devicePixelRatio = 1;

  let state: GameState = "ready";

  let score = 0;
  let bestScore = loadBestScore();

  let worldTime = 0;
  let lastTime = 0;

  let spawnTimer =
    WORLD.firstSpawnDelay;

  let backgroundOffset = 0;
  let foregroundOffset = 0;

  let animationFrame = 0;
  let resizeFrame = 0;

  let destroyed = false;

  let stars: Star[] = [];
  let buildings: Building[] = [];

  let player: Player = {
    x: 108,
    y: 300,
    velocityY: 0,
    rotation: 0,
    flapAnimation: 0,
  };

  let obstacles: Obstacle[] = [];

  function loadBestScore(): number {
    try {
      const value =
        localStorage.getItem(
          STORAGE_KEY,
        );

      if (!value) {
        return 0;
      }

      const parsed =
        Number.parseInt(value, 10);

      if (!Number.isFinite(parsed)) {
        return 0;
      }

      return Math.max(0, parsed);
    } catch {
      return 0;
    }
  }

  function saveBestScore(value: number) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        String(value),
      );
    } catch {
      // Storage can be blocked in private browsing.
    }
  }

  function vibrate(
    pattern: number | number[],
  ) {
    try {
      if (
        "vibrate" in navigator &&
        typeof navigator.vibrate ===
          "function"
      ) {
        navigator.vibrate(pattern);
      }
    } catch {
      // Haptics are optional.
    }
  }

  function resize() {
    const rect =
      game.getBoundingClientRect();

    width = Math.max(
      280,
      Math.floor(rect.width || 360),
    );

    height = Math.max(
      500,
      Math.floor(rect.height || 640),
    );

    devicePixelRatio = Math.min(
      2.25,
      Math.max(
        1,
        window.devicePixelRatio || 1,
      ),
    );

    canvas.width = Math.floor(
      width * devicePixelRatio,
    );

    canvas.height = Math.floor(
      height * devicePixelRatio,
    );

    canvas.style.width =
      `${width}px`;

    canvas.style.height =
      `${height}px`;

    context.setTransform(
      devicePixelRatio,
      0,
      0,
      devicePixelRatio,
      0,
      0,
    );

    context.imageSmoothingEnabled =
      true;

    player.x =
      Math.min(
        width * 0.25,
        120,
      );

    player.y =
      clamp(
        player.y,
        80,
        getGroundY() - 90,
      );

    rebuildBackground();
  }

  function scheduleResize() {
    if (resizeFrame) {
      return;
    }

    resizeFrame =
      requestAnimationFrame(() => {
        resizeFrame = 0;

        if (destroyed) {
          return;
        }

        resize();
      });
  }

  function rebuildBackground() {
    stars = [];
    buildings = [];

    const starCount =
      Math.max(
        28,
        Math.floor(width / 9),
      );

    for (
      let index = 0;
      index < starCount;
      index += 1
    ) {
      stars.push({
        x:
          seededRandom(
            index * 13 + 3,
          ) * width,

        y:
          seededRandom(
            index * 17 + 9,
          ) * Math.max(
            270,
            height * 0.52,
          ),

        size:
          0.7 +
          seededRandom(
            index * 29 + 1,
          ) * 1.8,

        alpha:
          0.25 +
          seededRandom(
            index * 37 + 4,
          ) * 0.65,

        phase:
          seededRandom(
            index * 47 + 5,
          ) *
          Math.PI *
          2,
      });
    }

    let x = 0;
    let index = 0;

    while (x < width + 300) {
      const buildingWidth =
        55 +
        seededRandom(
          index * 11 + 4,
        ) *
          72;

      const buildingHeight =
        40 +
        seededRandom(
          index * 19 + 7,
        ) *
          120;

      buildings.push({
        x,
        width: buildingWidth,
        height: buildingHeight,
      });

      x +=
        buildingWidth +
        10 +
        seededRandom(
          index * 23 + 8,
        ) *
          28;

      index += 1;
    }
  }

  function getGroundY(): number {
    return (
      height -
      WORLD.groundHeight
    );
  }

  function setState(
    nextState: GameState,
  ) {
    state = nextState;

    overlay.classList.toggle(
      "is-hidden",
      state === "playing",
    );

    touchHint.classList.toggle(
      "is-hidden",
      state !== "playing",
    );

    pauseButton.classList.toggle(
      "is-hidden",
      state === "ready" ||
        state === "gameover",
    );

    if (state === "ready") {
      pauseButton.textContent = "II";

      overlayKicker.textContent =
        "JEMBER → JOGJA / NIGHT SHIFT";

      overlayTitle.textContent =
        "KUNTILANAK FLY";

      overlayCopy.textContent =
        "Fly through the Indonesian night. Do not hit the pole.";

      overlayScore.hidden = true;

      actionButton.textContent =
        "TAP TO FLY";

      actionButton.classList.remove(
        "is-secondary",
      );

      hintElement.textContent =
        "TAP ANYWHERE TO FLY";
    }

    if (state === "playing") {
      overlayScore.hidden = true;
    }

    if (state === "paused") {
      overlayKicker.textContent =
        "SYSTEM PAUSED";

      overlayTitle.textContent =
        "PAUSED";

      overlayCopy.textContent =
        "Even the kuntilanak needs a break.";

      overlayScore.hidden = true;

      actionButton.textContent =
        "RESUME";

      hintElement.textContent =
        "TAP TO CONTINUE";
    }

    if (state === "gameover") {
      pauseButton.textContent = "II";

      overlayKicker.textContent =
        "NIGHT SHIFT ENDED";

      overlayTitle.textContent =
        "GAME OVER";

      overlayCopy.textContent =
        getGameOverMessage();

      overlayScore.hidden = false;

      finalScoreElement.textContent =
        String(score);

      finalBestElement.textContent =
        String(bestScore);

      actionButton.textContent =
        "TRY AGAIN";

      actionButton.classList.add(
        "is-secondary",
      );

      hintElement.textContent =
        "TAP TO START AGAIN";
    }

    updateHud();
  }

  function resetGame(
    startImmediately = false,
  ) {
    score = 0;

    worldTime = 0;

    spawnTimer =
      WORLD.firstSpawnDelay;

    backgroundOffset = 0;
    foregroundOffset = 0;

    obstacles = [];

    player = {
      x:
        Math.min(
          width * 0.25,
          120,
        ),

      y:
        height * 0.46,

      velocityY: 0,

      rotation: -0.04,

      flapAnimation: 0,
    };

    updateHud();

    if (startImmediately) {
      startGame();
    }
  }

  function startGame() {
    score = 0;
    obstacles = [];

    spawnTimer =
      WORLD.firstSpawnDelay;

    player.x =
      Math.min(
        width * 0.25,
        120,
      );

    player.y =
      height * 0.46;

    player.velocityY = 0;
    player.rotation = -0.05;
    player.flapAnimation = 0.16;

    lastTime =
      performance.now();

    setState("playing");

    flap();
  }

  function resumeGame() {
    if (state !== "paused") {
      return;
    }

    lastTime =
      performance.now();

    setState("playing");
  }

  function togglePause() {
    if (state === "playing") {
      setState("paused");
      return;
    }

    if (state === "paused") {
      resumeGame();
    }
  }

  function flap() {
    if (state !== "playing") {
      return;
    }

    player.velocityY =
      PHYSICS.flapVelocity;

    player.flapAnimation =
      0.17;

    vibrate(7);
  }

  function handleGamePointerDown(
    event: PointerEvent,
  ) {
    event.preventDefault();

    if (destroyed) {
      return;
    }

    if (state === "ready") {
      startGame();
      return;
    }

    if (state === "playing") {
      flap();
      return;
    }

    if (state === "paused") {
      resumeGame();
      return;
    }

    if (state === "gameover") {
      resetGame(true);
    }
  }

  function handleActionClick(
    event: MouseEvent,
  ) {
    event.preventDefault();

    if (state === "ready") {
      startGame();
      return;
    }

    if (state === "paused") {
      resumeGame();
      return;
    }

    if (state === "gameover") {
      resetGame(true);
    }
  }

  function handlePauseClick(
    event: MouseEvent,
  ) {
    event.preventDefault();

    togglePause();
  }

  function handleVisibility() {
    if (
      document.hidden &&
      state === "playing"
    ) {
      setState("paused");
    }
  }

  function handleBlur() {
    if (state === "playing") {
      setState("paused");
    }
  }

  function update(delta: number) {
    worldTime += delta;

    const speed = Math.min(
      WORLD.maximumSpeed,
      WORLD.startSpeed +
        score * WORLD.speedIncrease,
    );

    backgroundOffset +=
      speed *
      delta *
      0.055;

    foregroundOffset +=
      speed *
      delta *
      0.13;

    updatePlayer(delta);

    if (state !== "playing") {
      return;
    }

    updateObstacles(
      delta,
      speed,
    );

    if (
      checkWorldCollision() ||
      checkObstacleCollision()
    ) {
      crash();
    }
  }

  function updatePlayer(
    delta: number,
  ) {
    player.flapAnimation =
      Math.max(
        0,
        player.flapAnimation -
          delta,
      );

    if (state === "playing") {
      player.velocityY +=
        PHYSICS.gravity * delta;

      player.velocityY =
        clamp(
          player.velocityY,
          PHYSICS.maximumRise,
          PHYSICS.maximumFall,
        );

      player.y +=
        player.velocityY *
        delta;
    }

    if (state === "ready") {
      player.y =
        height * 0.46 +
        Math.sin(
          worldTime * 2.7,
        ) *
          9;
    }

    const rotationTarget =
      clamp(
        player.velocityY / 520,
        -0.58,
        1.03,
      );

    player.rotation +=
      (
        rotationTarget -
        player.rotation
      ) *
      Math.min(
        1,
        delta * 9,
      );
  }

  function updateObstacles(
    delta: number,
    speed: number,
  ) {
    spawnTimer -= delta;

    if (spawnTimer <= 0) {
      spawnObstacle();

      const spawnDistance =
        Math.max(
          WORLD.minimumSpawnDistance,
          WORLD.baseSpawnDistance -
            score * 2.2,
        );

      spawnTimer =
        spawnDistance / speed;
    }

    for (
      let index =
        obstacles.length - 1;
      index >= 0;
      index -= 1
    ) {
      const obstacle =
        obstacles[index];

      obstacle.x -=
        speed * delta;

      if (
        !obstacle.passed &&
        obstacle.x +
          obstacle.width <
          player.x
      ) {
        obstacle.passed = true;

        score += 1;

        if (
          score > bestScore
        ) {
          bestScore = score;
          saveBestScore(
            bestScore,
          );
        }

        updateHud();

        vibrate(9);
      }

      if (
        obstacle.x +
          obstacle.width <
        -70
      ) {
        obstacles.splice(
          index,
          1,
        );
      }
    }
  }

  function spawnObstacle() {
    const gapHeight =
      Math.max(
        WORLD.minimumGap,
        WORLD.startGap -
          score * 2.3,
      );

    const groundY =
      getGroundY();

    const minimumGapCenter =
      gapHeight / 2 +
      72;

    const maximumGapCenter =
      groundY -
      gapHeight / 2 -
      58;

    const random =
      Math.random();

    const gapCenter =
      minimumGapCenter +
      random *
        Math.max(
          1,
          maximumGapCenter -
            minimumGapCenter,
        );

    const typeRandom =
      Math.random();

    let type: ObstacleType;

    if (typeRandom < 0.44) {
      type = "tree";
    } else if (
      typeRandom < 0.81
    ) {
      type = "pole";
    } else {
      type = "roof";
    }

    obstacles.push({
      x: width + 24,

      gapCenter: clamp(
        gapCenter,
        minimumGapCenter,
        maximumGapCenter,
      ),

      gapHeight,

      width: clamp(
        width * 0.17,
        62,
        82,
      ),

      type,

      passed: false,
    });
  }

  function getPlayerHitbox(): Rect {
    return {
      x: player.x - 13,
      y: player.y - 17,
      width: 26,
      height: 36,
    };
  }

  function checkWorldCollision(): boolean {
    const hitbox =
      getPlayerHitbox();

    return (
      hitbox.y <= 5 ||
      hitbox.y +
        hitbox.height >=
        getGroundY()
    );
  }

  function checkObstacleCollision(): boolean {
    const playerBox =
      getPlayerHitbox();

    for (const obstacle of obstacles) {
      const obstacleLeft =
        obstacle.x + 7;

      const obstacleRight =
        obstacle.x +
        obstacle.width -
        7;

      const topObstacleBottom =
        obstacle.gapCenter -
        obstacle.gapHeight / 2 +
        8;

      const bottomObstacleTop =
        obstacle.gapCenter +
        obstacle.gapHeight / 2 -
        8;

      const horizontalCollision =
        playerBox.x +
          playerBox.width >
          obstacleLeft &&
        playerBox.x <
          obstacleRight;

      if (!horizontalCollision) {
        continue;
      }

      if (
        playerBox.y <
        topObstacleBottom
      ) {
        return true;
      }

      if (
        playerBox.y +
          playerBox.height >
        bottomObstacleTop
      ) {
        return true;
      }
    }

    return false;
  }

  function crash() {
    if (state !== "playing") {
      return;
    }

    state = "gameover";

    player.velocityY = 110;

    vibrate([20, 35, 20]);

    setState("gameover");
  }

  function getGameOverMessage(): string {
    const messages = [
      "The utility pole won.",
      "The tree had the better route.",
      "That roof was definitely there.",
      "Gravity has entered the chat.",
      "Kuntilanak.exe stopped responding.",
      "Your flight was not approved.",
    ];

    return messages[
      Math.min(
        messages.length - 1,
        Math.floor(score / 5),
      )
    ];
  }

  function updateHud() {
    scoreElement.textContent =
      String(score);

    bestElement.textContent =
      String(bestScore);

    finalScoreElement.textContent =
      String(score);

    finalBestElement.textContent =
      String(bestScore);
  }

  function draw(time: number) {
    context.setTransform(
      devicePixelRatio,
      0,
      0,
      devicePixelRatio,
      0,
      0,
    );

    drawBackground(time);

    drawObstacles();

    drawPlayer(time);

    drawGround();

    if (state === "gameover") {
      drawCrashOverlay();
    }
  }

  function drawBackground(
    time: number,
  ) {
    context.fillStyle =
      COLORS.sky;

    context.fillRect(
      0,
      0,
      width,
      height,
    );

    context.fillStyle =
      COLORS.skyTop;

    context.fillRect(
      0,
      0,
      width,
      Math.max(
        180,
        height * 0.3,
      ),
    );

    drawMoon();

    drawStars(time);

    drawSkyline();

    drawDistantTrees();
  }

  function drawMoon() {
    const moonX =
      width * 0.78;

    const moonY =
      Math.max(
        80,
        height * 0.16,
      );

    context.save();

    context.fillStyle =
      COLORS.moon;

    context.beginPath();

    context.arc(
      moonX,
      moonY,
      35,
      0,
      Math.PI * 2,
    );

    context.fill();

    context.fillStyle =
      COLORS.sky;

    context.beginPath();

    context.arc(
      moonX + 13,
      moonY - 7,
      31,
      0,
      Math.PI * 2,
    );

    context.fill();

    context.restore();
  }

  function drawStars(
    time: number,
  ) {
    context.save();

    for (const star of stars) {
      const pulse =
        0.72 +
        Math.sin(
          time * 1.7 +
            star.phase,
        ) *
          0.28;

      context.globalAlpha =
        star.alpha * pulse;

      context.fillStyle =
        COLORS.star;

      context.fillRect(
        star.x,
        star.y,
        star.size,
        star.size,
      );
    }

    context.restore();
  }

  function drawSkyline() {
    const baseY =
      getGroundY() - 58;

    const offset =
      -(
        backgroundOffset %
        160
      );

    context.save();

    for (
      let repeat = 0;
      repeat < 4;
      repeat += 1
    ) {
      for (const building of buildings) {
        const x =
          building.x +
          repeat * 160 +
          offset;

        if (
          x >
            width + 100 ||
          x + building.width <
            -100
        ) {
          continue;
        }

        const top =
          baseY -
          building.height;

        context.fillStyle =
          COLORS.skyline;

        context.fillRect(
          x,
          top,
          building.width,
          building.height,
        );

        context.fillStyle =
          COLORS.skylineLight;

        context.fillRect(
          x - 3,
          top - 4,
          building.width + 6,
          4,
        );

        if (
          building.height >
          65
        ) {
          context.fillStyle =
            "#4f4b42";

          const columns =
            Math.max(
              1,
              Math.floor(
                building.width /
                  28,
              ),
            );

          for (
            let column = 0;
            column < columns;
            column += 1
          ) {
            const windowX =
              x +
              8 +
              column * 26;

            if (
              windowX + 4 >
              x +
                building.width -
                6
            ) {
              continue;
            }

            context.fillRect(
              windowX,
              top + 17,
              4,
              4,
            );

            if (
              building.height >
              95
            ) {
              context.fillRect(
                windowX,
                top + 39,
                4,
                4,
              );
            }
          }
        }
      }
    }

    context.restore();
  }

  function drawDistantTrees() {
    const groundY =
      getGroundY();

    const offset =
      -(
        foregroundOffset %
        125
      );

    context.save();

    for (
      let index = 0;
      index < 9;
      index += 1
    ) {
      const x =
        index * 88 +
        offset;

      const treeHeight =
        48 +
        (index % 3) * 15;

      const trunkTop =
        groundY -
        treeHeight +
        20;

      context.fillStyle =
        COLORS.treeDark;

      context.fillRect(
        x + 22,
        trunkTop,
        9,
        treeHeight,
      );

      context.fillStyle =
        COLORS.tree;

      context.beginPath();

      context.arc(
        x + 21,
        trunkTop,
        20,
        0,
        Math.PI * 2,
      );

      context.fill();

      context.beginPath();

      context.arc(
        x + 39,
        trunkTop + 8,
        18,
        0,
        Math.PI * 2,
      );

      context.fill();

      context.beginPath();

      context.arc(
        x + 11,
        trunkTop + 13,
        16,
        0,
        Math.PI * 2,
      );

      context.fill();
    }

    context.restore();
  }

  function drawObstacles() {
    for (const obstacle of obstacles) {
      drawObstacle(obstacle);
    }
  }

  function drawObstacle(
    obstacle: Obstacle,
  ) {
    const topHeight =
      obstacle.gapCenter -
      obstacle.gapHeight / 2;

    const bottomY =
      obstacle.gapCenter +
      obstacle.gapHeight / 2;

    if (obstacle.type === "tree") {
      drawTreeObstacle(
        obstacle,
        topHeight,
        bottomY,
      );
      return;
    }

    if (obstacle.type === "pole") {
      drawPoleObstacle(
        obstacle,
        topHeight,
        bottomY,
      );
      return;
    }

    drawRoofObstacle(
      obstacle,
      topHeight,
      bottomY,
    );
  }

  function drawTreeObstacle(
    obstacle: Obstacle,
    topHeight: number,
    bottomY: number,
  ) {
    const x =
      obstacle.x;

    const widthObstacle =
      obstacle.width;

    context.save();

    context.fillStyle =
      COLORS.trunk;

    context.fillRect(
      x +
        widthObstacle *
          0.34,
      0,
      widthObstacle *
        0.32,
      Math.max(
        0,
        topHeight - 20,
      ),
    );

    context.strokeStyle =
      COLORS.trunk;

    context.lineWidth = 9;

    context.lineCap =
      "round";

    context.beginPath();

    context.moveTo(
      x +
        widthObstacle *
          0.5,
      topHeight - 8,
    );

    context.lineTo(
      x +
        widthObstacle *
          0.25,
      Math.max(
        28,
        topHeight - 55,
      ),
    );

    context.stroke();

    context.beginPath();

    context.moveTo(
      x +
        widthObstacle *
          0.5,
      topHeight - 4,
    );

    context.lineTo(
      x +
        widthObstacle *
          0.78,
      Math.max(
        30,
        topHeight - 45,
      ),
    );

    context.stroke();

    drawLeafCluster(
      x +
        widthObstacle *
          0.18,
      Math.max(
        18,
        topHeight - 16,
      ),
      24,
    );

    drawLeafCluster(
      x +
        widthObstacle *
          0.55,
      Math.max(
        22,
        topHeight - 31,
      ),
      29,
    );

    drawLeafCluster(
      x +
        widthObstacle *
          0.88,
      Math.max(
        20,
        topHeight - 18,
      ),
      22,
    );

    const bottomTreeHeight =
      Math.max(
        0,
        height - bottomY,
      );

    context.fillStyle =
      COLORS.trunk;

    context.fillRect(
      x +
        widthObstacle *
          0.34,
      bottomY + 16,
      widthObstacle *
        0.32,
      Math.max(
        0,
        bottomTreeHeight - 16,
      ),
    );

    drawLeafCluster(
      x +
        widthObstacle *
          0.16,
      Math.min(
        height - 38,
        bottomY + 26,
      ),
      23,
    );

    drawLeafCluster(
      x +
        widthObstacle *
          0.54,
      Math.min(
        height - 31,
        bottomY + 19,
      ),
      29,
    );

    drawLeafCluster(
      x +
        widthObstacle *
          0.88,
      Math.min(
        height - 38,
        bottomY + 26,
      ),
      21,
    );

    context.restore();
  }

  function drawLeafCluster(
    x: number,
    y: number,
    radius: number,
  ) {
    context.fillStyle =
      COLORS.tree;

    context.beginPath();

    context.arc(
      x,
      y,
      radius,
      0,
      Math.PI * 2,
    );

    context.fill();

    context.fillStyle =
      COLORS.treeDark;

    context.beginPath();

    context.arc(
      x - radius * 0.5,
      y + radius * 0.18,
      radius * 0.64,
      0,
      Math.PI * 2,
    );

    context.fill();

    context.beginPath();

    context.arc(
      x + radius * 0.5,
      y + radius * 0.17,
      radius * 0.6,
      0,
      Math.PI * 2,
    );

    context.fill();
  }

  function drawPoleObstacle(
    obstacle: Obstacle,
    topHeight: number,
    bottomY: number,
  ) {
    const x =
      obstacle.x;

    const widthObstacle =
      obstacle.width;

    const poleX =
      x +
      widthObstacle *
        0.42;

    const poleWidth =
      Math.max(
        10,
        widthObstacle *
          0.16,
      );

    context.save();

    context.fillStyle =
      COLORS.poleDark;

    context.fillRect(
      poleX,
      0,
      poleWidth,
      topHeight,
    );

    context.fillStyle =
      COLORS.pole;

    context.fillRect(
      poleX + 2,
      0,
      poleWidth *
        0.42,
      topHeight,
    );

    drawCrossbar(
      x +
        widthObstacle *
          0.06,
      Math.max(
        18,
        topHeight - 30,
      ),
      widthObstacle *
        0.88,
    );

    context.fillStyle =
      COLORS.poleDark;

    context.fillRect(
      poleX,
      bottomY,
      poleWidth,
      Math.max(
        0,
        height - bottomY,
      ),
    );

    context.fillStyle =
      COLORS.pole;

    context.fillRect(
      poleX + 2,
      bottomY,
      poleWidth *
        0.42,
      Math.max(
        0,
        height - bottomY,
      ),
    );

    drawCrossbar(
      x +
        widthObstacle *
          0.06,
      Math.min(
        height - 26,
        bottomY + 28,
      ),
      widthObstacle *
        0.88,
    );

    context.strokeStyle =
      COLORS.cable;

    context.lineWidth = 2;

    context.beginPath();

    context.moveTo(
      x - width * 0.35,
      Math.max(
        22,
        topHeight - 45,
      ),
    );

    context.quadraticCurveTo(
      x +
        widthObstacle *
          0.45,
      topHeight - 25,
      x +
        width *
          0.65,
      topHeight - 47,
    );

    context.stroke();

    context.beginPath();

    context.moveTo(
      x - width * 0.27,
      Math.max(
        32,
        topHeight - 34,
      ),
    );

    context.quadraticCurveTo(
      x +
        widthObstacle *
          0.5,
      topHeight - 15,
      x +
        width *
          0.72,
      topHeight - 36,
    );

    context.stroke();

    context.restore();
  }

  function drawCrossbar(
    x: number,
    y: number,
    widthCrossbar: number,
  ) {
    context.fillStyle =
      COLORS.poleDark;

    context.fillRect(
      x,
      y,
      widthCrossbar,
      7,
    );

    context.fillStyle =
      COLORS.pole;

    context.fillRect(
      x + 2,
      y,
      Math.max(
        0,
        widthCrossbar - 4,
      ),
      3,
    );
  }

  function drawRoofObstacle(
    obstacle: Obstacle,
    topHeight: number,
    bottomY: number,
  ) {
    const x =
      obstacle.x;

    const widthObstacle =
      obstacle.width;

    const roofHeight = 43;

    context.save();

    const topRoofY =
      Math.max(
        18,
        topHeight - roofHeight,
      );

    context.fillStyle =
      COLORS.building;

    context.fillRect(
      x + 4,
      0,
      widthObstacle - 8,
      Math.max(
        0,
        topRoofY,
      ),
    );

    drawRoofCap(
      x - 5,
      topHeight - 5,
      widthObstacle + 10,
      true,
    );

    context.fillStyle =
      COLORS.building;

    context.fillRect(
      x + 4,
      bottomY + roofHeight,
      widthObstacle - 8,
      Math.max(
        0,
        height -
          (bottomY + roofHeight),
      ),
    );

    drawRoofCap(
      x - 5,
      bottomY + 3,
      widthObstacle + 10,
      false,
    );

    context.restore();
  }

  function drawRoofCap(
    x: number,
    y: number,
    widthRoof: number,
    upward: boolean,
  ) {
    context.fillStyle =
      COLORS.roofDark;

    context.beginPath();

    if (upward) {
      context.moveTo(
        x,
        y,
      );

      context.lineTo(
        x +
          widthRoof *
            0.5,
        y - 18,
      );

      context.lineTo(
        x + widthRoof,
        y,
      );
    } else {
      context.moveTo(
        x,
        y,
      );

      context.lineTo(
        x +
          widthRoof *
            0.5,
        y + 18,
      );

      context.lineTo(
        x + widthRoof,
        y,
      );
    }

    context.closePath();
    context.fill();

    context.fillStyle =
      COLORS.roof;

    context.beginPath();

    if (upward) {
      context.moveTo(
        x + 6,
        y - 1,
      );

      context.lineTo(
        x +
          widthRoof *
            0.5,
        y - 13,
      );

      context.lineTo(
        x +
          widthRoof -
          6,
        y - 1,
      );
    } else {
      context.moveTo(
        x + 6,
        y + 1,
      );

      context.lineTo(
        x +
          widthRoof *
            0.5,
        y + 13,
      );

      context.lineTo(
        x +
          widthRoof -
          6,
        y + 1,
      );
    }

    context.closePath();
    context.fill();

    context.strokeStyle =
      COLORS.roofTile;

    context.lineWidth = 2;

    const tileCount =
      Math.max(
        4,
        Math.floor(
          widthRoof / 12,
        ),
      );

    for (
      let index = 0;
      index < tileCount;
      index += 1
    ) {
      const tileX =
        x +
        5 +
        (index /
          tileCount) *
          (widthRoof - 10);

      context.beginPath();

      if (upward) {
        context.moveTo(
          tileX,
          y - 2,
        );

        context.lineTo(
          tileX + 5,
          y - 8,
        );
      } else {
        context.moveTo(
          tileX,
          y + 2,
        );

        context.lineTo(
          tileX + 5,
          y + 8,
        );
      }

      context.stroke();
    }
  }

  function drawPlayer(
    time: number,
  ) {
    context.save();

    const idleBob =
      state === "ready"
        ? Math.sin(
            time * 3.2,
          ) * 2.5
        : 0;

    context.translate(
      player.x,
      player.y + idleBob,
    );

    context.rotate(
      player.rotation,
    );

    drawGhostShadow();

    const flap =
      player.flapAnimation >
      0
        ? 1
        : Math.sin(
            time * 14,
          ) * 0.15;

    drawGhostHair();

    drawGhostHead();

    drawGhostFace();

    drawGhostBody();

    drawGhostArms(flap);

    drawGhostRibbon();

    context.restore();
  }

  function drawGhostShadow() {
    context.save();

    context.globalAlpha =
      0.15;

    context.fillStyle =
      "#000000";

    context.beginPath();

    context.ellipse(
      0,
      40,
      18,
      5,
      0,
      0,
      Math.PI * 2,
    );

    context.fill();

    context.restore();
  }

  function drawGhostHair() {
    context.fillStyle =
      COLORS.hair;

    context.beginPath();

    context.moveTo(
      -7,
      -10,
    );

    context.quadraticCurveTo(
      -19,
      8,
      -13,
      28,
    );

    context.quadraticCurveTo(
      -21,
      37,
      -13,
      47,
    );

    context.quadraticCurveTo(
      -2,
      30,
      1,
      15,
    );

    context.closePath();

    context.fill();

    context.beginPath();

    context.moveTo(
      7,
      -10,
    );

    context.quadraticCurveTo(
      19,
      8,
      15,
      29,
    );

    context.quadraticCurveTo(
      23,
      38,
      13,
      47,
    );

    context.quadraticCurveTo(
      5,
      30,
      -1,
      15,
    );

    context.closePath();

    context.fill();
  }

  function drawGhostHead() {
    context.fillStyle =
      COLORS.ghost;

    context.beginPath();

    context.ellipse(
      0,
      -12,
      13,
      16,
      0,
      0,
      Math.PI * 2,
    );

    context.fill();
  }

  function drawGhostFace() {
    context.fillStyle =
      COLORS.face;

    context.beginPath();

    context.arc(
      -4,
      -12,
      1.7,
      0,
      Math.PI * 2,
    );

    context.fill();

    context.beginPath();

    context.arc(
      4,
      -12,
      1.7,
      0,
      Math.PI * 2,
    );

    context.fill();

    context.strokeStyle =
      COLORS.mouth;

    context.lineWidth = 1.4;

    context.lineCap =
      "round";

    context.beginPath();

    context.moveTo(
      -3,
      -5,
    );

    context.quadraticCurveTo(
      0,
      -3,
      3,
      -5,
    );

    context.stroke();
  }

  function drawGhostBody() {
    context.fillStyle =
      COLORS.ghost;

    context.beginPath();

    context.moveTo(
      -11,
      0,
    );

    context.quadraticCurveTo(
      -18,
      17,
      -22,
      37,
    );

    context.quadraticCurveTo(
      -9,
      43,
      0,
      36,
    );

    context.quadraticCurveTo(
      10,
      43,
      22,
      37,
    );

    context.quadraticCurveTo(
      18,
      15,
      11,
      0,
    );

    context.closePath();

    context.fill();

    context.fillStyle =
      COLORS.ghostShadow;

    context.beginPath();

    context.moveTo(
      -2,
      2,
    );

    context.quadraticCurveTo(
      4,
      16,
      7,
      36,
    );

    context.quadraticCurveTo(
      2,
      40,
      -2,
      36,
    );

    context.closePath();

    context.fill();
  }

  function drawGhostArms(
    flap: number,
  ) {
    context.save();

    context.translate(
      -10,
      9,
    );

    context.rotate(
      -0.3 +
        flap * 0.35,
    );

    context.fillStyle =
      COLORS.ghost;

    context.beginPath();

    context.moveTo(
      0,
      0,
    );

    context.quadraticCurveTo(
      -13,
      -10,
      -20,
      -2,
    );

    context.quadraticCurveTo(
      -12,
      6,
      0,
      10,
    );

    context.closePath();

    context.fill();

    context.restore();

    context.save();

    context.translate(
      10,
      9,
    );

    context.rotate(
      0.3 -
        flap * 0.35,
    );

    context.fillStyle =
      COLORS.ghost;

    context.beginPath();

    context.moveTo(
      0,
      0,
    );

    context.quadraticCurveTo(
      13,
      -10,
      20,
      -2,
    );

    context.quadraticCurveTo(
      12,
      6,
      0,
      10,
    );

    context.closePath();

    context.fill();

    context.restore();
  }

  function drawGhostRibbon() {
    context.fillStyle =
      COLORS.mouth;

    context.fillRect(
      -2,
      1,
      4,
      13,
    );
  }

  function drawGround() {
    const groundY =
      getGroundY();

    context.save();

    context.fillStyle =
      COLORS.ground;

    context.fillRect(
      0,
      groundY,
      width,
      height -
        groundY,
    );

    context.fillStyle =
      COLORS.groundLine;

    context.fillRect(
      0,
      groundY,
      width,
      3,
    );

    const offset =
      -(
        foregroundOffset %
        48
      );

    for (
      let index = 0;
      index < 12;
      index += 1
    ) {
      const x =
        index * 48 +
        offset;

      context.fillStyle =
        "#20252a";

      context.fillRect(
        x,
        groundY + 18,
        20,
        3,
      );
    }

    context.restore();
  }

  function drawCrashOverlay() {
    context.save();

    context.globalAlpha =
      0.08 +
      Math.max(
        0,
        Math.sin(
          worldTime * 30,
        ),
      ) *
        0.04;

    context.fillStyle =
      COLORS.danger;

    context.fillRect(
      0,
      0,
      width,
      height,
    );

    context.restore();
  }

  function loop(
    timestamp: number,
  ) {
    if (destroyed) {
      return;
    }

    if (!lastTime) {
      lastTime = timestamp;
    }

    const delta = Math.min(
      0.032,
      Math.max(
        0,
        (timestamp -
          lastTime) /
          1000,
      ),
    );

    lastTime = timestamp;

    if (
      state !== "paused" &&
      state !== "gameover"
    ) {
      update(delta);
    }

    draw(
      timestamp / 1000,
    );

    animationFrame =
      requestAnimationFrame(
        loop,
      );
  }

  function clamp(
    value: number,
    minimum: number,
    maximum: number,
  ): number {
    return Math.min(
      maximum,
      Math.max(
        minimum,
        value,
      ),
    );
  }

  function seededRandom(
    seed: number,
  ): number {
    const value =
      Math.sin(
        seed * 12.9898,
      ) *
      43758.5453;

    return (
      value -
      Math.floor(value)
    );
  }

  function preventContextMenu(
    event: Event,
  ) {
    event.preventDefault();
  }

  const resizeObserver =
    new ResizeObserver(
      scheduleResize,
    );

  resizeObserver.observe(game);

  window.addEventListener(
    "resize",
    scheduleResize,
    {
      passive: true,
    },
  );

  document.addEventListener(
    "visibilitychange",
    handleVisibility,
  );

  window.addEventListener(
    "blur",
    handleBlur,
  );

  canvas.addEventListener(
    "pointerdown",
    handleGamePointerDown,
    {
      passive: false,
    },
  );

  canvas.addEventListener(
    "contextmenu",
    preventContextMenu,
  );

  actionButton.addEventListener(
    "click",
    handleActionClick,
  );

  pauseButton.addEventListener(
    "click",
    handlePauseClick,
  );

  resize();

  resetGame(false);

  setState("ready");

  animationFrame =
    requestAnimationFrame(
      loop,
    );

  return () => {
    destroyed = true;

    cancelAnimationFrame(
      animationFrame,
    );

    if (resizeFrame) {
      cancelAnimationFrame(
        resizeFrame,
      );
    }

    resizeObserver.disconnect();

    window.removeEventListener(
      "resize",
      scheduleResize,
    );

    document.removeEventListener(
      "visibilitychange",
      handleVisibility,
    );

    window.removeEventListener(
      "blur",
      handleBlur,
    );

    canvas.removeEventListener(
      "pointerdown",
      handleGamePointerDown,
    );

    canvas.removeEventListener(
      "contextmenu",
      preventContextMenu,
    );

    actionButton.removeEventListener(
      "click",
      handleActionClick,
    );

    pauseButton.removeEventListener(
      "click",
      handlePauseClick,
    );
  };
}

/* ========================================================================
   MOBILE-FIRST GAME STYLES
   ======================================================================== */

const gameStyle = document.createElement(
  "style",
);

gameStyle.textContent = `
  .kj-game {
    position: relative;

    width: 100%;
    height: min(78dvh, 760px);
    min-height: 520px;
    max-width: 480px;

    margin: 0 auto;

    overflow: hidden;

    background: #080a0d;
    border: 1px solid #282c30;

    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;

    touch-action: none;
    overscroll-behavior: contain;

    isolation: isolate;
  }

  .kj-canvas {
    position: absolute;
    inset: 0;

    display: block;

    width: 100%;
    height: 100%;

    touch-action: none;
  }

  .kj-hud {
    position: absolute;
    z-index: 5;

    top: max(
      12px,
      env(safe-area-inset-top)
    );

    right: 12px;
    left: 12px;

    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .kj-right-hud {
    display: flex;
    align-items: flex-start;
    gap: 9px;
  }

  .kj-score-block {
    display: grid;
    gap: 3px;
  }

  .kj-score-block span {
    color: #858078;

    font-family:
      ui-monospace,
      SFMono-Regular,
      Menlo,
      Monaco,
      Consolas,
      monospace;

    font-size: 7px;
    font-weight: 800;
    letter-spacing: .14em;
  }

  .kj-score-block strong {
    color: #f0eadc;

    font-family:
      ui-monospace,
      SFMono-Regular,
      Menlo,
      Monaco,
      Consolas,
      monospace;

    font-size: 22px;
    font-weight: 900;
    line-height: 1;

    letter-spacing: -.06em;
  }

  .kj-pause {
    appearance: none;

    width: 42px;
    height: 42px;

    display: grid;
    place-items: center;

    padding: 0;

    border: 1px solid #40454a;
    background: #111519;

    color: #eee9dc;

    cursor: pointer;

    font-family:
      ui-monospace,
      SFMono-Regular,
      Menlo,
      Monaco,
      Consolas,
      monospace;

    font-size: 10px;
    font-weight: 900;

    touch-action: manipulation;
  }

  .kj-pause:active {
    transform: translateY(1px);
  }

  .kj-pause.is-hidden {
    display: none;
  }

  .kj-overlay {
    position: absolute;
    z-index: 10;

    inset: 0;

    display: grid;
    place-items: center;

    padding:
      20px
      20px
      calc(
        20px +
        env(safe-area-inset-bottom)
      );

    background: rgba(
      8,
      10,
      13,
      .43
    );

    transition:
      opacity 140ms ease,
      visibility 140ms ease;
  }

  .kj-overlay.is-hidden {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }

  .kj-overlay-card {
    width: min(
      100%,
      350px
    );

    padding: 23px 18px 18px;

    background: #111519;
    border: 1px solid #343a3f;

    text-align: center;

    box-shadow:
      0 18px 40px
      rgba(
        0,
        0,
        0,
        .32
      );
  }

  .kj-kicker {
    margin-bottom: 9px;

    color: #d5b15e;

    font-family:
      ui-monospace,
      SFMono-Regular,
      Menlo,
      Monaco,
      Consolas,
      monospace;

    font-size: 7px;
    font-weight: 900;
    letter-spacing: .14em;
  }

  .kj-overlay-card h2 {
    margin: 0;

    color: #eee9dc;

    font-size:
      clamp(
        31px,
        9vw,
        44px
      );

    font-weight: 950;
    line-height: .9;

    letter-spacing: -.07em;
  }

  .kj-overlay-card > p {
    margin: 13px 0 18px;

    color: #928e85;

    font-family:
      ui-monospace,
      SFMono-Regular,
      Menlo,
      Monaco,
      Consolas,
      monospace;

    font-size: 10px;
    line-height: 1.6;
  }

  .kj-final-score {
    display: grid;
    grid-template-columns: repeat(2, 1fr);

    margin: 16px 0;

    border-top: 1px solid #2c3135;
    border-bottom: 1px solid #2c3135;
  }

  .kj-final-score > div {
    display: grid;
    gap: 4px;

    padding: 13px 8px;
  }

  .kj-final-score > div + div {
    border-left: 1px solid #2c3135;
  }

  .kj-final-score span {
    color: #716e67;

    font-family:
      ui-monospace,
      SFMono-Regular,
      Menlo,
      Monaco,
      Consolas,
      monospace;

    font-size: 6px;
    font-weight: 800;
    letter-spacing: .14em;
  }

  .kj-final-score strong {
    color: #eee9dc;

    font-family:
      ui-monospace,
      SFMono-Regular,
      Menlo,
      Monaco,
      Consolas,
      monospace;

    font-size: 22px;
    font-weight: 900;
  }

  .kj-main-button {
    appearance: none;

    width: 100%;
    min-height: 52px;

    border: 1px solid #e8bf68;
    background: #e8bf68;
    color: #12100c;

    cursor: pointer;

    font-family:
      ui-monospace,
      SFMono-Regular,
      Menlo,
      Monaco,
      Consolas,
      monospace;

    font-size: 10px;
    font-weight: 900;
    letter-spacing: .08em;

    touch-action: manipulation;
  }

  .kj-main-button:active {
    transform: translateY(1px);
  }

  .kj-main-button.is-secondary {
    background: #1b2024;
    border-color: #454b50;
    color: #eee9dc;
  }

  .kj-hint {
    margin-top: 11px;

    color: #66645e;

    font-family:
      ui-monospace,
      SFMono-Regular,
      Menlo,
      Monaco,
      Consolas,
      monospace;

    font-size: 6px;
    font-weight: 800;
    letter-spacing: .12em;
  }

  .kj-touch-hint {
    position: absolute;
    z-index: 4;

    left: 50%;
    bottom:
      calc(
        28px +
        env(safe-area-inset-bottom)
      );

    display: flex;
    align-items: center;
    gap: 8px;

    transform: translateX(-50%);

    padding: 7px 10px;

    border: 1px solid #2e3439;
    background: rgba(
      9,
      12,
      15,
      .74
    );

    color: #86827a;

    font-family:
      ui-monospace,
      SFMono-Regular,
      Menlo,
      Monaco,
      Consolas,
      monospace;

    font-size: 6px;
    font-weight: 800;
    letter-spacing: .12em;

    pointer-events: none;
  }

  .kj-touch-hint b {
    color: #e8bf68;
    font-size: 12px;
  }

  .kj-touch-hint.is-hidden {
    display: none;
  }

  .kj-bottom-label {
    position: absolute;
    z-index: 4;

    right: 50%;
    bottom:
      calc(
        9px +
        env(safe-area-inset-bottom)
      );

    transform: translateX(50%);

    display: flex;
    align-items: center;
    gap: 6px;

    white-space: nowrap;

    color: #4c4b47;

    font-family:
      ui-monospace,
      SFMono-Regular,
      Menlo,
      Monaco,
      Consolas,
      monospace;

    font-size: 5px;
    font-weight: 800;
    letter-spacing: .13em;

    pointer-events: none;
  }

  .kj-bottom-label i {
    font-style: normal;
    color: #30302d;
  }

  @media (max-height: 640px) {
    .kj-game {
      height: 70dvh;
      min-height: 480px;
    }

    .kj-overlay-card {
      padding: 20px 16px 16px;
    }

    .kj-overlay-card > p {
      margin: 9px 0 13px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .kj-overlay {
      transition: none;
    }
  }
`;

export function attachKuntilanakStyles() {
  if (
    document.head.querySelector(
      "[data-kuntilanak-style]",
    )
  ) {
    return;
  }

  gameStyle.dataset.kuntilanakStyle =
    "true";

  document.head.appendChild(
    gameStyle,
  );
}

attachKuntilanakStyles();