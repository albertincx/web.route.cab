if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let l={};const o=e=>i(e,t),u={module:{uri:t},exports:l,require:o};s[t]=Promise.all(n.map((e=>u[e]||o(e)))).then((e=>(r(...e),l)))}}define(["./workbox-7cfec069"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/App-Bd9sRQJm.js",revision:null},{url:"assets/index-3FsTiLbS.css",revision:null},{url:"assets/index-DGXDzzgu.js",revision:null},{url:"assets/PostDetail--j4rfmDn.css",revision:null},{url:"assets/PostDetail-BxMcrzi5.js",revision:null},{url:"index.html",revision:"259447baf9d60e53febb077aa9255c08"},{url:"policy.html",revision:"082055eab8b5b76f32271f47768e126a"},{url:"terms.html",revision:"5159a605da50f1ade6b0141ce103235e"},{url:"manifest.json",revision:"b9af43c15728851fcb91c05a1c82421f"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
