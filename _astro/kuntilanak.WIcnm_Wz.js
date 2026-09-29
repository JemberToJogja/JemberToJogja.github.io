var e=`jembertojogja.kuntilanak.best.v2`,t={sky:`#080a0d`,skyTop:`#0e1216`,skyline:`#11161b`,skylineLight:`#181e24`,moon:`#efe7d0`,moonShadow:`#d0c6ab`,star:`#d9d4c5`,tree:`#20342a`,treeDark:`#17261f`,trunk:`#624735`,pole:`#70757a`,poleDark:`#41474d`,cable:`#24292e`,roof:`#674b41`,roofDark:`#42322e`,roofTile:`#8d6256`,building:`#302625`,ground:`#101419`,groundLine:`#292f35`,ghost:`#eee9dc`,ghostShadow:`#c5bdad`,hair:`#121214`,face:`#211b1d`,mouth:`#b9474e`,text:`#f0eadc`,muted:`#969189`,accent:`#e8bf68`,danger:`#d8645c`},n={gravity:1010,flapVelocity:-365,maximumFall:575,maximumRise:-440},r={groundHeight:62,startSpeed:182,maximumSpeed:315,speedIncrease:4.7,startGap:205,minimumGap:164,firstSpawnDelay:1.25,baseSpawnDistance:255,minimumSpawnDistance:215};function i(e,t,n){let r=e.querySelector(t);if(!r)throw Error(`[Kuntilanak Fly] Missing ${n}: ${t}`);return r}function a(e){let t=e.getContext(`2d`,{alpha:!1,desynchronized:!0});if(!t)throw Error(`[Kuntilanak Fly] Could not create 2D canvas context.`);return t}function o(o){o.innerHTML=`
    <section
      class="kj-game"
      aria-label="Kuntilanak Fly"
    >
      <canvas
        class="kj-canvas"
        aria-label="Kuntilanak Fly game"
      ></canvas>

      <div class="kj-hud">
        <div class="kj-score-block">
          <span>SCORE</span>
          <strong data-score>0</strong>
        </div>

        <div class="kj-right-hud">
          <div class="kj-score-block">
            <span>BEST</span>
            <strong data-best>0</strong>
          </div>

          <button
            class="kj-pause"
            type="button"
            data-pause
            aria-label="Pause game"
          >
            II
          </button>
        </div>
      </div>

      <div
        class="kj-overlay"
        data-overlay
      >
        <div class="kj-overlay-card">
          <div
            class="kj-kicker"
            data-overlay-kicker
          >
            JEMBER → JOGJA / NIGHT SHIFT
          </div>

          <h2 data-overlay-title>
            KUNTILANAK FLY
          </h2>

          <p data-overlay-copy>
            Fly through the Indonesian night.
            Do not hit the pole.
          </p>

          <div
            class="kj-final-score"
            data-overlay-score
            hidden
          >
            <div>
              <span>SCORE</span>
              <strong data-final-score>0</strong>
            </div>

            <div>
              <span>BEST</span>
              <strong data-final-best>0</strong>
            </div>
          </div>

          <button
            class="kj-main-button"
            type="button"
            data-action
          >
            TAP TO FLY
          </button>

          <div
            class="kj-hint"
            data-hint
          >
            TAP ANYWHERE TO FLY
          </div>
        </div>
      </div>

      <div
        class="kj-touch-hint"
        data-touch-hint
      >
        <span>TAP</span>
        <b>↑</b>
        <span>FLY</span>
      </div>

      <div class="kj-bottom-label">
        <span>TREES</span>
        <i>•</i>
        <span>POLES</span>
        <i>•</i>
        <span>ROOFTOPS</span>
      </div>
    </section>
  `;let s=i(o,`.kj-game`,`game root`),c=i(s,`.kj-canvas`,`canvas`),l=a(c),ee=i(s,`[data-score]`,`score element`),te=i(s,`[data-best]`,`best element`),ne=i(s,`[data-overlay]`,`overlay`),u=i(s,`[data-overlay-kicker]`,`overlay kicker`),d=i(s,`[data-overlay-title]`,`overlay title`),f=i(s,`[data-overlay-copy]`,`overlay copy`),p=i(s,`[data-overlay-score]`,`overlay score`),re=i(s,`[data-final-score]`,`final score`),ie=i(s,`[data-final-best]`,`final best`),m=i(s,`[data-action]`,`action button`),h=i(s,`[data-pause]`,`pause button`),g=i(s,`[data-hint]`,`hint`),ae=i(s,`[data-touch-hint]`,`touch hint`),_=360,v=640,y=1,b=`ready`,x=0,S=oe(),C=0,w=0,T=r.firstSpawnDelay,E=0,D=0,O=0,k=0,A=!1,j=[],M=[],N={x:108,y:300,velocityY:0,rotation:0,flapAnimation:0},P=[];function oe(){try{let t=localStorage.getItem(e);if(!t)return 0;let n=Number.parseInt(t,10);return Number.isFinite(n)?Math.max(0,n):0}catch{return 0}}function se(t){try{localStorage.setItem(e,String(t))}catch{}}function F(e){try{`vibrate`in navigator&&typeof navigator.vibrate==`function`&&navigator.vibrate(e)}catch{}}function ce(){let e=s.getBoundingClientRect();_=Math.max(280,Math.floor(e.width||360)),v=Math.max(500,Math.floor(e.height||640)),y=Math.min(2.25,Math.max(1,window.devicePixelRatio||1)),c.width=Math.floor(_*y),c.height=Math.floor(v*y),c.style.width=`${_}px`,c.style.height=`${v}px`,l.setTransform(y,0,0,y,0,0),l.imageSmoothingEnabled=!0,N.x=Math.min(_*.25,120),N.y=Z(N.y,80,L()-90),le()}function I(){k||=requestAnimationFrame(()=>{k=0,!A&&ce()})}function le(){j=[],M=[];let e=Math.max(28,Math.floor(_/9));for(let t=0;t<e;t+=1)j.push({x:Q(t*13+3)*_,y:Q(t*17+9)*Math.max(270,v*.52),size:.7+Q(t*29+1)*1.8,alpha:.25+Q(t*37+4)*.65,phase:Q(t*47+5)*Math.PI*2});let t=0,n=0;for(;t<_+300;){let e=55+Q(n*11+4)*72,r=40+Q(n*19+7)*120;M.push({x:t,width:e,height:r}),t+=e+10+Q(n*23+8)*28,n+=1}}function L(){return v-r.groundHeight}function R(e){b=e,ne.classList.toggle(`is-hidden`,b===`playing`),ae.classList.toggle(`is-hidden`,b!==`playing`),h.classList.toggle(`is-hidden`,b===`ready`||b===`gameover`),b===`ready`&&(h.textContent=`II`,u.textContent=`JEMBER → JOGJA / NIGHT SHIFT`,d.textContent=`KUNTILANAK FLY`,f.textContent=`Fly through the Indonesian night. Do not hit the pole.`,p.hidden=!0,m.textContent=`TAP TO FLY`,m.classList.remove(`is-secondary`),g.textContent=`TAP ANYWHERE TO FLY`),b===`playing`&&(p.hidden=!0),b===`paused`&&(u.textContent=`SYSTEM PAUSED`,d.textContent=`PAUSED`,f.textContent=`Even the kuntilanak needs a break.`,p.hidden=!0,m.textContent=`RESUME`,g.textContent=`TAP TO CONTINUE`),b===`gameover`&&(h.textContent=`II`,u.textContent=`NIGHT SHIFT ENDED`,d.textContent=`GAME OVER`,f.textContent=ve(),p.hidden=!1,re.textContent=String(x),ie.textContent=String(S),m.textContent=`TRY AGAIN`,m.classList.add(`is-secondary`),g.textContent=`TAP TO START AGAIN`),Y()}function z(e=!1){x=0,C=0,T=r.firstSpawnDelay,E=0,D=0,P=[],N={x:Math.min(_*.25,120),y:v*.46,velocityY:0,rotation:-.04,flapAnimation:0},Y(),e&&B()}function B(){x=0,P=[],T=r.firstSpawnDelay,N.x=Math.min(_*.25,120),N.y=v*.46,N.velocityY=0,N.rotation=-.05,N.flapAnimation=.16,w=performance.now(),R(`playing`),H()}function V(){b===`paused`&&(w=performance.now(),R(`playing`))}function ue(){if(b===`playing`){R(`paused`);return}b===`paused`&&V()}function H(){b===`playing`&&(N.velocityY=n.flapVelocity,N.flapAnimation=.17,F(7))}function U(e){if(e.preventDefault(),!A){if(b===`ready`){B();return}if(b===`playing`){H();return}if(b===`paused`){V();return}b===`gameover`&&z(!0)}}function W(e){if(e.preventDefault(),b===`ready`){B();return}if(b===`paused`){V();return}b===`gameover`&&z(!0)}function G(e){e.preventDefault(),ue()}function K(){document.hidden&&b===`playing`&&R(`paused`)}function q(){b===`playing`&&R(`paused`)}function de(e){C+=e;let t=Math.min(r.maximumSpeed,r.startSpeed+x*r.speedIncrease);E+=t*e*.055,D+=t*e*.13,fe(e),b===`playing`&&(pe(e,t),(he()||ge())&&_e())}function fe(e){N.flapAnimation=Math.max(0,N.flapAnimation-e),b===`playing`&&(N.velocityY+=n.gravity*e,N.velocityY=Z(N.velocityY,n.maximumRise,n.maximumFall),N.y+=N.velocityY*e),b===`ready`&&(N.y=v*.46+Math.sin(C*2.7)*9);let t=Z(N.velocityY/520,-.58,1.03);N.rotation+=(t-N.rotation)*Math.min(1,e*9)}function pe(e,t){T-=e,T<=0&&(me(),T=Math.max(r.minimumSpawnDistance,r.baseSpawnDistance-x*2.2)/t);for(let n=P.length-1;n>=0;--n){let r=P[n];r.x-=t*e,!r.passed&&r.x+r.width<N.x&&(r.passed=!0,x+=1,x>S&&(S=x,se(S)),Y(),F(9)),r.x+r.width<-70&&P.splice(n,1)}}function me(){let e=Math.max(r.minimumGap,r.startGap-x*2.3),t=L(),n=e/2+72,i=t-e/2-58,a=n+Math.random()*Math.max(1,i-n),o=Math.random(),s;s=o<.44?`tree`:o<.81?`pole`:`roof`,P.push({x:_+24,gapCenter:Z(a,n,i),gapHeight:e,width:Z(_*.17,62,82),type:s,passed:!1})}function J(){return{x:N.x-13,y:N.y-17,width:26,height:36}}function he(){let e=J();return e.y<=5||e.y+e.height>=L()}function ge(){let e=J();for(let t of P){let n=t.x+7,r=t.x+t.width-7,i=t.gapCenter-t.gapHeight/2+8,a=t.gapCenter+t.gapHeight/2-8;if(e.x+e.width>n&&e.x<r&&(e.y<i||e.y+e.height>a))return!0}return!1}function _e(){b===`playing`&&(b=`gameover`,N.velocityY=110,F([20,35,20]),R(`gameover`))}function ve(){let e=[`The utility pole won.`,`The tree had the better route.`,`That roof was definitely there.`,`Gravity has entered the chat.`,`Kuntilanak.exe stopped responding.`,`Your flight was not approved.`];return e[Math.min(e.length-1,Math.floor(x/5))]}function Y(){ee.textContent=String(x),te.textContent=String(S),re.textContent=String(x),ie.textContent=String(S)}function ye(e){l.setTransform(y,0,0,y,0,0),be(e),Te(),Me(e),Be(),b===`gameover`&&Ve()}function be(e){l.fillStyle=t.sky,l.fillRect(0,0,_,v),l.fillStyle=t.skyTop,l.fillRect(0,0,_,Math.max(180,v*.3)),xe(),Se(e),Ce(),we()}function xe(){let e=_*.78,n=Math.max(80,v*.16);l.save(),l.fillStyle=t.moon,l.beginPath(),l.arc(e,n,35,0,Math.PI*2),l.fill(),l.fillStyle=t.sky,l.beginPath(),l.arc(e+13,n-7,31,0,Math.PI*2),l.fill(),l.restore()}function Se(e){l.save();for(let n of j){let r=.72+Math.sin(e*1.7+n.phase)*.28;l.globalAlpha=n.alpha*r,l.fillStyle=t.star,l.fillRect(n.x,n.y,n.size,n.size)}l.restore()}function Ce(){let e=L()-58,n=-(E%160);l.save();for(let r=0;r<4;r+=1)for(let i of M){let a=i.x+r*160+n;if(a>_+100||a+i.width<-100)continue;let o=e-i.height;if(l.fillStyle=t.skyline,l.fillRect(a,o,i.width,i.height),l.fillStyle=t.skylineLight,l.fillRect(a-3,o-4,i.width+6,4),i.height>65){l.fillStyle=`#4f4b42`;let e=Math.max(1,Math.floor(i.width/28));for(let t=0;t<e;t+=1){let e=a+8+t*26;e+4>a+i.width-6||(l.fillRect(e,o+17,4,4),i.height>95&&l.fillRect(e,o+39,4,4))}}}l.restore()}function we(){let e=L(),n=-(D%125);l.save();for(let r=0;r<9;r+=1){let i=r*88+n,a=48+r%3*15,o=e-a+20;l.fillStyle=t.treeDark,l.fillRect(i+22,o,9,a),l.fillStyle=t.tree,l.beginPath(),l.arc(i+21,o,20,0,Math.PI*2),l.fill(),l.beginPath(),l.arc(i+39,o+8,18,0,Math.PI*2),l.fill(),l.beginPath(),l.arc(i+11,o+13,16,0,Math.PI*2),l.fill()}l.restore()}function Te(){for(let e of P)Ee(e)}function Ee(e){let t=e.gapCenter-e.gapHeight/2,n=e.gapCenter+e.gapHeight/2;if(e.type===`tree`){De(e,t,n);return}if(e.type===`pole`){Oe(e,t,n);return}Ae(e,t,n)}function De(e,n,r){let i=e.x,a=e.width;l.save(),l.fillStyle=t.trunk,l.fillRect(i+a*.34,0,a*.32,Math.max(0,n-20)),l.strokeStyle=t.trunk,l.lineWidth=9,l.lineCap=`round`,l.beginPath(),l.moveTo(i+a*.5,n-8),l.lineTo(i+a*.25,Math.max(28,n-55)),l.stroke(),l.beginPath(),l.moveTo(i+a*.5,n-4),l.lineTo(i+a*.78,Math.max(30,n-45)),l.stroke(),X(i+a*.18,Math.max(18,n-16),24),X(i+a*.55,Math.max(22,n-31),29),X(i+a*.88,Math.max(20,n-18),22);let o=Math.max(0,v-r);l.fillStyle=t.trunk,l.fillRect(i+a*.34,r+16,a*.32,Math.max(0,o-16)),X(i+a*.16,Math.min(v-38,r+26),23),X(i+a*.54,Math.min(v-31,r+19),29),X(i+a*.88,Math.min(v-38,r+26),21),l.restore()}function X(e,n,r){l.fillStyle=t.tree,l.beginPath(),l.arc(e,n,r,0,Math.PI*2),l.fill(),l.fillStyle=t.treeDark,l.beginPath(),l.arc(e-r*.5,n+r*.18,r*.64,0,Math.PI*2),l.fill(),l.beginPath(),l.arc(e+r*.5,n+r*.17,r*.6,0,Math.PI*2),l.fill()}function Oe(e,n,r){let i=e.x,a=e.width,o=i+a*.42,s=Math.max(10,a*.16);l.save(),l.fillStyle=t.poleDark,l.fillRect(o,0,s,n),l.fillStyle=t.pole,l.fillRect(o+2,0,s*.42,n),ke(i+a*.06,Math.max(18,n-30),a*.88),l.fillStyle=t.poleDark,l.fillRect(o,r,s,Math.max(0,v-r)),l.fillStyle=t.pole,l.fillRect(o+2,r,s*.42,Math.max(0,v-r)),ke(i+a*.06,Math.min(v-26,r+28),a*.88),l.strokeStyle=t.cable,l.lineWidth=2,l.beginPath(),l.moveTo(i-_*.35,Math.max(22,n-45)),l.quadraticCurveTo(i+a*.45,n-25,i+_*.65,n-47),l.stroke(),l.beginPath(),l.moveTo(i-_*.27,Math.max(32,n-34)),l.quadraticCurveTo(i+a*.5,n-15,i+_*.72,n-36),l.stroke(),l.restore()}function ke(e,n,r){l.fillStyle=t.poleDark,l.fillRect(e,n,r,7),l.fillStyle=t.pole,l.fillRect(e+2,n,Math.max(0,r-4),3)}function Ae(e,n,r){let i=e.x,a=e.width;l.save();let o=Math.max(18,n-43);l.fillStyle=t.building,l.fillRect(i+4,0,a-8,Math.max(0,o)),je(i-5,n-5,a+10,!0),l.fillStyle=t.building,l.fillRect(i+4,r+43,a-8,Math.max(0,v-(r+43))),je(i-5,r+3,a+10,!1),l.restore()}function je(e,n,r,i){l.fillStyle=t.roofDark,l.beginPath(),i?(l.moveTo(e,n),l.lineTo(e+r*.5,n-18),l.lineTo(e+r,n)):(l.moveTo(e,n),l.lineTo(e+r*.5,n+18),l.lineTo(e+r,n)),l.closePath(),l.fill(),l.fillStyle=t.roof,l.beginPath(),i?(l.moveTo(e+6,n-1),l.lineTo(e+r*.5,n-13),l.lineTo(e+r-6,n-1)):(l.moveTo(e+6,n+1),l.lineTo(e+r*.5,n+13),l.lineTo(e+r-6,n+1)),l.closePath(),l.fill(),l.strokeStyle=t.roofTile,l.lineWidth=2;let a=Math.max(4,Math.floor(r/12));for(let t=0;t<a;t+=1){let o=e+5+t/a*(r-10);l.beginPath(),i?(l.moveTo(o,n-2),l.lineTo(o+5,n-8)):(l.moveTo(o,n+2),l.lineTo(o+5,n+8)),l.stroke()}}function Me(e){l.save();let t=b===`ready`?Math.sin(e*3.2)*2.5:0;l.translate(N.x,N.y+t),l.rotate(N.rotation),Ne();let n=N.flapAnimation>0?1:Math.sin(e*14)*.15;Pe(),Fe(),Ie(),Le(),Re(n),ze(),l.restore()}function Ne(){l.save(),l.globalAlpha=.15,l.fillStyle=`#000000`,l.beginPath(),l.ellipse(0,40,18,5,0,0,Math.PI*2),l.fill(),l.restore()}function Pe(){l.fillStyle=t.hair,l.beginPath(),l.moveTo(-7,-10),l.quadraticCurveTo(-19,8,-13,28),l.quadraticCurveTo(-21,37,-13,47),l.quadraticCurveTo(-2,30,1,15),l.closePath(),l.fill(),l.beginPath(),l.moveTo(7,-10),l.quadraticCurveTo(19,8,15,29),l.quadraticCurveTo(23,38,13,47),l.quadraticCurveTo(5,30,-1,15),l.closePath(),l.fill()}function Fe(){l.fillStyle=t.ghost,l.beginPath(),l.ellipse(0,-12,13,16,0,0,Math.PI*2),l.fill()}function Ie(){l.fillStyle=t.face,l.beginPath(),l.arc(-4,-12,1.7,0,Math.PI*2),l.fill(),l.beginPath(),l.arc(4,-12,1.7,0,Math.PI*2),l.fill(),l.strokeStyle=t.mouth,l.lineWidth=1.4,l.lineCap=`round`,l.beginPath(),l.moveTo(-3,-5),l.quadraticCurveTo(0,-3,3,-5),l.stroke()}function Le(){l.fillStyle=t.ghost,l.beginPath(),l.moveTo(-11,0),l.quadraticCurveTo(-18,17,-22,37),l.quadraticCurveTo(-9,43,0,36),l.quadraticCurveTo(10,43,22,37),l.quadraticCurveTo(18,15,11,0),l.closePath(),l.fill(),l.fillStyle=t.ghostShadow,l.beginPath(),l.moveTo(-2,2),l.quadraticCurveTo(4,16,7,36),l.quadraticCurveTo(2,40,-2,36),l.closePath(),l.fill()}function Re(e){l.save(),l.translate(-10,9),l.rotate(-.3+e*.35),l.fillStyle=t.ghost,l.beginPath(),l.moveTo(0,0),l.quadraticCurveTo(-13,-10,-20,-2),l.quadraticCurveTo(-12,6,0,10),l.closePath(),l.fill(),l.restore(),l.save(),l.translate(10,9),l.rotate(.3-e*.35),l.fillStyle=t.ghost,l.beginPath(),l.moveTo(0,0),l.quadraticCurveTo(13,-10,20,-2),l.quadraticCurveTo(12,6,0,10),l.closePath(),l.fill(),l.restore()}function ze(){l.fillStyle=t.mouth,l.fillRect(-2,1,4,13)}function Be(){let e=L();l.save(),l.fillStyle=t.ground,l.fillRect(0,e,_,v-e),l.fillStyle=t.groundLine,l.fillRect(0,e,_,3);let n=-(D%48);for(let t=0;t<12;t+=1){let r=t*48+n;l.fillStyle=`#20252a`,l.fillRect(r,e+18,20,3)}l.restore()}function Ve(){l.save(),l.globalAlpha=.08+Math.max(0,Math.sin(C*30))*.04,l.fillStyle=t.danger,l.fillRect(0,0,_,v),l.restore()}function He(e){if(A)return;w||=e;let t=Math.min(.032,Math.max(0,(e-w)/1e3));w=e,b!==`paused`&&b!==`gameover`&&de(t),ye(e/1e3),O=requestAnimationFrame(He)}function Z(e,t,n){return Math.min(n,Math.max(t,e))}function Q(e){let t=Math.sin(e*12.9898)*43758.5453;return t-Math.floor(t)}function Ue(e){e.preventDefault()}let $=new ResizeObserver(I);return $.observe(s),window.addEventListener(`resize`,I,{passive:!0}),document.addEventListener(`visibilitychange`,K),window.addEventListener(`blur`,q),c.addEventListener(`pointerdown`,U,{passive:!1}),c.addEventListener(`contextmenu`,Ue),m.addEventListener(`click`,W),h.addEventListener(`click`,G),ce(),z(!1),R(`ready`),O=requestAnimationFrame(He),()=>{A=!0,cancelAnimationFrame(O),k&&cancelAnimationFrame(k),$.disconnect(),window.removeEventListener(`resize`,I),document.removeEventListener(`visibilitychange`,K),window.removeEventListener(`blur`,q),c.removeEventListener(`pointerdown`,U),c.removeEventListener(`contextmenu`,Ue),m.removeEventListener(`click`,W),h.removeEventListener(`click`,G)}}var s=document.createElement(`style`);s.textContent=`
  .kj-game {
    position: relative;

    width: 100%;
    height: min(78dvh, 760px);
    min-height: 520px;
    max-width: 480px;

    margin: 0 auto;

    overflow: hidden;

    background: #080a0d;
    border: 1px solid #282c30;

    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;

    touch-action: none;
    overscroll-behavior: contain;

    isolation: isolate;
  }

  .kj-canvas {
    position: absolute;
    inset: 0;

    display: block;

    width: 100%;
    height: 100%;

    touch-action: none;
  }

  .kj-hud {
    position: absolute;
    z-index: 5;

    top: max(
      12px,
      env(safe-area-inset-top)
    );

    right: 12px;
    left: 12px;

    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .kj-right-hud {
    display: flex;
    align-items: flex-start;
    gap: 9px;
  }

  .kj-score-block {
    display: grid;
    gap: 3px;
  }

  .kj-score-block span {
    color: #858078;

    font-family:
      ui-monospace,
      SFMono-Regular,
      Menlo,
      Monaco,
      Consolas,
      monospace;

    font-size: 7px;
    font-weight: 800;
    letter-spacing: .14em;
  }

  .kj-score-block strong {
    color: #f0eadc;

    font-family:
      ui-monospace,
      SFMono-Regular,
      Menlo,
      Monaco,
      Consolas,
      monospace;

    font-size: 22px;
    font-weight: 900;
    line-height: 1;

    letter-spacing: -.06em;
  }

  .kj-pause {
    appearance: none;

    width: 42px;
    height: 42px;

    display: grid;
    place-items: center;

    padding: 0;

    border: 1px solid #40454a;
    background: #111519;

    color: #eee9dc;

    cursor: pointer;

    font-family:
      ui-monospace,
      SFMono-Regular,
      Menlo,
      Monaco,
      Consolas,
      monospace;

    font-size: 10px;
    font-weight: 900;

    touch-action: manipulation;
  }

  .kj-pause:active {
    transform: translateY(1px);
  }

  .kj-pause.is-hidden {
    display: none;
  }

  .kj-overlay {
    position: absolute;
    z-index: 10;

    inset: 0;

    display: grid;
    place-items: center;

    padding:
      20px
      20px
      calc(
        20px +
        env(safe-area-inset-bottom)
      );

    background: rgba(
      8,
      10,
      13,
      .43
    );

    transition:
      opacity 140ms ease,
      visibility 140ms ease;
  }

  .kj-overlay.is-hidden {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }

  .kj-overlay-card {
    width: min(
      100%,
      350px
    );

    padding: 23px 18px 18px;

    background: #111519;
    border: 1px solid #343a3f;

    text-align: center;

    box-shadow:
      0 18px 40px
      rgba(
        0,
        0,
        0,
        .32
      );
  }

  .kj-kicker {
    margin-bottom: 9px;

    color: #d5b15e;

    font-family:
      ui-monospace,
      SFMono-Regular,
      Menlo,
      Monaco,
      Consolas,
      monospace;

    font-size: 7px;
    font-weight: 900;
    letter-spacing: .14em;
  }

  .kj-overlay-card h2 {
    margin: 0;

    color: #eee9dc;

    font-size:
      clamp(
        31px,
        9vw,
        44px
      );

    font-weight: 950;
    line-height: .9;

    letter-spacing: -.07em;
  }

  .kj-overlay-card > p {
    margin: 13px 0 18px;

    color: #928e85;

    font-family:
      ui-monospace,
      SFMono-Regular,
      Menlo,
      Monaco,
      Consolas,
      monospace;

    font-size: 10px;
    line-height: 1.6;
  }

  .kj-final-score {
    display: grid;
    grid-template-columns: repeat(2, 1fr);

    margin: 16px 0;

    border-top: 1px solid #2c3135;
    border-bottom: 1px solid #2c3135;
  }

  .kj-final-score > div {
    display: grid;
    gap: 4px;

    padding: 13px 8px;
  }

  .kj-final-score > div + div {
    border-left: 1px solid #2c3135;
  }

  .kj-final-score span {
    color: #716e67;

    font-family:
      ui-monospace,
      SFMono-Regular,
      Menlo,
      Monaco,
      Consolas,
      monospace;

    font-size: 6px;
    font-weight: 800;
    letter-spacing: .14em;
  }

  .kj-final-score strong {
    color: #eee9dc;

    font-family:
      ui-monospace,
      SFMono-Regular,
      Menlo,
      Monaco,
      Consolas,
      monospace;

    font-size: 22px;
    font-weight: 900;
  }

  .kj-main-button {
    appearance: none;

    width: 100%;
    min-height: 52px;

    border: 1px solid #e8bf68;
    background: #e8bf68;
    color: #12100c;

    cursor: pointer;

    font-family:
      ui-monospace,
      SFMono-Regular,
      Menlo,
      Monaco,
      Consolas,
      monospace;

    font-size: 10px;
    font-weight: 900;
    letter-spacing: .08em;

    touch-action: manipulation;
  }

  .kj-main-button:active {
    transform: translateY(1px);
  }

  .kj-main-button.is-secondary {
    background: #1b2024;
    border-color: #454b50;
    color: #eee9dc;
  }

  .kj-hint {
    margin-top: 11px;

    color: #66645e;

    font-family:
      ui-monospace,
      SFMono-Regular,
      Menlo,
      Monaco,
      Consolas,
      monospace;

    font-size: 6px;
    font-weight: 800;
    letter-spacing: .12em;
  }

  .kj-touch-hint {
    position: absolute;
    z-index: 4;

    left: 50%;
    bottom:
      calc(
        28px +
        env(safe-area-inset-bottom)
      );

    display: flex;
    align-items: center;
    gap: 8px;

    transform: translateX(-50%);

    padding: 7px 10px;

    border: 1px solid #2e3439;
    background: rgba(
      9,
      12,
      15,
      .74
    );

    color: #86827a;

    font-family:
      ui-monospace,
      SFMono-Regular,
      Menlo,
      Monaco,
      Consolas,
      monospace;

    font-size: 6px;
    font-weight: 800;
    letter-spacing: .12em;

    pointer-events: none;
  }

  .kj-touch-hint b {
    color: #e8bf68;
    font-size: 12px;
  }

  .kj-touch-hint.is-hidden {
    display: none;
  }

  .kj-bottom-label {
    position: absolute;
    z-index: 4;

    right: 50%;
    bottom:
      calc(
        9px +
        env(safe-area-inset-bottom)
      );

    transform: translateX(50%);

    display: flex;
    align-items: center;
    gap: 6px;

    white-space: nowrap;

    color: #4c4b47;

    font-family:
      ui-monospace,
      SFMono-Regular,
      Menlo,
      Monaco,
      Consolas,
      monospace;

    font-size: 5px;
    font-weight: 800;
    letter-spacing: .13em;

    pointer-events: none;
  }

  .kj-bottom-label i {
    font-style: normal;
    color: #30302d;
  }

  @media (max-height: 640px) {
    .kj-game {
      height: 70dvh;
      min-height: 480px;
    }

    .kj-overlay-card {
      padding: 20px 16px 16px;
    }

    .kj-overlay-card > p {
      margin: 9px 0 13px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .kj-overlay {
      transition: none;
    }
  }
`;function c(){document.head.querySelector(`[data-kuntilanak-style]`)||(s.dataset.kuntilanakStyle=`true`,document.head.appendChild(s))}c();export{c as attachKuntilanakStyles,o as mountGame};