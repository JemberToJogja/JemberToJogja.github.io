var e=`jtj-system-2048-best-score`,t=`jtj-system-2048`;function n(e,t){let n=e.querySelector(t);if(!n)throw Error(`[SYSTEM 2048] Missing element: ${t}`);return n}function r(){try{let t=localStorage.getItem(e);if(!t)return 0;let n=Number(t);return Number.isFinite(n)?Math.max(0,Math.floor(n)):0}catch{return 0}}function i(t){try{localStorage.setItem(e,String(Math.max(0,Math.floor(t))))}catch{}}function a(e){return String(Math.max(0,Math.floor(e))).padStart(5,`0`)}function o(){if(document.head.querySelector(`[data-system-2048-style="true"]`))return;let e=document.createElement(`style`);e.dataset.system2048Style=`true`,e.textContent=`
    .${t} {
      width: min(100%, 640px);
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

    .${t} * {
      box-sizing: border-box;
    }

    .${t} button {
      font: inherit;
      -webkit-tap-highlight-color: transparent;
    }

    .${t}-head {
      display: grid;
      gap: 12px;
      margin-bottom: 15px;
    }

    .${t}-eyebrow {
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

    .${t}-title {
      margin: 0;

      color: #eeeae1;

      font-size: clamp(
        44px,
        13vw,
        90px
      );

      font-weight: 950;
      line-height: .82;
      letter-spacing: -.085em;
    }

    .${t}-description {
      max-width: 570px;
      margin: 0;

      color: #7d7972;

      font-size: 12px;
      line-height: 1.7;
    }

    .${t}-panel {
      overflow: hidden;

      background: #242423;
      border: 1px solid #45443f;
    }

    .${t}-topbar {
      display: grid;
      grid-template-columns:
        minmax(0, 1fr)
        50px
        minmax(0, 1fr);

      gap: 8px;
      align-items: center;

      padding: 10px;

      background: #0d0d0d;
      border-bottom: 1px solid #302f2c;
    }

    .${t}-score {
      display: grid;
      gap: 4px;
    }

    .${t}-score:last-child {
      justify-items: end;
    }

    .${t}-score span {
      color: #5a5852;

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

    .${t}-score strong {
      color: #eeeae1;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 18px;
      font-weight: 900;
      line-height: 1;
      letter-spacing: -.04em;
    }

    .${t}-restart {
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

    .${t}-restart:active {
      transform: translateY(1px);
    }

    .${t}-board-wrap {
      padding: 10px;

      background: #353430;

      touch-action: none;
    }

    .${t}-board {
      position: relative;

      width: 100%;
      max-width: 540px;

      aspect-ratio: 1;

      margin: 0 auto;
      padding: 7px;

      display: grid;
      grid-template-columns:
        repeat(4, minmax(0, 1fr));
      gap: 7px;

      background: #5c5952;

      touch-action: none;
      user-select: none;

      overscroll-behavior: none;
      -webkit-user-select: none;
    }

    .${t}-cell {
      min-width: 0;
      aspect-ratio: 1;

      display: grid;
      place-items: center;

      background: #474641;
      border: 0;

      color: #4d4a44;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: clamp(
        24px,
        9vw,
        56px
      );

      font-weight: 950;
      line-height: 1;

      letter-spacing: -.07em;
    }

    .${t}-tile {
      min-width: 0;

      display: grid;
      place-items: center;

      border: 0;

      color: #f0ece3;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: clamp(
        24px,
        9vw,
        56px
      );

      font-weight: 950;
      line-height: 1;

      letter-spacing: -.08em;

      overflow: hidden;
    }

    .${t}-tile[data-value="2"] {
      background: #5a5750;
    }

    .${t}-tile[data-value="4"] {
      background: #67645d;
    }

    .${t}-tile[data-value="8"] {
      background: #756c5a;
    }

    .${t}-tile[data-value="16"] {
      background: #805f4f;
    }

    .${t}-tile[data-value="32"] {
      background: #8b5447;
    }

    .${t}-tile[data-value="64"] {
      background: #91473c;
    }

    .${t}-tile[data-value="128"] {
      background: #756a50;
      font-size: clamp(
        20px,
        7vw,
        44px
      );
    }

    .${t}-tile[data-value="256"] {
      background: #69604b;
      font-size: clamp(
        20px,
        7vw,
        44px
      );
    }

    .${t}-tile[data-value="512"] {
      background: #5d5546;
      font-size: clamp(
        20px,
        7vw,
        44px
      );
    }

    .${t}-tile[data-value="1024"] {
      background: #4f493f;
      font-size: clamp(
        17px,
        5.8vw,
        37px
      );
    }

    .${t}-tile[data-value="2048"] {
      background: #eeeae1;
      color: #121212;
      font-size: clamp(
        17px,
        5.8vw,
        37px
      );
    }

    .${t}-tile[data-value="4096"],
    .${t}-tile[data-value="8192"] {
      background: #31312f;
      font-size: clamp(
        16px,
        5vw,
        31px
      );
    }

    /* =========================================================
       CONTROLS
    ========================================================= */

    .${t}-controls {
      padding: 14px 12px 16px;

      background: #111111;
      border-top: 1px solid #292927;

      touch-action: manipulation;
    }

    .${t}-controls-label {
      margin-bottom: 11px;

      color: #54514b;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 6px;
      font-weight: 800;
      letter-spacing: .12em;
      text-align: center;
    }

    .${t}-dpad {
      width: min(100%, 260px);

      margin: 0 auto;

      display: grid;
      grid-template-columns:
        repeat(3, 1fr);
      grid-template-rows:
        repeat(2, 62px);

      gap: 8px;
    }

    .${t}-move {
      min-width: 0;
      min-height: 62px;

      display: grid;
      place-items: center;

      padding: 0;

      border: 1px solid #44423d;

      background: #20201e;
      color: #d6d1c8;

      cursor: pointer;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 25px;
      font-weight: 900;
      line-height: 1;

      touch-action: manipulation;
      user-select: none;

      transition:
        background-color 80ms ease,
        color 80ms ease,
        transform 80ms ease,
        border-color 80ms ease;
    }

    .${t}-move:active {
      background: #eeeae1;
      border-color: #eeeae1;
      color: #111111;
      transform: scale(.96);
    }

    .${t}-move[data-direction="up"] {
      grid-column: 2;
      grid-row: 1;
    }

    .${t}-move[data-direction="left"] {
      grid-column: 1;
      grid-row: 2;
    }

    .${t}-move[data-direction="down"] {
      grid-column: 2;
      grid-row: 2;
    }

    .${t}-move[data-direction="right"] {
      grid-column: 3;
      grid-row: 2;
    }

    .${t}-gesture-hint {
      margin-top: 12px;

      color: #4f4d48;

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

    .${t}-status {
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
      line-height: 1.5;
      letter-spacing: .08em;
      text-align: center;
    }

    .${t}-status.success {
      color: #bfd2b5;
      border-color: #394434;
    }

    .${t}-status.danger {
      color: #d59a91;
      border-color: #493330;
    }

    .${t}-footer {
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
      .${t} {
        padding: 30px;
      }

      .${t}-board-wrap {
        padding: 16px;
      }

      .${t}-dpad {
        width: 280px;
      }

      .${t}-move {
        min-height: 66px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .${t}-move {
        transition: none;
      }
    }
  `,document.head.appendChild(e)}function s(){return Array.from({length:16},()=>0)}function c(e){let t=[];return e.forEach((e,n)=>{e===0&&t.push(n)}),t}function l(e){let t=c(e);if(t.length===0)return!1;let n=t[Math.floor(Math.random()*t.length)];return n!==void 0&&(e[n]=Math.random()<.9?2:4,!0)}function u(e){let t=e.filter(e=>e!==0),n=[],r=0;for(let e=0;e<t.length;e+=1){let i=t[e],a=t[e+1];if(i!==void 0&&a!==void 0&&i===a){let t=i*2;n.push(t),r+=t,e+=1}else i!==void 0&&n.push(i)}for(;n.length<4;)n.push(0);let i=n.some((t,n)=>t!==e[n]);return{line:n,score:r,moved:i}}function d(e,t,n){let r=[];for(let i=0;i<4;i+=1){let a=n,o=i;t===`up`&&(a=i,o=n),t===`down`&&(a=3-i,o=n),t===`left`&&(a=n,o=i),t===`right`&&(a=n,o=3-i),r.push(e[a*4+o]??0)}return r}function f(e,t,n,r){for(let i=0;i<4;i+=1){let a=n,o=i;t===`up`&&(a=i,o=n),t===`down`&&(a=3-i,o=n),t===`left`&&(a=n,o=i),t===`right`&&(a=n,o=3-i),e[a*4+o]=r[i]??0}}function p(e,t){let n=[...e],r=0,i=!1;for(let e=0;e<4;e+=1){let a=u(d(n,t,e));f(n,t,e,a.line),r+=a.score,a.moved&&(i=!0)}return i&&l(n),{board:n,score:r,moved:i}}function m(e){if(e.some(e=>e===0))return!0;for(let t=0;t<4;t+=1)for(let n=0;n<4;n+=1){let r=e[t*4+n];if(r!==void 0&&(n+1<4&&e[t*4+n+1]===r||t+1<4&&e[(t+1)*4+n]===r))return!0}return!1}function h(e){return e.some(e=>e>=2048)}function g(e){if(typeof navigator.vibrate==`function`)try{navigator.vibrate(e)}catch{}}function _(e){o(),e.innerHTML=`
    <div class="${t}">
      <div class="${t}-head">
        <div class="${t}-eyebrow">
          <span>GAME 04 / PUZZLE</span>
          <span>SYSTEM TEST</span>
        </div>

        <h2 class="${t}-title">
          SYSTEM 2048
        </h2>

        <p class="${t}-description">
          Merge numbers, build bigger numbers,
          and slowly forget why this was supposed
          to be a five-minute break.
        </p>
      </div>

      <div class="${t}-panel">
        <div class="${t}-topbar">
          <div class="${t}-score">
            <span>SCORE</span>
            <strong id="system-2048-score">
              00000
            </strong>
          </div>

          <button
            type="button"
            class="${t}-restart"
            id="system-2048-restart"
            aria-label="Restart 2048"
          >
            ↻
          </button>

          <div class="${t}-score">
            <span>BEST</span>
            <strong id="system-2048-best">
              00000
            </strong>
          </div>
        </div>

        <div class="${t}-board-wrap">
          <div
            class="${t}-board"
            id="system-2048-board"
            aria-label="2048 game board"
            role="application"
          ></div>
        </div>

        <div class="${t}-controls">
          <div class="${t}-controls-label">
            SWIPE BOARD OR USE CONTROLS
          </div>

          <div class="${t}-dpad">
            <button
              type="button"
              class="${t}-move"
              data-direction="up"
              aria-label="Move up"
            >
              ↑
            </button>

            <button
              type="button"
              class="${t}-move"
              data-direction="left"
              aria-label="Move left"
            >
              ←
            </button>

            <button
              type="button"
              class="${t}-move"
              data-direction="down"
              aria-label="Move down"
            >
              ↓
            </button>

            <button
              type="button"
              class="${t}-move"
              data-direction="right"
              aria-label="Move right"
            >
              →
            </button>
          </div>

          <div class="${t}-gesture-hint">
            TOUCH + DRAG IN ANY DIRECTION
          </div>
        </div>
      </div>

      <div
        id="system-2048-status"
        class="${t}-status"
      >
        SWIPE TO MOVE
      </div>

      <div class="${t}-footer">
        <span>
          2048 / KEEP GOING
        </span>

        <span>
          MERGE / REPEAT / REGRET
        </span>
      </div>
    </div>
  `;let c=n(e,`#system-2048-board`),u=n(e,`#system-2048-score`),d=n(e,`#system-2048-best`),f=n(e,`#system-2048-restart`),_=n(e,`#system-2048-status`),v=Array.from(e.querySelectorAll(`[data-direction]`)),y={board:s(),score:0,best:r(),won:!1,gameOver:!1},b=!1,x=null,S=null,C=null;function w(e,n=``){_.textContent=e,_.className=`${t}-status`,n&&_.classList.add(n)}function T(){u.textContent=a(y.score),d.textContent=a(y.best)}function E(){c.innerHTML=``,y.board.forEach((e,n)=>{let r=document.createElement(`div`);if(r.className=`${t}-cell`,e>0){let n=document.createElement(`div`);n.className=`${t}-tile`,n.dataset.value=String(e),n.textContent=String(e),r.appendChild(n)}r.dataset.index=String(n),c.appendChild(r)}),T()}function D(){y={board:s(),score:0,best:r(),won:!1,gameOver:!1},b=!1,l(y.board),l(y.board),w(`SWIPE TO MOVE`),E()}function O(e){if(y.gameOver||y.won&&!b)return;let t=p(y.board,e);if(!t.moved){m(y.board)||(y.gameOver=!0,w(`SYSTEM HALTED / NO MOVES LEFT`,`danger`),E(),g([60,40,90]));return}y.board=t.board,y.score+=t.score,y.score>y.best&&(y.best=y.score,i(y.best)),!y.won&&h(y.board)?(y.won=!0,w(`2048 REACHED / TAP RESTART OR KEEP GOING`,`success`),g([35,25,55])):m(y.board)?w(`SYSTEM ONLINE / KEEP MERGING`):(y.gameOver=!0,w(`SYSTEM HALTED / NO MOVES LEFT`,`danger`),g([60,40,90])),E()}function k(e){let t=e.target;if(t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement)return;let n={ArrowUp:`up`,ArrowDown:`down`,ArrowLeft:`left`,ArrowRight:`right`,w:`up`,W:`up`,s:`down`,S:`down`,a:`left`,A:`left`,d:`right`,D:`right`}[e.key];n&&(e.preventDefault(),O(n))}function A(e){if(!y.gameOver){x=e.clientX,S=e.clientY,C=e.pointerId;try{c.setPointerCapture(e.pointerId)}catch{}}}function j(){x=null,S=null,C=null}function M(e){if(x===null||S===null){j();return}if(C!==null&&e.pointerId!==C)return;let t=e.clientX-x,n=e.clientY-S;j(),!(Math.sqrt(t*t+n*n)<22)&&O(Math.abs(t)>Math.abs(n)?t>0?`right`:`left`:n>0?`down`:`up`)}function N(){j()}return v.forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.direction;(t===`up`||t===`down`||t===`left`||t===`right`)&&O(t)})}),f.addEventListener(`click`,D),document.addEventListener(`keydown`,k),c.addEventListener(`pointerdown`,A),c.addEventListener(`pointerup`,M),c.addEventListener(`pointercancel`,N),c.addEventListener(`lostpointercapture`,N),D(),()=>{document.removeEventListener(`keydown`,k),v.forEach(e=>{}),j(),e.innerHTML=``}}export{_ as mountGame};