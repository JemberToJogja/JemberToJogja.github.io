var e=`jtj-pixel-panic`,t=`jtj-pixel-panic-best`;function n(e,t){let n=e.querySelector(t);if(!n)throw Error(`[PIXEL PANIC] Missing element: ${t}`);return n}function r(){try{return Number(localStorage.getItem(t)??`0`)||0}catch{return 0}}function i(e){try{localStorage.setItem(t,String(Math.max(0,Math.floor(e))))}catch{}}function a(e){return String(Math.max(0,Math.floor(e))).padStart(5,`0`)}function o(){if(document.head.querySelector(`[data-pixel-panic-style="true"]`))return;let t=document.createElement(`style`);t.dataset.pixelPanicStyle=`true`,t.textContent=`
    .${e} {
      --bg: #090909;
      --panel: #101010;
      --panel-2: #151515;
      --line: #2a2a2a;
      --text: #f4f1e8;
      --muted: #8d8d8d;
      --soft: #1d1d1d;
      --signal: #ffffff;
      --danger: #ff4d4d;
      --success: #73ff9b;

      min-height: min(760px, calc(100svh - 32px));
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 14px;
      box-sizing: border-box;
      background: var(--bg);
      color: var(--text);
      border: 1px solid var(--line);
      font-family:
        ui-monospace,
        SFMono-Regular,
        Menlo,
        Monaco,
        Consolas,
        monospace;
    }

    .${e} *,
    .${e} *::before,
    .${e} *::after {
      box-sizing: border-box;
    }

    .${e}-topbar {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .${e}-stat {
      border: 1px solid var(--line);
      background: var(--panel);
      padding: 10px 12px;
    }

    .${e}-stat-label {
      display: block;
      margin-bottom: 4px;
      color: var(--muted);
      font-size: 9px;
      line-height: 1;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    .${e}-stat-value {
      display: block;
      font-size: clamp(17px, 5vw, 24px);
      font-weight: 900;
      line-height: 1;
      letter-spacing: -0.04em;
    }

    .${e}-header {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 2px 0 0;
    }

    .${e}-eyebrow {
      color: var(--muted);
      font-size: 9px;
      line-height: 1;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    .${e}-title {
      margin: 0;
      font-size: clamp(28px, 9vw, 52px);
      line-height: 0.92;
      letter-spacing: -0.07em;
    }

    .${e}-subtitle {
      margin: 0;
      max-width: 38rem;
      color: #aaa;
      font-size: 11px;
      line-height: 1.5;
    }

    .${e}-hud {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      min-height: 38px;
      border-top: 1px solid var(--line);
      border-bottom: 1px solid var(--line);
      padding: 9px 0;
    }

    .${e}-state {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      color: var(--muted);
      font-size: 9px;
      line-height: 1;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .${e}-state-dot {
      width: 7px;
      height: 7px;
      flex: 0 0 auto;
      background: var(--muted);
    }

    .${e}-round {
      color: var(--text);
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .${e}-instruction {
      min-height: 54px;
      display: grid;
      place-items: center;
      padding: 10px;
      border: 1px solid var(--line);
      background: var(--panel);
      text-align: center;
      font-size: clamp(12px, 3.8vw, 16px);
      font-weight: 900;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .${e}-board-shell {
      position: relative;
      display: grid;
      place-items: center;
      padding: 2px;
    }

    .${e}-board {
      width: min(100%, 430px);
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
      touch-action: manipulation;
      user-select: none;
    }

    .${e}-cell {
      position: relative;
      aspect-ratio: 1;
      min-width: 0;
      border: 1px solid #292929;
      padding: 0;
      background: var(--soft);
      color: var(--muted);
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      transition:
        transform 90ms ease,
        background-color 90ms ease,
        border-color 90ms ease,
        color 90ms ease;
    }

    .${e}-cell::before {
      content: "";
      position: absolute;
      inset: 22%;
      border: 1px solid #333;
      pointer-events: none;
    }

    .${e}-cell:active {
      transform: scale(0.96);
    }

    .${e}-cell.signal {
      background: var(--signal);
      border-color: var(--signal);
      color: #090909;
    }

    .${e}-cell.signal::before {
      border-color: #090909;
    }

    .${e}-cell.success {
      background: var(--success);
      border-color: var(--success);
      color: #07120b;
    }

    .${e}-cell.success::before {
      border-color: #07120b;
    }

    .${e}-cell.error {
      background: var(--danger);
      border-color: var(--danger);
      color: #190707;
    }

    .${e}-cell.error::before {
      border-color: #190707;
    }

    .${e}-cell:disabled {
      cursor: default;
    }

    .${e}-cell-number {
      position: absolute;
      left: 8px;
      top: 7px;
      font-size: 8px;
      font-weight: 800;
      letter-spacing: 0.05em;
      opacity: 0.65;
    }

    .${e}-cell-corner {
      position: absolute;
      right: 8px;
      bottom: 7px;
      font-size: 8px;
      opacity: 0.45;
    }

    .${e}-panel {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .${e}-panel-block {
      min-width: 0;
      border: 1px solid var(--line);
      background: var(--panel);
      padding: 10px 12px;
    }

    .${e}-panel-label {
      display: block;
      margin-bottom: 5px;
      color: var(--muted);
      font-size: 8px;
      line-height: 1;
      letter-spacing: 0.13em;
      text-transform: uppercase;
    }

    .${e}-panel-value {
      display: block;
      min-height: 18px;
      font-size: 10px;
      font-weight: 800;
      line-height: 1.35;
      text-transform: uppercase;
    }

    .${e}-lives {
      display: flex;
      gap: 5px;
      margin-top: 2px;
    }

    .${e}-life {
      width: 18px;
      height: 8px;
      background: #313131;
    }

    .${e}-life.alive {
      background: var(--text);
    }

    .${e}-action {
      width: 100%;
      min-height: 58px;
      border: 1px solid var(--text);
      background: var(--text);
      color: #090909;
      font: inherit;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    .${e}-action:active {
      transform: translateY(1px);
    }

    .${e}-action:disabled {
      border-color: var(--line);
      background: var(--panel-2);
      color: var(--muted);
      cursor: default;
    }

    .${e}-footer {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      margin-top: auto;
      color: var(--muted);
      font-size: 8px;
      line-height: 1.4;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .${e}-footer span:last-child {
      text-align: right;
    }

    .${e}.is-arming
      .${e}-state-dot {
      background: var(--signal);
      animation: jtj-pixel-panic-blink 420ms steps(1, end) infinite;
    }

    .${e}.is-active
      .${e}-state-dot {
      background: var(--success);
      box-shadow: 0 0 0 4px rgba(115, 255, 155, 0.08);
    }

    .${e}.is-error
      .${e}-state-dot {
      background: var(--danger);
    }

    @keyframes jtj-pixel-panic-blink {
      0%,
      100% {
        opacity: 1;
      }

      50% {
        opacity: 0.15;
      }
    }

    @media (min-width: 640px) {
      .${e} {
        padding: 18px;
        gap: 16px;
      }

      .${e}-topbar {
        grid-template-columns: repeat(4, 1fr);
      }

      .${e}-panel {
        grid-template-columns: repeat(3, 1fr);
      }

      .${e}-action {
        max-width: 430px;
        margin-inline: auto;
      }
    }
  `,document.head.appendChild(t)}function s(t){o(),t.innerHTML=`
    <div class="${e}">
      <div class="${e}-topbar">
        <div class="${e}-stat">
          <span class="${e}-stat-label">Score</span>
          <strong
            id="pixel-score"
            class="${e}-stat-value"
          >
            00000
          </strong>
        </div>

        <div class="${e}-stat">
          <span class="${e}-stat-label">Best</span>
          <strong
            id="pixel-best"
            class="${e}-stat-value"
          >
            00000
          </strong>
        </div>

        <div class="${e}-stat">
          <span class="${e}-stat-label">Combo</span>
          <strong
            id="pixel-combo"
            class="${e}-stat-value"
          >
            x00
          </strong>
        </div>

        <div class="${e}-stat">
          <span class="${e}-stat-label">Reaction</span>
          <strong
            id="pixel-reaction"
            class="${e}-stat-value"
          >
            ---ms
          </strong>
        </div>
      </div>

      <div class="${e}-header">
        <span class="${e}-eyebrow">
          JEMBERTOJOGJA / ARCADE 08
        </span>

        <h2 class="${e}-title">
          PIXEL PANIC
        </h2>

        <p class="${e}-subtitle">
          Wait for the signal. Hit the correct pixel.
          Tap early and the pixel gods will know.
        </p>
      </div>

      <div class="${e}-hud">
        <div class="${e}-state">
          <span
            id="pixel-state-dot"
            class="${e}-state-dot"
          ></span>

          <span id="pixel-state">
            READY
          </span>
        </div>

        <div
          id="pixel-round"
          class="${e}-round"
        >
          ROUND 00
        </div>
      </div>

      <div
        id="pixel-instruction"
        class="${e}-instruction"
      >
        PRESS START. DON'T PANIC.
      </div>

      <div class="${e}-board-shell">
        <div
          id="pixel-board"
          class="${e}-board"
          aria-label="Pixel Panic game board"
        ></div>
      </div>

      <div class="${e}-panel">
        <div class="${e}-panel-block">
          <span class="${e}-panel-label">
            Lives
          </span>

          <div
            id="pixel-lives"
            class="${e}-lives"
          >
            <span class="${e}-life alive"></span>
            <span class="${e}-life alive"></span>
            <span class="${e}-life alive"></span>
          </div>
        </div>

        <div class="${e}-panel-block">
          <span class="${e}-panel-label">
            Difficulty
          </span>

          <strong
            id="pixel-difficulty"
            class="${e}-panel-value"
          >
            CALM
          </strong>
        </div>
      </div>

      <button
        id="pixel-action"
        class="${e}-action"
        type="button"
      >
        START PIXEL PANIC ↗
      </button>

      <div class="${e}-footer">
        <span>
          Touch / Mouse / 1–9
        </span>

        <span>
          Faster every round
        </span>
      </div>
    </div>
  `;let s=n(t,`.${e}`),c=n(t,`#pixel-score`),l=n(t,`#pixel-best`),u=n(t,`#pixel-combo`),d=n(t,`#pixel-reaction`),f=n(t,`#pixel-state`),p=n(t,`#pixel-round`),m=n(t,`#pixel-instruction`),h=n(t,`#pixel-board`),g=n(t,`#pixel-lives`),_=n(t,`#pixel-difficulty`),v=n(t,`#pixel-action`),y=[],b=`ready`,x=0,S=r(),C=0,w=0,T=3,E=-1,D=0,O=null,k=null,A=null;function j(){if(A)return A;try{return A=new AudioContext,A}catch{return null}}function M(e,t,n=`square`){let r=j();if(!r)return;let i=r.createOscillator(),a=r.createGain();i.type=n,i.frequency.value=e,a.gain.setValueAtTime(1e-4,r.currentTime),a.gain.exponentialRampToValueAtTime(.055,r.currentTime+.01),a.gain.exponentialRampToValueAtTime(1e-4,r.currentTime+t),i.connect(a),a.connect(r.destination),i.start(),i.stop(r.currentTime+t)}function N(e){typeof navigator<`u`&&`vibrate`in navigator&&navigator.vibrate(e)}function P(){O!==null&&(window.clearTimeout(O),O=null),k!==null&&(window.clearTimeout(k),k=null)}function F(){return Math.max(420,1200-(C-1)*55)}function I(){return C>=12?`INSANE`:C>=8?`FAST`:C>=5?`HOT`:C>=3?`WARM`:`CALM`}function L(){c.textContent=a(x),l.textContent=a(S),u.textContent=`x${String(w).padStart(2,`0`)}`,p.textContent=`ROUND ${String(C).padStart(2,`0`)}`,_.textContent=I();let e=D>0?d.textContent:`---ms`;d.textContent=e}function R(){Array.from(g.children).forEach((e,t)=>{e.classList.toggle(`alive`,t<T)})}function z(e,t){b=e,f.textContent=t,s.classList.remove(`is-arming`,`is-active`,`is-error`),e===`arming`&&s.classList.add(`is-arming`),e===`active`&&s.classList.add(`is-active`),e===`gameover`&&s.classList.add(`is-error`)}function B(){y.forEach(e=>{e.classList.remove(`signal`,`success`,`error`),e.disabled=!0})}function V(){h.innerHTML=``,y.length=0;for(let t=0;t<9;t+=1){let n=document.createElement(`button`);n.type=`button`,n.className=`${e}-cell`,n.disabled=!0,n.setAttribute(`aria-label`,`Pixel ${t+1}`),n.innerHTML=`
        <span class="${e}-cell-number">
          ${String(t+1).padStart(2,`0`)}
        </span>

        <span class="${e}-cell-corner">
          0x${(t+1).toString(16).toUpperCase().padStart(2,`0`)}
        </span>
      `,n.addEventListener(`click`,()=>{G(t)}),h.appendChild(n),y.push(n)}}function H(){let e=Math.floor(Math.random()*9);for(;e===E;)e=Math.floor(Math.random()*9);return e}function U(){P(),B(),C+=1,E=H(),D=0,z(`arming`,`ARMING`),m.textContent=`WAIT FOR THE PIXEL`,d.textContent=`---ms`,L(),O=window.setTimeout(()=>{O=null,b=`active`,z(`active`,`PANIC`),m.textContent=`TAP THE SIGNAL`;let e=y[E];e&&(e.classList.add(`signal`),e.disabled=!1,y.forEach((e,t)=>{t!==E&&(e.disabled=!1)}),D=performance.now(),M(880,.08,`square`),N(12))},F())}function W(e){let t=Math.max(80,500-Math.floor(e)),n=w*40,r=C*25;return t+n+r}function G(e){if(b!==`active`)return;let t=y[e];if(!t)return;if(e!==E){if(t.classList.add(`error`),--T,w=0,R(),L(),M(120,.14,`sawtooth`),N([35,25,50]),m.textContent=T>0?`WRONG PIXEL`:`SYSTEM PANIC`,z(T>0?`arming`:`gameover`,T>0?`MISS`:`CRASH`),y.forEach(e=>{e.disabled=!0}),T<=0){q();return}k=window.setTimeout(()=>{k=null,U()},650);return}let n=Math.max(1,Math.round(performance.now()-D)),r=W(n);x+=r,w+=1,x>S&&(S=x,i(S)),d.textContent=`${n}ms`,t.classList.remove(`signal`),t.classList.add(`success`),y.forEach(e=>{e.disabled=!0}),b=`success`,z(`success`,`CLEAR`),m.textContent=`+${r} / ${n}ms`,M(620+Math.min(w,10)*24,.08,`square`),N(18),L(),k=window.setTimeout(()=>{k=null,U()},430)}function K(){P(),x=0,C=0,w=0,T=3,E=-1,D=0,v.disabled=!0,v.textContent=`PIXEL PANIC RUNNING`,m.textContent=`WAIT FOR THE PIXEL`,d.textContent=`---ms`,R(),L(),U()}function q(){P(),b=`gameover`,z(`gameover`,`CRASH`),B(),x>S&&(S=x,i(S)),m.textContent=`FINAL ${a(x)}`,v.disabled=!1,v.textContent=`RESTART PIXEL PANIC ↗`,L(),M(90,.22,`sawtooth`),N([60,30,90])}function J(e){let t=e.target;if(t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement||t instanceof HTMLSelectElement)return;if(e.key===`Enter`||e.key===` `){(b===`ready`||b===`gameover`)&&(e.preventDefault(),K());return}let n=Number(e.key);Number.isInteger(n)&&n>=1&&n<=9&&(e.preventDefault(),G(n-1)),e.key===`Escape`&&(P(),b=`ready`,B(),v.disabled=!1,v.textContent=`START PIXEL PANIC ↗`,m.textContent=`PRESS START. DON'T PANIC.`,z(`ready`,`READY`),C=0,w=0,x=0,T=3,R(),L())}return v.addEventListener(`click`,()=>{(b===`ready`||b===`gameover`)&&K()}),V(),B(),R(),L(),m.textContent=`PRESS START. DON'T PANIC.`,z(`ready`,`READY`),document.addEventListener(`keydown`,J),()=>{P(),document.removeEventListener(`keydown`,J),A&&=(A.close(),null),t.innerHTML=``}}export{s as mountGame};