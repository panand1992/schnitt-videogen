/*! For license information please see 450.main-bundle.js.LICENSE.txt */
"use strict";(self.webpackChunkschnitt_videogen=self.webpackChunkschnitt_videogen||[]).push([[450],{450:(e,r,t)=>{t.r(r),t.d(r,{default:()=>F});var a=t(540),o=t(556),n=t.n(o),i=t(468),s=t(508);const l=(...e)=>e.filter(((e,r,t)=>Boolean(e)&&""!==e.trim()&&t.indexOf(e)===r)).join(" ").trim();var c={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};const d=(0,a.forwardRef)((({color:e="currentColor",size:r=24,strokeWidth:t=2,absoluteStrokeWidth:o,className:n="",children:i,iconNode:s,...d},m)=>(0,a.createElement)("svg",{ref:m,...c,width:r,height:r,stroke:e,strokeWidth:o?24*Number(t)/Number(r):t,className:l("lucide",n),...d},[...s.map((([e,r])=>(0,a.createElement)(e,r))),...Array.isArray(i)?i:[i]]))),m=(e,r)=>{const t=(0,a.forwardRef)((({className:t,...o},n)=>{return(0,a.createElement)(d,{ref:n,iconNode:r,className:l(`lucide-${i=e,i.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,t),...o});var i}));return t.displayName=`${e}`,t},p=m("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]),u=m("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]),g=m("EyeOff",[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]),h=m("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);var b=t(72),f=t.n(b),w=t(825),k=t.n(w),y=t(659),v=t.n(y),E=t(56),x=t.n(E),N=t(159),A=t.n(N),L=t(113),z=t.n(L),M=t(299),S={};S.styleTagTransform=z(),S.setAttributes=x(),S.insert=v().bind(null,"head"),S.domAPI=k(),S.insertStyleElement=A(),f()(M.A,S),M.A&&M.A.locals&&M.A.locals;var C=t(582),j=t(933);const P=e=>{const{authLoading:r,userLogin:t}=e,[o,n]=(0,a.useState)(!1),[i,s]=(0,a.useState)({email:"",password:""}),[l,c]=(0,a.useState)({}),d=e=>{const{name:r,value:t}=e.target;s((e=>({...e,[r]:t}))),l[r]&&c((e=>({...e,[r]:""})))};return a.createElement("div",{className:"login-container"},a.createElement("div",{className:"login-card"},a.createElement("div",{className:"card-header"},a.createElement("h1",{className:"card-title"},"Welcome back"),a.createElement("p",{className:"card-description"},"Enter your email to sign in to your account")),a.createElement("div",{className:"card-content"},a.createElement("form",{onSubmit:e=>{e.preventDefault();const r={};i.email?/\S+@\S+\.\S+/.test(i.email)||(r.email="Please enter a valid email"):r.email="Email is required",i.password?i.password.length<6&&(r.password="Password must be at least 6 characters"):r.password="Password is required",c(r),0===Object.keys(r).length&&(console.log("Form submitted:",i),t(i))}},a.createElement("div",{className:"form-group"},a.createElement("label",{htmlFor:"email"},"Email"),a.createElement("div",{className:"input-wrapper"},a.createElement("input",{id:"email",name:"email",type:"email",placeholder:"m@example.com",className:l.email?"error":"",value:i.email,onChange:d}),a.createElement(p,{className:"input-icon"})),l.email&&a.createElement("p",{className:"error-message"},l.email)),a.createElement("div",{className:"form-group"},a.createElement("label",{htmlFor:"password"},"Password"),a.createElement("div",{className:"input-wrapper"},a.createElement("input",{id:"password",name:"password",type:o?"text":"password",className:l.password?"error":"",value:i.password,onChange:d}),a.createElement(u,{className:"input-icon"}),a.createElement("button",{type:"button",onClick:()=>n(!o),className:"toggle-password"},o?a.createElement(g,{className:"icon"}):a.createElement(h,{className:"icon"}))),l.password&&a.createElement("p",{className:"error-message"},l.password)),a.createElement("button",{type:"submit",className:"submit-button",disabled:r},"Sign in")))))};P.propTypes={authLoading:n().bool,errorMsg:n().string,updateAuthErrorMsg:n().func,userLogin:n().func};const W=(0,s.j8)({authLoading:(0,C.Fp)(),errorMsg:(0,C.y9)()}),F=(0,i.Ng)(W,(e=>({updateAuthErrorMsg:r=>e((e=>({type:j.Zu,data:e}))(r)),userLogin:r=>e((e=>({type:j.K,data:e}))(r))})))(P)},299:(e,r,t)=>{t.d(r,{A:()=>s});var a=t(601),o=t.n(a),n=t(314),i=t.n(n)()(o());i.push([e.id,'.login-container{min-height:100vh;display:flex;align-items:center;justify-content:center;background-color:#f9fafb;padding:1rem}.login-card{background:#fff;border-radius:8px;box-shadow:0 4px 6px rgba(0,0,0,.1);width:100%;max-width:400px;padding:2rem}.card-header{text-align:center;margin-bottom:2rem}.card-title{font-size:1.5rem;font-weight:700;color:#111827;margin:0 0 .5rem 0}.card-description{color:#6b7280;font-size:.875rem;margin:0}.form-group{margin-bottom:1.5rem}.form-group label{display:block;margin-bottom:.5rem;font-size:.875rem;font-weight:500;color:#374151}.input-wrapper{position:relative}.input-wrapper input{width:100%;padding:.75rem 2.5rem;border:1px solid #e5e7eb;border-radius:6px;font-size:.875rem;transition:border-color .2s,box-shadow .2s}.input-wrapper input:focus{outline:none;border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.1)}.input-wrapper input.error{border-color:#ef4444}.input-icon{position:absolute;left:.75rem;top:50%;transform:translateY(-50%);width:1.25rem;height:1.25rem;color:#9ca3af}.toggle-password{position:absolute;right:.75rem;top:50%;transform:translateY(-50%);background:none;border:none;padding:0;cursor:pointer;color:#9ca3af}.toggle-password:hover{color:#6b7280}.error-message{color:#ef4444;font-size:.75rem;margin-top:.5rem}.submit-button{width:100%;padding:.75rem;background-color:#2563eb;color:#fff;border:none;border-radius:6px;font-weight:500;cursor:pointer;transition:background-color .2s}.submit-button:hover{background-color:#1d4ed8}.card-footer{margin-top:2rem}.divider{display:flex;align-items:center;margin:1.5rem 0}.divider::before,.divider::after{content:"";flex:1;height:1px;background-color:#e5e7eb}.divider span{padding:0 1rem;color:#9ca3af;font-size:.875rem}.google-button{width:100%;padding:.75rem;background-color:#fff;color:#374151;border:1px solid #e5e7eb;border-radius:6px;font-weight:500;cursor:pointer;transition:background-color .2s}.google-button:hover{background-color:#f9fafb}@media(max-width: 640px){.login-card{padding:1.5rem}}',""]);const s=i}}]);