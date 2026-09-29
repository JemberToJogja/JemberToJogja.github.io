var e=`jtj-receh-run`,t=`jtj-receh-run-best`;function n(e,t){let n=e.querySelector(t);if(!n)throw Error(`[RECEH RUN] Missing element: ${t}`);return n}function r(e){let t=e.getContext(`2d`);if(!t)throw Error(`[RECEH RUN] Canvas 2D context is unavailable.`);return t}function i(){try{let e=localStorage.getItem(t);if(!e)return 0;let n=Number(e);return Number.isFinite(n)?Math.max(0,Math.floor(n)):0}catch{return 0}}function a(e){try{localStorage.setItem(t,String(Math.max(0,Math.floor(e))))}catch{}}function o(e){return String(Math.max(0,Math.floor(e))).padStart(3,`0`)}function s(e,t,n){return Math.max(t,Math.min(n,e))}function c(e,t){return e+Math.random()*(t-e)}function l(){if(document.head.querySelector(`[data-receh-run-style="true"]`))return;let t=document.createElement(`style`);t.dataset.recehRunStyle=`true`,t.textContent=`
    .${e} {
      width: min(100%, 760px);
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
        44px,
        13vw,
        92px
      );

      font-weight: 950;
      line-height: .82;
      letter-spacing: -.085em;
    }

    .${e}-description {
      max-width: 600px;
      margin: 0;

      color: #7d7972;

      font-size: 12px;
      line-height: 1.7;
    }

    .${e}-panel {
      overflow: hidden;

      background: #171716;
      border: 1px solid #32312e;
    }

    .${e}-topbar {
      display: grid;
      grid-template-columns:
        1fr
        52px
        1fr;

      gap: 8px;
      align-items: center;

      padding: 10px;

      background: #0d0d0d;
      border-bottom: 1px solid #2a2926;
    }

    .${e}-stat {
      display: grid;
      gap: 4px;
    }

    .${e}-stat:last-child {
      justify-items: end;
    }

    .${e}-stat span {
      color: #57554f;

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

      font-size: 19px;
      font-weight: 900;
      line-height: 1;
    }

    .${e}-restart {
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

    .${e}-restart:active {
      transform: translateY(1px);
    }

    .${e}-canvas-wrap {
      position: relative;

      padding: 8px;

      background: #0a0d10;

      touch-action: none;
      overscroll-behavior: none;
    }

    .${e}-canvas {
      display: block;

      width: 100%;
      height: auto;

      aspect-ratio: 16 / 10;

      background: #0b0e11;
      border: 1px solid #292b2a;

      touch-action: none;
      user-select: none;

      -webkit-user-select: none;
    }

    .${e}-controls {
      display: grid;
      gap: 8px;

      padding: 12px;

      background: #111111;
      border-top: 1px solid #292927;
    }

    .${e}-jump {
      width: 100%;
      min-height: 60px;

      display: flex;
      align-items: center;
      justify-content: center;
      gap: 9px;

      padding: 0 18px;

      border: 1px solid #eeeae1;

      background: #eeeae1;
      color: #111111;

      cursor: pointer;

      font-size: 9px;
      font-weight: 950;
      letter-spacing: .08em;

      touch-action: manipulation;
      user-select: none;
    }

    .${e}-jump:active {
      transform: translateY(1px);
    }

    .${e}-hint {
      color: #55524c;

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

    .${e}-status {
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
      line-height: 1.45;
      letter-spacing: .08em;
      text-align: center;
    }

    .${e}-status.success {
      color: #bfd2b5;
      border-color: #394434;
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
        padding: 30px;
      }

      .${e}-canvas-wrap {
        padding: 14px;
      }

      .${e}-jump {
        max-width: 300px;
        margin: 0 auto;
      }
    }
  `,document.head.appendChild(t)}function u(t){l(),t.innerHTML=`
    <div class="${e}">
      <div class="${e}-head">
        <div class="${e}-eyebrow">
          <span>GAME 05 / ARCADE</span>
          <span>INDONESIAN NEIGHBORHOOD</span>
        </div>

        <h2 class="${e}-title">
          RECEH RUN
        </h2>

        <p class="${e}-description">
          Run through a suspiciously familiar
          Indonesian neighborhood. Avoid potholes,
          cones, dogs, motorcycles, and whatever
          else the street has prepared.
        </p>
      </div>

      <div class="${e}-panel">
        <div class="${e}-topbar">
          <div class="${e}-stat">
            <span>SCORE</span>

            <strong id="receh-score">
              000
            </strong>
          </div>

          <button
            type="button"
            class="${e}-restart"
            id="receh-restart"
            aria-label="Restart Receh Run"
          >
            ↻
          </button>

          <div class="${e}-stat">
            <span>BEST</span>

            <strong id="receh-best">
              000
            </strong>
          </div>
        </div>

        <div class="${e}-canvas-wrap">
          <canvas
            id="receh-canvas"
            class="${e}-canvas"
            aria-label="Receh Run game"
          ></canvas>
        </div>

        <div class="${e}-controls">
          <button
            type="button"
            id="receh-jump"
            class="${e}-jump"
          >
            TAP TO JUMP
            <span>↑</span>
          </button>

          <div class="${e}-hint">
            TAP / SPACE / ARROW UP · DOUBLE JUMP AVAILABLE
          </div>
        </div>
      </div>

      <div
        id="receh-status"
        class="${e}-status"
      >
        TAP TO START RUNNING
      </div>

      <div class="${e}-footer">
        <span>
          RECEH RUN / SURVIVE THE STREET
        </span>

        <span>
          NO MAP / JUST RUN
        </span>
      </div>
    </div>
  `;let u=n(t,`#receh-canvas`),d=r(u),f=n(t,`#receh-score`),ee=n(t,`#receh-best`),p=n(t,`#receh-status`),m=n(t,`#receh-jump`),h=n(t,`#receh-restart`),g=360,_=225,v=`ready`,y=0,b=i(),x=0,S=0,C=0,w=2,T=0,E=1.15,D=0,O=null,k=null,A=null,j=null,M=[],N=[];function P(){return _*.79}function F(){return Math.max(23,g*.075)}function I(){return Math.max(32,_*.17)}function L(){return g*.18}function R(){return 175+Math.min(220,y*2.1)}function z(t,n=``){p.textContent=t,p.className=`${e}-status`,n&&p.classList.add(n)}function B(){f.textContent=o(y),ee.textContent=o(b)}function V(){let e=P(),t=I();return S>=e-t&&(S=e-t,C=0,w=2,!0)}function H(){if(v===`gameover`){W(),U();return}if(v===`ready`){W(),U();return}v===`playing`&&U()}function U(){w<=0||(C=-Math.max(510,_*2.1),--w,q(L(),P()-4,4),de())}function W(){v=`playing`,y=0,x=0,S=P()-I(),C=0,w=2,T=0,E=.8,D=0,M.length=0,N.length=0,O=performance.now(),z(`RUNNING / KEEP YOUR DIGNITY`),B()}function G(){v=`gameover`;let e=Math.floor(y);if(e>b?(b=e,a(b),z(`NEW BEST / THE STREET HAS BEEN DEFEATED`,`success`)):z(`RUN ENDED / TAP TO TRY AGAIN`,`danger`),fe(),typeof navigator.vibrate==`function`)try{navigator.vibrate([80,40,120])}catch{}B()}function K(){let e=R(),t=Math.min(1,y/80),n=Math.random(),r;r=n<.3?`pothole`:n<.55?`cone`:n<.82?`dog`:`motorbike`,y<18&&r===`motorbike`&&(r=`cone`);let i=30,a=25;r===`pothole`&&(i=42,a=13),r===`cone`&&(i=24,a=31),r===`dog`&&(i=52,a=26),r===`motorbike`&&(i=55,a=35),M.push({x:g+i,y:P()-a,width:i,height:a,type:r,passed:!1}),E=s(c(1.1,1.55)-t*.3-e*15e-5,.72,1.45)}function q(e,t,n){for(let r=0;r<n;r+=1)N.push({x:e+c(-5,5),y:t+c(-2,2),size:c(1,3),velocityX:c(-30,-8),velocityY:c(-35,-8),life:c(.25,.5)})}function J(e){for(let t=N.length-1;t>=0;--t){let n=N[t];n&&(n.x+=n.velocityX*e,n.y+=n.velocityY*e,n.velocityY+=100*e,n.life-=e,n.life<=0&&N.splice(t,1))}}function te(){let e=F(),t=I();return{x:L()+e*.18,y:S+t*.12,width:e*.62,height:t*.82}}function ne(e){let t=e.width*.12,n=e.height*.1;return e.type===`pothole`&&(t=e.width*.05,n=e.height*.15),{x:e.x+t,y:e.y+n,width:e.width-t*2,height:e.height-n*2}}function re(e,t){return e.x<t.x+t.width&&e.x+e.width>t.x&&e.y<t.y+t.height&&e.y+e.height>t.y}function ie(e){if(v!==`playing`)return;let t=s(e,0,.033),n=R();x+=n*t,y=Math.floor(x/14),B(),y>b&&(b=y,a(b)),C+=Math.max(1350,_*5.6)*t,S+=C*t,V()&&(D+=t,D>.12&&(q(L(),P()-3,2),D=0)),T+=t,T>=E&&(T=0,K());for(let e=M.length-1;e>=0;--e){let r=M[e];r&&(r.x-=n*t,!r.passed&&r.x+r.width<L()&&(r.passed=!0,q(r.x,r.y+r.height,1)),r.x+r.width<-80&&M.splice(e,1))}J(t);let r=te();for(let e of M)if(re(r,ne(e))){G();break}}function ae(e){let t=P();d.fillStyle=`#0b0e11`,d.fillRect(0,0,g,_),d.fillStyle=`#e7dfc8`,d.beginPath(),d.arc(g*.82,_*.2,Math.max(18,g*.06),0,Math.PI*2),d.fill();for(let t of[[.1,.17,2],[.19,.28,1],[.34,.14,1.5],[.48,.24,1],[.59,.11,1.5],[.72,.3,1],[.91,.15,1.5],[.86,.38,1],[.27,.39,1]]){let n=g*t[0],r=_*t[1],i=t[2]*(.8+Math.sin(e*.001+n)*.15);d.fillStyle=`#d9d4c8`,d.beginPath(),d.arc(n,r,i,0,Math.PI*2),d.fill()}let n=t-_*.2;d.fillStyle=`#151718`;for(let e of[{x:.02,width:.13,height:.12},{x:.15,width:.16,height:.18},{x:.31,width:.11,height:.13},{x:.43,width:.19,height:.2},{x:.63,width:.13,height:.15},{x:.77,width:.18,height:.2}]){let t=g*e.x,r=g*e.width,i=_*e.height;d.fillRect(t,n-i,r,i),d.fillStyle=`#222421`;let a=Math.max(2,g*.007);d.fillRect(t+r*.25,n-i*.62,a,a),d.fillRect(t+r*.68,n-i*.42,a,a),d.fillStyle=`#151718`}let r=g*.66;d.fillStyle=`#30302e`,d.fillRect(r,n-_*.45,Math.max(3,g*.012),_*.45),d.fillRect(r-g*.07,n-_*.41,g*.14,Math.max(3,g*.009)),d.strokeStyle=`#383834`,d.lineWidth=1,d.beginPath(),d.moveTo(0,n-_*.37),d.quadraticCurveTo(g*.35,n-_*.3,g*.66,n-_*.37),d.quadraticCurveTo(g*.82,n-_*.43,g,n-_*.35),d.stroke(),d.beginPath(),d.moveTo(0,n-_*.31),d.quadraticCurveTo(g*.35,n-_*.25,g*.66,n-_*.31),d.quadraticCurveTo(g*.82,n-_*.36,g,n-_*.29),d.stroke(),d.fillStyle=`#232422`,d.fillRect(0,t,g,_-t),d.fillStyle=`#50504b`,d.fillRect(0,t,g,Math.max(2,_*.008));let i=Math.max(24,g*.09),a=Math.max(34,g*.11),o=-(x%(i+a));d.fillStyle=`#696760`;for(let e=o;e<g+40;e+=i+a)d.fillRect(e,t+_*.13,i,Math.max(2,_*.007));let s=g*.1,c=n-_*.12;d.fillStyle=`#373733`,d.fillRect(s,c,g*.13,_*.035),d.fillStyle=`#aaa69c`,d.font=`800 ${Math.max(5,g*.014)}px monospace`,d.textAlign=`center`,d.fillText(`WARUNG`,s+g*.065,c+_*.025),d.textAlign=`left`}function oe(e){let t=L(),n=S,r=F(),i=I(),a=v===`playing`&&Math.abs(C)<40?Math.sin(e*.016)*3:0;d.fillStyle=`#eeeae1`,d.fillRect(t+r*.23,n+i*.31,r*.48,i*.49),d.beginPath(),d.arc(t+r*.48,n+i*.18,r*.18,0,Math.PI*2),d.fill(),d.fillStyle=`#111111`,d.fillRect(t+r*.35,n+i*.03,r*.26,i*.09),d.fillRect(t+r*.53,n+i*.16,Math.max(2,r*.04),Math.max(2,r*.04)),d.strokeStyle=`#eeeae1`,d.lineWidth=Math.max(2,r*.09),d.beginPath(),d.moveTo(t+r*.27,n+i*.39),d.lineTo(t+r*.08,n+i*.54),d.stroke(),d.beginPath(),d.moveTo(t+r*.66,n+i*.4),d.lineTo(t+r*.87,n+i*(.52+Math.abs(a)*.012)),d.stroke(),d.beginPath(),d.moveTo(t+r*.39,n+i*.79),d.lineTo(t+r*(.26-a*.02),n+i*.98),d.stroke(),d.beginPath(),d.moveTo(t+r*.56,n+i*.79),d.lineTo(t+r*(.69+a*.02),n+i*.98),d.stroke()}function se(e){let{x:t,y:n,width:r,height:i,type:a}=e;if(a===`pothole`){d.fillStyle=`#0c0c0c`,d.beginPath(),d.ellipse(t+r/2,n+i/2,r/2,i/2,0,0,Math.PI*2),d.fill(),d.strokeStyle=`#4a4944`,d.lineWidth=2,d.beginPath(),d.arc(t+r*.33,n+i*.4,r*.18,0,Math.PI),d.stroke();return}if(a===`cone`){d.fillStyle=`#77736a`,d.beginPath(),d.moveTo(t+r/2,n),d.lineTo(t+r,n+i),d.lineTo(t,n+i),d.closePath(),d.fill(),d.fillStyle=`#eeeae1`,d.fillRect(t+r*.17,n+i*.52,r*.66,Math.max(2,i*.12));return}if(a===`dog`){d.fillStyle=`#75716a`,d.fillRect(t+r*.15,n+i*.26,r*.65,i*.58),d.beginPath(),d.arc(t+r*.18,n+i*.38,i*.29,0,Math.PI*2),d.fill(),d.fillStyle=`#eeeae1`,d.fillRect(t+r*.25,n+i*.35,2,2),d.strokeStyle=`#75716a`,d.lineWidth=Math.max(2,r*.045),d.beginPath(),d.moveTo(t+r*.3,n+i*.76),d.lineTo(t+r*.25,n+i),d.moveTo(t+r*.68,n+i*.76),d.lineTo(t+r*.75,n+i),d.stroke();return}d.fillStyle=`#565550`,d.fillRect(t+r*.22,n+i*.24,r*.5,i*.42),d.fillStyle=`#3b3a36`,d.beginPath(),d.arc(t+r*.22,n+i*.82,i*.2,0,Math.PI*2),d.arc(t+r*.78,n+i*.82,i*.2,0,Math.PI*2),d.fill(),d.fillStyle=`#aaa79e`,d.fillRect(t+r*.58,n+i*.04,Math.max(3,r*.06),i*.26)}function ce(){for(let e of N)d.globalAlpha=s(e.life*2,0,1),d.fillStyle=`#77736a`,d.fillRect(e.x,e.y,e.size,e.size);d.globalAlpha=1}function le(){v!==`playing`&&(d.fillStyle=`rgba(8, 8, 8, 0.68)`,d.fillRect(0,0,g,_),d.textAlign=`center`,v===`ready`&&(d.fillStyle=`#eeeae1`,d.font=`950 ${Math.max(22,g*.075)}px Inter, sans-serif`,d.fillText(`RECEH RUN`,g/2,_*.42),d.fillStyle=`#8b877f`,d.font=`800 ${Math.max(7,g*.018)}px monospace`,d.fillText(`TAP TO START`,g/2,_*.52)),v===`gameover`&&(d.fillStyle=`#eeeae1`,d.font=`950 ${Math.max(22,g*.075)}px Inter, sans-serif`,d.fillText(`GAME OVER`,g/2,_*.4),d.fillStyle=`#8b877f`,d.font=`800 ${Math.max(7,g*.018)}px monospace`,d.fillText(`TAP TO RUN AGAIN`,g/2,_*.51)),d.textAlign=`left`)}function ue(e){d.clearRect(0,0,g,_),ae(e);for(let e of M)se(e);ce(),oe(e),le()}function Y(){let e=u.getBoundingClientRect();if(e.width<=0||e.height<=0)return;g=e.width,_=e.height;let t=Math.min(window.devicePixelRatio||1,2);u.width=Math.floor(g*t),u.height=Math.floor(_*t),d.setTransform(t,0,0,t,0,0),v===`ready`&&(S=P()-I())}function X(e){O===null&&(O=e);let t=(e-O)/1e3;O=e,ie(t),ue(e),k=window.requestAnimationFrame(X)}function Z(){if(!j)try{j=new AudioContext}catch{j=null}}function de(){if(Z(),!j)return;let e=j.createOscillator(),t=j.createGain();e.type=`square`,e.frequency.setValueAtTime(220,j.currentTime),e.frequency.exponentialRampToValueAtTime(420,j.currentTime+.07),t.gain.setValueAtTime(.035,j.currentTime),t.gain.exponentialRampToValueAtTime(1e-4,j.currentTime+.09),e.connect(t),t.connect(j.destination),e.start(),e.stop(j.currentTime+.09)}function fe(){if(Z(),!j)return;let e=j.createOscillator(),t=j.createGain();e.type=`sawtooth`,e.frequency.setValueAtTime(130,j.currentTime),e.frequency.exponentialRampToValueAtTime(55,j.currentTime+.18),t.gain.setValueAtTime(.04,j.currentTime),t.gain.exponentialRampToValueAtTime(1e-4,j.currentTime+.2),e.connect(t),t.connect(j.destination),e.start(),e.stop(j.currentTime+.2)}function Q(){H()}function $(e){let t=e.target;t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement||t instanceof HTMLButtonElement||(e.key===` `||e.key===`ArrowUp`||e.key===`w`||e.key===`W`)&&(e.preventDefault(),Q())}return m.addEventListener(`click`,Q),h.addEventListener(`click`,W),u.addEventListener(`pointerdown`,e=>{e.preventDefault(),Q()}),document.addEventListener(`keydown`,$),document.addEventListener(`visibilitychange`,()=>{O=document.hidden?null:performance.now()}),A=new ResizeObserver(()=>{Y()}),A.observe(u),Y(),S=P()-I(),B(),z(`TAP TO START RUNNING`),k=window.requestAnimationFrame(X),()=>{k!==null&&(window.cancelAnimationFrame(k),k=null),A?.disconnect(),A=null,document.removeEventListener(`keydown`,$),j&&=(j.close(),null),t.innerHTML=``}}export{u as mountGame};