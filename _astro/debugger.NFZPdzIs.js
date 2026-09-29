var e=`jtj-debugger-best-time`,t=`jtj-debugger-game`;function n(e,t){let n=e.querySelector(t);if(!n)throw Error(`[DEBUGGER] Missing element: ${t}`);return n}function r(){if(document.head.querySelector(`[data-debugger-style="true"]`))return;let e=document.createElement(`style`);e.dataset.debuggerStyle=`true`,e.textContent=`
    .${t} {
      width: min(100%, 620px);
      margin: 0 auto;
      padding: 18px;
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
      gap: 14px;
      margin-bottom: 14px;
    }

    .${t}-eyebrow {
      display: flex;
      justify-content: space-between;
      gap: 10px;

      color: #63615b;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 7px;
      font-weight: 800;
      line-height: 1.4;
      letter-spacing: .11em;
    }

    .${t}-title {
      margin: 0;

      color: #eeeae1;

      font-size: clamp(44px, 13vw, 82px);
      font-weight: 950;
      line-height: .82;
      letter-spacing: -.08em;
    }

    .${t}-subtitle {
      max-width: 520px;
      margin: 0;

      color: #7f7b74;

      font-size: 12px;
      line-height: 1.65;
    }

    .${t}-panel {
      overflow: hidden;

      background: #242423;
      border: 1px solid #45443f;
    }

    .${t}-topbar {
      display: grid;
      grid-template-columns: 1fr 50px 1fr;
      gap: 8px;
      align-items: center;

      padding: 10px;

      background: #0d0d0d;
      border-bottom: 1px solid #302f2c;
    }

    .${t}-counter {
      display: grid;
      gap: 3px;
    }

    .${t}-counter:last-child {
      justify-items: end;
    }

    .${t}-counter span {
      color: #5c5a55;

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

    .${t}-counter strong {
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
      letter-spacing: -.04em;
    }

    .${t}-face {
      width: 34px;
      height: 34px;

      display: grid;
      place-items: center;

      padding: 0;

      border: 1px solid #4c4b46;
      background: #a9a69e;
      color: #131313;

      cursor: pointer;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 10px;
      font-weight: 950;

      touch-action: manipulation;
    }

    .${t}-face:active {
      transform: translateY(1px);
    }

    .${t}-board-wrap {
      padding: 10px;
      background: #2b2b29;
    }

    .${t}-board {
      width: 100%;
      max-width: 520px;
      margin: 0 auto;

      display: grid;
      grid-template-columns:
        repeat(7, minmax(0, 1fr));
      gap: 2px;

      padding: 3px;

      background: #62605a;
      border: 1px solid #77746c;

      user-select: none;
    }

    .${t}-cell {
      min-width: 0;
      aspect-ratio: 1;

      display: grid;
      place-items: center;

      padding: 0;

      border: 0;
      border-radius: 0;

      background: #363633;
      color: #d8d3c9;

      cursor: pointer;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: clamp(12px, 3.5vw, 18px);
      font-weight: 950;
      line-height: 1;

      box-shadow:
        inset 2px 2px 0 #4d4c47,
        inset -2px -2px 0 #242422;

      touch-action: manipulation;
    }

    .${t}-cell:active {
      transform: translateY(1px);
    }

    .${t}-cell:focus-visible {
      outline: 2px solid #eeeae1;
      outline-offset: -2px;
    }

    .${t}-cell.revealed {
      background: #4a4944;
      box-shadow: none;
      cursor: default;
    }

    .${t}-cell.flagged {
      color: #d07b70;
    }

    .${t}-cell.mine {
      background: #713e39;
      color: #f4ede3;
      box-shadow: none;
    }

    .${t}-cell.exploded {
      background: #a65b4f;
      color: #fffaf0;
    }

    .${t}-cell.wrong-flag {
      background: #4d302d;
      color: #d07b70;
    }

    .${t}-cell.number-1 {
      color: #c7d3df;
    }

    .${t}-cell.number-2 {
      color: #b8cfad;
    }

    .${t}-cell.number-3 {
      color: #d7aca3;
    }

    .${t}-cell.number-4 {
      color: #b9b6d4;
    }

    .${t}-cell.number-5 {
      color: #d4aaa0;
    }

    .${t}-cell.number-6 {
      color: #a9c7c0;
    }

    .${t}-cell.number-7 {
      color: #e0ddd4;
    }

    .${t}-cell.number-8 {
      color: #aaa69f;
    }

    .${t}-toolbar {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;

      padding: 10px;

      border-top: 1px solid #363531;
      background: #171716;
    }

    .${t}-control {
      min-height: 42px;

      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;

      padding: 0 10px;

      border: 1px solid #3d3c38;
      background: #1f1f1d;
      color: #aaa69e;

      cursor: pointer;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 7px;
      font-weight: 850;
      letter-spacing: .08em;

      touch-action: manipulation;
    }

    .${t}-control.active {
      background: #eeeae1;
      border-color: #eeeae1;
      color: #121212;
    }

    .${t}-control:active {
      transform: translateY(1px);
    }

    .${t}-status {
      min-height: 48px;

      display: grid;
      place-items: center;

      margin-top: 10px;
      padding: 12px;

      border: 1px solid #2b2a27;
      background: #111111;
      color: #77746d;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 7px;
      font-weight: 850;
      letter-spacing: .08em;
      text-align: center;
    }

    .${t}-status.success {
      color: #b8d1ad;
      border-color: #384334;
    }

    .${t}-status.danger {
      color: #d59a91;
      border-color: #493330;
    }

    .${t}-info {
      display: flex;
      justify-content: space-between;
      gap: 12px;

      margin-top: 10px;
      padding: 11px 0 0;

      border-top: 1px solid #2b2a27;

      color: #5f5d57;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 6px;
      font-weight: 800;
      letter-spacing: .09em;
    }

    @media (min-width: 700px) {
      .${t} {
        padding: 34px;
      }

      .${t}-board-wrap {
        padding: 16px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .${t}-cell,
      .${t}-face,
      .${t}-control {
        transition: none;
      }
    }
  `,document.head.appendChild(e)}function i(e){return String(Math.max(0,Math.min(999,e))).padStart(3,`0`)}function a(){try{let t=localStorage.getItem(e);if(!t)return null;let n=Number(t);return Number.isFinite(n)?Math.floor(Math.max(0,n)):null}catch{return null}}function o(t){try{localStorage.setItem(e,String(t))}catch{}}function s(){let e=[];for(let t=0;t<8;t+=1)for(let n=0;n<7;n+=1)e.push({row:t,col:n,mine:!1,adjacent:0,revealed:!1,flagged:!1});return e}function c(e,t){return e*7+t}function l(e,t){let n=[];for(let r=-1;r<=1;r+=1)for(let i=-1;i<=1;i+=1){if(r===0&&i===0)continue;let a=e+r,o=t+i;a<0||a>=8||o<0||o>=7||n.push(c(a,o))}return n}function u(e){let t=[...e];for(let e=t.length-1;e>0;--e){let n=Math.floor(Math.random()*(e+1)),r=t[e];t[e]=t[n],t[n]=r}return t}function d(e,t){let n=e[t];if(!n)return;let r=new Set([t,...l(n.row,n.col)]),i=u(e.map((e,t)=>t).filter(e=>!r.has(e))).slice(0,10);for(let t of i){let n=e[t];n&&(n.mine=!0)}for(let t=0;t<e.length;t+=1){let n=e[t];n&&(n.adjacent=l(n.row,n.col).filter(t=>e[t]?.mine===!0).length)}}function f(e){return e===`won`?`B)`:e===`lost`?`:(`:`:)`}function p(e){r(),e.innerHTML=`
    <div class="${t}">
      <div class="${t}-head">
        <div class="${t}-eyebrow">
          <span>GAME 02 / PUZZLE</span>
          <span>CLASSIC MODE</span>
        </div>

        <h2 class="${t}-title">
          DEBUGGER
        </h2>

        <p class="${t}-subtitle">
          Find the bugs. Do not become one.
          Reveal safe cells, mark suspicious ones,
          and try not to ship the mine.
        </p>
      </div>

      <div class="${t}-panel">
        <div class="${t}-topbar">
          <div class="${t}-counter">
            <span>MINES</span>
            <strong id="debugger-mines">
              ${i(10)}
            </strong>
          </div>

          <button
            type="button"
            class="${t}-face"
            id="debugger-face"
            aria-label="Restart game"
          >
            :)
          </button>

          <div class="${t}-counter">
            <span>TIME</span>
            <strong id="debugger-time">
              000
            </strong>
          </div>
        </div>

        <div class="${t}-board-wrap">
          <div
            class="${t}-board"
            id="debugger-board"
            role="grid"
            aria-label="Minesweeper board"
          ></div>
        </div>

        <div class="${t}-toolbar">
          <button
            type="button"
            class="${t}-control"
            id="debugger-flag"
          >
            ⚑ FLAG MODE
          </button>

          <button
            type="button"
            class="${t}-control"
            id="debugger-reset"
          >
            ↻ RESTART
          </button>
        </div>
      </div>

      <div
        class="${t}-status"
        id="debugger-status"
      >
        REVEAL A CELL TO START
      </div>

      <div class="${t}-info">
        <span id="debugger-best">
          BEST / ---
        </span>

        <span>
          RIGHT CLICK / FLAG
        </span>
      </div>
    </div>
  `;let c=n(e,`#debugger-board`),u=n(e,`#debugger-mines`),p=n(e,`#debugger-time`),m=n(e,`#debugger-face`),h=n(e,`#debugger-flag`),g=n(e,`#debugger-reset`),_=n(e,`#debugger-status`),v=n(e,`#debugger-best`),y={board:s(),state:`ready`,elapsed:0,timerStartedAt:null},b=null,x=!1;function S(){b!==null&&(window.clearInterval(b),b=null)}function C(){S(),y.timerStartedAt=Date.now(),b=window.setInterval(()=>{y.state===`playing`&&y.timerStartedAt!==null&&(y.elapsed=Math.floor((Date.now()-y.timerStartedAt)/1e3),p.textContent=i(y.elapsed))},250)}function w(){let e=y.board.filter(e=>e.flagged).length,t=Math.max(0,10-e);u.textContent=i(t),p.textContent=i(y.elapsed);let n=a();v.textContent=n===null?`BEST / ---`:`BEST / ${i(n)}`,m.textContent=f(y.state),h.classList.toggle(`active`,x)}function T(e,n=``){_.textContent=e,_.className=`${t}-status`,n&&_.classList.add(n)}function E(e){if(y.state===`won`||y.state===`lost`)return;let t=y.board[e];if(t&&!t.flagged&&(y.state===`ready`&&(d(y.board,e),y.state=`playing`,C()),!t.revealed)){if(t.mine){A(e);return}if(D(e),k()){j();return}T(`DEBUGGING IN PROGRESS / WATCH THE CELLS`),N()}}function D(e){let t=[e],n=new Set;for(;t.length>0;){let e=t.shift();if(e===void 0||n.has(e))continue;n.add(e);let r=y.board[e];if(!(!r||r.flagged||r.mine||r.revealed)&&(r.revealed=!0,r.adjacent===0))for(let e of l(r.row,r.col)){let n=y.board[e];n&&!n.revealed&&!n.flagged&&!n.mine&&t.push(e)}}}function O(e){if(y.state===`won`||y.state===`lost`)return;if(y.state===`ready`){T(`REVEAL A CELL FIRST`);return}let t=y.board[e];if(!t||t.revealed)return;let n=y.board.filter(e=>e.flagged).length;if(!t.flagged&&n>=10){T(`NO FLAGS LEFT / YOU HAVE USED THEM ALL`);return}t.flagged=!t.flagged,N()}function k(){return y.board.every(e=>e.mine||e.revealed)}function A(e){S(),y.state=`lost`;for(let e=0;e<y.board.length;e+=1){let t=y.board[e];t&&(t.mine&&(t.revealed=!0),t.flagged&&!t.mine&&(t.revealed=!0))}T(`BUILD FAILED / YOU SHIPPED THE MINE`,`danger`),N(e),M([70,40,110])}function j(){S(),y.state=`won`;for(let e=0;e<y.board.length;e+=1){let t=y.board[e];t?.mine&&(t.flagged=!0)}let e=a(),t=e===null||y.elapsed<e;t&&o(y.elapsed),T(t?`BUILD PASSED / NEW BEST TIME`:`BUILD PASSED / BUGS CONTAINED`,`success`),N(),M(45)}function M(e){if(typeof navigator.vibrate==`function`)try{navigator.vibrate(e)}catch{}}function N(e=void 0){c.innerHTML=``,y.board.forEach((n,r)=>{let i=document.createElement(`button`);i.type=`button`,i.className=`${t}-cell`,i.dataset.index=String(r),n.revealed&&i.classList.add(`revealed`),n.flagged&&i.classList.add(`flagged`),n.mine&&y.state===`lost`&&i.classList.add(`mine`),r===e&&i.classList.add(`exploded`),y.state===`lost`&&n.flagged&&!n.mine?(i.classList.remove(`flagged`),i.classList.add(`wrong-flag`),i.textContent=`?`):n.mine&&y.state===`lost`?i.textContent=`×`:n.flagged?i.textContent=`⚑`:n.revealed&&n.adjacent>0&&(i.textContent=String(n.adjacent),i.classList.add(`number-${n.adjacent}`)),i.setAttribute(`aria-label`,n.revealed?n.mine?`Mine`:n.adjacent>0?`${n.adjacent} adjacent mines`:`Empty cell`:n.flagged?`Flagged cell`:`Hidden cell`),i.addEventListener(`click`,()=>{x?O(r):E(r)}),i.addEventListener(`contextmenu`,e=>{e.preventDefault(),O(r)}),c.appendChild(i)}),w()}function P(){S(),y={board:s(),state:`ready`,elapsed:0,timerStartedAt:null},x=!1,T(`REVEAL A CELL TO START`),N()}return h.addEventListener(`click`,()=>{y.state!==`won`&&y.state!==`lost`&&(x=!x,T(x?`FLAG MODE / TAP CELLS TO MARK THEM`:`REVEAL MODE / TAP CELLS TO REVEAL`),N())}),g.addEventListener(`click`,P),m.addEventListener(`click`,P),P(),()=>{S(),e.innerHTML=``}}export{p as mountGame};