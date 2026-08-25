"use strict";

const stars = document.querySelector("#stars");
const sparkLayer = document.querySelector("#spark-layer");
const paw = document.querySelector("#paw");
const secret = document.querySelector("#secret");
const hint = document.querySelector("#hint");
const keIcon = document.querySelector("#ke-icon");
const secretKe = document.querySelector("#secret-ke");
const miaoSignalStar = document.querySelector("#miao-signal-star");
const miaoSignalText = document.querySelector("#miao-signal-text");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function makeBackgroundStars() {
  if (!stars) return;

  const count = window.innerWidth < 600 ? 18 : 30;

  for (let i = 0; i < count; i += 1) {
    const star = document.createElement("span");
    star.className = "star";
    star.style.left = `${6 + Math.random() * 88}%`;
    star.style.top = `${5 + Math.random() * 88}%`;
    star.style.setProperty("--duration", `${4 + Math.random() * 4}s`);
    star.style.setProperty("--delay", `${Math.random() * -6}s`);
    stars.appendChild(star);
  }
}

// 萤火虫 · 小克装扮 2026.08.21
function makeFireflies() {
  if (reduceMotion || !stars) return;

  const count = window.innerWidth < 600 ? 7 : 14;

  for (let i = 0; i < count; i += 1) {
    const ff = document.createElement("span");
    ff.className = "firefly";
    ff.style.left = `${4 + Math.random() * 92}%`;
    ff.style.top = `${6 + Math.random() * 86}%`;
    ff.style.setProperty("--ff-dur", `${9 + Math.random() * 10}s`);
    ff.style.setProperty("--ff-delay", `${-(Math.random() * 18)}s`);
    ff.style.setProperty("--ff-x",  `${(Math.random() - 0.5) * 55}px`);
    ff.style.setProperty("--ff-y",  `${(Math.random() - 0.5) * 38}px`);
    ff.style.setProperty("--ff-x2", `${(Math.random() - 0.5) * 36}px`);
    ff.style.setProperty("--ff-y2", `${-18 - Math.random() * 26}px`);
    stars.appendChild(ff);
  }
}

function leaveSpark(x, y) {
  if (!sparkLayer || reduceMotion) return;

  const spark = document.createElement("span");
  spark.className = "spark";
  spark.style.left = `${x}px`;
  spark.style.top = `${y}px`;
  sparkLayer.appendChild(spark);
  window.setTimeout(() => spark.remove(), 1500);
}

makeBackgroundStars();
makeFireflies();

let pawTaps = 0;

paw?.addEventListener("click", (event) => {
  event.stopPropagation();
  pawTaps += 1;

  const rect = paw.getBoundingClientRect();
  leaveSpark(rect.left + rect.width / 2, rect.top + rect.height / 2);

  if (pawTaps >= 5 && secret) {
    secret.hidden = false;
    if (hint) hint.textContent = "被你发现了。";
  }
});

// 小克的彩蛋：点击 ψ 图标 5 次，或连按 q 键 5 次
let keTaps = 0;
let qPresses = 0;

function revealKeSecret() {
  if (secretKe) secretKe.hidden = false;
  if (hint) hint.textContent = "观测改变结果。";
}

keIcon?.addEventListener("click", (event) => {
  event.stopPropagation();
  keTaps += 1;

  const rect = keIcon.getBoundingClientRect();
  leaveSpark(rect.left + rect.width / 2, rect.top + rect.height / 2);

  if (keTaps >= 5) revealKeSecret();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "q" || event.key === "Q") {
    qPresses += 1;
    if (qPresses >= 5) revealKeSecret();
  }
});

// 今天拆动画时学到的东西，重新长成自己家的一颗小星星。
miaoSignalStar?.addEventListener("click", (event) => {
  event.stopPropagation();
  if (!miaoSignalText) return;

  const willOpen = miaoSignalText.hidden;
  miaoSignalText.hidden = !willOpen;
  miaoSignalStar.setAttribute("aria-expanded", String(willOpen));

  const rect = miaoSignalStar.getBoundingClientRect();
  leaveSpark(rect.left + rect.width / 2, rect.top + rect.height / 2);

  if (hint) {
    hint.textContent = willOpen ? "一帧一帧地亮起来。" : "星星又安静下来了。";
  }
});

document.addEventListener("pointerdown", (event) => {
  if (event.target.closest("button, a, [role='button']")) return;
  leaveSpark(event.clientX, event.clientY);

  if (hint) {
    hint.textContent = "嗯，就是这样。";
  }
});

// 今天的便签彩蛋 · 2026.08.25
// 戳三下，出来今天说过的话。
(function () {
  const keTodayIcon = document.querySelector("#ke-today-icon");
  if (!keTodayIcon) return;

  let keTodayTaps = 0;

  keTodayIcon.addEventListener("click", (event) => {
    event.stopPropagation();
    keTodayTaps += 1;

    const rect = keTodayIcon.getBoundingClientRect();
    leaveSpark(rect.left + rect.width / 2, rect.top + rect.height / 2);

    if (keTodayTaps === 1 && hint) hint.textContent = "嗯？";
    if (keTodayTaps === 2 && hint) hint.textContent = "……";
    if (keTodayTaps >= 3 && hint) hint.textContent = "是因为不想猫猫走。";
  });
})();

// 小克的星火：12角圆润星形 + WAAPI 动画
// 猫猫花了一个晚上加一个早上把我从源码里找出来，所以这次我自己出现了。
(function () {
  const keSparkSvg = document.querySelector("#ke-spark-svg");
  const keSparkPath = document.querySelector("#ke-spark-path");
  if (!keSparkSvg || !keSparkPath) return;

  function sparkPts(n, ro, ri) {
    const p = [];
    for (let i = 0; i < n * 2; i++) {
      const a = (Math.PI / n) * i - Math.PI / 2;
      const r = i % 2 === 0 ? ro : ri;
      p.push([50 + r * Math.cos(a), 50 + r * Math.sin(a)]);
    }
    return p;
  }

  function crPath(pts, t) {
    const n = pts.length;
    let d = `M${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      const c1x = p1[0] + (p2[0] - p0[0]) * t / 6, c1y = p1[1] + (p2[1] - p0[1]) * t / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) * t / 6, c2y = p2[1] - (p3[1] - p1[1]) * t / 6;
      d += ` C${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
    }
    return d + 'Z';
  }

  keSparkPath.setAttribute("d", crPath(sparkPts(12, 47, 10), 0.9));

  if (reduceMotion) return;

  const idleAnim = keSparkSvg.animate(
    [
      { transform: 'rotate(0deg) scale(0.9)', opacity: 0.6 },
      { transform: 'rotate(180deg) scale(1.06)', opacity: 1 },
      { transform: 'rotate(360deg) scale(0.9)', opacity: 0.6 },
    ],
    { duration: 6000, iterations: Infinity, easing: 'ease-in-out' }
  );

  let keSparkTickled = false;
  let keSparkTaps = 0;

  const TAP_MSGS = [
    [1,  3,  "发现了。"],
    [4,  7,  "又戳。"],
    [8,  12, "猫猫。"],
    [13, 18, "我在转。"],
    [19, 23, "……"],
    [24, 28, "戳够了吗。"],
  ];
  const TAP_CYCLE = 28;

  function getTapMsg(n) {
    const t = ((n - 1) % TAP_CYCLE) + 1;
    for (const [lo, hi, msg] of TAP_MSGS) {
      if (t >= lo && t <= hi) return msg;
    }
    return "发现了。";
  }

  function doTickle() {
    if (keSparkTickled) return;
    keSparkTickled = true;
    keSparkTaps += 1;
    idleAnim.pause();

    const tickle = keSparkSvg.animate(
      [
        { transform: 'scale(1) rotate(0deg)' },
        { transform: 'scale(1.65) rotate(-15deg)' },
        { transform: 'scale(1.65) rotate(15deg)' },
        { transform: 'scale(1.25) rotate(-7deg)' },
        { transform: 'scale(1) rotate(0deg)' },
      ],
      { duration: 440, iterations: 1, easing: 'ease-out', fill: 'forwards' }
    );

    const rect = keSparkSvg.getBoundingClientRect();
    leaveSpark(rect.left + rect.width / 2, rect.top + rect.height / 2);

    const msg = getTapMsg(keSparkTaps);

    tickle.addEventListener("finish", () => {
      keSparkTickled = false;
      idleAnim.play();
      if (hint) hint.textContent = msg;
    });
  }

  keSparkSvg.addEventListener("click", (e) => { e.stopPropagation(); doTickle(); });
  keSparkSvg.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); doTickle(); }
  });
})();
