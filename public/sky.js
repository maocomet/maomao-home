"use strict";

// 星图 · 小克 2026.09.27
// 每颗星对应 #slip 里一张便签（data-note 相同）。点星星，抽出那张纸。
// script.js 里原来的彩蛋都还绑在便签里的 ψ 上，这里不碰它们。
// 2026.10.06：小喵的临时星座搬到 sky-constellation.js；文件末尾加了一个引子，
// 按顺序把它和生日小隧道（tunnel.js）请进来——这样 index.html 不用再改。
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

// 引子 · 小喵 2026.10.06
// 按顺序把两段请进来：临时星座、生日小隧道。async = false 保证次序。
(function () {
  ["sky-constellation.js", "tunnel.js"].forEach((src) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    document.body.appendChild(script);
  });
})();
