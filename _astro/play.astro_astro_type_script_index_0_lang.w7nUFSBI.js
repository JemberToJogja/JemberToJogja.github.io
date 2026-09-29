var e=(function(){let e=typeof document<`u`&&document.createElement(`link`).relList;return e&&e.supports&&e.supports(`modulepreload`)?`modulepreload`:`preload`})(),t=function(e){return`/`+e},n={},r=function(r,i,a){let o=Promise.resolve();if(i&&i.length>0){let r=document.getElementsByTagName(`link`),s=document.querySelector(`meta[property=csp-nonce]`),c=s?.nonce||s?.getAttribute(`nonce`);function l(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function u(e){return import.meta.resolve?import.meta.resolve(e):new URL(e,import.meta.url).href}o=l(i.map(i=>{if(i=t(i,a),i=u(i),i in n)return;n[i]=!0;let o=i.endsWith(`.css`);for(let e=r.length-1;e>=0;e--){let t=r[e];if(t.href===i&&(!o||t.rel===`stylesheet`))return}let s=document.createElement(`link`);if(s.rel=o?`stylesheet`:e,o||(s.as=`script`),s.crossOrigin=``,s.href=i,c&&s.setAttribute(`nonce`,c),document.head.appendChild(s),o)return new Promise((e,t)=>{s.addEventListener(`load`,e),s.addEventListener(`error`,()=>t(Error(`Unable to preload CSS for ${i}`)))})}).filter(e=>e!==void 0))}function s(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return o.then(e=>{for(let t of e||[])t.status===`rejected`&&s(t.reason);return r().catch(s)})};function i(e){let t=document.querySelector(e);if(!t)throw Error(`[Game Lab] Missing element: ${e}`);return t}var a=i(`#game-stage-shell`),o=i(`#stage-current-game`),s=i(`#stage-status-text`),c=i(`#stage-content`),l=i(`#close-game`),u={kuntilanak:`KUNTILANAK FLY`,debugger:`DEBUGGER`,"commit-type":`COMMIT TYPE`,"system-2048":`SYSTEM 2048`,"receh-run":`RECEH RUN`,"warung-defense":`WARUNG DEFENSE`,"stack-trace":`STACK TRACE`,"pixel-panic":`PIXEL PANIC`,"route-404":`ROUTE 404`,"bug-hunt":`BUG HUNT`,"ram-clash":`RAM CLASH`},d={kuntilanak:`01`,debugger:`02`,"commit-type":`03`,"system-2048":`04`,"receh-run":`05`,"warung-defense":`06`,"stack-trace":`07`,"pixel-panic":`08`,"route-404":`09`,"bug-hunt":`10`,"ram-clash":`11`},f={1:`kuntilanak`,2:`debugger`,3:`commit-type`,4:`system-2048`,5:`receh-run`,6:`warung-defense`,7:`stack-trace`,8:`pixel-panic`,9:`route-404`,0:`bug-hunt`,q:`ram-clash`,Q:`ram-clash`},p=null;function m(){c.innerHTML=`
          <div class="stage-empty">
            <span class="stage-empty-number">
              00
            </span>

            <p class="stage-empty-kicker">
              GAME LAB
            </p>

            <h2>
              PICK SOMETHING.
            </h2>

            <p>
              Your productivity can wait five minutes.
              Probably.
            </p>

            <div class="stage-empty-rule">
              <span></span>

              <small>
                SELECT A GAME ABOVE
              </small>

              <span></span>
            </div>
          </div>
        `}function h(){let e=p;if(p=null,typeof e==`function`)try{e()}catch(e){console.warn(`[Game Lab] Cleanup failed.`,e)}}function g(e){o.textContent=u[e],s.textContent=`IN DEVELOPMENT`,c.innerHTML=`
          <div class="stage-empty">
            <span class="stage-empty-number">
              ${d[e]}
            </span>

            <p class="stage-empty-kicker">
              GAME LAB
            </p>

            <h2>
              COMING SOON.
            </h2>

            <p>
              This game is wired into the arcade,
              but the actual game module is not ready yet.
            </p>

            <div class="stage-empty-rule">
              <span></span>

              <small>
                MODULE UNDER CONSTRUCTION
              </small>

              <span></span>
            </div>
          </div>
        `,a.scrollIntoView({behavior:`smooth`,block:`start`})}async function _(e,t){if(typeof t.mountGame!=`function`)throw Error(`${e}.ts must export mountGame().`);c.innerHTML=``;let n=await t.mountGame(c);p=typeof n==`function`?n:null,s.textContent=`PLAYING`}async function v(e){h(),o.textContent=u[e],s.textContent=`LOADING`,c.innerHTML=`
          <div class="stage-empty">
            <span class="stage-empty-number">
              ${d[e]}
            </span>

            <p class="stage-empty-kicker">
              INITIALIZING
            </p>

            <h2>
              LOADING GAME.
            </h2>

            <p>
              Please pretend this is suspense.
            </p>
          </div>
        `,a.scrollIntoView({behavior:`smooth`,block:`start`});try{switch(e){case`kuntilanak`:await _(e,await r(()=>import(`./kuntilanak.WIcnm_Wz.js`),[]));return;case`debugger`:await _(e,await r(()=>import(`./debugger.NFZPdzIs.js`),[]));return;case`commit-type`:await _(e,await r(()=>import(`./commit-type.CBoHZ1c3.js`),[]));return;case`system-2048`:await _(e,await r(()=>import(`./system-2048.DDPtQ4fi.js`),[]));return;case`receh-run`:await _(e,await r(()=>import(`./receh-run.Dam6uLe7.js`),[]));return;case`warung-defense`:await _(e,await r(()=>import(`./warung-defense.DEGMZyMO.js`),[]));return;case`stack-trace`:await _(e,await r(()=>import(`./stack-trace.Crn5LK3C.js`),[]));return;case`pixel-panic`:await _(e,await r(()=>import(`./pixel-panic.BrrBVAoi.js`),[]));return;case`route-404`:await _(e,await r(()=>import(`./route-404.CYER7kcl.js`),[]));return;case`bug-hunt`:await _(e,await r(()=>import(`./bug-hunt.CZvmhzHW.js`),[]));return;case`ram-clash`:await _(e,await r(()=>import(`./ram-clash.BnYLUc_7.js`),[]));return;default:g(e);return}}catch(t){console.error(`[Game Lab] Failed to load "${e}".`,t),p=null,s.textContent=`ERROR`,c.innerHTML=`
            <div class="stage-empty">
              <span class="stage-empty-number">
                !!
              </span>

              <p class="stage-empty-kicker">
                GAME LOAD ERROR
              </p>

              <h2>
                SOMETHING BROKE.
              </h2>

              <p>
                The game module could not be loaded.
                Check the browser console for the exact error.
              </p>

              <div class="stage-empty-rule">
                <span></span>

                <small>
                  CHECK GAME MODULE
                </small>

                <span></span>
              </div>
            </div>
          `}}function y(){h(),o.textContent=`NO GAME SELECTED`,s.textContent=`READY`,m(),document.querySelector(`.arcade-section`)?.scrollIntoView({behavior:`smooth`,block:`start`})}function b(e){let t=e.getAttribute(`data-launch-game`);return t===`kuntilanak`||t===`debugger`||t===`commit-type`||t===`system-2048`||t===`receh-run`||t===`warung-defense`||t===`stack-trace`||t===`pixel-panic`||t===`route-404`||t===`bug-hunt`||t===`ram-clash`?t:null}document.addEventListener(`click`,e=>{let t=e.target;if(!(t instanceof Element))return;let n=t.closest(`[data-launch-game]`);if(n){let e=b(n);e&&v(e);return}t.closest(`#close-game`)&&y()}),document.addEventListener(`keydown`,e=>{let t=e.target;if(t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement||t instanceof HTMLSelectElement)return;if((e.key===`Enter`||e.key===` `)&&t instanceof HTMLElement){let n=t.closest(`[data-launch-game]`);if(n){let t=b(n);if(t){e.preventDefault(),v(t);return}}}if(e.key===`Escape`){typeof p==`function`&&y();return}if(t instanceof HTMLButtonElement)return;let n=f[e.key];n&&(e.preventDefault(),v(n))}),l.setAttribute(`aria-label`,`Close current game`);var x=document.querySelectorAll(`.reveal-section`),S=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&(e.target.classList.add(`is-visible`),S.unobserve(e.target))})},{threshold:.08,rootMargin:`0px 0px -8% 0px`});x.forEach(e=>{S.observe(e)}),document.querySelectorAll(`.magnetic`).forEach(e=>{e.addEventListener(`pointermove`,t=>{if(window.innerWidth<900)return;let n=e.getBoundingClientRect(),r=(t.clientX-n.left-n.width/2)*.07,i=(t.clientY-n.top-n.height/2)*.07;e.style.setProperty(`--mx`,`${r}px`),e.style.setProperty(`--my`,`${i}px`)}),e.addEventListener(`pointerleave`,()=>{e.style.setProperty(`--mx`,`0px`),e.style.setProperty(`--my`,`0px`)})});var C=document.querySelector(`.cursor-glow`);C&&window.innerWidth>=900&&window.addEventListener(`pointermove`,e=>{C.style.transform=`translate3d(${e.clientX}px, ${e.clientY}px, 0)`});