/* Run with Playwright installed; BROWSER_PATH may point to a Chromium binary.
   Start `python3 -m http.server 8000` from the parent containing original/ and implementation/. */
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES ? process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright' : 'playwright');
const fs=require('fs');
(async()=>{
const binary=process.env.BROWSER_PATH || '/tmp/chromium';
const proxySetting=process.env.HTTPS_PROXY || process.env.https_proxy;
const proxyUrl=proxySetting ? new URL(proxySetting) : null;
const browser=await chromium.launch({proxy:proxyUrl ? {server:proxyUrl.origin,bypass:'127.0.0.1,localhost',username:decodeURIComponent(proxyUrl.username),password:decodeURIComponent(proxyUrl.password)} : undefined,executablePath:binary,headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--ignore-certificate-errors']});
const out='implementation/docs/qa';fs.mkdirSync(out,{recursive:true});let results=[];
const sizes=[[360,800],[412,915],[390,844],[540,720],[768,1024],[1024,768],[844,390],[1440,900],[1920,1080],[2560,1080]];
for (const [width,height] of sizes){
const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,ignoreHTTPSErrors:true});
const page=await context.newPage();await page.addInitScript(()=>performance.setResourceTimingBufferSize(3000));let errors=[],failed=[],bad=[],bytes=0;
page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()?.errorText}));page.on('response',r=>{if(r.status()>=400)bad.push([r.status(),r.url()]);});
const start=Date.now();await page.goto('http://127.0.0.1:8000/implementation/',{waitUntil:'domcontentloaded'});await page.locator('.loader.is-ready').waitFor({timeout:60000});const loaderMs=Date.now()-start;
await page.locator('[data-enter="mute"]').click();await page.waitForTimeout(1800);await page.evaluate(()=>document.fonts.ready);
let fit=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,letters:[...document.querySelectorAll('.hn:not(.sp)')].map(e=>({text:e.textContent,x:e.getBoundingClientRect().x,right:e.getBoundingClientRect().right,y:e.getBoundingClientRect().y})),fonts:[[...document.fonts].filter(f=>f.family.includes('Archivo')).some(f=>f.status==='loaded'),[...document.fonts].filter(f=>f.family.includes('Instrument')).some(f=>f.status==='loaded')]}));
await page.screenshot({path:`${out}/hero-${width}x${height}.png`});
await page.locator('#menuBtn').click();const menuOpen=await page.locator('#menuBtn').getAttribute('aria-expanded');await page.keyboard.press('Escape');const menuClosed=await page.locator('#menuBtn').getAttribute('aria-expanded');
await page.locator('#soundBtn').click();const soundOn=await page.locator('#soundBtn').getAttribute('aria-pressed');await page.locator('#soundBtn').click();const soundOff=await page.locator('#soundBtn').getAttribute('aria-pressed');
await page.locator('.hero-skip').click();await page.waitForTimeout(1700);const skipY=await page.evaluate(()=>scrollY);
const before=await page.evaluate(()=>performance.now());let frameTimes=await page.evaluate(()=>new Promise(resolve=>{let a=[],last=performance.now();function f(now){a.push(now-last);last=now;if(a.length<90)requestAnimationFrame(f);else resolve(a)}requestAnimationFrame(f)}));
const data=await page.evaluate(()=>({resources:performance.getEntriesByType('resource').map(r=>({name:r.name,bytes:r.encodedBodySize})),clock:document.querySelector('#clock').textContent,expectedClock:new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Asia/Colombo'}).format(new Date()),memory:performance.memory?{jsUsed:performance.memory.usedJSHeapSize,jsTotal:performance.memory.totalJSHeapSize}:null}));
results.push({width,height,loaderMs,fit,menuOpen,menuClosed,soundOn,soundOff,skipY,errors,failed,bad,resourceBytes:data.resources.reduce((s,x)=>s+x.bytes,0),resources:data.resources.length,clock:data.clock,expectedClock:data.expectedClock,memory:data.memory,rafMedianMs:frameTimes.sort((a,b)=>a-b)[45],rafP95Ms:frameTimes[85]});
console.log(JSON.stringify(results.at(-1)));
await context.close();
}
// Matched local source comparison; freeze decorative animation only in capture, not production.
for(const version of ['original','implementation']){
const page=await browser.newPage({viewport:{width:1440,height:900},ignoreHTTPSErrors:true});await page.goto(`http://127.0.0.1:8000/${version}/`);await page.locator('.loader.is-ready').waitFor();await page.locator('[data-enter="mute"]').click();await page.waitForTimeout(2000);
await page.addStyleTag({content:'.grain{animation:none!important}.cursor{display:none!important}'});
for(const [section,p] of [['story',.3],['story',.6],['work',.1],['work',.4],['work',.65],['work',.9],['about',.5],['services',.2],['portal',.3],['portal',.68],['portal',.9],['contact',0]]){
await page.evaluate(({section,p})=>{const e=document.getElementById(section),y=e.offsetTop+Math.max(0,e.offsetHeight-innerHeight)*p;if(window.freefall.lenis)window.freefall.lenis.scrollTo(y,{immediate:true,force:true});else scrollTo(0,y);window.freefall.step()},{section,p});await page.waitForTimeout(500);await page.screenshot({path:`${out}/${version}-${section}-${p}.png`});
}
await page.close();}
// Failed requests must not trap entry; reduced-motion and sound-enabled entrance.
let context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});let page=await context.newPage();await page.route('**/assets/fall/*.webp',r=>r.abort());await page.goto('http://127.0.0.1:8000/implementation/');await page.locator('.loader.is-ready').waitFor();await page.locator('[data-enter="sound"]').click();await page.waitForTimeout(1500);results.push({failureFallback:await page.locator('html').getAttribute('class'),soundEntry:await page.locator('#soundBtn').getAttribute('aria-pressed'),reducedMotion:await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches)});await context.close();
fs.writeFileSync(`${out}/results.json`,JSON.stringify(results,null,2)+'\n');await browser.close();
})();
