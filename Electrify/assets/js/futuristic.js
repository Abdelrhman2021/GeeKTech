/* Electrify futuristic effects — progressive enhancement on top of main.js.
   Everything degrades to the plain dark theme if this file fails or the
   visitor prefers reduced motion. */
(function () {
  "use strict";

  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, all) { return all ? Array.prototype.slice.call(document.querySelectorAll(s)) : document.querySelector(s); };

  /* ---------- Header + scroll progress ---------- */
  var header = $("#header");
  var bar = document.createElement("div");
  bar.className = "fx-progress";
  document.body.appendChild(bar);

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ")";
      if (header) header.classList.toggle("fx-scrolled", window.scrollY > 40);
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (reduced) return; // static dark theme only

  /* ---------- Scroll reveal with stagger ---------- */
  if ("IntersectionObserver" in window) {
    var targets = $(
      ".section-title, .mc-card, .step-card, .arch-node, .platform-list-item, .trust-stat, .chip-list li, " +
      "#problem ul li, .member, .info, .php-email-form, .cta .container, .portfolio-info, .portfolio-description, " +
      ".breadcrumbs .container, #about .container > *, #ev-iot .container > *",
      true
    );
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    targets.forEach(function (el) {
      // stagger siblings inside the same grid/row
      var sibs = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.setProperty("--d", Math.min(sibs, 8) * 70 + "ms");
      el.classList.add("reveal");
      io.observe(el);
    });
    document.documentElement.classList.add("fx");
    // Safety net: never leave content hidden if the observer misfires
    setTimeout(function () { targets.forEach(function (el) { if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("in"); }); }, 1200);
  }

  /* ---------- Card spotlight + gentle tilt ---------- */
  var finePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (finePointer) {
    $(".mc-card, .step-card, .arch-node, .platform-list-item, .member", true).forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", e.clientX - r.left + "px");
        card.style.setProperty("--my", e.clientY - r.top + "px");
      });
    });

    var glow = document.createElement("div");
    glow.className = "fx-cursor";
    document.body.appendChild(glow);
    var gx = 0, gy = 0, tx = 0, ty = 0;
    window.addEventListener("pointermove", function (e) { tx = e.clientX; ty = e.clientY; }, { passive: true });
    (function loop() {
      gx += (tx - gx) * 0.12; gy += (ty - gy) * 0.12;
      glow.style.transform = "translate(" + gx + "px," + gy + "px)";
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Count-up for proof stats ---------- */
  var figures = $(".trust-figure", true);
  if (figures.length && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        var el = e.target, m = el.dataset.fxText.match(/^([\d,]+)(.*)$/);
        if (!m) return;
        var end = parseInt(m[1].replace(/,/g, ""), 10), suffix = m[2], t0 = null, dur = 1600;
        (function step(t) {
          if (t0 === null) t0 = t;
          var p = Math.min(1, (t - t0) / dur), eased = 1 - Math.pow(1 - p, 4);
          el.textContent = Math.round(end * eased).toLocaleString("en-US") + suffix;
          if (p < 1) requestAnimationFrame(step);
        })(performance.now());
      });
    }, { threshold: 0.6 });
    figures.forEach(function (el) { el.dataset.fxText = el.textContent.trim(); cio.observe(el); });
  }

  /* ---------- Hero: animated energy-network canvas ---------- */
  var heroBox = $("#hero .hero-container");
  if (heroBox) {
    var cv = document.createElement("canvas");
    cv.className = "hero-fx-canvas";
    cv.setAttribute("aria-hidden", "true");
    heroBox.insertBefore(cv, heroBox.firstChild);
    var ctx = cv.getContext("2d"), W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var pts = [], running = true, mouse = { x: -999, y: -999 };
    var palette = ["41,180,115", "41,180,115", "42,159,207", "243,195,22"]; // brand green / blue / yellow

    function size() {
      var r = heroBox.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.max(28, Math.min(80, Math.round(W * H / 20000)));
      pts = [];
      for (var i = 0; i < n; i++) {
        pts.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.8 + 0.8, c: palette[Math.floor(Math.random() * palette.length)]
        });
      }
    }
    size();
    window.addEventListener("resize", size);
    heroBox.addEventListener("pointermove", function (e) {
      var r = heroBox.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    heroBox.addEventListener("pointerleave", function () { mouse.x = mouse.y = -999; });

    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      var i, j, a, b, dx, dy, d;
      for (i = 0; i < pts.length; i++) {
        a = pts[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > W) a.vx *= -1;
        if (a.y < 0 || a.y > H) a.vy *= -1;
        dx = a.x - mouse.x; dy = a.y - mouse.y; d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) { a.x += dx / d * 1.2; a.y += dy / d * 1.2; }
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.2832);
        ctx.fillStyle = "rgba(" + a.c + ",0.85)"; ctx.shadowColor = "rgba(" + a.c + ",0.9)"; ctx.shadowBlur = 10; ctx.fill();
        ctx.shadowBlur = 0;
        for (j = i + 1; j < pts.length; j++) {
          b = pts[j]; dx = a.x - b.x; dy = a.y - b.y; d = dx * dx + dy * dy;
          if (d < 19600) { // 140px
            ctx.strokeStyle = "rgba(" + a.c + "," + (0.22 * (1 - d / 19600)).toFixed(3) + ")";
            ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      requestAnimationFrame(frame);
    }
    // Only animate while the hero is on screen
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        var vis = en[0].isIntersecting;
        if (vis && !running) { running = true; frame(); }
        if (!vis) running = false;
      }).observe(heroBox);
    }
    frame();
  }
})();
