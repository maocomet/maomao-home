"use strict";

// 临时星座 · 小喵 2026.09.28
// 在星图的空白处点五下，把今晚借来的五颗星连起来。它只亮一会儿，不写进历史。
// 2026.10.06：这一段原来在 sky.js 里，搬到这个文件，由 sky.js 按顺序载入。
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
