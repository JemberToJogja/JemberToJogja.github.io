var e=`jtj-commit-type`,t=`jtj-commit-type-best-wpm`,n=[`fix: somehow works`,`feat: add another questionable feature`,`refactor: remove code that was definitely needed`,`chore: convince the build to cooperate`,`fix: stop touching production`];function r(e,t){let n=e.querySelector(t);if(!n)throw Error(`[COMMIT TYPE] Missing element: ${t}`);return n}function i(e){let t=Math.max(0,Math.floor(e/1e3)),n=Math.floor(t/60),r=t%60;return`${String(n).padStart(2,`0`)}:${String(r).padStart(2,`0`)}`}function a(e){return String(Math.max(0,Math.round(e))).padStart(3,`0`)}function o(){try{let e=localStorage.getItem(t);if(!e)return null;let n=Number(e);return Number.isFinite(n)?Math.max(0,Math.round(n)):null}catch{return null}}function s(e){try{localStorage.setItem(t,String(Math.max(0,Math.round(e))))}catch{}}function c(){if(document.head.querySelector(`[data-commit-type-style="true"]`))return;let t=document.createElement(`style`);t.dataset.commitTypeStyle=`true`,t.textContent=`
    .${e} {
      width: min(100%, 760px);
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

    .${e} * {
      box-sizing: border-box;
    }

    .${e} button,
    .${e} input,
    .${e} textarea {
      font: inherit;
      -webkit-tap-highlight-color: transparent;
    }

    .${e}-head {
      display: grid;
      gap: 13px;
      margin-bottom: 16px;
    }

    .${e}-eyebrow {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;

      color: #605e58;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 7px;
      font-weight: 800;
      letter-spacing: .1em;
      line-height: 1.4;
    }

    .${e}-title {
      margin: 0;

      color: #eeeae1;

      font-size: clamp(46px, 13vw, 92px);
      font-weight: 950;
      line-height: .82;
      letter-spacing: -.085em;
    }

    .${e}-description {
      max-width: 580px;
      margin: 0;

      color: #7d7972;

      font-size: 12px;
      line-height: 1.7;
    }

    .${e}-panel {
      overflow: hidden;

      background: #151515;
      border: 1px solid #30302e;
    }

    .${e}-panel-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;

      min-height: 44px;
      padding: 0 12px;

      background: #0e0e0e;
      border-bottom: 1px solid #292927;

      color: #62605a;

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

    .${e}-terminal {
      padding: 18px;
      background: #0b0b0b;
    }

    .${e}-terminal-top {
      display: flex;
      align-items: center;
      justify-content: space-between;

      margin-bottom: 18px;
    }

    .${e}-dots {
      display: flex;
      gap: 5px;
    }

    .${e}-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #3e3d39;
    }

    .${e}-terminal-path {
      color: #45433f;

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

    .${e}-prompt {
      display: grid;
      gap: 10px;

      padding: 14px;

      border: 1px solid #292927;
      background: #111111;
    }

    .${e}-prompt-label {
      color: #4f4d48;

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

    .${e}-target {
      min-height: 76px;

      color: #eeeae1;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: clamp(
        16px,
        4.5vw,
        24px
      );

      font-weight: 750;
      line-height: 1.65;

      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }

    .${e}-char {
      position: relative;
    }

    .${e}-char.correct {
      color: #a9c09e;
    }

    .${e}-char.incorrect {
      color: #d69288;
      text-decoration: underline;
      text-decoration-color: #d69288;
      text-decoration-thickness: 2px;
      text-underline-offset: 3px;
    }

    .${e}-char.current {
      color: #111111;
      background: #eeeae1;
    }

    .${e}-char.pending {
      color: #605d57;
    }

    .${e}-input-wrap {
      display: grid;
      gap: 8px;
      margin-top: 14px;
    }

    .${e}-input-label {
      color: #4d4b46;

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

    .${e}-input {
      width: 100%;
      min-height: 108px;

      resize: vertical;

      padding: 13px;

      border: 1px solid #34332f;
      outline: none;

      background: #151515;
      color: #eeeae1;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 14px;
      line-height: 1.6;

      caret-color: #eeeae1;

      appearance: none;
      -webkit-appearance: none;

      border-radius: 0;

      touch-action: manipulation;
    }

    .${e}-input::placeholder {
      color: #4a4843;
    }

    .${e}-input:focus {
      border-color: #67645e;
    }

    .${e}-stats {
      display: grid;
      grid-template-columns:
        repeat(2, minmax(0, 1fr));

      border-top: 1px solid #292927;
    }

    .${e}-stat {
      min-height: 70px;

      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 5px;

      padding: 10px 12px;

      border-right: 1px solid #292927;
      border-bottom: 1px solid #292927;
    }

    .${e}-stat:nth-child(2n) {
      border-right: 0;
    }

    .${e}-stat:nth-child(n + 3) {
      border-bottom: 0;
    }

    .${e}-stat span {
      color: #55534e;

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

    .${e}-stat strong {
      color: #eeeae1;

      font-family:
        "SFMono-Regular",
        "Cascadia Code",
        "Roboto Mono",
        Consolas,
        monospace;

      font-size: 22px;
      font-weight: 900;
      line-height: 1;
      letter-spacing: -.04em;
    }

    .${e}-bottom {
      display: grid;
      gap: 9px;
      padding: 12px;

      background: #111111;
      border-top: 1px solid #292927;
    }

    .${e}-button {
      min-height: 45px;

      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;

      padding: 0 14px;

      border: 1px solid #eeeae1;
      background: #eeeae1;
      color: #111111;

      cursor: pointer;

      font-size: 8px;
      font-weight: 900;
      letter-spacing: .08em;

      touch-action: manipulation;
    }

    .${e}-button.secondary {
      border-color: #3c3b37;
      background: #1b1b1a;
      color: #aaa69e;
    }

    .${e}-button:active {
      transform: translateY(1px);
    }

    .${e}-status {
      min-height: 48px;

      display: grid;
      place-items: center;

      margin-top: 10px;
      padding: 12px;

      border: 1px solid #2b2a27;
      background: #111111;
      color: #6d6962;

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
      color: #b9d0ae;
      border-color: #384333;
    }

    .${e}-status.danger {
      color: #d59a91;
      border-color: #493330;
    }

    .${e}-footer {
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
      .${e} {
        padding: 34px;
      }

      .${e}-stats {
        grid-template-columns:
          repeat(4, minmax(0, 1fr));
      }

      .${e}-stat {
        border-right: 1px solid #292927;
        border-bottom: 0;
      }

      .${e}-stat:nth-child(2n) {
        border-right: 1px solid #292927;
      }

      .${e}-stat:last-child {
        border-right: 0;
      }

      .${e}-bottom {
        grid-template-columns:
          1fr 160px;
        align-items: center;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .${e}-button {
        transition: none;
      }
    }
  `,document.head.appendChild(t)}function l(t){c(),t.innerHTML=`
    <div class="${e}">
      <div class="${e}-head">
        <div class="${e}-eyebrow">
          <span>GAME 03 / SKILL</span>
          <span>NO AI GENERATED EXCUSES</span>
        </div>

        <h2 class="${e}-title">
          COMMIT TYPE
        </h2>

        <p class="${e}-description">
          Type the commit message before the build
          gives up on you. Speed matters.
          Accuracy also matters. Unfortunately,
          both matter.
        </p>
      </div>

      <div class="${e}-panel">
        <div class="${e}-panel-top">
          <span id="commit-round-label">
            ROUND 01 / 05
          </span>

          <span id="commit-progress-label">
            READY
          </span>
        </div>

        <div class="${e}-terminal">
          <div class="${e}-terminal-top">
            <div class="${e}-dots">
              <span class="${e}-dot"></span>
              <span class="${e}-dot"></span>
              <span class="${e}-dot"></span>
            </div>

            <span class="${e}-terminal-path">
              git://questionable-branch
            </span>
          </div>

          <div class="${e}-prompt">
            <span class="${e}-prompt-label">
              TARGET COMMIT MESSAGE
            </span>

            <div
              class="${e}-target"
              id="commit-target"
              aria-live="polite"
            ></div>

            <div class="${e}-input-wrap">
              <label
                class="${e}-input-label"
                for="commit-input"
              >
                TYPE HERE
              </label>

              <textarea
                id="commit-input"
                class="${e}-input"
                rows="3"
                spellcheck="false"
                autocomplete="off"
                autocapitalize="none"
                autocorrect="off"
                placeholder="Start typing..."
                disabled
              ></textarea>
            </div>
          </div>
        </div>

        <div class="${e}-stats">
          <div class="${e}-stat">
            <span>WPM</span>
            <strong id="commit-wpm">
              000
            </strong>
          </div>

          <div class="${e}-stat">
            <span>ACCURACY</span>
            <strong id="commit-accuracy">
              100%
            </strong>
          </div>

          <div class="${e}-stat">
            <span>TIME</span>
            <strong id="commit-time">
              00:00
            </strong>
          </div>

          <div class="${e}-stat">
            <span>STREAK</span>
            <strong id="commit-streak">
              000
            </strong>
          </div>
        </div>

        <div class="${e}-bottom">
          <button
            id="commit-action"
            class="${e}-button"
            type="button"
          >
            START CHALLENGE
            <span>↗</span>
          </button>

          <button
            id="commit-reset"
            class="${e}-button secondary"
            type="button"
          >
            ↻ RESET
          </button>
        </div>
      </div>

      <div
        id="commit-status"
        class="${e}-status"
      >
        START THE CHALLENGE AND TYPE THE MESSAGE
      </div>

      <div class="${e}-footer">
        <span id="commit-best">
          BEST / --- WPM
        </span>

        <span>
          5 ROUNDS / ONE FINAL SCORE
        </span>
      </div>
    </div>
  `;let l=r(t,`#commit-target`),u=r(t,`#commit-input`),d=r(t,`#commit-wpm`),f=r(t,`#commit-accuracy`),p=r(t,`#commit-time`),m=r(t,`#commit-streak`),h=r(t,`#commit-round-label`),g=r(t,`#commit-progress-label`),_=r(t,`#commit-status`),v=r(t,`#commit-action`),y=r(t,`#commit-reset`),b=r(t,`#commit-best`),x=`ready`,S=0,C=n[0]??``,w=null,T=0,E=null,D=0,O=0,k=0,A=0,j=[];function M(){let e=o();b.textContent=e===null?`BEST / --- WPM`:`BEST / ${a(e)} WPM`}function N(){E!==null&&(window.clearInterval(E),E=null)}function P(){N(),E=window.setInterval(()=>{x===`playing`&&w!==null&&(T=Date.now()-w,p.textContent=i(T),L())},250)}function F(){return D<=0?100:Math.max(0,Math.min(100,O/D*100))}function I(){if(w===null)return 0;let e=(T>0?T:Date.now()-w)/6e4;return e<=0?0:O/5/e}function L(){d.textContent=a(I()),f.textContent=`${Math.round(F())}%`,m.textContent=a(k)}function R(t,n=``){_.textContent=t,_.className=`${e}-status`,n&&_.classList.add(n)}function z(t){l.innerHTML=``;for(let n=0;n<C.length;n+=1){let r=C[n]??``,i=document.createElement(`span`);i.className=`${e}-char`,i.textContent=r===` `?`\xA0`:r;let a=t[n];a===void 0?i.classList.add(`pending`):a===r?i.classList.add(`correct`):i.classList.add(`incorrect`),n===t.length&&i.classList.add(`current`),l.appendChild(i)}}function B(){h.textContent=`ROUND ${String(S+1).padStart(2,`0`)} / ${String(n.length).padStart(2,`0`)}`,g.textContent=x===`ready`?`READY`:`${Math.min(u.value.length,C.length)} / ${C.length}`}function V(e){S=Math.max(0,Math.min(n.length-1,e)),C=n[S]??``,u.value=``,z(``),B()}function H(){D=0,O=0,k=0,A=0,T=0,w=null,j=[],d.textContent=`000`,f.textContent=`100%`,p.textContent=`00:00`,m.textContent=`000`}function U(){N(),x=`ready`,H(),V(0),u.disabled=!0,v.disabled=!1,v.textContent=``;let e=document.createElement(`span`);e.textContent=`START CHALLENGE`,v.appendChild(e);let t=document.createElement(`span`);t.textContent=`↗`,v.appendChild(t),R(`START THE CHALLENGE AND TYPE THE MESSAGE`),M(),B()}function W(){N(),x=`playing`,H(),V(0),u.disabled=!1,u.value=``,w=Date.now(),P(),R(`TYPE THE MESSAGE / NO BACKSPACE SHAME`),v.disabled=!0,v.textContent=`CHALLENGE RUNNING`,u.focus(),B(),z(``)}function G(){let e=w===null?0:Date.now()-w,t=u.value,r=0,i=Math.min(t.length,C.length);for(let e=0;e<i;e+=1)t[e]===C[e]&&(r+=1);let a=Math.max(t.length,C.length),o=a===0?100:r/a*100,s=Math.max(e/6e4,1/6e4),c=r/5/s;if(j.push({text:C,accuracy:o,elapsed:e,wpm:c}),k+=1,A=Math.max(A,k),J(30),S<n.length-1){S+=1,C=n[S]??``,u.value=``,z(``),B(),R(`ROUND CLEARED / STREAK ${k}`,`success`),u.focus();return}K()}function K(){N(),x=`finished`,u.disabled=!0,T=w===null?0:Date.now()-w;let e=I(),t=F(),n=o(),r=n===null||e>n;r&&s(e),d.textContent=a(e),f.textContent=`${Math.round(t)}%`,p.textContent=i(T),m.textContent=a(A),g.textContent=`COMPLETE`,h.textContent=`BUILD / PASSED`,v.disabled=!1,v.textContent=`PLAY AGAIN ↗`,R(r?`BUILD PASSED / NEW BEST / ${a(e)} WPM`:`BUILD PASSED / ${a(e)} WPM / ${Math.round(t)}% ACCURACY`,`success`),M(),J([35,30,55])}function q(){if(x!==`playing`)return;let e=u.value;D=0,O=0;for(let t=0;t<e.length;t+=1)D+=1,e[t]===C[t]&&(O+=1,k=Math.max(k,1));if(k=Math.max(0,k),e.length>0){let t=e.length-1;e[t]!==C[t]&&(k=0,J(20))}if(e.length===C.length&&e===C){G();return}z(e),B(),L(),e.length>C.length?R(`TOO MUCH COMMIT / DELETE THE EXTRA CHARACTERS`,`danger`):e.length>0&&R(`KEEP GOING / THE BUILD IS WATCHING`)}function J(e){if(typeof navigator.vibrate==`function`)try{navigator.vibrate(e)}catch{}}return v.addEventListener(`click`,()=>{if(x===`finished`){W();return}x===`ready`&&W()}),y.addEventListener(`click`,U),u.addEventListener(`input`,q),U(),()=>{N(),t.innerHTML=``}}export{l as mountGame};