var e=`jembertojogja-ram-clash-best`,t={bg:`#080909`,arena:`#1d3820`,arenaInner:`#274c2b`,arenaLine:`#587c4f`,player:`#f1eee4`,playerShadow:`#bdb9ad`,enemy:`#d9d5cb`,enemyShadow:`#aaa69d`,horn:`#b9a47b`,eye:`#111111`,lime:`#caff32`,red:`#ff6268`,yellow:`#ffd35c`,blue:`#7cb2ff`,white:`#f6f5ee`,muted:`#94948c`,dark:`#111211`};function n(e,t,n){return Math.max(t,Math.min(n,e))}function r(e,t){return Math.hypot(t.x-e.x,t.y-e.y)}function i(e){let t=Math.hypot(e.x,e.y);return t<=1e-4?{x:0,y:0}:{x:e.x/t,y:e.y/t}}function a(e,t){return{x:e.x+t.x,y:e.y+t.y}}function o(e,t){return{x:e.x-t.x,y:e.y-t.y}}function s(e,t){return{x:e.x*t,y:e.y*t}}function c(e,t){return e.x*t.x+e.y*t.y}function l(e,t){return e.x*t.y-e.y*t.x}function u(e){return Math.atan2(e.y,e.x)}function d(e,t){let n=e-t;for(;n>Math.PI;)n-=Math.PI*2;for(;n<-Math.PI;)n+=Math.PI*2;return n}function f(e,t){return Math.random()*(t-e)+e}function p(){if(typeof window>`u`)return 0;try{return Number(window.localStorage.getItem(e)||0)}catch{return 0}}function m(t){if(typeof window<`u`)try{window.localStorage.setItem(e,String(t))}catch{}}function h(e,t,r,i){let a=e===`player`?0:Math.PI;return{id:e,pos:{...t},vel:{x:0,y:0},radius:25,mass:e===`player`?1:1.03,grip:e===`player`?.91:.89,bodyAngle:a,headAngle:a,balance:100,stamina:100,charge:0,charging:!1,chargeTime:0,attackPower:0,attackTimer:0,hitCooldown:0,stunTimer:0,recoveryWindow:0,recoveryUsed:!1,lean:0,outTimer:0,fallen:!1,eliminated:!1,aiNextAction:f(1.3,2.3),aiChargeTarget:.95,aiCharging:!1,aiAggression:e===`ai`?n(.46+i*.12,.46,.82):0,perfectHits:0,hits:0,wins:0}}function g(){return`
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
  `}function _(e){e.innerHTML=`
    <section class="ram-clash" data-ram-clash>
      <style>${g()}</style>

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
  `;let _=e.querySelector(`.ram-clash__canvas`),v=_?.getContext(`2d`);if(!_||!v)return()=>{};e.querySelector(`[data-ram-clash]`);let y=e.querySelector(`.ram-clash__arena-wrap`),b=e.querySelector(`[data-overlay]`),x=e.querySelector(`[data-overlay-title]`),S=e.querySelector(`[data-overlay-copy]`),C=e.querySelector(`[data-result-round]`),w=e.querySelector(`[data-result-score]`),T=e.querySelector(`[data-result-perfect]`),E=e.querySelector(`[data-result-best]`),D=e.querySelector(`[data-primary]`),O=e.querySelector(`[data-reset]`),k=e.querySelector(`[data-sound]`),A=e.querySelector(`[data-abort]`),j=e.querySelector(`[data-score]`),M=e.querySelector(`[data-best]`),ee=e.querySelector(`[data-perfect]`),te=e.querySelector(`[data-round]`),ne=e.querySelector(`[data-round-score]`),re=e.querySelector(`[data-player-state]`),ie=e.querySelector(`[data-ai-state]`),ae=e.querySelector(`[data-player-balance]`),oe=e.querySelector(`[data-player-stamina]`),se=e.querySelector(`[data-ai-balance]`),ce=e.querySelector(`[data-ai-stamina]`),le=e.querySelector(`[data-player-balance-bar]`),ue=e.querySelector(`[data-player-stamina-bar]`),de=e.querySelector(`[data-ai-balance-bar]`),fe=e.querySelector(`[data-ai-stamina-bar]`),N=e.querySelector(`[data-hint]`),P=e.querySelector(`[data-charge]`),pe=e.querySelector(`[data-charge-value]`),me=e.querySelector(`[data-charge-fill]`),F=e.querySelector(`[data-flash]`),he=e.querySelector(`[data-log]`),I=null,L=0,ge=performance.now(),R={phase:`idle`,round:1,playerWins:0,aiWins:0,score:0,bestScore:p(),roundTime:0,maxRoundTime:30,countdown:3,countdownTimer:0,player:h(`player`,{x:0,y:0},0,0),ai:h(`ai`,{x:0,y:0},0,.5),particles:[],grass:[],cameraShake:0,impactFlash:0,perfectTimer:0,perfectText:``,lastHit:``,lastHitTimer:0,matchPerfects:0,matchHits:0,pointerDown:!1,pointerActive:!1,pointer:{x:0,y:0},aimAngle:0,audioReady:!1,audioContext:null,destroyed:!1};function z(){let e=_.getBoundingClientRect();return{width:e.width,height:e.height,dpr:window.devicePixelRatio||1}}function B(){let{width:e,height:t}=z(),n=Math.min(e,t)*.365;return{center:{x:e/2,y:t/2},radius:n}}function _e(){let{width:e,height:t}=z();R.grass=[];let n=Math.floor(e*t/4200);for(let r=0;r<n;r++)R.grass.push({x:f(e*.08,e*.92),y:f(t*.08,t*.92),h:f(4,10),lean:f(-.8,.8)})}function ve(){let{width:e,height:t,dpr:n}=z();_.width=Math.max(1,Math.floor(e*n)),_.height=Math.max(1,Math.floor(t*n)),v.setTransform(n,0,0,n,0,0);let r=B();R.player.pos.x===0&&R.player.pos.y===0&&V(r),_e(),Ve()}function V(e=B()){let t=e.radius*.58;R.player=h(`player`,{x:e.center.x-t,y:e.center.y},e.radius,R.round-1),R.ai=h(`ai`,{x:e.center.x+t,y:e.center.y},e.radius,R.round-1),R.aimAngle=0,R.pointerDown=!1,R.pointerActive=!1,R.particles=[],R.cameraShake=0,R.impactFlash=0,R.perfectTimer=0,R.lastHitTimer=0}function H(e){he.innerHTML=e}function U(){if(!R.audioReady)try{let e=window.AudioContext||window.webkitAudioContext;if(!e)return;R.audioContext=new e,R.audioReady=!0}catch{R.audioReady=!1}}function W(e,t,n,r){if(!R.audioReady||!R.audioContext)return;let i=R.audioContext;i.state===`suspended`&&i.resume();let a=i.createOscillator(),o=i.createGain();a.type=n,a.frequency.value=e,o.gain.value=r,a.connect(o),o.connect(i.destination);let s=i.currentTime;o.gain.setValueAtTime(r,s),o.gain.exponentialRampToValueAtTime(.001,s+t),a.start(s),a.stop(s+t)}function ye(e){e<.75||W(140+e*110,.06,`sine`,.025)}function be(e){W(e?74:62,e?.28:.2,`triangle`,e?.14:.1),window.setTimeout(()=>{W(e?210:170,.08,`square`,e?.045:.025)},22)}function G(){W(330,.12,`sine`,.05),window.setTimeout(()=>{W(520,.18,`sine`,.055)},80)}function K(){let e=R.player,t=R.ai;if(j.textContent=String(R.score),M.textContent=String(R.bestScore),ee.textContent=String(R.matchPerfects),te.textContent=`${R.round} / 3`,ne.textContent=`YOU ${R.playerWins} — ${R.aiWins} CPU`,ae.textContent=String(Math.round(n(e.balance,0,100))),oe.textContent=String(Math.round(n(e.stamina,0,100))),se.textContent=String(Math.round(n(t.balance,0,100))),ce.textContent=String(Math.round(n(t.stamina,0,100))),le.style.width=`${n(e.balance,0,100)}%`,ue.style.width=`${n(e.stamina,0,100)}%`,de.style.width=`${n(t.balance,0,100)}%`,fe.style.width=`${n(t.stamina,0,100)}%`,re.textContent=q(e),ie.textContent=q(t),e.charging&&R.phase===`playing`){P.classList.add(`is-visible`);let t=n(e.charge*100,0,100);pe.textContent=`${Math.round(t)}%`,me.style.width=`${t}%`}else P.classList.remove(`is-visible`)}function q(e){return e.eliminated?`OUT`:e.fallen?`DOWN`:e.recoveryWindow>0?`RECOVER`:e.stunTimer>0?`STAGGER`:e.charging?`CHARGING`:e.balance<30?`CRITICAL`:`READY`}function xe(e,t,n){x.textContent=e,S.textContent=t,D.textContent=n,C.textContent=`${R.round} / 3`,w.textContent=String(R.score),T.textContent=String(R.matchPerfects),E.textContent=String(R.bestScore),b.classList.add(`is-visible`)}function J(){b.classList.remove(`is-visible`)}function Y(){U(),R.round=1,R.playerWins=0,R.aiWins=0,R.score=0,R.matchPerfects=0,R.matchHits=0,R.phase=`countdown`,R.countdown=3,R.countdownTimer=0,R.maxRoundTime=30,R.roundTime=R.maxRoundTime,V(),J(),N.textContent=`HOLD + DRAG TO AIM / RELEASE TO CHARGE`,H(`<strong>&gt;_ MATCH</strong> best of three. Read the opening.`),K()}function Se(){R.round+=1,R.phase=`countdown`,R.countdown=3,R.countdownTimer=0,R.maxRoundTime=Math.max(23,30-(R.round-1)*2),R.roundTime=R.maxRoundTime,V(),J(),H(`<strong>&gt;_ ROUND ${R.round}</strong> new arena reset. Keep your balance.`),K()}function X(){R.phase=`idle`,R.round=1,R.playerWins=0,R.aiWins=0,R.score=0,R.matchPerfects=0,R.matchHits=0,R.roundTime=R.maxRoundTime,V(),D.textContent=`PLAY`,xe(`RAM CLASH`,`Hold anywhere on the arena, drag to aim, then release. Win by breaking balance or pushing the opponent out.`,`PLAY`),H(`<strong>&gt;_ SYSTEM</strong> hold + drag + release.`),K()}function Ce(e){R.countdownTimer+=e,R.countdownTimer>=.9&&(R.countdownTimer=0,--R.countdown,W(R.countdown>0?170:280,.07,`sine`,.045),R.countdown<=0&&(R.phase=`playing`,R.roundTime=R.maxRoundTime,N.textContent=`HOLD + DRAG / AIM THE HEAD / RELEASE`,H(`<strong>&gt;_ FIGHT</strong> perfect impact is all about timing.`),W(430,.12,`triangle`,.06)))}function we(e){let t=R.player;if(t.hitCooldown=Math.max(0,t.hitCooldown-e),t.attackTimer=Math.max(0,t.attackTimer-e),t.stunTimer=Math.max(0,t.stunTimer-e),t.recoveryWindow=Math.max(0,t.recoveryWindow-e),!t.eliminated){if(t.stunTimer<=0&&!t.fallen&&t.recoveryWindow<=0&&(t.charging||(t.stamina=Math.min(100,t.stamina+e*18)),R.pointerDown&&R.phase===`playing`)){t.charging=!0,t.chargeTime+=e,t.charge=n(t.chargeTime/1.65,0,1);let r=n(t.stamina,0,100)<=3?.12:1;if(t.charge=Math.min(t.charge,r*t.charge+(1-r)),R.pointerActive){let e=R.pointer,n=i(o(e,t.pos));Math.hypot(n.x,n.y)>0&&(R.aimAngle=u(n))}t.headAngle=R.aimAngle;let a=18+t.charge*28,s={x:-Math.cos(R.aimAngle)*a,y:-Math.sin(R.aimAngle)*a};t.vel.x+=s.x*e,t.vel.y+=s.y*e,t.stamina=Math.max(0,t.stamina-e*(5+t.charge*8))}t.recoveryWindow>0&&t.balance<45&&Te(e),ke(t,e)}}function Te(e){let t=R.player;R.pointerActive&&n((R.pointer.x-t.pos.x)/90,-1,1)*(t.lean>=0?-1:1)>.08&&(t.balance=Math.min(48,t.balance+e*30),t.lean*=Math.max(0,1-e*5),t.balance>30&&(t.recoveryWindow=0,t.recoveryUsed=!1,H(`<strong>&gt;_ RECOVERED</strong> your footing is back.`)))}function Ee(e){let t=R.ai;if(t.hitCooldown=Math.max(0,t.hitCooldown-e),t.attackTimer=Math.max(0,t.attackTimer-e),t.stunTimer=Math.max(0,t.stunTimer-e),t.recoveryWindow=Math.max(0,t.recoveryWindow-e),t.eliminated||t.fallen)return;let a=R.player,s=i(o(a.pos,t.pos));if(t.stunTimer<=0&&t.recoveryWindow<=0&&(t.headAngle=u(s)),t.aiNextAction-=e,!t.charging&&t.stunTimer<=0&&t.aiNextAction<=0){let e=r(t.pos,a.pos);Math.random()<t.aiAggression&&e>82?(t.aiCharging=!0,t.charging=!0,t.chargeTime=0,t.charge=0):t.aiNextAction=f(.45,1.35)}if(t.charging&&!t.fallen&&t.stunTimer<=0){t.chargeTime+=e;let r=t.aiChargeTarget;t.charge=n(t.chargeTime/1.35,0,1),t.headAngle=u(s),t.charge>=r&&Oe(t,t.headAngle)}if(t.balance<34&&t.recoveryWindow>0){let n=t.lean>=0?-1:1;t.lean+=n*e*2.5,t.balance=Math.min(48,t.balance+e*14),t.balance>30&&(t.recoveryWindow=0)}ke(t,e)}function De(){let e=R.player;if(!e.charging||e.fallen||e.stunTimer>0||e.eliminated){e.charging=!1,e.charge=0,e.chargeTime=0;return}Oe(e,R.aimAngle)}function Oe(e,t){let r=n(e.charge,0,1),i=(.34+r*.9)*n(.58+e.stamina/230,.58,1);e.attackPower=i,e.attackTimer=.22,e.headAngle=t;let a={x:Math.cos(t)*(120+i*250),y:Math.sin(t)*(120+i*250)};e.vel.x+=a.x,e.vel.y+=a.y,e.bodyAngle=t,e.stamina=Math.max(0,e.stamina-12-r*28),e.charging=!1,e.aiCharging=!1,e.charge=0,e.chargeTime=0,e.hitCooldown=.06,Z(e.pos,t+Math.PI,8+Math.round(i*8)),ye(r)}function ke(e,t){if(e.eliminated||e.fallen){e.vel.x*=.06**t,e.vel.y*=.06**t;return}let n=Math.hypot(e.vel.x,e.vel.y),r=e.grip,a=Math.max(.01,1-r*.84*t)**1;if(e.vel.x*=a,e.vel.y*=a,e.pos.x+=e.vel.x*t,e.pos.y+=e.vel.y*t,n>15&&!e.charging){let n=d(u(e.vel),e.bodyAngle);e.bodyAngle+=n*Math.min(1,t*8)}let s=B(),l=o(e.pos,s.center),f=Math.hypot(l.x,l.y),p=s.radius-e.radius*.52;if(f>p){let n=i(l),r=c(e.vel,n);r>0&&(e.vel.x-=n.x*r*.9,e.vel.y-=n.y*r*.9);let a=f-p;if(e.outTimer+=t*(1+a/Math.max(1,e.radius)),e.balance=Math.max(0,e.balance-a*t*.8),e.outTimer>.7){Ne(e,`OUT OF BOUNDS`);return}}else e.outTimer=Math.max(0,e.outTimer-t*1.4);e.lean*=Math.max(0,1-t*1.8),e.balance<40&&(e.recoveryWindow=Math.max(e.recoveryWindow,.35)),e.balance<=0&&e.recoveryWindow<=0&&(e.fallen=!0,e.stunTimer=1.15,e.vel.x*=.16,e.vel.y*=.16,Z(e.pos,e.bodyAngle,12),e.id===`player`&&H(`<strong>&gt;_ DOWN</strong> recovery window missed.`))}function Ae(){let e=R.player,t=R.ai;if(e.eliminated||t.eliminated)return;let r=o(t.pos,e.pos),u=Math.hypot(r.x,r.y),d=e.radius+t.radius-3;if(u<=0||u>=d)return;let f=i(r),p=d-u;if(e.pos.x-=f.x*p*.5,e.pos.y-=f.y*p*.5,t.pos.x+=f.x*p*.5,t.pos.y+=f.y*p*.5,e.hitCooldown>0||t.hitCooldown>0)return;let m=o(t.vel,e.vel),h=Math.max(0,c(m,f)),g={x:Math.cos(e.headAngle),y:Math.sin(e.headAngle)},_={x:Math.cos(t.headAngle),y:Math.sin(t.headAngle)},v=n(c(g,f),0,1),y=n(c(_,s(f,-1)),0,1),b=e.attackTimer>0?e.attackPower:0,x=t.attackTimer>0?t.attackPower:0,S=b*v*(1+h/320),C=x*y*(1+h/320),w=S>.12,T=C>.12;if(!w&&!T&&h<80)return;let E=Math.max(.15,h/210),D=!1;w&&S>.88&&v>.92&&e.charge<=.01&&(D=!0),T&&C>.88&&y>.92&&(D=!1);let O=S>C?S*42:0,k=C>S?C*42:0;!w&&T&&(k=C*48),w&&!T&&(O=S*48),D?(O*=1.55,e.perfectHits+=1,R.matchPerfects+=1,R.score+=420,R.perfectText=`PERFECT IMPACT`,R.perfectTimer=1.25,R.cameraShake=Math.max(R.cameraShake,13),R.impactFlash=.12,F.classList.add(`is-perfect`),window.setTimeout(()=>{F.classList.remove(`is-perfect`)},120),H(`<strong>&gt;_ PERFECT IMPACT</strong> head alignment was nearly exact.`),be(!0),je(a(e.pos,s(f,e.radius)),!0)):(R.score+=Math.round(Math.max(S,C)*90),R.impactFlash=.08,F.classList.add(`is-hit`),window.setTimeout(()=>{F.classList.remove(`is-hit`)},90),H(`<strong>&gt;_ IMPACT</strong> momentum ${Math.round(Math.max(S,C)*100)}.`),be(!1),je(a(e.pos,s(f,e.radius)),!1)),w&&(e.hits+=1,R.matchHits+=1),T&&(t.hits+=1,R.matchHits+=1),t.balance=n(t.balance-O*(1+E*.14),-10,100),e.balance=n(e.balance-k*(1+E*.14),-10,100);let A=w?S*130:0,j=T?C*130:0;t.vel.x+=f.x*A,t.vel.y+=f.y*A,e.vel.x-=f.x*j,e.vel.y-=f.y*j;let M=l(f,g);t.lean=n(t.lean+M*Math.max(S,.2),-1,1),e.lean=n(e.lean-M*Math.max(C,.2),-1,1),e.stunTimer=Math.max(e.stunTimer,C>.55?.12:0),t.stunTimer=Math.max(t.stunTimer,S>.55?.12:0),e.hitCooldown=.18,t.hitCooldown=.18,e.balance<40&&(e.recoveryWindow=.62),t.balance<40&&(t.recoveryWindow=.48),e.balance<=0&&(e.balance=0,e.recoveryWindow=.58),t.balance<=0&&(t.balance=0,t.recoveryWindow=.42),D&&(t.vel.x+=f.x*75,t.vel.y+=f.y*75),R.lastHit=D?`PERFECT IMPACT`:`IMPACT`,R.lastHitTimer=.9}function je(e,n){let r=n?18:11;for(let i=0;i<r;i++){let r=f(0,Math.PI*2),a=f(n?70:45,n?190:130);R.particles.push({pos:{x:e.x,y:e.y},vel:{x:Math.cos(r)*a,y:Math.sin(r)*a},life:f(.3,n?.75:.55),maxLife:n?.75:.55,size:f(1,n?4:3),color:i%2==0?t.lime:`#d8d2c2`})}}function Z(e,t,n){for(let r=0;r<n;r++){let n=t+f(-.8,.8),r=f(20,85);R.particles.push({pos:{x:e.x,y:e.y},vel:{x:Math.cos(n)*r,y:Math.sin(n)*r},life:f(.22,.48),maxLife:.48,size:f(1,3),color:`#817f65`})}}function Me(e){for(let t=R.particles.length-1;t>=0;t--){let n=R.particles[t];if(n.life-=e,n.life<=0){R.particles.splice(t,1);continue}n.pos.x+=n.vel.x*e,n.pos.y+=n.vel.y*e,n.vel.x*=.22**e,n.vel.y*=.22**e,n.vel.y+=80*e}}function Ne(e,t){e.eliminated||(e.eliminated=!0,e.vel.x*=.08,e.vel.y*=.08,e.fallen=!0,Z(e.pos,e.bodyAngle,18),e.id===`player`?H(`<strong>&gt;_ YOU'RE OUT</strong> ${t}.`):H(`<strong>&gt;_ CPU OUT</strong> ${t}.`),Pe())}function Pe(){if(R.phase!==`playing`||!R.player.eliminated&&!R.ai.eliminated)return;let e=!R.player.eliminated&&R.ai.eliminated,t=!R.ai.eliminated&&R.player.eliminated;if(e?(R.playerWins+=1,R.score+=650,R.player.wins+=1,G(),H(`<strong>&gt;_ ROUND WON</strong> perfect positioning.`)):t&&(R.aiWins+=1,H(`<strong>&gt;_ ROUND LOST</strong> protect your balance.`)),R.phase=`round-result`,R.playerWins>=2||R.aiWins>=2||R.round>=3){Fe();return}window.setTimeout(()=>{R.phase===`round-result`&&Ie(e)},360)}function Fe(){let e=R.playerWins>R.aiWins;e?(R.score+=1e3,H(`<strong>&gt;_ MATCH WON</strong> balance control complete.`)):H(`<strong>&gt;_ MATCH LOST</strong> the arena wins this time.`),R.score>R.bestScore&&(R.bestScore=R.score,m(R.bestScore)),R.phase=`match-result`,x.textContent=e?`YOU WIN`:`CPU WINS`,S.textContent=e?`Three rounds. One rule: read the impact before it happens.`:`Your balance broke first. The rematch is already waiting.`,D.textContent=`REMATCH`,C.textContent=`YOU ${R.playerWins} — ${R.aiWins} CPU`,w.textContent=String(R.score),T.textContent=String(R.matchPerfects),E.textContent=String(R.bestScore),b.classList.add(`is-visible`),G()}function Ie(e){x.textContent=e?`ROUND WON`:`ROUND LOST`,S.textContent=e?`You controlled the impact. Next round starts immediately.`:`You lost the exchange. Change your approach.`,D.textContent=`NEXT ROUND`,C.textContent=`YOU ${R.playerWins} — ${R.aiWins} CPU`,w.textContent=String(R.score),T.textContent=String(R.matchPerfects),E.textContent=String(R.bestScore),b.classList.add(`is-visible`)}function Le(e){R.roundTime-=e,R.roundTime<=0&&(R.roundTime=0,Re())}function Re(){if(R.phase!==`playing`)return;let e=R.player,t=R.ai,n=e.balance-t.balance,r=ze(e),i=ze(t),a=!1;a=Math.abs(n)>=8?n>0:r>i,a?(R.playerWins+=1,R.score+=400):R.aiWins+=1,R.phase=`round-result`,R.playerWins>=2||R.aiWins>=2||R.round>=3?Fe():Ie(a)}function ze(e){let t=B(),i=r(e.pos,t.center);return n(t.radius-i,0,t.radius)}function Be(e){R.phase===`countdown`&&Ce(e),R.phase===`playing`&&(Le(e),we(e),Ee(e),Ae(),R.player.balance<=0&&(R.player.recoveryWindow=Math.max(0,R.player.recoveryWindow)),R.ai.balance<=0&&(R.ai.recoveryWindow=Math.max(0,R.ai.recoveryWindow))),Me(e),R.cameraShake*=.02**e,R.impactFlash=Math.max(0,R.impactFlash-e),R.perfectTimer=Math.max(0,R.perfectTimer-e),R.lastHitTimer=Math.max(0,R.lastHitTimer-e),K()}function Ve(){let{width:e,height:t}=z();v.clearRect(0,0,e,t),v.fillStyle=`#0b0f0b`,v.fillRect(0,0,e,t);let n=R.cameraShake,r=n>0?f(-n,n):0,i=n>0?f(-n,n):0;v.save(),v.translate(r,i),He(),Ue(),We(),Ge(R.player),Ge(R.ai),qe(),Je(),Ye(),Xe(),v.restore()}function He(){let e=B(),{width:n,height:r}=z();v.fillStyle=`#101811`,v.fillRect(0,0,n,r),v.fillStyle=t.arena,v.beginPath(),v.arc(e.center.x,e.center.y,e.radius,0,Math.PI*2),v.fill(),v.strokeStyle=t.arenaLine,v.lineWidth=3,v.beginPath(),v.arc(e.center.x,e.center.y,e.radius,0,Math.PI*2),v.stroke(),v.strokeStyle=`rgba(236,235,216,.08)`,v.lineWidth=1,v.beginPath(),v.arc(e.center.x,e.center.y,e.radius*.74,0,Math.PI*2),v.stroke(),v.fillStyle=`rgba(255,255,255,.025)`,v.beginPath(),v.arc(e.center.x,e.center.y,e.radius*.31,0,Math.PI*2),v.fill()}function Ue(){for(let e of R.grass){let t=B();r({x:e.x,y:e.y},t.center)>t.radius-10||(v.save(),v.strokeStyle=`rgba(131,157,101,.27)`,v.lineWidth=1,v.beginPath(),v.moveTo(e.x,e.y),v.lineTo(e.x+e.lean*e.h,e.y-e.h),v.stroke(),v.restore())}}function We(){for(let e of R.particles){let t=n(e.life/e.maxLife,0,1);v.save(),v.globalAlpha=t,v.fillStyle=e.color,v.beginPath(),v.arc(e.pos.x,e.pos.y,e.size,0,Math.PI*2),v.fill(),v.restore()}}function Ge(e){let n=e.pos,r=e.fallen?Math.sign(e.lean||1)*.72:e.lean*.34;v.save(),v.translate(n.x,n.y),v.rotate(e.bodyAngle+r);let i=e.id===`player`?t.player:t.enemy,a=e.id===`player`?t.playerShadow:t.enemyShadow;v.save(),v.fillStyle=`rgba(0,0,0,.25)`,v.beginPath(),v.ellipse(0,14,34,11,0,0,Math.PI*2),v.fill(),v.restore(),v.strokeStyle=`#77766e`,v.lineWidth=4,v.lineCap=`round`;for(let e of[-12,8])v.beginPath(),v.moveTo(e,11),v.lineTo(e+f(-1.2,1.2),26),v.stroke();v.fillStyle=a,v.beginPath(),v.ellipse(-3,-2,29,20,0,0,Math.PI*2),v.fill(),v.fillStyle=i,v.beginPath(),v.ellipse(-6,-4,27,18,0,0,Math.PI*2),v.fill();let o=[[-20,-10,8],[-10,-16,7],[0,-17,8],[11,-13,7],[-22,1,7],[-10,8,7],[3,8,7],[15,4,7]];v.fillStyle=i;for(let[e,t,n]of o)v.beginPath(),v.arc(e,t,n,0,Math.PI*2),v.fill();v.fillStyle=a,v.beginPath(),v.ellipse(19,-2,11,12,0,0,Math.PI*2),v.fill(),v.fillStyle=i,v.beginPath(),v.ellipse(28,-3,13,11,-.08,0,Math.PI*2),v.fill(),v.fillStyle=`#ddd9cf`,v.beginPath(),v.ellipse(34,1,7,6,0,0,Math.PI*2),v.fill(),v.fillStyle=a,v.beginPath(),v.moveTo(23,-10),v.quadraticCurveTo(15,-19,24,-20),v.quadraticCurveTo(29,-16,28,-8),v.fill(),v.strokeStyle=t.horn,v.lineWidth=4,v.lineCap=`round`,v.beginPath(),v.arc(29,-7,8,Math.PI*.92,Math.PI*1.83),v.stroke(),v.beginPath(),v.arc(30,1,8,Math.PI*.12,Math.PI*1),v.stroke(),v.fillStyle=t.eye,v.beginPath(),v.arc(37,-4,1.8,0,Math.PI*2),v.fill(),v.fillStyle=`#4c4840`,v.beginPath(),v.arc(40,3,2.2,0,Math.PI*2),v.fill(),e.id===`player`&&(v.strokeStyle=`rgba(202,255,50,.7)`,v.lineWidth=1.5,v.beginPath(),v.arc(-4,-3,32,0,Math.PI*2),v.stroke()),e.balance<30&&!e.eliminated&&(v.strokeStyle=`rgba(255,98,104,.75)`,v.lineWidth=2,v.beginPath(),v.arc(0,0,36,-.8,.8),v.stroke()),v.restore(),Ke(e)}function Ke(e){R.phase!==`idle`&&(v.save(),v.fillStyle=e.id===`player`?`rgba(202,255,50,.78)`:`rgba(255,255,255,.38)`,v.font=`900 8px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`,v.textAlign=`center`,v.fillText(e.id===`player`?`YOU`:`CPU`,e.pos.x,e.pos.y-38),v.restore())}function qe(){let e=R.player;if(R.phase!==`playing`||e.eliminated||e.fallen||!e.charging&&!R.pointerActive)return;let t=e.charging?45+e.charge*95:60,n={x:e.pos.x+Math.cos(R.aimAngle)*20,y:e.pos.y+Math.sin(R.aimAngle)*20},r={x:n.x+Math.cos(R.aimAngle)*t,y:n.y+Math.sin(R.aimAngle)*t};v.save(),v.strokeStyle=e.charging?`rgba(202,255,50,.72)`:`rgba(202,255,50,.28)`,v.lineWidth=e.charging?2.5:1,v.setLineDash(e.charging?[]:[5,5]),v.beginPath(),v.moveTo(n.x,n.y),v.lineTo(r.x,r.y),v.stroke(),v.fillStyle=`rgba(202,255,50,.85)`,v.beginPath(),v.arc(r.x,r.y,e.charging?4:2.5,0,Math.PI*2),v.fill(),v.restore()}function Je(){if(R.phase!==`countdown`)return;let{width:e,height:n}=z(),r=R.countdown>0?String(R.countdown):`FIGHT`;v.save(),v.fillStyle=`rgba(8,9,8,.28)`,v.fillRect(0,0,e,n),v.fillStyle=R.countdown>0?t.white:t.lime,v.font=`950 ${Math.min(72,e*.18)}px ui-sans-serif, system-ui, sans-serif`,v.textAlign=`center`,v.textBaseline=`middle`,v.fillText(r,e/2,n/2),v.restore()}function Ye(){if(R.perfectTimer<=0)return;let{width:e,height:r}=z(),i=n(R.perfectTimer/1.25,0,1);v.save(),v.globalAlpha=i,v.fillStyle=t.lime,v.font=`950 ${Math.min(30,e*.075)}px ui-sans-serif, system-ui, sans-serif`,v.textAlign=`center`,v.fillText(R.perfectText,e/2,r*.15),v.restore()}function Xe(){if(R.phase!==`playing`)return;let{width:e}=z(),n=Math.max(0,R.roundTime),r=n.toFixed(1);v.save(),v.fillStyle=n<=5?t.red:`rgba(255,255,255,.55)`,v.font=`950 ${Math.min(18,e*.045)}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`,v.textAlign=`center`,v.fillText(r,e/2,23),v.restore()}function Q(e){let t=_.getBoundingClientRect();if(R.pointer={x:e.clientX-t.left,y:e.clientY-t.top},R.pointerActive=!0,R.phase===`playing`){let e=i(o(R.pointer,R.player.pos));Math.hypot(e.x,e.y)>.05&&(R.aimAngle=u(e))}}function Ze(e){if(R.phase===`playing`){e.preventDefault(),U();try{_.setPointerCapture(e.pointerId)}catch{}R.pointerDown=!0,Q(e),R.player.stunTimer<=0&&!R.player.fallen&&(R.player.charging=!0,R.player.charge=0,R.player.chargeTime=0,R.player.headAngle=R.aimAngle)}}function Qe(e){Q(e),!(R.player.recoveryWindow>0)&&R.pointerDown&&R.phase===`playing`&&(R.player.headAngle=R.aimAngle)}function $e(e){e.preventDefault(),R.phase===`playing`&&R.pointerDown&&De(),R.pointerDown=!1}function et(e){R.phase===`playing`&&R.pointerDown&&De(),R.pointerDown=!1;try{_.releasePointerCapture(e.pointerId)}catch{}}function tt(e){e.key===`Escape`&&R.phase===`playing`&&(R.phase=`idle`,X()),e.code===`Space`&&(e.preventDefault(),(R.phase===`idle`||R.phase===`match-result`)&&Y()),R.phase===`playing`&&(e.key===`ArrowLeft`&&(R.aimAngle-=.08),e.key===`ArrowRight`&&(R.aimAngle+=.08))}function nt(){if(U(),R.phase===`idle`||R.phase===`match-result`){Y();return}R.phase===`round-result`&&Se()}function $(){X()}function rt(){U(),R.audioReady?(k.textContent=`SOUND ON`,W(380,.08,`sine`,.05)):k.textContent=`SOUND N/A`}function it(){ve()}function at(e){if(R.destroyed)return;let t=n(e-ge,0,50);ge=e,Be(t/1e3),Ve(),L=requestAnimationFrame(at)}return _.addEventListener(`pointerdown`,Ze),_.addEventListener(`pointermove`,Qe),_.addEventListener(`pointerup`,$e),_.addEventListener(`pointercancel`,et),_.addEventListener(`pointerleave`,()=>{R.pointerActive=!1}),D.addEventListener(`click`,nt),O.addEventListener(`click`,$),k.addEventListener(`click`,rt),A.addEventListener(`click`,$),window.addEventListener(`keydown`,tt),window.addEventListener(`resize`,it),`ResizeObserver`in window&&(I=new ResizeObserver(ve),I.observe(y)),X(),L=requestAnimationFrame(at),()=>{R.destroyed=!0,cancelAnimationFrame(L),_.removeEventListener(`pointerdown`,Ze),_.removeEventListener(`pointermove`,Qe),_.removeEventListener(`pointerup`,$e),_.removeEventListener(`pointercancel`,et),D.removeEventListener(`click`,nt),O.removeEventListener(`click`,$),k.removeEventListener(`click`,rt),A.removeEventListener(`click`,$),window.removeEventListener(`keydown`,tt),window.removeEventListener(`resize`,it),I?.disconnect(),R.audioContext&&R.audioContext.close()}}export{_ as mountGame};