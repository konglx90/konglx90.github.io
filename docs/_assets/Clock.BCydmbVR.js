import{r as c}from"./index.DBy5LfQW.js";var l={exports:{}},n={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var x;function v(){if(x)return n;x=1;var e=Symbol.for("react.transitional.element"),s=Symbol.for("react.fragment");function u(i,t,r){var a=null;if(r!==void 0&&(a=""+r),t.key!==void 0&&(a=""+t.key),"key"in t){r={};for(var o in t)o!=="key"&&(r[o]=t[o])}else r=t;return t=r.ref,{$$typeof:e,type:i,key:a,ref:t!==void 0?t:null,props:r}}return n.Fragment=s,n.jsx=u,n.jsxs=u,n}var d;function R(){return d||(d=1,l.exports=v()),l.exports}var p=R();function m(){const[e,s]=c.useState(null);if(c.useEffect(()=>{s(new Date);const r=setInterval(()=>s(new Date),1e3);return()=>clearInterval(r)},[]),!e)return null;const u=String(e.getHours()).padStart(2,"0"),i=String(e.getMinutes()).padStart(2,"0"),t=String(e.getSeconds()).padStart(2,"0");return p.jsx("div",{className:"fixed-clock",children:p.jsxs("span",{className:"clock-time",children:[u,":",i,":",t]})})}export{m as default};
