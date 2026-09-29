var e=`jtj-stack-trace`,t=`jtj-stack-trace-best`,n=[`01`,`02`,`03`,`04`,`05`,`06`,`07`,`08`,`09`],r=[`0x01`,`0x02`,`0x03`,`0x04`,`0x05`,`0x06`,`0x07`,`0x08`,`0x09`];function i(e,t){let n=e.querySelector(t);if(!n)throw Error(`[STACK TRACE] Missing element: ${t}`);return n}function a(){try{let e=localStorage.getItem(t);if(!e)return 0;let n=Number(e);return Number.isFinite(n)?Math.max(0,Math.floor(n)):0}catch{return 0}}function o(e){try{localStorage.setItem(t,String(Math.max(0,Math.floor(e))))}catch{}}function s(e){return String(Math.max(0,Math.floor(e))).padStart(5,`0`)}function c(){if(document.head.querySelector(`[data-stack-trace-style="true"]`))return;let t=document.createElement(`style`);t.dataset.stackTraceStyle=`true`,t.textContent=`
    .${e} {
      width: min(100%, 700px);
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

    .${e} * {
      box-sizing: border-box;
    }

    .${e} button {
      font: inherit;
      -webkit-tap-highlight-color: transparent;
    }

    .${e}-head {
      display: grid;
      gap: 12px;
      margin-bottom: 15px;
    }

    .${e}-eyebrow {
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

    .${e}-title {
      margin: 0;

      color: #eeeae1;

      font-size: clamp(
        45px,
        13vw,
        92px
      );

      font-weight: 950;

      line-height: .82;

      letter-spacing: -.085em;
    }

    .${e}-description {
      max-width: 590px;

      margin: 0;

      color: #7d7972;

      font-size: 12px;

      line-height: 1.7;
    }

    .${e}-panel {
      overflow: hidden;

      background: #161616;

      border: 1px solid #333230;
    }

    .${e}-topbar {
      display: grid;

      grid-template-columns:
        repeat(4, 1fr);

      background: #0d0d0d;

      border-bottom:
        1px solid #292927;
    }

    .${e}-stat {
      min-height: 66px;

      display: flex;

      flex-direction: column;

      justify-content: center;

      gap: 4px;

      padding: 9px 11px;

      border-right:
        1px solid #272623;
    }

    .${e}-stat:last-child {
      border-right: 0;
    }

    .${e}-stat span {
      color: #56534d;

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

    .${e}-stat strong {
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

    .${e}-terminal {
      padding: 14px;

      background: #0b0b0b;

      border-bottom:
        1px solid #282826;
    }

    .${e}-terminal-bar {
      display: flex;

      align-items: center;

      justify-content: space-between;

      gap: 12px;

      margin-bottom: 14px;
    }

    .${e}-terminal-left {
      display: flex;

      align-items: center;

      gap: 6px;
    }

    .${e}-terminal-dot {
      width: 7px;
      height: 7px;

      border-radius: 50%;

      background: #44433f;
    }

    .${e}-terminal-path {
      color: #44423d;

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

    .${e}-terminal-state {
      color: #77736c;

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

    .${e}-trace-box {
      min-height: 75px;

      display: flex;

      flex-direction: column;

      justify-content: center;

      gap: 8px;

      padding: 14px;

      background: #121212;

      border: 1px solid #292927;
    }

    .${e}-trace-label {
      color: #4e4c47;

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

    .${e}-trace {
      min-height: 25px;

      display: flex;

      align-items: center;

      justify-content: center;

      flex-wrap: wrap;

      gap: 6px;
    }

    .${e}-trace-item {
      min-width: 32px;

      padding: 6px 7px;

      background: #242422;

      border: 1px solid #3a3935;

      color: #aaa69e;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 8px;

      font-weight: 900;

      text-align: center;
    }

    .${e}-trace-item.done {
      background: #394235;

      border-color: #505c4a;

      color: #c2d0b9;
    }

    .${e}-trace-item.current {
      background: #eeeae1;

      border-color: #eeeae1;

      color: #111111;
    }

    .${e}-trace-item.error {
      background: #5a3833;

      border-color: #764940;

      color: #f1d9d4;
    }

    .${e}-instruction {
      margin-top: 11px;

      color: #6b6760;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 6px;

      font-weight: 800;

      line-height: 1.5;

      letter-spacing: .09em;

      text-align: center;
    }

    .${e}-nodes {
      padding: 13px;

      background: #1a1a19;
    }

    .${e}-node-grid {
      display: grid;

      grid-template-columns:
        repeat(3, 1fr);

      gap: 8px;

      max-width: 470px;

      margin: 0 auto;
    }

    .${e}-node {
      min-height: 76px;

      position: relative;

      display: flex;

      flex-direction: column;

      align-items: center;

      justify-content: center;

      gap: 5px;

      padding: 8px;

      border:
        1px solid #35342f;

      background: #222220;

      color: #aaa69e;

      cursor: pointer;

      touch-action: manipulation;

      user-select: none;

      -webkit-user-select: none;

      transition:
        transform 80ms ease,
        background-color 80ms ease,
        border-color 80ms ease,
        color 80ms ease;
    }

    .${e}-node-number {
      color: #eeeae1;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 18px;

      font-weight: 950;

      line-height: 1;
    }

    .${e}-node-hex {
      color: #54514b;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 6px;

      font-weight: 800;

      letter-spacing: .05em;
    }

    .${e}-node:active {
      transform: scale(.96);
    }

    .${e}-node.showing {
      background: #eeeae1;

      border-color: #eeeae1;

      color: #111111;

      transform: scale(.96);
    }

    .${e}-node.showing
      .${e}-node-number {
      color: #111111;
    }

    .${e}-node.showing
      .${e}-node-hex {
      color: #66625b;
    }

    .${e}-node.correct {
      background: #354134;

      border-color: #57654f;

      color: #c4d2bc;
    }

    .${e}-node.correct
      .${e}-node-number {
      color: #d5e0ce;
    }

    .${e}-node.error {
      background: #583833;

      border-color: #794b43;

      color: #f0d6d1;
    }

    .${e}-node.disabled {
      cursor: default;

      opacity: .58;
    }

    .${e}-bottom {
      display: grid;

      gap: 8px;

      padding: 12px;

      background: #111111;

      border-top:
        1px solid #292927;
    }

    .${e}-action {
      min-height: 56px;

      display: flex;

      align-items: center;

      justify-content: center;

      gap: 9px;

      padding: 0 18px;

      border:
        1px solid #eeeae1;

      background: #eeeae1;

      color: #111111;

      cursor: pointer;

      font-size: 9px;

      font-weight: 950;

      letter-spacing: .08em;

      touch-action: manipulation;
    }

    .${e}-action:active {
      transform: translateY(1px);
    }

    .${e}-status {
      min-height: 48px;

      display: grid;

      place-items: center;

      margin-top: 10px;

      padding: 12px;

      background: #111111;

      border:
        1px solid #2c2b28;

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

    .${e}-status.success {
      color: #bfd2b5;

      border-color: #3a4535;
    }

    .${e}-status.danger {
      color: #d89a91;

      border-color: #4a322f;
    }

    .${e}-footer {
      display: flex;

      align-items: center;

      justify-content: space-between;

      gap: 12px;

      margin-top: 10px;

      padding-top: 10px;

      border-top:
        1px solid #2a2926;

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
      .${e}-topbar {
        grid-template-columns:
          repeat(2, 1fr);
      }

      .${e}-stat:nth-child(2) {
        border-right: 0;
      }

      .${e}-stat:nth-child(-n + 2) {
        border-bottom:
          1px solid #272623;
      }

      .${e}-node {
        min-height: 82px;
      }
    }

    @media (min-width: 700px) {
      .${e} {
        padding: 30px;
      }

      .${e}-node {
        min-height: 88px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .${e}-node,
      .${e}-action {
        transition: none;
      }
    }
  `,document.head.appendChild(t)}function l(t){c(),t.innerHTML=`
    <div class="${e}">
      <div class="${e}-head">
        <div class="${e}-eyebrow">
          <span>GAME 07 / MEMORY</span>
          <span>TRACE THE FAILURE</span>
        </div>

        <h2 class="${e}-title">
          STACK TRACE
        </h2>

        <p class="${e}-description">
          The system crashed. Obviously.
          Memorize the node sequence, then
          trace it back in the correct order.
        </p>
      </div>

      <div class="${e}-panel">
        <div class="${e}-topbar">
          <div class="${e}-stat">
            <span>SCORE</span>
            <strong id="stack-score">
              00000
            </strong>
          </div>

          <div class="${e}-stat">
            <span>BEST</span>
            <strong id="stack-best">
              00000
            </strong>
          </div>

          <div class="${e}-stat">
            <span>ROUND</span>
            <strong id="stack-round">
              001
            </strong>
          </div>

          <div class="${e}-stat">
            <span>LIVES</span>
            <strong id="stack-lives">
              ♥♥♥
            </strong>
          </div>
        </div>

        <div class="${e}-terminal">
          <div class="${e}-terminal-bar">
            <div
              class="${e}-terminal-left"
            >
              <span
                class="${e}-terminal-dot"
              ></span>

              <span
                class="${e}-terminal-dot"
              ></span>

              <span
                class="${e}-terminal-dot"
              ></span>

              <span
                class="${e}-terminal-path"
              >
                /var/log/jtj/app
              </span>
            </div>

            <span
              id="stack-terminal-state"
              class="${e}-terminal-state"
            >
              READY
            </span>
          </div>

          <div class="${e}-trace-box">
            <span
              class="${e}-trace-label"
            >
              EXECUTION TRACE
            </span>

            <div
              id="stack-trace"
              class="${e}-trace"
            ></div>
          </div>

          <div
            id="stack-instruction"
            class="${e}-instruction"
          >
            MEMORIZE THE TRACE
          </div>
        </div>

        <div class="${e}-nodes">
          <div
            id="stack-node-grid"
            class="${e}-node-grid"
          ></div>
        </div>

        <div class="${e}-bottom">
          <button
            id="stack-action"
            type="button"
            class="${e}-action"
          >
            START TRACE
            <span>↗</span>
          </button>
        </div>
      </div>

      <div
        id="stack-status"
        class="${e}-status"
      >
        MEMORIZE THE TRACE AND REPLAY IT
      </div>

      <div class="${e}-footer">
        <span>
          07 / TRACE THE BUG
        </span>

        <span>
          1–9 / KEYBOARD NODES
        </span>
      </div>
    </div>
  `;let l=i(t,`#stack-score`),u=i(t,`#stack-best`),d=i(t,`#stack-round`),f=i(t,`#stack-lives`),p=i(t,`#stack-status`),m=i(t,`#stack-terminal-state`),h=i(t,`#stack-instruction`),g=i(t,`#stack-trace`),_=i(t,`#stack-node-grid`),v=i(t,`#stack-action`),y=[],b=`ready`,x=0,S=a(),C=1,w=3,T=0,E=[],D=0,O=!0,k=[],A=null;function j(){for(let e of k)window.clearTimeout(e);k=[]}function M(e){return new Promise(t=>{let n=window.setTimeout(()=>{k=k.filter(e=>e!==n),t()},e);k.push(n)})}function N(){l.textContent=s(x),u.textContent=s(S),d.textContent=String(C).padStart(3,`0`),f.textContent=`♥`.repeat(Math.max(0,w))+`♡`.repeat(Math.max(0,3-w))}function P(t,n=``){p.textContent=t,p.className=`${e}-status`,n&&p.classList.add(n)}function F(){_.innerHTML=``,y.length=0;for(let t=0;t<9;t+=1){let i=document.createElement(`button`);i.type=`button`,i.className=`${e}-node`,i.dataset.node=String(t),i.setAttribute(`aria-label`,`Trace node ${t+1}`),i.innerHTML=`
        <span
          class="${e}-node-number"
        >
          ${n[t]??``}
        </span>

        <span
          class="${e}-node-hex"
        >
          ${r[t]??``}
        </span>
      `,i.addEventListener(`click`,()=>{X(t)}),_.appendChild(i),y.push(i)}}function I(e){let t=[];for(;t.length<e;){let e=Math.floor(Math.random()*9);e!==t[t.length-1]&&t.push(e)}return t}function L(){return Math.max(250,520-(C-1)*24)}function R(){return Math.max(70,125-(C-1)*5)}function z(){return Math.min(14,3+Math.floor((C-1)/2))}function B(){for(let e of y)e.classList.remove(`showing`,`correct`,`error`,`disabled`)}function V(e){for(let t of y)t.disabled=e,t.classList.toggle(`disabled`,e)}function H(){if(g.innerHTML=``,E.length!==0)for(let t=0;t<E.length;t+=1){let r=E[t];if(r===void 0)continue;let i=document.createElement(`span`);i.className=`${e}-trace-item`,i.textContent=n[r]??`--`,b===`input`&&(t<D&&i.classList.add(`done`),t===D&&i.classList.add(`current`)),g.appendChild(i)}}function U(e){h.textContent=e}function W(){if(!A)try{A=new AudioContext}catch{A=null}}function G(e,t=.06){if(W(),!A)return;let n=A.createOscillator(),r=A.createGain();n.type=`square`,n.frequency.setValueAtTime(e,A.currentTime),r.gain.setValueAtTime(.025,A.currentTime),r.gain.exponentialRampToValueAtTime(1e-4,A.currentTime+t),n.connect(r),r.connect(A.destination),n.start(),n.stop(A.currentTime+t)}function K(e){let t=[220,247,277,294,330,370,415,440,494];G(t[e%t.length]??330,.08)}function q(e){if(typeof navigator.vibrate==`function`)try{navigator.vibrate(e)}catch{}}async function J(){j(),b=`memorizing`,x=0,C=1,w=3,T=0,E=[],D=0,O=!0,v.disabled=!0,v.textContent=`TRACE RUNNING`,N(),await Y()}async function Y(){j(),b=`memorizing`,D=0,O=!0,E=I(z()),B(),V(!0),H(),m.textContent=`MEMORY`,U(`MEMORIZE THE TRACE`),P(`ROUND ${String(C).padStart(2,`0`)} / MEMORIZE`),await M(420);for(let e=0;e<E.length;e+=1){if(b!==`memorizing`)return;let t=E[e];if(t===void 0)continue;let n=y[t];n&&(B(),n.classList.add(`showing`),K(e),await M(L()),n.classList.remove(`showing`),await M(R()))}b===`memorizing`&&(b=`input`,D=0,B(),V(!1),H(),m.textContent=`TRACE`,U(`REPLAY ${E.length} NODES`),P(`TRACE THE SEQUENCE`))}async function X(e){if(b!==`input`)return;let t=E[D];if(t===void 0)return;let n=y[e];if(!n)return;if(e===t){if(n.classList.add(`correct`),G(430+D*20,.055),q(14),D+=1,H(),D>=E.length){await Q();return}return}n.classList.add(`error`),O=!1,T=0,G(110,.11),q([25,25]),--w,N();let r=Array.from(g.children)[D];if(r instanceof HTMLElement&&r.classList.add(`error`),w<=0){ee();return}b=`memorizing`,V(!0),m.textContent=`ERROR`,U(`TRACE MISMATCH / RELOAD ROUND`),P(`WRONG NODE / ${w} ${w===1?`LIFE`:`LIVES`} LEFT`,`danger`),await M(650),!(w<=0)&&await Z()}async function Z(){b=`memorizing`,D=0,B(),H(),m.textContent=`RELOAD`,U(`RELOADING TRACE`),await M(350);for(let e=0;e<E.length;e+=1){if(b!==`memorizing`)return;let t=E[e];if(t===void 0)continue;let n=y[t];n&&(B(),n.classList.add(`showing`),K(e),await M(Math.max(250,L()+40)),n.classList.remove(`showing`),await M(Math.max(70,R())))}b=`input`,D=0,B(),V(!1),H(),m.textContent=`TRACE`,U(`REPLAY ${E.length} NODES`),P(`TRY THE TRACE AGAIN`)}async function Q(){if(b!==`input`)return;let e=C*100,t=T*35,n=O?C*40:0,r=e+t+n;x+=r,T+=1,x>S&&(S=x,o(S)),G(660,.1),G(880,.14),q([18,20,35]),V(!0),b=`memorizing`,m.textContent=`PASS`,U(O?`PERFECT TRACE`:`TRACE COMPLETE`),P(O?`PERFECT / +${r} / COMBO x${T}`:`ROUND CLEAR / +${r} / COMBO x${T}`,`success`),N(),await M(850),C+=1,await Y()}function ee(){j(),b=`gameover`,V(!0),m.textContent=`CRASH`,U(`STACK OVERFLOW`);let e=x>=S&&x>0;e&&(S=x,o(S)),P(e?`NEW BEST / ${s(x)}`:`TRACE FAILED / SCORE ${s(x)}`,`danger`),v.disabled=!1,v.textContent=`RESTART TRACE ↗`,N(),q([60,35,100])}function $(e){let t=e.target;if(t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement||t instanceof HTMLSelectElement)return;if(e.key===` `||e.key===`Enter`){(b===`ready`||b===`gameover`)&&(e.preventDefault(),J());return}let n=Number(e.key);n>=1&&n<=9&&(e.preventDefault(),X(n-1)),e.key===`Escape`&&(j(),b=`ready`,V(!0),v.disabled=!1,v.textContent=`START TRACE`,m.textContent=`READY`,U(`MEMORIZE THE TRACE`),P(`TRACE ABORTED`))}return v.addEventListener(`click`,()=>{(b===`ready`||b===`gameover`)&&J()}),F(),V(!0),N(),P(`MEMORIZE THE TRACE AND REPLAY IT`),document.addEventListener(`keydown`,$),()=>{j(),document.removeEventListener(`keydown`,$),A&&=(A.close(),null),t.innerHTML=``}}export{l as mountGame};