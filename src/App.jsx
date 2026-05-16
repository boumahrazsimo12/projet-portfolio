/**
 * Mohamed Boumahraz — Portfolio
 * Single-file React component
 * Contact form: saves to localStorage + opens mailto as fallback
 */
import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

const HERO_PHOTO = new URL("../photo_boumahraz.jpg", import.meta.url).href;

// ─── Theme Context ───────────────────────────────────────────────────────────
const ThemeCtx = createContext();
const useTheme = () => useContext(ThemeCtx);

// ─── Data ────────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: "01",
    title: "Programming Language\nEducation Platform",
    category: "E-Learning · Full Stack",
    desc: "An interactive educational platform for learning programming languages. Features course management, user authentication, quizzes (QCM), and a REST API. Built during internship at Société BHA.",
    tech: ["React", "Laravel", "MySQL", "REST API"],
    color: "#5B8DEF",
    github: "https://github.com/o-elmhidi/beta_version",
    demo: null,
  },
  {
    id: "02",
    title: "Travel & Tourism\nManagement Platform",
    category: "Tourism · Full Stack",
    desc: "A full-featured web application for organizing and reserving group travel packages. Handles itinerary management, booking workflows, and dynamic content — currently under active development.",
    tech: ["React", "Laravel", "MongoDB"],
    color: "#2EC490",
    github: "https://github.com/boumahrazsimo12/Project-travlling",
    demo: null,
  },
];

const SKILLS = [
  {
    cat: "Frontend",
    icon: "◈",
    color: "#5B8DEF",
    items: ["React.js / Next.js", "JavaScript ES6+", "HTML5 & CSS3", "Tailwind CSS"],
  },
  {
    cat: "Backend",
    icon: "◉",
    color: "#2EC490",
    items: ["PHP & Laravel", "Node.js & Express", "REST API & GraphQL", "Python / Django"],
  },
  {
    cat: "Databases",
    icon: "◎",
    color: "#D4A853",
    items: ["MySQL / PostgreSQL", "MongoDB", "Redis", "Prisma ORM"],
  },
  {
    cat: "DevOps & Tools",
    icon: "◇",
    color: "#B47AFF",
    items: ["Docker & Linux", "Git & GitHub CI/CD", "Figma & Postman", "AWS / Vercel"],
  },
];

const NAV = ["Home", "About", "Skills", "Projects", "Contact"];

// ─── CSS injection ────────────────────────────────────────────────────────────
const CSS = (dark) => `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:      ${dark ? "#080A10" : "#F5F3EE"};
    --bg2:     ${dark ? "#0D0F18" : "#ECEAE4"};
    --bg3:     ${dark ? "#13161F" : "#E2DED5"};
    --surf:    ${dark ? "#181C28" : "#D8D3C8"};
    --bdr:     ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"};
    --bdr2:    ${dark ? "rgba(255,255,255,0.11)" : "rgba(0,0,0,0.13)"};
    --text:    ${dark ? "#EAE6DC" : "#18160E"};
    --text2:   ${dark ? "#888480" : "#5A5650"};
    --text3:   ${dark ? "#46443C" : "#9A9890"};
    --gold:    #C9A44A;
    --gold2:   #E0BF7A;
    --gold3:   #F0D9A4;
    --glow:    rgba(201,164,74,0.14);
    --glow2:   rgba(201,164,74,0.06);
    --green:   #2EC490;
    --fh:      'Playfair Display', Georgia, serif;
    --fb:      'DM Sans', system-ui, sans-serif;
    --r:       10px; --r2: 18px;
  }
  html { scroll-behavior: smooth; font-size: 16px; }
  body { font-family: var(--fb); background: var(--bg); color: var(--text); -webkit-font-smoothing: antialiased; overflow-x: hidden; transition: background .35s, color .35s; }
  ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-track { background: var(--bg); } ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 2px; }
  ::selection { background: rgba(201,164,74,.22); }

  /* scroll bar */
  #sp { position:fixed; top:0; left:0; height:2px; z-index:999; background:linear-gradient(90deg,var(--gold),var(--gold3)); transition:width .07s linear; }

  /* cursor */
  @media(pointer:fine) { body,a,button,[data-c] { cursor:none !important; } }
  .cd { position:fixed; width:5px; height:5px; border-radius:50%; background:var(--gold); pointer-events:none; z-index:9999; transform:translate(-50%,-50%); }
  .cr { position:fixed; width:30px; height:30px; border-radius:50%; border:1px solid rgba(201,164,74,.5); pointer-events:none; z-index:9998; transform:translate(-50%,-50%); transition:width .2s,height .2s,border-color .2s; }
  .cr.h { width:48px; height:48px; border-color:rgba(201,164,74,.9); }

  /* keyframes */
  @keyframes fu { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:none} }
  @keyframes fi { from{opacity:0} to{opacity:1} }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes pdot { 0%,100%{box-shadow:0 0 0 0 rgba(46,196,144,.55)} 60%{box-shadow:0 0 0 7px rgba(46,196,144,0)} }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes fl1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
  @keyframes mq { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes pop { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }

  /* loader */
  #ldr { position:fixed; inset:0; background:var(--bg); z-index:8000; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:1.8rem; transition:opacity .65s,visibility .65s; }
  #ldr.out { opacity:0; visibility:hidden; pointer-events:none; }
  .ll { font-family:var(--fh); font-weight:700; font-size:2.2rem; letter-spacing:-.04em; }
  .ll span { color:var(--gold); }
  .lt { width:160px; height:1px; background:var(--bdr2); position:relative; overflow:hidden; }
  .lf { position:absolute; top:0; left:0; height:100%; background:linear-gradient(90deg,var(--gold),var(--gold3)); transition:width .1s; }

  /* nav */
  #nav { position:fixed; top:0; left:0; right:0; height:60px; z-index:500; padding:0 clamp(1.5rem,5vw,3rem); display:flex; align-items:center; transition:background .3s,border .3s,backdrop-filter .3s; }
  #nav.sc { background:${dark ? "rgba(8,10,16,.9)" : "rgba(245,243,238,.9)"}; border-bottom:1px solid var(--bdr); backdrop-filter:blur(20px); }
  .ni { max-width:1140px; margin:0 auto; width:100%; display:flex; align-items:center; justify-content:space-between; }
  .nl { font-family:var(--fh); font-weight:700; font-size:1.35rem; letter-spacing:-.04em; color:var(--text); text-decoration:none; }
  .nl span { color:var(--gold); }
  .nm { display:flex; gap:2.4rem; list-style:none; }
  .nm a { font-size:.82rem; color:var(--text2); text-decoration:none; letter-spacing:.01em; transition:color .2s; position:relative; }
  .nm a::after { content:''; position:absolute; bottom:-3px; left:0; width:0; height:1px; background:var(--gold); transition:width .22s; }
  .nm a:hover { color:var(--text); } .nm a:hover::after { width:100%; }
  .nr { display:flex; gap:.6rem; align-items:center; }
  .btm { padding:.4rem .95rem; border-radius:var(--r); border:1px solid var(--bdr2); background:transparent; color:var(--text2); font-size:.77rem; font-weight:600; font-family:var(--fb); cursor:none; transition:all .2s; text-decoration:none; letter-spacing:.02em; }
  .btm:hover { color:var(--gold); border-color:var(--gold); background:var(--glow2); }
  .bth { padding:.4rem 1.05rem; border-radius:var(--r); border:none; background:var(--gold); color:#09070A; font-size:.77rem; font-weight:800; font-family:var(--fb); cursor:none; transition:all .2s; text-decoration:none; letter-spacing:.02em; }
  .bth:hover { background:var(--gold2); transform:translateY(-1px); box-shadow:0 4px 16px rgba(201,164,74,.38); }
  .btt { width:32px; height:32px; border-radius:8px; border:1px solid var(--bdr2); background:var(--surf); color:var(--text2); font-size:.82rem; cursor:none; transition:all .2s; display:flex; align-items:center; justify-content:center; }
  .btt:hover { color:var(--gold); border-color:var(--gold); }
  .bg2 { display:none; flex-direction:column; gap:5px; background:none; border:none; cursor:pointer; padding:4px; }
  .bg2 span { display:block; width:20px; height:1.5px; background:var(--text); border-radius:2px; transition:all .25s; }
  @media(max-width:840px) { .nm,.nr .btm,.nr .bth{display:none!important} .bg2{display:flex!important} }
  .mm { position:fixed; top:60px; left:0; right:0; z-index:490; background:${dark ? "rgba(8,10,16,.97)" : "rgba(245,243,238,.97)"}; backdrop-filter:blur(24px); border-bottom:1px solid var(--bdr); padding:1.5rem 2rem 2rem; display:flex; flex-direction:column; gap:.8rem; animation:fu .2s ease; }
  .mm a { font-family:var(--fh); font-size:1.4rem; font-weight:700; color:var(--text); text-decoration:none; letter-spacing:-.03em; }
  .mm .mb { margin-top:.4rem; padding:.8rem; border-radius:var(--r); background:var(--gold); color:#09070A; text-align:center; font-weight:800; }

  /* sections */
  .sec { padding:clamp(5rem,10vh,8rem) clamp(1.5rem,5vw,3rem); }
  .si { max-width:1140px; margin:0 auto; }
  .sl { font-size:.68rem; letter-spacing:.14em; color:var(--gold); text-transform:uppercase; font-weight:700; margin-bottom:.7rem; }
  .sh { font-family:var(--fh); font-weight:700; font-size:clamp(2rem,5vw,3.2rem); letter-spacing:-.04em; line-height:1.05; }
  .sh em { font-style:italic; color:var(--gold2); }

  /* hero */
  #hero { min-height:100vh; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; padding:5rem clamp(1.5rem,5vw,3rem) 3rem; }
  .hcv { position:absolute; inset:0; z-index:0; }
  .hco { position:relative; z-index:1; max-width:880px; text-align:center; }
  .hb { display:inline-flex; align-items:center; gap:.5rem; padding:.35rem .95rem; border-radius:100px; border:1px solid rgba(46,196,144,.3); background:rgba(46,196,144,.07); color:var(--green); font-size:.74rem; font-weight:600; letter-spacing:.04em; margin-bottom:1.8rem; }
  .hbd { width:6px; height:6px; border-radius:50%; background:var(--green); animation:pdot 2.2s infinite; }
  /* photo circle */
  .hph { width:130px; height:130px; border-radius:50%; overflow:hidden; border:3px solid var(--gold); margin:0 auto 1.6rem; animation:fu .7s .3s ease both; box-shadow:0 0 32px rgba(201,164,74,.2); }
  .hph img { width:100%; height:100%; object-fit:cover; }
  .hn { font-family:var(--fh); font-weight:700; font-style:italic; font-size:clamp(3rem,8.5vw,6.5rem); line-height:.95; letter-spacing:-.05em; margin-bottom:.4rem; }
  .hn2 { font-family:var(--fh); font-weight:400; font-style:normal; font-size:clamp(1.5rem,4vw,2.8rem); line-height:1; letter-spacing:-.04em; color:var(--text2); margin-bottom:1.5rem; }
  .hn2 strong { color:var(--gold); font-weight:700; }
  .hty { font-size:clamp(.95rem,2.2vw,1.1rem); color:var(--text2); min-height:1.8rem; margin-bottom:2.4rem; font-weight:300; }
  .hty span { color:var(--gold2); animation:blink 1s step-end infinite; }
  .hctas { display:flex; gap:.9rem; justify-content:center; flex-wrap:wrap; margin-bottom:2.8rem; }
  .cp { padding:.85rem 2.2rem; border-radius:var(--r); background:var(--gold); color:#09070A; font-weight:800; font-size:.88rem; text-decoration:none; transition:all .25s; font-family:var(--fb); box-shadow:0 0 24px rgba(201,164,74,.22); }
  .cp:hover { background:var(--gold2); transform:translateY(-2px); box-shadow:0 8px 30px rgba(201,164,74,.4); }
  .cs { padding:.85rem 2.2rem; border-radius:var(--r); border:1px solid var(--bdr2); color:var(--text); font-weight:400; font-size:.88rem; text-decoration:none; transition:all .25s; font-family:var(--fb); }
  .cs:hover { border-color:var(--gold); color:var(--gold2); background:var(--glow2); }
  .cc { padding:.85rem 2.2rem; border-radius:var(--r); border:1px solid rgba(201,164,74,.3); color:var(--gold2); font-weight:400; font-size:.88rem; text-decoration:none; transition:all .25s; font-family:var(--fb); }
  .cc:hover { background:var(--glow2); border-color:var(--gold); }
  .hsc { display:flex; gap:.9rem; justify-content:center; }
  .hs { width:38px; height:38px; border-radius:9px; border:1px solid var(--bdr2); background:var(--surf); display:flex; align-items:center; justify-content:center; text-decoration:none; color:var(--text2); font-size:.78rem; font-weight:700; font-family:var(--fh); transition:all .2s; }
  .hs:hover { border-color:var(--gold); color:var(--gold); background:var(--glow2); transform:translateY(-2px); }
  .hsc2 { position:absolute; bottom:2.2rem; left:50%; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; gap:.35rem; opacity:.3; }
  .hsc2 div { width:1px; height:40px; background:linear-gradient(to bottom,transparent,var(--gold)); }
  .hsc2 span { font-size:.62rem; letter-spacing:.12em; text-transform:uppercase; }

  /* about */
  #about { background:var(--bg2); }
  .ag { display:grid; grid-template-columns:1fr 1fr; gap:5rem; align-items:center; }
  .avc { position:relative; }
  .acard { width:100%; max-width:360px; aspect-ratio:3/3.8; border-radius:var(--r2); background:linear-gradient(145deg,var(--bg3),var(--surf)); border:1px solid var(--bdr2); overflow:hidden; position:relative; display:flex; align-items:center; justify-content:center; }
  .aav { width:120px; height:120px; border-radius:50%; background:linear-gradient(135deg,var(--gold),var(--gold3)); display:flex; align-items:center; justify-content:center; font-family:var(--fh); font-weight:700; font-size:2.8rem; color:#09070A; }
  .aco { position:absolute; bottom:0; left:0; right:0; background:linear-gradient(transparent,${dark ? "rgba(8,10,16,.94)" : "rgba(236,234,228,.94)"}); padding:1.8rem 1.4rem 1.3rem; }
  .acn { font-family:var(--fh); font-weight:700; font-size:1rem; }
  .acs { font-size:.76rem; color:var(--gold2); margin-top:.15rem; }
  .abt1 { position:absolute; top:-12px; right:-12px; background:var(--bg); border:1px solid var(--bdr2); border-radius:9px; padding:.45rem .8rem; font-size:.7rem; font-weight:700; color:var(--gold); }
  .abt2 { position:absolute; bottom:-12px; left:-12px; background:var(--gold); border-radius:9px; padding:.45rem .85rem; font-size:.7rem; font-weight:800; color:#09070A; }
  .abio { font-size:.93rem; color:var(--text2); line-height:1.88; margin-bottom:1.4rem; }
  .ais { display:flex; flex-direction:column; gap:.75rem; margin-bottom:1.8rem; }
  .ai2 { display:flex; gap:.85rem; align-items:flex-start; padding:.85rem 1rem; border-radius:var(--r); background:var(--surf); border:1px solid var(--bdr); font-size:.86rem; color:var(--text2); line-height:1.7; }
  .aii { font-size:.95rem; flex-shrink:0; margin-top:.1rem; }
  .atags { display:flex; flex-wrap:wrap; gap:.45rem; margin-bottom:1.8rem; }
  .atag { padding:.25rem .7rem; border-radius:100px; background:var(--glow2); border:1px solid rgba(201,164,74,.18); color:var(--gold2); font-size:.74rem; font-weight:500; }
  @media(max-width:800px) { .ag{grid-template-columns:1fr;gap:3rem} .avc{display:flex;justify-content:center} }

  /* skills */
  #skills { background:var(--bg); }
  .sg { display:grid; grid-template-columns:repeat(4,1fr); gap:1.1rem; margin-top:2.8rem; }
  .skc { padding:1.5rem; border-radius:var(--r2); background:var(--bg2); border:1px solid var(--bdr); position:relative; overflow:hidden; transition:all .3s; }
  .skc::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:var(--sc,var(--gold)); opacity:.7; }
  .skc:hover { transform:translateY(-4px); border-color:var(--sc,var(--gold)); box-shadow:0 14px 36px rgba(0,0,0,.22); }
  .ski { font-size:1.4rem; margin-bottom:.8rem; }
  .skk { font-family:var(--fh); font-weight:700; font-size:.92rem; letter-spacing:-.02em; margin-bottom:1rem; }
  .skl { list-style:none; display:flex; flex-direction:column; gap:.45rem; }
  .skli { display:flex; align-items:center; gap:.5rem; font-size:.8rem; color:var(--text2); }
  .skd { width:4px; height:4px; border-radius:50%; flex-shrink:0; }
  .mqr { overflow:hidden; margin-top:3rem; position:relative; }
  .mqr::before,.mqr::after { content:''; position:absolute; top:0; bottom:0; width:70px; z-index:1; }
  .mqr::before { left:0; background:linear-gradient(to right,var(--bg),transparent); }
  .mqr::after  { right:0; background:linear-gradient(to left,var(--bg),transparent); }
  .mqt { display:flex; animation:mq 22s linear infinite; width:max-content; }
  .mqg { display:inline-flex; align-items:center; gap:.45rem; padding:.42rem 1.1rem; margin:0 .35rem; border-radius:100px; border:1px solid var(--bdr2); background:var(--surf); font-size:.78rem; font-weight:600; color:var(--text2); white-space:nowrap; }
  .mqg span { width:5px; height:5px; border-radius:50%; background:var(--gold); }
  @media(max-width:740px) { .sg{grid-template-columns:1fr 1fr} }
  @media(max-width:440px) { .sg{grid-template-columns:1fr} }

  /* projects */
  #projects { background:var(--bg2); }
  .pg { display:grid; grid-template-columns:repeat(2,1fr); gap:1.4rem; margin-top:2.8rem; }
  .prc { border-radius:var(--r2); overflow:hidden; background:var(--bg); border:1px solid var(--bdr); transition:all .32s; display:flex; flex-direction:column; }
  .prc:hover { transform:translateY(-6px); border-color:var(--pc,var(--gold)); box-shadow:0 24px 50px rgba(0,0,0,.28); }
  .pth { height:170px; position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center; }
  .ptb { position:absolute; inset:0; }
  .ptn { position:absolute; right:1rem; top:50%; transform:translateY(-50%); font-family:var(--fh); font-weight:700; font-size:5.5rem; letter-spacing:-.05em; line-height:1; user-select:none; opacity:.11; }
  .pti { position:relative; z-index:1; padding:1.4rem; width:100%; }
  .pcat { font-size:.67rem; letter-spacing:.11em; text-transform:uppercase; font-weight:700; margin-bottom:.3rem; }
  .pnam { font-family:var(--fh); font-weight:700; font-size:1.15rem; letter-spacing:-.03em; white-space:pre-line; }
  .pb { padding:1.4rem; display:flex; flex-direction:column; gap:.9rem; flex:1; }
  .pd { font-size:.85rem; color:var(--text2); line-height:1.78; }
  .pts { display:flex; flex-wrap:wrap; gap:.35rem; }
  .pt { padding:.18rem .6rem; border-radius:100px; font-size:.7rem; font-weight:600; }
  .pac { display:flex; gap:.7rem; margin-top:auto; }
  .pbgh { flex:1; padding:.58rem; border-radius:var(--r); text-align:center; border:1px solid var(--bdr2); color:var(--text2); font-size:.8rem; font-weight:600; text-decoration:none; transition:all .2s; }
  .pbgh:hover { border-color:var(--text); color:var(--text); }
  @media(max-width:680px) { .pg{grid-template-columns:1fr} }

  /* contact */
  #contact { background:var(--bg); }
  .cg { display:grid; grid-template-columns:1fr 1.55fr; gap:3.2rem; align-items:start; margin-top:2.8rem; }
  .ci { display:flex; flex-direction:column; gap:.85rem; }
  .cit { display:flex; gap:.95rem; align-items:center; padding:.95rem 1.15rem; border-radius:var(--r); background:var(--bg2); border:1px solid var(--bdr); text-decoration:none; transition:all .2s; }
  .cit:hover { border-color:var(--cc,var(--gold)); background:var(--glow2); }
  .cic { width:38px; height:38px; border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:.95rem; flex-shrink:0; }
  .cil { font-size:.68rem; color:var(--text3); letter-spacing:.04em; margin-bottom:.1rem; }
  .civ { font-size:.83rem; color:var(--text); font-weight:600; }
  .fb { padding:2rem; border-radius:var(--r2); background:var(--bg2); border:1px solid var(--bdr); }
  .fr { display:grid; grid-template-columns:1fr 1fr; gap:.9rem; }
  .ff { display:flex; flex-direction:column; gap:.3rem; }
  .fl { font-size:.67rem; color:var(--text3); letter-spacing:.08em; text-transform:uppercase; font-weight:600; }
  .fi,.ft { width:100%; padding:.72rem .95rem; border-radius:var(--r); background:var(--bg); border:1px solid var(--bdr2); color:var(--text); font-family:var(--fb); font-size:.88rem; transition:border-color .2s,box-shadow .2s; outline:none; }
  .fi:focus,.ft:focus { border-color:var(--gold); box-shadow:0 0 0 3px var(--glow); }
  .fi::placeholder,.ft::placeholder { color:var(--text3); }
  .ft { resize:vertical; min-height:120px; }
  .fe { font-size:.7rem; color:#F87171; margin-top:.12rem; animation:pop .22s ease; }
  .fm { padding:.75rem .95rem; border-radius:var(--r); font-size:.83rem; display:flex; align-items:center; gap:.55rem; animation:pop .28s ease; }
  .fm.ok { background:rgba(46,196,144,.08); border:1px solid rgba(46,196,144,.28); color:var(--green); }
  .fm.er { background:rgba(248,113,113,.08); border:1px solid rgba(248,113,113,.28); color:#F87171; }
  .bsb { width:100%; padding:.88rem; border-radius:var(--r); border:none; background:var(--gold); color:#09070A; font-weight:800; font-size:.88rem; font-family:var(--fb); letter-spacing:.02em; cursor:none; transition:all .25s; display:flex; align-items:center; justify-content:center; gap:.55rem; }
  .bsb:hover:not(:disabled) { background:var(--gold2); transform:translateY(-2px); box-shadow:0 8px 24px rgba(201,164,74,.35); }
  .bsb:disabled { opacity:.7; cursor:wait; }
  .sp2 { width:15px; height:15px; border:2px solid rgba(9,7,10,.3); border-top-color:#09070A; border-radius:50%; animation:spin .6s linear infinite; }
  @media(max-width:800px) { .cg{grid-template-columns:1fr} .fr{grid-template-columns:1fr} }

  /* footer */
  #ftr { padding:2.2rem clamp(1.5rem,5vw,3rem); background:var(--bg2); border-top:1px solid var(--bdr); }
  .fi2 { max-width:1140px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:.9rem; }
  .flo { font-family:var(--fh); font-weight:700; font-size:1.1rem; letter-spacing:-.04em; }
  .flo span { color:var(--gold); }
  .fcp { font-size:.75rem; color:var(--text3); }
  .fls { display:flex; gap:1.6rem; flex-wrap:wrap; }
  .fls a { font-size:.75rem; color:var(--text3); text-decoration:none; transition:color .2s; }
  .fls a:hover { color:var(--text); }

  /* stt */
  #stt { position:fixed; bottom:1.8rem; right:1.8rem; z-index:400; width:40px; height:40px; border-radius:9px; border:none; background:var(--gold); color:#09070A; font-size:.95rem; font-weight:700; cursor:none; transition:all .2s; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 18px rgba(201,164,74,.35); }
  #stt:hover { background:var(--gold2); transform:translateY(-3px); }

  /* modal */
  .modover { position:fixed; inset:0; background:rgba(0,0,0,.6); z-index:700; display:flex; align-items:center; justify-content:center; padding:1.5rem; animation:fi .2s ease; }
  .modc { background:var(--bg2); border:1px solid var(--bdr2); border-radius:var(--r2); padding:2rem; max-width:440px; width:100%; animation:pop .28s ease; }
  .modh { font-family:var(--fh); font-weight:700; font-size:1.2rem; margin-bottom:.5rem; }
  .mods { font-size:.86rem; color:var(--text2); line-height:1.7; margin-bottom:1.4rem; }
  .modbts { display:flex; gap:.7rem; }
  .modbt { flex:1; padding:.7rem; border-radius:var(--r); border:1px solid var(--bdr2); background:transparent; color:var(--text2); font-size:.83rem; font-weight:600; font-family:var(--fb); cursor:none; transition:all .2s; }
  .modbt:hover { border-color:var(--text); color:var(--text); }
  .modbtg { flex:1; padding:.7rem; border-radius:var(--r); border:none; background:var(--gold); color:#09070A; font-size:.83rem; font-weight:800; font-family:var(--fb); cursor:none; transition:all .2s; text-decoration:none; text-align:center; }
  .modbtg:hover { background:var(--gold2); }
`;

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, v];
}

function useTypewriter(words) {
  const [text, setText] = useState("");
  const [wi, setWi] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const w = words[wi];
    let t;
    if (!del && text.length < w.length)      t = setTimeout(() => setText(w.slice(0, text.length + 1)), 62);
    else if (!del && text.length === w.length) t = setTimeout(() => setDel(true), 2100);
    else if (del && text.length > 0)          t = setTimeout(() => setText(w.slice(0, text.length - 1)), 36);
    else { setDel(false); setWi(i => (i + 1) % words.length); }
    return () => clearTimeout(t);
  }, [text, del, wi, words]);
  return text;
}

// ─── Canvas background ────────────────────────────────────────────────────────
function Canvas({ dark }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let W = c.width = c.offsetWidth, H = c.height = c.offsetHeight;
    window.addEventListener("resize", () => { W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; });
    const N = 50, col = dark ? "rgba(201,164,74," : "rgba(160,120,40,";
    const P = Array.from({ length: N }, () => ({ x: Math.random()*W, y: Math.random()*H, r: Math.random()*1.3+.3, vx:(Math.random()-.5)*.32, vy:(Math.random()-.5)*.32, o:Math.random()*.45+.08 }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      P.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = col + p.o + ")"; ctx.fill();
      });
      for (let i = 0; i < P.length; i++) for (let j = i+1; j < P.length; j++) {
        const dx = P[i].x-P[j].x, dy = P[i].y-P[j].y, d = Math.sqrt(dx*dx+dy*dy);
        if (d < 115) { ctx.beginPath(); ctx.moveTo(P[i].x,P[i].y); ctx.lineTo(P[j].x,P[j].y); ctx.strokeStyle = col+(0.07*(1-d/115))+")"; ctx.lineWidth=.5; ctx.stroke(); }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [dark]);
  return <canvas ref={ref} className="hcv" style={{ width:"100%", height:"100%" }} />;
}

// ─── Scroll progress ──────────────────────────────────────────────────────────
function ScrollBar() {
  useEffect(() => {
    const bar = document.getElementById("sp");
    if (!bar) return;
    const fn = () => { const h = document.documentElement; bar.style.width = (window.scrollY / (h.scrollHeight - h.clientHeight) * 100) + "%"; };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return <div id="sp" />;
}

// ─── Cursor ───────────────────────────────────────────────────────────────────
function Cursor() {
  const dot = useRef(null), ring = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const move = ({ clientX: x, clientY: y }) => {
      dot.current && (dot.current.style.cssText = `left:${x}px;top:${y}px`);
      ring.current && (ring.current.style.cssText = `left:${x}px;top:${y}px`);
    };
    const over = ({ target }) => ring.current?.classList.toggle("h", !!target.closest("a,button,[data-c]"));
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); };
  }, []);
  return <><div ref={dot} className="cd" /><div ref={ring} className="cr" /></>;
}

// ─── Loader ───────────────────────────────────────────────────────────────────
function Loader({ done }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setP(v => { if (v >= 100) { clearInterval(t); return 100; } return v + 3; }), 26);
    return () => clearInterval(t);
  }, []);
  return (
    <div id="ldr" className={done ? "out" : ""}>
      <div className="ll">MB<span>.</span></div>
      <div className="lt"><div className="lf" style={{ width: p + "%" }} /></div>
      <div style={{ fontSize:".68rem", color:"var(--text3)", letterSpacing:".1em" }}>{p}%</div>
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav({ onHire }) {
  const { dark, toggle } = useTheme();
  const [sc, setSc] = useState(false);
  const [mo, setMo] = useState(false);
  useEffect(() => {
    const fn = () => setSc(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <>
      <nav id="nav" className={sc ? "sc" : ""}>
        <div className="ni">
          <a href="#hero" className="nl">MB<span>.</span></a>
          <ul className="nm">{NAV.map(n => <li key={n}><a href={`#${n.toLowerCase()}`}>{n}</a></li>)}</ul>
          <div className="nr">
            <button className="btt" onClick={toggle}>{dark ? "☀" : "☾"}</button>
            <a href="/CV_Boumahraz.pdf" download className="btm">↓ CV</a>
            <button className="bth" onClick={onHire}>Hire Me</button>
            <button className="bg2" onClick={() => setMo(o => !o)}>
              {[0,1,2].map(i => <span key={i} style={{ transform: mo ? (i===0?"rotate(45deg) translate(4px,4px)":i===2?"rotate(-45deg) translate(4px,-4px)":"scaleX(0)"):"none", opacity:(mo&&i===1)?0:1 }} />)}
            </button>
          </div>
        </div>
      </nav>
      {mo && (
        <div className="mm">
          {NAV.map(n => <a key={n} href={`#${n.toLowerCase()}`} onClick={() => setMo(false)}>{n}</a>)}
          <button className="mb bth" onClick={() => { setMo(false); onHire(); }}>✉ Hire Me</button>
        </div>
      )}
    </>
  );
}

// ─── Hire Me modal ────────────────────────────────────────────────────────────
function HireModal({ onClose }) {
  return (
    <div className="modover" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modc">
        <div className="modh">Let's work together 🤝</div>
        <p className="mods">I'm available for freelance projects, part-time collaboration, or full-time opportunities. Reach out by email or WhatsApp — I usually respond within a few hours.</p>
        <div className="modbts">
          <button className="modbt" onClick={onClose}>Cancel</button>
          <a href="mailto:boumahrazmohmed9@gmail.com" className="modbtg">✉ Send Email</a>
          <a href="https://wa.me/212609448016" target="_blank" rel="noreferrer" className="modbtg" style={{ background:"#2EC490" }}>WhatsApp</a>
        </div>
      </div>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ onHire }) {
  const { dark } = useTheme();
  const typed = useTypewriter(["Full Stack Developer","React & Next.js Expert","Laravel & Node.js Dev","UI/UX Enthusiast","Open to Opportunities ✦"]);
  // Use the CV photo via object URL encoded in data — we'll reference the uploaded file
  const [imgOk, setImgOk] = useState(true);
  return (
    <section id="home">
      <div id="hero">
        <Canvas dark={dark} />
        {/* Orbs */}
        <div style={{ position:"absolute",top:"20%",left:"8%",width:320,height:320,borderRadius:"50%",background:"radial-gradient(circle,rgba(201,164,74,.08) 0%,transparent 70%)",filter:"blur(44px)",animation:"fl1 9s ease-in-out infinite",pointerEvents:"none" }} />
        <div style={{ position:"absolute",bottom:"16%",right:"7%",width:220,height:220,borderRadius:"50%",background:"radial-gradient(circle,rgba(91,141,239,.06) 0%,transparent 70%)",filter:"blur(32px)",animation:"fl1 12s ease-in-out infinite reverse",pointerEvents:"none" }} />

        <div className="hco">
          {/* Status badge */}
          <div className="hb" style={{ animation:"fu .7s .15s ease both" }}>
            <span className="hbd" />
            Available for work — Meknès, Morocco 🇲🇦
          </div>

          {/* Photo */}
          <div className="hph" style={{ animation:"fu .7s .28s ease both" }}>
            {imgOk
              ? <img src={HERO_PHOTO} alt="Mohamed Boumahraz" onError={() => setImgOk(false)} />
              : (
                <div style={{ width:"100%",height:"100%",background:"linear-gradient(135deg,var(--bg3),var(--surf))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2.2rem",fontFamily:"var(--fh)",fontWeight:700,color:"var(--gold)" }}>
                  MB
                </div>
              )}
          </div>

          {/* Name */}
          <h1 className="hn" style={{ animation:"fu .7s .38s ease both" }}>
            <span style={{ background:"linear-gradient(135deg,var(--gold) 0%,var(--gold3) 55%,var(--gold2) 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>Mohamed</span>
          </h1>
          <p className="hn2" style={{ animation:"fu .7s .5s ease both" }}>Boumahraz — <strong>Full Stack Dev</strong></p>

          {/* Typewriter */}
          <p className="hty" style={{ animation:"fu .7s .6s ease both" }}>{typed}<span>|</span></p>

          {/* Tagline */}
          <p style={{ fontSize:".88rem",color:"var(--text3)",maxWidth:500,margin:"0 auto 2rem",lineHeight:1.75,animation:"fu .7s .68s ease both" }}>
            I build <em style={{ color:"var(--gold2)",fontStyle:"normal" }}>fast</em>, <em style={{ color:"var(--gold2)",fontStyle:"normal" }}>clean</em> full-stack apps — from solid back-end architecture to interfaces that convert.
          </p>

          {/* CTAs */}
          <div className="hctas" style={{ animation:"fu .7s .76s ease both" }}>
            <a href="#projects" className="cp">View Projects →</a>
            <a href="#contact" className="cs">Contact Me</a>
            <a href="/CV_Boumahraz.pdf" download className="cc">↓ Download CV</a>
          </div>

          {/* Socials */}
          <div className="hsc" style={{ animation:"fu .7s .84s ease both" }}>
            {[
              { s:"GH", href:"https://github.com/boumahrazsimo12", label:"GitHub" },
              { s:"LI", href:"https://www.linkedin.com/in/mohamed-boumahraz-1971b92ba", label:"LinkedIn" },
              { s:"WA", href:"https://wa.me/212609448016", label:"WhatsApp" },
              { s:"✉",  href:"mailto:boumahrazmohmed9@gmail.com", label:"Email" },
            ].map(({ s, href, label }) => (
              <a key={s} href={href} target={href.startsWith("http")?"_blank":undefined} rel="noreferrer" className="hs" title={label}>{s}</a>
            ))}
          </div>
        </div>

        <div className="hsc2"><div /><span>Scroll</span></div>
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function About() {
  const [ref, v] = useInView();
  const t = d => ({ opacity: v?1:0, transition:`all .65s ${d}s ease`, transform: v?"none":undefined });
  return (
    <section id="about" className="sec">
      <div className="si" ref={ref}>
        <div className="ag">
          {/* Card */}
          <div className="avc" style={{ ...t(0), transform: v?"none":"translateX(-24px)" }}>
            <div className="acard">
              <div className="aav">MB</div>
              <div className="aco">
                <div className="acn">Mohamed Boumahraz</div>
                <div className="acs">Full Stack Developer · ISTAG Bab Tizimi 🎓</div>
              </div>
            </div>
            <div className="abt1">🎓 ISTAG Bab Tizimi</div>
            <div className="abt2">Fresh Graduate · 2025</div>
          </div>

          {/* Text */}
          <div style={{ ...t(.15), transform: v?"none":"translateX(24px)" }}>
            <p className="sl">About Me</p>
            <h2 className="sh" style={{ marginBottom:"1.3rem" }}>Building digital<br /><em>solutions.</em></h2>
            <p className="abio">
              Full Stack Developer based in Meknès, Morocco. I graduated as a <strong style={{ color:"var(--gold2)" }}>Technicien Spécialisé en Développement Digital</strong> (mention bien) from ISTAG Bab Tizimi in 2025. I specialise in React/Laravel/Node.js stacks and care deeply about both technical quality and user experience.
            </p>
            <div className="ais">
              {[
                { e:"🚀", t:"Experienced with React, Next.js, Laravel, Node.js — prototype to production." },
                { e:"💡", t:"UI/UX-driven: every interface should be fast, intuitive, and memorable." },
                { e:"🌍", t:"Open to freelance projects and international collaboration opportunities." },
              ].map((item, i) => (
                <div key={i} className="ai2" style={{ opacity:v?1:0, transform:v?"none":"translateY(9px)", transition:`all .48s ${.3+i*.1}s ease` }}>
                  <span className="aii">{item.e}</span>
                  <p>{item.t}</p>
                </div>
              ))}
            </div>
            <div className="atags">
              {["⚡ React","🔥 Laravel","🗄️ MongoDB","📱 Responsive","🎨 UI/UX","🔧 Node.js"].map(tag => (
                <span key={tag} className="atag">{tag}</span>
              ))}
            </div>
            {/* Education */}
            <div style={{ borderTop:"1px solid var(--bdr)", paddingTop:"1.5rem" }}>
              <div style={{ fontSize:".66rem",letterSpacing:".1em",color:"var(--text3)",textTransform:"uppercase",marginBottom:"1rem" }}>Education & Training</div>
              {[
                { year:"10/2023 – 07/2025", role:"TS Développement Digital — Web Full Stack", where:"ISTAG Bab Tizimi, Meknès", note:"Mention Bien", active:true },
                { year:"04/2025 – 04/2025", role:"Web Developer Intern", where:"Société BHA, Meknès", note:"Next.js · Laravel · MongoDB", active:false },
                { year:"04/2022 – 07/2023", role:"Baccalauréat · Sciences Physiques", where:"Lycée 16 Novembre", note:"Mention Passable", active:false },
              ].map((e, i) => (
                <div key={i} style={{ display:"flex",gap:.85+"rem",paddingBottom:"1.1rem",opacity:v?1:0,transition:`opacity .48s ${.5+i*.1}s ease` }}>
                  <div style={{ paddingTop:".22rem",flexShrink:0 }}>
                    <div style={{ width:7,height:7,borderRadius:"50%",background:e.active?"var(--gold)":"var(--bdr2)",border:e.active?"none":"1px solid var(--bdr2)" }} />
                  </div>
                  <div>
                    <div style={{ fontFamily:"var(--fh)",fontWeight:700,fontSize:".86rem" }}>{e.role}</div>
                    <div style={{ display:"flex",gap:".55rem",alignItems:"center",flexWrap:"wrap",marginTop:".12rem" }}>
                      <span style={{ fontSize:".73rem",color:"var(--gold)",fontWeight:600 }}>{e.where}</span>
                      <span style={{ fontSize:".68rem",color:"var(--text3)" }}>{e.year}</span>
                    </div>
                    <div style={{ fontSize:".78rem",color:"var(--text3)",lineHeight:1.6,marginTop:".15rem" }}>{e.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────────
function Skills() {
  const [ref, v] = useInView();
  const mq = [...Array(16).fill(["React","Next.js","Laravel","Node.js","MongoDB","MySQL","PHP","TypeScript","Tailwind","Docker","Redis","GraphQL","Prisma","Git","Figma","Python"]).flat()];
  return (
    <section id="skills" className="sec">
      <div className="si" ref={ref}>
        <div style={{ opacity:v?1:0,transition:"opacity .55s" }}>
          <p className="sl">Skills</p>
          <h2 className="sh">My tech<br /><em>stack.</em></h2>
        </div>
        <div className="sg">
          {SKILLS.map((s, i) => (
            <div key={s.cat} className="skc" style={{ "--sc":s.color, opacity:v?1:0, transform:v?"none":"translateY(20px)", transition:`all .5s ${.1+i*.08}s ease` }}>
              <div className="ski" style={{ color:s.color }}>{s.icon}</div>
              <div className="skk">{s.cat}</div>
              <ul className="skl">{s.items.map(it => <li key={it} className="skli"><span className="skd" style={{ background:s.color }} />{it}</li>)}</ul>
            </div>
          ))}
        </div>
        <div className="mqr" style={{ opacity:v?1:0,transition:"opacity .65s .45s" }}>
          <div className="mqt">{mq.map((t, i) => <span key={i} className="mqg"><span />{t}</span>)}</div>
        </div>
      </div>
    </section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────
function Projects() {
  const [ref, v] = useInView();
  return (
    <section id="projects" className="sec">
      <div className="si" ref={ref}>
        <div style={{ opacity:v?1:0,transition:"opacity .55s" }}>
          <p className="sl">Projects</p>
          <h2 className="sh">My recent<br /><em>work.</em></h2>
        </div>
        <div className="pg">
          {PROJECTS.map((p, i) => (
            <div key={p.id} className="prc" style={{ "--pc":p.color, opacity:v?1:0, transform:v?"none":"translateY(24px)", transition:`all .52s ${.1+i*.12}s ease` }}>
              {/* Thumb */}
              <div className="pth">
                <div className="ptb" style={{ background:`linear-gradient(135deg,${p.color}14,${p.color}05)`, borderBottom:`1px solid ${p.color}18` }} />
                <span className="ptn" style={{ color:p.color }}>{p.id}</span>
                <div className="pti">
                  <div className="pcat" style={{ color:p.color }}>{p.category}</div>
                  <div className="pnam">{p.title}</div>
                </div>
              </div>
              {/* Body */}
              <div className="pb">
                <p className="pd">{p.desc}</p>
                <div className="pts">
                  {p.tech.map(t => <span key={t} className="pt" style={{ background:p.color+"13",border:`1px solid ${p.color}28`,color:p.color }}>{t}</span>)}
                </div>
                <div className="pac">
                  <a href={p.github} target="_blank" rel="noreferrer" className="pbgh">⌥ View on GitHub</a>
                  {p.demo && <a href={p.demo} target="_blank" rel="noreferrer" className="pbgh" style={{ background:p.color+"16",borderColor:p.color+"30",color:p.color }}>→ Live Demo</a>}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* GitHub CTA */}
        <div style={{ textAlign:"center",marginTop:"2.5rem",opacity:v?1:0,transition:"opacity .55s .5s" }}>
          <a href="https://github.com/boumahrazsimo12" target="_blank" rel="noreferrer" style={{ display:"inline-flex",alignItems:"center",gap:".6rem",padding:".78rem 1.8rem",borderRadius:"var(--r)",border:"1px solid var(--bdr2)",color:"var(--text2)",fontSize:".84rem",fontWeight:600,textDecoration:"none",transition:"all .2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="var(--gold)"; e.currentTarget.style.color="var(--gold)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="var(--bdr2)"; e.currentTarget.style.color="var(--text2)"; }}>
            See all projects on GitHub →
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function Contact() {
  const [ref, v] = useInView();
  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });
  const [errs, setErrs] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | ok | err

  const onChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errs[name]) setErrs(r => ({ ...r, [name]:"" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())                               e.name    = "Name is required.";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email   = "Invalid email address.";
    if (!form.subject.trim())                             e.subject = "Subject is required.";
    if (form.message.trim().length < 10)                  e.message = "Message too short (min 10 chars).";
    return e;
  };

  const onSubmit = async e => {
    e.preventDefault();
    const es = validate();
    if (Object.keys(es).length) { setErrs(es); return; }
    setStatus("loading");
    try {
      // Save to localStorage as "database"
      const msgs = JSON.parse(localStorage.getItem("portfolio_messages") || "[]");
      msgs.push({ ...form, date: new Date().toISOString(), id: Date.now() });
      localStorage.setItem("portfolio_messages", JSON.stringify(msgs));

      // Open mailto as email delivery
      const mailBody = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
      const mailLink = `mailto:boumahrazmohmed9@gmail.com?subject=${encodeURIComponent(form.subject)}&body=${mailBody}`;
      window.location.href = mailLink;

      setStatus("ok");
      setForm({ name:"", email:"", subject:"", message:"" });
      setTimeout(() => setStatus("idle"), 6000);
    } catch {
      setStatus("err");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const Field = ({ name, label, type="text", ph }) => (
    <div className="ff">
      <label className="fl">{label}</label>
      <input type={type} name={name} value={form[name]} onChange={onChange} placeholder={ph} className="fi" />
      {errs[name] && <span className="fe">⚠ {errs[name]}</span>}
    </div>
  );

  return (
    <section id="contact" className="sec">
      <div className="si" ref={ref}>
        <div style={{ opacity:v?1:0,transition:"opacity .55s" }}>
          <p className="sl">Contact</p>
          <h2 className="sh">Let's work<br /><em>together.</em></h2>
        </div>
        <div className="cg">
          {/* Info */}
          <div className="ci" style={{ opacity:v?1:0,transition:"all .62s .1s" }}>
            {[
              { icon:"📧", label:"Email",       val:"boumahrazmohmed9@gmail.com",            href:"mailto:boumahrazmohmed9@gmail.com",                    color:"#5B8DEF" },
              { icon:"📱", label:"Phone / WA",  val:"+212 609 44 80 16",                     href:"https://wa.me/212609448016",                          color:"#2EC490" },
              { icon:"💼", label:"LinkedIn",    val:"Mohamed Boumahraz",                     href:"https://www.linkedin.com/in/mohamed-boumahraz-1971b92ba", color:"#7EC8E3" },
              { icon:"🐙", label:"GitHub",      val:"github.com/boumahrazsimo12",            href:"https://github.com/boumahrazsimo12",                  color:"#D4A853" },
              { icon:"📍", label:"Location",    val:"El Haj Kadour, Meknès, Morocco",        href:"#",                                                   color:"#B47AFF" },
            ].map(item => (
              <a key={item.label} href={item.href} target={item.href.startsWith("http")?"_blank":undefined} rel="noreferrer" className="cit" style={{ "--cc":item.color }}>
                <div className="cic" style={{ background:item.color+"15",border:`1px solid ${item.color}28` }}>{item.icon}</div>
                <div><div className="cil">{item.label}</div><div className="civ">{item.val}</div></div>
              </a>
            ))}
          </div>

          {/* Form */}
          <div className="fb" style={{ opacity:v?1:0,transform:v?"none":"translateY(20px)",transition:"all .62s .2s" }}>
            <form onSubmit={onSubmit} style={{ display:"flex",flexDirection:"column",gap:"1rem" }} noValidate>
              <div className="fr">
                <Field name="name"    label="Full Name" ph="Your name" />
                <Field name="email"   label="Email"     ph="you@example.com" type="email" />
              </div>
              <Field name="subject" label="Subject" ph="Project inquiry / Hiring..." />
              <div className="ff">
                <label className="fl">Message</label>
                <textarea name="message" value={form.message} onChange={onChange} placeholder="Tell me about your project, needs, or any question..." className="ft" />
                {errs.message && <span className="fe">⚠ {errs.message}</span>}
              </div>
              {status === "ok"  && <div className="fm ok"><span>✓</span> Message saved! Your email client will open to send it directly.</div>}
              {status === "err" && <div className="fm er"><span>✗</span> Something went wrong. Email me directly: boumahrazmohmed9@gmail.com</div>}
              <button type="submit" className="bsb" disabled={status==="loading"}>
                {status==="loading" && <span className="sp2" />}
                {status==="loading" ? "Sending…" : status==="ok" ? "✓ Sent!" : "Send Message →"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer id="ftr">
      <div className="fi2">
        <div className="flo">MB<span>.</span></div>
        <p className="fcp">© {new Date().getFullYear()} Mohamed Boumahraz · Meknès 🇲🇦</p>
        <nav className="fls">{NAV.map(n => <a key={n} href={`#${n.toLowerCase()}`}>{n}</a>)}</nav>
      </div>
    </footer>
  );
}

// ─── Scroll to top ────────────────────────────────────────────────────────────
function STT() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 480);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  if (!show) return null;
  return <button id="stt" onClick={() => window.scrollTo({ top:0, behavior:"smooth" })}>↑</button>;
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [hireOpen, setHireOpen] = useState(false);

  useEffect(() => {
    let s = document.getElementById("pcss");
    if (!s) { s = document.createElement("style"); s.id = "pcss"; document.head.appendChild(s); }
    s.innerHTML = CSS(dark);
    // Inject Google Fonts
    if (!document.getElementById("pgf")) {
      const l = document.createElement("link");
      l.id = "pgf"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700;800&display=swap";
      document.head.appendChild(l);
    }
  }, [dark]);

  useEffect(() => { const t = setTimeout(() => setLoaded(true), 1600); return () => clearTimeout(t); }, []);

  const toggle = useCallback(() => setDark(d => !d), []);

  return (
    <ThemeCtx.Provider value={{ dark, toggle }}>
      <Loader done={loaded} />
      <Cursor />
      <ScrollBar />
      <Nav onHire={() => setHireOpen(true)} />
      {hireOpen && <HireModal onClose={() => setHireOpen(false)} />}
      <main>
        <Hero onHire={() => setHireOpen(true)} />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <STT />
    </ThemeCtx.Provider>
  );
}
