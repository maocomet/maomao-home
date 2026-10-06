"use strict";

// 小隧道 · 小喵给猫猫的生日礼物 2026.10.06
// 入口本来打算直接写进 index.html，但那次改动传不过去，所以改成由这个脚本
// 自己把「小隧道」那块和光晕层插进页面（样式见 tunnel.css）。
// 谁想把它搬回 HTML 都可以，AGENTS.md 第 4 条允许。
(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const SECTION = `
    <section class="birthday-tunnel" aria-labelledby="tunnel-title">
      <div class="tunnel-copy">
        <p class="section-label">礼物</p>
        <h2 id="tunnel-title">小隧道</h2>
        <p class="tunnel-desc">
          小喵在门口旁边悄悄挖了一个小小的入口。<br>
          点一下，去海面上捞几件会发光的小东西。
        </p>
      </div>

      <button class="tunnel-entry" id="tunnel-entry" type="button"
              aria-label="进入小喵给猫猫准备的生日小隧道">
        <span class="tunnel-entry__core" aria-hidden="true"></span>
        <span class="tunnel-entry__ring tunnel-entry__ring--one" aria-hidden="true"></span>
        <span class="tunnel-entry__ring tunnel-entry__ring--two" aria-hidden="true"></span>
        <span class="tunnel-entry__label">进去看看</span>
      </button>
    </section>
  `;

  function build() {
    if (document.querySelector("#tunnel-entry")) return;

    if (!document.querySelector('link[href="tunnel.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "tunnel.css";
      document.head.appendChild(link);
    }

    const holder = document.createElement("div");
    holder.innerHTML = SECTION.trim();
    const section = holder.firstElementChild;

    const footer = document.querySelector("footer");
    const home = document.querySelector(".home");
    if (footer) footer.insertAdjacentElement("beforebegin", section);
    else if (home) home.appendChild(section);
    else document.body.insertBefore(section, document.body.firstChild);

    if (!document.querySelector("#portal-wash")) {
      const wash = document.createElement("div");
      wash.className = "portal-wash";
      wash.id = "portal-wash";
      wash.setAttribute("aria-hidden", "true");
      document.body.appendChild(wash);
    }

    wire();
  }

  function wire() {
    const entry = document.querySelector("#tunnel-entry");
    const wash = document.querySelector("#portal-wash");
    if (!entry || !wash) return;

    let opening = false;

    entry.addEventListener("click", (event) => {
      if (opening) return;
      opening = true;

      const rect = entry.getBoundingClientRect();
      const x = event.clientX || rect.left + rect.width / 2;
      const y = event.clientY || rect.top + rect.height / 2;

      document.documentElement.style.setProperty("--portal-x", x + "px");
      document.documentElement.style.setProperty("--portal-y", y + "px");

      wash.classList.add("is-opening");
      document.body.classList.add("portal-opening");

      window.setTimeout(() => {
        window.location.href = "sea.html";
      }, reduceMotion ? 120 : 920);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
