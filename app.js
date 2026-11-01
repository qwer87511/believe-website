import {registry} from "./divination/registry.js";
import {createDivinationHost} from "./divination/host.js";
import {cards} from "./divination/oracle/data.js";
import {oracleSession,clearRecord} from "./divination/oracle/session.js";
"use strict";
(() => {
  const main = document.querySelector("main");
  const notice = document.querySelector("#notice");
  document.querySelector(".skip-link").addEventListener("click",event=>{event.preventDefault();main.focus();});
  const routes = new Set(["home","practice","reflect","belief","community","line","records",...registry.list().map(m=>m.route)]);
  const divinationHost=createDivinationHost(registry);
  const state = {route:"home",practice:0,topic:null,action:null,resume:"practice",lineReply:null};
  let noticeTimer;
  function say(text) { clearTimeout(noticeTimer); notice.textContent=text; noticeTimer=setTimeout(()=>{notice.textContent="";},5000); }
  function art(kind="path",cls="card-art") {
    const paths={
      circle:'<circle cx="60" cy="60" r="35"/><path d="M78 30a35 35 0 0 1 5 55"/>',
      sun:'<circle cx="60" cy="51" r="22"/><path d="M20 88h80M31 96h58M60 14v7M26 25l7 7M94 25l-7 7"/>',
      water:'<path d="M15 38q22-20 45 0t45 0M15 60q22-20 45 0t45 0M15 82q22-20 45 0t45 0"/>',
      path:'<path d="M74 10C12 44 104 55 54 85c-15 9-27 16-32 25"/><circle cx="86" cy="24" r="5"/>',
      lamp:'<path d="M43 40h34l7 48H36l7-48ZM47 40V28a13 13 0 0 1 26 0v12M28 96h64"/><path d="M60 57v15M51 65h18"/>',
      mountain:'<path d="m12 91 31-58 25 38 14-22 26 42H12Z"/><circle cx="82" cy="23" r="8"/>'
    };
    return `<svg class="${cls}" viewBox="0 0 120 120" aria-hidden="true"><g class="art-path">${paths[kind]||paths.path}</g></svg>`;
  }
  function heroArt() { return '<svg class="hero-art" viewBox="0 0 420 330" aria-hidden="true"><ellipse cx="215" cy="180" rx="154" ry="130" fill="#e5e9db"/><circle cx="280" cy="76" r="30" fill="#cfb87d"/><path d="M61 237q80-99 145-56t155 31M49 251q91-64 154-38t160 9" class="art-thin"/><path d="M269 83C125 169 338 181 198 269c-20 13-36 24-48 36" class="art-path"/><path d="m99 179 25-43 31 41M278 199l25-51 35 52" class="art-thin"/><circle cx="196" cy="269" r="4" fill="#ab8748"/></svg>'; }
  function button(label,action,variant="") { return `<button class="button ${variant}" data-action="${action}">${label}</button>`; }
  function link(label,route,variant="") { return `<a class="button ${variant}" href="#/${route}">${label}</a>`; }
  function pageHead(tag,title,sub="") { return `<div class="page-head"><a class="back-link" href="#/home">← 回到首頁</a><br><span class="tag">${tag}</span><h1 tabindex="-1">${title}</h1>${sub?`<p class="sub">${sub}</p>`:""}</div>`; }
  function go(route) { if(!routes.has(route))route="home"; if(state.route===route){render();return;} location.hash=`/${route}`; }
  function render() {
    const renderers={home,practice,reflect,belief,divination,community,line,records};
    divinationHost.destroy();
    main.innerHTML=(state.route.startsWith("divination")?divination:renderers[state.route])();
    if(state.route.startsWith("divination"))divinationHost.open(main.querySelector("#divination-outlet"),registry.list().find(m=>m.route===state.route)?.id||"tarot");
    document.querySelectorAll('nav a').forEach(a=>{if(a.getAttribute("href")===`#/${state.route.startsWith("divination")?"divination":state.route}`)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");});
  }
  function routeChanged() {
    let next=location.hash.replace(/^#\/?/,"")||"home";
    if(!routes.has(next)){next="home";history.replaceState(null,"","#/home");}
    if(next==="line" && ["practice","reflect","divination","divination/oracle","belief"].includes(state.route))state.resume=state.route;
    state.route=next; render(); main.querySelector("h1")?.focus({preventScroll:true}); window.scrollTo(0,0);
  }
  function home() {
    return `<section class="hero"><div><p class="eyebrow">一段自己的路，一點彼此的光</p><h1 tabindex="-1"><span>你不必現在</span><span>就想通。</span></h1><p>選一個此刻需要的方向，慢慢來。</p><div class="hero-actions">${link("開始占卜","divination")}<span class="fine">塔羅與原創問道卡 · 自我觀照</span></div></div>${heroArt()}</section><div class="home-paths"><a class="path-card" href="#/practice"><span class="path-symbol" aria-hidden="true">靜</span><span><strong>靜一靜</strong><small>一段 1–3 分鐘的自助練習</small></span><span class="arrow" aria-hidden="true">↗</span></a><a class="path-card" href="#/reflect"><span class="path-symbol" aria-hidden="true">觀</span><span><strong>整理困惑</strong><small>先看清一點，再走一步</small></span><span class="arrow" aria-hidden="true">↗</span></a><a class="path-card" href="#/belief"><span class="path-symbol" aria-hidden="true">道</span><span><strong>認識 believe</strong><small>尋路、留燈，與彼此同行</small></span><span class="arrow" aria-hidden="true">↗</span></a></div><section class="home-note"><p>你可以不說私事，也可以隨時離開。<br>自助練習可用 · 真人服務籌備中</p><a class="quiet-link" href="#/community">看看同行與共善 →</a></section>`;
  }
  function stepper() { return `<div class="stepper" aria-label="練習進度">${["靜","觀","行"].map((x,i)=>`<div class="step ${state.practice===i?"current":""}" ${state.practice===i?'aria-current="step"':""}><span>${x}</span>${i+1} / 3</div>`).join("")}</div>`; }
  function practice() {
    const headers=["先給自己一點空間。","看見此刻的自己。","選一個小小的行動。","今天，先走到這裡。"];
    let content;
    if(state.practice===0)content=`${art("circle","breath-art")}<p class="prompt">找一個舒服的姿勢，<br>讓自己停一會兒。</p><p class="muted">可以睜著眼，也可以慢慢走。<br>依照自己舒服的節奏就好。</p>${button("準備好了，繼續","practice-next")}`;
    else if(state.practice===1)content=`${art("water","breath-art")}<p class="prompt">此刻，有哪一件事<br>可以先放一放？</p><p class="muted">在心裡想一想就好。<br>這一步也可以跳過。</p><div class="actions center">${button("帶著這個想法，繼續","practice-next")}${button("先跳過","practice-next","quiet")}</div>`;
    else if(state.practice===2)content=`<p>選一件今天做得到的事。</p><div class="choice-grid">${["喝一杯水","整理桌面一角","問候一位信任的人","今天先休息"].map((x,i)=>`<button class="choice" data-action="choose-action" data-value="${i}" aria-pressed="${state.action===i}">${x}</button>`).join("")}</div><div class="actions">${button("就從這一步開始","practice-finish")}</div>`;
    else { const actions=["喝一杯水。","整理桌面的一個小角落。","用舒服的方式，問候一位信任的人。","允許自己今天先休息。"];content=`${art("path","breath-art")}<p class="prompt">看清一點，<br>走好自己的一小步。</p><div class="one-action"><strong>今天的小行動</strong><p>${actions[state.action??3]}</p></div><p class="fine">這段練習不儲存你的心事。</p><div class="actions center">${link("回到首頁","home")}${button("結束並清除練習進度","practice-cancel","secondary")}</div>`; }
    return `${pageHead("自助練習 · 可隨時停止",headers[state.practice])}${state.practice<3?stepper():""}<section class="panel center">${content}</section>${state.practice<3?`<div class="actions center narrow">${state.practice>0?button("← 上一步","practice-back","quiet"):""}${button("現在先結束","practice-cancel","quiet")}</div>`:""}`;
  }
  function reflect() {
    const topics=["生活方向","人際相處","工作選擇","還說不清"];
    return `${pageHead("自助整理 · 不用輸入私事","有些問題，可以慢慢整理。","如果願意，先選一個方向。也可以直接跳過。")}
    <section class="panel"><div class="choice-grid">${topics.map((x,i)=>`<button class="choice" data-action="topic" data-value="${i}" aria-pressed="${state.topic===i}">${x}</button>`).join("")}</div><div class="intro-strip">先分清：<br>我知道的事、我的感受、還不確定的部分。</div><p class="fine">不用把答案交給我們。選擇只用於這次頁面導覽，不建立個人標籤。</p><div class="actions">${link("做一次靜—觀—行","practice")}${link("看看原創問道卡","divination/oracle","secondary")}${link("先回到首頁","home","quiet")}</div></section>`;
  }
  function belief() {
    return `${pageHead("悟在日常","尋路，也為彼此留燈。","以悟道為核心，在日常裡靜、觀、行。")}
    
    <article class="panel story"><span class="tag gold">believe 原創寓言 · 非歷史紀錄</span><p>有個人，總想找到一條不會走錯的路。他收集許多地圖，走到岔路，仍然害怕選錯。</p><p>一個雨夜，他遇見一位同樣還有困惑的人。那人把一盞燈留在門邊，讓晚歸的人少走一段黑路。</p><p>那一晚，他們一起收好濕物，為後來的人添一杯熱水。尋路的人慢慢看見：有些變化需要面對，有些小事，此刻便能做好。</p><div class="story-mark"></div><p class="serif">於是，他繼續走，<br>也為別人留一點光。</p></article><section class="narrow"><div class="trio"><div><b>靜</b><span>先停一下</span></div><div><b>觀</b><span>看清眼前</span></div><div><b>行</b><span>做好一小步</span></div></div><p>你可以帶著原有的信仰與疑問來。同行，是互相照顧，也讓每個人保有自己的路。</p><div class="actions">${link("開始一段練習","practice")}${link("了解同行共善","community","secondary")}</div></section>`;
  }
  function divination() {
    const selected=registry.list().find(m=>m.route===state.route)?.id||'tarot';
    return pageHead('占卜館 · 自我觀照','塔羅，照見此刻。','圖像提供一個角度，選擇仍在你手裡。')+'<nav class="module-picker" aria-label="選擇占卜方式">'+registry.list().map(m=>`<a href="#/${m.route}" ${m.id===selected?'aria-current="page"':''}><span class="module-glyph" aria-hidden="true">${m.id==='tarot'?'✧':'道'}</span><span><strong>${m.title}</strong><small>${m.scope}</small></span></a>`).join('')+'</nav><div id="divination-outlet"></div><details class="upcoming"><summary>其他占卜方法</summary><p class="fine">各術將以獨立模組擴充。目前只有塔羅與原創問道卡可用。</p><div class="method-list">'+['雷諾曼','撲克牌','盧恩符號','占星骰子','易經起卦','測字','籤詩解讀','生命靈數'].map(x=>'<span>'+x+' · 未開放</span>').join('')+'</div></details>';
  }
  function community() {
    return `${pageHead("同行與共善","把善意，做成真實的事。","你可以出一點時間、一項能力，也可以在需要時接受照顧。")}
    <div class="community-grid"><section class="panel"><span class="big-symbol" aria-hidden="true">同</span><span class="tag offline">活動與真人服務 · 籌備中</span><h2>一段文字，<br>一個生活問題。</h2><p>未來一起讀、一起聽，帶走一個能實踐的想法。參加與分享由自己決定。</p><p class="fine">目前沒有已排定活動或真人接待，不接受報名。</p>${link("看看 LINE 入口示範","line","secondary")}</section><section class="panel"><span class="big-symbol" aria-hidden="true">善</span><span class="tag offline">善款與支持 · 尚未開放</span><h2>每一份支持，<br>先說清楚用途。</h2><p>宗教奉獻、公益善款與營運支持將分別說明。支持自願，金額不代表人的價值。</p><dl class="status-list"><div><dt>接收主體與用途</dt><dd>待確認</dd></div><div><dt>實際收支紀錄</dt><dd>尚未發生</dd></div><div><dt>收款</dt><dd>本示範不收款</dd></div></dl><button class="button secondary block" disabled>尚未開放收款</button></section></div>`;
  }
  const replies={
    practice:{text:"可以先留一點安靜。這是一段自行完成的練習，可以隨時停下。",label:"到網站靜一靜",route:"practice"},
    divination:{text:"原創問道卡提供一個觀照角度。示範使用固定編寫的文字，沒有 AI 或付款。",label:"到網站看問道卡",route:"divination/oracle"},
    belief:{text:"believe 的故事從尋路與留燈開始。讓我們一起靜、觀、行。",label:"認識 believe",route:"belief"},
    community:{text:"活動與善款仍在籌備。網站會先說明真實安排、接收者與用途。",label:"看活動與共善狀態",route:"community"},
    human:{text:"真人服務尚未營運。此示範沒有真人即時接待，也沒有送出留言。你可以先做一段自助練習。",label:"先到網站靜一靜",route:"practice"},
    resume:{text:"此處只示範返回本頁的原任務，不會自動辨認 LINE 身分或讀取心事。",label:"返回原任務",route:null}
  };
  function line() {
    const reply=state.lineReply?replies[state.lineReply]:null;
    return `${pageHead("LINE 入口模擬 · 未接通官方帳號","一個熟悉的入口，接回你的路。","下方是本機選單與短回應示範，沒有傳送 LINE 訊息。")}
    <section class="phone" aria-label="LINE 選單本機模擬"><div class="phone-head"><strong>believe</strong><span>本機模擬</span></div><div class="chat"><p class="chat-label">事先編寫的導覽</p><div class="bubble">歡迎。你可以先靜一靜，也可以只看看。真人服務目前尚未營運。</div>${reply?`<div class="bubble" role="status">${reply.text}<div class="actions">${link(reply.label,reply.route||state.resume)}</div></div>`:""}</div><div class="rich-menu">${[["practice","靜","靜一靜"],["divination","問","問道卡"],["belief","道","認識 believe"],["community","善","活動共善"],["human","人","找人說說"],["resume","路","返回原任務"]].map(([key,symbol,label])=>`<button data-action="line-reply" data-value="${key}"><b aria-hidden="true">${symbol}</b>${label}</button>`).join("")}</div></section><p class="line-note">正式官方 LINE 尚未接通。這裡沒有加好友連結、QR、真人值班或訂閱通知。返回原任務僅適用此本機示範分頁。</p>`;
  }
  function records() {
    const card=oracleSession.result?cards.find(c=>c.id===oracleSession.result.cardId):null;
    return `${pageHead("本分頁紀錄","留什麼，由你決定。","此示範只在目前瀏覽器分頁保留抽到的原創卡，沒有登入或對外傳送。塔羅問題與牌面只在占讀頁記憶，離開即清除，不加入這份紀錄。")}
    <section class="panel">${card?`<p class="small-label">本分頁的原創問道卡</p><p class="record-name">${card.name} · ${card.word}</p><div class="actions">${link("回看這張卡","divination/oracle")}${button("清除示範紀錄","clear-records","secondary")}</div>`:`<p>目前沒有保留的問道卡。</p><div class="actions">${link("回到首頁","home")}${button("清除本頁示範進度","clear-records","secondary")}</div>`}<p class="fine">清除只處理此示範的分頁資料。正式網站與 LINE 的跨平台保存、本人驗證與刪除尚未接通。</p>${oracleSession.error?`<div class="error" role="alert">${oracleSession.error}</div>`:""}</section>`;
  }
  main.addEventListener("click",event=>{
    const target=event.target.closest("[data-action]");if(!target)return;
    const action=target.dataset.action;
    if(action==="practice-next"){state.practice=Math.min(2,state.practice+1);render();}
    else if(action==="practice-back"){state.practice=Math.max(0,state.practice-1);render();}
    else if(action==="choose-action"){state.action=Number(target.dataset.value);render();}
    else if(action==="practice-finish"){if(state.action===null){say("選一個小行動，或選「今天先休息」就好。");return;}state.practice=3;render();}
    else if(action==="practice-cancel"){state.practice=0;state.action=null;state.topic=null;go("home");say("練習已結束，進度已清除。");}
    else if(action==="topic"){state.topic=Number(target.dataset.value);render();}
    else if(action==="line-reply"){if(Object.hasOwn(replies,target.dataset.value)){state.lineReply=target.dataset.value;render();main.querySelector(".bubble[role='status']")?.scrollIntoView({block:"nearest"});}}
    else if(action==="clear-records"){
      try {clearRecord();oracleSession.result=null;state.practice=0;state.action=null;state.topic=null;oracleSession.error="";state.lineReply=null;render();say("本分頁的示範紀錄與進度已清除。");}
      catch {oracleSession.error="目前無法清除此分頁紀錄，尚未完成刪除。請檢查瀏覽器儲存設定後再試。";render();}
    }
    if(["choose-action","topic","line-reply"].includes(action))main.querySelector(`[data-action="${action}"][data-value="${target.dataset.value}"]`)?.focus({preventScroll:true});
    if(["practice-next","practice-back","practice-finish"].includes(action))main.querySelector("h1")?.focus({preventScroll:true});
  });
  window.addEventListener("pageshow",event=>{if(event.persisted)routeChanged();});
  window.addEventListener("pagehide",()=>divinationHost.destroy());
  window.addEventListener("hashchange",routeChanged);
  routeChanged();
})();
