/* =====================================================================
   SMART MUET GUIDE · Interactive eBook  (flipbook engine + activities)
   Uses StPageFlip (MIT) for the page-turn animation.
   ===================================================================== */
(function () {
  "use strict";
  const CFG = window.BOOK_CONFIG, UNITS = window.BOOK_UNITS, MEDIA = window.BOOK_MEDIA || [], LINKS = window.BOOK_LINKS || {};
  const N = CFG.totalPages;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const pad = n => String(n).padStart(2, "0");
  const imgSrc = n => CFG.pagePattern.replace("{nn}", pad(n));
  const h = (t, a = {}, ...c) => {
    const e = document.createElement(t);
    for (const k in a) {
      if (k === "class") e.className = a[k];
      else if (k.startsWith("on")) e.addEventListener(k.slice(2), a[k]);
      else if (k === "html") e.innerHTML = a[k];
      else if (a[k] !== false && a[k] != null) e.setAttribute(k, a[k]);
    }
    c.flat().forEach(x => { if (x != null && x !== false) e.append(x.nodeType ? x : document.createTextNode(x)); });
    return e;
  };
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* ---------------- saved progress ---------------- */
  let state = { units: {}, last: 0, sound: true, hinted: false };
  try { Object.assign(state, JSON.parse(localStorage.getItem(CFG.STORAGE_KEY) || "{}")); } catch (e) {}
  const save = () => { try { localStorage.setItem(CFG.STORAGE_KEY, JSON.stringify(state)); } catch (e) {} };
  const isComplete = u => !!(state.units[u.id] && state.units[u.id].complete);
  const unitScore = u => state.units[u.id] && state.units[u.id].best;
  const firstIncomplete = () => UNITS.find(u => !isComplete(u));

  /* ---------------- toast ---------------- */
  let toastT;
  function toast(msg, ms = 3200) {
    const t = $("#toast"); t.textContent = msg; t.hidden = false;
    clearTimeout(toastT); toastT = setTimeout(() => (t.hidden = true), ms);
  }

  /* ---------------- build pages ---------------- */
  const bookEl = $("#book");
  const imgs = [];
  const pageEls = [];
  for (let i = 1; i <= N; i++) {
    const page = h("div", { class: "page", "data-density": i === 1 ? "hard" : "soft" });
    const img = h("img", { class: "pg", alt: "Page " + i, draggable: "false", decoding: "async" });
    img.dataset.src = imgSrc(i);
    page.append(img);
    (LINKS[i] || []).forEach(l => {
      const px = 0.6, py = 0.55;
      const a = h("a", { class: "hot", href: l.url || "#", role: "link", "aria-label": l.url ? "Open link" : "Go to page " + l.page });
      a.style.cssText = `left:${Math.max(0, l.x - px)}%;top:${Math.max(0, l.y - py)}%;width:${l.w + px * 2}%;height:${l.h + py * 2}%`;
      if (l.page) a.dataset.page = l.page; else a.dataset.url = l.url;
      page.append(a);
    });
    MEDIA.filter(m => m.page === i).forEach((m, k) => {
      const b = h("button", { class: "hot media", type: "button", "data-media": MEDIA.indexOf(m) }, m.label || "▶ Play");
      b.style.cssText = `left:${m.x}%;top:${m.y}%;width:${m.w}%;height:${m.h}%`;
      page.append(b);
    });
    imgs.push(img); pageEls.push(page); bookEl.append(page);
  }
  function ensureImages(center) {
    for (let i = Math.max(0, center - 3); i <= Math.min(N - 1, center + 7); i++)
      if (!imgs[i].src) imgs[i].src = imgs[i].dataset.src;
  }
  ensureImages(state.last || 0);

  /* ---------------- flipbook ---------------- */
  const pf = new St.PageFlip(bookEl, {
    width: 500, height: 707, size: "stretch",
    minWidth: 240, maxWidth: 760, minHeight: 340, maxHeight: 1075,
    showCover: true, maxShadowOpacity: 0.45, drawShadow: true, flippingTime: 750,
    usePortrait: true, mobileScrollSupport: false, swipeDistance: 22,
    clickEventForward: true, useMouseEvents: true, startPage: Math.min(state.last || 0, N - 1), autoSize: true
  });
  pf.loadFromHTML(pageEls);

  const portrait = () => pf.getOrientation() === "portrait";
  const leftOf = idx => (portrait() || idx === 0) ? idx : (idx % 2 === 1 ? idx : idx - 1);
  const visible = cur => { if (portrait() || cur === 0) return [cur]; return cur + 1 < N ? [cur, cur + 1] : [cur]; };

  /* ---------------- navigation with unit gating ---------------- */
  function gate(targetIdx) {          // returns the unit that blocks, or null
    if (!CFG.REQUIRE_COMPLETE) return null;
    const u = firstIncomplete();
    if (u && leftOf(targetIdx) > u.end - 1) return u;
    return null;
  }
  function goTo(pageNum, opts = {}) {
    let idx = Math.max(0, Math.min(N - 1, pageNum - 1));
    const blocker = gate(idx);
    if (blocker) {
      toast(`Finish the “${blocker.title}” checkpoint to keep going.`);
      idx = blocker.end - 1;
      setTimeout(() => openUnit(blocker), 450);
    }
    const cur = pf.getCurrentPageIndex();
    ensureImages(idx);
    if (Math.abs(leftOf(idx) - cur) > 3 || opts.jump) pf.turnToPage(leftOf(idx)); else pf.flip(leftOf(idx));
  }
  function step(dir) {
    const cur = pf.getCurrentPageIndex();
    const span = portrait() ? 1 : (cur === 0 && dir > 0 ? 1 : 2);
    const target = dir > 0 ? cur + span : cur - 1;
    if (dir > 0) {
      const b = gate(portrait() ? target : target);
      if (b) { toast(`Finish the “${b.title}” checkpoint to keep going.`); openUnit(b); return; }
      if (cur >= N - 1 || (!portrait() && cur + 1 >= N - 1 && cur !== 0)) { if (visible(cur).includes(N - 1)) return; }
      pf.flipNext();
    } else pf.flipPrev();
  }
  $("#btnNext").onclick = () => step(1);
  $("#btnPrev").onclick = () => step(-1);
  $("#btnFirst").onclick = () => goTo(1, { jump: true });
  $("#btnLast").onclick = () => goTo(N, { jump: true });
  $("#slider").addEventListener("input", e => { $("#pageLbl").textContent = "Page " + e.target.value; });
  $("#slider").addEventListener("change", e => goTo(+e.target.value));
  document.addEventListener("keydown", e => {
    if (!$("#modal").hidden || !$("#mediaModal").hidden) { if (e.key === "Escape") { closeModal(); closeMedia(); } return; }
    if (/INPUT|TEXTAREA/.test(document.activeElement.tagName) && document.activeElement.type !== "range") return;
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "Escape") closeDrawer();
  });

  /* ---------------- UI refresh ---------------- */
  let lastPrompted = null;
  function onFlip() {
    const cur = pf.getCurrentPageIndex();
    // swipe/drag past an unfinished unit → bounce back
    const b = gate(cur);
    if (b) { toast(`Finish the “${b.title}” checkpoint to keep going.`); setTimeout(() => { pf.turnToPage(leftOf(b.end - 1)); openUnit(b); }, 250); return; }
    state.last = cur; save();
    ensureImages(cur);
    refresh();
    // checkpoint auto-prompt (once per unit per visit)
    const vis = visible(cur);
    const u = UNITS.find(x => vis.includes(x.end - 1));
    if (u && !isComplete(u) && lastPrompted !== u.id) { lastPrompted = u.id; setTimeout(() => { if (modalClosed()) openUnit(u); }, 900); }
  }
  pf.on("flip", onFlip);
  pf.on("changeOrientation", () => { refresh(); });
  pf.on("changeState", e => { if (e.data === "flipping") playFlip(); });

  function pageLabel(cur) {
    const v = visible(cur);
    if (v.length === 1) return v[0] === 0 ? "Cover" : "Page " + (v[0] + 1);
    return "Pages " + (v[0] + 1) + "–" + (v[1] + 1);
  }
  function refresh() {
    const cur = pf.getCurrentPageIndex(), v = visible(cur);
    $("#pageLbl").textContent = pageLabel(cur);
    $("#slider").value = v[0] + 1;
    $("#btnPrev").disabled = cur === 0;
    $("#btnNext").disabled = v.includes(N - 1);
    const done = UNITS.filter(isComplete).length;
    $("#progTxt").textContent = `${done} / ${UNITS.length} units`;
    $("#progBar").style.width = (done / UNITS.length * 100) + "%";
    const u = UNITS.find(x => v.includes(x.end - 1)), cp = $("#cpBtn");
    if (u) {
      cp.hidden = false; cp.classList.toggle("done", isComplete(u));
      cp.textContent = isComplete(u) ? `✔ Unit ${u.id} checkpoint done · Review` : `${u.icon} Start Unit ${u.id} checkpoint`;
      cp.onclick = () => openUnit(u);
    } else cp.hidden = true;
    renderToc(); markThumbs(cur);
  }

  /* ---------------- page clicks (links / media / jumps) ---------------- */
  let lastClick = 0;
  bookEl.addEventListener("click", e => {
    const a = e.target.closest(".hot"); if (!a) return;
    e.preventDefault();
    const now = Date.now(); if (now - lastClick < 350) return; lastClick = now;
    if (a.dataset.media != null) return playMedia(MEDIA[+a.dataset.media], a);
    if (a.dataset.page) return goTo(+a.dataset.page);
    const url = a.dataset.url || "";
    const yt = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]{11})/);
    if (yt) return openMedia({ type: "youtube", id: yt[1], url });
    window.open(url, "_blank", "noopener");
  });
  // some touch browsers swallow click on page children → also listen for pointerup on hotspots
  bookEl.addEventListener("pointerup", e => {
    if (e.pointerType !== "touch") return;
    const a = e.target.closest(".hot"); if (!a) return;
    setTimeout(() => { if (Date.now() - lastClick > 350) a.click(); }, 60);
  });

  /* ---------------- drawer ---------------- */
  const drawer = $("#drawer"), scrim = $("#scrim");
  function openDrawer() { drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); scrim.hidden = false; renderToc(); renderThumbs(); }
  function closeDrawer() { drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); scrim.hidden = true; }
  $("#btnToc").onclick = openDrawer; $("#btnCloseDrawer").onclick = closeDrawer; scrim.onclick = closeDrawer;
  $$(".tab").forEach(t => t.onclick = () => {
    $$(".tab").forEach(x => x.classList.toggle("on", x === t));
    $("#tocPane").hidden = t.dataset.tab !== "toc"; $("#pagesPane").hidden = t.dataset.tab !== "pages";
  });
  function renderToc() {
    const box = $("#tocPane"); box.textContent = "";
    const row = (ic, color, title, sub, page, st) => h("button", { class: "toc-row", onclick: () => { closeDrawer(); goTo(page); } },
      h("span", { class: "toc-ic", style: "background:" + color }, ic), h("span", {}, h("b", {}, title), h("small", {}, sub)), st);
    box.append(h("div", { class: "toc-sec" }, "Start"));
    box.append(row("📕", "#17151E", "Cover", "Page 1", 1), row("📑", "#5E5868", "Contents", "Page 2", 2), row("🚀", "#FF751F", "Start here", "Page 3", 3));
    box.append(h("div", { class: "toc-sec" }, "Units + checkpoints"));
    const first = firstIncomplete();
    UNITS.forEach(u => {
      const sc = unitScore(u);
      const st = isComplete(u) ? h("span", { class: "toc-st ok" }, "✔ " + Math.round(sc.score / sc.total * 100) + "%")
        : (CFG.REQUIRE_COMPLETE && first && u.id > first.id) ? h("span", { class: "toc-st lock" }, "🔒")
        : h("span", { class: "toc-st todo" }, "To do");
      const r = row(u.icon, u.color, `Unit ${u.id} · ${u.title}`, `Pages ${u.from}–${u.end} · checkpoint at page ${u.end}`, u.from, st);
      box.append(r);
      box.append(h("button", { class: "link", style: "display:block;margin:-2px 0 10px 56px", onclick: () => { closeDrawer(); openUnit(u); } }, "Open checkpoint →"));
    });
  }
  function renderThumbs() {
    const box = $("#pagesPane"); if (box.childElementCount) return;
    const g = h("div", { class: "thumbs" });
    for (let i = 1; i <= N; i++) {
      const im = h("img", { alt: "Page " + i, loading: "lazy", src: imgSrc(i) });
      g.append(h("button", { class: "thumb", "data-p": i, onclick: () => { closeDrawer(); goTo(i); } }, im, "p. " + i));
    }
    box.append(g); markThumbs(pf.getCurrentPageIndex());
  }
  function markThumbs(cur) { const v = visible(cur).map(x => x + 1); $$(".thumb").forEach(t => t.classList.toggle("cur", v.includes(+t.dataset.p))); }
  $("#btnReset").onclick = () => {
    if (confirm("Reset all checkpoint scores and your saved page on this device?")) {
      state.units = {}; state.last = 0; save(); lastPrompted = null; refresh(); goTo(1, { jump: true }); closeDrawer(); toast("Progress reset.");
    }
  };

  /* ---------------- header buttons ---------------- */
  $("#btnLinks").onclick = e => { document.body.classList.toggle("show-hots"); e.currentTarget.classList.toggle("on"); };
  const sndBtn = $("#btnSound");
  const paintSnd = () => { sndBtn.textContent = state.sound ? "🔊" : "🔇"; };
  sndBtn.onclick = () => { state.sound = !state.sound; save(); paintSnd(); };
  paintSnd();
  function focusMode(on) {
    document.body.classList.toggle("focus", on); $("#btnExit").hidden = !on;
    try { if (on && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
          if (!on && document.fullscreenElement) document.exitFullscreen(); } catch (e) {}
    setTimeout(() => window.dispatchEvent(new Event("resize")), 250);
  }
  $("#btnFocus").onclick = () => focusMode(!document.body.classList.contains("focus"));
  $("#btnExit").onclick = () => focusMode(false);
  document.addEventListener("fullscreenchange", () => { if (!document.fullscreenElement && document.body.classList.contains("focus")) focusMode(false); });

  /* ---------------- page-turn sound (WebAudio, no files needed) ---------------- */
  let ac;
  function playFlip() {
    if (!state.sound) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const len = ac.sampleRate * 0.28, buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) { const t = i / len; d[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * t) * Math.pow(1 - t, 0.6) * 0.5; }
      const s = ac.createBufferSource(); s.buffer = buf;
      const f = ac.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 2400; f.Q.value = 0.7;
      const g = ac.createGain(); g.gain.value = 0.35;
      s.connect(f); f.connect(g); g.connect(ac.destination); s.start();
    } catch (e) {}
  }

  /* ---------------- text-to-speech (device voice) ---------------- */
  let speaking = null;
  function stopSpeak() { try { speechSynthesis.cancel(); } catch (e) {} if (speaking) { speaking.btn && speaking.btn.classList.remove("playing"); speaking = null; } }
  function speak(lines, times, btn) {
    if (!("speechSynthesis" in window)) return toast("Audio voice is not supported on this device.");
    if (speaking && speaking.btn === btn) return stopSpeak();
    stopSpeak();
    const voices = speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang));
    const pref = voices.filter(v => /en[-_](GB|MY|SG|AU|IN)/i.test(v.lang)).concat(voices);
    const who = {}; let k = 0;
    const seq = []; for (let r = 0; r < (times || 1); r++) lines.forEach(l => seq.push([l, r]));
    speaking = { btn }; btn && btn.classList.add("playing");
    let i = 0;
    const next = () => {
      if (!speaking || speaking.btn !== btn) return;
      if (i >= seq.length) return stopSpeak();
      const [[name, text], round] = seq[i++];
      if (name && !(name in who)) who[name] = k++;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-GB"; u.rate = 0.92;
      const idx = name ? who[name] : 0;
      if (pref.length) u.voice = pref[(idx % 2 === 1 && pref.length > 1) ? 1 : 0];
      u.pitch = idx % 2 === 1 ? 0.8 : 1.15;
      u.onend = () => setTimeout(next, (i < seq.length && seq[i][1] !== round) ? 1800 : 350);
      u.onerror = () => stopSpeak();
      speechSynthesis.speak(u);
    };
    next();
  }
  if ("speechSynthesis" in window) speechSynthesis.getVoices();

  /* ---------------- media (audio / video / YouTube / tts) ---------------- */
  function playMedia(m, btn) {
    if (m.type === "tts") return speak(m.lines, m.times, btn);
    openMedia(m);
  }
  function openMedia(m) {
    const sh = $("#mediaSheet"); sh.textContent = "";
    sh.append(h("div", { class: "mhead", style: "background:#17151E" }, h("span", { class: "em" }, "🎬"),
      h("div", {}, h("h2", {}, m.label ? m.label.replace(/^[▶🔊\s]+/, "") : "Media"), h("small", {}, "Plays inside the eBook")),
      h("button", { class: "x", onclick: closeMedia, "aria-label": "Close" }, "✕")));
    const body = h("div", { class: "mbody" });
    if (m.type === "youtube") {
      body.append(h("iframe", { src: `https://www.youtube-nocookie.com/embed/${m.id}?rel=0&autoplay=1`, allow: "autoplay; encrypted-media; picture-in-picture", allowfullscreen: "", title: "Video" }));
      sh.append(body, h("div", { class: "mfoot" }, h("span", { class: "note" }, "Video not showing?"),
        h("a", { class: "btn alt", href: m.url || `https://youtu.be/${m.id}`, target: "_blank", rel: "noopener" }, "Open on YouTube")));
    } else if (m.type === "video") { body.append(h("video", { src: m.src, controls: "", autoplay: "", playsinline: "" })); sh.append(body); }
    else { body.append(h("audio", { src: m.src, controls: "", autoplay: "" })); sh.append(body); }
    $("#mediaModal").hidden = false;
  }
  function closeMedia() { $("#mediaModal").hidden = true; $("#mediaSheet").textContent = ""; }
  $("#mediaModal").addEventListener("click", e => { if (e.target.id === "mediaModal") closeMedia(); });

  /* =====================================================================
     CHECKPOINT ACTIVITIES
     ===================================================================== */
  const STEPS = [
    { key: "mcq", label: "Multiple choice", icon: "🔘" },
    { key: "tf", label: "True / False", icon: "✅" },
    { key: "fill", label: "Fill in the blank", icon: "✏️" },
    { key: "match", label: "Matching", icon: "🔗" }
  ];
  let S = null;                         // current session
  const modal = $("#modal"), sheet = $("#sheet");
  const modalClosed = () => modal.hidden;
  function closeModal() { modal.hidden = true; stopSpeak(); }
  modal.addEventListener("click", e => { if (e.target === modal && !(CFG.REQUIRE_COMPLETE && S && !isComplete(S.u) && false)) closeModal(); });

  function newSession(u) {
    return {
      u, tab: 0,
      mcq: { order: u.mcq.map(q => shuffle(q.options.map((t, i) => ({ t, i })))), picked: [], done: false },
      tf: { picked: [], done: false },
      fill: { vals: [], res: [], done: false },
      match: { right: shuffle(u.match.pairs.map((p, i) => i)), map: {}, sel: null, res: null, done: false }
    };
  }
  function openUnit(u, force) {
    if (!modal.hidden && S && S.u === u && !force) return;
    stopSpeak(); S = newSession(u); modal.hidden = false; renderSheet();
  }
  const scoreOf = (k) => {
    const u = S.u;
    if (k === "mcq") return [S.mcq.picked.filter((p, i) => p === u.mcq[i].answer).length, u.mcq.length];
    if (k === "tf") return [S.tf.picked.filter((p, i) => p === u.tf[i].answer).length, u.tf.length];
    if (k === "fill") return [S.fill.res.filter(Boolean).length, u.fill.length];
    return [S.match.res ? S.match.res.filter(Boolean).length : 0, u.match.pairs.length];
  };
  const totals = () => STEPS.reduce((a, s) => { const [x, y] = scoreOf(s.key); return [a[0] + x, a[1] + y]; }, [0, 0]);
  const allDone = () => STEPS.every(s => S[s.key].done);

  function renderSheet() {
    const u = S.u, onResult = S.tab === 4;
    sheet.textContent = "";
    sheet.append(h("div", { class: "mhead", style: "background:" + u.color },
      h("span", { class: "em" }, u.icon),
      h("div", {}, h("h2", { id: "mTitle" }, `Unit ${u.id} checkpoint`), h("small", {}, u.title)),
      h("button", { class: "x", onclick: closeModal, "aria-label": "Close" }, "✕")));
    sheet.append(h("div", { class: "steps" }, STEPS.map((s, i) =>
      h("button", { class: "step" + (S.tab === i ? " cur" : "") + (S[s.key].done ? " done" : ""),
        onclick: () => { if (canVisit(i)) { S.tab = i; renderSheet(); } } }, h("span", {}, S[s.key].done ? "✔" : s.icon), s.label))));
    const body = h("div", { class: "mbody" });
    const foot = h("div", { class: "mfoot" });
    sheet.append(body, foot);
    if (onResult) return renderResult(body, foot);
    const key = STEPS[S.tab].key;
    ({ mcq: rMcq, tf: rTf, fill: rFill, match: rMatch })[key](body, foot);
  }
  const canVisit = i => !CFG.REQUIRE_COMPLETE || i <= S.tab || STEPS.slice(0, i).every(s => S[s.key].done);

  function footer(foot, doneKey, extra) {
    const [x, y] = scoreOf(doneKey);
    const last = S.tab === 3;
    foot.append(
      h("span", { class: "sc" }, S[doneKey].done ? `Score: ${x} / ${y}` : `Answer all ${y} to continue`),
      h("div", { style: "display:flex;gap:8px" },
        S.tab > 0 ? h("button", { class: "btn alt", onclick: () => { S.tab--; renderSheet(); } }, "‹ Back") : null,
        extra,
        h("button", { class: "btn go", disabled: !S[doneKey].done && CFG.REQUIRE_COMPLETE, onclick: () => { S.tab++; renderSheet(); } }, last ? "See my results ›" : "Next ›")));
  }
  const sayBtn = (lines) => h("button", { class: "say", type: "button", onclick: e => speak(lines, 1, e.currentTarget) }, "🔊 Listen");

  /* ---- 1 · multiple choice ---- */
  function rMcq(body, foot) {
    const u = S.u, st = S.mcq;
    body.append(h("p", { class: "intro" }, "Tap the best answer. You get feedback straight away."));
    u.mcq.forEach((q, qi) => {
      const card = h("div", { class: "q" });
      card.append(h("div", { class: "qt" }, h("i", {}, (qi + 1) + "."), q.q));
      if (q.say) card.append(sayBtn(q.say));
      const box = h("div", { class: "opts" });
      st.order[qi].forEach((o, oi) => {
        const picked = st.picked[qi] !== undefined, isPick = st.picked[qi] === o.i, isAns = o.i === q.answer;
        box.append(h("button", { class: "opt" + (picked ? (isAns ? " ok" : isPick ? " bad" : "") : ""), disabled: picked,
          onclick: () => { st.picked[qi] = o.i; if (st.picked.filter(x => x !== undefined).length === u.mcq.length) { st.done = true; recordPartial(); } renderSheet(); } },
          h("b", {}, "ABCDEF"[oi]), o.t));
      });
      card.append(box);
      if (st.picked[qi] !== undefined) card.append(h("div", { class: "why " + (st.picked[qi] === q.answer ? "ok" : "bad") }, (st.picked[qi] === q.answer ? "✔ Correct. " : "✖ Not quite. ") + q.why));
      body.append(card);
    });
    footer(foot, "mcq");
  }
  /* ---- 2 · true / false ---- */
  function rTf(body, foot) {
    const u = S.u, st = S.tf;
    body.append(h("p", { class: "intro" }, "Is each statement true or false?"));
    u.tf.forEach((q, qi) => {
      const p = st.picked[qi], answered = p !== undefined;
      const card = h("div", { class: "q" }, h("div", { class: "qt" }, h("i", {}, (qi + 1) + "."), q.q));
      const row = h("div", { class: "tfrow" });
      [true, false].forEach(v => row.append(h("button", { class: "opt" + (answered ? (v === q.answer ? " ok" : p === v ? " bad" : "") : ""), disabled: answered,
        onclick: () => { st.picked[qi] = v; if (st.picked.filter(x => x !== undefined).length === u.tf.length) { st.done = true; recordPartial(); } renderSheet(); } }, v ? "👍 True" : "👎 False")));
      card.append(row);
      if (answered) card.append(h("div", { class: "why " + (p === q.answer ? "ok" : "bad") }, (p === q.answer ? "✔ Correct. " : "✖ Not quite. ") + q.why));
      body.append(card);
    });
    footer(foot, "tf");
  }
  /* ---- 3 · fill in the blank ---- */
  const norm = s => String(s).toLowerCase().replace(/[“”"'’.,]/g, "").replace(/\s+/g, " ").trim();
  function rFill(body, foot) {
    const u = S.u, st = S.fill;
    body.append(h("p", { class: "intro" }, "Type the missing word or number, then press “Check answers”."));
    const inputs = [];
    u.fill.forEach((q, qi) => {
      const parts = q.q.split("___");
      const inp = h("input", { type: "text", autocomplete: "off", autocapitalize: "off", spellcheck: "false", "aria-label": "Answer " + (qi + 1), value: st.vals[qi] || "" });
      if (st.done) { inp.disabled = true; inp.classList.add(st.res[qi] ? "ok" : "bad"); }
      inp.addEventListener("input", () => { st.vals[qi] = inp.value; });
      inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); (inputs[qi + 1] || inp).focus(); } });
      inputs.push(inp);
      const card = h("div", { class: "q" }, h("div", { class: "qt fillq" }, h("i", {}, (qi + 1) + "."), parts[0], inp, parts[1] || ""));
      if (st.done) card.append(h("div", { class: "why " + (st.res[qi] ? "ok" : "bad") },
        (st.res[qi] ? "✔ Correct. " : `✖ Answer: ${q.answers[0]}. `) + q.why));
      body.append(card);
    });
    const check = h("button", { class: "btn", disabled: st.done, onclick: () => {
      st.res = u.fill.map((q, i) => q.answers.some(a => norm(a) === norm(st.vals[i] || "")));
      st.done = true; recordPartial(); renderSheet();
    } }, "Check answers");
    footer(foot, "fill", st.done ? null : check);
  }
  /* ---- 4 · matching (tap a left item, then its partner) ---- */
  function rMatch(body, foot) {
    const u = S.u, st = S.match, pairs = u.match.pairs;
    body.append(h("p", { class: "intro" }, u.match.title + ". Tap an item on the left, then tap its partner on the right. Tap again to undo."));
    const g = h("div", { class: "mt" }, h("h4", {}, "Items"), );
    g.firstChild.style.gridColumn = "1"; g.append(h("h4", { style: "grid-column:2" }, "Partners"));
    const colorOfRight = {}; Object.keys(st.map).forEach(l => { colorOfRight[st.map[l]] = +l; });
    const L = h("div", { style: "display:grid;gap:10px" }), R = h("div", { style: "display:grid;gap:10px" });
    pairs.forEach((p, i) => {
      const paired = st.map[i] !== undefined;
      const cls = "mi" + (st.sel === i ? " sel" : "") + (paired ? " c" + (i % 6) : "") + (st.res ? (st.res[i] ? " ok" : " bad") : "");
      const b = h("button", { class: cls, disabled: st.done, onclick: () => {
        if (paired) { delete st.map[i]; st.sel = i; } else st.sel = (st.sel === i ? null : i);
        renderSheet();
      } }, p[0]);
      if (st.res && !st.res[i]) b.append(h("em", {}, "✖ Correct: " + pairs[i][1]));
      L.append(b);
    });
    st.right.forEach(ri => {
      const owner = colorOfRight[ri], paired = owner !== undefined;
      const resOk = st.res && paired ? st.res[owner] : null;
      const b = h("button", { class: "mi" + (paired ? " c" + (owner % 6) : "") + (resOk === true ? " ok" : resOk === false ? " bad" : ""), disabled: st.done, onclick: () => {
        if (paired) { delete st.map[owner]; st.sel = owner; renderSheet(); return; }
        if (st.sel == null) return toast("Tap an item on the left first.", 1800);
        st.map[st.sel] = ri; st.sel = null; renderSheet();
      } }, pairs[ri][1]);
      R.append(b);
    });
    g.append(L, R); body.append(g);
    const ready = Object.keys(st.map).length === pairs.length;
    const check = h("button", { class: "btn", disabled: !ready || st.done, onclick: () => {
      st.res = pairs.map((p, i) => st.map[i] === i); st.done = true; st.sel = null; recordPartial(); renderSheet();
    } }, "Check matches");
    if (st.done) body.append(h("div", { class: "why " + (st.res.every(Boolean) ? "ok" : "bad") }, st.res.every(Boolean) ? "✔ Perfect match!" : "Review the correct partners shown in red, then continue."));
    footer(foot, "match", st.done ? null : check);
  }

  /* ---- results + saving ---- */
  function recordPartial() { /* hook: could save per-step progress */ }
  function medal(p) { return p >= 90 ? ["🥇", "Gold!"] : p >= 70 ? ["🥈", "Silver!"] : p >= 50 ? ["🥉", "Bronze!"] : ["💪", "Keep going!"]; }
  function renderResult(body, foot) {
    const u = S.u, [x, y] = totals(), p = Math.round(x / y * 100);
    const pass = p >= (CFG.PASS_PERCENT || 0);
    const prev = unitScore(u);
    if (pass) {
      const wasDone = isComplete(u);
      if (!prev || x / y >= prev.score / prev.total) state.units[u.id] = { complete: true, best: { score: x, total: y } };
      else state.units[u.id].complete = true;
      save(); refresh();
      if (!wasDone && state.units[u.id].complete) setTimeout(() => toast(`🎉 Unit ${u.id} complete! Keep turning pages.`), 300);
    }
    const [m, mt] = medal(p);
    body.append(h("div", { class: "result" },
      h("div", { class: "medal" }, pass ? m : "🔁"),
      h("h3", {}, pass ? `${mt} ${x} / ${y} (${p}%)` : `${x} / ${y} (${p}%) — you need ${CFG.PASS_PERCENT}% to unlock the next unit`),
      h("div", { class: "bk" }, STEPS.map(s => { const [a, b] = scoreOf(s.key); return h("div", {}, h("span", {}, s.icon + " " + s.label), h("span", {}, a + " / " + b)); })),
      h("p", { class: "note" }, pass ? "Your best score is saved on this device. You can retry any time to improve it." : "Try again, and read the unit pages first if you need to.")));
    foot.append(
      h("button", { class: "btn alt", onclick: () => { openUnit(u, true); } }, "↻ Try again"),
      h("button", { class: "btn go", disabled: !pass, onclick: () => { closeModal(); const cur = pf.getCurrentPageIndex(); if (visible(cur).includes(u.end - 1) && !visible(cur).includes(N - 1)) setTimeout(() => step(1), 250); } },
        u.id === UNITS.length ? "Finish ✔" : "Continue reading ›"));
  }

  /* ---------------- start ---------------- */
  refresh();
  if (!state.hinted) { const hint = $("#hint"); hint.hidden = false; setTimeout(() => { hint.hidden = true; state.hinted = true; save(); }, 6500); }
  else if (state.last > 0) toast(`Welcome back! Continuing from ${pageLabel(state.last).toLowerCase()}.`, 3000);
  window.addEventListener("resize", () => setTimeout(refresh, 300));
  window.SmartMuetBook = { goTo, openUnit: id => openUnit(UNITS.find(u => u.id === id)), pf };
})();
