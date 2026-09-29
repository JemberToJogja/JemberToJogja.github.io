// src/games/route-404.ts

type Cleanup = () => void;

type Point = {
  x: number;
  y: number;
};

type NodeType = "normal" | "slow" | "down" | "danger" | "destination";

type RouteNode = {
  id: string;
  name: string;
  point: Point;
  type: NodeType;
  latency: number;
  active: boolean;
};

type RouteEdge = {
  from: string;
  to: string;
  risk: number;
  latency: number;
};

type Packet = {
  current: string;
  target: string;
  progress: number;
  speed: number;
  trail: Point[];
};

type GameState = {
  level: number;
  score: number;
  bestScore: number;
  timeLeft: number;
  totalTime: number;
  packetLoss: number;
  reroutes: number;
  delivered: boolean;
  gameOver: boolean;
  started: boolean;
  paused: boolean;
  route: string[];
  routeIndex: number;
  packet: Packet | null;
  nodes: RouteNode[];
  edges: RouteEdge[];
  currentNode: string;
  targetNode: string;
  message: string;
  messageTimer: number;
  glitchTimer: number;
  eventTimer: number;
  eventText: string;
  eventActive: boolean;
  deliveryTime: number;
  pulse: number;
};

const STORAGE_KEY = "jembertojogja-route-404-best";

const LEVELS = [
  {
    time: 18,
    speed: 0.00155,
    lossMultiplier: 1,
    title: "NORMAL DAY",
    subtitle: "THE NETWORK LOOKS FINE. PROBABLY.",
  },
  {
    time: 17,
    speed: 0.0017,
    lossMultiplier: 1.15,
    title: "NETWORK CONGESTION",
    subtitle: "EVERYONE DECIDED TO STREAM SOMETHING.",
  },
  {
    time: 16,
    speed: 0.00185,
    lossMultiplier: 1.3,
    title: "MIDNIGHT DEPLOY",
    subtitle: "SOMEONE DEPLOYED TO PRODUCTION.",
  },
  {
    time: 15,
    speed: 0.002,
    lossMultiplier: 1.5,
    title: "NODE DISASTER",
    subtitle: "MALANG IS HAVING A BAD DAY.",
  },
  {
    time: 14,
    speed: 0.0022,
    lossMultiplier: 1.7,
    title: "PRODUCTION",
    subtitle: "NOTHING IS SUPPOSED TO BE THIS STABLE.",
  },
  {
    time: 13,
    speed: 0.0024,
    lossMultiplier: 2,
    title: "NO INTERNET",
    subtitle: "GOOD LUCK.",
  },
];

const BASE_NODES: Omit<RouteNode, "active">[] = [
  {
    id: "jember",
    name: "JEMBER",
    point: { x: 0.1, y: 0.77 },
    type: "normal",
    latency: 38,
  },
  {
    id: "lumajang",
    name: "LUMAJANG",
    point: { x: 0.3, y: 0.61 },
    type: "normal",
    latency: 54,
  },
  {
    id: "probolinggo",
    name: "PROBOLINGGO",
    point: { x: 0.42, y: 0.29 },
    type: "slow",
    latency: 96,
  },
  {
    id: "malang",
    name: "MALANG",
    point: { x: 0.5, y: 0.74 },
    type: "danger",
    latency: 126,
  },
  {
    id: "kediri",
    name: "KEDIRI",
    point: { x: 0.66, y: 0.48 },
    type: "normal",
    latency: 88,
  },
  {
    id: "madiun",
    name: "MADIUN",
    point: { x: 0.78, y: 0.28 },
    type: "slow",
    latency: 118,
  },
  {
    id: "jogja",
    name: "JOGJA",
    point: { x: 0.91, y: 0.68 },
    type: "destination",
    latency: 42,
  },
];

const BASE_EDGES: RouteEdge[] = [
  { from: "jember", to: "lumajang", latency: 82, risk: 0.04 },
  { from: "jember", to: "malang", latency: 126, risk: 0.11 },
  { from: "lumajang", to: "probolinggo", latency: 78, risk: 0.07 },
  { from: "lumajang", to: "malang", latency: 68, risk: 0.06 },
  { from: "probolinggo", to: "kediri", latency: 124, risk: 0.15 },
  { from: "malang", to: "kediri", latency: 92, risk: 0.12 },
  { from: "malang", to: "madiun", latency: 154, risk: 0.17 },
  { from: "kediri", to: "madiun", latency: 72, risk: 0.09 },
  { from: "kediri", to: "jogja", latency: 106, risk: 0.1 },
  { from: "madiun", to: "jogja", latency: 94, risk: 0.08 },
];

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getStoredBest() {
  if (typeof window === "undefined") return 0;

  try {
    return Number(window.localStorage.getItem(STORAGE_KEY) || 0);
  } catch {
    return 0;
  }
}

function saveBest(score: number) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, String(score));
  } catch {
    // Ignore storage failures.
  }
}

function createStyles() {
  return `
    .route404 {
      --bg: #090909;
      --panel: #111111;
      --panel-2: #171717;
      --line: #2a2a2a;
      --text: #f4f4f0;
      --muted: #8e8e88;
      --accent: #c9ff32;
      --danger: #ff5a5f;
      --blue: #66aaff;
      width: 100%;
      max-width: 980px;
      margin: 0 auto;
      color: var(--text);
      font-family: inherit;
      user-select: none;
      -webkit-user-select: none;
      -webkit-tap-highlight-color: transparent;
    }

    .route404 * {
      box-sizing: border-box;
    }

    .route404__shell {
      position: relative;
      overflow: hidden;
      border: 1px solid var(--line);
      background: var(--bg);
      min-height: 680px;
    }

    .route404__scanlines,
    .route404__noise {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
    }

    .route404__scanlines {
      opacity: 0.11;
      background-size: 100% 6px;
      background-image:
        linear-gradient(
          to bottom,
          transparent 0,
          transparent 2px,
          rgba(255,255,255,.05) 2px,
          rgba(255,255,255,.05) 3px
        );
    }

    .route404__noise {
      opacity: 0.025;
      background-size: 3px 3px;
      background-image:
        linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px),
        linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px);
    }

    .route404__header {
      position: relative;
      z-index: 2;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 20px;
      padding: 20px;
      border-bottom: 1px solid var(--line);
    }

    .route404__eyebrow {
      margin-bottom: 5px;
      font-size: 10px;
      letter-spacing: .18em;
      color: var(--muted);
      font-weight: 800;
    }

    .route404__title {
      margin: 0;
      font-size: clamp(30px, 7vw, 64px);
      line-height: .88;
      letter-spacing: -.06em;
      font-weight: 950;
    }

    .route404__title span {
      color: var(--accent);
    }

    .route404__subtitle {
      max-width: 520px;
      margin: 14px 0 0;
      font-size: 11px;
      line-height: 1.6;
      color: #b8b8b2;
      text-transform: uppercase;
      letter-spacing: .06em;
    }

    .route404__status {
      min-width: 170px;
      align-self: start;
      border: 1px solid var(--line);
      background: #0d0d0d;
      padding: 14px;
    }

    .route404__status-label {
      margin-bottom: 8px;
      font-size: 9px;
      letter-spacing: .16em;
      color: var(--muted);
      font-weight: 800;
    }

    .route404__status-value {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 900;
      letter-spacing: .08em;
    }

    .route404__status-dot {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: var(--accent);
      box-shadow: 0 0 14px rgba(201,255,50,.6);
      animation: route404Blink 1s infinite alternate;
    }

    .route404__content {
      position: relative;
      z-index: 2;
      padding: 16px;
    }

    .route404__hud {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      border: 1px solid var(--line);
      background: var(--panel);
    }

    .route404__metric {
      min-width: 0;
      padding: 13px 14px;
      border-right: 1px solid var(--line);
    }

    .route404__metric:last-child {
      border-right: 0;
    }

    .route404__metric-label {
      margin-bottom: 4px;
      color: var(--muted);
      font-size: 8px;
      letter-spacing: .14em;
      font-weight: 800;
    }

    .route404__metric-value {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 18px;
      letter-spacing: -.02em;
      font-weight: 950;
    }

    .route404__metric-value.is-danger {
      color: var(--danger);
    }

    .route404__metric-value.is-accent {
      color: var(--accent);
    }

    .route404__map-wrap {
      position: relative;
      margin-top: 12px;
      border: 1px solid var(--line);
      background: #0c0c0c;
      overflow: hidden;
    }

    .route404__canvas {
      display: block;
      width: 100%;
      height: min(68vw, 540px);
      min-height: 340px;
      touch-action: none;
    }

    .route404__overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      pointer-events: none;
    }

    .route404__message {
      max-width: 460px;
      text-align: center;
      opacity: 0;
      transform: translateY(12px);
      transition:
        opacity .24s ease,
        transform .24s ease;
    }

    .route404__message.is-visible {
      opacity: 1;
      transform: translateY(0);
    }

    .route404__message-code {
      margin-bottom: 10px;
      font-size: 11px;
      letter-spacing: .2em;
      color: var(--accent);
      font-weight: 900;
    }

    .route404__message-title {
      margin: 0;
      font-size: clamp(28px, 7vw, 56px);
      line-height: .9;
      letter-spacing: -.05em;
      font-weight: 950;
    }

    .route404__message-copy {
      margin: 12px 0 0;
      color: #bcbcb5;
      font-size: 11px;
      line-height: 1.7;
      text-transform: uppercase;
      letter-spacing: .05em;
    }

    .route404__controls {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 8px;
      margin-top: 12px;
    }

    .route404__log {
      min-height: 64px;
      border: 1px solid var(--line);
      background: #0d0d0d;
      padding: 12px 14px;
      display: flex;
      align-items: center;
    }

    .route404__log-text {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 10px;
      line-height: 1.5;
      color: #b9b9b2;
    }

    .route404__log-text strong {
      color: var(--accent);
      font-weight: 900;
    }

    .route404__button {
      appearance: none;
      border: 1px solid var(--line);
      background: #161616;
      color: var(--text);
      padding: 0 18px;
      min-height: 64px;
      cursor: pointer;
      font: inherit;
      font-size: 10px;
      font-weight: 950;
      letter-spacing: .13em;
      transition:
        transform .16s ease,
        border-color .16s ease,
        background .16s ease;
    }

    .route404__button:hover {
      transform: translateY(-2px);
      border-color: #484848;
      background: #1d1d1d;
    }

    .route404__button:active {
      transform: translateY(0);
    }

    .route404__button--primary {
      color: #050505;
      background: var(--accent);
      border-color: var(--accent);
    }

    .route404__button--primary:hover {
      background: #d8ff66;
      border-color: #d8ff66;
    }

    .route404__instructions {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-top: 12px;
    }

    .route404__instruction {
      border: 1px solid var(--line);
      padding: 14px;
      background: #0f0f0f;
    }

    .route404__instruction-number {
      margin-bottom: 8px;
      font-size: 9px;
      color: var(--accent);
      font-weight: 950;
      letter-spacing: .15em;
    }

    .route404__instruction-title {
      margin: 0 0 6px;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: .03em;
    }

    .route404__instruction-copy {
      margin: 0;
      color: var(--muted);
      font-size: 10px;
      line-height: 1.6;
    }

    .route404__score-panel {
      display: none;
      position: absolute;
      inset: 0;
      z-index: 10;
      background: rgba(9,9,9,.94);
      padding: 24px;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .route404__score-panel.is-visible {
      display: flex;
    }

    .route404__score-box {
      width: min(100%, 520px);
      border: 1px solid #353535;
      background: #101010;
      padding: 28px 20px;
      box-shadow: 18px 18px 0 rgba(0,0,0,.32);
    }

    .route404__score-kicker {
      font-size: 10px;
      letter-spacing: .18em;
      color: var(--accent);
      font-weight: 900;
    }

    .route404__score-title {
      margin: 10px 0 0;
      font-size: clamp(36px, 10vw, 70px);
      line-height: .85;
      letter-spacing: -.06em;
      font-weight: 950;
    }

    .route404__score-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      margin-top: 22px;
      border-top: 1px solid var(--line);
      border-bottom: 1px solid var(--line);
    }

    .route404__score-metric {
      padding: 13px 8px;
      border-right: 1px solid var(--line);
    }

    .route404__score-metric:last-child {
      border-right: 0;
    }

    .route404__score-label {
      margin-bottom: 4px;
      color: var(--muted);
      font-size: 8px;
      letter-spacing: .1em;
    }

    .route404__score-value {
      font-size: 16px;
      font-weight: 950;
    }

    .route404__grade {
      margin: 22px 0 4px;
      font-size: 11px;
      letter-spacing: .15em;
      color: var(--muted);
    }

    .route404__grade-value {
      font-size: 40px;
      line-height: 1;
      color: var(--accent);
      font-weight: 950;
    }

    .route404__hint {
      margin-top: 12px;
      color: var(--muted);
      font-size: 10px;
      line-height: 1.6;
    }

    @keyframes route404Blink {
      from { opacity: .35; }
      to { opacity: 1; }
    }

    @media (max-width: 760px) {
      .route404__shell {
        min-height: 0;
      }

      .route404__header {
        grid-template-columns: 1fr;
        gap: 14px;
        padding: 16px;
      }

      .route404__status {
        min-width: 0;
      }

      .route404__content {
        padding: 10px;
      }

      .route404__hud {
        grid-template-columns: repeat(2, 1fr);
      }

      .route404__metric {
        border-right: 1px solid var(--line);
        border-bottom: 1px solid var(--line);
      }

      .route404__metric:nth-child(2n) {
        border-right: 0;
      }

      .route404__metric:nth-last-child(-n + 2) {
        border-bottom: 0;
      }

      .route404__canvas {
        height: 106vw;
        max-height: 620px;
        min-height: 360px;
      }

      .route404__controls {
        grid-template-columns: 1fr 1fr;
      }

      .route404__log {
        grid-column: 1 / -1;
        min-height: 72px;
      }

      .route404__button {
        min-height: 58px;
      }

      .route404__instructions {
        grid-template-columns: 1fr;
      }

      .route404__score-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .route404__score-metric:nth-child(1),
      .route404__score-metric:nth-child(2) {
        border-bottom: 1px solid var(--line);
      }

      .route404__score-metric:nth-child(2) {
        border-right: 0;
      }

      .route404__score-metric:nth-child(4) {
        border-right: 0;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .route404__status-dot,
      .route404__button,
      .route404__message {
        animation: none !important;
        transition: none !important;
      }
    }
  `;
}

export function mountGame(root: HTMLElement): Cleanup {
  root.innerHTML = `
    <section class="route404" data-route404>
      <style>${createStyles()}</style>

      <div class="route404__shell">
        <div class="route404__scanlines"></div>
        <div class="route404__noise"></div>

        <header class="route404__header">
          <div>
            <div class="route404__eyebrow">JEMBERTOJOGJA / NETWORK GAME</div>
            <h2 class="route404__title">
              ROUTE <span>404</span>
            </h2>
            <p class="route404__subtitle">
              Jember → Jogja. Route the packet. Avoid the chaos.
            </p>
          </div>

          <div class="route404__status">
            <div class="route404__status-label">NETWORK STATUS</div>
            <div class="route404__status-value">
              <span class="route404__status-dot"></span>
              <span data-status-text>ONLINE</span>
            </div>
          </div>
        </header>

        <div class="route404__content">
          <div class="route404__hud">
            <div class="route404__metric">
              <div class="route404__metric-label">TIME LEFT</div>
              <div class="route404__metric-value is-accent" data-time>18.0s</div>
            </div>

            <div class="route404__metric">
              <div class="route404__metric-label">LATENCY</div>
              <div class="route404__metric-value" data-latency>038ms</div>
            </div>

            <div class="route404__metric">
              <div class="route404__metric-label">PACKET LOSS</div>
              <div class="route404__metric-value" data-loss>0%</div>
            </div>

            <div class="route404__metric">
              <div class="route404__metric-label">REROUTES</div>
              <div class="route404__metric-value" data-reroutes>0</div>
            </div>

            <div class="route404__metric">
              <div class="route404__metric-label">SCORE</div>
              <div class="route404__metric-value" data-score>0</div>
            </div>
          </div>

          <div class="route404__map-wrap">
            <canvas class="route404__canvas"></canvas>

            <div class="route404__overlay">
              <div class="route404__message" data-message>
                <div class="route404__message-code" data-message-code>LEVEL 01</div>
                <h3 class="route404__message-title" data-message-title>
                  READY?
                </h3>
                <p class="route404__message-copy" data-message-copy>
                  TAP A NODE TO START ROUTING.
                </p>
              </div>
            </div>
          </div>

          <div class="route404__controls">
            <div class="route404__log">
              <div class="route404__log-text" data-log>
                <strong>&gt;_ SYSTEM</strong> waiting for packet route...
              </div>
            </div>

            <button
              class="route404__button route404__button--primary"
              type="button"
              data-start
            >
              START
            </button>

            <button
              class="route404__button"
              type="button"
              data-reset
            >
              RESET
            </button>
          </div>

          <div class="route404__instructions">
            <article class="route404__instruction">
              <div class="route404__instruction-number">01 / ROUTE</div>
              <h3 class="route404__instruction-title">Choose a node</h3>
              <p class="route404__instruction-copy">
                Tap a connected node to move the packet forward.
              </p>
            </article>

            <article class="route404__instruction">
              <div class="route404__instruction-number">02 / SURVIVE</div>
              <h3 class="route404__instruction-title">Avoid bad routes</h3>
              <p class="route404__instruction-copy">
                High-risk links can destroy the packet before it arrives.
              </p>
            </article>

            <article class="route404__instruction">
              <div class="route404__instruction-number">03 / DELIVER</div>
              <h3 class="route404__instruction-title">Reach JOGJA</h3>
              <p class="route404__instruction-copy">
                Deliver the packet before the clock reaches zero.
              </p>
            </article>
          </div>
        </div>

        <div class="route404__score-panel" data-score-panel>
          <div class="route404__score-box">
            <div class="route404__score-kicker" data-result-kicker>
              DELIVERY COMPLETE
            </div>

            <div class="route404__score-title" data-result-score>
              0
            </div>

            <div class="route404__score-grid">
              <div class="route404__score-metric">
                <div class="route404__score-label">TIME</div>
                <div class="route404__score-value" data-result-time>0.0s</div>
              </div>

              <div class="route404__score-metric">
                <div class="route404__score-label">LATENCY</div>
                <div class="route404__score-value" data-result-latency>0ms</div>
              </div>

              <div class="route404__score-metric">
                <div class="route404__score-label">LOSS</div>
                <div class="route404__score-value" data-result-loss>0%</div>
              </div>

              <div class="route404__score-metric">
                <div class="route404__score-label">REROUTES</div>
                <div class="route404__score-value" data-result-reroutes>0</div>
              </div>
            </div>

            <div class="route404__grade">NETWORK GRADE</div>
            <div class="route404__grade-value" data-result-grade>A+</div>

            <p class="route404__hint" data-result-hint>
              Your packet survived the journey.
            </p>

            <button
              class="route404__button route404__button--primary"
              type="button"
              data-next
              style="margin-top:18px; width:100%;"
            >
              NEXT LEVEL
            </button>
          </div>
        </div>
      </div>
    </section>
  `;

  const canvas = root.querySelector(
    ".route404__canvas",
  ) as HTMLCanvasElement | null;

  const ctx = canvas?.getContext("2d");

  if (!canvas || !ctx) {
    return () => {};
  }

  const shell = root.querySelector(".route404__shell") as HTMLElement;
  const startButton = root.querySelector(
    "[data-start]",
  ) as HTMLButtonElement;
  const resetButton = root.querySelector(
    "[data-reset]",
  ) as HTMLButtonElement;
  const nextButton = root.querySelector(
    "[data-next]",
  ) as HTMLButtonElement;

  const timeEl = root.querySelector("[data-time]") as HTMLElement;
  const latencyEl = root.querySelector("[data-latency]") as HTMLElement;
  const lossEl = root.querySelector("[data-loss]") as HTMLElement;
  const reroutesEl = root.querySelector("[data-reroutes]") as HTMLElement;
  const scoreEl = root.querySelector("[data-score]") as HTMLElement;
  const statusText = root.querySelector(
    "[data-status-text]",
  ) as HTMLElement;
  const logEl = root.querySelector("[data-log]") as HTMLElement;

  const message = root.querySelector("[data-message]") as HTMLElement;
  const messageCode = root.querySelector(
    "[data-message-code]",
  ) as HTMLElement;
  const messageTitle = root.querySelector(
    "[data-message-title]",
  ) as HTMLElement;
  const messageCopy = root.querySelector(
    "[data-message-copy]",
  ) as HTMLElement;

  const scorePanel = root.querySelector(
    "[data-score-panel]",
  ) as HTMLElement;

  const resultKicker = root.querySelector(
    "[data-result-kicker]",
  ) as HTMLElement;
  const resultScore = root.querySelector(
    "[data-result-score]",
  ) as HTMLElement;
  const resultTime = root.querySelector(
    "[data-result-time]",
  ) as HTMLElement;
  const resultLatency = root.querySelector(
    "[data-result-latency]",
  ) as HTMLElement;
  const resultLoss = root.querySelector(
    "[data-result-loss]",
  ) as HTMLElement;
  const resultReroutes = root.querySelector(
    "[data-result-reroutes]",
  ) as HTMLElement;
  const resultGrade = root.querySelector(
    "[data-result-grade]",
  ) as HTMLElement;
  const resultHint = root.querySelector(
    "[data-result-hint]",
  ) as HTMLElement;

  let animationFrame = 0;
  let lastTime = performance.now();
  let destroyed = false;
  let resizeObserver: ResizeObserver | null = null;

  const state: GameState = {
    level: 1,
    score: 0,
    bestScore: getStoredBest(),
    timeLeft: LEVELS[0].time,
    totalTime: LEVELS[0].time,
    packetLoss: 0,
    reroutes: 0,
    delivered: false,
    gameOver: false,
    started: false,
    paused: false,
    route: [],
    routeIndex: 0,
    packet: null,
    nodes: [],
    edges: [],
    currentNode: "jember",
    targetNode: "jogja",
    message: "",
    messageTimer: 0,
    glitchTimer: 0,
    eventTimer: 0,
    eventText: "",
    eventActive: false,
    deliveryTime: 0,
    pulse: 0,
  };

  const pointer = {
    x: 0,
    y: 0,
    active: false,
  };

  function showMessage(
    code: string,
    title: string,
    copy: string,
    duration = 1800,
  ) {
    messageCode.textContent = code;
    messageTitle.textContent = title;
    messageCopy.textContent = copy;

    message.classList.add("is-visible");

    state.messageTimer = duration;
  }

  function hideMessage() {
    message.classList.remove("is-visible");
  }

  function setLog(content: string) {
    logEl.innerHTML = content;
  }

  function setStatus(text: string, danger = false) {
    statusText.textContent = text;
    statusText.style.color = danger ? "var(--danger)" : "";
  }

  function cloneNodes(level: number): RouteNode[] {
    return BASE_NODES.map((node) => {
      let type = node.type;

      if (level >= 3 && node.id === "probolinggo") {
        type = "down";
      }

      if (level >= 4 && node.id === "malang") {
        type = "danger";
      }

      if (level >= 5 && node.id === "madiun") {
        type = Math.random() > 0.35 ? "danger" : "slow";
      }

      return {
        ...node,
        type,
        active: true,
      };
    });
  }

  function cloneEdges(level: number): RouteEdge[] {
    return BASE_EDGES.map((edge) => {
      let risk = edge.risk;
      let latency = edge.latency;

      if (level >= 2) {
        risk += 0.03;
        latency += 10;
      }

      if (level >= 4) {
        risk += 0.04;
        latency += 12;
      }

      return {
        ...edge,
        risk: clamp(risk, 0, 0.92),
        latency,
      };
    }).filter((edge) => {
      if (level >= 3) {
        return !(
          (edge.from === "probolinggo" &&
            edge.to === "kediri") ||
          (edge.from === "kediri" &&
            edge.to === "probolinggo")
        );
      }

      return true;
    });
  }

  function getNode(id: string) {
    return state.nodes.find((node) => node.id === id) ?? null;
  }

  function getEdge(from: string, to: string) {
    return (
      state.edges.find(
        (edge) =>
          (edge.from === from && edge.to === to) ||
          (edge.from === to && edge.to === from),
      ) ?? null
    );
  }

  function connectedEdges(nodeId: string) {
    return state.edges.filter(
      (edge) =>
        edge.from === nodeId ||
        edge.to === nodeId,
    );
  }

  function getNeighbors(nodeId: string) {
    return connectedEdges(nodeId)
      .map((edge) => (edge.from === nodeId ? edge.to : edge.from))
      .filter((id) => {
        const node = getNode(id);
        return node?.active !== false;
      });
  }

  function getCanvasPoint(node: RouteNode) {
    return {
      x: node.point.x * canvas.width,
      y: node.point.y * canvas.height,
    };
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    draw();
  }

  function logicalSize() {
    const rect = canvas.getBoundingClientRect();

    return {
      width: rect.width,
      height: rect.height,
    };
  }

  function getLogicalNodePoint(node: RouteNode) {
    const size = logicalSize();

    return {
      x: node.point.x * size.width,
      y: node.point.y * size.height,
    };
  }

  function routeContains(a: string, b: string) {
    return state.route.some((nodeId, index) => {
      if (index === 0) return false;

      return (
        state.route[index - 1] === a &&
        nodeId === b
      );
    });
  }

  function findBestPath(): string[] {
    const queue: { id: string; path: string[]; cost: number }[] = [
      {
        id: "jember",
        path: ["jember"],
        cost: 0,
      },
    ];

    const visited = new Set<string>();

    while (queue.length) {
      queue.sort((a, b) => a.cost - b.cost);

      const current = queue.shift();

      if (!current) break;

      if (current.id === "jogja") {
        return current.path;
      }

      if (visited.has(current.id)) continue;

      visited.add(current.id);

      for (const next of getNeighbors(current.id)) {
        if (visited.has(next)) continue;

        const edge = getEdge(current.id, next);

        if (!edge) continue;

        queue.push({
          id: next,
          path: [...current.path, next],
          cost:
            current.cost +
            edge.latency +
            edge.risk * 600,
        });
      }
    }

    return ["jember", "lumajang", "malang", "kediri", "jogja"];
  }

  function resetLevel(level = state.level) {
    const config =
      LEVELS[
        clamp(level - 1, 0, LEVELS.length - 1)
      ];

    state.level = level;
    state.score = 0;
    state.timeLeft = config.time;
    state.totalTime = config.time;
    state.packetLoss = 0;
    state.reroutes = 0;
    state.delivered = false;
    state.gameOver = false;
    state.started = false;
    state.paused = false;
    state.route = [];
    state.routeIndex = 0;
    state.packet = null;
    state.currentNode = "jember";
    state.targetNode = "jogja";
    state.message = "";
    state.messageTimer = 0;
    state.glitchTimer = 0;
    state.eventTimer = random(3.5, 6.5);
    state.eventText = "";
    state.eventActive = false;
    state.deliveryTime = 0;
    state.pulse = 0;

    state.nodes = cloneNodes(level);
    state.edges = cloneEdges(level);

    setStatus("ONLINE");
    setLog(
      `<strong>&gt;_ SYSTEM</strong> level ${String(level).padStart(2, "0")} loaded. Select START.`,
    );

    hideMessage();
    scorePanel.classList.remove("is-visible");
    startButton.textContent = "START";

    updateHUD();
    draw();
  }

  function begin() {
    if (state.gameOver) {
      resetLevel(state.level);
    }

    state.started = true;
    state.paused = false;
    state.delivered = false;
    state.gameOver = false;
    state.packetLoss = 0;
    state.reroutes = 0;

    const bestPath = findBestPath();

    state.route = [bestPath[0]];
    state.routeIndex = 0;
    state.currentNode = "jember";
    state.targetNode = "jogja";

    state.packet = {
      current: "jember",
      target: bestPath[1] || "jogja",
      progress: 0,
      speed: LEVELS[state.level - 1]?.speed || 0.0018,
      trail: [],
    };

    startButton.textContent = "PAUSE";

    showMessage(
      `LEVEL ${String(state.level).padStart(2, "0")}`,
      LEVELS[state.level - 1]?.title || "NETWORK",
      LEVELS[state.level - 1]?.subtitle || "ROUTE THE PACKET.",
      1500,
    );

    setLog(
      `<strong>&gt;_ PACKET</strong> launched from JEMBER. Choose the next node.`,
    );

    setStatus("ROUTING");
  }

  function pause() {
    if (!state.started || state.delivered || state.gameOver) return;

    state.paused = !state.paused;
    startButton.textContent = state.paused ? "RESUME" : "PAUSE";

    if (state.paused) {
      setStatus("PAUSED");
      showMessage(
        "SYSTEM",
        "PAUSED",
        "THE PACKET IS WAITING.",
        1200,
      );
    } else {
      setStatus("ROUTING");
      hideMessage();
    }
  }

  function movePacketTo(nextId: string) {
    if (!state.started || state.paused) return;
    if (!state.packet) return;
    if (state.delivered || state.gameOver) return;

    const current = state.currentNode;

    if (nextId === current) return;

    const neighbors = getNeighbors(current);

    if (!neighbors.includes(nextId)) {
      setLog(
        `<strong>&gt;_ ERROR</strong> route unavailable from ${current.toUpperCase()}.`,
      );

      state.glitchTimer = 260;
      return;
    }

    const edge = getEdge(current, nextId);

    if (!edge) return;

    state.reroutes += 1;

    const levelConfig =
      LEVELS[state.level - 1] || LEVELS[0];

    const routeRisk =
      edge.risk * levelConfig.lossMultiplier;

    const packetBreaks =
      Math.random() < routeRisk;

    state.currentNode = nextId;

    state.packet = {
      ...state.packet,
      current,
      target: nextId,
      progress: 0,
      trail: [],
    };

    if (packetBreaks) {
      const lossAmount = Math.max(
        7,
        Math.round(routeRisk * 100),
      );

      state.packetLoss = clamp(
        state.packetLoss + lossAmount,
        0,
        100,
      );

      state.glitchTimer = 700;

      setLog(
        `<strong>&gt;_ PACKET LOSS</strong> ${current.toUpperCase()} → ${nextId.toUpperCase()} / ${lossAmount}% packet corrupted.`,
      );

      if (state.packetLoss >= 55) {
        failGame("PACKET DESTROYED");
        return;
      }
    } else {
      setLog(
        `<strong>&gt;_ ROUTE</strong> ${current.toUpperCase()} → ${nextId.toUpperCase()} / ${edge.latency}ms`,
      );
    }

    const target = getNode(nextId);

    if (target?.type === "down") {
      state.packetLoss = clamp(
        state.packetLoss + 12,
        0,
        100,
      );

      state.glitchTimer = 950;

      setLog(
        `<strong>&gt;_ NODE DOWN</strong> ${nextId.toUpperCase()} is unstable.`,
      );
    }

    if (nextId === "jogja") {
      deliverPacket();
    }
  }

  function deliverPacket() {
    state.delivered = true;
    state.started = false;
    state.paused = false;

    state.deliveryTime =
      state.totalTime - state.timeLeft;

    state.score = calculateScore();

    if (state.score > state.bestScore) {
      state.bestScore = state.score;
      saveBest(state.bestScore);
    }

    setStatus("DELIVERED");
    startButton.textContent = "START";

    setLog(
      `<strong>&gt;_ DELIVERY</strong> packet arrived in JOGJA.`,
    );

    showResult(true);
  }

  function failGame(reason: string) {
    state.gameOver = true;
    state.started = false;
    state.paused = false;

    setStatus("OFFLINE", true);
    startButton.textContent = "RETRY";

    setLog(
      `<strong>&gt;_ FATAL</strong> ${reason.toUpperCase()}.`,
    );

    showResult(false, reason);
  }

  function calculateScore() {
    const timeBonus = Math.max(
      0,
      Math.round(state.timeLeft * 120),
    );

    const lossPenalty =
      state.packetLoss * 12;

    const reroutePenalty =
      Math.max(0, state.reroutes - 3) * 35;

    const routeEfficiency =
      Math.max(
        0,
        500 - state.route.length * 35,
      );

    return Math.max(
      0,
      Math.round(
        1000 +
          timeBonus +
          routeEfficiency -
          lossPenalty -
          reroutePenalty,
      ),
    );
  }

  function calculateGrade() {
    if (state.gameOver) return "F";

    const score = state.score;

    if (score >= 2600) return "S";
    if (score >= 2200) return "A+";
    if (score >= 1850) return "A";
    if (score >= 1500) return "B+";
    if (score >= 1200) return "B";
    return "C";
  }

  function showResult(success: boolean, reason = "") {
    resultKicker.textContent = success
      ? "DELIVERY COMPLETE"
      : "NETWORK FAILURE";

    resultScore.textContent = success
      ? String(state.score)
      : "404";

    resultTime.textContent = success
      ? `${state.deliveryTime.toFixed(1)}s`
      : `${Math.max(0, state.deliveryTime).toFixed(1)}s`;

    resultLatency.textContent = `${
      Math.round(getRouteLatency())
    }ms`;

    resultLoss.textContent = `${state.packetLoss}%`;

    resultReroutes.textContent = String(
      state.reroutes,
    );

    resultGrade.textContent =
      calculateGrade();

    if (success) {
      resultHint.textContent =
        state.level < LEVELS.length
          ? `Level ${state.level} complete. The packet survived. Barely.`
          : "You survived the entire Jember → Jogja network.";
    } else {
      resultHint.textContent =
        reason ||
        "The network has rejected your existence.";
    }

    nextButton.textContent =
      success && state.level < LEVELS.length
        ? "NEXT LEVEL"
        : success
          ? "PLAY AGAIN"
          : "RETRY";

    scorePanel.classList.add("is-visible");
  }

  function getRouteLatency() {
    if (state.route.length < 2) {
      const node = getNode(
        state.currentNode,
      );

      return node?.latency || 38;
    }

    let total = 0;

    for (let i = 1; i < state.route.length; i++) {
      const edge = getEdge(
        state.route[i - 1],
        state.route[i],
      );

      total += edge?.latency || 0;
    }

    return total;
  }

  function getNodeHit(
    clientX: number,
    clientY: number,
  ): string | null {
    const rect = canvas.getBoundingClientRect();

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const size = logicalSize();

    for (const node of state.nodes) {
      if (!node.active) continue;

      const point = {
        x: node.point.x * size.width,
        y: node.point.y * size.height,
      };

      const dx = x - point.x;
      const dy = y - point.y;

      const radius = window.innerWidth < 700 ? 27 : 23;

      if (dx * dx + dy * dy <= radius * radius) {
        return node.id;
      }
    }

    return null;
  }

  function handlePointer(event: PointerEvent) {
    if (!state.started || state.paused) return;

    const nodeId = getNodeHit(
      event.clientX,
      event.clientY,
    );

    if (!nodeId) return;

    movePacketTo(nodeId);
  }

  function updateHUD() {
    const time = Math.max(
      0,
      state.timeLeft,
    );

    timeEl.textContent = `${time.toFixed(1)}s`;

    timeEl.classList.toggle(
      "is-danger",
      time <= 5,
    );

    const currentNode = getNode(
      state.currentNode,
    );

    latencyEl.textContent = `${String(
      Math.round(
        currentNode?.latency ||
          getRouteLatency() ||
          38,
      ),
    ).padStart(3, "0")}ms`;

    lossEl.textContent = `${state.packetLoss}%`;

    lossEl.classList.toggle(
      "is-danger",
      state.packetLoss >= 30,
    );

    reroutesEl.textContent = String(
      state.reroutes,
    );

    scoreEl.textContent = String(
      state.score,
    );
  }

  function update(deltaMs: number) {
    if (!state.started || state.paused) {
      state.pulse += deltaMs * 0.001;
      return;
    }

    const delta = deltaMs / 1000;

    state.timeLeft -= delta;
    state.eventTimer -= delta;
    state.messageTimer -= deltaMs;

    if (state.glitchTimer > 0) {
      state.glitchTimer -= deltaMs;
    }

    state.pulse += delta;

    if (
      state.messageTimer <= 0
    ) {
      hideMessage();
    }

    if (
      state.eventTimer <= 0 &&
      !state.eventActive
    ) {
      triggerEvent();
    }

    if (
      state.eventActive
    ) {
      state.eventTimer -= delta;

      if (state.eventTimer <= -2.2) {
        endEvent();
      }
    }

    if (state.packet) {
      state.packet.progress +=
        deltaMs *
        state.packet.speed;

      updatePacketTrail();

      if (
        state.packet.progress >= 1
      ) {
        state.packet.progress = 1;
      }
    }

    if (
      state.timeLeft <= 0 &&
      !state.delivered &&
      !state.gameOver
    ) {
      state.timeLeft = 0;
      failGame("TIMEOUT");
    }

    updateHUD();
  }

  function updatePacketTrail() {
    if (!state.packet) return;

    const current = getNode(
      state.packet.current,
    );

    const target = getNode(
      state.packet.target,
    );

    if (!current || !target) return;

    const start =
      getLogicalNodePoint(current);

    const end =
      getLogicalNodePoint(target);

    const t =
      clamp(
        state.packet.progress,
        0,
        1,
      );

    const x =
      start.x +
      (end.x - start.x) * t;

    const y =
      start.y +
      (end.y - start.y) * t;

    state.packet.trail.push({
      x,
      y,
    });

    if (
      state.packet.trail.length > 12
    ) {
      state.packet.trail.shift();
    }
  }

  function triggerEvent() {
    state.eventActive = true;

    const events = [
      {
        text: "LATENCY SPIKE",
        log: "LATENCY SPIKE detected on the network.",
      },
      {
        text: "PACKET LOSS",
        log: "Packet loss increasing. Everybody remain calm.",
      },
      {
        text: "NODE WARNING",
        log: "A node has started behaving suspiciously.",
      },
      {
        text: "PRODUCTION DEPLOY",
        log: "Someone pushed directly to production.",
      },
    ];

    const event =
      events[
        Math.floor(
          Math.random() * events.length,
        )
      ];

    state.eventText = event.text;
    state.eventTimer = 0;

    setStatus("UNSTABLE", true);

    setLog(
      `<strong>&gt;_ EVENT</strong> ${event.log}`,
    );
  }

  function endEvent() {
    state.eventActive = false;
    state.eventTimer = random(4, 7);

    if (!state.gameOver && !state.delivered) {
      setStatus(
        state.started ? "ROUTING" : "ONLINE",
      );
    }
  }

  function draw() {
    const rect = canvas.getBoundingClientRect();

    if (!rect.width || !rect.height) {
      return;
    }

    const width = rect.width;
    const height = rect.height;

    ctx.save();

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height,
    );

    ctx.fillStyle = "#0c0c0c";
    ctx.fillRect(
      0,
      0,
      width,
      height,
    );

    drawGrid(width, height);
    drawDecor(width, height);
    drawEdges(width, height);
    drawRoute(width, height);
    drawNodes(width, height);
    drawPacket();
    drawEvent(width, height);
    drawPointer();

    ctx.restore();
  }

  function drawGrid(
    width: number,
    height: number,
  ) {
    ctx.save();

    ctx.strokeStyle =
      "rgba(255,255,255,.055)";
    ctx.lineWidth = 1;

    const step =
      window.innerWidth < 700
        ? 28
        : 34;

    for (
      let x = 0;
      x <= width;
      x += step
    ) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (
      let y = 0;
      y <= height;
      y += step
    ) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawDecor(
    width: number,
    height: number,
  ) {
    ctx.save();

    ctx.fillStyle =
      "rgba(201,255,50,.04)";

    ctx.fillRect(
      0,
      height * 0.54,
      width,
      height * 0.46,
    );

    ctx.strokeStyle =
      "rgba(201,255,50,.12)";
    ctx.lineWidth = 1;

    const waveY =
      height *
      (0.5 +
        Math.sin(state.pulse * 0.5) *
          0.02);

    ctx.beginPath();

    for (
      let x = 0;
      x <= width;
      x += 8
    ) {
      const y =
        waveY +
        Math.sin(
          x * 0.02 +
            state.pulse,
        ) *
          5;

      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();

    ctx.restore();
  }

  function drawEdges(
    width: number,
    height: number,
  ) {
    for (const edge of state.edges) {
      const from = getNode(edge.from);
      const to = getNode(edge.to);

      if (!from || !to) continue;

      const a =
        getLogicalNodePoint(from);

      const b =
        getLogicalNodePoint(to);

      const active =
        edge.from === state.currentNode ||
        edge.to === state.currentNode;

      const route =
        routeContains(edge.from, edge.to) ||
        routeContains(edge.to, edge.from);

      ctx.save();

      ctx.beginPath();

      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);

      if (route) {
        ctx.strokeStyle =
          "rgba(201,255,50,.75)";
        ctx.lineWidth = 3;
      } else if (active) {
        ctx.strokeStyle =
          "rgba(201,255,50,.23)";
        ctx.lineWidth = 2;
      } else {
        ctx.strokeStyle =
          "rgba(255,255,255,.12)";
        ctx.lineWidth = 1;
      }

      if (edge.risk > 0.25) {
        ctx.setLineDash([5, 6]);
      }

      ctx.stroke();

      if (active) {
        const mx =
          (a.x + b.x) / 2;
        const my =
          (a.y + b.y) / 2;

        ctx.fillStyle =
          edge.risk > 0.25
            ? "rgba(255,90,95,.75)"
            : "rgba(255,255,255,.28)";

        ctx.font =
          "800 8px ui-monospace, monospace";

        ctx.textAlign = "center";
        ctx.fillText(
          `${edge.latency}ms`,
          mx,
          my - 7,
        );
      }

      ctx.restore();
    }
  }

  function drawRoute(
    width: number,
    height: number,
  ) {
    if (state.route.length < 2) return;

    ctx.save();

    ctx.beginPath();

    for (
      let i = 0;
      i < state.route.length;
      i++
    ) {
      const node =
        getNode(state.route[i]);

      if (!node) continue;

      const p =
        getLogicalNodePoint(node);

      if (i === 0) {
        ctx.moveTo(p.x, p.y);
      } else {
        ctx.lineTo(p.x, p.y);
      }
    }

    ctx.strokeStyle =
      "rgba(201,255,50,.18)";
    ctx.lineWidth = 7;
    ctx.stroke();

    ctx.restore();
  }

  function drawNodes(
    width: number,
    height: number,
  ) {
    for (const node of state.nodes) {
      const p =
        getLogicalNodePoint(node);

      const isCurrent =
        node.id === state.currentNode;

      const isTarget =
        node.id === "jogja";

      const isReachable =
        state.started &&
        !state.paused &&
        getNeighbors(
          state.currentNode,
        ).includes(node.id);

      const radius =
        window.innerWidth < 700
          ? 8
          : 9;

      ctx.save();

      if (
        node.type === "down"
      ) {
        ctx.strokeStyle =
          "rgba(255,90,95,.8)";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.arc(
          p.x,
          p.y,
          radius + 5,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
      }

      if (
        isCurrent ||
        isTarget
      ) {
        const pulse =
          Math.sin(
            state.pulse * 4,
          ) *
          3;

        ctx.fillStyle =
          isTarget
            ? "rgba(201,255,50,.08)"
            : "rgba(255,255,255,.05)";

        ctx.beginPath();
        ctx.arc(
          p.x,
          p.y,
          radius +
            11 +
            pulse,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }

      if (isReachable) {
        ctx.fillStyle =
          "rgba(201,255,50,.12)";

        ctx.beginPath();
        ctx.arc(
          p.x,
          p.y,
          radius + 8,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }

      ctx.fillStyle =
        node.type === "down"
          ? "#ff5a5f"
          : isTarget
            ? "#c9ff32"
            : isCurrent
              ? "#ffffff"
              : "#151515";

      ctx.strokeStyle =
        isReachable
          ? "#c9ff32"
          : "#525252";

      ctx.lineWidth =
        isReachable
          ? 2
          : 1;

      ctx.beginPath();
      ctx.arc(
        p.x,
        p.y,
        radius,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle =
        isTarget
          ? "#c9ff32"
          : node.type === "down"
            ? "#ff5a5f"
            : "#8d8d86";

      ctx.font =
        "900 9px ui-monospace, monospace";

      ctx.textAlign = "center";
      ctx.fillText(
        node.name,
        p.x,
        p.y + radius + 16,
      );

      if (
        node.type === "slow"
      ) {
        ctx.fillStyle =
          "#666660";

        ctx.font =
          "800 7px ui-monospace, monospace";

        ctx.fillText(
          "SLOW",
          p.x,
          p.y +
            radius +
            26,
        );
      }

      if (
        node.type === "danger"
      ) {
        ctx.fillStyle =
          "#ff5a5f";

        ctx.font =
          "800 7px ui-monospace, monospace";

        ctx.fillText(
          "RISK",
          p.x,
          p.y +
            radius +
            26,
        );
      }

      if (
        node.type === "down"
      ) {
        ctx.fillStyle =
          "#ff5a5f";

        ctx.font =
          "800 7px ui-monospace, monospace";

        ctx.fillText(
          "DOWN",
          p.x,
          p.y +
            radius +
            26,
        );
      }

      ctx.restore();
    }
  }

  function drawPacket() {
    if (!state.packet) return;

    const current =
      getNode(state.packet.current);

    const target =
      getNode(state.packet.target);

    if (!current || !target) {
      return;
    }

    const start =
      getLogicalNodePoint(current);

    const end =
      getLogicalNodePoint(target);

    const t =
      clamp(
        state.packet.progress,
        0,
        1,
      );

    const eased =
      t * t * (3 - 2 * t);

    const x =
      start.x +
      (end.x - start.x) *
        eased;

    const y =
      start.y +
      (end.y - start.y) *
        eased;

    if (
      state.packet.trail.length
    ) {
      ctx.save();

      for (
        let i = 0;
        i <
        state.packet.trail.length;
        i++
      ) {
        const point =
          state.packet.trail[i];

        const alpha =
          i /
          state.packet.trail.length;

        const size =
          1 +
          alpha *
            3.5;

        ctx.fillStyle =
          `rgba(201,255,50,${alpha * 0.4})`;

        ctx.beginPath();

        ctx.arc(
          point.x,
          point.y,
          size,
          0,
          Math.PI * 2,
        );

        ctx.fill();
      }

      ctx.restore();
    }

    ctx.save();

    const glow =
      12 +
      Math.sin(
        state.pulse * 8,
      ) *
        3;

    ctx.shadowBlur = glow;
    ctx.shadowColor =
      "#c9ff32";

    ctx.fillStyle =
      "#c9ff32";

    ctx.fillRect(
      x - 5,
      y - 5,
      10,
      10,
    );

    ctx.shadowBlur = 0;

    ctx.fillStyle =
      "#050505";

    ctx.fillRect(
      x - 2,
      y - 2,
      4,
      4,
    );

    ctx.restore();

    if (
      state.glitchTimer > 0
    ) {
      ctx.save();

      const offset =
        random(-5, 5);

      ctx.fillStyle =
        "rgba(255,90,95,.4)";

      ctx.fillRect(
        x - 10 + offset,
        y - 2,
        20,
        2,
      );

      ctx.fillStyle =
        "rgba(201,255,50,.5)";

      ctx.fillRect(
        x - 7 - offset,
        y + 4,
        14,
        2,
      );

      ctx.restore();
    }
  }

  function drawEvent(
    width: number,
    height: number,
  ) {
    if (
      !state.eventActive
    ) {
      return;
    }

    ctx.save();

    ctx.fillStyle =
      "rgba(255,90,95,.06)";

    ctx.fillRect(
      0,
      0,
      width,
      height,
    );

    ctx.strokeStyle =
      "rgba(255,90,95,.18)";
    ctx.lineWidth = 2;

    ctx.strokeRect(
      12,
      12,
      width - 24,
      height - 24,
    );

    ctx.fillStyle =
      "#ff5a5f";

    ctx.font =
      "950 12px ui-monospace, monospace";

    ctx.textAlign = "center";

    ctx.fillText(
      state.eventText,
      width / 2,
      28,
    );

    ctx.restore();
  }

  function drawPointer() {
    if (!pointer.active) return;

    if (
      !state.started ||
      state.paused
    ) {
      return;
    }

    ctx.save();

    ctx.strokeStyle =
      "rgba(201,255,50,.25)";
    ctx.lineWidth = 1;

    ctx.beginPath();

    ctx.arc(
      pointer.x,
      pointer.y,
      14,
      0,
      Math.PI * 2,
    );

    ctx.stroke();

    ctx.restore();
  }

  function loop(now: number) {
    if (destroyed) return;

    const delta =
      clamp(
        now - lastTime,
        0,
        50,
      );

    lastTime = now;

    update(delta);
    draw();

    animationFrame =
      requestAnimationFrame(loop);
  }

  function startOrPause() {
    if (
      state.started
    ) {
      pause();
      return;
    }

    if (
      state.delivered ||
      state.gameOver
    ) {
      resetLevel(
        state.delivered &&
          state.level < LEVELS.length
          ? state.level + 1
          : state.level,
      );
    }

    begin();
  }

  function reset() {
    resetLevel(state.level);
  }

  function nextLevel() {
    scorePanel.classList.remove(
      "is-visible",
    );

    if (
      state.delivered &&
      state.level < LEVELS.length
    ) {
      resetLevel(
        state.level + 1,
      );

      begin();
      return;
    }

    if (
      state.delivered &&
      state.level >= LEVELS.length
    ) {
      resetLevel(1);
      begin();
      return;
    }

    resetLevel(state.level);
    begin();
  }

  function onPointerMove(
    event: PointerEvent,
  ) {
    const rect =
      canvas.getBoundingClientRect();

    pointer.x =
      event.clientX - rect.left;

    pointer.y =
      event.clientY - rect.top;

    pointer.active = true;
  }

  function onPointerLeave() {
    pointer.active = false;
  }

  function onKeyDown(
    event: KeyboardEvent,
  ) {
    if (
      event.key === "Escape"
    ) {
      if (
        state.started
      ) {
        pause();
      }

      scorePanel.classList.remove(
        "is-visible",
      );
    }

    if (
      event.code === "Space"
    ) {
      event.preventDefault();

      startOrPause();
    }
  }

  function onResize() {
    resizeCanvas();
  }

  function attach() {
    canvas.addEventListener(
      "pointerdown",
      handlePointer,
    );

    canvas.addEventListener(
      "pointermove",
      onPointerMove,
    );

    canvas.addEventListener(
      "pointerleave",
      onPointerLeave,
    );

    startButton.addEventListener(
      "click",
      startOrPause,
    );

    resetButton.addEventListener(
      "click",
      reset,
    );

    nextButton.addEventListener(
      "click",
      nextLevel,
    );

    window.addEventListener(
      "keydown",
      onKeyDown,
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
        canvas,
      );
    }

    resizeCanvas();

    resetLevel(1);

    animationFrame =
      requestAnimationFrame(loop);
  }

  attach();

  return () => {
    destroyed = true;

    cancelAnimationFrame(
      animationFrame,
    );

    canvas.removeEventListener(
      "pointerdown",
      handlePointer,
    );

    canvas.removeEventListener(
      "pointermove",
      onPointerMove,
    );

    canvas.removeEventListener(
      "pointerleave",
      onPointerLeave,
    );

    startButton.removeEventListener(
      "click",
      startOrPause,
    );

    resetButton.removeEventListener(
      "click",
      reset,
    );

    nextButton.removeEventListener(
      "click",
      nextLevel,
    );

    window.removeEventListener(
      "keydown",
      onKeyDown,
    );

    window.removeEventListener(
      "resize",
      onResize,
    );

    resizeObserver?.disconnect();
  };
}