import{c as Z,u as ie,r as m,j as t,a as ae,H as ne}from"./app-Bcy3w5q3.js";import{i as se,a as le,b as oe,c as re,d as ce,e as de,u as ue,A as me,E as fe,B as he,I as ge,U as pe,S as xe,H as be,f as ve,g as je,L as we,h as ke,Q as Ne,j as ye,k as Ae}from"./index-CBgBpuKl.js";import{i as _e,C as Se,H as Ce,A as Le,a as He,b as Be,U as Ie,R as Re}from"./index-NxdXHCaO.js";import{B as W}from"./app-logo-icon-BVi2jwBU.js";import{a as Y}from"./card-Cn8sJMh6.js";import{I as Te}from"./input-DIoMC04T.js";import{b as Ue,a as Ee,c as Me,S as $e,d as Pe}from"./select-DiOCxcjB.js";import{A as ze,S as De}from"./app-layout-CEAfMjoY.js";import{L as ee}from"./loader-circle-BjZxT_Yf.js";import{S as Oe}from"./send-CLAH-lNs.js";import{M as qe}from"./minus-DHLE6cv0.js";/* empty css            */import"./index-C7yKKq-w.js";import"./index-BZw_4-7P.js";import"./index-D6B8Kxfg.js";import"./check-b32_Vbni.js";import"./index-C6Aeq5NZ.js";import"./index-BDqSilVs.js";const Ke=[{title:"Dashboard",href:"/dashboard"},{title:"Posts",href:"/posts"},{title:"Buat Diskusi",href:"#"}];function Fe(e){const a=Z.c(6),{onClick:l,isActive:f,disabled:r,title:h,children:o}=e,g=f===void 0?!1:f,s=r===void 0?!1:r,i=`inline-flex items-center justify-center rounded-md p-1.5 text-sm transition-colors disabled:opacity-40 ${g?"bg-[#1548d7]/10 text-[#1548d7] dark:bg-[#1548d7]/20 dark:text-[#6b93f5]":"text-muted-foreground hover:bg-muted hover:text-foreground"}`;let n;return a[0]!==o||a[1]!==s||a[2]!==l||a[3]!==i||a[4]!==h?(n=t.jsx("button",{type:"button",onClick:l,disabled:s,title:h,className:i,children:o}),a[0]=o,a[1]=s,a[2]=l,a[3]=i,a[4]=h,a[5]=n):n=a[5],n}function Ge({editor:e}){const a=m.useRef(null),[l,f]=m.useState(!1),r=m.useCallback(()=>{a.current?.click()},[]),h=m.useCallback(async s=>{const i=s.target.files?.[0];if(!i||!e)return;f(!0);const n=new FormData;n.append("image",i);try{const d=document.querySelector('meta[name="csrf-token"]')?.content??"",u=await fetch("/posts/upload-image",{method:"POST",headers:{"X-CSRF-TOKEN":d,Accept:"application/json"},body:n});if(!u.ok){const x=await u.text();console.error("Upload failed:",u.status,x);return}const c=await u.json();c.url&&e.chain().focus().setImage({src:c.url}).run()}catch(d){console.error("Image upload failed:",d)}finally{f(!1),a.current&&(a.current.value="")}},[e]),o=m.useCallback(()=>{if(!e)return;const s=e.getAttributes("link").href,i=window.prompt("Masukkan URL:",s);if(i!==null){if(i===""){e.chain().focus().extendMarkRange("link").unsetLink().run();return}e.chain().focus().extendMarkRange("link").setLink({href:i}).run()}},[e]);if(!e)return null;const g=[[{icon:t.jsx(he,{className:"h-4 w-4"}),title:"Bold",action:()=>e.chain().focus().toggleBold().run(),active:e.isActive("bold")},{icon:t.jsx(ge,{className:"h-4 w-4"}),title:"Italic",action:()=>e.chain().focus().toggleItalic().run(),active:e.isActive("italic")},{icon:t.jsx(pe,{className:"h-4 w-4"}),title:"Underline",action:()=>e.chain().focus().toggleUnderline().run(),active:e.isActive("underline")},{icon:t.jsx(xe,{className:"h-4 w-4"}),title:"Strikethrough",action:()=>e.chain().focus().toggleStrike().run(),active:e.isActive("strike")},{icon:t.jsx(Se,{className:"h-4 w-4"}),title:"Code",action:()=>e.chain().focus().toggleCode().run(),active:e.isActive("code")},{icon:t.jsx(be,{className:"h-4 w-4"}),title:"Highlight",action:()=>e.chain().focus().toggleHighlight().run(),active:e.isActive("highlight")}],[{icon:t.jsx(Ce,{className:"h-4 w-4"}),title:"Heading 1",action:()=>e.chain().focus().toggleHeading({level:1}).run(),active:e.isActive("heading",{level:1})},{icon:t.jsx(ve,{className:"h-4 w-4"}),title:"Heading 2",action:()=>e.chain().focus().toggleHeading({level:2}).run(),active:e.isActive("heading",{level:2})},{icon:t.jsx(je,{className:"h-4 w-4"}),title:"Heading 3",action:()=>e.chain().focus().toggleHeading({level:3}).run(),active:e.isActive("heading",{level:3})}],[{icon:t.jsx(we,{className:"h-4 w-4"}),title:"Bullet List",action:()=>e.chain().focus().toggleBulletList().run(),active:e.isActive("bulletList")},{icon:t.jsx(ke,{className:"h-4 w-4"}),title:"Ordered List",action:()=>e.chain().focus().toggleOrderedList().run(),active:e.isActive("orderedList")},{icon:t.jsx(Ne,{className:"h-4 w-4"}),title:"Blockquote",action:()=>e.chain().focus().toggleBlockquote().run(),active:e.isActive("blockquote")},{icon:t.jsx(qe,{className:"h-4 w-4"}),title:"Horizontal Rule",action:()=>e.chain().focus().setHorizontalRule().run(),active:!1}],[{icon:t.jsx(Le,{className:"h-4 w-4"}),title:"Align Left",action:()=>e.chain().focus().setTextAlign("left").run(),active:e.isActive({textAlign:"left"})},{icon:t.jsx(He,{className:"h-4 w-4"}),title:"Align Center",action:()=>e.chain().focus().setTextAlign("center").run(),active:e.isActive({textAlign:"center"})},{icon:t.jsx(Be,{className:"h-4 w-4"}),title:"Align Right",action:()=>e.chain().focus().setTextAlign("right").run(),active:e.isActive({textAlign:"right"})}],[{icon:t.jsx(ye,{className:"h-4 w-4"}),title:"Link",action:o,active:e.isActive("link")},{icon:l?t.jsx(ee,{className:"h-4 w-4 animate-spin"}):t.jsx(Ae,{className:"h-4 w-4"}),title:"Upload Gambar",action:r,active:!1}],[{icon:t.jsx(Ie,{className:"h-4 w-4"}),title:"Undo",action:()=>e.chain().focus().undo().run(),active:!1},{icon:t.jsx(Re,{className:"h-4 w-4"}),title:"Redo",action:()=>e.chain().focus().redo().run(),active:!1}]];return t.jsxs("div",{className:"flex flex-wrap items-center gap-0.5 border-b bg-muted/30 px-3 py-2 dark:bg-muted/10",children:[g.map((s,i)=>t.jsxs("div",{className:"flex items-center",children:[i>0&&t.jsx(De,{orientation:"vertical",className:"mx-1.5 h-6"}),s.map((n,d)=>t.jsx(Fe,{onClick:n.action,isActive:n.active,title:n.title,children:n.icon},d))]},i)),t.jsx("input",{ref:a,type:"file",accept:"image/*",className:"hidden",onChange:h})]})}function ht(){const e=Z.c(69),{categories:a}=ie().props,[l,f]=m.useState(""),[r,h]=m.useState(""),[o,g]=m.useState(!1);let s;e[0]===Symbol.for("react.memo_cache_sentinel")?(s={},e[0]=s):s=e[0];const[i,n]=m.useState(s);let d;e[1]===Symbol.for("react.memo_cache_sentinel")?(d=se.configure({heading:{levels:[1,2,3]}}),e[1]=d):d=e[1];let u;e[2]===Symbol.for("react.memo_cache_sentinel")?(u={extensions:[d,le,oe.configure({multicolor:!1}),_e.configure({types:["heading","paragraph"]}),re.configure({openOnClick:!1,HTMLAttributes:{class:"text-[#1548d7] dark:text-[#6b93f5] underline cursor-pointer"}}),ce.configure({HTMLAttributes:{class:"rounded-lg max-w-full mx-auto my-4 shadow-sm"},allowBase64:!1}),de.configure({placeholder:"Mulai tulis diskusi Anda di sini..."})],editorProps:{attributes:{class:"prose prose-neutral dark:prose-invert max-w-none min-h-[400px] px-6 py-4 focus:outline-none text-[15px] leading-[1.8]"}}},e[2]=u):u=e[2];const c=ue(u);let x;e[3]!==r||e[4]!==c||e[5]!==l?(x=()=>{if(!c)return;const p=c.getHTML(),M={};if(l.trim()||(M.title="Judul wajib diisi."),r||(M.category_id="Kategori wajib dipilih."),(!p||p==="<p></p>")&&(M.content="Konten wajib diisi."),Object.keys(M).length>0){n(M);return}n({}),g(!0),ae.post("/posts",{title:l.trim(),category_id:r,content:p},{onError:te=>{n(te),g(!1)},onFinish:()=>g(!1)})},e[3]=r,e[4]=c,e[5]=l,e[6]=x):x=e[6];const G=x;let $;e[7]===Symbol.for("react.memo_cache_sentinel")?($=t.jsx(ne,{title:"Buat Diskusi Baru"}),e[7]=$):$=e[7];let P,z;e[8]===Symbol.for("react.memo_cache_sentinel")?(P=t.jsx("div",{className:"absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-2xl"}),z=t.jsx("div",{className:"absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-2xl"}),e[8]=P,e[9]=z):(P=e[8],z=e[9]);let D;e[10]===Symbol.for("react.memo_cache_sentinel")?(D=t.jsxs("div",{className:"relative overflow-hidden rounded-2xl bg-linear-to-br from-[#1548d7] via-[#1d5aef] to-[#3b6ef5] p-6 md:p-8 text-white shadow-xl",children:[P,z,t.jsxs("div",{className:"relative z-10",children:[t.jsx(W,{variant:"ghost",size:"sm",className:"mb-4 text-white/70 hover:text-white hover:bg-white/10",asChild:!0,children:t.jsxs("a",{href:"/posts",children:[t.jsx(me,{className:"mr-1.5 h-4 w-4"}),"Kembali ke Diskusi"]})}),t.jsx("h1",{className:"text-xl md:text-2xl font-bold text-white",children:"Buat Diskusi Baru"}),t.jsx("p",{className:"text-sm text-white/60 mt-1",children:"Bagikan pengetahuan dan pengalaman klinis Anda dengan rekan sejawat"})]})]}),e[10]=D):D=e[10];let b;e[11]!==i.title?(b=p=>{f(p.target.value),i.title&&n(Ve)},e[11]=i.title,e[12]=b):b=e[12];const J=`border-0 bg-transparent text-xl md:text-2xl font-bold placeholder:text-muted-foreground/40 focus-visible:ring-0 shadow-none px-0 h-auto py-2 ${i.title?"ring-1 ring-destructive rounded-md px-3":""}`;let v;e[13]!==b||e[14]!==J||e[15]!==l?(v=t.jsx(Te,{placeholder:"Judul diskusi...",value:l,onChange:b,className:J}),e[13]=b,e[14]=J,e[15]=l,e[16]=v):v=e[16];let j;e[17]!==i.title?(j=i.title&&t.jsx("p",{className:"text-xs text-destructive mt-1",children:i.title}),e[17]=i.title,e[18]=j):j=e[18];let w;e[19]!==v||e[20]!==j?(w=t.jsxs("div",{children:[v,j]}),e[19]=v,e[20]=j,e[21]=w):w=e[21];let k;e[22]!==i.category_id?(k=p=>{h(p),i.category_id&&n(Qe)},e[22]=i.category_id,e[23]=k):k=e[23];const Q=i.category_id?"ring-1 ring-destructive":"";let O;e[24]===Symbol.for("react.memo_cache_sentinel")?(O=t.jsx(Ue,{placeholder:"Pilih Kategori"}),e[24]=O):O=e[24];let N;e[25]!==Q?(N=t.jsx(Ee,{className:Q,children:O}),e[25]=Q,e[26]=N):N=e[26];let y;e[27]!==a?(y=a.map(Je),e[27]=a,e[28]=y):y=e[28];let A;e[29]!==y?(A=t.jsx(Me,{children:y}),e[29]=y,e[30]=A):A=e[30];let _;e[31]!==r||e[32]!==k||e[33]!==N||e[34]!==A?(_=t.jsxs($e,{value:r,onValueChange:k,children:[N,A]}),e[31]=r,e[32]=k,e[33]=N,e[34]=A,e[35]=_):_=e[35];let S;e[36]!==i.category_id?(S=i.category_id&&t.jsx("p",{className:"text-xs text-destructive mt-1",children:i.category_id}),e[36]=i.category_id,e[37]=S):S=e[37];let C;e[38]!==_||e[39]!==S?(C=t.jsx("div",{className:"flex items-center gap-3 flex-wrap",children:t.jsxs("div",{className:"flex-1 min-w-[200px]",children:[_,S]})}),e[38]=_,e[39]=S,e[40]=C):C=e[40];let L;e[41]!==w||e[42]!==C?(L=t.jsxs(Y,{className:"p-5 md:p-6 space-y-4",children:[w,C]}),e[41]=w,e[42]=C,e[43]=L):L=e[43];const V=`border-1 shadow-sm overflow-hidden ${i.content?"ring-1 ring-destructive":""}`;let H,B;e[44]!==c?(H=t.jsx(Ge,{editor:c}),B=t.jsx(fe,{editor:c}),e[44]=c,e[45]=H,e[46]=B):(H=e[45],B=e[46]);let I;e[47]!==i.content?(I=i.content&&t.jsx("div",{className:"px-5 pb-3",children:t.jsx("p",{className:"text-xs text-destructive",children:i.content})}),e[47]=i.content,e[48]=I):I=e[48];let R;e[49]!==V||e[50]!==H||e[51]!==B||e[52]!==I?(R=t.jsxs("div",{className:V,children:[H,B,I]}),e[49]=V,e[50]=H,e[51]=B,e[52]=I,e[53]=R):R=e[53];let q;e[54]===Symbol.for("react.memo_cache_sentinel")?(q=t.jsx("p",{className:"text-xs text-muted-foreground",children:"Tips: Gunakan toolbar di atas untuk memformat teks, menambahkan gambar, link, dan lainnya."}),e[54]=q):q=e[54];let T;e[55]!==o?(T=o?t.jsx(ee,{className:"mr-2 h-4 w-4 animate-spin"}):t.jsx(Oe,{className:"mr-2 h-4 w-4"}),e[55]=o,e[56]=T):T=e[56];const X=o?"Mengirim...":"Publikasikan";let U;e[57]!==G||e[58]!==o||e[59]!==T||e[60]!==X?(U=t.jsxs(Y,{className:"p-4 flex items-center justify-between",children:[q,t.jsxs(W,{className:"bg-[#1548d7] hover:bg-[#1237b0] text-white shadow-md cursor-pointer disabled:cursor-not-allowed disabled:bg-[#1548d7]/80 disabled:hover:bg-[#1548d7]/80",onClick:G,disabled:o,children:[T,X]})]}),e[57]=G,e[58]=o,e[59]=T,e[60]=X,e[61]=U):U=e[61];let E;e[62]!==L||e[63]!==R||e[64]!==U?(E=t.jsxs("div",{className:"flex flex-col gap-6 p-4 md:p-6",children:[D,t.jsxs("div",{className:"mx-auto w-full max-w-4xl flex flex-col gap-5",children:[L,R,U]})]}),e[62]=L,e[63]=R,e[64]=U,e[65]=E):E=e[65];let K;e[66]===Symbol.for("react.memo_cache_sentinel")?(K=t.jsx("style",{children:`
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
            `}),e[66]=K):K=e[66];let F;return e[67]!==E?(F=t.jsxs(ze,{breadcrumbs:Ke,children:[$,E,K]}),e[67]=E,e[68]=F):F=e[68],F}function Je(e){return t.jsx(Pe,{value:String(e.id),children:e.name},e.id)}function Qe(e){return{...e,category_id:""}}function Ve(e){return{...e,title:""}}export{ht as default};
