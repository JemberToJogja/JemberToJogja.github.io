// src/games/ram-clash.ts

type Cleanup = () => void;

type Vec2 = {
  x: number;
  y: number;
};

type Particle = {
  pos: Vec2;
  vel: Vec2;
  life: number;
  maxLife: number;
  size: number;
  color: string;
};

type GrassBlade = {
  x: number;
  y: number;
  h: number;
  lean: number;
};

type Ram = {
  id: "player" | "ai";
  pos: Vec2;
  vel: Vec2;

  radius: number;
  mass: number;
  grip: number;

  bodyAngle: number;
  headAngle: number;

  balance: number;
  stamina: number;

  charge: number;
  charging: boolean;
  chargeTime: number;

  attackPower: number;
  attackTimer: number;

  hitCooldown: number;
  stunTimer: number;

  recoveryWindow: number;
  recoveryUsed: boolean;

  lean: number;
  outTimer: number;

  fallen: boolean;
  eliminated: boolean;

  aiNextAction: number;
  aiChargeTarget: number;
  aiCharging: boolean;
  aiAggression: number;

  perfectHits: number;
  hits: number;
  wins: number;
};

type GamePhase =
  | "idle"
  | "countdown"
  | "playing"
  | "round-result"
  | "match-result";

type GameState = {
  phase: GamePhase;

  round: number;
  playerWins: number;
  aiWins: number;

  score: number;
  bestScore: number;

  roundTime: number;
  maxRoundTime: number;

  countdown: number;
  countdownTimer: number;

  player: Ram;
  ai: Ram;

  particles: Particle[];
  grass: GrassBlade[];

  cameraShake: number;
  impactFlash: number;

  perfectTimer: number;
  perfectText: string;

  lastHit: string;
  lastHitTimer: number;

  matchPerfects: number;
  matchHits: number;

  pointerDown: boolean;
  pointerActive: boolean;
  pointer: Vec2;
  aimAngle: number;

  audioReady: boolean;
  audioContext: AudioContext | null;

  destroyed: boolean;
};

const STORAGE_KEY = "jembertojogja-ram-clash-best";

const COLORS = {
  bg: "#080909",
  arena: "#1d3820",
  arenaInner: "#274c2b",
  arenaLine: "#587c4f",
  player: "#f1eee4",
  playerShadow: "#bdb9ad",
  enemy: "#d9d5cb",
  enemyShadow: "#aaa69d",
  horn: "#b9a47b",
  eye: "#111111",
  lime: "#caff32",
  red: "#ff6268",
  yellow: "#ffd35c",
  blue: "#7cb2ff",
  white: "#f6f5ee",
  muted: "#94948c",
  dark: "#111211",
};

function clamp(
  value: number,
  min: number,
  max: number,
): number {
  return Math.max(min, Math.min(max, value));
}

function lerp(
  a: number,
  b: number,
  t: number,
): number {
  return a + (b - a) * t;
}

function distance(
  a: Vec2,
  b: Vec2,
): number {
  return Math.hypot(
    b.x - a.x,
    b.y - a.y,
  );
}

function normalize(v: Vec2): Vec2 {
  const length = Math.hypot(v.x, v.y);

  if (length <= 0.0001) {
    return { x: 0, y: 0 };
  }

  return {
    x: v.x / length,
    y: v.y / length,
  };
}

function add(
  a: Vec2,
  b: Vec2,
): Vec2 {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  };
}

function sub(
  a: Vec2,
  b: Vec2,
): Vec2 {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  };
}

function mul(
  a: Vec2,
  scalar: number,
): Vec2 {
  return {
    x: a.x * scalar,
    y: a.y * scalar,
  };
}

function dot(
  a: Vec2,
  b: Vec2,
): number {
  return a.x * b.x + a.y * b.y;
}

function cross(
  a: Vec2,
  b: Vec2,
): number {
  return a.x * b.y - a.y * b.x;
}

function angleOf(v: Vec2): number {
  return Math.atan2(v.y, v.x);
}

function angleDiff(
  a: number,
  b: number,
): number {
  let d = a - b;

  while (d > Math.PI) {
    d -= Math.PI * 2;
  }

  while (d < -Math.PI) {
    d += Math.PI * 2;
  }

  return d;
}

function random(
  min: number,
  max: number,
): number {
  return Math.random() * (max - min) + min;
}

function getBestScore(): number {
  if (typeof window === "undefined") {
    return 0;
  }

  try {
    return Number(
      window.localStorage.getItem(
        STORAGE_KEY,
      ) || 0,
    );
  } catch {
    return 0;
  }
}

function saveBestScore(
  value: number,
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      String(value),
    );
  } catch {
    // Ignore localStorage errors.
  }
}

function createRam(
  id: "player" | "ai",
  pos: Vec2,
  arenaRadius: number,
  difficulty: number,
): Ram {
  const facing =
    id === "player"
      ? 0
      : Math.PI;

  return {
    id,
    pos: { ...pos },
    vel: { x: 0, y: 0 },

    radius: 25,
    mass: id === "player" ? 1 : 1.03,
    grip: id === "player" ? 0.91 : 0.89,

    bodyAngle: facing,
    headAngle: facing,

    balance: 100,
    stamina: 100,

    charge: 0,
    charging: false,
    chargeTime: 0,

    attackPower: 0,
    attackTimer: 0,

    hitCooldown: 0,
    stunTimer: 0,

    recoveryWindow: 0,
    recoveryUsed: false,

    lean: 0,
    outTimer: 0,

    fallen: false,
    eliminated: false,

    aiNextAction: random(1.3, 2.3),
    aiChargeTarget: 0.95,
    aiCharging: false,
    aiAggression:
      id === "ai"
        ? clamp(
            0.46 +
              difficulty * 0.12,
            0.46,
            0.82,
          )
        : 0,

    perfectHits: 0,
    hits: 0,
    wins: 0,
  };
}

function createStyles(): string {
  return `
    .ram-clash {
      --bg: #080909;
      --panel: #111211;
      --panel-2: #151715;
      --line: #292d29;
      --line-strong: #3c453c;
      --text: #f6f5ee;
      --muted: #94948c;
      --lime: #caff32;
      --red: #ff6268;
      --yellow: #ffd35c;

      width: 100%;
      max-width: 980px;
      margin: 0 auto;
      color: var(--text);
      font-family: inherit;
      user-select: none;
      -webkit-user-select: none;
      -webkit-tap-highlight-color: transparent;
    }

    .ram-clash *,
    .ram-clash *::before,
    .ram-clash *::after {
      box-sizing: border-box;
    }

    .ram-clash__shell {
      position: relative;
      overflow: hidden;
      border: 1px solid var(--line);
      background: var(--bg);
    }

    .ram-clash__header {
      position: relative;
      z-index: 2;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 18px;
      padding: 18px;
      border-bottom: 1px solid var(--line);
    }

    .ram-clash__eyebrow {
      margin-bottom: 6px;
      color: var(--muted);
      font-size: 9px;
      font-weight: 900;
      letter-spacing: .18em;
    }

    .ram-clash__title {
      margin: 0;
      font-size: clamp(36px, 8vw, 70px);
      line-height: .84;
      letter-spacing: -.07em;
      font-weight: 950;
    }

    .ram-clash__title span {
      color: var(--lime);
    }

    .ram-clash__subtitle {
      max-width: 600px;
      margin: 13px 0 0;
      color: #b7b7b0;
      font-size: 10px;
      line-height: 1.65;
      text-transform: uppercase;
      letter-spacing: .055em;
    }

    .ram-clash__top-stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(70px, 1fr));
      align-self: start;
      border: 1px solid var(--line);
      background: var(--panel);
    }

    .ram-clash__top-stat {
      padding: 12px;
      border-right: 1px solid var(--line);
    }

    .ram-clash__top-stat:last-child {
      border-right: 0;
    }

    .ram-clash__top-label {
      margin-bottom: 5px;
      color: var(--muted);
      font-size: 8px;
      font-weight: 900;
      letter-spacing: .14em;
    }

    .ram-clash__top-value {
      font-size: 17px;
      line-height: 1;
      font-weight: 950;
    }

    .ram-clash__body {
      position: relative;
      z-index: 2;
      padding: 12px;
    }

    .ram-clash__hud {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 8px;
      margin-bottom: 8px;
    }

    .ram-clash__panel {
      border: 1px solid var(--line);
      background: var(--panel);
      padding: 12px;
    }

    .ram-clash__fighter-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 9px;
    }

    .ram-clash__fighter-name {
      font-size: 10px;
      font-weight: 950;
      letter-spacing: .14em;
    }

    .ram-clash__fighter-state {
      color: var(--muted);
      font-size: 8px;
      font-weight: 900;
      letter-spacing: .12em;
    }

    .ram-clash__meters {
      display: grid;
      gap: 7px;
    }

    .ram-clash__meter {
      display: grid;
      grid-template-columns: 54px 1fr 34px;
      align-items: center;
      gap: 8px;
    }

    .ram-clash__meter-label,
    .ram-clash__meter-value {
      color: var(--muted);
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 7px;
      font-weight: 900;
    }

    .ram-clash__meter-value {
      color: var(--text);
      text-align: right;
    }

    .ram-clash__meter-track {
      position: relative;
      height: 5px;
      overflow: hidden;
      background: #202320;
    }

    .ram-clash__meter-fill {
      width: 50%;
      height: 100%;
      background: var(--lime);
      transition: width .12s linear;
    }

    .ram-clash__meter-fill--stamina {
      background: #ededdd;
    }

    .ram-clash__meter-fill--balance-ai {
      background: var(--red);
    }

    .ram-clash__round {
      min-width: 86px;
      display: grid;
      place-items: center;
      border: 1px solid var(--line);
      background: #101210;
      padding: 12px;
      text-align: center;
    }

    .ram-clash__round-label {
      color: var(--muted);
      font-size: 8px;
      font-weight: 900;
      letter-spacing: .15em;
    }

    .ram-clash__round-value {
      margin-top: 5px;
      color: var(--lime);
      font-size: 22px;
      line-height: 1;
      font-weight: 950;
    }

    .ram-clash__round-score {
      margin-top: 6px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 8px;
      color: #a8aaa2;
    }

    .ram-clash__arena-wrap {
      position: relative;
      overflow: hidden;
      border: 1px solid var(--line);
      background: #0e130e;
    }

    .ram-clash__canvas {
      display: block;
      width: 100%;
      height: min(72vw, 620px);
      min-height: 390px;
      touch-action: none;
      cursor: crosshair;
    }

    .ram-clash__hint {
      position: absolute;
      left: 14px;
      bottom: 14px;
      z-index: 4;
      padding: 8px 10px;
      border: 1px solid rgba(255,255,255,.12);
      background: rgba(9,10,9,.76);
      color: #b8b9b0;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 8px;
      font-weight: 800;
      letter-spacing: .06em;
      pointer-events: none;
    }

    .ram-clash__charge {
      position: absolute;
      left: 50%;
      bottom: 14px;
      z-index: 5;
      width: min(420px, calc(100% - 28px));
      transform: translateX(-50%);
      opacity: 0;
      pointer-events: none;
      transition: opacity .15s ease;
    }

    .ram-clash__charge.is-visible {
      opacity: 1;
    }

    .ram-clash__charge-label {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      color: #deded3;
      font-size: 8px;
      font-weight: 950;
      letter-spacing: .13em;
    }

    .ram-clash__charge-track {
      height: 7px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,.14);
      background: rgba(0,0,0,.42);
    }

    .ram-clash__charge-fill {
      width: 0%;
      height: 100%;
      background: var(--lime);
      transition: width .06s linear;
    }

    .ram-clash__flash {
      position: absolute;
      inset: 0;
      z-index: 3;
      opacity: 0;
      pointer-events: none;
      transition: opacity .12s ease;
    }

    .ram-clash__flash.is-hit {
      background: rgba(255,255,255,.08);
      opacity: 1;
    }

    .ram-clash__flash.is-perfect {
      background: rgba(202,255,50,.12);
      opacity: 1;
    }

    .ram-clash__overlay {
      position: absolute;
      inset: 0;
      z-index: 20;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: rgba(8,9,8,.9);
      pointer-events: none;
      opacity: 0;
      transition: opacity .18s ease;
    }

    .ram-clash__overlay.is-visible {
      opacity: 1;
      pointer-events: auto;
    }

    .ram-clash__overlay-box {
      width: min(100%, 520px);
      padding: 26px 20px;
      border: 1px solid #3d433d;
      background: #111311;
      box-shadow: 16px 16px 0 rgba(0,0,0,.22);
      text-align: center;
    }

    .ram-clash__overlay-kicker {
      color: var(--lime);
      font-size: 9px;
      font-weight: 950;
      letter-spacing: .18em;
    }

    .ram-clash__overlay-title {
      margin: 10px 0 0;
      font-size: clamp(42px, 10vw, 80px);
      line-height: .82;
      letter-spacing: -.07em;
      font-weight: 950;
    }

    .ram-clash__overlay-copy {
      max-width: 390px;
      margin: 14px auto 0;
      color: var(--muted);
      font-size: 10px;
      line-height: 1.7;
      text-transform: uppercase;
      letter-spacing: .045em;
    }

    .ram-clash__result-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      margin-top: 20px;
      border-top: 1px solid var(--line);
      border-bottom: 1px solid var(--line);
    }

    .ram-clash__result-stat {
      padding: 12px 8px;
      border-right: 1px solid var(--line);
    }

    .ram-clash__result-stat:last-child {
      border-right: 0;
    }

    .ram-clash__result-label {
      margin-bottom: 5px;
      color: var(--muted);
      font-size: 7px;
      font-weight: 900;
      letter-spacing: .1em;
    }

    .ram-clash__result-value {
      font-size: 18px;
      font-weight: 950;
    }

    .ram-clash__result-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-top: 18px;
    }

    .ram-clash__button {
      min-height: 60px;
      padding: 0 18px;
      border: 1px solid var(--line-strong);
      background: #171a17;
      color: var(--text);
      font: inherit;
      font-size: 9px;
      font-weight: 950;
      letter-spacing: .13em;
      cursor: pointer;
      transition:
        transform .15s ease,
        background .15s ease,
        border-color .15s ease;
    }

    .ram-clash__button:hover {
      transform: translateY(-2px);
      border-color: #5a655a;
      background: #1d211d;
    }

    .ram-clash__button:active {
      transform: translateY(0);
    }

    .ram-clash__button--primary {
      color: #071006;
      border-color: var(--lime);
      background: var(--lime);
    }

    .ram-clash__button--primary:hover {
      border-color: var(--lime);
      background: #d8ff69;
    }

    .ram-clash__footer {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 8px;
      margin-top: 8px;
    }

    .ram-clash__log {
      min-height: 62px;
      display: flex;
      align-items: center;
      padding: 12px 14px;
      border: 1px solid var(--line);
      background: var(--panel);
      color: #aaaBA4;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 9px;
      line-height: 1.55;
    }

    .ram-clash__log strong {
      color: var(--lime);
    }

    .ram-clash__legend {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-top: 8px;
    }

    .ram-clash__legend-item {
      padding: 12px;
      border: 1px solid var(--line);
      background: var(--panel);
    }

    .ram-clash__legend-number {
      margin-bottom: 6px;
      color: var(--lime);
      font-size: 8px;
      font-weight: 950;
      letter-spacing: .14em;
    }

    .ram-clash__legend-title {
      margin-bottom: 4px;
      font-size: 10px;
      font-weight: 900;
    }

    .ram-clash__legend-copy {
      margin: 0;
      color: var(--muted);
      font-size: 8px;
      line-height: 1.6;
    }

    @media (max-width: 760px) {
      .ram-clash__header {
        grid-template-columns: 1fr;
      }

      .ram-clash__hud {
        grid-template-columns: 1fr 72px 1fr;
      }

      .ram-clash__panel {
        padding: 10px;
      }

      .ram-clash__meter {
        grid-template-columns: 42px 1fr 26px;
        gap: 5px;
      }

      .ram-clash__fighter-state {
        display: none;
      }

      .ram-clash__canvas {
        height: 112vw;
        max-height: 680px;
        min-height: 410px;
      }

      .ram-clash__footer {
        grid-template-columns: 1fr 1fr;
      }

      .ram-clash__log {
        grid-column: 1 / -1;
      }

      .ram-clash__legend {
        grid-template-columns: 1fr 1fr;
      }

      .ram-clash__result-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .ram-clash__result-stat:nth-child(1),
      .ram-clash__result-stat:nth-child(2) {
        border-bottom: 1px solid var(--line);
      }

      .ram-clash__result-stat:nth-child(2) {
        border-right: 0;
      }

      .ram-clash__result-stat:nth-child(4) {
        border-right: 0;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .ram-clash__button,
      .ram-clash__charge,
      .ram-clash__flash,
      .ram-clash__overlay {
        transition: none !important;
      }
    }
  `;
}

export function mountGame(
  root: HTMLElement,
): Cleanup {
  root.innerHTML = `
    <section class="ram-clash" data-ram-clash>
      <style>${createStyles()}</style>

      <div class="ram-clash__shell">
        <header class="ram-clash__header">
          <div>
            <div class="ram-clash__eyebrow">
              JEMBERTOJOGJA / PHYSICS GAME
            </div>

            <h2 class="ram-clash__title">
              RAM <span>CLASH</span>
            </h2>

            <p class="ram-clash__subtitle">
              Read. Charge. Impact. One thumb. Real momentum. No health bar.
            </p>
          </div>

          <div class="ram-clash__top-stats">
            <div class="ram-clash__top-stat">
              <div class="ram-clash__top-label">
                SCORE
              </div>

              <div class="ram-clash__top-value" data-score>
                0
              </div>
            </div>

            <div class="ram-clash__top-stat">
              <div class="ram-clash__top-label">
                BEST
              </div>

              <div class="ram-clash__top-value" data-best>
                0
              </div>
            </div>

            <div class="ram-clash__top-stat">
              <div class="ram-clash__top-label">
                PERFECT
              </div>

              <div class="ram-clash__top-value" data-perfect>
                0
              </div>
            </div>
          </div>
        </header>

        <div class="ram-clash__body">
          <div class="ram-clash__hud">
            <div class="ram-clash__panel">
              <div class="ram-clash__fighter-head">
                <div class="ram-clash__fighter-name">
                  YOU
                </div>

                <div class="ram-clash__fighter-state" data-player-state>
                  READY
                </div>
              </div>

              <div class="ram-clash__meters">
                <div class="ram-clash__meter">
                  <div class="ram-clash__meter-label">
                    BALANCE
                  </div>

                  <div class="ram-clash__meter-track">
                    <div
                      class="ram-clash__meter-fill"
                      data-player-balance-bar
                    ></div>
                  </div>

                  <div
                    class="ram-clash__meter-value"
                    data-player-balance
                  >
                    100
                  </div>
                </div>

                <div class="ram-clash__meter">
                  <div class="ram-clash__meter-label">
                    STAMINA
                  </div>

                  <div class="ram-clash__meter-track">
                    <div
                      class="ram-clash__meter-fill ram-clash__meter-fill--stamina"
                      data-player-stamina-bar
                    ></div>
                  </div>

                  <div
                    class="ram-clash__meter-value"
                    data-player-stamina
                  >
                    100
                  </div>
                </div>
              </div>
            </div>

            <div class="ram-clash__round">
              <div class="ram-clash__round-label">
                ROUND
              </div>

              <div class="ram-clash__round-value" data-round>
                1 / 3
              </div>

              <div class="ram-clash__round-score" data-round-score>
                YOU 0 — 0 CPU
              </div>
            </div>

            <div class="ram-clash__panel">
              <div class="ram-clash__fighter-head">
                <div class="ram-clash__fighter-name">
                  CPU
                </div>

                <div class="ram-clash__fighter-state" data-ai-state>
                  READY
                </div>
              </div>

              <div class="ram-clash__meters">
                <div class="ram-clash__meter">
                  <div class="ram-clash__meter-label">
                    BALANCE
                  </div>

                  <div class="ram-clash__meter-track">
                    <div
                      class="ram-clash__meter-fill ram-clash__meter-fill--balance-ai"
                      data-ai-balance-bar
                    ></div>
                  </div>

                  <div
                    class="ram-clash__meter-value"
                    data-ai-balance
                  >
                    100
                  </div>
                </div>

                <div class="ram-clash__meter">
                  <div class="ram-clash__meter-label">
                    STAMINA
                  </div>

                  <div class="ram-clash__meter-track">
                    <div
                      class="ram-clash__meter-fill ram-clash__meter-fill--stamina"
                      data-ai-stamina-bar
                    ></div>
                  </div>

                  <div
                    class="ram-clash__meter-value"
                    data-ai-stamina
                  >
                    100
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="ram-clash__arena-wrap">
            <canvas class="ram-clash__canvas"></canvas>

            <div class="ram-clash__hint" data-hint>
              HOLD + DRAG TO AIM / RELEASE TO CHARGE
            </div>

            <div
              class="ram-clash__charge"
              data-charge
            >
              <div class="ram-clash__charge-label">
                <span>CHARGE</span>
                <span data-charge-value>0%</span>
              </div>

              <div class="ram-clash__charge-track">
                <div
                  class="ram-clash__charge-fill"
                  data-charge-fill
                ></div>
              </div>
            </div>

            <div
              class="ram-clash__flash"
              data-flash
            ></div>

            <div
              class="ram-clash__overlay is-visible"
              data-overlay
            >
              <div class="ram-clash__overlay-box">
                <div class="ram-clash__overlay-kicker">
                  ONE THUMB / REAL PHYSICS
                </div>

                <h3
                  class="ram-clash__overlay-title"
                  data-overlay-title
                >
                  RAM CLASH
                </h3>

                <p
                  class="ram-clash__overlay-copy"
                  data-overlay-copy
                >
                  Hold anywhere on the arena, drag to aim,
                  then release. Win by breaking your opponent's
                  balance or pushing them out.
                </p>

                <div class="ram-clash__result-grid">
                  <div class="ram-clash__result-stat">
                    <div class="ram-clash__result-label">
                      ROUND
                    </div>

                    <div
                      class="ram-clash__result-value"
                      data-result-round
                    >
                      1 / 3
                    </div>
                  </div>

                  <div class="ram-clash__result-stat">
                    <div class="ram-clash__result-label">
                      SCORE
                    </div>

                    <div
                      class="ram-clash__result-value"
                      data-result-score
                    >
                      0
                    </div>
                  </div>

                  <div class="ram-clash__result-stat">
                    <div class="ram-clash__result-label">
                      PERFECT
                    </div>

                    <div
                      class="ram-clash__result-value"
                      data-result-perfect
                    >
                      0
                    </div>
                  </div>

                  <div class="ram-clash__result-stat">
                    <div class="ram-clash__result-label">
                      BEST
                    </div>

                    <div
                      class="ram-clash__result-value"
                      data-result-best
                    >
                      0
                    </div>
                  </div>
                </div>

                <div class="ram-clash__result-actions">
                  <button
                    type="button"
                    class="ram-clash__button ram-clash__button--primary"
                    data-primary
                  >
                    PLAY
                  </button>

                  <button
                    type="button"
                    class="ram-clash__button"
                    data-reset
                  >
                    RESET
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="ram-clash__footer">
            <div class="ram-clash__log" data-log>
              <strong>&gt;_ SYSTEM</strong>
              &nbsp; hold + drag + release.
            </div>

            <button
              type="button"
              class="ram-clash__button"
              data-sound
            >
              SOUND ON
            </button>

            <button
              type="button"
              class="ram-clash__button"
              data-abort
            >
              RESET
            </button>
          </div>

          <div class="ram-clash__legend">
            <article class="ram-clash__legend-item">
              <div class="ram-clash__legend-number">
                01 / CHARGE
              </div>

              <div class="ram-clash__legend-title">
                HOLD
              </div>

              <p class="ram-clash__legend-copy">
                Longer charge creates more momentum,
                but consumes stamina.
              </p>
            </article>

            <article class="ram-clash__legend-item">
              <div class="ram-clash__legend-number">
                02 / AIM
              </div>

              <div class="ram-clash__legend-title">
                DRAG
              </div>

              <p class="ram-clash__legend-copy">
                Point the head where you want the impact.
              </p>
            </article>

            <article class="ram-clash__legend-item">
              <div class="ram-clash__legend-number">
                03 / IMPACT
              </div>

              <div class="ram-clash__legend-title">
                PERFECT
              </div>

              <p class="ram-clash__legend-copy">
                High power plus precise head alignment
                creates a perfect impact.
              </p>
            </article>

            <article class="ram-clash__legend-item">
              <div class="ram-clash__legend-number">
                04 / RECOVER
              </div>

              <div class="ram-clash__legend-title">
                SAVE YOURSELF
              </div>

              <p class="ram-clash__legend-copy">
                When balance is critical, drag against
                the fall to recover.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  `;

  const canvas = root.querySelector(
    ".ram-clash__canvas",
  ) as HTMLCanvasElement | null;

  const ctx = canvas?.getContext("2d");

  if (!canvas || !ctx) {
    return () => {};
  }

  const rootEl = root.querySelector(
    "[data-ram-clash]",
  ) as HTMLElement;

  const arenaWrap = root.querySelector(
    ".ram-clash__arena-wrap",
  ) as HTMLElement;

  const overlay = root.querySelector(
    "[data-overlay]",
  ) as HTMLElement;

  const overlayTitle = root.querySelector(
    "[data-overlay-title]",
  ) as HTMLElement;

  const overlayCopy = root.querySelector(
    "[data-overlay-copy]",
  ) as HTMLElement;

  const resultRound = root.querySelector(
    "[data-result-round]",
  ) as HTMLElement;

  const resultScore = root.querySelector(
    "[data-result-score]",
  ) as HTMLElement;

  const resultPerfect = root.querySelector(
    "[data-result-perfect]",
  ) as HTMLElement;

  const resultBest = root.querySelector(
    "[data-result-best]",
  ) as HTMLElement;

  const primaryButton = root.querySelector(
    "[data-primary]",
  ) as HTMLButtonElement;

  const resetButton = root.querySelector(
    "[data-reset]",
  ) as HTMLButtonElement;

  const soundButton = root.querySelector(
    "[data-sound]",
  ) as HTMLButtonElement;

  const abortButton = root.querySelector(
    "[data-abort]",
  ) as HTMLButtonElement;

  const scoreEl = root.querySelector(
    "[data-score]",
  ) as HTMLElement;

  const bestEl = root.querySelector(
    "[data-best]",
  ) as HTMLElement;

  const perfectEl = root.querySelector(
    "[data-perfect]",
  ) as HTMLElement;

  const roundEl = root.querySelector(
    "[data-round]",
  ) as HTMLElement;

  const roundScoreEl = root.querySelector(
    "[data-round-score]",
  ) as HTMLElement;

  const playerStateEl = root.querySelector(
    "[data-player-state]",
  ) as HTMLElement;

  const aiStateEl = root.querySelector(
    "[data-ai-state]",
  ) as HTMLElement;

  const playerBalanceEl = root.querySelector(
    "[data-player-balance]",
  ) as HTMLElement;

  const playerStaminaEl = root.querySelector(
    "[data-player-stamina]",
  ) as HTMLElement;

  const aiBalanceEl = root.querySelector(
    "[data-ai-balance]",
  ) as HTMLElement;

  const aiStaminaEl = root.querySelector(
    "[data-ai-stamina]",
  ) as HTMLElement;

  const playerBalanceBar = root.querySelector(
    "[data-player-balance-bar]",
  ) as HTMLElement;

  const playerStaminaBar = root.querySelector(
    "[data-player-stamina-bar]",
  ) as HTMLElement;

  const aiBalanceBar = root.querySelector(
    "[data-ai-balance-bar]",
  ) as HTMLElement;

  const aiStaminaBar = root.querySelector(
    "[data-ai-stamina-bar]",
  ) as HTMLElement;

  const hintEl = root.querySelector(
    "[data-hint]",
  ) as HTMLElement;

  const chargeEl = root.querySelector(
    "[data-charge]",
  ) as HTMLElement;

  const chargeValueEl = root.querySelector(
    "[data-charge-value]",
  ) as HTMLElement;

  const chargeFillEl = root.querySelector(
    "[data-charge-fill]",
  ) as HTMLElement;

  const flashEl = root.querySelector(
    "[data-flash]",
  ) as HTMLElement;

  const logEl = root.querySelector(
    "[data-log]",
  ) as HTMLElement;

  let resizeObserver:
    | ResizeObserver
    | null = null;

  let animationFrame = 0;
  let lastTime = performance.now();

  const state: GameState = {
    phase: "idle",

    round: 1,
    playerWins: 0,
    aiWins: 0,

    score: 0,
    bestScore: getBestScore(),

    roundTime: 0,
    maxRoundTime: 30,

    countdown: 3,
    countdownTimer: 0,

    player: createRam(
      "player",
      { x: 0, y: 0 },
      0,
      0,
    ),

    ai: createRam(
      "ai",
      { x: 0, y: 0 },
      0,
      0.5,
    ),

    particles: [],
    grass: [],

    cameraShake: 0,
    impactFlash: 0,

    perfectTimer: 0,
    perfectText: "",

    lastHit: "",
    lastHitTimer: 0,

    matchPerfects: 0,
    matchHits: 0,

    pointerDown: false,
    pointerActive: false,
    pointer: { x: 0, y: 0 },
    aimAngle: 0,

    audioReady: false,
    audioContext: null,

    destroyed: false,
  };

  function getSize() {
    const rect =
      canvas.getBoundingClientRect();

    return {
      width: rect.width,
      height: rect.height,
      dpr:
        window.devicePixelRatio || 1,
    };
  }

  function getArena() {
    const { width, height } =
      getSize();

    const radius =
      Math.min(width, height) *
      0.365;

    return {
      center: {
        x: width / 2,
        y: height / 2,
      },
      radius,
    };
  }

  function initializeGrass() {
    const { width, height } =
      getSize();

    state.grass = [];

    const count =
      Math.floor(
        (width * height) / 4200,
      );

    for (
      let i = 0;
      i < count;
      i++
    ) {
      state.grass.push({
        x: random(
          width * 0.08,
          width * 0.92,
        ),
        y: random(
          height * 0.08,
          height * 0.92,
        ),
        h: random(4, 10),
        lean: random(-0.8, 0.8),
      });
    }
  }

  function resizeCanvas() {
    const {
      width,
      height,
      dpr,
    } = getSize();

    canvas.width =
      Math.max(
        1,
        Math.floor(
          width * dpr,
        ),
      );

    canvas.height =
      Math.max(
        1,
        Math.floor(
          height * dpr,
        ),
      );

    ctx.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0,
    );

    const arena =
      getArena();

    if (
      state.player.pos.x === 0 &&
      state.player.pos.y === 0
    ) {
      resetRams(arena);
    }

    initializeGrass();

    draw();
  }

  function resetRams(
    arena = getArena(),
  ) {
    const spacing =
      arena.radius * 0.58;

    state.player =
      createRam(
        "player",
        {
          x:
            arena.center.x -
            spacing,
          y:
            arena.center.y,
        },
        arena.radius,
        state.round - 1,
      );

    state.ai =
      createRam(
        "ai",
        {
          x:
            arena.center.x +
            spacing,
          y:
            arena.center.y,
        },
        arena.radius,
        state.round - 1,
      );

    state.aimAngle = 0;

    state.pointerDown = false;
    state.pointerActive = false;

    state.particles = [];
    state.cameraShake = 0;
    state.impactFlash = 0;
    state.perfectTimer = 0;
    state.lastHitTimer = 0;
  }

  function setLog(
    html: string,
  ) {
    logEl.innerHTML = html;
  }

  function unlockAudio() {
    if (
      state.audioReady
    ) {
      return;
    }

    try {
      const AudioContextCtor =
        window.AudioContext ||
        (
          window as typeof window & {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;

      if (!AudioContextCtor) {
        return;
      }

      state.audioContext =
        new AudioContextCtor();

      state.audioReady = true;
    } catch {
      state.audioReady = false;
    }
  }

  function beep(
    frequency: number,
    duration: number,
    type: OscillatorType,
    volume: number,
  ) {
    if (
      !state.audioReady ||
      !state.audioContext
    ) {
      return;
    }

    const audio =
      state.audioContext;

    if (
      audio.state === "suspended"
    ) {
      void audio.resume();
    }

    const oscillator =
      audio.createOscillator();

    const gain =
      audio.createGain();

    oscillator.type = type;
    oscillator.frequency.value =
      frequency;

    gain.gain.value = volume;

    oscillator.connect(gain);
    gain.connect(
      audio.destination,
    );

    const now =
      audio.currentTime;

    gain.gain.setValueAtTime(
      volume,
      now,
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + duration,
    );

    oscillator.start(now);
    oscillator.stop(
      now + duration,
    );
  }

  function playChargeSound(
    amount: number,
  ) {
    if (
      amount < 0.75
    ) {
      return;
    }

    beep(
      140 + amount * 110,
      0.06,
      "sine",
      0.025,
    );
  }

  function playImpactSound(
    perfect: boolean,
  ) {
    beep(
      perfect ? 74 : 62,
      perfect ? 0.28 : 0.2,
      "triangle",
      perfect ? 0.14 : 0.1,
    );

    window.setTimeout(
      () => {
        beep(
          perfect ? 210 : 170,
          0.08,
          "square",
          perfect ? 0.045 : 0.025,
        );
      },
      22,
    );
  }

  function playWinSound() {
    beep(
      330,
      0.12,
      "sine",
      0.05,
    );

    window.setTimeout(
      () => {
        beep(
          520,
          0.18,
          "sine",
          0.055,
        );
      },
      80,
    );
  }

  function updateHUD() {
    const p =
      state.player;

    const a =
      state.ai;

    scoreEl.textContent =
      String(state.score);

    bestEl.textContent =
      String(state.bestScore);

    perfectEl.textContent =
      String(state.matchPerfects);

    roundEl.textContent =
      `${state.round} / 3`;

    roundScoreEl.textContent =
      `YOU ${state.playerWins} — ${state.aiWins} CPU`;

    playerBalanceEl.textContent =
      String(
        Math.round(
          clamp(
            p.balance,
            0,
            100,
          ),
        ),
      );

    playerStaminaEl.textContent =
      String(
        Math.round(
          clamp(
            p.stamina,
            0,
            100,
          ),
        ),
      );

    aiBalanceEl.textContent =
      String(
        Math.round(
          clamp(
            a.balance,
            0,
            100,
          ),
        ),
      );

    aiStaminaEl.textContent =
      String(
        Math.round(
          clamp(
            a.stamina,
            0,
            100,
          ),
        ),
      );

    playerBalanceBar.style.width =
      `${clamp(p.balance, 0, 100)}%`;

    playerStaminaBar.style.width =
      `${clamp(p.stamina, 0, 100)}%`;

    aiBalanceBar.style.width =
      `${clamp(a.balance, 0, 100)}%`;

    aiStaminaBar.style.width =
      `${clamp(a.stamina, 0, 100)}%`;

    playerStateEl.textContent =
      getRamState(p);

    aiStateEl.textContent =
      getRamState(a);

    if (
      p.charging &&
      state.phase === "playing"
    ) {
      chargeEl.classList.add(
        "is-visible",
      );

      const percent =
        clamp(
          p.charge * 100,
          0,
          100,
        );

      chargeValueEl.textContent =
        `${Math.round(percent)}%`;

      chargeFillEl.style.width =
        `${percent}%`;
    } else {
      chargeEl.classList.remove(
        "is-visible",
      );
    }
  }

  function getRamState(
    ram: Ram,
  ): string {
    if (ram.eliminated) {
      return "OUT";
    }

    if (ram.fallen) {
      return "DOWN";
    }

    if (
      ram.recoveryWindow > 0
    ) {
      return "RECOVER";
    }

    if (ram.stunTimer > 0) {
      return "STAGGER";
    }

    if (ram.charging) {
      return "CHARGING";
    }

    if (ram.balance < 30) {
      return "CRITICAL";
    }

    return "READY";
  }

  function showOverlay(
    title: string,
    copy: string,
    primary: string,
  ) {
    overlayTitle.textContent =
      title;

    overlayCopy.textContent =
      copy;

    primaryButton.textContent =
      primary;

    resultRound.textContent =
      `${state.round} / 3`;

    resultScore.textContent =
      String(state.score);

    resultPerfect.textContent =
      String(state.matchPerfects);

    resultBest.textContent =
      String(state.bestScore);

    overlay.classList.add(
      "is-visible",
    );
  }

  function hideOverlay() {
    overlay.classList.remove(
      "is-visible",
    );
  }

  function startMatch() {
    unlockAudio();

    state.round = 1;
    state.playerWins = 0;
    state.aiWins = 0;

    state.score = 0;
    state.matchPerfects = 0;
    state.matchHits = 0;

    state.phase = "countdown";
    state.countdown = 3;
    state.countdownTimer = 0;

    state.maxRoundTime = 30;
    state.roundTime =
      state.maxRoundTime;

    resetRams();

    hideOverlay();

    hintEl.textContent =
      "HOLD + DRAG TO AIM / RELEASE TO CHARGE";

    setLog(
      `<strong>&gt;_ MATCH</strong> best of three. Read the opening.`,
    );

    updateHUD();
  }

  function startNextRound() {
    state.round += 1;

    state.phase = "countdown";
    state.countdown = 3;
    state.countdownTimer = 0;

    state.maxRoundTime =
      Math.max(
        23,
        30 -
          (state.round - 1) * 2,
      );

    state.roundTime =
      state.maxRoundTime;

    resetRams();

    hideOverlay();

    setLog(
      `<strong>&gt;_ ROUND ${state.round}</strong> new arena reset. Keep your balance.`,
    );

    updateHUD();
  }

  function resetMatch() {
    state.phase = "idle";

    state.round = 1;
    state.playerWins = 0;
    state.aiWins = 0;

    state.score = 0;
    state.matchPerfects = 0;
    state.matchHits = 0;

    state.roundTime =
      state.maxRoundTime;

    resetRams();

    primaryButton.textContent =
      "PLAY";

    showOverlay(
      "RAM CLASH",
      "Hold anywhere on the arena, drag to aim, then release. Win by breaking balance or pushing the opponent out.",
      "PLAY",
    );

    setLog(
      `<strong>&gt;_ SYSTEM</strong> hold + drag + release.`,
    );

    updateHUD();
  }

  function beginCountdown(
    delta: number,
  ) {
    state.countdownTimer +=
      delta;

    if (
      state.countdownTimer >=
      0.9
    ) {
      state.countdownTimer =
        0;

      state.countdown -= 1;

      beep(
        state.countdown > 0
          ? 170
          : 280,
        0.07,
        "sine",
        0.045,
      );

      if (
        state.countdown <= 0
      ) {
        state.phase =
          "playing";

        state.roundTime =
          state.maxRoundTime;

        hintEl.textContent =
          "HOLD + DRAG / AIM THE HEAD / RELEASE";

        setLog(
          `<strong>&gt;_ FIGHT</strong> perfect impact is all about timing.`,
        );

        beep(
          430,
          0.12,
          "triangle",
          0.06,
        );
      }
    }
  }

  function updatePlayer(
    dt: number,
  ) {
    const player =
      state.player;

    player.hitCooldown = Math.max(
      0,
      player.hitCooldown - dt,
    );

    player.attackTimer = Math.max(
      0,
      player.attackTimer - dt,
    );

    player.stunTimer = Math.max(
      0,
      player.stunTimer - dt,
    );

    player.recoveryWindow =
      Math.max(
        0,
        player.recoveryWindow -
          dt,
      );

    if (
      player.eliminated
    ) {
      return;
    }

    if (
      player.stunTimer <= 0 &&
      !player.fallen &&
      player.recoveryWindow <= 0
    ) {
      if (
        !player.charging
      ) {
        player.stamina =
          Math.min(
            100,
            player.stamina +
              dt * 18,
          );
      }

      if (
        state.pointerDown &&
        state.phase === "playing"
      ) {
        player.charging = true;

        player.chargeTime += dt;

        const maxChargeTime =
          1.65;

        player.charge =
          clamp(
            player.chargeTime /
              maxChargeTime,
            0,
            1,
          );

        const availableStamina =
          clamp(
            player.stamina,
            0,
            100,
          );

        const staminaFactor =
          availableStamina <= 3
            ? 0.12
            : 1;

        player.charge =
          Math.min(
            player.charge,
            staminaFactor *
              player.charge +
              (1 -
                staminaFactor),
          );

        if (
          state.pointerActive
        ) {
          const target =
            state.pointer;

          const direction =
            normalize(
              sub(
                target,
                player.pos,
              ),
            );

          if (
            Math.hypot(
              direction.x,
              direction.y,
            ) > 0
          ) {
            state.aimAngle =
              angleOf(
                direction,
              );
          }
        }

        player.headAngle =
          state.aimAngle;

        const brace =
          18 +
          player.charge * 28;

        const back =
          {
            x:
              -Math.cos(
                state.aimAngle,
              ) * brace,
            y:
              -Math.sin(
                state.aimAngle,
              ) * brace,
          };

        player.vel.x +=
          back.x * dt;

        player.vel.y +=
          back.y * dt;

        player.stamina =
          Math.max(
            0,
            player.stamina -
              dt *
                (5 +
                  player.charge *
                    8),
          );
      }
    }

    if (
      player.recoveryWindow >
        0 &&
      player.balance < 45
    ) {
      applyPlayerRecovery(
        dt,
      );
    }

    updateRamPhysics(
      player,
      dt,
    );
  }

  function applyPlayerRecovery(
    dt: number,
  ) {
    const player =
      state.player;

    if (
      !state.pointerActive
    ) {
      return;
    }

    const horizontal =
      clamp(
        (
          state.pointer.x -
          player.pos.x
        ) / 90,
        -1,
        1,
      );

    const recoveryDirection =
      player.lean >= 0
        ? -1
        : 1;

    const correct =
      horizontal *
        recoveryDirection >
      0.08;

    if (correct) {
      player.balance =
        Math.min(
          48,
          player.balance +
            dt * 30,
        );

      player.lean *=
        Math.max(
          0,
          1 - dt * 5,
        );

      if (
        player.balance >
        30
      ) {
        player.recoveryWindow =
          0;
        player.recoveryUsed =
          false;

        setLog(
          `<strong>&gt;_ RECOVERED</strong> your footing is back.`,
        );
      }
    }
  }

  function updateAI(
    dt: number,
  ) {
    const ai =
      state.ai;

    ai.hitCooldown = Math.max(
      0,
      ai.hitCooldown - dt,
    );

    ai.attackTimer = Math.max(
      0,
      ai.attackTimer - dt,
    );

    ai.stunTimer = Math.max(
      0,
      ai.stunTimer - dt,
    );

    ai.recoveryWindow =
      Math.max(
        0,
        ai.recoveryWindow -
          dt,
      );

    if (
      ai.eliminated
    ) {
      return;
    }

    if (
      ai.fallen
    ) {
      return;
    }

    const player =
      state.player;

    const toPlayer =
      sub(
        player.pos,
        ai.pos,
      );

    const targetDir =
      normalize(
        toPlayer,
      );

    if (
      ai.stunTimer <= 0 &&
      ai.recoveryWindow <= 0
    ) {
      ai.headAngle =
        angleOf(
          targetDir,
        );
    }

    ai.aiNextAction -=
      dt;

    if (
      !ai.charging &&
      ai.stunTimer <= 0 &&
      ai.aiNextAction <= 0
    ) {
      const distanceToPlayer =
        distance(
          ai.pos,
          player.pos,
        );

      const wantsAttack =
        Math.random() <
          ai.aiAggression;

      if (
        wantsAttack &&
        distanceToPlayer > 82
      ) {
        ai.aiCharging = true;
        ai.charging = true;
        ai.chargeTime = 0;
        ai.charge =
          0;
      } else {
        ai.aiNextAction =
          random(
            0.45,
            1.35,
          );
      }
    }

    if (
      ai.charging &&
      !ai.fallen &&
      ai.stunTimer <= 0
    ) {
      ai.chargeTime +=
        dt;

      const targetCharge =
        ai.aiChargeTarget;

      ai.charge =
        clamp(
          ai.chargeTime /
            1.35,
          0,
          1,
        );

      ai.headAngle =
        angleOf(
          targetDir,
        );

      if (
        ai.charge >=
        targetCharge
      ) {
        releaseAttack(
          ai,
          ai.headAngle,
        );
      }
    }

    if (
      ai.balance < 34 &&
      ai.recoveryWindow > 0
    ) {
      const desired =
        ai.lean >= 0
          ? -1
          : 1;

      ai.lean +=
        desired *
        dt *
        2.5;

      ai.balance =
        Math.min(
          48,
          ai.balance +
            dt * 14,
        );

      if (
        ai.balance >
        30
      ) {
        ai.recoveryWindow =
          0;
      }
    }

    updateRamPhysics(
      ai,
      dt,
    );
  }

  function releasePlayerAttack() {
    const player =
      state.player;

    if (
      !player.charging ||
      player.fallen ||
      player.stunTimer > 0 ||
      player.eliminated
    ) {
      player.charging =
        false;

      player.charge =
        0;

      player.chargeTime =
        0;

      return;
    }

    releaseAttack(
      player,
      state.aimAngle,
    );
  }

  function releaseAttack(
    ram: Ram,
    angle: number,
  ) {
    const charge =
      clamp(
        ram.charge,
        0,
        1,
      );

    const power =
      0.34 +
      charge * 0.9;

    const staminaScale =
      clamp(
        0.58 +
          ram.stamina / 230,
        0.58,
        1,
      );

    const effective =
      power *
      staminaScale;

    ram.attackPower =
      effective;

    ram.attackTimer =
      0.22;

    ram.headAngle =
      angle;

    const velocity =
      {
        x:
          Math.cos(
            angle,
          ) *
          (120 +
            effective * 250),
        y:
          Math.sin(
            angle,
          ) *
          (120 +
            effective * 250),
      };

    ram.vel.x +=
      velocity.x;

    ram.vel.y +=
      velocity.y;

    ram.bodyAngle =
      angle;

    ram.stamina =
      Math.max(
        0,
        ram.stamina -
          12 -
          charge * 28,
      );

    ram.charging = false;
    ram.aiCharging = false;
    ram.charge = 0;
    ram.chargeTime = 0;

    ram.hitCooldown =
      0.06;

    addDustBurst(
      ram.pos,
      angle +
        Math.PI,
      8 +
        Math.round(
          effective * 8,
        ),
    );

    playChargeSound(
      charge,
    );
  }

  function updateRamPhysics(
    ram: Ram,
    dt: number,
  ) {
    if (
      ram.eliminated ||
      ram.fallen
    ) {
      ram.vel.x *=
        Math.pow(
          0.06,
          dt,
        );

      ram.vel.y *=
        Math.pow(
          0.06,
          dt,
        );

      return;
    }

    const speed =
      Math.hypot(
        ram.vel.x,
        ram.vel.y,
      );

    const grip =
      ram.grip;

    const friction =
      Math.pow(
        Math.max(
          0.01,
          1 -
            grip * 0.84 * dt,
        ),
        1,
      );

    ram.vel.x *=
      friction;

    ram.vel.y *=
      friction;

    ram.pos.x +=
      ram.vel.x * dt;

    ram.pos.y +=
      ram.vel.y * dt;

    if (
      speed > 15 &&
      !ram.charging
    ) {
      const targetAngle =
        angleOf(
          ram.vel,
        );

      const difference =
        angleDiff(
          targetAngle,
          ram.bodyAngle,
        );

      ram.bodyAngle +=
        difference *
        Math.min(
          1,
          dt * 8,
        );
    }

    const arena =
      getArena();

    const fromCenter =
      sub(
        ram.pos,
        arena.center,
      );

    const distFromCenter =
      Math.hypot(
        fromCenter.x,
        fromCenter.y,
      );

    const innerRadius =
      arena.radius -
      ram.radius * 0.52;

    if (
      distFromCenter >
      innerRadius
    ) {
      const normal =
        normalize(
          fromCenter,
        );

      const outwardVelocity =
        dot(
          ram.vel,
          normal,
        );

      if (
        outwardVelocity > 0
      ) {
        ram.vel.x -=
          normal.x *
          outwardVelocity *
          0.9;

        ram.vel.y -=
          normal.y *
          outwardVelocity *
          0.9;
      }

      const excess =
        distFromCenter -
        innerRadius;

      ram.outTimer +=
        dt *
        (1 +
          excess /
            Math.max(
              1,
              ram.radius,
            ));

      ram.balance =
        Math.max(
          0,
          ram.balance -
            excess *
            dt *
            0.8,
        );

      if (
        ram.outTimer >
        0.7
      ) {
        eliminateRam(
          ram,
          "OUT OF BOUNDS",
        );

        return;
      }
    } else {
      ram.outTimer =
        Math.max(
          0,
          ram.outTimer -
            dt * 1.4,
        );
    }

    ram.lean *=
      Math.max(
        0,
        1 - dt * 1.8,
      );

    if (
      ram.balance <
      40
    ) {
      ram.recoveryWindow =
        Math.max(
          ram.recoveryWindow,
          0.35,
        );
    }

    if (
      ram.balance <= 0 &&
      ram.recoveryWindow <= 0
    ) {
      ram.fallen = true;
      ram.stunTimer =
        1.15;

      ram.vel.x *=
        0.16;

      ram.vel.y *=
        0.16;

      addDustBurst(
        ram.pos,
        ram.bodyAngle,
        12,
      );

      if (
        ram.id === "player"
      ) {
        setLog(
          `<strong>&gt;_ DOWN</strong> recovery window missed.`,
        );
      }
    }
  }

  function handleRamCollision() {
    const player =
      state.player;

    const ai =
      state.ai;

    if (
      player.eliminated ||
      ai.eliminated
    ) {
      return;
    }

    const delta =
      sub(
        ai.pos,
        player.pos,
      );

    const dist =
      Math.hypot(
        delta.x,
        delta.y,
      );

    const minimum =
      player.radius +
      ai.radius -
      3;

    if (
      dist <= 0 ||
      dist >= minimum
    ) {
      return;
    }

    const normal =
      normalize(
        delta,
      );

    const overlap =
      minimum -
      dist;

    player.pos.x -=
      normal.x *
      overlap *
      0.5;

    player.pos.y -=
      normal.y *
      overlap *
      0.5;

    ai.pos.x +=
      normal.x *
      overlap *
      0.5;

    ai.pos.y +=
      normal.y *
      overlap *
      0.5;

    if (
      player.hitCooldown >
        0 ||
      ai.hitCooldown >
        0
    ) {
      return;
    }

    const relativeVelocity =
      sub(
        ai.vel,
        player.vel,
      );

    const closingSpeed =
      Math.max(
        0,
        dot(
          relativeVelocity,
          normal,
        ),
      );

    const playerFacing = {
      x:
        Math.cos(
          player.headAngle,
        ),
      y:
        Math.sin(
          player.headAngle,
        ),
    };

    const aiFacing = {
      x:
        Math.cos(
          ai.headAngle,
        ),
      y:
        Math.sin(
          ai.headAngle,
        ),
    };

    const playerAlignment =
      clamp(
        dot(
          playerFacing,
          normal,
        ),
        0,
        1,
      );

    const aiAlignment =
      clamp(
        dot(
          aiFacing,
          mul(
            normal,
            -1,
          ),
        ),
        0,
        1,
      );

    const playerAttack =
      player.attackTimer >
        0
        ? player.attackPower
        : 0;

    const aiAttack =
      ai.attackTimer >
        0
        ? ai.attackPower
        : 0;

    const playerImpact =
      playerAttack *
      playerAlignment *
      (1 +
        closingSpeed /
          320);

    const aiImpact =
      aiAttack *
      aiAlignment *
      (1 +
        closingSpeed /
          320);

    const playerHit =
      playerImpact >
      0.12;

    const aiHit =
      aiImpact >
      0.12;

    if (
      !playerHit &&
      !aiHit &&
      closingSpeed < 80
    ) {
      return;
    }

    const impactStrength =
      Math.max(
        0.15,
        closingSpeed /
          210,
      );

    let perfect = false;

    if (
      playerHit &&
      playerImpact >
        0.88 &&
      playerAlignment >
        0.92 &&
      player.charge <= 0.01
    ) {
      perfect = true;
    }

    if (
      aiHit &&
      aiImpact >
        0.88 &&
      aiAlignment >
        0.92
    ) {
      perfect = false;
    }

    let targetDamage =
      playerImpact >
      aiImpact
        ? playerImpact *
          42
        : 0;

    let playerDamage =
      aiImpact >
      playerImpact
        ? aiImpact *
          42
        : 0;

    if (
      !playerHit &&
      aiHit
    ) {
      playerDamage =
        aiImpact *
        48;
    }

    if (
      playerHit &&
      !aiHit
    ) {
      targetDamage =
        playerImpact *
        48;
    }

    if (
      perfect
    ) {
      targetDamage *=
        1.55;

      player.perfectHits +=
        1;

      state.matchPerfects +=
        1;

      state.score +=
        420;

      state.perfectText =
        "PERFECT IMPACT";

      state.perfectTimer =
        1.25;

      state.cameraShake =
        Math.max(
          state.cameraShake,
          13,
        );

      state.impactFlash =
        0.12;

      flashEl.classList.add(
        "is-perfect",
      );

      window.setTimeout(
        () => {
          flashEl.classList.remove(
            "is-perfect",
          );
        },
        120,
      );

      setLog(
        `<strong>&gt;_ PERFECT IMPACT</strong> head alignment was nearly exact.`,
      );

      playImpactSound(
        true,
      );

      spawnImpactParticles(
        add(
          player.pos,
          mul(
            normal,
            player.radius,
          ),
        ),
        true,
      );
    } else {
      state.score +=
        Math.round(
          Math.max(
            playerImpact,
            aiImpact,
          ) *
            90,
        );

      state.impactFlash =
        0.08;

      flashEl.classList.add(
        "is-hit",
      );

      window.setTimeout(
        () => {
          flashEl.classList.remove(
            "is-hit",
          );
        },
        90,
      );

      setLog(
        `<strong>&gt;_ IMPACT</strong> momentum ${Math.round(
          Math.max(
            playerImpact,
            aiImpact,
          ) * 100,
        )}.`,
      );

      playImpactSound(
        false,
      );

      spawnImpactParticles(
        add(
          player.pos,
          mul(
            normal,
            player.radius,
          ),
        ),
        false,
      );
    }

    if (
      playerHit
    ) {
      player.hits += 1;
      state.matchHits += 1;
    }

    if (
      aiHit
    ) {
      ai.hits += 1;
      state.matchHits += 1;
    }

    ai.balance =
      clamp(
        ai.balance -
          targetDamage *
            (1 +
              impactStrength *
                0.14),
        -10,
        100,
      );

    player.balance =
      clamp(
        player.balance -
          playerDamage *
            (1 +
              impactStrength *
                0.14),
        -10,
        100,
      );

    const playerPush =
      playerHit
        ? playerImpact *
          130
        : 0;

    const aiPush =
      aiHit
        ? aiImpact *
          130
        : 0;

    ai.vel.x +=
      normal.x *
      playerPush;

    ai.vel.y +=
      normal.y *
      playerPush;

    player.vel.x -=
      normal.x *
      aiPush;

    player.vel.y -=
      normal.y *
      aiPush;

    const side =
      cross(
        normal,
        playerFacing,
      );

    ai.lean =
      clamp(
        ai.lean +
          side *
          Math.max(
            playerImpact,
            0.2,
          ),
        -1,
        1,
      );

    player.lean =
      clamp(
        player.lean -
          side *
          Math.max(
            aiImpact,
            0.2,
          ),
        -1,
        1,
      );

    player.stunTimer =
      Math.max(
        player.stunTimer,
        aiImpact >
          0.55
          ? 0.12
          : 0,
      );

    ai.stunTimer =
      Math.max(
        ai.stunTimer,
        playerImpact >
          0.55
          ? 0.12
          : 0,
      );

    player.hitCooldown =
      0.18;

    ai.hitCooldown =
      0.18;

    if (
      player.balance <
        40
    ) {
      player.recoveryWindow =
        0.62;
    }

    if (
      ai.balance <
        40
    ) {
      ai.recoveryWindow =
        0.48;
    }

    if (
      player.balance <= 0
    ) {
      player.balance =
        0;

      player.recoveryWindow =
        0.58;
    }

    if (
      ai.balance <= 0
    ) {
      ai.balance =
        0;

      ai.recoveryWindow =
        0.42;
    }

    if (
      perfect
    ) {
      ai.vel.x +=
        normal.x * 75;

      ai.vel.y +=
        normal.y * 75;
    }

    state.lastHit =
      perfect
        ? "PERFECT IMPACT"
        : "IMPACT";

    state.lastHitTimer =
      0.9;
  }

  function spawnImpactParticles(
    position: Vec2,
    perfect: boolean,
  ) {
    const count =
      perfect ? 18 : 11;

    for (
      let i = 0;
      i < count;
      i++
    ) {
      const angle =
        random(
          0,
          Math.PI * 2,
        );

      const speed =
        random(
          perfect ? 70 : 45,
          perfect ? 190 : 130,
        );

      state.particles.push({
        pos: {
          x: position.x,
          y: position.y,
        },
        vel: {
          x:
            Math.cos(
              angle,
            ) * speed,
          y:
            Math.sin(
              angle,
            ) * speed,
        },
        life: random(
          0.3,
          perfect ? 0.75 : 0.55,
        ),
        maxLife:
          perfect ? 0.75 : 0.55,
        size: random(
          1,
          perfect ? 4 : 3,
        ),
        color:
          i % 2 === 0
            ? COLORS.lime
            : "#d8d2c2",
      });
    }
  }

  function addDustBurst(
    position: Vec2,
    direction: number,
    count: number,
  ) {
    for (
      let i = 0;
      i < count;
      i++
    ) {
      const spread =
        direction +
        random(
          -0.8,
          0.8,
        );

      const speed =
        random(
          20,
          85,
        );

      state.particles.push({
        pos: {
          x: position.x,
          y: position.y,
        },
        vel: {
          x:
            Math.cos(spread) *
            speed,
          y:
            Math.sin(spread) *
            speed,
        },
        life: random(
          0.22,
          0.48,
        ),
        maxLife: 0.48,
        size: random(
          1,
          3,
        ),
        color:
          "#817f65",
      });
    }
  }

  function updateParticles(
    dt: number,
  ) {
    for (
      let i =
        state.particles.length -
        1;
      i >= 0;
      i--
    ) {
      const particle =
        state.particles[i];

      particle.life -=
        dt;

      if (
        particle.life <= 0
      ) {
        state.particles.splice(
          i,
          1,
        );
        continue;
      }

      particle.pos.x +=
        particle.vel.x *
        dt;

      particle.pos.y +=
        particle.vel.y *
        dt;

      particle.vel.x *=
        Math.pow(
          0.22,
          dt,
        );

      particle.vel.y *=
        Math.pow(
          0.22,
          dt,
        );

      particle.vel.y +=
        80 * dt;
    }
  }

  function eliminateRam(
    ram: Ram,
    reason: string,
  ) {
    if (
      ram.eliminated
    ) {
      return;
    }

    ram.eliminated = true;

    ram.vel.x *=
      0.08;

    ram.vel.y *=
      0.08;

    ram.fallen = true;

    addDustBurst(
      ram.pos,
      ram.bodyAngle,
      18,
    );

    if (
      ram.id === "player"
    ) {
      setLog(
        `<strong>&gt;_ YOU'RE OUT</strong> ${reason}.`,
      );
    } else {
      setLog(
        `<strong>&gt;_ CPU OUT</strong> ${reason}.`,
      );
    }

    checkRoundEnd();
  }

  function checkRoundEnd() {
    if (
      state.phase !== "playing"
    ) {
      return;
    }

    if (
      !state.player.eliminated &&
      !state.ai.eliminated
    ) {
      return;
    }

    const playerWon =
      !state.player.eliminated &&
      state.ai.eliminated;

    const aiWon =
      !state.ai.eliminated &&
      state.player.eliminated;

    if (
      playerWon
    ) {
      state.playerWins +=
        1;

      state.score +=
        650;

      state.player.wins +=
        1;

      playWinSound();

      setLog(
        `<strong>&gt;_ ROUND WON</strong> perfect positioning.`,
      );
    } else if (
      aiWon
    ) {
      state.aiWins +=
        1;

      setLog(
        `<strong>&gt;_ ROUND LOST</strong> protect your balance.`,
      );
    }

    state.phase =
      "round-result";

    const matchFinished =
      state.playerWins >= 2 ||
      state.aiWins >= 2 ||
      state.round >= 3;

    if (
      matchFinished
    ) {
      finishMatch();
      return;
    }

    window.setTimeout(
      () => {
        if (
          state.phase ===
          "round-result"
        ) {
          showRoundResult(
            playerWon,
          );
        }
      },
      360,
    );
  }

  function finishMatch() {
    const playerWon =
      state.playerWins >
      state.aiWins;

    if (
      playerWon
    ) {
      state.score +=
        1000;

      setLog(
        `<strong>&gt;_ MATCH WON</strong> balance control complete.`,
      );
    } else {
      setLog(
        `<strong>&gt;_ MATCH LOST</strong> the arena wins this time.`,
      );
    }

    if (
      state.score >
      state.bestScore
    ) {
      state.bestScore =
        state.score;

      saveBestScore(
        state.bestScore,
      );
    }

    state.phase =
      "match-result";

    overlayTitle.textContent =
      playerWon
        ? "YOU WIN"
        : "CPU WINS";

    overlayCopy.textContent =
      playerWon
        ? "Three rounds. One rule: read the impact before it happens."
        : "Your balance broke first. The rematch is already waiting.";

    primaryButton.textContent =
      "REMATCH";

    resultRound.textContent =
      `YOU ${state.playerWins} — ${state.aiWins} CPU`;

    resultScore.textContent =
      String(state.score);

    resultPerfect.textContent =
      String(state.matchPerfects);

    resultBest.textContent =
      String(state.bestScore);

    overlay.classList.add(
      "is-visible",
    );

    playWinSound();
  }

  function showRoundResult(
    playerWon: boolean,
  ) {
    overlayTitle.textContent =
      playerWon
        ? "ROUND WON"
        : "ROUND LOST";

    overlayCopy.textContent =
      playerWon
        ? "You controlled the impact. Next round starts immediately."
        : "You lost the exchange. Change your approach.";

    primaryButton.textContent =
      "NEXT ROUND";

    resultRound.textContent =
      `YOU ${state.playerWins} — ${state.aiWins} CPU`;

    resultScore.textContent =
      String(state.score);

    resultPerfect.textContent =
      String(state.matchPerfects);

    resultBest.textContent =
      String(state.bestScore);

    overlay.classList.add(
      "is-visible",
    );
  }

  function updateRoundTimer(
    dt: number,
  ) {
    state.roundTime -=
      dt;

    if (
      state.roundTime <= 0
    ) {
      state.roundTime =
        0;

      resolveTimeout();
    }
  }

  function resolveTimeout() {
    if (
      state.phase !== "playing"
    ) {
      return;
    }

    const player =
      state.player;

    const ai =
      state.ai;

    const balanceDifference =
      player.balance -
      ai.balance;

    const positionPlayer =
      distanceFromArenaEdge(
        player,
      );

    const positionAi =
      distanceFromArenaEdge(
        ai,
      );

    let playerWon = false;

    if (
      Math.abs(
        balanceDifference,
      ) >= 8
    ) {
      playerWon =
        balanceDifference >
        0;
    } else {
      playerWon =
        positionPlayer >
        positionAi;
    }

    if (
      playerWon
    ) {
      state.playerWins +=
        1;

      state.score +=
        400;
    } else {
      state.aiWins +=
        1;
    }

    state.phase =
      "round-result";

    const matchFinished =
      state.playerWins >= 2 ||
      state.aiWins >= 2 ||
      state.round >= 3;

    if (
      matchFinished
    ) {
      finishMatch();
    } else {
      showRoundResult(
        playerWon,
      );
    }
  }

  function distanceFromArenaEdge(
    ram: Ram,
  ): number {
    const arena =
      getArena();

    const d =
      distance(
        ram.pos,
        arena.center,
      );

    return clamp(
      arena.radius -
        d,
      0,
      arena.radius,
    );
  }

  function update(
    dt: number,
  ) {
    if (
      state.phase === "countdown"
    ) {
      beginCountdown(
        dt,
      );
    }

    if (
      state.phase === "playing"
    ) {
      updateRoundTimer(
        dt,
      );

      updatePlayer(
        dt,
      );

      updateAI(
        dt,
      );

      handleRamCollision();

      if (
        state.player.balance <= 0
      ) {
        state.player.recoveryWindow =
          Math.max(
            0,
            state.player.recoveryWindow,
          );
      }

      if (
        state.ai.balance <= 0
      ) {
        state.ai.recoveryWindow =
          Math.max(
            0,
            state.ai.recoveryWindow,
          );
      }
    }

    updateParticles(
      dt,
    );

    state.cameraShake *=
      Math.pow(
        0.02,
        dt,
      );

    state.impactFlash =
      Math.max(
        0,
        state.impactFlash -
          dt,
      );

    state.perfectTimer =
      Math.max(
        0,
        state.perfectTimer -
          dt,
      );

    state.lastHitTimer =
      Math.max(
        0,
        state.lastHitTimer -
          dt,
      );

    updateHUD();
  }

  function draw() {
    const {
      width,
      height,
    } = getSize();

    ctx.clearRect(
      0,
      0,
      width,
      height,
    );

    ctx.fillStyle =
      "#0b0f0b";

    ctx.fillRect(
      0,
      0,
      width,
      height,
    );

    const shake =
      state.cameraShake;

    const offsetX =
      shake > 0
        ? random(
            -shake,
            shake,
          )
        : 0;

    const offsetY =
      shake > 0
        ? random(
            -shake,
            shake,
          )
        : 0;

    ctx.save();

    ctx.translate(
      offsetX,
      offsetY,
    );

    drawArena();

    drawGrass();

    drawParticles();

    drawRam(
      state.player,
    );

    drawRam(
      state.ai,
    );

    drawAimGuide();

    drawCountdown();

    drawPerfectText();

    drawTimer();

    ctx.restore();
  }

  function drawArena() {
    const arena =
      getArena();

    const {
      width,
      height,
    } = getSize();

    ctx.fillStyle =
      "#101811";

    ctx.fillRect(
      0,
      0,
      width,
      height,
    );

    ctx.fillStyle =
      COLORS.arena;

    ctx.beginPath();

    ctx.arc(
      arena.center.x,
      arena.center.y,
      arena.radius,
      0,
      Math.PI * 2,
    );

    ctx.fill();

    ctx.strokeStyle =
      COLORS.arenaLine;

    ctx.lineWidth = 3;

    ctx.beginPath();

    ctx.arc(
      arena.center.x,
      arena.center.y,
      arena.radius,
      0,
      Math.PI * 2,
    );

    ctx.stroke();

    ctx.strokeStyle =
      "rgba(236,235,216,.08)";

    ctx.lineWidth = 1;

    ctx.beginPath();

    ctx.arc(
      arena.center.x,
      arena.center.y,
      arena.radius *
        0.74,
      0,
      Math.PI * 2,
    );

    ctx.stroke();

    ctx.fillStyle =
      "rgba(255,255,255,.025)";

    ctx.beginPath();

    ctx.arc(
      arena.center.x,
      arena.center.y,
      arena.radius *
        0.31,
      0,
      Math.PI * 2,
    );

    ctx.fill();
  }

  function drawGrass() {
    for (
      const blade of state.grass
    ) {
      const arena =
        getArena();

      const d =
        distance(
          {
            x: blade.x,
            y: blade.y,
          },
          arena.center,
        );

      if (
        d >
        arena.radius -
          10
      ) {
        continue;
      }

      ctx.save();

      ctx.strokeStyle =
        "rgba(131,157,101,.27)";

      ctx.lineWidth = 1;

      ctx.beginPath();

      ctx.moveTo(
        blade.x,
        blade.y,
      );

      ctx.lineTo(
        blade.x +
          blade.lean *
            blade.h,
        blade.y -
          blade.h,
      );

      ctx.stroke();

      ctx.restore();
    }
  }

  function drawParticles() {
    for (
      const particle of
        state.particles
    ) {
      const alpha =
        clamp(
          particle.life /
            particle.maxLife,
          0,
          1,
        );

      ctx.save();

      ctx.globalAlpha =
        alpha;

      ctx.fillStyle =
        particle.color;

      ctx.beginPath();

      ctx.arc(
        particle.pos.x,
        particle.pos.y,
        particle.size,
        0,
        Math.PI * 2,
      );

      ctx.fill();

      ctx.restore();
    }
  }

  function drawRam(
    ram: Ram,
  ) {
    const p =
      ram.pos;

    const fallenTilt =
      ram.fallen
        ? Math.sign(
            ram.lean || 1,
          ) *
          0.72
        : ram.lean *
          0.34;

    ctx.save();

    ctx.translate(
      p.x,
      p.y,
    );

    ctx.rotate(
      ram.bodyAngle +
        fallenTilt,
    );

    const bodyColor =
      ram.id === "player"
        ? COLORS.player
        : COLORS.enemy;

    const bodyShadow =
      ram.id === "player"
        ? COLORS.playerShadow
        : COLORS.enemyShadow;

    // Ground shadow.
    ctx.save();

    ctx.fillStyle =
      "rgba(0,0,0,.25)";

    ctx.beginPath();

    ctx.ellipse(
      0,
      14,
      34,
      11,
      0,
      0,
      Math.PI * 2,
    );

    ctx.fill();

    ctx.restore();

    // Back legs.
    ctx.strokeStyle =
      "#77766e";

    ctx.lineWidth = 4;

    ctx.lineCap =
      "round";

    for (
      const x of [-12, 8]
    ) {
      ctx.beginPath();

      ctx.moveTo(
        x,
        11,
      );

      ctx.lineTo(
        x +
          random(
            -1.2,
            1.2,
          ),
        26,
      );

      ctx.stroke();
    }

    // Wool body.
    ctx.fillStyle =
      bodyShadow;

    ctx.beginPath();

    ctx.ellipse(
      -3,
      -2,
      29,
      20,
      0,
      0,
      Math.PI * 2,
    );

    ctx.fill();

    ctx.fillStyle =
      bodyColor;

    ctx.beginPath();

    ctx.ellipse(
      -6,
      -4,
      27,
      18,
      0,
      0,
      Math.PI * 2,
    );

    ctx.fill();

    // Wool tufts.
    const tufts = [
      [-20, -10, 8],
      [-10, -16, 7],
      [0, -17, 8],
      [11, -13, 7],
      [-22, 1, 7],
      [-10, 8, 7],
      [3, 8, 7],
      [15, 4, 7],
    ];

    ctx.fillStyle =
      bodyColor;

    for (
      const [
        x,
        y,
        r,
      ] of tufts
    ) {
      ctx.beginPath();

      ctx.arc(
        x,
        y,
        r,
        0,
        Math.PI * 2,
      );

      ctx.fill();
    }

    // Neck.
    ctx.fillStyle =
      bodyShadow;

    ctx.beginPath();

    ctx.ellipse(
      19,
      -2,
      11,
      12,
      0,
      0,
      Math.PI * 2,
    );

    ctx.fill();

    // Head.
    ctx.fillStyle =
      bodyColor;

    ctx.beginPath();

    ctx.ellipse(
      28,
      -3,
      13,
      11,
      -0.08,
      0,
      Math.PI * 2,
    );

    ctx.fill();

    // Face.
    ctx.fillStyle =
      "#ddd9cf";

    ctx.beginPath();

    ctx.ellipse(
      34,
      1,
      7,
      6,
      0,
      0,
      Math.PI * 2,
    );

    ctx.fill();

    // Ear.
    ctx.fillStyle =
      bodyShadow;

    ctx.beginPath();

    ctx.moveTo(
      23,
      -10,
    );

    ctx.quadraticCurveTo(
      15,
      -19,
      24,
      -20,
    );

    ctx.quadraticCurveTo(
      29,
      -16,
      28,
      -8,
    );

    ctx.fill();

    // Horns.
    ctx.strokeStyle =
      COLORS.horn;

    ctx.lineWidth = 4;

    ctx.lineCap =
      "round";

    ctx.beginPath();

    ctx.arc(
      29,
      -7,
      8,
      Math.PI * 0.92,
      Math.PI * 1.83,
    );

    ctx.stroke();

    ctx.beginPath();

    ctx.arc(
      30,
      1,
      8,
      Math.PI * 0.12,
      Math.PI * 1.0,
    );

    ctx.stroke();

    // Eye.
    ctx.fillStyle =
      COLORS.eye;

    ctx.beginPath();

    ctx.arc(
      37,
      -4,
      1.8,
      0,
      Math.PI * 2,
    );

    ctx.fill();

    // Nose.
    ctx.fillStyle =
      "#4c4840";

    ctx.beginPath();

    ctx.arc(
      40,
      3,
      2.2,
      0,
      Math.PI * 2,
    );

    ctx.fill();

    // Player accent.
    if (
      ram.id === "player"
    ) {
      ctx.strokeStyle =
        "rgba(202,255,50,.7)";

      ctx.lineWidth = 1.5;

      ctx.beginPath();

      ctx.arc(
        -4,
        -3,
        32,
        0,
        Math.PI * 2,
      );

      ctx.stroke();
    }

    // Critical balance indicator.
    if (
      ram.balance < 30 &&
      !ram.eliminated
    ) {
      ctx.strokeStyle =
        "rgba(255,98,104,.75)";

      ctx.lineWidth = 2;

      ctx.beginPath();

      ctx.arc(
        0,
        0,
        36,
        -0.8,
        0.8,
      );

      ctx.stroke();
    }

    ctx.restore();

    drawRamLabel(
      ram,
    );
  }

  function drawRamLabel(
    ram: Ram,
  ) {
    if (
      state.phase ===
      "idle"
    ) {
      return;
    }

    ctx.save();

    ctx.fillStyle =
      ram.id === "player"
        ? "rgba(202,255,50,.78)"
        : "rgba(255,255,255,.38)";

    ctx.font =
      "900 8px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

    ctx.textAlign =
      "center";

    ctx.fillText(
      ram.id === "player"
        ? "YOU"
        : "CPU",
      ram.pos.x,
      ram.pos.y -
        38,
    );

    ctx.restore();
  }

  function drawAimGuide() {
    const player =
      state.player;

    if (
      state.phase !==
        "playing" ||
      player.eliminated ||
      player.fallen
    ) {
      return;
    }

    if (
      !player.charging &&
      !state.pointerActive
    ) {
      return;
    }

    const length =
      player.charging
        ? 45 +
          player.charge *
            95
        : 60;

    const start = {
      x:
        player.pos.x +
        Math.cos(
          state.aimAngle,
        ) *
        20,
      y:
        player.pos.y +
        Math.sin(
          state.aimAngle,
        ) *
        20,
    };

    const end = {
      x:
        start.x +
        Math.cos(
          state.aimAngle,
        ) *
        length,
      y:
        start.y +
        Math.sin(
          state.aimAngle,
        ) *
        length,
    };

    ctx.save();

    ctx.strokeStyle =
      player.charging
        ? "rgba(202,255,50,.72)"
        : "rgba(202,255,50,.28)";

    ctx.lineWidth =
      player.charging
        ? 2.5
        : 1;

    ctx.setLineDash(
      player.charging
        ? []
        : [5, 5],
    );

    ctx.beginPath();

    ctx.moveTo(
      start.x,
      start.y,
    );

    ctx.lineTo(
      end.x,
      end.y,
    );

    ctx.stroke();

    ctx.fillStyle =
      "rgba(202,255,50,.85)";

    ctx.beginPath();

    ctx.arc(
      end.x,
      end.y,
      player.charging
        ? 4
        : 2.5,
      0,
      Math.PI * 2,
    );

    ctx.fill();

    ctx.restore();
  }

  function drawCountdown() {
    if (
      state.phase !==
      "countdown"
    ) {
      return;
    }

    const {
      width,
      height,
    } = getSize();

    const value =
      state.countdown > 0
        ? String(
            state.countdown,
          )
        : "FIGHT";

    ctx.save();

    ctx.fillStyle =
      "rgba(8,9,8,.28)";

    ctx.fillRect(
      0,
      0,
      width,
      height,
    );

    ctx.fillStyle =
      state.countdown > 0
        ? COLORS.white
        : COLORS.lime;

    ctx.font =
      `950 ${Math.min(
        72,
        width * 0.18,
      )}px ui-sans-serif, system-ui, sans-serif`;

    ctx.textAlign =
      "center";

    ctx.textBaseline =
      "middle";

    ctx.fillText(
      value,
      width / 2,
      height / 2,
    );

    ctx.restore();
  }

  function drawPerfectText() {
    if (
      state.perfectTimer <= 0
    ) {
      return;
    }

    const {
      width,
      height,
    } = getSize();

    const alpha =
      clamp(
        state.perfectTimer /
          1.25,
        0,
        1,
      );

    ctx.save();

    ctx.globalAlpha =
      alpha;

    ctx.fillStyle =
      COLORS.lime;

    ctx.font =
      `950 ${Math.min(
        30,
        width * 0.075,
      )}px ui-sans-serif, system-ui, sans-serif`;

    ctx.textAlign =
      "center";

    ctx.fillText(
      state.perfectText,
      width / 2,
      height * 0.15,
    );

    ctx.restore();
  }

  function drawTimer() {
    if (
      state.phase !==
      "playing"
    ) {
      return;
    }

    const {
      width,
    } = getSize();

    const seconds =
      Math.max(
        0,
        state.roundTime,
      );

    const text =
      seconds.toFixed(1);

    ctx.save();

    ctx.fillStyle =
      seconds <= 5
        ? COLORS.red
        : "rgba(255,255,255,.55)";

    ctx.font =
      `950 ${Math.min(
        18,
        width * 0.045,
      )}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;

    ctx.textAlign =
      "center";

    ctx.fillText(
      text,
      width / 2,
      23,
    );

    ctx.restore();
  }

  function updatePointer(
    event: PointerEvent,
  ) {
    const rect =
      canvas.getBoundingClientRect();

    state.pointer = {
      x:
        event.clientX -
        rect.left,
      y:
        event.clientY -
        rect.top,
    };

    state.pointerActive =
      true;

    if (
      state.phase ===
      "playing"
    ) {
      const direction =
        normalize(
          sub(
            state.pointer,
            state.player.pos,
          ),
        );

      if (
        Math.hypot(
          direction.x,
          direction.y,
        ) > 0.05
      ) {
        state.aimAngle =
          angleOf(
            direction,
          );
      }
    }
  }

  function handlePointerDown(
    event: PointerEvent,
  ) {
    if (
      state.phase !==
      "playing"
    ) {
      return;
    }

    event.preventDefault();

    unlockAudio();

    try {
      canvas.setPointerCapture(
        event.pointerId,
      );
    } catch {
      // Pointer capture can fail on some browsers.
    }

    state.pointerDown =
      true;

    updatePointer(
      event,
    );

    if (
      state.player.stunTimer <=
      0 &&
      !state.player.fallen
    ) {
      state.player.charging =
        true;

      state.player.charge =
        0;

      state.player.chargeTime =
        0;

      state.player.headAngle =
        state.aimAngle;
    }
  }

  function handlePointerMove(
    event: PointerEvent,
  ) {
    updatePointer(
      event,
    );

    if (
      state.player.recoveryWindow >
        0
    ) {
      return;
    }

    if (
      state.pointerDown &&
      state.phase ===
        "playing"
    ) {
      state.player.headAngle =
        state.aimAngle;
    }
  }

  function handlePointerUp(
    event: PointerEvent,
  ) {
    event.preventDefault();

    if (
      state.phase ===
        "playing" &&
      state.pointerDown
    ) {
      releasePlayerAttack();
    }

    state.pointerDown =
      false;
  }

  function handlePointerCancel(
    event: PointerEvent,
  ) {
    if (
      state.phase ===
        "playing" &&
      state.pointerDown
    ) {
      releasePlayerAttack();
    }

    state.pointerDown =
      false;

    try {
      canvas.releasePointerCapture(
        event.pointerId,
      );
    } catch {
      // Ignore.
    }
  }

  function handleKeyDown(
    event: KeyboardEvent,
  ) {
    if (
      event.key === "Escape"
    ) {
      if (
        state.phase ===
        "playing"
      ) {
        state.phase =
          "idle";

        resetMatch();
      }
    }

    if (
      event.code ===
      "Space"
    ) {
      event.preventDefault();

      if (
        state.phase ===
        "idle" ||
        state.phase ===
        "match-result"
      ) {
        startMatch();
      }
    }

    if (
      state.phase ===
      "playing"
    ) {
      if (
        event.key === "ArrowLeft"
      ) {
        state.aimAngle -=
          0.08;
      }

      if (
        event.key === "ArrowRight"
      ) {
        state.aimAngle +=
          0.08;
      }
    }
  }

  function onPrimaryClick() {
    unlockAudio();

    if (
      state.phase ===
      "idle" ||
      state.phase ===
      "match-result"
    ) {
      startMatch();
      return;
    }

    if (
      state.phase ===
      "round-result"
    ) {
      startNextRound();
    }
  }

  function onResetClick() {
    resetMatch();
  }

  function onSoundClick() {
    unlockAudio();

    if (
      state.audioReady
    ) {
      soundButton.textContent =
        "SOUND ON";

      beep(
        380,
        0.08,
        "sine",
        0.05,
      );
    } else {
      soundButton.textContent =
        "SOUND N/A";
    }
  }

  function onResize() {
    resizeCanvas();
  }

  function loop(
    now: number,
  ) {
    if (
      state.destroyed
    ) {
      return;
    }

    const deltaMs =
      clamp(
        now - lastTime,
        0,
        50,
      );

    lastTime =
      now;

    const dt =
      deltaMs /
      1000;

    update(dt);
    draw();

    animationFrame =
      requestAnimationFrame(
        loop,
      );
  }

  canvas.addEventListener(
    "pointerdown",
    handlePointerDown,
  );

  canvas.addEventListener(
    "pointermove",
    handlePointerMove,
  );

  canvas.addEventListener(
    "pointerup",
    handlePointerUp,
  );

  canvas.addEventListener(
    "pointercancel",
    handlePointerCancel,
  );

  canvas.addEventListener(
    "pointerleave",
    () => {
      state.pointerActive =
        false;
    },
  );

  primaryButton.addEventListener(
    "click",
    onPrimaryClick,
  );

  resetButton.addEventListener(
    "click",
    onResetClick,
  );

  soundButton.addEventListener(
    "click",
    onSoundClick,
  );

  abortButton.addEventListener(
    "click",
    onResetClick,
  );

  window.addEventListener(
    "keydown",
    handleKeyDown,
  );

  window.addEventListener(
    "resize",
    onResize,
  );

  if (
    "ResizeObserver" in window
  ) {
    resizeObserver =
      new ResizeObserver(
        resizeCanvas,
      );

    resizeObserver.observe(
      arenaWrap,
    );
  }

  resetMatch();

  animationFrame =
    requestAnimationFrame(
      loop,
    );

  return () => {
    state.destroyed =
      true;

    cancelAnimationFrame(
      animationFrame,
    );

    canvas.removeEventListener(
      "pointerdown",
      handlePointerDown,
    );

    canvas.removeEventListener(
      "pointermove",
      handlePointerMove,
    );

    canvas.removeEventListener(
      "pointerup",
      handlePointerUp,
    );

    canvas.removeEventListener(
      "pointercancel",
      handlePointerCancel,
    );

    primaryButton.removeEventListener(
      "click",
      onPrimaryClick,
    );

    resetButton.removeEventListener(
      "click",
      onResetClick,
    );

    soundButton.removeEventListener(
      "click",
      onSoundClick,
    );

    abortButton.removeEventListener(
      "click",
      onResetClick,
    );

    window.removeEventListener(
      "keydown",
      handleKeyDown,
    );

    window.removeEventListener(
      "resize",
      onResize,
    );

    resizeObserver?.disconnect();

    if (
      state.audioContext
    ) {
      void state.audioContext.close();
    }
  };
}