var e=`jembertojogja-bug-hunt-best`,t=[{id:1,title:`SOMETHING IS WRONG`,subtitle:`TYPO`,kind:`typo`,instruction:`FIND THE BUG`,timer:6,target:`profile`,targetLabel:`PROFILE`,message:`One word is pretending to be correct.`},{id:2,title:`CHECK THE NUMBERS`,subtitle:`NUMBER`,kind:`number`,instruction:`ONE VALUE IS LYING`,timer:5,target:`users`,targetLabel:`12841`,message:`Everything looks believable. That is the problem.`},{id:3,title:`STATUS: FINE`,subtitle:`STATUS`,kind:`status`,instruction:`FIND THE BUG`,timer:5,target:`server`,targetLabel:`HEALTHY`,message:`The status message is absolutely not trustworthy.`},{id:4,title:`BUTTON TEST`,subtitle:`BUTTON`,kind:`button`,instruction:`ONE BUTTON IS WRONG`,timer:5,target:`save`,targetLabel:`SAVE`,message:`Only one control is broken.`},{id:5,title:`COLOR CHECK`,subtitle:`COLOR`,kind:`color`,instruction:`FIND THE WRONG ONE`,timer:4.5,target:`ready`,targetLabel:`READY`,message:`The text is correct. The color is not.`},{id:6,title:`PIXEL PERFECT`,subtitle:`ALIGNMENT`,kind:`alignment`,instruction:`FIND THE MISALIGNED ITEM`,timer:4.5,target:`card3`,targetLabel:`CARD 03`,message:`One element is 6px away from perfection.`},{id:7,title:`DO NOT TRUST THIS`,subtitle:`FAKE BUG`,kind:`fake`,instruction:`THE OBVIOUS BUG IS NOT THE BUG`,timer:6,target:`remember`,targetLabel:`REMEMBER ME`,message:`The obvious thing is a decoy.`},{id:8,title:`READ CAREFULLY`,subtitle:`INSTRUCTION`,kind:`instruction`,instruction:`FOLLOW THE INSTRUCTION`,timer:6,target:`continue`,targetLabel:`CONTINUE`,message:`The instruction itself is suspicious.`},{id:9,title:`TIME IS BROKEN`,subtitle:`TIMER`,kind:`timer`,instruction:`FIND THE IMPOSSIBLE VALUE`,timer:5,target:`timer`,targetLabel:`00:61`,message:`A normal clock should know better.`},{id:10,title:`BEHAVIOR`,subtitle:`INTERACTION`,kind:`behavior`,instruction:`ONE CONTROL LIES`,timer:5,target:`menu`,targetLabel:`MENU`,message:`One interaction behaves differently.`},{id:11,title:`SYSTEM SAYS NO`,subtitle:`LIAR`,kind:`liar`,instruction:`DO NOT BELIEVE THE MESSAGE`,timer:5,target:`error`,targetLabel:`NO ERROR`,message:`There is no bug. According to the bug.`},{id:12,title:`THE BUG IS YOU`,subtitle:`FINAL`,kind:`fake`,instruction:`ONE LAST BUG`,timer:4,target:`user`,targetLabel:`YOU`,message:`Everything is correct. Something still isn't.`}];function n(){if(typeof window>`u`)return 0;try{return Number(window.localStorage.getItem(e)||0)}catch{return 0}}function r(t){if(typeof window<`u`)try{window.localStorage.setItem(e,String(t))}catch{}}function i(e,t,n){return Math.max(t,Math.min(n,e))}function a(){return`
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
  `}function o(e){e.innerHTML=`
    <section class="bug-hunt" data-bug-hunt>
      <style>${a()}</style>

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
  `,e.querySelector(`[data-bug-hunt]`);let o=e.querySelector(`[data-game-content]`),s=e.querySelector(`[data-level]`),ee=e.querySelector(`[data-score]`),c=e.querySelector(`[data-lives]`),l=e.querySelector(`[data-level-kicker]`),u=e.querySelector(`[data-kind]`),te=e.querySelector(`[data-instruction]`),d=e.querySelector(`[data-timer]`),f=e.querySelector(`[data-log]`),p=e.querySelector(`[data-start]`),m=e.querySelector(`[data-reset]`),h=e.querySelector(`[data-result]`),g=e.querySelector(`[data-result-kicker]`),_=e.querySelector(`[data-result-title]`),v=e.querySelector(`[data-result-copy]`),y=e.querySelector(`[data-result-score]`),b=e.querySelector(`[data-result-combo]`),x=e.querySelector(`[data-result-best]`),S=e.querySelector(`[data-result-found]`),C=e.querySelector(`[data-restart]`),w=e.querySelector(`[data-close-result]`),T=e.querySelector(`[data-flash]`),E=e.querySelector(`[data-combo]`),D=e.querySelector(`[data-combo-number]`),O=!1,k=0,A=performance.now(),j={level:1,score:0,combo:0,bestScore:n(),lives:3,timeLeft:t[0].timer,started:!1,finished:!1,locked:!1,found:!1,wrongTaps:0,lastResult:``,levelStartTime:0};function M(){return t[j.level-1]||t[t.length-1]}function N(e){f.innerHTML=e}function P(){let e=M();s.textContent=String(j.level).padStart(2,`0`),ee.textContent=String(j.score),c.textContent=String(j.lives),c.classList.toggle(`is-danger`,j.lives<=1),l.textContent=`LEVEL ${String(j.level).padStart(2,`0`)}`,u.textContent=e.subtitle,te.textContent=e.instruction,d.textContent=j.timeLeft.toFixed(1),d.classList.toggle(`is-danger`,j.timeLeft<=1.5),D.textContent=`x${Math.max(2,j.combo)}`,E.classList.toggle(`is-visible`,j.combo>=2&&j.started&&!j.found)}function F(){j.finished&&L(),j.started=!0,j.finished=!1,j.locked=!1,j.found=!1,j.wrongTaps=0,j.timeLeft=M().timer,j.levelStartTime=performance.now(),p.textContent=`PAUSE`,R(),N(`<strong>&gt;_ HUNT</strong> ${M().message}`)}function I(){!j.started||j.locked||j.found||(j.started=!1,p.textContent=`RESUME`,N(`<strong>&gt;_ PAUSED</strong> the bug is still waiting.`))}function L(){j.level=1,j.score=0,j.combo=0,j.lives=3,j.timeLeft=t[0].timer,j.started=!1,j.finished=!1,j.locked=!1,j.found=!1,j.wrongTaps=0,j.lastResult=``,h.classList.remove(`is-visible`),p.textContent=`START`,ne(),P(),N(`<strong>&gt;_ SYSTEM</strong> press START to begin the hunt.`)}function ne(){o.innerHTML=`
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
    `}function R(){let e=M(),t=`
      <div class="bug-hunt__row bug-hunt__row--small">
        <span class="bug-hunt__label">APPLICATION</span>
        <span class="bug-hunt__value">JEMBER OS</span>
      </div>
    `;switch(e.kind){case`typo`:o.innerHTML=`
          ${t}

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
        `;break;case`number`:o.innerHTML=`
          ${t}

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
        `;break;case`status`:o.innerHTML=`
          ${t}

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
        `;break;case`button`:o.innerHTML=`
          ${t}

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
        `;break;case`color`:o.innerHTML=`
          ${t}

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
        `;break;case`alignment`:o.innerHTML=`
          ${t}

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
        `;break;case`fake`:o.innerHTML=`
          ${t}

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
        `;break;case`instruction`:o.innerHTML=`
          ${t}

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
        `;break;case`timer`:o.innerHTML=`
          ${t}

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
        `;break;case`behavior`:o.innerHTML=`
          ${t}

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
        `;break;case`liar`:o.innerHTML=`
          ${t}

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
        `;break;default:o.innerHTML=`
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
        `}e.id===12&&(o.innerHTML=`
        ${t}

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
      `),re(),P()}function re(){o.querySelectorAll(`[data-answer]`).forEach(e=>{let t=e;t.style.cursor=`pointer`,t.setAttribute(`role`,`button`),t.setAttribute(`tabindex`,`0`)});let e=o.querySelector(`[data-wobble]`);e&&(e.addEventListener(`pointerenter`,z),e.addEventListener(`pointerdown`,z))}function z(e){let t=e.currentTarget;t.style.transform=`translateX(${Math.random()*16-8}px) rotate(${Math.random()*4-2}deg)`}function B(e){if(!j.started||j.locked||j.found)return;let t=e.target;if(!t)return;let n=t.closest(`[data-answer]`);if(!n){H();return}n.getAttribute(`data-answer`)===M().target?U(n):H(n)}function V(e){if(e.key===`Enter`||e.key===` `){let t=document.activeElement;t&&o.contains(t)&&(e.preventDefault(),t.click())}e.key===`Escape`&&(I(),h.classList.remove(`is-visible`))}function H(e){j.started&&!j.locked&&(j.wrongTaps+=1,j.combo=0,--j.lives,e&&(e.classList.add(`bug-hunt__wrong`),window.setTimeout(()=>{e.classList.remove(`bug-hunt__wrong`)},240)),T.classList.remove(`is-good`),T.classList.add(`is-bad`),window.setTimeout(()=>{T.classList.remove(`is-bad`)},160),N(`<strong>&gt;_ WRONG</strong> that was not the bug. -1 life.`),P(),j.lives<=0&&W(`You tapped the UI too confidently.`))}function U(e){if(!j.started||j.locked)return;j.locked=!0,j.found=!0,j.combo+=1;let t=M(),n=Math.max(0,j.timeLeft),i=Math.round(n*100),a=Math.max(0,j.combo-1)*75,o=j.wrongTaps*35,s=Math.max(25,150+i+a-o);j.score+=s,j.score>j.bestScore&&(j.bestScore=j.score,r(j.bestScore)),e.classList.add(`bug-hunt__correct`),T.classList.remove(`is-bad`),T.classList.add(`is-good`),window.setTimeout(()=>{T.classList.remove(`is-good`)},180),N(`<strong>&gt;_ BUG FOUND</strong> ${t.targetLabel} / +${s} points.`),P(),window.setTimeout(()=>{G()},620)}function W(e){j.started=!1,j.locked=!0,p.textContent=`START`,g.textContent=`HUNT FAILED`,_.textContent=`GAME OVER`,v.textContent=e,y.textContent=String(j.score),b.textContent=`x${j.combo}`,x.textContent=String(j.bestScore),S.textContent=`${Math.max(0,j.level-1)}/${t.length}`,h.classList.add(`is-visible`),N(`<strong>&gt;_ FAILURE</strong> ${e}`)}function G(){if(!O&&j.found){if(j.level+=1,j.level>t.length){K();return}j.locked=!1,j.found=!1,j.wrongTaps=0,j.timeLeft=M().timer,j.started=!0,p.textContent=`PAUSE`,R(),N(`<strong>&gt;_ NEXT</strong> ${M().message}`)}}function K(){j.started=!1,j.finished=!0,j.locked=!0,p.textContent=`START`,g.textContent=`ALL BUGS FOUND`,_.textContent=String(j.score),v.textContent=`Twelve levels. Twelve lies. One suspicious developer.`,y.textContent=String(j.score),b.textContent=`x${j.combo}`,x.textContent=String(j.bestScore),S.textContent=`${t.length}/${t.length}`,h.classList.add(`is-visible`),N(`<strong>&gt;_ COMPLETE</strong> production is still probably broken.`)}function q(e){if(!(!j.started||j.locked||j.found||j.finished)){if(j.timeLeft-=e/1e3,M().kind===`behavior`){let e=o.querySelector(`[data-wobble]`);if(e){let t=(performance.now()-j.levelStartTime)/1e3,n=Math.sin(t*7)*2;e.style.transform=`translateX(${n}px)`}}j.timeLeft<=0&&(j.timeLeft=0,j.combo=0,W(`Time expired. The bug escaped.`)),P()}}function J(e){if(O)return;let t=i(e-A,0,100);A=e,q(t),k=requestAnimationFrame(J)}function Y(){if(j.started){I();return}j.finished&&L(),h.classList.contains(`is-visible`)&&h.classList.remove(`is-visible`),F()}function X(){L()}function Z(){h.classList.remove(`is-visible`),L(),F()}function Q(){h.classList.remove(`is-visible`)}function $(e){B(e)}return o.addEventListener(`pointerdown`,$),o.addEventListener(`keydown`,V),p.addEventListener(`click`,Y),m.addEventListener(`click`,X),C.addEventListener(`click`,Z),w.addEventListener(`click`,Q),window.addEventListener(`keydown`,V),L(),k=requestAnimationFrame(J),()=>{O=!0,cancelAnimationFrame(k),o.removeEventListener(`pointerdown`,$),o.removeEventListener(`keydown`,V),p.removeEventListener(`click`,Y),m.removeEventListener(`click`,X),C.removeEventListener(`click`,Z),w.removeEventListener(`click`,Q),window.removeEventListener(`keydown`,V)}}export{o as mountGame};