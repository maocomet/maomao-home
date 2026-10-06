"use strict";

(function () {
  const entry = document.querySelector("#tunnel-entry");
  const wash = document.querySelector("#portal-wash");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!entry || !wash) return;

  let opening = false;

  function openTunnel(event) {
    if (opening) return;
    opening = true;

    const rect = entry.getBoundingClientRect();
    const x = event?.clientX ?? rect.left + rect.width / 2;
    const y = event?.clientY ?? rect.top + rect.height / 2;

    document.documentElement.style.setProperty("--portal-x", `${x}px`);
    document.documentElement.style.setProperty("--portal-y", `${y}px`);

    wash.classList.add("is-opening");
    document.body.classList.add("portal-opening");

    window.setTimeout(() => {
      window.location.href = "sea.html";
    }, reduceMotion ? 120 : 920);
  }

  entry.addEventListener("click", openTunnel);
})();
