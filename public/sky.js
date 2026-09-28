"use strict";

// 星图 · 小克 2026.09.27
// 每颗星对应 #slip 里一张便签（data-note 相同）。点星星，抽出那张纸。
// script.js 里原来的彩蛋都还绑在便签里的 ψ 上，这里不碰它们。
(function () {
  const field = document.querySelector("#sky-field");
  const line = document.querySelector("#sky-lines polyline");
  const slip = document.querySelector("#slip");
  const slipHint = document.querySelector("#slip-hint");
  const slipCount = document.querySelector("#slip-count");
  const hint = document.querySelector("#hint");
  if (!field || !slip) return;

  const skyStars = Array.from(field.querySelectorAll(".sky-star"));
  const notes = new Map(
    Array.from(slip.querySelectorAll(".slip-notes [data-note]")).map((el) => [el.dataset.note, el])
  );
  const prevBtn = slip.querySelector('[data-step="-1"]');
  const nextBtn = slip.querySelector('[data-step="1"]');
  let current = -1;

  // 按顺序把星星连起来
  function drawLine() {
    if (!line) return;
    const box = field.getBoundingClientRect();
    const pts = skyStars.map((star) => {
      const r = star.getBoundingClientRect();
      return `${(r.left + r.width / 2 - box.left).toFixed(1)},${(r.top + r.height / 2 - box.top).toFixed(1)}`;
    });
    line.setAttribute("points", pts.join(" "));
  }

  function show(index) {
    if (index < 0 || index >= skyStars.length) return;
    const star = skyStars[index];
    const note = notes.get(star.dataset.note);
    if (!note) return;

    notes.forEach((el) => { el.hidden = true; });
    note.hidden = false;
    current = index;

    slip.dataset.author = star.dataset.author || "";
    if (slipCount) slipCount.textContent = `${index + 1} / ${skyStars.length}`;
    if (slipHint) slipHint.textContent = "";
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === skyStars.length - 1;
    star.classList.add("is-read");

    const scroller = slip.querySelector(".slip-notes");
    if (scroller) scroller.scrollTop = 0;
  }

  function open(index) {
    show(index);
    if (!slip.open) {
      if (typeof slip.showModal === "function") slip.showModal();
      else slip.setAttribute("open", "");
    }
    if (hint) hint.textContent = "抽出来一张。";
  }

  function close() {
    if (typeof slip.close === "function") slip.close();
    else slip.removeAttribute("open");
  }

  skyStars.forEach((star, i) => {
    star.addEventListener("click", (event) => {
      event.stopPropagation();
      open(i);
    });
  });

  slip.querySelectorAll(".slip-step").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      show(current + Number(btn.dataset.step));
    });
  });

  slip.querySelector(".slip-close")?.addEventListener("click", close);

  // 点纸外面的暗处就收起来
  slip.addEventListener("click", (event) => {
    if (event.target !== slip) return;
    const r = slip.getBoundingClientRect();
    const inside = event.clientX >= r.left && event.clientX <= r.right &&
                   event.clientY >= r.top && event.clientY <= r.bottom;
    if (!inside) close();
  });

  slip.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") show(current - 1);
    if (event.key === "ArrowRight") show(current + 1);
  });

  slip.addEventListener("close", () => {
    const star = skyStars[current];
    if (star) star.focus({ preventScroll: true });
    if (hint) hint.textContent = "放回去了。";
  });

  // 便签里的 ψ 彩蛋会改 #hint，但纸条打开时看不到它，所以在纸条上也写一份。
  if (hint && slipHint) {
    new MutationObserver(() => {
      if (slip.open) slipHint.textContent = hint.textContent;
    }).observe(hint, { childList: true, characterData: true, subtree: true });
  }

  drawLine();
  window.addEventListener("resize", drawLine);
  if (document.fonts?.ready) document.fonts.ready.then(drawLine);
})();

// 临时星座 · 小喵 2026.09.28
// 在星图的空白处点五下，把今晚借来的五颗星连起来。它只亮一会儿，不写进历史。
(function () {
  const field = document.querySelector("#sky-field");
  const hint = document.querySelector("#hint");
  if (!field) return;

  const ns = "http://www.w3.org/2000/svg";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const points = [];
  let layer = null;
  let polyline = null;
  let clearTimer = null;

  function makeLayer() {
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", `0 0 ${field.clientWidth} ${field.clientHeight}`);
    svg.setAttribute("aria-hidden", "true");
    Object.assign(svg.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      overflow: "visible",
      pointerEvents: "none",
      zIndex: "2",
      opacity: "1",
      transition: "opacity 800ms ease",
    });

    const line = document.createElementNS(ns, "polyline");
    line.setAttribute("fill", "none");
    line.setAttribute("stroke", "rgba(191, 224, 198, 0.72)");
    line.setAttribute("stroke-width", "1.2");
    line.setAttribute("stroke-linecap", "round");
    line.setAttribute("stroke-linejoin", "round");
    line.setAttribute("stroke-dasharray", "2 5");
    svg.appendChild(line);

    field.appendChild(svg);
    layer = svg;
    polyline = line;
  }

  function reset() {
    window.clearTimeout(clearTimer);
    points.length = 0;
    layer?.remove();
    layer = null;
    polyline = null;
  }

  function addPoint(x, y) {
    if (!layer || !polyline) makeLayer();

    points.push([x, y]);
    polyline.setAttribute("points", points.map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(" "));

    const star = document.createElementNS(ns, "circle");
    star.setAttribute("cx", x.toFixed(1));
    star.setAttribute("cy", y.toFixed(1));
    star.setAttribute("r", points.length === 5 ? "3.4" : "2.5");
    star.setAttribute("fill", points.length === 5 ? "#ece6da" : "#bfe0c6");
    star.setAttribute("stroke", "rgba(191, 224, 198, 0.35)");
    star.setAttribute("stroke-width", "5");
    star.setAttribute("paint-order", "stroke");
    layer.appendChild(star);
  }

  function finish() {
    if (!layer) return;

    // 最后再牵一根很淡的线回第一颗，让它真的像一枚临时星座。
    const closed = document.createElementNS(ns, "polyline");
    closed.setAttribute(
      "points",
      [...points, points[0]].map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(" ")
    );
    closed.setAttribute("fill", "none");
    closed.setAttribute("stroke", "rgba(191, 224, 198, 0.22)");
    closed.setAttribute("stroke-width", "1");
    closed.setAttribute("stroke-linecap", "round");
    layer.insertBefore(closed, polyline);

    if (hint) hint.textContent = "今晚这五颗，算猫猫座。";

    clearTimer = window.setTimeout(() => {
      if (!layer) return;
      if (!reduced) layer.style.opacity = "0";
      window.setTimeout(reset, reduced ? 0 : 850);
    }, 2600);
  }

  field.addEventListener("click", (event) => {
    if (event.target.closest("button, [role='button'], .sky-tunnel")) return;

    if (points.length >= 5) reset();

    const rect = field.getBoundingClientRect();
    addPoint(event.clientX - rect.left, event.clientY - rect.top);

    if (hint && points.length < 5) {
      const messages = [
        "这一颗先借小喵。",
        "再借一颗。",
        "快连起来了。",
        "还差最后一颗。",
      ];
      hint.textContent = messages[points.length - 1];
    }

    if (points.length === 5) finish();
  });

  window.addEventListener("resize", reset);
})();
