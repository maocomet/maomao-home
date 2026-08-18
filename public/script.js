"use strict";

const stars = document.querySelector("#stars");
const sparkLayer = document.querySelector("#spark-layer");
const paw = document.querySelector("#paw");
const secret = document.querySelector("#secret");
const hint = document.querySelector("#hint");

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

document.addEventListener("pointerdown", (event) => {
  if (event.target.closest("button, a")) return;
  leaveSpark(event.clientX, event.clientY);

  if (hint) {
    hint.textContent = "嗯，就是这样。";
  }
});
