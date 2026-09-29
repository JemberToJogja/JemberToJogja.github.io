var e=`jtj-warung-defense`,t=`jtj-warung-defense-best`;function n(e,t){let n=e.querySelector(t);if(!n)throw Error(`[WARUNG DEFENSE] Missing element: ${t}`);return n}function r(e){let t=e.getContext(`2d`);if(!t)throw Error(`[WARUNG DEFENSE] Canvas 2D context is unavailable.`);return t}function i(){try{let e=localStorage.getItem(t);if(!e)return 0;let n=Number(e);return Number.isFinite(n)?Math.max(0,Math.floor(n)):0}catch{return 0}}function a(e){try{localStorage.setItem(t,String(Math.max(0,Math.floor(e))))}catch{}}function o(e){return String(Math.max(0,Math.floor(e))).padStart(3,`0`)}function s(e,t,n){return Math.max(t,Math.min(n,e))}function c(e,t){return e+Math.random()*(t-e)}function l(){if(document.head.querySelector(`[data-warung-defense-style="true"]`))return;let t=document.createElement(`style`);t.dataset.warungDefenseStyle=`true`,t.textContent=`
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
        43px,
        12.5vw,
        90px
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
        repeat(4, 1fr);

      background: #0d0d0d;
      border-bottom: 1px solid #2a2926;
    }

    .${e}-stat {
      min-height: 64px;

      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 4px;

      padding: 9px 11px;

      border-right: 1px solid #262522;
    }

    .${e}-stat:last-child {
      border-right: 0;
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

      font-size: 17px;
      font-weight: 900;
      line-height: 1;
    }

    .${e}-canvas-wrap {
      padding: 8px;

      background: #0b0c0b;

      touch-action: none;
      overscroll-behavior: none;
    }

    .${e}-canvas {
      display: block;

      width: 100%;
      height: auto;

      aspect-ratio: 16 / 10;

      background: #111211;
      border: 1px solid #292b28;

      touch-action: none;
      user-select: none;

      -webkit-user-select: none;
    }

    .${e}-controls {
      display: grid;
      gap: 8px;

      padding: 12px;

      background: #101010;
      border-top: 1px solid #292927;
    }

    .${e}-defend {
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

    .${e}-defend:active {
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
      line-height: 1.4;
      letter-spacing: .09em;

      text-align: center;
    }

    .${e}-restart {
      min-height: 44px;

      display: flex;
      align-items: center;
      justify-content: center;

      border: 1px solid #3d3c38;
      background: #1d1d1c;
      color: #aaa69e;

      cursor: pointer;

      font-size: 8px;
      font-weight: 850;
      letter-spacing: .08em;

      touch-action: manipulation;
    }

    .${e}-restart:active {
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

    @media (max-width: 520px) {
      .${e}-topbar {
        grid-template-columns:
          repeat(2, 1fr);
      }

      .${e}-stat:nth-child(2) {
        border-right: 0;
      }

      .${e}-stat:nth-child(-n + 2) {
        border-bottom: 1px solid #262522;
      }
    }

    @media (min-width: 700px) {
      .${e} {
        padding: 30px;
      }

      .${e}-canvas-wrap {
        padding: 14px;
      }

      .${e}-controls {
        grid-template-columns:
          1fr
          180px;
        align-items: center;
      }

      .${e}-defend {
        max-width: 320px;
      }
    }
  `,document.head.appendChild(t)}function u(t){l(),t.innerHTML=`
    <div class="${e}">
      <div class="${e}-head">
        <div class="${e}-eyebrow">
          <span>GAME 06 / DEFENSE</span>
          <span>PROTECT THE SNACKS</span>
        </div>

        <h2 class="${e}-title">
          WARUNG DEFENSE
        </h2>

        <p class="${e}-description">
          Protect the warung. Defend the snacks.
          Tap incoming trouble before it reaches
          the counter. Ask questions later.
        </p>
      </div>

      <div class="${e}-panel">
        <div class="${e}-topbar">
          <div class="${e}-stat">
            <span>SCORE</span>
            <strong id="warung-score">
              000
            </strong>
          </div>

          <div class="${e}-stat">
            <span>BEST</span>
            <strong id="warung-best">
              000
            </strong>
          </div>

          <div class="${e}-stat">
            <span>WAVE</span>
            <strong id="warung-wave">
              001
            </strong>
          </div>

          <div class="${e}-stat">
            <span>LIVES</span>
            <strong id="warung-lives">
              ♥♥♥
            </strong>
          </div>
        </div>

        <div class="${e}-canvas-wrap">
          <canvas
            id="warung-canvas"
            class="${e}-canvas"
            aria-label="Warung Defense game"
          ></canvas>
        </div>

        <div class="${e}-controls">
          <div class="${e}-hint">
            TAP AN ENEMY / TAP DEFEND TO HIT THE NEAREST THREAT
          </div>

          <div>
            <button
              id="warung-defend"
              type="button"
              class="${e}-defend"
            >
              DEFEND WARUNG
              <span>↗</span>
            </button>

            <button
              id="warung-restart"
              type="button"
              class="${e}-restart"
            >
              ↻ RESTART
            </button>
          </div>
        </div>
      </div>

      <div
        id="warung-status"
        class="${e}-status"
      >
        TAP TO START DEFENSE
      </div>

      <div class="${e}-footer">
        <span>
          WARUNG DEFENSE / SNACK SECURITY
        </span>

        <span>
          TAP / DEFEND / SURVIVE
        </span>
      </div>
    </div>
  `;let u=n(t,`#warung-canvas`),d=r(u),f=n(t,`#warung-score`),p=n(t,`#warung-best`),m=n(t,`#warung-wave`),h=n(t,`#warung-lives`),g=n(t,`#warung-status`),_=n(t,`#warung-defend`),v=n(t,`#warung-restart`),y=360,b=225,x=`ready`,S=0,C=i(),w=3,T=1,E=0,D=0,O=1.05,k=0,A=null,j=null,M=null,N=[],P=[];function F(t,n=``){g.textContent=t,g.className=`${e}-status`,n&&g.classList.add(n)}function I(){f.textContent=o(S),p.textContent=o(C),m.textContent=String(T).padStart(3,`0`),h.textContent=`♥`.repeat(Math.max(0,w))+`♡`.repeat(3-Math.max(0,w))}function L(){return b*.8}function R(){return y*.16}function z(){return 1+Math.min(1.4,(T-1)*.11)}function B(){x=`playing`,S=0,w=3,T=1,E=0,k=0,D=0,O=.9,N.length=0,P.length=0,A=performance.now(),F(`DEFENSE ACTIVE / PROTECT THE WARUNG`),I()}function V(){x=`gameover`;let e=Math.floor(S);if(e>C?(C=e,a(C),F(`NEW BEST / THE SNACKS SURVIVED LONG ENOUGH`,`success`)):F(`WARUNG OVERRUN / TAP DEFEND TO TRY AGAIN`,`danger`),typeof navigator.vibrate==`function`)try{navigator.vibrate([75,40,110])}catch{}I()}function H(){let e=Math.random(),t=Math.min(1,T/12),n;n=e<.36?`thief`:e<.58?`cat`:e<.82?`kid`:`motorbike`,T<3&&n===`motorbike`&&(n=`kid`);let r=15,i=48,a=1,o=10;n===`thief`&&(r=16,i=54,a=1,o=10),n===`cat`&&(r=12,i=74,a=1,o=12),n===`kid`&&(r=15,i=63,a=1,o=15),n===`motorbike`&&(r=20,i=39,a=T>=8?2:1,o=30);let l={x:y+r*2,y:L()-r-c(-1,3),radius:r,speed:i*z(),hp:a,maxHp:a,type:n,value:o,hitFlash:0,passed:!1};N.push(l),O=s(c(.7,1.25)-t*.16,.5,1.25)}function U(e,t,n){for(let n=0;n<5;n+=1)P.push({x:e,y:t,velocityX:c(-70,70),velocityY:c(-90,-25),life:c(.35,.65),maxLife:.65,size:c(1,3)});n&&P.push({x:e,y:t-12,velocityX:0,velocityY:-32,life:.65,maxLife:.65,size:1,text:n})}function W(e){for(let t=P.length-1;t>=0;--t){let n=P[t];n&&(n.x+=n.velocityX*e,n.y+=n.velocityY*e,n.velocityY+=105*e,n.life-=e,n.life<=0&&P.splice(t,1))}}function G(e){if(--e.hp,e.hitFlash=.15,e.hp>0){E=0,U(e.x,e.y,`HIT`),F(`THAT ONE TOOK TWO HITS`);return}let t=Math.min(5,E);E+=1;let n=e.value+t*2;if(S+=n,S>C&&(C=S,a(C)),U(e.x,e.y,`+${n}`),N.splice(N.indexOf(e),1),F(E>=3?`COMBO x${E} / KEEP DEFENDING`:`THREAT CLEARED / PROTECT THE SNACKS`,`success`),typeof navigator.vibrate==`function`)try{navigator.vibrate(25)}catch{}}function K(){if(x===`ready`&&B(),x===`gameover`){B();return}if(x!==`playing`)return;let e=null,t=1/0;for(let n of N){let r=Math.abs(n.x-R());r<t&&(e=n,t=r)}if(!e){E=0,F(`NICE TRY / THERE IS NOBODY TO DEFEND AGAINST YET`);return}G(e),I()}function q(e,t){if(x===`ready`&&B(),x===`gameover`){B();return}if(x!==`playing`)return;let n=null,r=1/0;for(let i of N){let a=i.x-e,o=i.y-t,s=Math.sqrt(a*a+o*o);s<=i.radius+28&&s<r&&(n=i,r=s)}n?G(n):(E=0,F(`MISS / TAP THE THREAT`)),I()}function J(e){if(!e.passed){if(e.passed=!0,--w,E=0,U(R(),e.y,`-1`),F(w>0?`THE WARUNG TOOK A HIT`:`THE WARUNG HAS BEEN OVERRUN`,`danger`),typeof navigator.vibrate==`function`)try{navigator.vibrate(w>0?45:[80,40,100])}catch{}w<=0&&V()}}function Y(e){if(x!==`playing`)return;let t=s(e,0,.033);k+=t,T=1+Math.floor(k/12),D+=t,D>=O&&(D=0,H());for(let e=N.length-1;e>=0;--e){let n=N[e];if(n){if(n.x-=n.speed*t,n.hitFlash=Math.max(0,n.hitFlash-t),!n.passed&&n.x-n.radius<=R()){J(n),N.splice(e,1);continue}n.x+n.radius<-30&&N.splice(e,1)}}W(t),I()}function X(e){d.fillStyle=`#0b0e0d`,d.fillRect(0,0,y,b),d.fillStyle=`#ded6bf`,d.beginPath(),d.arc(y*.83,b*.19,Math.max(15,y*.05),0,Math.PI*2),d.fill();let t=[[.08,.15],[.19,.23],[.32,.12],[.46,.2],[.61,.12],[.71,.3],[.91,.14],[.86,.33]];for(let n=0;n<t.length;n+=1){let r=t[n];if(!r)continue;let i=.55+Math.sin(e*.002+n)*.2;d.globalAlpha=s(i,.2,1),d.fillStyle=`#d9d4c8`,d.fillRect(y*r[0],b*r[1],2,2)}d.globalAlpha=1;let n=b*.54;d.fillStyle=`#161a18`;for(let e of[[.02,.14,.18],[.16,.11,.12],[.29,.16,.2],[.46,.1,.14],[.57,.2,.2],[.78,.12,.16],[.9,.13,.22]]){let t=y*e[0],r=y*e[1],i=b*e[2];d.fillRect(t,n-i,r,i)}d.strokeStyle=`#393d39`,d.lineWidth=1,d.beginPath(),d.moveTo(0,b*.36),d.quadraticCurveTo(y*.34,b*.3,y,b*.38),d.stroke(),d.beginPath(),d.moveTo(0,b*.42),d.quadraticCurveTo(y*.42,b*.35,y,b*.44),d.stroke();let r=L();d.fillStyle=`#262824`,d.fillRect(0,r,y,b-r),d.fillStyle=`#57584f`,d.fillRect(0,r,y,Math.max(2,b*.008));let i=Math.max(22,y*.08),a=Math.max(28,y*.12),o=-(k*90%(i+a));d.fillStyle=`#686760`;for(let e=o;e<y+40;e+=i+a)d.fillRect(e,r+b*.13,i,2);d.fillStyle=`#0e110f`,d.fillRect(y*.57,r-b*.09,5,b*.09),d.beginPath(),d.arc(y*.57,r-b*.12,y*.06,0,Math.PI*2),d.fill()}function ee(){let e=R(),t=L(),n=y*.17,r=b*.28,i=t-r;d.fillStyle=`#101110`,d.fillRect(e-n*.15,t-3,n*1.25,4),d.fillStyle=`#574f42`,d.fillRect(e-n*.08,i+r*.2,n,r*.8),d.fillStyle=`#292a27`,d.fillRect(e-n*.13,i,n*1.12,r*.2),d.fillStyle=`#8b806b`,d.fillRect(e-n*.03,i+r*.55,n*.9,r*.13),d.fillStyle=`#eeeae1`,d.fillRect(e+n*.08,i+r*.04,n*.66,r*.12),d.fillStyle=`#222220`,d.font=`900 ${Math.max(5,y*.015)}px monospace`,d.textAlign=`center`,d.fillText(`WARUNG`,e+n*.41,i+r*.125),d.textAlign=`left`,d.fillStyle=`#272724`,d.fillRect(e+n*.08,i+r*.3,n*.7,2),d.fillRect(e+n*.08,i+r*.42,n*.7,2);let a=[`#b1a68f`,`#817b69`,`#c7bca4`,`#6e7169`];for(let t=0;t<4;t+=1)d.fillStyle=a[t]??`#aaa`,d.fillRect(e+n*(.12+t*.17),i+r*.34,n*.1,r*.06);d.strokeStyle=`#5b5b54`,d.lineWidth=1,d.setLineDash([4,5]),d.beginPath(),d.moveTo(e+n*.95,t-b*.01),d.lineTo(e+n*.95,t-b*.2),d.stroke(),d.setLineDash([])}function te(e){let t=e.hitFlash>0?`#eeeae1`:e.type===`thief`?`#7b6b58`:e.type===`cat`?`#686963`:e.type===`kid`?`#807b6d`:`#555651`;if(d.fillStyle=t,e.type===`motorbike`?(d.fillRect(e.x-e.radius*1.1,e.y-e.radius*.35,e.radius*2.2,e.radius*.7),d.beginPath(),d.arc(e.x-e.radius*.75,e.y+e.radius*.7,e.radius*.34,0,Math.PI*2),d.arc(e.x+e.radius*.75,e.y+e.radius*.7,e.radius*.34,0,Math.PI*2),d.fill(),d.fillStyle=`#222321`,d.fillRect(e.x+e.radius*.42,e.y-e.radius*.86,Math.max(2,e.radius*.12),e.radius*.5)):(d.beginPath(),d.arc(e.x,e.y,e.radius,0,Math.PI*2),d.fill(),d.fillStyle=`#4a4b47`,d.beginPath(),d.arc(e.x,e.y-e.radius*.55,e.radius*.58,0,Math.PI*2),d.fill(),d.fillStyle=`#eeeae1`,d.fillRect(e.x-e.radius*.28,e.y-e.radius*.64,2,2),d.fillRect(e.x+e.radius*.18,e.y-e.radius*.64,2,2),e.type===`cat`&&(d.fillStyle=`#686963`,d.beginPath(),d.moveTo(e.x-e.radius*.7,e.y-e.radius*.9),d.lineTo(e.x-e.radius*.25,e.y-e.radius*1.45),d.lineTo(e.x,e.y-e.radius*.92),d.closePath(),d.fill(),d.beginPath(),d.moveTo(e.x,e.y-e.radius*.92),d.lineTo(e.x+e.radius*.25,e.y-e.radius*1.45),d.lineTo(e.x+e.radius*.7,e.y-e.radius*.9),d.closePath(),d.fill())),e.maxHp>1){let t=e.radius*2,n=e.x-t/2,r=e.y-e.radius*1.65;d.fillStyle=`#292a27`,d.fillRect(n,r,t,3),d.fillStyle=`#bbb5a6`,d.fillRect(n,r,t*(e.hp/e.maxHp),3)}}function ne(){for(let e of P){let t=s(e.life/e.maxLife,0,1);d.globalAlpha=t,e.text?(d.fillStyle=`#eeeae1`,d.font=`900 ${Math.max(8,y*.018)}px monospace`,d.textAlign=`center`,d.fillText(e.text,e.x,e.y),d.textAlign=`left`):(d.fillStyle=`#aaa397`,d.fillRect(e.x,e.y,e.size,e.size))}d.globalAlpha=1}function re(){x!==`playing`&&(d.fillStyle=`rgba(7, 8, 7, 0.7)`,d.fillRect(0,0,y,b),d.textAlign=`center`,d.fillStyle=`#eeeae1`,d.font=`950 ${Math.max(22,y*.07)}px Inter, sans-serif`,x===`ready`&&(d.fillText(`WARUNG DEFENSE`,y/2,b*.42),d.fillStyle=`#8b877f`,d.font=`800 ${Math.max(7,y*.018)}px monospace`,d.fillText(`TAP TO START`,y/2,b*.52)),x===`gameover`&&(d.fillText(`WARUNG OVERRUN`,y/2,b*.41),d.fillStyle=`#8b877f`,d.font=`800 ${Math.max(7,y*.018)}px monospace`,d.fillText(`TAP DEFEND TO TRY AGAIN`,y/2,b*.52)),d.textAlign=`left`)}function ie(e){d.clearRect(0,0,y,b),X(e),ee();for(let e of N)te(e);ne(),re()}function Z(){let e=u.getBoundingClientRect();if(e.width<=0||e.height<=0)return;y=e.width,b=e.height;let t=Math.min(window.devicePixelRatio||1,2);u.width=Math.floor(y*t),u.height=Math.floor(b*t),d.setTransform(t,0,0,t,0,0)}function ae(e){let t=u.getBoundingClientRect();return{x:(e.clientX-t.left)/t.width*y,y:(e.clientY-t.top)/t.height*b}}function oe(e){e.preventDefault();let t=ae(e);q(t.x,t.y)}function Q(e){A===null&&(A=e);let t=(e-A)/1e3;A=e,Y(t),ie(e),j=window.requestAnimationFrame(Q)}function $(e){let t=e.target;t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement||t instanceof HTMLSelectElement||t instanceof HTMLButtonElement||(e.key===` `||e.key===`Enter`||e.key===`ArrowUp`||e.key===`e`||e.key===`E`)&&(e.preventDefault(),K())}return _.addEventListener(`click`,K),v.addEventListener(`click`,B),u.addEventListener(`pointerdown`,oe),u.addEventListener(`pointerenter`,()=>{}),u.addEventListener(`pointerleave`,()=>{}),document.addEventListener(`keydown`,$),document.addEventListener(`visibilitychange`,()=>{A=document.hidden?null:performance.now()}),M=new ResizeObserver(()=>{Z()}),M.observe(u),Z(),I(),j=window.requestAnimationFrame(Q),()=>{j!==null&&(window.cancelAnimationFrame(j),j=null),M?.disconnect(),M=null,document.removeEventListener(`keydown`,$),t.innerHTML=``}}export{u as mountGame};