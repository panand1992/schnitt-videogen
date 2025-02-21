/*! For license information please see 728.main-bundle.js.LICENSE.txt */
"use strict";(self.webpackChunkschnitt_videogen=self.webpackChunkschnitt_videogen||[]).push([[728],{567:(e,t,a)=>{a.d(t,{Ub:()=>i,b5:()=>n,pH:()=>o});var r=a(933);const n=e=>({type:r.Zu,data:e}),o=e=>({type:r.K,data:e}),i=e=>({type:r.bx,data:e})},728:(e,t,a)=>{a.r(t),a.d(t,{default:()=>j});var r=a(540),n=a(556),o=a.n(n),i=a(468),s=a(508),l=a(181);const d=(0,l.A)("Film",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M7 3v18",key:"bbkbws"}],["path",{d:"M3 7.5h4",key:"zfgn84"}],["path",{d:"M3 12h18",key:"1i2n21"}],["path",{d:"M3 16.5h4",key:"1230mu"}],["path",{d:"M17 3v18",key:"in4fa5"}],["path",{d:"M17 7.5h4",key:"myr1c1"}],["path",{d:"M17 16.5h4",key:"go4c1d"}]]),c=(0,l.A)("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]]),m=(0,l.A)("Sparkles",[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",key:"4pj2yx"}],["path",{d:"M20 3v4",key:"1olli1"}],["path",{d:"M22 5h-4",key:"1gvqau"}],["path",{d:"M4 17v2",key:"vumght"}],["path",{d:"M5 18H3",key:"zchphs"}]]),p=(0,l.A)("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);var u=a(72),h=a.n(u),g=a(825),b=a.n(g),f=a(659),k=a.n(f),x=a(56),y=a.n(x),v=a(159),w=a.n(v),E=a(113),N=a.n(E),A=a(196),z={};z.styleTagTransform=N(),z.setAttributes=y(),z.insert=k().bind(null,"head"),z.domAPI=b(),z.insertStyleElement=w(),h()(A.A,z),A.A&&A.A.locals&&A.A.locals;var M=a(536),L=a(567);const C=e=>{const{userLogout:t}=e,a=(0,M.Zp)(),[n,o]=(0,r.useState)(""),[i,s]=(0,r.useState)(!1);return r.createElement("div",{className:"app-container"},r.createElement("header",{className:"glass-header"},r.createElement("div",{className:"header-content"},r.createElement("button",{onClick:()=>{a("/upload/all")},className:"icon-button previous-btn"},r.createElement(d,null),r.createElement("span",null,"Previous Videos")),r.createElement("button",{onClick:()=>{t({navigate:a})},className:"icon-button logout-btn"},r.createElement(c,null),r.createElement("span",null,"Logout")))),r.createElement("main",{className:"main-content"},r.createElement("div",{className:"prompt-card"},r.createElement("div",{className:"card-header"},r.createElement("h1",null,"Schnitt AI Video Generation"),r.createElement("p",{className:"subtitle"},"Transform your ideas into stunning videos")),r.createElement("form",{onSubmit:async e=>{e.preventDefault(),s(!0),await new Promise((e=>setTimeout(e,2e3))),s(!1)},className:"prompt-form"},r.createElement("div",{className:"input-container"},r.createElement(m,{className:"sparkle-icon"}),r.createElement("textarea",{value:n,onChange:e=>o(e.target.value),placeholder:"Describe your video idea in detail...",className:"modern-input",rows:5}),n.length>0&&r.createElement("div",{className:"character-counter"},n.length," characters")),r.createElement("button",{type:"submit",className:"generate-button "+(i?"generating":""),disabled:!n.trim()||i},i?r.createElement(r.Fragment,null,r.createElement(p,{className:"spin"}),r.createElement("span",null,"Generating...")):r.createElement(r.Fragment,null,r.createElement(m,null),r.createElement("span",null,"Generate Video")))))))};C.propTypes={userLogout:o().func};const S=(0,s.j8)({}),j=(0,i.Ng)(S,(e=>({userLogout:t=>e((0,L.Ub)(t))})))(C)},196:(e,t,a)=>{a.d(t,{A:()=>s});var r=a(601),n=a.n(r),o=a(314),i=a.n(o)()(n());i.push([e.id,".app-container{min-height:100vh;background:linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);color:#fff}.glass-header{background:hsla(0,0%,100%,.03);backdrop-filter:blur(10px);border-bottom:1px solid hsla(0,0%,100%,.1);position:sticky;top:0;z-index:100}.header-content{max-width:1200px;margin:0 auto;padding:1rem 2rem;display:flex;justify-content:space-between;align-items:center}.icon-button{display:flex;align-items:center;gap:.5rem;padding:.5rem 1rem;border:none;border-radius:12px;font-size:.9rem;cursor:pointer;transition:all .3s ease;color:#fff}.previous-btn{background:hsla(0,0%,100%,.1)}.previous-btn:hover{background:hsla(0,0%,100%,.2);transform:translateY(-1px)}.logout-btn{background:rgba(220,53,69,.2)}.logout-btn:hover{background:rgba(220,53,69,.3);transform:translateY(-1px)}.main-content{max-width:800px;margin:3rem auto;padding:0 2rem}.prompt-card{background:hsla(0,0%,100%,.05);border-radius:24px;padding:2.5rem;backdrop-filter:blur(10px);border:1px solid hsla(0,0%,100%,.1);box-shadow:0 4px 30px rgba(0,0,0,.1)}.card-header{text-align:center;margin-bottom:2.5rem}h1{margin:0;font-size:2.5rem;background:linear-gradient(135deg, #7f7fd5, #86a8e7, #91eae4);-webkit-background-clip:text;-webkit-text-fill-color:rgba(0,0,0,0);font-weight:700}.subtitle{color:hsla(0,0%,100%,.7);margin-top:.5rem;font-size:1.1rem}.input-container{position:relative;margin-bottom:1.5rem}.sparkle-icon{position:absolute;top:1rem;left:1rem;color:hsla(0,0%,100%,.3);width:1.5rem;height:1.5rem}.modern-input{width:100%;background:hsla(0,0%,100%,.05);border:1px solid hsla(0,0%,100%,.1);border-radius:16px;padding:1rem 1rem 1rem 3.5rem;color:#fff;font-size:1rem;resize:vertical;transition:all .3s ease}.modern-input:focus{outline:none;border-color:hsla(0,0%,100%,.2);background:hsla(0,0%,100%,.08);box-shadow:0 0 20px hsla(0,0%,100%,.05)}.modern-input::placeholder{color:hsla(0,0%,100%,.3)}.character-counter{position:absolute;bottom:1rem;right:1rem;font-size:.8rem;color:hsla(0,0%,100%,.5)}.generate-button{width:100%;padding:1rem;display:flex;align-items:center;justify-content:center;gap:.75rem;background:linear-gradient(135deg, #7f7fd5, #86a8e7);border:none;border-radius:12px;color:#fff;font-size:1rem;font-weight:600;cursor:pointer;transition:all .3s ease}.generate-button:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 20px rgba(0,0,0,.2)}.generate-button:disabled{opacity:.7;cursor:not-allowed}.generating{background:linear-gradient(135deg, #86a8e7, #7f7fd5)}.spin{animation:spin 1s linear infinite}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}.prompt-card:hover{box-shadow:0 8px 32px rgba(0,0,0,.2);transform:translateY(-2px);transition:all .3s ease}@media(max-width: 768px){.header-content{padding:1rem}.main-content{padding:0 1rem;margin:2rem auto}.prompt-card{padding:1.5rem}h1{font-size:2rem}.icon-button span{display:none}.icon-button{padding:.5rem}}",""]);const s=i},181:(e,t,a)=>{a.d(t,{A:()=>s});var r=a(540);const n=(...e)=>e.filter(((e,t,a)=>Boolean(e)&&""!==e.trim()&&a.indexOf(e)===t)).join(" ").trim();var o={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};const i=(0,r.forwardRef)((({color:e="currentColor",size:t=24,strokeWidth:a=2,absoluteStrokeWidth:i,className:s="",children:l,iconNode:d,...c},m)=>(0,r.createElement)("svg",{ref:m,...o,width:t,height:t,stroke:e,strokeWidth:i?24*Number(a)/Number(t):a,className:n("lucide",s),...c},[...d.map((([e,t])=>(0,r.createElement)(e,t))),...Array.isArray(l)?l:[l]]))),s=(e,t)=>{const a=(0,r.forwardRef)((({className:a,...o},s)=>{return(0,r.createElement)(i,{ref:s,iconNode:t,className:n(`lucide-${l=e,l.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,a),...o});var l}));return a.displayName=`${e}`,a}}}]);