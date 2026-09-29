// src/games/bug-hunt.ts

type Cleanup = () => void;

type BugKind =
  | "typo"
  | "number"
  | "color"
  | "alignment"
  | "status"
  | "button"
  | "fake"
  | "instruction"
  | "timer"
  | "behavior"
  | "liar";

type Level = {
  id: number;
  title: string;
  subtitle: string;
  kind: BugKind;
  instruction: string;
  timer: number;
  target: string;
  targetLabel: string;
  message: string;
};

type GameState = {
  level: number;
  score: number;
  combo: number;
  bestScore: number;
  lives: number;
  timeLeft: number;
  started: boolean;
  finished: boolean;
  locked: boolean;
  found: boolean;
  wrongTaps: number;
  lastResult: string;
  levelStartTime: number;
};

const STORAGE_KEY = "jembertojogja-bug-hunt-best";

const LEVELS: Level[] = [
  {
    id: 1,
    title: "SOMETHING IS WRONG",
    subtitle: "TYPO",
    kind: "typo",
    instruction: "FIND THE BUG",
    timer: 6,
    target: "profile",
    targetLabel: "PROFILE",
    message: "One word is pretending to be correct.",
  },
  {
    id: 2,
    title: "CHECK THE NUMBERS",
    subtitle: "NUMBER",
    kind: "number",
    instruction: "ONE VALUE IS LYING",
    timer: 5,
    target: "users",
    targetLabel: "12841",
    message: "Everything looks believable. That is the problem.",
  },
  {
    id: 3,
    title: "STATUS: FINE",
    subtitle: "STATUS",
    kind: "status",
    instruction: "FIND THE BUG",
    timer: 5,
    target: "server",
    targetLabel: "HEALTHY",
    message: "The status message is absolutely not trustworthy.",
  },
  {
    id: 4,
    title: "BUTTON TEST",
    subtitle: "BUTTON",
    kind: "button",
    instruction: "ONE BUTTON IS WRONG",
    timer: 5,
    target: "save",
    targetLabel: "SAVE",
    message: "Only one control is broken.",
  },
  {
    id: 5,
    title: "COLOR CHECK",
    subtitle: "COLOR",
    kind: "color",
    instruction: "FIND THE WRONG ONE",
    timer: 4.5,
    target: "ready",
    targetLabel: "READY",
    message: "The text is correct. The color is not.",
  },
  {
    id: 6,
    title: "PIXEL PERFECT",
    subtitle: "ALIGNMENT",
    kind: "alignment",
    instruction: "FIND THE MISALIGNED ITEM",
    timer: 4.5,
    target: "card3",
    targetLabel: "CARD 03",
    message: "One element is 6px away from perfection.",
  },
  {
    id: 7,
    title: "DO NOT TRUST THIS",
    subtitle: "FAKE BUG",
    kind: "fake",
    instruction: "THE OBVIOUS BUG IS NOT THE BUG",
    timer: 6,
    target: "remember",
    targetLabel: "REMEMBER ME",
    message: "The obvious thing is a decoy.",
  },
  {
    id: 8,
    title: "READ CAREFULLY",
    subtitle: "INSTRUCTION",
    kind: "instruction",
    instruction: "FOLLOW THE INSTRUCTION",
    timer: 6,
    target: "continue",
    targetLabel: "CONTINUE",
    message: "The instruction itself is suspicious.",
  },
  {
    id: 9,
    title: "TIME IS BROKEN",
    subtitle: "TIMER",
    kind: "timer",
    instruction: "FIND THE IMPOSSIBLE VALUE",
    timer: 5,
    target: "timer",
    targetLabel: "00:61",
    message: "A normal clock should know better.",
  },
  {
    id: 10,
    title: "BEHAVIOR",
    subtitle: "INTERACTION",
    kind: "behavior",
    instruction: "ONE CONTROL LIES",
    timer: 5,
    target: "menu",
    targetLabel: "MENU",
    message: "One interaction behaves differently.",
  },
  {
    id: 11,
    title: "SYSTEM SAYS NO",
    subtitle: "LIAR",
    kind: "liar",
    instruction: "DO NOT BELIEVE THE MESSAGE",
    timer: 5,
    target: "error",
    targetLabel: "NO ERROR",
    message: "There is no bug. According to the bug.",
  },
  {
    id: 12,
    title: "THE BUG IS YOU",
    subtitle: "FINAL",
    kind: "fake",
    instruction: "ONE LAST BUG",
    timer: 4,
    target: "user",
    targetLabel: "YOU",
    message: "Everything is correct. Something still isn't.",
  },
];

function getBest() {
  if (typeof window === "undefined") return 0;

  try {
    return Number(
      window.localStorage.getItem(STORAGE_KEY) || 0,
    );
  } catch {
    return 0;
  }
}

function setBest(value: number) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      String(value),
    );
  } catch {
    // Ignore storage failures.
  }
}

function clamp(
  value: number,
  min: number,
  max: number,
) {
  return Math.max(min, Math.min(max, value));
}

function createStyles() {
  return `
    .bug-hunt {
      --bg: #080808;
      --panel: #101010;
      --panel-2: #151515;
      --line: #292929;
      --line-2: #393939;
      --text: #f5f5ef;
      --muted: #878780;
      --lime: #caff32;
      --red: #ff5b61;
      --yellow: #ffd84d;
      --blue: #78a9ff;

      width: 100%;
      max-width: 980px;
      margin: 0 auto;
      color: var(--text);
      font-family: inherit;
      user-select: none;
      -webkit-user-select: none;
      -webkit-tap-highlight-color: transparent;
    }

    .bug-hunt * {
      box-sizing: border-box;
    }

    .bug-hunt__shell {
      position: relative;
      overflow: hidden;
      border: 1px solid var(--line);
      background: var(--bg);
    }

    .bug-hunt__scan {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      opacity: .08;
      background-size: 100% 6px;
      background-image:
        linear-gradient(
          to bottom,
          transparent 0,
          transparent 2px,
          rgba(255,255,255,.1) 2px,
          rgba(255,255,255,.1) 3px
        );
    }

    .bug-hunt__top {
      position: relative;
      z-index: 2;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 18px;
      padding: 18px;
      border-bottom: 1px solid var(--line);
    }

    .bug-hunt__eyebrow {
      margin-bottom: 6px;
      color: var(--muted);
      font-size: 9px;
      font-weight: 900;
      letter-spacing: .18em;
    }

    .bug-hunt__title {
      margin: 0;
      font-size: clamp(34px, 7vw, 68px);
      line-height: .84;
      letter-spacing: -.06em;
      font-weight: 950;
    }

    .bug-hunt__title span {
      color: var(--lime);
    }

    .bug-hunt__subtitle {
      margin: 12px 0 0;
      max-width: 530px;
      color: #b8b8b1;
      font-size: 10px;
      line-height: 1.65;
      text-transform: uppercase;
      letter-spacing: .05em;
    }

    .bug-hunt__stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(70px, 1fr));
      border: 1px solid var(--line);
      background: var(--panel);
      align-self: start;
    }

    .bug-hunt__stat {
      min-width: 0;
      padding: 12px;
      border-right: 1px solid var(--line);
    }

    .bug-hunt__stat:last-child {
      border-right: 0;
    }

    .bug-hunt__stat-label {
      margin-bottom: 5px;
      color: var(--muted);
      font-size: 8px;
      font-weight: 900;
      letter-spacing: .13em;
    }

    .bug-hunt__stat-value {
      font-size: 18px;
      font-weight: 950;
      line-height: 1;
    }

    .bug-hunt__stat-value.is-danger {
      color: var(--red);
    }

    .bug-hunt__stat-value.is-good {
      color: var(--lime);
    }

    .bug-hunt__body {
      position: relative;
      z-index: 2;
      padding: 12px;
    }

    .bug-hunt__hud {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 8px;
      margin-bottom: 10px;
    }

    .bug-hunt__instruction {
      border: 1px solid var(--line);
      background: var(--panel);
      padding: 14px;
    }

    .bug-hunt__instruction-kicker {
      margin-bottom: 5px;
      color: var(--lime);
      font-size: 8px;
      font-weight: 900;
      letter-spacing: .14em;
    }

    .bug-hunt__instruction-text {
      font-size: 14px;
      font-weight: 950;
      letter-spacing: .01em;
    }

    .bug-hunt__timer {
      min-width: 120px;
      border: 1px solid var(--line);
      background: var(--panel);
      padding: 14px;
      text-align: right;
    }

    .bug-hunt__timer-label {
      margin-bottom: 5px;
      color: var(--muted);
      font-size: 8px;
      font-weight: 900;
      letter-spacing: .14em;
    }

    .bug-hunt__timer-value {
      color: var(--lime);
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 22px;
      font-weight: 950;
      line-height: 1;
    }

    .bug-hunt__timer-value.is-danger {
      color: var(--red);
    }

    .bug-hunt__app {
      position: relative;
      min-height: 470px;
      overflow: hidden;
      border: 1px solid var(--line);
      background: #0d0d0d;
    }

    .bug-hunt__appbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 48px;
      padding: 0 14px;
      border-bottom: 1px solid var(--line);
      background: #111;
    }

    .bug-hunt__app-brand {
      font-size: 10px;
      font-weight: 950;
      letter-spacing: .08em;
    }

    .bug-hunt__app-dots {
      display: flex;
      gap: 6px;
    }

    .bug-hunt__app-dot {
      width: 7px;
      height: 7px;
      border-radius: 999px;
      border: 1px solid #555;
      background: #171717;
    }

    .bug-hunt__app-main {
      padding: 18px;
    }

    .bug-hunt__fake-title {
      margin-bottom: 16px;
      color: #8f8f88;
      font-size: 8px;
      font-weight: 900;
      letter-spacing: .18em;
    }

    .bug-hunt__content {
      display: grid;
      gap: 10px;
    }

    .bug-hunt__row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      min-height: 56px;
      padding: 0 14px;
      border: 1px solid var(--line);
      background: var(--panel);
      transition:
        transform .18s ease,
        border-color .18s ease,
        background .18s ease;
    }

    .bug-hunt__row--small {
      min-height: 44px;
    }

    .bug-hunt__label {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #b8b8b1;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: .02em;
    }

    .bug-hunt__value {
      color: var(--text);
      font-size: 11px;
      font-weight: 950;
      letter-spacing: .02em;
      text-align: right;
    }

    .bug-hunt__value--green {
      color: var(--lime);
    }

    .bug-hunt__value--red {
      color: var(--red);
    }

    .bug-hunt__value--muted {
      color: #70706a;
    }

    .bug-hunt__button-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }

    .bug-hunt__button {
      min-height: 62px;
      border: 1px solid var(--line-2);
      background: #161616;
      color: var(--text);
      font: inherit;
      font-size: 10px;
      font-weight: 950;
      letter-spacing: .12em;
      cursor: pointer;
      transition:
        transform .15s ease,
        background .15s ease,
        border-color .15s ease;
    }

    .bug-hunt__button:hover {
      transform: translateY(-2px);
      border-color: #555;
      background: #1d1d1d;
    }

    .bug-hunt__button:active {
      transform: translateY(0);
    }

    .bug-hunt__cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }

    .bug-hunt__card {
      min-height: 100px;
      padding: 12px;
      border: 1px solid var(--line);
      background: var(--panel);
    }

    .bug-hunt__card-number {
      margin-bottom: 18px;
      color: var(--muted);
      font-size: 8px;
      font-weight: 900;
    }

    .bug-hunt__card-value {
      font-size: 13px;
      font-weight: 950;
    }

    .bug-hunt__status {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 6px 8px;
      border: 1px solid var(--line);
      background: #0d0d0d;
    }

    .bug-hunt__status-dot {
      width: 7px;
      height: 7px;
      border-radius: 999px;
      background: var(--lime);
    }

    .bug-hunt__status-dot.red {
      background: var(--red);
    }

    .bug-hunt__status-text {
      font-size: 8px;
      font-weight: 950;
      letter-spacing: .1em;
    }

    .bug-hunt__fake-center {
      display: grid;
      place-items: center;
      min-height: 260px;
      padding: 20px;
      text-align: center;
    }

    .bug-hunt__fake-center-number {
      margin-bottom: 10px;
      font-size: clamp(42px, 11vw, 84px);
      line-height: .85;
      font-weight: 950;
      letter-spacing: -.07em;
    }

    .bug-hunt__fake-center-label {
      color: var(--muted);
      font-size: 9px;
      font-weight: 900;
      letter-spacing: .18em;
    }

    .bug-hunt__hint {
      margin-top: 10px;
      padding: 12px 14px;
      border: 1px solid var(--line);
      background: #0f0f0f;
      color: var(--muted);
      font-size: 9px;
      line-height: 1.6;
      text-transform: uppercase;
      letter-spacing: .04em;
    }

    .bug-hunt__footer {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 8px;
      margin-top: 10px;
    }

    .bug-hunt__log {
      min-height: 62px;
      display: flex;
      align-items: center;
      padding: 12px 14px;
      border: 1px solid var(--line);
      background: var(--panel);
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 9px;
      line-height: 1.5;
      color: #a7a7a0;
    }

    .bug-hunt__log strong {
      color: var(--lime);
    }

    .bug-hunt__control {
      min-height: 62px;
      padding: 0 18px;
      border: 1px solid var(--line-2);
      background: #171717;
      color: var(--text);
      cursor: pointer;
      font: inherit;
      font-size: 10px;
      font-weight: 950;
      letter-spacing: .12em;
    }

    .bug-hunt__control--primary {
      color: #050505;
      background: var(--lime);
      border-color: var(--lime);
    }

    .bug-hunt__control:hover {
      filter: brightness(1.05);
    }

    .bug-hunt__flash {
      position: absolute;
      inset: 0;
      pointer-events: none;
      opacity: 0;
      z-index: 20;
      transition: opacity .18s ease;
    }

    .bug-hunt__flash.is-good {
      background: rgba(202,255,50,.09);
      opacity: 1;
    }

    .bug-hunt__flash.is-bad {
      background: rgba(255,91,97,.1);
      opacity: 1;
    }

    .bug-hunt__result {
      position: absolute;
      inset: 0;
      z-index: 30;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: rgba(8,8,8,.94);
    }

    .bug-hunt__result.is-visible {
      display: flex;
    }

    .bug-hunt__result-box {
      width: min(100%, 500px);
      padding: 24px;
      border: 1px solid #343434;
      background: #111;
      text-align: center;
    }

    .bug-hunt__result-kicker {
      margin-bottom: 8px;
      color: var(--lime);
      font-size: 9px;
      font-weight: 950;
      letter-spacing: .18em;
    }

    .bug-hunt__result-title {
      margin: 0;
      font-size: clamp(36px, 10vw, 68px);
      line-height: .85;
      letter-spacing: -.06em;
      font-weight: 950;
    }

    .bug-hunt__result-copy {
      max-width: 360px;
      margin: 14px auto 0;
      color: var(--muted);
      font-size: 10px;
      line-height: 1.7;
    }

    .bug-hunt__result-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      margin-top: 22px;
      border-top: 1px solid var(--line);
      border-bottom: 1px solid var(--line);
    }

    .bug-hunt__result-stat {
      padding: 12px 8px;
      border-right: 1px solid var(--line);
    }

    .bug-hunt__result-stat:last-child {
      border-right: 0;
    }

    .bug-hunt__result-label {
      margin-bottom: 4px;
      color: var(--muted);
      font-size: 7px;
      font-weight: 900;
      letter-spacing: .12em;
    }

    .bug-hunt__result-value {
      font-size: 17px;
      font-weight: 950;
    }

    .bug-hunt__result-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-top: 18px;
    }

    .bug-hunt__combo {
      position: absolute;
      right: 14px;
      top: 14px;
      z-index: 12;
      pointer-events: none;
      opacity: 0;
      transform: translateY(8px) scale(.96);
      transition:
        opacity .2s ease,
        transform .2s ease;
    }

    .bug-hunt__combo.is-visible {
      opacity: 1;
      transform: translateY(0) scale(1);
    }

    .bug-hunt__combo-number {
      color: var(--lime);
      font-size: 28px;
      font-weight: 950;
      line-height: 1;
      text-align: right;
    }

    .bug-hunt__combo-label {
      margin-top: 4px;
      color: #9b9b94;
      font-size: 8px;
      font-weight: 900;
      letter-spacing: .14em;
      text-align: right;
    }

    .bug-hunt__wrong {
      animation: bugHuntShake .24s ease;
    }

    .bug-hunt__correct {
      border-color: var(--lime) !important;
      box-shadow: inset 0 0 0 1px rgba(202,255,50,.25);
    }

    @keyframes bugHuntShake {
      0%, 100% {
        transform: translateX(0);
      }
      25% {
        transform: translateX(-5px);
      }
      75% {
        transform: translateX(5px);
      }
    }

    @media (max-width: 760px) {
      .bug-hunt__top {
        grid-template-columns: 1fr;
      }

      .bug-hunt__stats {
        grid-template-columns: repeat(3, 1fr);
      }

      .bug-hunt__hud {
        grid-template-columns: 1fr 110px;
      }

      .bug-hunt__app {
        min-height: 520px;
      }

      .bug-hunt__cards {
        grid-template-columns: 1fr;
      }

      .bug-hunt__card {
        min-height: 74px;
      }

      .bug-hunt__card-number {
        margin-bottom: 8px;
      }

      .bug-hunt__footer {
        grid-template-columns: 1fr 1fr;
      }

      .bug-hunt__log {
        grid-column: 1 / -1;
      }

      .bug-hunt__control {
        min-height: 56px;
      }

      .bug-hunt__result-stats {
        grid-template-columns: repeat(2, 1fr);
      }

      .bug-hunt__result-stat:nth-child(1),
      .bug-hunt__result-stat:nth-child(2) {
        border-bottom: 1px solid var(--line);
      }

      .bug-hunt__result-stat:nth-child(2) {
        border-right: 0;
      }

      .bug-hunt__result-stat:nth-child(4) {
        border-right: 0;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .bug-hunt__row,
      .bug-hunt__button,
      .bug-hunt__combo,
      .bug-hunt__flash {
        transition: none !important;
        animation: none !important;
      }
    }
  `;
}

export function mountGame(root: HTMLElement): Cleanup {
  root.innerHTML = `
    <section class="bug-hunt" data-bug-hunt>
      <style>${createStyles()}</style>

      <div class="bug-hunt__shell">
        <div class="bug-hunt__scan"></div>

        <header class="bug-hunt__top">
          <div>
            <div class="bug-hunt__eyebrow">
              JEMBERTOJOGJA / OBSERVATION GAME
            </div>

            <h2 class="bug-hunt__title">
              BUG <span>HUNT</span>
            </h2>

            <p class="bug-hunt__subtitle">
              Everything looks correct. That is exactly the problem.
            </p>
          </div>

          <div class="bug-hunt__stats">
            <div class="bug-hunt__stat">
              <div class="bug-hunt__stat-label">LEVEL</div>
              <div class="bug-hunt__stat-value" data-level>
                01
              </div>
            </div>

            <div class="bug-hunt__stat">
              <div class="bug-hunt__stat-label">SCORE</div>
              <div class="bug-hunt__stat-value is-good" data-score>
                0
              </div>
            </div>

            <div class="bug-hunt__stat">
              <div class="bug-hunt__stat-label">LIVES</div>
              <div class="bug-hunt__stat-value is-danger" data-lives>
                3
              </div>
            </div>
          </div>
        </header>

        <div class="bug-hunt__body">
          <div class="bug-hunt__hud">
            <div class="bug-hunt__instruction">
              <div class="bug-hunt__instruction-kicker">
                <span data-level-kicker>LEVEL 01</span>
                /
                <span data-kind>TYPO</span>
              </div>

              <div class="bug-hunt__instruction-text" data-instruction>
                FIND THE BUG
              </div>
            </div>

            <div class="bug-hunt__timer">
              <div class="bug-hunt__timer-label">
                TIME
              </div>

              <div class="bug-hunt__timer-value" data-timer>
                6.0
              </div>
            </div>
          </div>

          <div class="bug-hunt__app">
            <div class="bug-hunt__appbar">
              <div class="bug-hunt__app-brand">
                JEMBER OS / DASHBOARD
              </div>

              <div class="bug-hunt__app-dots">
                <span class="bug-hunt__app-dot"></span>
                <span class="bug-hunt__app-dot"></span>
                <span class="bug-hunt__app-dot"></span>
              </div>
            </div>

            <div class="bug-hunt__app-main">
              <div class="bug-hunt__fake-title">
                SYSTEM MONITOR
              </div>

              <div class="bug-hunt__content" data-game-content></div>
            </div>

            <div class="bug-hunt__flash" data-flash></div>

            <div class="bug-hunt__combo" data-combo>
              <div class="bug-hunt__combo-number" data-combo-number>
                x2
              </div>

              <div class="bug-hunt__combo-label">
                COMBO
              </div>
            </div>

            <div class="bug-hunt__result" data-result>
              <div class="bug-hunt__result-box">
                <div class="bug-hunt__result-kicker" data-result-kicker>
                  SESSION COMPLETE
                </div>

                <h3 class="bug-hunt__result-title" data-result-title>
                  0
                </h3>

                <p class="bug-hunt__result-copy" data-result-copy>
                  You found the bugs.
                </p>

                <div class="bug-hunt__result-stats">
                  <div class="bug-hunt__result-stat">
                    <div class="bug-hunt__result-label">
                      SCORE
                    </div>
                    <div class="bug-hunt__result-value" data-result-score>
                      0
                    </div>
                  </div>

                  <div class="bug-hunt__result-stat">
                    <div class="bug-hunt__result-label">
                      COMBO
                    </div>
                    <div class="bug-hunt__result-value" data-result-combo>
                      x0
                    </div>
                  </div>

                  <div class="bug-hunt__result-stat">
                    <div class="bug-hunt__result-label">
                      BEST
                    </div>
                    <div class="bug-hunt__result-value" data-result-best>
                      0
                    </div>
                  </div>

                  <div class="bug-hunt__result-stat">
                    <div class="bug-hunt__result-label">
                      FOUND
                    </div>
                    <div class="bug-hunt__result-value" data-result-found>
                      0
                    </div>
                  </div>
                </div>

                <div class="bug-hunt__result-actions">
                  <button
                    type="button"
                    class="bug-hunt__control bug-hunt__control--primary"
                    data-restart
                  >
                    PLAY AGAIN
                  </button>

                  <button
                    type="button"
                    class="bug-hunt__control"
                    data-close-result
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="bug-hunt__footer">
            <div class="bug-hunt__log" data-log>
              <strong>&gt;_ SYSTEM</strong>
              &nbsp; press START to begin the hunt.
            </div>

            <button
              type="button"
              class="bug-hunt__control bug-hunt__control--primary"
              data-start
            >
              START
            </button>

            <button
              type="button"
              class="bug-hunt__control"
              data-reset
            >
              RESET
            </button>
          </div>
        </div>
      </div>
    </section>
  `;

  const game = root.querySelector(
    "[data-bug-hunt]",
  ) as HTMLElement;

  const content = root.querySelector(
    "[data-game-content]",
  ) as HTMLElement;

  const levelEl = root.querySelector(
    "[data-level]",
  ) as HTMLElement;

  const scoreEl = root.querySelector(
    "[data-score]",
  ) as HTMLElement;

  const livesEl = root.querySelector(
    "[data-lives]",
  ) as HTMLElement;

  const levelKicker = root.querySelector(
    "[data-level-kicker]",
  ) as HTMLElement;

  const kindEl = root.querySelector(
    "[data-kind]",
  ) as HTMLElement;

  const instructionEl = root.querySelector(
    "[data-instruction]",
  ) as HTMLElement;

  const timerEl = root.querySelector(
    "[data-timer]",
  ) as HTMLElement;

  const logEl = root.querySelector(
    "[data-log]",
  ) as HTMLElement;

  const startButton = root.querySelector(
    "[data-start]",
  ) as HTMLButtonElement;

  const resetButton = root.querySelector(
    "[data-reset]",
  ) as HTMLButtonElement;

  const result = root.querySelector(
    "[data-result]",
  ) as HTMLElement;

  const resultKicker = root.querySelector(
    "[data-result-kicker]",
  ) as HTMLElement;

  const resultTitle = root.querySelector(
    "[data-result-title]",
  ) as HTMLElement;

  const resultCopy = root.querySelector(
    "[data-result-copy]",
  ) as HTMLElement;

  const resultScore = root.querySelector(
    "[data-result-score]",
  ) as HTMLElement;

  const resultCombo = root.querySelector(
    "[data-result-combo]",
  ) as HTMLElement;

  const resultBest = root.querySelector(
    "[data-result-best]",
  ) as HTMLElement;

  const resultFound = root.querySelector(
    "[data-result-found]",
  ) as HTMLElement;

  const restartButton = root.querySelector(
    "[data-restart]",
  ) as HTMLButtonElement;

  const closeResultButton = root.querySelector(
    "[data-close-result]",
  ) as HTMLButtonElement;

  const flash = root.querySelector(
    "[data-flash]",
  ) as HTMLElement;

  const comboEl = root.querySelector(
    "[data-combo]",
  ) as HTMLElement;

  const comboNumberEl = root.querySelector(
    "[data-combo-number]",
  ) as HTMLElement;

  let destroyed = false;
  let animationFrame = 0;
  let lastTime = performance.now();

  const state: GameState = {
    level: 1,
    score: 0,
    combo: 0,
    bestScore: getBest(),
    lives: 3,
    timeLeft: LEVELS[0].timer,
    started: false,
    finished: false,
    locked: false,
    found: false,
    wrongTaps: 0,
    lastResult: "",
    levelStartTime: 0,
  };

  function currentLevel(): Level {
    return (
      LEVELS[state.level - 1] ||
      LEVELS[LEVELS.length - 1]
    );
  }

  function setLog(text: string) {
    logEl.innerHTML = text;
  }

  function updateHUD() {
    const level = currentLevel();

    levelEl.textContent = String(
      state.level,
    ).padStart(2, "0");

    scoreEl.textContent = String(
      state.score,
    );

    livesEl.textContent = String(
      state.lives,
    );

    livesEl.classList.toggle(
      "is-danger",
      state.lives <= 1,
    );

    levelKicker.textContent =
      `LEVEL ${String(state.level).padStart(2, "0")}`;

    kindEl.textContent =
      level.subtitle;

    instructionEl.textContent =
      level.instruction;

    timerEl.textContent =
      state.timeLeft.toFixed(1);

    timerEl.classList.toggle(
      "is-danger",
      state.timeLeft <= 1.5,
    );

    comboNumberEl.textContent =
      `x${Math.max(2, state.combo)}`;

    comboEl.classList.toggle(
      "is-visible",
      state.combo >= 2 &&
        state.started &&
        !state.found,
    );
  }

  function begin() {
    if (state.finished) {
      resetGame();
    }

    state.started = true;
    state.finished = false;
    state.locked = false;
    state.found = false;
    state.wrongTaps = 0;
    state.timeLeft = currentLevel().timer;
    state.levelStartTime =
      performance.now();

    startButton.textContent = "PAUSE";

    buildLevel();

    setLog(
      `<strong>&gt;_ HUNT</strong> ${currentLevel().message}`,
    );
  }

  function pause() {
    if (
      !state.started ||
      state.locked ||
      state.found
    ) {
      return;
    }

    state.started = false;
    startButton.textContent = "RESUME";

    setLog(
      `<strong>&gt;_ PAUSED</strong> the bug is still waiting.`,
    );
  }

  function startOrPause() {
    if (state.started) {
      pause();
      return;
    }

    begin();
  }

  function resetGame() {
    state.level = 1;
    state.score = 0;
    state.combo = 0;
    state.lives = 3;
    state.timeLeft = LEVELS[0].timer;
    state.started = false;
    state.finished = false;
    state.locked = false;
    state.found = false;
    state.wrongTaps = 0;
    state.lastResult = "";

    result.classList.remove(
      "is-visible",
    );

    startButton.textContent =
      "START";

    buildIdle();

    updateHUD();

    setLog(
      `<strong>&gt;_ SYSTEM</strong> press START to begin the hunt.`,
    );
  }

  function buildIdle() {
    content.innerHTML = `
      <div class="bug-hunt__fake-center">
        <div>
          <div class="bug-hunt__fake-center-number">
            ?
          </div>

          <div class="bug-hunt__fake-center-label">
            FIND THE LIE
          </div>

          <div class="bug-hunt__hint">
            One UI. One bug. One tap.
          </div>
        </div>
      </div>
    `;
  }

  function buildLevel() {
    const level = currentLevel();

    const sharedTop = `
      <div class="bug-hunt__row bug-hunt__row--small">
        <span class="bug-hunt__label">APPLICATION</span>
        <span class="bug-hunt__value">JEMBER OS</span>
      </div>
    `;

    switch (level.kind) {
      case "typo":
        content.innerHTML = `
          ${sharedTop}

          <div class="bug-hunt__row" data-answer="home">
            <span class="bug-hunt__label">HOME</span>
            <span class="bug-hunt__value">Overview</span>
          </div>

          <div class="bug-hunt__row" data-answer="profile">
            <span class="bug-hunt__label">
              PROFILe
            </span>
            <span class="bug-hunt__value">Account</span>
          </div>

          <div class="bug-hunt__row" data-answer="projects">
            <span class="bug-hunt__label">PROJECTS</span>
            <span class="bug-hunt__value">24</span>
          </div>

          <div class="bug-hunt__row" data-answer="settings">
            <span class="bug-hunt__label">SETTINGS</span>
            <span class="bug-hunt__value">Default</span>
          </div>
        `;
        break;

      case "number":
        content.innerHTML = `
          ${sharedTop}

          <div class="bug-hunt__row" data-answer="users">
            <span class="bug-hunt__label">USERS</span>
            <span class="bug-hunt__value">12841</span>
          </div>

          <div class="bug-hunt__row">
            <span class="bug-hunt__label">PROJECTS</span>
            <span class="bug-hunt__value">128</span>
          </div>

          <div class="bug-hunt__row">
            <span class="bug-hunt__label">COMMITS</span>
            <span class="bug-hunt__value">6402</span>
          </div>

          <div class="bug-hunt__row">
            <span class="bug-hunt__label">UPTIME</span>
            <span class="bug-hunt__value">99.98%</span>
          </div>
        `;
        break;

      case "status":
        content.innerHTML = `
          ${sharedTop}

          <div class="bug-hunt__row">
            <span class="bug-hunt__label">DATABASE</span>
            <span class="bug-hunt__value">
              CONNECTED
            </span>
          </div>

          <div class="bug-hunt__row" data-answer="server">
            <span class="bug-hunt__label">SERVER</span>
            <span class="bug-hunt__value">
              <span class="bug-hunt__status">
                <span class="bug-hunt__status-dot red"></span>
                HEALTHY
              </span>
            </span>
          </div>

          <div class="bug-hunt__row">
            <span class="bug-hunt__label">CACHE</span>
            <span class="bug-hunt__value bug-hunt__value--green">
              READY
            </span>
          </div>

          <div class="bug-hunt__row">
            <span class="bug-hunt__label">QUEUE</span>
            <span class="bug-hunt__value bug-hunt__value--green">
              NORMAL
            </span>
          </div>
        `;
        break;

      case "button":
        content.innerHTML = `
          ${sharedTop}

          <div class="bug-hunt__button-grid">
            <button
              class="bug-hunt__button"
              data-answer="save"
              type="button"
            >
              SAVE
            </button>

            <button
              class="bug-hunt__button"
              type="button"
            >
              CANCEL
            </button>

            <button
              class="bug-hunt__button"
              type="button"
            >
              PREVIEW
            </button>

            <button
              class="bug-hunt__button"
              type="button"
            >
              EXPORT
            </button>
          </div>

          <div class="bug-hunt__hint">
            All buttons look normal.
          </div>
        `;
        break;

      case "color":
        content.innerHTML = `
          ${sharedTop}

          <div class="bug-hunt__row">
            <span class="bug-hunt__label">DATABASE</span>
            <span class="bug-hunt__value bug-hunt__value--green">
              READY
            </span>
          </div>

          <div class="bug-hunt__row" data-answer="ready">
            <span class="bug-hunt__label">SERVER</span>
            <span
              class="bug-hunt__value"
              style="color:#78a9ff;"
            >
              READY
            </span>
          </div>

          <div class="bug-hunt__row">
            <span class="bug-hunt__label">CACHE</span>
            <span class="bug-hunt__value bug-hunt__value--green">
              READY
            </span>
          </div>

          <div class="bug-hunt__row">
            <span class="bug-hunt__label">QUEUE</span>
            <span class="bug-hunt__value bug-hunt__value--green">
              READY
            </span>
          </div>
        `;
        break;

      case "alignment":
        content.innerHTML = `
          ${sharedTop}

          <div class="bug-hunt__cards">
            <div class="bug-hunt__card">
              <div class="bug-hunt__card-number">
                CARD 01
              </div>
              <div class="bug-hunt__card-value">
                128
              </div>
            </div>

            <div class="bug-hunt__card">
              <div class="bug-hunt__card-number">
                CARD 02
              </div>
              <div class="bug-hunt__card-value">
                256
              </div>
            </div>

            <div
              class="bug-hunt__card"
              data-answer="card3"
              style="transform:translateY(6px);"
            >
              <div class="bug-hunt__card-number">
                CARD 03
              </div>
              <div class="bug-hunt__card-value">
                512
              </div>
            </div>
          </div>

          <div class="bug-hunt__hint">
            Perfectly aligned systems are boring.
          </div>
        `;
        break;

      case "fake":
        content.innerHTML = `
          ${sharedTop}

          <div class="bug-hunt__row" data-decoy="true">
            <span class="bug-hunt__label">PASSWORD</span>
            <span class="bug-hunt__value">
              •••••••••
            </span>
          </div>

          <div class="bug-hunt__row" data-answer="remember">
            <span class="bug-hunt__label">REMEMBER ME</span>
            <span class="bug-hunt__value">
              [ x ]
            </span>
          </div>

          <div class="bug-hunt__row">
            <span class="bug-hunt__label">TWO FACTOR</span>
            <span class="bug-hunt__value bug-hunt__value--green">
              ENABLED
            </span>
          </div>

          <div class="bug-hunt__hint">
            Hint: the obvious password problem is fake.
          </div>
        `;
        break;

      case "instruction":
        content.innerHTML = `
          ${sharedTop}

          <div class="bug-hunt__fake-center">
            <div>
              <div class="bug-hunt__fake-center-label">
                SYSTEM MESSAGE
              </div>

              <div
                class="bug-hunt__fake-center-number"
                style="font-size:clamp(28px,7vw,56px);"
              >
                FIND THE BUG
              </div>

              <div
                class="bug-hunt__hint"
                data-answer="continue"
                style="margin-top:16px; cursor:pointer;"
              >
                IGNORE THE INSTRUCTION ABOVE.
                <br />
                PRESS CONTINUE.
              </div>

              <button
                class="bug-hunt__button"
                data-answer="continue"
                type="button"
                style="margin-top:10px; width:100%;"
              >
                CONTINUE
              </button>
            </div>
          </div>
        `;
        break;

      case "timer":
        content.innerHTML = `
          ${sharedTop}

          <div class="bug-hunt__fake-center">
            <div>
              <div class="bug-hunt__fake-center-number">
                00:61
              </div>

              <div
                class="bug-hunt__fake-center-label"
                data-answer="timer"
              >
                SESSION CLOCK
              </div>

              <div class="bug-hunt__hint">
                Valid minutes. Invalid seconds.
              </div>
            </div>
          </div>
        `;
        break;

      case "behavior":
        content.innerHTML = `
          ${sharedTop}

          <div class="bug-hunt__button-grid">
            <button
              class="bug-hunt__button"
              type="button"
            >
              HOME
            </button>

            <button
              class="bug-hunt__button"
              data-answer="menu"
              type="button"
              style="transition:transform .6s cubic-bezier(.2,.8,.2,1);"
              data-wobble
            >
              MENU
            </button>

            <button
              class="bug-hunt__button"
              type="button"
            >
              SEARCH
            </button>

            <button
              class="bug-hunt__button"
              type="button"
            >
              ACCOUNT
            </button>
          </div>

          <div class="bug-hunt__hint">
            One control behaves strangely when touched.
          </div>
        `;
        break;

      case "liar":
        content.innerHTML = `
          ${sharedTop}

          <div class="bug-hunt__row">
            <span class="bug-hunt__label">
              SYSTEM
            </span>

            <span
              class="bug-hunt__value"
              data-answer="error"
            >
              NO ERROR
            </span>
          </div>

          <div class="bug-hunt__row">
            <span class="bug-hunt__label">
              ERROR LOG
            </span>

            <span class="bug-hunt__value bug-hunt__value--red">
              1 CRITICAL
            </span>
          </div>

          <div class="bug-hunt__row">
            <span class="bug-hunt__label">
              STATUS
            </span>

            <span class="bug-hunt__value">
              STABLE
            </span>
          </div>

          <div class="bug-hunt__hint">
            The message says there is no error.
          </div>
        `;
        break;

      case "liar":
      default:
        content.innerHTML = `
          <div
            class="bug-hunt__fake-center"
            data-answer="user"
          >
            <div>
              <div class="bug-hunt__fake-center-number">
                YOU
              </div>

              <div class="bug-hunt__fake-center-label">
                ARE THE BUG
              </div>

              <div class="bug-hunt__hint">
                Everything else is correct.
              </div>
            </div>
          </div>
        `;
        break;
    }

    if (level.id === 12) {
      content.innerHTML = `
        ${sharedTop}

        <div
          class="bug-hunt__fake-center"
          data-answer="user"
          style="cursor:pointer;"
        >
          <div>
            <div class="bug-hunt__fake-center-number">
              YOU
            </div>

            <div class="bug-hunt__fake-center-label">
              ARE THE BUG
            </div>

            <div class="bug-hunt__hint">
              Everything on this screen is technically correct.
              <br />
              Tap the only thing that can still be wrong.
            </div>
          </div>
        </div>
      `;
    }

    attachLevelInteractions();
    updateHUD();
  }

  function attachLevelInteractions() {
    const answerNodes =
      content.querySelectorAll(
        "[data-answer]",
      );

    answerNodes.forEach((node) => {
      const element =
        node as HTMLElement;

      element.style.cursor = "pointer";
      element.setAttribute(
        "role",
        "button",
      );
      element.setAttribute(
        "tabindex",
        "0",
      );
    });

    const wobble =
      content.querySelector(
        "[data-wobble]",
      ) as HTMLElement | null;

    if (wobble) {
      wobble.addEventListener(
        "pointerenter",
        wobbleButton,
      );

      wobble.addEventListener(
        "pointerdown",
        wobbleButton,
      );
    }
  }

  function wobbleButton(
    event: Event,
  ) {
    const target =
      event.currentTarget as HTMLElement;

    target.style.transform =
      `translateX(${Math.random() * 16 - 8}px) rotate(${Math.random() * 4 - 2}deg)`;
  }

  function findAnswerElement() {
    return content.querySelector(
      `[data-answer="${currentLevel().target}"]`,
    ) as HTMLElement | null;
  }

  function handleTap(
    event: PointerEvent,
  ) {
    if (
      !state.started ||
      state.locked ||
      state.found
    ) {
      return;
    }

    const target =
      event.target as HTMLElement | null;

    if (!target) return;

    const answer =
      target.closest(
        "[data-answer]",
      ) as HTMLElement | null;

    if (!answer) {
      registerWrongTap();
      return;
    }

    const answerId =
      answer.getAttribute(
        "data-answer",
      );

    if (
      answerId ===
      currentLevel().target
    ) {
      registerCorrectTap(answer);
    } else {
      registerWrongTap(answer);
    }
  }

  function handleKeydown(
    event: KeyboardEvent,
  ) {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      const active =
        document.activeElement as HTMLElement | null;

      if (
        active &&
        content.contains(active)
      ) {
        event.preventDefault();

        active.click();
      }
    }

    if (event.key === "Escape") {
      pause();

      result.classList.remove(
        "is-visible",
      );
    }
  }

  function registerWrongTap(
    element?: HTMLElement,
  ) {
    if (
      !state.started ||
      state.locked
    ) {
      return;
    }

    state.wrongTaps += 1;
    state.combo = 0;
    state.lives -= 1;

    if (element) {
      element.classList.add(
        "bug-hunt__wrong",
      );

      window.setTimeout(() => {
        element.classList.remove(
          "bug-hunt__wrong",
        );
      }, 240);
    }

    flash.classList.remove(
      "is-good",
    );

    flash.classList.add(
      "is-bad",
    );

    window.setTimeout(() => {
      flash.classList.remove(
        "is-bad",
      );
    }, 160);

    setLog(
      `<strong>&gt;_ WRONG</strong> that was not the bug. -1 life.`,
    );

    updateHUD();

    if (state.lives <= 0) {
      failGame(
        "You tapped the UI too confidently.",
      );
    }
  }

  function registerCorrectTap(
    element: HTMLElement,
  ) {
    if (
      !state.started ||
      state.locked
    ) {
      return;
    }

    state.locked = true;
    state.found = true;
    state.combo += 1;

    const level = currentLevel();

    const timeRemaining =
      Math.max(
        0,
        state.timeLeft,
      );

    const base = 150;
    const speedBonus =
      Math.round(
        timeRemaining * 100,
      );

    const comboBonus =
      Math.max(
        0,
        state.combo - 1,
      ) * 75;

    const wrongPenalty =
      state.wrongTaps * 35;

    const gained =
      Math.max(
        25,
        base +
          speedBonus +
          comboBonus -
          wrongPenalty,
      );

    state.score += gained;

    if (
      state.score >
      state.bestScore
    ) {
      state.bestScore =
        state.score;

      setBest(
        state.bestScore,
      );
    }

    element.classList.add(
      "bug-hunt__correct",
    );

    flash.classList.remove(
      "is-bad",
    );

    flash.classList.add(
      "is-good",
    );

    window.setTimeout(() => {
      flash.classList.remove(
        "is-good",
      );
    }, 180);

    setLog(
      `<strong>&gt;_ BUG FOUND</strong> ${level.targetLabel} / +${gained} points.`,
    );

    updateHUD();

    window.setTimeout(() => {
      nextLevel();
    }, 620);
  }

  function failGame(
    reason: string,
  ) {
    state.started = false;
    state.locked = true;

    startButton.textContent =
      "START";

    resultKicker.textContent =
      "HUNT FAILED";

    resultTitle.textContent =
      "GAME OVER";

    resultCopy.textContent =
      reason;

    resultScore.textContent =
      String(state.score);

    resultCombo.textContent =
      `x${state.combo}`;

    resultBest.textContent =
      String(state.bestScore);

    resultFound.textContent =
      `${Math.max(0, state.level - 1)}/${LEVELS.length}`;

    result.classList.add(
      "is-visible",
    );

    setLog(
      `<strong>&gt;_ FAILURE</strong> ${reason}`,
    );
  }

  function nextLevel() {
    if (
      destroyed ||
      !state.found
    ) {
      return;
    }

    state.level += 1;

    if (
      state.level >
      LEVELS.length
    ) {
      finishGame();
      return;
    }

    state.locked = false;
    state.found = false;
    state.wrongTaps = 0;
    state.timeLeft =
      currentLevel().timer;

    state.started = true;

    startButton.textContent =
      "PAUSE";

    buildLevel();

    setLog(
      `<strong>&gt;_ NEXT</strong> ${currentLevel().message}`,
    );
  }

  function finishGame() {
    state.started = false;
    state.finished = true;
    state.locked = true;

    startButton.textContent =
      "START";

    resultKicker.textContent =
      "ALL BUGS FOUND";

    resultTitle.textContent =
      String(state.score);

    resultCopy.textContent =
      "Twelve levels. Twelve lies. One suspicious developer.";

    resultScore.textContent =
      String(state.score);

    resultCombo.textContent =
      `x${state.combo}`;

    resultBest.textContent =
      String(state.bestScore);

    resultFound.textContent =
      `${LEVELS.length}/${LEVELS.length}`;

    result.classList.add(
      "is-visible",
    );

    setLog(
      `<strong>&gt;_ COMPLETE</strong> production is still probably broken.`,
    );
  }

  function update(deltaMs: number) {
    if (
      !state.started ||
      state.locked ||
      state.found ||
      state.finished
    ) {
      return;
    }

    state.timeLeft -=
      deltaMs / 1000;

    if (
      currentLevel().kind ===
      "behavior"
    ) {
      const wobble =
        content.querySelector(
          "[data-wobble]",
        ) as HTMLElement | null;

      if (wobble) {
        const elapsed =
          (performance.now() -
            state.levelStartTime) /
          1000;

        const x =
          Math.sin(
            elapsed * 7,
          ) * 2;

        wobble.style.transform =
          `translateX(${x}px)`;
      }
    }

    if (
      state.timeLeft <= 0
    ) {
      state.timeLeft = 0;

      state.combo = 0;

      failGame(
        "Time expired. The bug escaped.",
      );
    }

    updateHUD();
  }

  function loop(now: number) {
    if (destroyed) {
      return;
    }

    const delta =
      clamp(
        now - lastTime,
        0,
        100,
      );

    lastTime = now;

    update(delta);

    animationFrame =
      requestAnimationFrame(
        loop,
      );
  }

  function onStartClick() {
    if (
      state.started
    ) {
      pause();
      return;
    }

    if (
      state.finished
    ) {
      resetGame();
    }

    if (
      result.classList.contains(
        "is-visible",
      )
    ) {
      result.classList.remove(
        "is-visible",
      );
    }

    begin();
  }

  function onResetClick() {
    resetGame();
  }

  function onRestartClick() {
    result.classList.remove(
      "is-visible",
    );

    resetGame();
    begin();
  }

  function onCloseResult() {
    result.classList.remove(
      "is-visible",
    );
  }

  function onPointerDown(
    event: PointerEvent,
  ) {
    handleTap(event);
  }

  content.addEventListener(
    "pointerdown",
    onPointerDown,
  );

  content.addEventListener(
    "keydown",
    handleKeydown,
  );

  startButton.addEventListener(
    "click",
    onStartClick,
  );

  resetButton.addEventListener(
    "click",
    onResetClick,
  );

  restartButton.addEventListener(
    "click",
    onRestartClick,
  );

  closeResultButton.addEventListener(
    "click",
    onCloseResult,
  );

  window.addEventListener(
    "keydown",
    handleKeydown,
  );

  resetGame();

  animationFrame =
    requestAnimationFrame(
      loop,
    );

  return () => {
    destroyed = true;

    cancelAnimationFrame(
      animationFrame,
    );

    content.removeEventListener(
      "pointerdown",
      onPointerDown,
    );

    content.removeEventListener(
      "keydown",
      handleKeydown,
    );

    startButton.removeEventListener(
      "click",
      onStartClick,
    );

    resetButton.removeEventListener(
      "click",
      onResetClick,
    );

    restartButton.removeEventListener(
      "click",
      onRestartClick,
    );

    closeResultButton.removeEventListener(
      "click",
      onCloseResult,
    );

    window.removeEventListener(
      "keydown",
      handleKeydown,
    );
  };
}