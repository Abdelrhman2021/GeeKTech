/* Electrify theme switch.
   - Default: follow the visitor's system setting (prefers-color-scheme).
   - The header button forces light or dark and remembers the choice.
   Loaded in <head> so the saved choice is applied before first paint. */
(function () {
  "use strict";
  var KEY = "fx-theme", root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  try {
    var saved = localStorage.getItem(KEY);
    if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
  } catch (e) { /* storage blocked: system setting still applies */ }

  function effective() {
    var t = root.getAttribute("data-theme");
    if (t) return t;
    return mq && mq.matches ? "dark" : "light";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var host = document.querySelector("#header .container");
    if (!host) return;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "fx-theme-toggle";
    btn.innerHTML = '<i class="bi bi-sun-fill fx-i-sun" aria-hidden="true"></i><i class="bi bi-moon-stars-fill fx-i-moon" aria-hidden="true"></i>';

    function label() {
      var next = effective() === "dark" ? "light" : "dark";
      btn.setAttribute("aria-label", "Switch to " + next + " mode");
      btn.title = "Switch to " + next + " mode";
    }

    btn.addEventListener("click", function () {
      var next = effective() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem(KEY, next); } catch (e) { /* ignore */ }
      label();
    });
    if (mq && mq.addEventListener) mq.addEventListener("change", label);

    host.appendChild(btn);
    label();
  });
})();
