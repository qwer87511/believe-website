"use strict";
(() => {
  const main = document.querySelector("main");
  if (!main) return;
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let active = null;
  const route = () => location.hash.replace(/^#\/?/, "") || "home";
  const hint = () => motion.matches ? "已減少動態，啟動後直接前往問道卡。" : "輕觸牆面，讓牆後的路慢慢打開。";

  function stop({ focus = false, message = "" } = {}) {
    const run = active;
    if (!run) return;
    active = null;
    window.clearTimeout(run.timer);
    if (!run.portal.isConnected) return;
    run.portal.classList.remove("is-opening");
    run.start.setAttribute("aria-disabled", "false");
    run.start.setAttribute("aria-busy", "false");
    run.label.textContent = "推開這道牆";
    run.cancel.hidden = true;
    run.status.textContent = message || hint();
    if (focus) run.start.focus({ preventScroll: true });
  }

  function begin(portal) {
    if (active || route() !== "home" || !portal.isConnected) return;
    if (motion.matches) {
      location.hash = "/divination";
      return;
    }
    const run = {
      portal,
      start: portal.querySelector(".wall-trigger"),
      label: portal.querySelector(".wall-label"),
      cancel: portal.querySelector(".wall-cancel"),
      status: portal.querySelector(".wall-status"),
      timer: null
    };
    try {
      active = run;
      portal.classList.add("is-opening");
      run.start.setAttribute("aria-disabled", "true");
      run.start.setAttribute("aria-busy", "true");
      run.label.textContent = "牆面開啟中…";
      run.cancel.hidden = false;
      run.status.textContent = "牆面正在開啟，接著前往問道卡。";
      run.timer = window.setTimeout(() => {
        if (active !== run) return;
        const canContinue = route() === "home" && !document.hidden && portal.isConnected;
        stop();
        if (canContinue) location.hash = "/divination";
      }, 1100);
    } catch {
      stop({ message: "目前無法播放動畫，仍可直接開始占卜。" });
    }
  }

  function leaf(right) {
    const joints = right ? "M70 0v48M150 48v48M70 96v48M150 144v48M70 192v48M150 240v60" : "M140 0v48M60 48v48M140 96v48M60 144v48M140 192v48M60 240v60";
    const carving = right ? "M0 74a43 43 0 0 1 0 86M0 90c30 18-13 29 0 49" : "M210 74a43 43 0 0 0 0 86M210 90c-30 18 13 29 0 49";
    return `<span class="wall-leaf ${right ? "wall-right" : "wall-left"}"><svg viewBox="0 0 210 300" preserveAspectRatio="none"><rect width="210" height="300" fill="${right ? "#d9d6c5" : "#e5e0d0"}"/><path d="M0 48h210M0 96h210M0 144h210M0 192h210M0 240h210${joints}" fill="none" stroke="#b8b7a6" stroke-width="2"/><path d="M0 51h210M0 99h210M0 147h210M0 195h210M0 243h210" fill="none" stroke="#f2eddf" stroke-width="2"/><path d="${carving}" fill="none" stroke="#af9c72" stroke-width="2"/><path d="M${right ? 4 : 206} 0v300" stroke="#aca98f" stroke-width="3"/></svg></span>`;
  }

  function mount() {
    const hero = main.querySelector(".hero");
    if (route() !== "home" || !hero || hero.querySelector(".wall-portal")) return;
    hero.classList.add("wall-enhanced");
    hero.querySelector(".hero-art")?.remove();
    const portal = document.createElement("section");
    portal.className = "wall-portal";
    portal.setAttribute("aria-label", "推牆進入占卜的小互動");
    portal.innerHTML = `<div class="wall-stage"><button type="button" class="wall-trigger" data-wall-start aria-disabled="false" aria-busy="false" aria-describedby="wall-status"><span class="wall-scene" aria-hidden="true"><svg class="wall-landscape" viewBox="0 0 420 300" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="wall-sky" x2="0" y2="1"><stop stop-color="#f3eddb"/><stop offset="1" stop-color="#dbe6d5"/></linearGradient></defs><rect width="420" height="300" fill="url(#wall-sky)"/><circle cx="284" cy="65" r="27" fill="#cfb87d"/><path d="M0 192 90 83l76 72 65-44 123 83 66-35v141H0Z" fill="#b4c2a5"/><path d="M0 235 121 150l63 51 87-52 149 72v79H0Z" fill="#738c73"/><path d="M142 300c102-54-5-83 61-118l29-27 10 7c-51 42 58 66-3 138Z" fill="#efe6c9"/><path d="M190 300c64-50-37-74 29-133" fill="none" stroke="#ba9f67" stroke-width="2"/></svg><span class="wall-recess"></span>${leaf(false)}${leaf(true)}<span class="wall-sill"></span></span><span class="wall-label">推開這道牆</span></button><button type="button" class="button wall-cancel" data-wall-cancel hidden>取消動畫</button></div><p class="wall-status" id="wall-status" role="status" aria-live="polite">${hint()}</p>`;
    portal.addEventListener("click", event => {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest("[data-wall-cancel]")) stop({ focus: true, message: "已停下。你可以再推一次，或直接開始占卜。" });
      else if (event.target.closest("[data-wall-start]")) begin(portal);
    });
    hero.append(portal);
    // The older public homepage has no main direct-entry button. Keep this
    // enhancement independent of the unpublished homepage/Q1 changes.
    if (!hero.querySelector('a.button[href="#/divination"]')) {
      const actions = document.createElement("div");
      actions.className = "wall-home-actions";
      actions.innerHTML = '<a class="button" href="#/divination">開始占卜</a><span class="fine">直接進入 · 不播放動畫</span>';
      hero.firstElementChild.append(actions);
    }
  }

  new MutationObserver(() => { stop(); mount(); }).observe(main, { childList: true });
  document.addEventListener("click", event => {
    if (event.target instanceof Element && event.target.closest("a[href]")) stop();
  }, true);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && active) {
      event.preventDefault();
      stop({ focus: true, message: "已停下。你可以再推一次，或直接開始占卜。" });
    }
  });
  window.addEventListener("hashchange", () => stop());
  window.addEventListener("pagehide", () => stop());
  document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); });
  motion.addEventListener("change", () => {
    if (motion.matches) stop({ message: "已停止動畫，可直接開始占卜。" });
    const status = main.querySelector(".wall-status");
    if (status && !active) status.textContent = hint();
  });
  mount();
})();
