import{c as me,u as he,r as u,j as t,a as pe,H as ge}from"./app-673ZU3Du.js";import{i as xe,a as be,b as ve,c as je,d as we,e as ke,u as ye,A as Ne,E as _e,B as Ae,I as Se,U as Ce,S as Le,H as He,f as Ie,g as Ee,L as Re,h as Te,Q as Me,j as Ue,k as $e}from"./index-8VEh5rY8.js";import{i as Be,C as Pe,H as ze,A as De,a as Oe,b as qe,U as Ke,R as Ve}from"./index-DZOEDU4F.js";import{c as Fe,B as ce}from"./app-logo-icon-IvCFMmlk.js";import{C as re,a as de}from"./card-BNmOcOF9.js";import{I as Ge}from"./input-DZJgsu7B.js";import{b as Je,a as Qe,c as Xe,S as We,d as Ye}from"./select-CzkAZAdH.js";import{S as Ze}from"./separator-C6FrvbdT.js";import{A as et}from"./app-layout-C1t9Xi48.js";import{L as ue}from"./loader-circle-DfAsc_T8.js";import{M as tt}from"./minus-CGJVHNaS.js";/* empty css            */import"./index-C7yKKq-w.js";import"./index-Dlt35Fei.js";import"./index-u1UCtgql.js";import"./check-D8aEg8IR.js";import"./index-DWB8Zoa6.js";import"./index-BDqSilVs.js";const it=[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]],nt=Fe("Save",it);function at(e){const n=me.c(6),{onClick:d,isActive:s,disabled:g,title:l,children:h}=e,r=s===void 0?!1:s,o=g===void 0?!1:g,a=`inline-flex items-center justify-center rounded-md p-1.5 text-sm transition-colors disabled:opacity-40 ${r?"bg-[#1548d7]/10 text-[#1548d7] dark:bg-[#1548d7]/20 dark:text-[#6b93f5]":"text-muted-foreground hover:bg-muted hover:text-foreground"}`;let i;return n[0]!==h||n[1]!==o||n[2]!==d||n[3]!==a||n[4]!==l?(i=t.jsx("button",{type:"button",onClick:d,disabled:o,title:l,className:a,children:h}),n[0]=h,n[1]=o,n[2]=d,n[3]=a,n[4]=l,n[5]=i):i=n[5],i}function st({editor:e}){const n=u.useRef(null),[d,s]=u.useState(!1),g=u.useCallback(()=>{n.current?.click()},[]),l=u.useCallback(async o=>{const a=o.target.files?.[0];if(!a||!e)return;s(!0);const i=new FormData;i.append("image",a);try{const c=document.querySelector('meta[name="csrf-token"]')?.content??"",m=await fetch("/posts/upload-image",{method:"POST",headers:{"X-CSRF-TOKEN":c,Accept:"application/json"},body:i});if(!m.ok){const x=await m.text();console.error("Upload failed:",m.status,x);return}const D=await m.json();D.url&&e.chain().focus().setImage({src:D.url}).run()}catch(c){console.error("Image upload failed:",c)}finally{s(!1),n.current&&(n.current.value="")}},[e]),h=u.useCallback(()=>{if(!e)return;const o=e.getAttributes("link").href,a=window.prompt("Masukkan URL:",o);if(a!==null){if(a===""){e.chain().focus().extendMarkRange("link").unsetLink().run();return}e.chain().focus().extendMarkRange("link").setLink({href:a}).run()}},[e]);if(!e)return null;const r=[[{icon:t.jsx(Ae,{className:"h-4 w-4"}),title:"Bold",action:()=>e.chain().focus().toggleBold().run(),active:e.isActive("bold")},{icon:t.jsx(Se,{className:"h-4 w-4"}),title:"Italic",action:()=>e.chain().focus().toggleItalic().run(),active:e.isActive("italic")},{icon:t.jsx(Ce,{className:"h-4 w-4"}),title:"Underline",action:()=>e.chain().focus().toggleUnderline().run(),active:e.isActive("underline")},{icon:t.jsx(Le,{className:"h-4 w-4"}),title:"Strikethrough",action:()=>e.chain().focus().toggleStrike().run(),active:e.isActive("strike")},{icon:t.jsx(Pe,{className:"h-4 w-4"}),title:"Code",action:()=>e.chain().focus().toggleCode().run(),active:e.isActive("code")},{icon:t.jsx(He,{className:"h-4 w-4"}),title:"Highlight",action:()=>e.chain().focus().toggleHighlight().run(),active:e.isActive("highlight")}],[{icon:t.jsx(ze,{className:"h-4 w-4"}),title:"Heading 1",action:()=>e.chain().focus().toggleHeading({level:1}).run(),active:e.isActive("heading",{level:1})},{icon:t.jsx(Ie,{className:"h-4 w-4"}),title:"Heading 2",action:()=>e.chain().focus().toggleHeading({level:2}).run(),active:e.isActive("heading",{level:2})},{icon:t.jsx(Ee,{className:"h-4 w-4"}),title:"Heading 3",action:()=>e.chain().focus().toggleHeading({level:3}).run(),active:e.isActive("heading",{level:3})}],[{icon:t.jsx(Re,{className:"h-4 w-4"}),title:"Bullet List",action:()=>e.chain().focus().toggleBulletList().run(),active:e.isActive("bulletList")},{icon:t.jsx(Te,{className:"h-4 w-4"}),title:"Ordered List",action:()=>e.chain().focus().toggleOrderedList().run(),active:e.isActive("orderedList")},{icon:t.jsx(Me,{className:"h-4 w-4"}),title:"Blockquote",action:()=>e.chain().focus().toggleBlockquote().run(),active:e.isActive("blockquote")},{icon:t.jsx(tt,{className:"h-4 w-4"}),title:"Horizontal Rule",action:()=>e.chain().focus().setHorizontalRule().run(),active:!1}],[{icon:t.jsx(De,{className:"h-4 w-4"}),title:"Align Left",action:()=>e.chain().focus().setTextAlign("left").run(),active:e.isActive({textAlign:"left"})},{icon:t.jsx(Oe,{className:"h-4 w-4"}),title:"Align Center",action:()=>e.chain().focus().setTextAlign("center").run(),active:e.isActive({textAlign:"center"})},{icon:t.jsx(qe,{className:"h-4 w-4"}),title:"Align Right",action:()=>e.chain().focus().setTextAlign("right").run(),active:e.isActive({textAlign:"right"})}],[{icon:t.jsx(Ue,{className:"h-4 w-4"}),title:"Link",action:h,active:e.isActive("link")},{icon:d?t.jsx(ue,{className:"h-4 w-4 animate-spin"}):t.jsx($e,{className:"h-4 w-4"}),title:"Upload Gambar",action:g,active:!1}],[{icon:t.jsx(Ke,{className:"h-4 w-4"}),title:"Undo",action:()=>e.chain().focus().undo().run(),active:!1},{icon:t.jsx(Ve,{className:"h-4 w-4"}),title:"Redo",action:()=>e.chain().focus().redo().run(),active:!1}]];return t.jsxs("div",{className:"flex flex-wrap items-center gap-0.5 border-b bg-muted/30 px-3 py-2 dark:bg-muted/10",children:[r.map((o,a)=>t.jsxs("div",{className:"flex items-center",children:[a>0&&t.jsx(Ze,{orientation:"vertical",className:"mx-1.5 h-6"}),o.map((i,c)=>t.jsx(at,{onClick:i.action,isActive:i.active,title:i.title,children:i.icon},c))]},a)),t.jsx("input",{ref:n,type:"file",accept:"image/*",className:"hidden",onChange:l})]})}function St(){const e=me.c(83),{post:n,categories:d}=he().props,[s,g]=u.useState(n.title),[l,h]=u.useState(String(n.category_id)),[r,o]=u.useState(!1);let a;e[0]===Symbol.for("react.memo_cache_sentinel")?(a={},e[0]=a):a=e[0];const[i,c]=u.useState(a);let m;e[1]===Symbol.for("react.memo_cache_sentinel")?(m=[{title:"Dashboard",href:"/dashboard"},{title:"Posts",href:"/posts"},{title:"Edit Diskusi",href:"#"}],e[1]=m):m=e[1];const D=m;let x;e[2]===Symbol.for("react.memo_cache_sentinel")?(x=xe.configure({heading:{levels:[1,2,3]}}),e[2]=x):x=e[2];let O;e[3]===Symbol.for("react.memo_cache_sentinel")?(O=[x,be,ve.configure({multicolor:!1}),Be.configure({types:["heading","paragraph"]}),je.configure({openOnClick:!1,HTMLAttributes:{class:"text-[#1548d7] dark:text-[#6b93f5] underline cursor-pointer"}}),we.configure({HTMLAttributes:{class:"rounded-lg max-w-full mx-auto my-4 shadow-sm"},allowBase64:!1}),ke.configure({placeholder:"Mulai tulis diskusi Anda di sini..."})],e[3]=O):O=e[3];let q;e[4]===Symbol.for("react.memo_cache_sentinel")?(q={attributes:{class:"prose prose-neutral dark:prose-invert max-w-none min-h-[400px] px-6 py-4 focus:outline-none text-[15px] leading-[1.8]"}},e[4]=q):q=e[4];let K;e[5]!==n.content?(K={extensions:O,content:n.content,editorProps:q},e[5]=n.content,e[6]=K):K=e[6];const f=ye(K);let V;e[7]!==l||e[8]!==f||e[9]!==n.id||e[10]!==s?(V=()=>{if(!f)return;const p=f.getHTML(),z={};if(s.trim()||(z.title="Judul wajib diisi."),l||(z.category_id="Kategori wajib dipilih."),(!p||p==="<p></p>")&&(z.content="Konten wajib diisi."),Object.keys(z).length>0){c(z);return}c({}),o(!0),pe.put(`/posts/${n.id}`,{title:s.trim(),category_id:l,content:p},{onError:fe=>{c(fe),o(!1)},onFinish:()=>o(!1)})},e[7]=l,e[8]=f,e[9]=n.id,e[10]=s,e[11]=V):V=e[11];const ie=V;let F;e[12]===Symbol.for("react.memo_cache_sentinel")?(F=t.jsx(ge,{title:"Edit Diskusi"}),e[12]=F):F=e[12];let G,J;e[13]===Symbol.for("react.memo_cache_sentinel")?(G=t.jsx("div",{className:"absolute -top-20 -right-20 h-56 w-56 rounded-full bg-white/5"}),J=t.jsx("div",{className:"absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-white/5"}),e[13]=G,e[14]=J):(G=e[13],J=e[14]);const ne=`/posts/${n.id}`;let Q;e[15]===Symbol.for("react.memo_cache_sentinel")?(Q=t.jsx(Ne,{className:"mr-1.5 h-4 w-4"}),e[15]=Q):Q=e[15];let b;e[16]!==ne?(b=t.jsx(ce,{variant:"ghost",size:"sm",className:"mb-4 text-white/70 hover:text-white hover:bg-white/10",asChild:!0,children:t.jsxs("a",{href:ne,children:[Q,"Kembali ke Diskusi"]})}),e[16]=ne,e[17]=b):b=e[17];let X,W;e[18]===Symbol.for("react.memo_cache_sentinel")?(X=t.jsx("h1",{className:"text-xl md:text-2xl font-bold text-white",children:"Edit Diskusi"}),W=t.jsx("p",{className:"text-sm text-white/60 mt-1",children:"Perbarui konten diskusi Anda"}),e[18]=X,e[19]=W):(X=e[18],W=e[19]);let v;e[20]!==b?(v=t.jsxs("div",{className:"relative overflow-hidden bg-linear-to-br from-[#1548d7] via-[#1d5aef] to-[#3b6ef5]",children:[G,J,t.jsxs("div",{className:"relative mx-auto max-w-4xl px-4 py-6 md:px-6 md:py-8",children:[b,X,W]})]}),e[20]=b,e[21]=v):v=e[21];let j;e[22]!==i.title?(j=p=>{g(p.target.value),i.title&&c(rt)},e[22]=i.title,e[23]=j):j=e[23];const ae=`border-0 bg-transparent text-xl md:text-2xl font-bold placeholder:text-muted-foreground/40 focus-visible:ring-0 shadow-none px-0 h-auto py-2 ${i.title?"ring-1 ring-destructive rounded-md px-3":""}`;let w;e[24]!==j||e[25]!==ae||e[26]!==s?(w=t.jsx(Ge,{placeholder:"Judul diskusi...",value:s,onChange:j,className:ae}),e[24]=j,e[25]=ae,e[26]=s,e[27]=w):w=e[27];let k;e[28]!==i.title?(k=i.title&&t.jsx("p",{className:"text-xs text-destructive mt-1",children:i.title}),e[28]=i.title,e[29]=k):k=e[29];let y;e[30]!==w||e[31]!==k?(y=t.jsxs("div",{children:[w,k]}),e[30]=w,e[31]=k,e[32]=y):y=e[32];let N;e[33]!==i.category_id?(N=p=>{h(p),i.category_id&&c(ot)},e[33]=i.category_id,e[34]=N):N=e[34];const se=i.category_id?"ring-1 ring-destructive":"";let Y;e[35]===Symbol.for("react.memo_cache_sentinel")?(Y=t.jsx(Je,{placeholder:"Pilih Kategori"}),e[35]=Y):Y=e[35];let _;e[36]!==se?(_=t.jsx(Qe,{className:se,children:Y}),e[36]=se,e[37]=_):_=e[37];let A;e[38]!==d?(A=d.map(lt),e[38]=d,e[39]=A):A=e[39];let S;e[40]!==A?(S=t.jsx(Xe,{children:A}),e[40]=A,e[41]=S):S=e[41];let C;e[42]!==l||e[43]!==N||e[44]!==_||e[45]!==S?(C=t.jsxs(We,{value:l,onValueChange:N,children:[_,S]}),e[42]=l,e[43]=N,e[44]=_,e[45]=S,e[46]=C):C=e[46];let L;e[47]!==i.category_id?(L=i.category_id&&t.jsx("p",{className:"text-xs text-destructive mt-1",children:i.category_id}),e[47]=i.category_id,e[48]=L):L=e[48];let H;e[49]!==C||e[50]!==L?(H=t.jsx("div",{className:"flex items-center gap-3 flex-wrap",children:t.jsxs("div",{className:"flex-1 min-w-[200px]",children:[C,L]})}),e[49]=C,e[50]=L,e[51]=H):H=e[51];let I;e[52]!==y||e[53]!==H?(I=t.jsx(re,{className:"border-0 shadow-lg overflow-hidden",children:t.jsxs(de,{className:"p-5 md:p-6 space-y-4",children:[y,H]})}),e[52]=y,e[53]=H,e[54]=I):I=e[54];const le=`border-0 shadow-lg overflow-hidden ${i.content?"ring-1 ring-destructive":""}`;let E,R;e[55]!==f?(E=t.jsx(st,{editor:f}),R=t.jsx(_e,{editor:f}),e[55]=f,e[56]=E,e[57]=R):(E=e[56],R=e[57]);let T;e[58]!==i.content?(T=i.content&&t.jsx("div",{className:"px-5 pb-3",children:t.jsx("p",{className:"text-xs text-destructive",children:i.content})}),e[58]=i.content,e[59]=T):T=e[59];let M;e[60]!==le||e[61]!==E||e[62]!==R||e[63]!==T?(M=t.jsxs(re,{className:le,children:[E,R,T]}),e[60]=le,e[61]=E,e[62]=R,e[63]=T,e[64]=M):M=e[64];let Z;e[65]===Symbol.for("react.memo_cache_sentinel")?(Z=t.jsx("p",{className:"text-xs text-muted-foreground",children:"Tips: Gunakan toolbar di atas untuk memformat teks, menambahkan gambar, link, dan lainnya."}),e[65]=Z):Z=e[65];let U;e[66]!==r?(U=r?t.jsx(ue,{className:"mr-2 h-4 w-4 animate-spin"}):t.jsx(nt,{className:"mr-2 h-4 w-4"}),e[66]=r,e[67]=U):U=e[67];const oe=r?"Menyimpan...":"Simpan Perubahan";let $;e[68]!==ie||e[69]!==r||e[70]!==U||e[71]!==oe?($=t.jsx(re,{className:"border-0 shadow-lg",children:t.jsxs(de,{className:"p-4 flex items-center justify-between",children:[Z,t.jsxs(ce,{className:"bg-[#1548d7] hover:bg-[#1237b0] text-white shadow-md",onClick:ie,disabled:r,children:[U,oe]})]})}),e[68]=ie,e[69]=r,e[70]=U,e[71]=oe,e[72]=$):$=e[72];let B;e[73]!==I||e[74]!==M||e[75]!==$?(B=t.jsxs("div",{className:"mx-auto w-full max-w-4xl px-4 md:px-6 py-6 flex flex-col gap-5",children:[I,M,$]}),e[73]=I,e[74]=M,e[75]=$,e[76]=B):B=e[76];let P;e[77]!==v||e[78]!==B?(P=t.jsxs("div",{className:"flex flex-col gap-0",children:[v,B]}),e[77]=v,e[78]=B,e[79]=P):P=e[79];let ee;e[80]===Symbol.for("react.memo_cache_sentinel")?(ee=t.jsx("style",{children:`
                .tiptap p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: var(--muted-foreground);
                    opacity: 0.4;
                    pointer-events: none;
                    height: 0;
                }
                .tiptap {
                    min-height: 400px;
                }
                .tiptap img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.5rem;
                    margin: 1rem auto;
                    display: block;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                .tiptap img.ProseMirror-selectednode {
                    outline: 2px solid #1548d7;
                    outline-offset: 2px;
                    border-radius: 0.5rem;
                }
                .tiptap blockquote {
                    border-left: 3px solid #1548d7;
                    padding-left: 1rem;
                    font-style: italic;
                    color: var(--muted-foreground);
                }
                .tiptap pre {
                    background: var(--muted);
                    border-radius: 0.5rem;
                    padding: 1rem;
                    font-family: monospace;
                    overflow-x: auto;
                }
                .tiptap mark {
                    background-color: #fef08a;
                    border-radius: 0.125rem;
                    padding: 0.125rem 0.25rem;
                }
                .dark .tiptap mark {
                    background-color: #854d0e;
                    color: #fef9c3;
                }
                .tiptap hr {
                    border: none;
                    border-top: 2px solid var(--border);
                    margin: 1.5rem 0;
                }
                .tiptap a {
                    color: #1548d7;
                    text-decoration: underline;
                    cursor: pointer;
                }
                .dark .tiptap a {
                    color: #6b93f5;
                }
                .tiptap ul, .tiptap ol {
                    padding-left: 1.5rem;
                }
                .tiptap h1 {
                    font-size: 1.875rem;
                    font-weight: 700;
                    line-height: 1.3;
                    margin-top: 1.5rem;
                    margin-bottom: 0.75rem;
                }
                .tiptap h2 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    line-height: 1.3;
                    margin-top: 1.25rem;
                    margin-bottom: 0.5rem;
                }
                .tiptap h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    line-height: 1.4;
                    margin-top: 1rem;
                    margin-bottom: 0.5rem;
                }
            `}),e[80]=ee):ee=e[80];let te;return e[81]!==P?(te=t.jsxs(et,{breadcrumbs:D,children:[F,P,ee]}),e[81]=P,e[82]=te):te=e[82],te}function lt(e){return t.jsx(Ye,{value:String(e.id),children:e.name},e.id)}function ot(e){return{...e,category_id:""}}function rt(e){return{...e,title:""}}export{St as default};
