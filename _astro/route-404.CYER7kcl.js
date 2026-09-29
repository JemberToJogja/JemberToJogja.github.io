var e=`jembertojogja-route-404-best`,t=[{time:18,speed:.00155,lossMultiplier:1,title:`NORMAL DAY`,subtitle:`THE NETWORK LOOKS FINE. PROBABLY.`},{time:17,speed:.0017,lossMultiplier:1.15,title:`NETWORK CONGESTION`,subtitle:`EVERYONE DECIDED TO STREAM SOMETHING.`},{time:16,speed:.00185,lossMultiplier:1.3,title:`MIDNIGHT DEPLOY`,subtitle:`SOMEONE DEPLOYED TO PRODUCTION.`},{time:15,speed:.002,lossMultiplier:1.5,title:`NODE DISASTER`,subtitle:`MALANG IS HAVING A BAD DAY.`},{time:14,speed:.0022,lossMultiplier:1.7,title:`PRODUCTION`,subtitle:`NOTHING IS SUPPOSED TO BE THIS STABLE.`},{time:13,speed:.0024,lossMultiplier:2,title:`NO INTERNET`,subtitle:`GOOD LUCK.`}],n=[{id:`jember`,name:`JEMBER`,point:{x:.1,y:.77},type:`normal`,latency:38},{id:`lumajang`,name:`LUMAJANG`,point:{x:.3,y:.61},type:`normal`,latency:54},{id:`probolinggo`,name:`PROBOLINGGO`,point:{x:.42,y:.29},type:`slow`,latency:96},{id:`malang`,name:`MALANG`,point:{x:.5,y:.74},type:`danger`,latency:126},{id:`kediri`,name:`KEDIRI`,point:{x:.66,y:.48},type:`normal`,latency:88},{id:`madiun`,name:`MADIUN`,point:{x:.78,y:.28},type:`slow`,latency:118},{id:`jogja`,name:`JOGJA`,point:{x:.91,y:.68},type:`destination`,latency:42}],r=[{from:`jember`,to:`lumajang`,latency:82,risk:.04},{from:`jember`,to:`malang`,latency:126,risk:.11},{from:`lumajang`,to:`probolinggo`,latency:78,risk:.07},{from:`lumajang`,to:`malang`,latency:68,risk:.06},{from:`probolinggo`,to:`kediri`,latency:124,risk:.15},{from:`malang`,to:`kediri`,latency:92,risk:.12},{from:`malang`,to:`madiun`,latency:154,risk:.17},{from:`kediri`,to:`madiun`,latency:72,risk:.09},{from:`kediri`,to:`jogja`,latency:106,risk:.1},{from:`madiun`,to:`jogja`,latency:94,risk:.08}];function i(e,t){return Math.random()*(t-e)+e}function a(e,t,n){return Math.max(t,Math.min(n,e))}function o(){if(typeof window>`u`)return 0;try{return Number(window.localStorage.getItem(e)||0)}catch{return 0}}function s(t){if(typeof window<`u`)try{window.localStorage.setItem(e,String(t))}catch{}}function c(){return`
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
  `}function l(e){e.innerHTML=`
    <section class="route404" data-route404>
      <style>${c()}</style>

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
  `;let l=e.querySelector(`.route404__canvas`),u=l?.getContext(`2d`);if(!l||!u)return()=>{};e.querySelector(`.route404__shell`);let d=e.querySelector(`[data-start]`),f=e.querySelector(`[data-reset]`),p=e.querySelector(`[data-next]`),m=e.querySelector(`[data-time]`),ee=e.querySelector(`[data-latency]`),h=e.querySelector(`[data-loss]`),te=e.querySelector(`[data-reroutes]`),ne=e.querySelector(`[data-score]`),g=e.querySelector(`[data-status-text]`),re=e.querySelector(`[data-log]`),_=e.querySelector(`[data-message]`),ie=e.querySelector(`[data-message-code]`),ae=e.querySelector(`[data-message-title]`),oe=e.querySelector(`[data-message-copy]`),v=e.querySelector(`[data-score-panel]`),se=e.querySelector(`[data-result-kicker]`),ce=e.querySelector(`[data-result-score]`),le=e.querySelector(`[data-result-time]`),ue=e.querySelector(`[data-result-latency]`),de=e.querySelector(`[data-result-loss]`),fe=e.querySelector(`[data-result-reroutes]`),pe=e.querySelector(`[data-result-grade]`),y=e.querySelector(`[data-result-hint]`),b=0,x=performance.now(),S=!1,C=null,w={level:1,score:0,bestScore:o(),timeLeft:t[0].time,totalTime:t[0].time,packetLoss:0,reroutes:0,delivered:!1,gameOver:!1,started:!1,paused:!1,route:[],routeIndex:0,packet:null,nodes:[],edges:[],currentNode:`jember`,targetNode:`jogja`,message:``,messageTimer:0,glitchTimer:0,eventTimer:0,eventText:``,eventActive:!1,deliveryTime:0,pulse:0},T={x:0,y:0,active:!1};function E(e,t,n,r=1800){ie.textContent=e,ae.textContent=t,oe.textContent=n,_.classList.add(`is-visible`),w.messageTimer=r}function D(){_.classList.remove(`is-visible`)}function O(e){re.innerHTML=e}function k(e,t=!1){g.textContent=e,g.style.color=t?`var(--danger)`:``}function me(e){return n.map(t=>{let n=t.type;return e>=3&&t.id===`probolinggo`&&(n=`down`),e>=4&&t.id===`malang`&&(n=`danger`),e>=5&&t.id===`madiun`&&(n=Math.random()>.35?`danger`:`slow`),{...t,type:n,active:!0}})}function he(e){return r.map(t=>{let n=t.risk,r=t.latency;return e>=2&&(n+=.03,r+=10),e>=4&&(n+=.04,r+=12),{...t,risk:a(n,0,.92),latency:r}}).filter(t=>e>=3?!(t.from===`probolinggo`&&t.to===`kediri`||t.from===`kediri`&&t.to===`probolinggo`):!0)}function A(e){return w.nodes.find(t=>t.id===e)??null}function j(e,t){return w.edges.find(n=>n.from===e&&n.to===t||n.from===t&&n.to===e)??null}function ge(e){return w.edges.filter(t=>t.from===e||t.to===e)}function M(e){return ge(e).map(t=>t.from===e?t.to:t.from).filter(e=>A(e)?.active!==!1)}function N(){let e=l.getBoundingClientRect(),t=Math.min(window.devicePixelRatio||1,2);l.width=Math.max(1,Math.floor(e.width*t)),l.height=Math.max(1,Math.floor(e.height*t)),u.setTransform(t,0,0,t,0,0),G()}function P(){let e=l.getBoundingClientRect();return{width:e.width,height:e.height}}function F(e){let t=P();return{x:e.point.x*t.width,y:e.point.y*t.height}}function I(e,t){return w.route.some((n,r)=>r!==0&&w.route[r-1]===e&&n===t)}function _e(){let e=[{id:`jember`,path:[`jember`],cost:0}],t=new Set;for(;e.length;){e.sort((e,t)=>e.cost-t.cost);let n=e.shift();if(!n)break;if(n.id===`jogja`)return n.path;if(!t.has(n.id)){t.add(n.id);for(let r of M(n.id)){if(t.has(r))continue;let i=j(n.id,r);i&&e.push({id:r,path:[...n.path,r],cost:n.cost+i.latency+i.risk*600})}}}return[`jember`,`lumajang`,`malang`,`kediri`,`jogja`]}function L(e=w.level){let n=t[a(e-1,0,t.length-1)];w.level=e,w.score=0,w.timeLeft=n.time,w.totalTime=n.time,w.packetLoss=0,w.reroutes=0,w.delivered=!1,w.gameOver=!1,w.started=!1,w.paused=!1,w.route=[],w.routeIndex=0,w.packet=null,w.currentNode=`jember`,w.targetNode=`jogja`,w.message=``,w.messageTimer=0,w.glitchTimer=0,w.eventTimer=i(3.5,6.5),w.eventText=``,w.eventActive=!1,w.deliveryTime=0,w.pulse=0,w.nodes=me(e),w.edges=he(e),k(`ONLINE`),O(`<strong>&gt;_ SYSTEM</strong> level ${String(e).padStart(2,`0`)} loaded. Select START.`),D(),v.classList.remove(`is-visible`),d.textContent=`START`,W(),G()}function R(){w.gameOver&&L(w.level),w.started=!0,w.paused=!1,w.delivered=!1,w.gameOver=!1,w.packetLoss=0,w.reroutes=0;let e=_e();w.route=[e[0]],w.routeIndex=0,w.currentNode=`jember`,w.targetNode=`jogja`,w.packet={current:`jember`,target:e[1]||`jogja`,progress:0,speed:t[w.level-1]?.speed||.0018,trail:[]},d.textContent=`PAUSE`,E(`LEVEL ${String(w.level).padStart(2,`0`)}`,t[w.level-1]?.title||`NETWORK`,t[w.level-1]?.subtitle||`ROUTE THE PACKET.`,1500),O(`<strong>&gt;_ PACKET</strong> launched from JEMBER. Choose the next node.`),k(`ROUTING`)}function z(){!w.started||w.delivered||w.gameOver||(w.paused=!w.paused,d.textContent=w.paused?`RESUME`:`PAUSE`,w.paused?(k(`PAUSED`),E(`SYSTEM`,`PAUSED`,`THE PACKET IS WAITING.`,1200)):(k(`ROUTING`),D()))}function ve(e){if(!w.started||w.paused||!w.packet||w.delivered||w.gameOver)return;let n=w.currentNode;if(e===n)return;if(!M(n).includes(e)){O(`<strong>&gt;_ ERROR</strong> route unavailable from ${n.toUpperCase()}.`),w.glitchTimer=260;return}let r=j(n,e);if(!r)return;w.reroutes+=1;let i=t[w.level-1]||t[0],o=r.risk*i.lossMultiplier,s=Math.random()<o;if(w.currentNode=e,w.packet={...w.packet,current:n,target:e,progress:0,trail:[]},s){let t=Math.max(7,Math.round(o*100));if(w.packetLoss=a(w.packetLoss+t,0,100),w.glitchTimer=700,O(`<strong>&gt;_ PACKET LOSS</strong> ${n.toUpperCase()} → ${e.toUpperCase()} / ${t}% packet corrupted.`),w.packetLoss>=55){B(`PACKET DESTROYED`);return}}else O(`<strong>&gt;_ ROUTE</strong> ${n.toUpperCase()} → ${e.toUpperCase()} / ${r.latency}ms`);A(e)?.type===`down`&&(w.packetLoss=a(w.packetLoss+12,0,100),w.glitchTimer=950,O(`<strong>&gt;_ NODE DOWN</strong> ${e.toUpperCase()} is unstable.`)),e===`jogja`&&ye()}function ye(){w.delivered=!0,w.started=!1,w.paused=!1,w.deliveryTime=w.totalTime-w.timeLeft,w.score=be(),w.score>w.bestScore&&(w.bestScore=w.score,s(w.bestScore)),k(`DELIVERED`),d.textContent=`START`,O(`<strong>&gt;_ DELIVERY</strong> packet arrived in JOGJA.`),V(!0)}function B(e){w.gameOver=!0,w.started=!1,w.paused=!1,k(`OFFLINE`,!0),d.textContent=`RETRY`,O(`<strong>&gt;_ FATAL</strong> ${e.toUpperCase()}.`),V(!1,e)}function be(){let e=Math.max(0,Math.round(w.timeLeft*120)),t=w.packetLoss*12,n=Math.max(0,w.reroutes-3)*35,r=Math.max(0,500-w.route.length*35);return Math.max(0,Math.round(1e3+e+r-t-n))}function xe(){if(w.gameOver)return`F`;let e=w.score;return e>=2600?`S`:e>=2200?`A+`:e>=1850?`A`:e>=1500?`B+`:e>=1200?`B`:`C`}function V(e,n=``){se.textContent=e?`DELIVERY COMPLETE`:`NETWORK FAILURE`,ce.textContent=e?String(w.score):`404`,le.textContent=e?`${w.deliveryTime.toFixed(1)}s`:`${Math.max(0,w.deliveryTime).toFixed(1)}s`,ue.textContent=`${Math.round(H())}ms`,de.textContent=`${w.packetLoss}%`,fe.textContent=String(w.reroutes),pe.textContent=xe(),e?y.textContent=w.level<t.length?`Level ${w.level} complete. The packet survived. Barely.`:`You survived the entire Jember → Jogja network.`:y.textContent=n||`The network has rejected your existence.`,p.textContent=e&&w.level<t.length?`NEXT LEVEL`:e?`PLAY AGAIN`:`RETRY`,v.classList.add(`is-visible`)}function H(){if(w.route.length<2)return A(w.currentNode)?.latency||38;let e=0;for(let t=1;t<w.route.length;t++){let n=j(w.route[t-1],w.route[t]);e+=n?.latency||0}return e}function Se(e,t){let n=l.getBoundingClientRect(),r=e-n.left,i=t-n.top,a=P();for(let e of w.nodes){if(!e.active)continue;let t={x:e.point.x*a.width,y:e.point.y*a.height},n=r-t.x,o=i-t.y,s=window.innerWidth<700?27:23;if(n*n+o*o<=s*s)return e.id}return null}function U(e){if(!w.started||w.paused)return;let t=Se(e.clientX,e.clientY);t&&ve(t)}function W(){let e=Math.max(0,w.timeLeft);m.textContent=`${e.toFixed(1)}s`,m.classList.toggle(`is-danger`,e<=5);let t=A(w.currentNode);ee.textContent=`${String(Math.round(t?.latency||H()||38)).padStart(3,`0`)}ms`,h.textContent=`${w.packetLoss}%`,h.classList.toggle(`is-danger`,w.packetLoss>=30),te.textContent=String(w.reroutes),ne.textContent=String(w.score)}function Ce(e){if(!w.started||w.paused){w.pulse+=e*.001;return}let t=e/1e3;w.timeLeft-=t,w.eventTimer-=t,w.messageTimer-=e,w.glitchTimer>0&&(w.glitchTimer-=e),w.pulse+=t,w.messageTimer<=0&&D(),w.eventTimer<=0&&!w.eventActive&&Te(),w.eventActive&&(w.eventTimer-=t,w.eventTimer<=-2.2&&Ee()),w.packet&&(w.packet.progress+=e*w.packet.speed,we(),w.packet.progress>=1&&(w.packet.progress=1)),w.timeLeft<=0&&!w.delivered&&!w.gameOver&&(w.timeLeft=0,B(`TIMEOUT`)),W()}function we(){if(!w.packet)return;let e=A(w.packet.current),t=A(w.packet.target);if(!e||!t)return;let n=F(e),r=F(t),i=a(w.packet.progress,0,1),o=n.x+(r.x-n.x)*i,s=n.y+(r.y-n.y)*i;w.packet.trail.push({x:o,y:s}),w.packet.trail.length>12&&w.packet.trail.shift()}function Te(){w.eventActive=!0;let e=[{text:`LATENCY SPIKE`,log:`LATENCY SPIKE detected on the network.`},{text:`PACKET LOSS`,log:`Packet loss increasing. Everybody remain calm.`},{text:`NODE WARNING`,log:`A node has started behaving suspiciously.`},{text:`PRODUCTION DEPLOY`,log:`Someone pushed directly to production.`}],t=e[Math.floor(Math.random()*e.length)];w.eventText=t.text,w.eventTimer=0,k(`UNSTABLE`,!0),O(`<strong>&gt;_ EVENT</strong> ${t.log}`)}function Ee(){w.eventActive=!1,w.eventTimer=i(4,7),!w.gameOver&&!w.delivered&&k(w.started?`ROUTING`:`ONLINE`)}function G(){let e=l.getBoundingClientRect();if(!e.width||!e.height)return;let t=e.width,n=e.height;u.save(),u.clearRect(0,0,l.width,l.height),u.fillStyle=`#0c0c0c`,u.fillRect(0,0,t,n),De(t,n),Oe(t,n),ke(t,n),Ae(t,n),je(t,n),Me(),Ne(t,n),Pe(),u.restore()}function De(e,t){u.save(),u.strokeStyle=`rgba(255,255,255,.055)`,u.lineWidth=1;let n=window.innerWidth<700?28:34;for(let r=0;r<=e;r+=n)u.beginPath(),u.moveTo(r,0),u.lineTo(r,t),u.stroke();for(let r=0;r<=t;r+=n)u.beginPath(),u.moveTo(0,r),u.lineTo(e,r),u.stroke();u.restore()}function Oe(e,t){u.save(),u.fillStyle=`rgba(201,255,50,.04)`,u.fillRect(0,t*.54,e,t*.46),u.strokeStyle=`rgba(201,255,50,.12)`,u.lineWidth=1;let n=t*(.5+Math.sin(w.pulse*.5)*.02);u.beginPath();for(let t=0;t<=e;t+=8){let e=n+Math.sin(t*.02+w.pulse)*5;t===0?u.moveTo(t,e):u.lineTo(t,e)}u.stroke(),u.restore()}function ke(e,t){for(let e of w.edges){let t=A(e.from),n=A(e.to);if(!t||!n)continue;let r=F(t),i=F(n),a=e.from===w.currentNode||e.to===w.currentNode,o=I(e.from,e.to)||I(e.to,e.from);if(u.save(),u.beginPath(),u.moveTo(r.x,r.y),u.lineTo(i.x,i.y),o?(u.strokeStyle=`rgba(201,255,50,.75)`,u.lineWidth=3):a?(u.strokeStyle=`rgba(201,255,50,.23)`,u.lineWidth=2):(u.strokeStyle=`rgba(255,255,255,.12)`,u.lineWidth=1),e.risk>.25&&u.setLineDash([5,6]),u.stroke(),a){let t=(r.x+i.x)/2,n=(r.y+i.y)/2;u.fillStyle=e.risk>.25?`rgba(255,90,95,.75)`:`rgba(255,255,255,.28)`,u.font=`800 8px ui-monospace, monospace`,u.textAlign=`center`,u.fillText(`${e.latency}ms`,t,n-7)}u.restore()}}function Ae(e,t){if(!(w.route.length<2)){u.save(),u.beginPath();for(let e=0;e<w.route.length;e++){let t=A(w.route[e]);if(!t)continue;let n=F(t);e===0?u.moveTo(n.x,n.y):u.lineTo(n.x,n.y)}u.strokeStyle=`rgba(201,255,50,.18)`,u.lineWidth=7,u.stroke(),u.restore()}}function je(e,t){for(let e of w.nodes){let t=F(e),n=e.id===w.currentNode,r=e.id===`jogja`,i=w.started&&!w.paused&&M(w.currentNode).includes(e.id),a=window.innerWidth<700?8:9;if(u.save(),e.type===`down`&&(u.strokeStyle=`rgba(255,90,95,.8)`,u.lineWidth=2,u.beginPath(),u.arc(t.x,t.y,a+5,0,Math.PI*2),u.stroke()),n||r){let e=Math.sin(w.pulse*4)*3;u.fillStyle=r?`rgba(201,255,50,.08)`:`rgba(255,255,255,.05)`,u.beginPath(),u.arc(t.x,t.y,a+11+e,0,Math.PI*2),u.fill()}i&&(u.fillStyle=`rgba(201,255,50,.12)`,u.beginPath(),u.arc(t.x,t.y,a+8,0,Math.PI*2),u.fill()),u.fillStyle=e.type===`down`?`#ff5a5f`:r?`#c9ff32`:n?`#ffffff`:`#151515`,u.strokeStyle=i?`#c9ff32`:`#525252`,u.lineWidth=i?2:1,u.beginPath(),u.arc(t.x,t.y,a,0,Math.PI*2),u.fill(),u.stroke(),u.fillStyle=r?`#c9ff32`:e.type===`down`?`#ff5a5f`:`#8d8d86`,u.font=`900 9px ui-monospace, monospace`,u.textAlign=`center`,u.fillText(e.name,t.x,t.y+a+16),e.type===`slow`&&(u.fillStyle=`#666660`,u.font=`800 7px ui-monospace, monospace`,u.fillText(`SLOW`,t.x,t.y+a+26)),e.type===`danger`&&(u.fillStyle=`#ff5a5f`,u.font=`800 7px ui-monospace, monospace`,u.fillText(`RISK`,t.x,t.y+a+26)),e.type===`down`&&(u.fillStyle=`#ff5a5f`,u.font=`800 7px ui-monospace, monospace`,u.fillText(`DOWN`,t.x,t.y+a+26)),u.restore()}}function Me(){if(!w.packet)return;let e=A(w.packet.current),t=A(w.packet.target);if(!e||!t)return;let n=F(e),r=F(t),o=a(w.packet.progress,0,1),s=o*o*(3-2*o),c=n.x+(r.x-n.x)*s,l=n.y+(r.y-n.y)*s;if(w.packet.trail.length){u.save();for(let e=0;e<w.packet.trail.length;e++){let t=w.packet.trail[e],n=e/w.packet.trail.length,r=1+n*3.5;u.fillStyle=`rgba(201,255,50,${n*.4})`,u.beginPath(),u.arc(t.x,t.y,r,0,Math.PI*2),u.fill()}u.restore()}u.save();let d=12+Math.sin(w.pulse*8)*3;if(u.shadowBlur=d,u.shadowColor=`#c9ff32`,u.fillStyle=`#c9ff32`,u.fillRect(c-5,l-5,10,10),u.shadowBlur=0,u.fillStyle=`#050505`,u.fillRect(c-2,l-2,4,4),u.restore(),w.glitchTimer>0){u.save();let e=i(-5,5);u.fillStyle=`rgba(255,90,95,.4)`,u.fillRect(c-10+e,l-2,20,2),u.fillStyle=`rgba(201,255,50,.5)`,u.fillRect(c-7-e,l+4,14,2),u.restore()}}function Ne(e,t){w.eventActive&&(u.save(),u.fillStyle=`rgba(255,90,95,.06)`,u.fillRect(0,0,e,t),u.strokeStyle=`rgba(255,90,95,.18)`,u.lineWidth=2,u.strokeRect(12,12,e-24,t-24),u.fillStyle=`#ff5a5f`,u.font=`950 12px ui-monospace, monospace`,u.textAlign=`center`,u.fillText(w.eventText,e/2,28),u.restore())}function Pe(){T.active&&w.started&&!w.paused&&(u.save(),u.strokeStyle=`rgba(201,255,50,.25)`,u.lineWidth=1,u.beginPath(),u.arc(T.x,T.y,14,0,Math.PI*2),u.stroke(),u.restore())}function K(e){if(S)return;let t=a(e-x,0,50);x=e,Ce(t),G(),b=requestAnimationFrame(K)}function q(){if(w.started){z();return}(w.delivered||w.gameOver)&&L(w.delivered&&w.level<t.length?w.level+1:w.level),R()}function J(){L(w.level)}function Y(){if(v.classList.remove(`is-visible`),w.delivered&&w.level<t.length){L(w.level+1),R();return}if(w.delivered&&w.level>=t.length){L(1),R();return}L(w.level),R()}function X(e){let t=l.getBoundingClientRect();T.x=e.clientX-t.left,T.y=e.clientY-t.top,T.active=!0}function Z(){T.active=!1}function Q(e){e.key===`Escape`&&(w.started&&z(),v.classList.remove(`is-visible`)),e.code===`Space`&&(e.preventDefault(),q())}function $(){N()}function Fe(){l.addEventListener(`pointerdown`,U),l.addEventListener(`pointermove`,X),l.addEventListener(`pointerleave`,Z),d.addEventListener(`click`,q),f.addEventListener(`click`,J),p.addEventListener(`click`,Y),window.addEventListener(`keydown`,Q),window.addEventListener(`resize`,$),`ResizeObserver`in window&&(C=new ResizeObserver(N),C.observe(l)),N(),L(1),b=requestAnimationFrame(K)}return Fe(),()=>{S=!0,cancelAnimationFrame(b),l.removeEventListener(`pointerdown`,U),l.removeEventListener(`pointermove`,X),l.removeEventListener(`pointerleave`,Z),d.removeEventListener(`click`,q),f.removeEventListener(`click`,J),p.removeEventListener(`click`,Y),window.removeEventListener(`keydown`,Q),window.removeEventListener(`resize`,$),C?.disconnect()}}export{l as mountGame};