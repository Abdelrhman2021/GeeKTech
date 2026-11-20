# Electrify Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite `Electrify/index.html` (and its supporting CSS/JS/image assets) from a battery-swapping/EV-retrofit pitch into the brief's "operating system for private mobility networks" homepage, without changing the underlying tech stack.

**Architecture:** Single static HTML page (Bootstrap 5 + animate.css, no build step, no framework). Work happens as targeted rewrites of each `<section>` in place, one shared CSS addition for the new visual system, one JS bugfix, and a one-time image processing pass — not a rewrite of the toolchain.

**Tech Stack:** Static HTML/CSS/JS, Bootstrap 5 (bundled), Bootstrap Icons, animate.css, PHP `mail()` (contact form backend). No package manager, no bundler, no test framework — verification uses `tidy` (HTML syntax), targeted `grep` (content/regression assertions), and manual browser checks.

**Spec:** `docs/superpowers/specs/2026-09-09-electrify-homepage-redesign-design.md` — read it alongside this plan; it explains *why* each structural/visual decision was made. Content/copy requirements not restated here come from `Electrify/Electrify Website Brief.md`, which is the authoritative source of truth (explicitly supersedes `Electrify Website Edits.md` and `Refresh Requirements.md`).

## Global Constraints

- **Branch:** all work happens on `electrify-redesign` (already exists, tracks `origin/electrify-redesign`). Never commit to `main`.
- **Staging discipline:** before every commit, run `git status` and stage only the exact paths this plan names. The working tree has unrelated in-flight changes (root `GeeKTech/index.html`, a "Techne Cairo" logo/announcement image, a modified `Electrify/Electrify Website Edits.md`) — never stage those.
- **Traction figure:** wherever a completed-rides number appears, it must read exactly **"70,000+ completed rides"**. Never 35,000+ or 85,000+.
- **No fabricated metrics:** no exact fleet size, driver count, active-user count, uptime, revenue, or testimonials anywhere in new copy.
- **No baked-in hero text:** all hero copy (eyebrow/headline/body/CTA) stays live HTML — never add text inside an image asset.
- **No customer/partner logos** in the Trust section this phase — none are cleared to publish.
- **Primary CTA is "Book a Demo"** consistently; avoid competing CTA styles per brief §23.
- **Accessibility:** every new/changed `<img>` gets real, descriptive `alt` text (not `alt=""`); heading levels stay in order (`h2` for section titles, `h3`/`h4` inside cards — never skip a level); interactive elements keep visible focus states (inherited from Bootstrap — don't remove outlines).
- **No new dependencies:** no new npm/CDN libraries. Everything ships with Bootstrap 5, Bootstrap Icons, animate.css, and plain CSS/JS already vendored in `Electrify/assets/vendor/`.
- **PHP is not available in this dev environment** (`php` CLI not installed) — contact form backend logic changes can only be verified by static/code review here; real end-to-end delivery must be verified after deployment on the live host.

---

## File Structure

| File | Change |
|---|---|
| `Electrify/assets/img/slide/Slide1.jpg`, `Slide2.jpg`, `Slide3.jpg` | **Create** — processed hero images (replaces `Slide1/2/3.png`, which get deleted once no longer referenced) |
| `Electrify/assets/vendor/php-email-form/validate.js` | **Rewrite** — remove duplicated submit handler, fix success-string mismatch |
| `Electrify/assets/css/style.css` | **Extend** — new shared design-system rules appended in one block, plus targeted edits to existing `#hero`, `.section-title`, `section` rules |
| `Electrify/index.html` | **Rewrite in place, section by section** — this is the bulk of the work |

`Electrify/index.html` today (883 lines) has these sections, each getting one of three treatments:

| Current section (anchor/comment) | Treatment |
|---|---|
| `<!-- Hero Section -->` / `#hero` | Rewrite slide content, keep carousel mechanism |
| Header/nav | Rewrite nav links |
| `#about` (About Us) | **Move** — delete from current position (right after hero), recreate near the bottom with brief §22 copy, just before Team |
| Counts (commented out) | Delete (dead code, no brief mandate for stat counters) |
| `#services` (Our Services) | Rewrite into `#platform` (Platform Overview, 7 cards) |
| `.cta` (Schedule a Call) | Delete from its current mid-page position; its `.cta` CSS pattern is reused for the new Final CTA near the end |
| More Services (commented out) | Delete |
| `.info-box` (Common Q&A / FAQ) | Delete — entirely EV-conversion-specific content with no place in the new structure |
| Portfolio (commented out) | Delete |
| `#team` (Our Team) | Restyle cards in place (no markup rewrite), stays near the bottom, now preceded by the relocated About section |
| `#contact` (Contact Us) | Keep 4-field form as-is; update intro copy only |
| Footer | Spot-check/update stray "About us"/"Services" placeholder links |

New sections with no current equivalent (Trust/Proof, Customer Problem, Product Architecture, How It Works, Somabay Case Study, Industries, Benefits, Why Electrify, EV/Battery/IoT, Final CTA) get inserted in brief order between Hero and the relocated About/Team block.

**Nav scope note:** the brief's suggested nav (§9) is `Platform · Solutions · Industries · Case Study · About · Contact`. This homepage has no distinct "Solutions" section (that content lives inside Platform Overview and Industries) and the brief also says "do not create broken links." Rather than point two nav items at the same anchor, this plan ships **5 nav items** (Platform, Industries, Case Study, About, Contact) plus the Home/logo link and the Book a Demo CTA, omitting "Solutions" until a real Solutions destination exists. This is a deliberate, documented deviation — flagged again in Task 14.

**Case-study heading choice:** the brief offers two headings in different sections for related content — "Built for Real-World Mobility Operations" (§12, the Trust/Proof section heading) and "From Transportation Operation to Connected Mobility Network" (§6, explicitly labeled "alternative case-study heading"). This plan uses the first for the Trust/Proof section and the second for the dedicated Somabay Case Study section, since the homepage has both as separate sections.

---

### Task 1: Process and place the hero carousel images

**Files:**
- Read: `Electrify/banner/1.png`, `Electrify/banner/2.png`, `Electrify/banner/3.png`
- Create: `Electrify/assets/img/slide/Slide1.jpg`, `Electrify/assets/img/slide/Slide2.jpg`, `Electrify/assets/img/slide/Slide3.jpg`

**Interfaces:**
- Produces: three JPEG files at `Electrify/assets/img/slide/Slide{1,2,3}.jpg` that Task 5 references by exact path in `background-image: url(...)`.

Mapping (locked in by the design spec): `banner/3.png` → `Slide1.jpg` (Destination), `banner/2.png` → `Slide2.jpg` (Intelligence), `banner/1.png` → `Slide3.jpg` (Electrification, cropped).

`banner/1.png` (1672×941) has marketing text baked into physical signage in three places: a right-edge panel ("SWAP RIDE EXPLORE CLEANER DESTINATIONS", roughly x 1388–1672), a bottom-left stone plaque ("PEOPLE PLACES A CLEANER TOMORROW", roughly x 0–368, y 546–753), and a center-left sign ("ELECTRIC MOBILITY FOR A CLEANER TOMORROW", roughly x 602–819, y 339–546). The right-edge panel can be cropped off cleanly. The other two sit at different heights across the frame and can't be cropped out without also losing the golf cart/scooters/station that make this photo relevant to the Electrification slide — those two are mitigated instead by the darker hero gradient overlay added in Task 3 and by the live slide copy visually sitting over the same area. This is a partial mitigation, not full removal — Task 14 includes an explicit visual check with a decision point if it's still not good enough.

- [ ] **Step 1: Crop and compress all three images with Pillow**

Run from `Electrify/`:

```bash
python3 - <<'PYEOF'
from PIL import Image
import os

jobs = [
    ("banner/3.png", "assets/img/slide/Slide1.jpg", None),
    ("banner/2.png", "assets/img/slide/Slide2.jpg", None),
    ("banner/1.png", "assets/img/slide/Slide3.jpg", (0, 0, 1420, 941)),
]

os.makedirs("assets/img/slide", exist_ok=True)

for src, dst, box in jobs:
    im = Image.open(src).convert("RGB")
    if box:
        im = im.crop(box)
    im.save(dst, "JPEG", quality=82, optimize=True)
    print(f"{dst}: {im.size} -> {os.path.getsize(dst)} bytes")
PYEOF
```

- [ ] **Step 2: Verify output**

Run: `ls -la assets/img/slide/Slide1.jpg assets/img/slide/Slide2.jpg assets/img/slide/Slide3.jpg`
Expected: three files exist, each well under 400KB (down from the 2.3–2.6MB PNG sources), `Slide1.jpg`/`Slide2.jpg` at 1672×941, `Slide3.jpg` at 1420×941.

- [ ] **Step 3: Visual sanity check**

Open `Electrify/assets/img/slide/Slide3.jpg` directly and confirm the right-edge "SWAP RIDE EXPLORE" panel is gone. Note (don't fix yet — Task 14 revisits this) whether the remaining center/bottom-left text is still clearly legible at normal size.

- [ ] **Step 4: Commit**

```bash
cd "$(git rev-parse --show-toplevel)"
git add Electrify/assets/img/slide/Slide1.jpg Electrify/assets/img/slide/Slide2.jpg Electrify/assets/img/slide/Slide3.jpg
git commit -m "Add processed hero carousel images from banner photos

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_0158E8s6fyrLmUi6j5bj7L4R"
```

---

### Task 2: Fix the contact form's duplicated/broken submit handler

**Files:**
- Modify: `Electrify/assets/vendor/php-email-form/validate.js` (full-file rewrite, currently 163 lines — two near-duplicate IIFEs both bind a `submit` listener to `.php-email-form`)
- Read (no change): `Electrify/forms/contact.php` — outputs exactly `success` (lowercase, no other text) on success, `error` on failure

**Interfaces:**
- Produces: a single submit handler on `.php-email-form` that shows `.sent-message` when the server responds with the literal string `success` (case-insensitive) and `.error-message` otherwise. Task 13 relies on this being correct when it updates the contact section's intro copy.

The current file has **two** copies of the same handler. Both attach to the same `submit` event, so every real submission double-POSTs to `contact.php`. Worse, the first copy checks for response text `'OK'` and the second checks for `'Success'` (capital S) — but `contact.php` actually echoes lowercase `success`/`error`. Neither check ever matches, so the form always shows the error state even when the email sends successfully.

- [ ] **Step 1: Replace the file with a single corrected handler**

```javascript
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      let thisForm = this;
      let action = thisForm.getAttribute('action');

      if (!action) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }

      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData(thisForm);

      fetch(action, {
        method: 'POST',
        body: formData,
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      })
        .then(function (response) {
          if (response.ok) {
            return response.text();
          }
          throw new Error(response.status + ' ' + response.statusText + ' ' + response.url);
        })
        .then(function (data) {
          thisForm.querySelector('.loading').classList.remove('d-block');
          if (data.trim().toLowerCase() === 'success') {
            thisForm.querySelector('.sent-message').classList.add('d-block');
            thisForm.reset();
          } else {
            displayError(thisForm, 'Something went wrong sending your message. Please try again later.');
          }
        })
        .catch(function (error) {
          displayError(thisForm, error);
        });
    });
  });

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

})();
```

- [ ] **Step 2: Verify there's exactly one handler now**

Run: `grep -c "addEventListener('submit'" Electrify/assets/vendor/php-email-form/validate.js`
Expected: `1` (was `2` before this change).

- [ ] **Step 3: Verify the success-string check matches the PHP output**

Run: `grep -n "echo" Electrify/forms/contact.php` — confirms `contact.php` echoes `"success"` / `"error"`. Run: `grep -n "toLowerCase() === 'success'" Electrify/assets/vendor/php-email-form/validate.js` — confirms the JS check matches. Both should print one line each.

Note for later (not a step here — no PHP runtime is available in this environment to actually submit the form): once this ships, do one real test submission on the live site to confirm `mail()` actually delivers from the host, per [[geektech_broken_contact_forms]] memory.

- [ ] **Step 4: Commit**

```bash
cd "$(git rev-parse --show-toplevel)"
git add Electrify/assets/vendor/php-email-form/validate.js
git commit -m "Fix duplicated contact form submit handler and success-string mismatch

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_0158E8s6fyrLmUi6j5bj7L4R"
```

---

### Task 3: Add the shared design system to `style.css`

**Files:**
- Modify: `Electrify/assets/css/style.css:343-486` (`#hero` block — overlay + heading size)
- Modify: `Electrify/assets/css/style.css:491-516` (`section` / `.section-title` — spacing + type scale)
- Modify: `Electrify/assets/css/style.css` (append new block at end of file, after the last existing rule)

**Interfaces:**
- Produces these classes for every later HTML task to consume: `.eyebrow`, `.mc-grid`, `.mc-card` (+ `.mc-icon`), `.trust-stat`/`.trust-figure`/`.trust-label`, `.arch-diagram`/`.arch-row`/`.arch-node`/`.arch-node--accent`/`.arch-connector`, `.steps-grid`/`.step-card`/`.step-number`, `.navbar .nav-cta`.

- [ ] **Step 1: Widen section rhythm and heading scale**

In `Electrify/assets/css/style.css`, find:

```css
section {
  padding: 60px 0;
}
```

Replace with:

```css
section {
  padding: 90px 0;
}
```

Find:

```css
.section-title h2 {
  font-size: 32px;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 20px;
  padding-bottom: 0;
  color: #4b605c;
}

.section-title p {
  margin-bottom: 0;
  color: #5f7c78;
}
```

Replace with:

```css
.section-title h2 {
  font-size: 34px;
  font-weight: 700;
  text-transform: none;
  letter-spacing: -0.3px;
  margin-bottom: 16px;
  padding-bottom: 0;
  color: #334240;
}

.section-title p {
  margin: 0 auto;
  max-width: 640px;
  color: #5f7c78;
  font-size: 16px;
}
```

- [ ] **Step 2: Darken the hero overlay into a gradient and size up the headline**

Find:

```css
#hero .carousel-item::before {
  content: "";
  background-color: rgba(21, 27, 26, 0.7);
  position: absolute;
  height: 100vh;
  width: 100%;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
```

Replace with:

```css
#hero .carousel-item::before {
  content: "";
  background: linear-gradient(180deg, rgba(15, 20, 19, 0.35) 0%, rgba(15, 20, 19, 0.55) 55%, rgba(15, 20, 19, 0.82) 100%);
  position: absolute;
  height: 100vh;
  width: 100%;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
```

Find:

```css
#hero h2 {
  color: #fff;
  margin-bottom: 30px;
  font-size: 48px;
  font-weight: 700;
}
```

Replace with:

```css
#hero h2 {
  color: #fff;
  margin-bottom: 18px;
  font-size: 54px;
  font-weight: 700;
  line-height: 1.15;
}
```

- [ ] **Step 3: Append the new component block at the end of the file**

Add at the end of `Electrify/assets/css/style.css`:

```css

/*--------------------------------------------------------------
# Redesign — shared components (eyebrow, cards, trust stat,
# architecture diagram, step cards, nav CTA, reduced motion)
--------------------------------------------------------------*/
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}

.navbar .nav-cta {
  background: #1bbca3;
  color: #fff !important;
  padding: 8px 20px !important;
  border-radius: 50px;
  margin-left: 6px;
}

.navbar .nav-cta:hover {
  background: #159f89;
}

.eyebrow {
  display: inline-block;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: #56e7d0;
  margin-bottom: 16px;
}

.mc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 30px;
  margin-top: 20px;
}

.mc-card {
  background: #fff;
  border-radius: 10px;
  padding: 32px 26px;
  box-shadow: 0 10px 30px rgba(21, 27, 26, 0.06);
  border-top: 3px solid #1bbca3;
  transition: transform 0.3s, box-shadow 0.3s;
}

.mc-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 40px rgba(21, 27, 26, 0.12);
}

.mc-card .mc-icon {
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #eafaf7;
  color: #1bbca3;
  font-size: 26px;
  margin-bottom: 18px;
}

.mc-card h4 {
  font-size: 19px;
  font-weight: 700;
  color: #334240;
  margin-bottom: 10px;
}

.mc-card p {
  font-size: 14.5px;
  color: #5f7c78;
  line-height: 1.7;
  margin-bottom: 0;
}

.mc-card--muted {
  opacity: 0.85;
}

.trust-stat {
  text-align: center;
}

.trust-figure {
  font-family: "Poppins", sans-serif;
  font-size: 56px;
  font-weight: 700;
  color: #1bbca3;
  line-height: 1;
  margin-bottom: 10px;
}

.trust-label {
  font-size: 15px;
  color: #5f7c78;
}

.arch-diagram {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 40px auto 0;
  max-width: 900px;
}

.arch-node {
  background: #fff;
  border: 1px solid #e6eceb;
  border-radius: 8px;
  padding: 14px 22px;
  font-size: 14.5px;
  font-weight: 600;
  color: #334240;
  text-align: center;
  box-shadow: 0 6px 18px rgba(21, 27, 26, 0.05);
}

.arch-node--accent {
  background: #1bbca3;
  color: #fff;
  border-color: #1bbca3;
}

.arch-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  width: 100%;
}

.arch-connector {
  width: 2px;
  height: 28px;
  background: #b7d6d1;
  margin: 4px 0;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 30px;
  margin-top: 30px;
}

.step-card {
  text-align: center;
  padding: 10px;
}

.step-number {
  width: 44px;
  height: 44px;
  line-height: 44px;
  border-radius: 50%;
  background: #1bbca3;
  color: #fff;
  font-weight: 700;
  margin: 0 auto 16px;
}

.step-card h4 {
  font-size: 17px;
  font-weight: 700;
  color: #334240;
  margin-bottom: 8px;
}

.step-card p {
  font-size: 14px;
  color: #5f7c78;
  line-height: 1.7;
}

@media (max-width: 768px) {
  .arch-row {
    flex-direction: column;
    align-items: center;
  }
}
```

- [ ] **Step 4: Verify the file still parses as valid CSS**

Run: `python3 -c "s = open('Electrify/assets/css/style.css').read(); assert s.count('{') == s.count('}'), 'brace mismatch'; print('braces balanced:', s.count('{'))"`
Expected: `braces balanced: <some number>` with no assertion error.

- [ ] **Step 5: Commit**

```bash
cd "$(git rev-parse --show-toplevel)"
git add Electrify/assets/css/style.css
git commit -m "Add shared design system CSS for homepage redesign

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_0158E8s6fyrLmUi6j5bj7L4R"
```

---

### Task 4: Rewrite page metadata

**Files:**
- Modify: `Electrify/index.html:8-10`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: nothing later tasks depend on (leaf task).

- [ ] **Step 1: Replace title, description, keywords, and add Open Graph tags**

Find (lines 8-10):

```html
  <title>Electrify Mobility</title>
  <meta content="Electrify specializes in converting traditional gasoline-powered 2- and 3-wheel delivery vehicles into cost-efficient electric vehicles. Our solutions offer significant fuel savings, lower maintenance costs, and reduced environmental impact. We provide advanced battery management systems, AI-powered fleet management, and innovative financing options, including BNPL. Through strategic partnerships, local supply chains, and continuous improvement, Electrify is driving the future of sustainable transportation in Egypt and the MENA region." name="description">
  <meta content="Electrify, EV conversions, electric vehicles, logistics, 2-wheel, 3-wheel, sustainability, fuel cost savings, reduced maintenance, AI-powered fleet management, battery management, battery swapping, BNPL, partnerships, supply chain, marketing, pilot testing, Egypt, MENA region" name="keywords">
```

Replace with:

```html
  <title>Electrify | Mobility Operating System for Private Destinations</title>
  <meta content="Electrify is a white-label mobility operating system for resorts, communities, campuses, and private destinations operating their own vehicles and drivers." name="description">
  <meta content="private mobility platform, destination mobility software, mobility operating system, white-label mobility, resort transportation software, fleet operations platform, campus mobility software, gated community transportation, private fleet management, electric fleet software, dispatch platform" name="keywords">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="Electrify | Mobility Operating System for Private Destinations">
  <meta property="og:description" content="Electrify is a white-label mobility operating system for resorts, communities, campuses, and private destinations operating their own vehicles and drivers.">
  <meta property="og:image" content="https://electrify.geektech.software/assets/img/slide/Slide1.jpg">
  <meta property="og:url" content="https://electrify.geektech.software/">
```

- [ ] **Step 2: Verify no stray old copy remains in the head**

Run: `grep -n -i "AI-powered fleet management\|BNPL\|retrofit" Electrify/index.html | head -5`
Expected: no matches from the `<head>` block (later sections still legitimately contain these until their own tasks run — this check is just confirming the head edit itself).

- [ ] **Step 3: Commit**

```bash
cd "$(git rev-parse --show-toplevel)"
git add Electrify/index.html
git commit -m "Update Electrify homepage title, meta description, and Open Graph tags

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_0158E8s6fyrLmUi6j5bj7L4R"
```

---

### Task 5: Rewrite navigation and the hero carousel

**Files:**
- Modify: `Electrify/index.html` — the span from the `<!-- ======= Hero Section ======= -->` comment through the `</header><!-- End Header -->` comment (currently lines 35-146; locate by those comment markers, not the line numbers, since Task 4 shifted things slightly)
- Delete: `Electrify/assets/img/slide/Slide1.png`, `Slide2.png`, `Slide3.png` (superseded by Task 1's `.jpg` versions)

**Interfaces:**
- Consumes: `Electrify/assets/img/slide/Slide{1,2,3}.jpg` (Task 1), `.eyebrow`/`.navbar .nav-cta` classes and the updated `#hero` CSS (Task 3).
- Produces: anchors `#platform`, `#industries`, `#case-study`, `#about`, `#contact` that nav links point to — later tasks must give their sections these exact `id` values.

- [ ] **Step 1: Replace the hero + header block**

Locate the block starting at `<!-- ======= Hero Section ======= -->` and ending at `</header><!-- End Header -->`. Replace the entire block with:

```html
  <!-- ======= Hero Section ======= -->
  <section id="hero">
    <div class="hero-container">
      <div id="heroCarousel" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="7000">

        <ol class="carousel-indicators" id="hero-carousel-indicators"></ol>

        <div class="carousel-inner" role="listbox">

          <!-- Slide 1: Destination -->
          <div class="carousel-item active" style="background-image: url(assets/img/slide/Slide1.jpg);">
            <div class="carousel-container">
              <div class="carousel-content">
                <span class="eyebrow animate__animated animate__fadeInDown">Private Mobility, Reimagined</span>
                <h2 class="animate__animated animate__fadeInDown">The operating system for private mobility.</h2>
                <p class="animate__animated animate__fadeInUp">Run your transportation network through one connected platform — built for destinations that operate their own vehicles and drivers.</p>
                <a href="#platform" class="btn-get-started animate__animated animate__fadeInUp scrollto">Discover Electrify</a>
              </div>
            </div>
          </div>

          <!-- Slide 2: Intelligence -->
          <div class="carousel-item" style="background-image: url(assets/img/slide/Slide2.jpg);">
            <div class="carousel-container">
              <div class="carousel-content">
                <span class="eyebrow animate__animated animate__fadeInDown">One Platform. Every Journey.</span>
                <h2 class="animate__animated animate__fadeInDown">Run the whole network from one place.</h2>
                <p class="animate__animated animate__fadeInUp">Passengers, drivers, dispatch, fleet, payments and operational data — connected in real time.</p>
                <a href="#platform" class="btn-get-started animate__animated animate__fadeInUp scrollto">Explore the Platform</a>
              </div>
            </div>
          </div>

          <!-- Slide 3: Electrification -->
          <div class="carousel-item" style="background-image: url(assets/img/slide/Slide3.jpg);">
            <div class="carousel-container">
              <div class="carousel-content">
                <span class="eyebrow animate__animated animate__fadeInDown">Built for What Comes Next</span>
                <h2 class="animate__animated animate__fadeInDown">Smarter mobility. Ready for electric.</h2>
                <p class="animate__animated animate__fadeInUp">Start with better mobility operations today, then integrate electric fleets, charging, batteries and connected infrastructure as your network evolves.</p>
                <a href="#contact" class="btn-get-started animate__animated animate__fadeInUp scrollto">Build Your Network</a>
              </div>
            </div>
          </div>

        </div>

        <a class="carousel-control-prev" href="#heroCarousel" role="button" data-bs-slide="prev">
          <span class="carousel-control-prev-icon bi bi-chevron-double-left" aria-hidden="true"></span>
        </a>
        <a class="carousel-control-next" href="#heroCarousel" role="button" data-bs-slide="next">
          <span class="carousel-control-next-icon bi bi-chevron-double-right" aria-hidden="true"></span>
        </a>

      </div>
    </div>
  </section><!-- End Hero -->

  <!-- ======= Header ======= -->
  <header id="header" class="d-flex align-items-center">
    <div class="container d-flex align-items-center justify-content-between">

      <div class="logo">
        <a href="index.html"><img src="assets/img/Electrify.png" alt="Electrify logo" class="img-fluid"></a>
      </div>

      <nav id="navbar" class="navbar">
        <ul>
          <li><a class="nav-link scrollto active" href="#hero">Home</a></li>
          <li><a class="nav-link scrollto" href="#platform">Platform</a></li>
          <li><a class="nav-link scrollto" href="#industries">Industries</a></li>
          <li><a class="nav-link scrollto" href="#case-study">Case Study</a></li>
          <li><a class="nav-link scrollto" href="#about">About</a></li>
          <li><a class="nav-link scrollto" href="#contact">Contact</a></li>
          <li><a class="nav-link scrollto nav-cta" href="#contact">Book a Demo</a></li>
        </ul>
        <i class="bi bi-list mobile-nav-toggle"></i>
      </nav><!-- .navbar -->

    </div>
  </header><!-- End Header -->
```

- [ ] **Step 2: Delete the superseded PNG hero images**

Run: `rm Electrify/assets/img/slide/Slide1.png Electrify/assets/img/slide/Slide2.png Electrify/assets/img/slide/Slide3.png`

- [ ] **Step 3: Verify no references to the deleted PNGs remain**

Run: `grep -n "Slide1.png\|Slide2.png\|Slide3.png" Electrify/index.html`
Expected: no output.

- [ ] **Step 4: Validate HTML syntax**

Run: `tidy -q -e Electrify/index.html 2>&1 | grep -v "trimming empty" | head -30`
Expected: no `Error` lines (pre-existing template `Warning`s about e.g. proprietary attributes are fine and expected — this file was never strict-DTD-clean; only new `Error` lines introduced by this edit matter).

- [ ] **Step 5: Visual check in a browser**

Run: `cd Electrify && python3 -m http.server 8000` (leave running), then open `http://localhost:8000/` in a browser (or via the claude-in-chrome tool) and confirm: all 3 hero slides cycle, each shows an eyebrow/headline/body/single CTA, text is readable against the new gradient overlay, nav links scroll to the right (currently empty, pre-Task-6+) anchors without a full page jump/console error. Stop the server after checking (`Ctrl+C` / kill the background process).

- [ ] **Step 6: Commit**

```bash
cd "$(git rev-parse --show-toplevel)"
git add Electrify/index.html Electrify/assets/img/slide/Slide1.png Electrify/assets/img/slide/Slide2.png Electrify/assets/img/slide/Slide3.png
git commit -m "Rewrite Electrify homepage nav and hero carousel for mobility-OS positioning

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_0158E8s6fyrLmUi6j5bj7L4R"
```

---

### Task 6: Add Trust/Proof and Customer Problem sections

**Files:**
- Modify: `Electrify/index.html` — insert two new sections directly after `</section><!-- End Hero -->` and before `<section id="about">`

**Interfaces:**
- Consumes: `.trust-stat`/`.trust-figure`/`.trust-label` classes (Task 3).
- Produces: nothing later tasks structurally depend on (content-only).

- [ ] **Step 1: Insert the Trust/Proof and Problem sections**

Immediately after `</section><!-- End Hero -->` (and before the header/hero markup that follows it — insert this new block right after the closing `</header><!-- End Header -->` tag from Task 5, i.e. as the first thing inside `<main id="main">`, before the current `<section id="about">`), add:

```html
    <!-- ======= Trust / Proof Section ======= -->
    <section id="trust" class="section-bg">
      <div class="container">
        <div class="section-title">
          <h2>Built for Real-World Mobility Operations</h2>
          <p>Electrify powers SomaRide at Somabay, supporting private mobility across a large, self-contained Red Sea destination and providing the operational learning behind our scalable mobility platform.</p>
        </div>
        <div class="row justify-content-center">
          <div class="col-lg-4 col-md-6 trust-stat">
            <div class="trust-figure">70,000+</div>
            <div class="trust-label">Completed rides</div>
          </div>
          <div class="col-lg-4 col-md-6 trust-stat">
            <div class="trust-figure">10M m²</div>
            <div class="trust-label">Live deployment across a self-contained destination</div>
          </div>
        </div>
      </div>
    </section><!-- End Trust / Proof Section -->

    <!-- ======= Customer Problem Section ======= -->
    <section id="problem">
      <div class="container">
        <div class="section-title">
          <h2>Running a Private Mobility Network Is More Complex Than It Should Be</h2>
          <p>Private destinations may operate vehicles and drivers while relying on fragmented tools and manual workflows for passenger requests, dispatch, scheduling, payments, vehicle management, and reporting.</p>
        </div>
        <div class="row">
          <div class="col-md-6 col-lg-4 mb-4">
            <p><i class="bi bi-check2"></i> Fragmented passenger requests across phone, WhatsApp, and manual dispatch</p>
          </div>
          <div class="col-md-6 col-lg-4 mb-4">
            <p><i class="bi bi-check2"></i> Limited vehicle and driver visibility</p>
          </div>
          <div class="col-md-6 col-lg-4 mb-4">
            <p><i class="bi bi-check2"></i> Difficult dispatch coordination</p>
          </div>
          <div class="col-md-6 col-lg-4 mb-4">
            <p><i class="bi bi-check2"></i> Passenger waiting and uncertainty</p>
          </div>
          <div class="col-md-6 col-lg-4 mb-4">
            <p><i class="bi bi-check2"></i> Disconnected payments and manual reporting</p>
          </div>
          <div class="col-md-6 col-lg-4 mb-4">
            <p><i class="bi bi-check2"></i> Difficulty preparing for electrification</p>
          </div>
        </div>
        <p class="text-center fw-bold mt-3">Electrify brings the entire mobility operation into one connected platform.</p>
      </div>
    </section><!-- End Customer Problem Section -->
```

- [ ] **Step 2: Verify the traction figure is exact**

Run: `grep -n "70,000+" Electrify/index.html`
Expected: at least one match, and: `grep -n "35,000\|85,000" Electrify/index.html` returns no matches.

- [ ] **Step 3: Validate HTML syntax**

Run: `tidy -q -e Electrify/index.html 2>&1 | grep -i error`
Expected: no output.

- [ ] **Step 4: Commit**

```bash
cd "$(git rev-parse --show-toplevel)"
git add Electrify/index.html
git commit -m "Add Trust/Proof and Customer Problem sections to Electrify homepage

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_0158E8s6fyrLmUi6j5bj7L4R"
```

---

### Task 7: Rewrite Services into Platform Overview

**Files:**
- Modify: `Electrify/index.html` — replace the `<section id="services" class="services">...</section><!-- End Our Services Section -->` block
- Modify: `Electrify/index.html` — delete the commented-out Counts section (`<!-- ======= Counts Section ======= -->` through `<!-- End Counts Section -->`)

**Interfaces:**
- Consumes: `.mc-grid`/`.mc-card`/`.mc-icon` classes (Task 3).
- Produces: `id="platform"` anchor that Task 5's nav link and Task 6/8's hero/architecture CTAs point to (already added — this task must use exactly `id="platform"`).

- [ ] **Step 1: Delete the dead Counts block**

Find the commented-out block starting `<!-- ======= Counts Section ======= -->` and ending `<!-- End Counts Section -->` (currently between the About section and the Services section). Delete it entirely, including the surrounding HTML comments.

- [ ] **Step 2: Replace the Services section with Platform Overview**

Find the block from `<!-- ======= Our Services Section ======= -->` through `</section><!-- End Our Services Section -->`. Replace with:

```html
    <!-- ======= Platform Overview Section ======= -->
    <section id="platform" class="services">
      <div class="container">

        <div class="section-title">
          <h2>Everything Required to Operate a Mobility Network</h2>
          <p>One connected platform for passengers, drivers, dispatch, fleet operations, payments, and the data that ties it all together.</p>
        </div>

        <div class="mc-grid">
          <div class="mc-card">
            <div class="mc-icon"><i class="bi bi-phone"></i></div>
            <h4>Passenger App</h4>
            <p>A fully branded passenger experience for requesting rides, tracking vehicles, managing payments, receiving notifications, and accessing destination-specific mobility services.</p>
          </div>
          <div class="mc-card">
            <div class="mc-icon"><i class="bi bi-person-badge"></i></div>
            <h4>Driver App</h4>
            <p>Dedicated tools that help drivers receive trips, navigate, manage ride status, communicate with passengers, and follow operational workflows.</p>
          </div>
          <div class="mc-card">
            <div class="mc-icon"><i class="bi bi-display"></i></div>
            <h4>Operations Dashboard</h4>
            <p>A central control center for monitoring and managing vehicles, drivers, trips, demand, service quality, and daily mobility operations.</p>
          </div>
          <div class="mc-card">
            <div class="mc-icon"><i class="bi bi-graph-up"></i></div>
            <h4>Fleet Intelligence</h4>
            <p>Operational insight into utilization, demand, downtime, performance, and service quality across the network.</p>
          </div>
          <div class="mc-card">
            <div class="mc-icon"><i class="bi bi-credit-card"></i></div>
            <h4>Payments &amp; Revenue</h4>
            <p>Payment and revenue tools designed for private mobility environments — cards, wallets, ride packages, and reconciliation.</p>
          </div>
          <div class="mc-card">
            <div class="mc-icon"><i class="bi bi-plug"></i></div>
            <h4>Integrations &amp; APIs</h4>
            <p>Connect Electrify with the destination's existing software, infrastructure, and mobility ecosystem.</p>
          </div>
          <div class="mc-card">
            <div class="mc-icon"><i class="bi bi-lightning-charge"></i></div>
            <h4>EV, Battery &amp; IoT</h4>
            <p>Extend the mobility operating layer to electric fleets, charging networks, battery systems, and connected infrastructure.</p>
          </div>
        </div>

      </div>
    </section><!-- End Platform Overview Section -->
```

- [ ] **Step 2: Verify the id and old content are gone**

Run: `grep -n 'id="platform"\|id="services"' Electrify/index.html` — expect `id="platform"` present, `id="services"` absent.
Run: `grep -n -i "EV Retrofitting\|BNPL Options\|Battery Swapping</a>" Electrify/index.html` — expect no matches (old service cards removed).

- [ ] **Step 3: Validate HTML syntax**

Run: `tidy -q -e Electrify/index.html 2>&1 | grep -i error`
Expected: no output.

- [ ] **Step 4: Commit**

```bash
cd "$(git rev-parse --show-toplevel)"
git add Electrify/index.html
git commit -m "Replace Services section with Platform Overview (7 product cards)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_0158E8s6fyrLmUi6j5bj7L4R"
```

---

### Task 8: Add Product Architecture diagram and How It Works, remove dead/legacy blocks

**Files:**
- Modify: `Electrify/index.html` — delete the `.cta` "Schedule a Call" section, the commented-out More Services block, the `.info-box` FAQ section, and the commented-out Portfolio block; insert Product Architecture and How It Works in their place

**Interfaces:**
- Consumes: `.arch-diagram`/`.arch-row`/`.arch-node`/`.arch-node--accent`/`.arch-connector` and `.steps-grid`/`.step-card`/`.step-number` classes (Task 3).
- Produces: nothing later tasks structurally depend on.

- [ ] **Step 1: Delete the mid-page "Schedule a Call" CTA section**

Find and delete the block from `<!-- ======= Cta Section ======= -->` through `</section><!-- End Cta Section -->`. (Its `.cta` CSS pattern is reused later, in Task 11, for the Final CTA — don't touch `style.css` here.)

- [ ] **Step 2: Delete the commented-out More Services block**

Find and delete the block from `<!-- ======= More Services Section ======= -->` through `<!-- End More Services Section -->`.

- [ ] **Step 3: Delete the Common Q&A / FAQ section**

Find and delete the block from `<!-- ======= Info Box Section ======= -->` through `</section><!-- End Info Box Section -->`. (This FAQ was entirely about EV conversions and battery swapping — no equivalent exists in the new structure.)

- [ ] **Step 4: Delete the commented-out Portfolio block**

Find and delete the block from `<!-- ======= Our Portfolio Section ======= -->` through `<!-- End Our Portfolio Section -->`.

- [ ] **Step 5: Insert Product Architecture and How It Works**

In the now-empty space between the Platform Overview section (Task 7) and the Team section, insert:

```html
    <!-- ======= Product Architecture Section ======= -->
    <section id="architecture" class="section-bg">
      <div class="container">
        <div class="section-title">
          <h2>The Digital Operating Layer</h2>
          <p>Electrify sits between passengers, operations, fleets, and infrastructure — one connected system instead of disconnected tools.</p>
        </div>
        <div class="arch-diagram">
          <div class="arch-node">Passengers / Residents / Guests / Employees</div>
          <div class="arch-connector"></div>
          <div class="arch-node arch-node--accent">White-Label Passenger Experience</div>
          <div class="arch-connector"></div>
          <div class="arch-node arch-node--accent">Electrify Platform</div>
          <div class="arch-connector"></div>
          <div class="arch-row">
            <div class="arch-node">Driver App</div>
            <div class="arch-node">Operations Dashboard</div>
            <div class="arch-node">Payments &amp; User Access</div>
          </div>
          <div class="arch-connector"></div>
          <div class="arch-row">
            <div class="arch-node">Vehicles</div>
            <div class="arch-node">Fleet Data</div>
            <div class="arch-node">Reports</div>
          </div>
          <div class="arch-connector"></div>
          <div class="arch-node">APIs / IoT / Telematics / Charging / Battery Systems / Integrations</div>
        </div>
      </div>
    </section><!-- End Product Architecture Section -->

    <!-- ======= How It Works Section ======= -->
    <section id="how-it-works">
      <div class="container">
        <div class="section-title">
          <h2>Launch Your Mobility Network in Four Steps</h2>
        </div>
        <div class="steps-grid">
          <div class="step-card">
            <div class="step-number">1</div>
            <h4>Configure</h4>
            <p>Define zones, ride types, users, pricing, fleet, rules, and branding.</p>
          </div>
          <div class="step-card">
            <div class="step-number">2</div>
            <h4>Integrate</h4>
            <p>Connect payments, maps, destination systems, telematics, EV infrastructure, and required tools.</p>
          </div>
          <div class="step-card">
            <div class="step-number">3</div>
            <h4>Deploy</h4>
            <p>Launch the branded passenger experience, driver tools, and operations dashboard.</p>
          </div>
          <div class="step-card">
            <div class="step-number">4</div>
            <h4>Operate &amp; Optimize</h4>
            <p>Monitor the network, manage dispatch, understand demand, improve utilization, and scale using operational data.</p>
          </div>
        </div>
      </div>
    </section><!-- End How It Works Section -->
```

- [ ] **Step 6: Verify old sections are gone and new ones present**

Run: `grep -n 'id="architecture"\|id="how-it-works"' Electrify/index.html` — expect both present.
Run: `grep -n -i "Common <strong>Q&A\|Schedule a Call\|schedule-call.html" Electrify/index.html` — expect no matches.

- [ ] **Step 7: Validate HTML syntax**

Run: `tidy -q -e Electrify/index.html 2>&1 | grep -i error`
Expected: no output.

- [ ] **Step 8: Commit**

```bash
cd "$(git rev-parse --show-toplevel)"
git add Electrify/index.html
git commit -m "Add Product Architecture and How It Works sections, remove legacy EV/FAQ blocks

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_0158E8s6fyrLmUi6j5bj7L4R"
```

---

### Task 9: Add Somabay Case Study and Industries sections

**Files:**
- Modify: `Electrify/index.html` — insert two new sections after the How It Works section (Task 8) and before the Team section

**Interfaces:**
- Consumes: `.mc-grid`/`.mc-card`/`.mc-icon` classes (Task 3).
- Produces: `id="case-study"` and `id="industries"` anchors that Task 5's nav already links to.

- [ ] **Step 1: Insert the Case Study and Industries sections**

Insert directly after `</section><!-- End How It Works Section -->` and before `<!-- ======= Our Team Section ======= -->`:

```html
    <!-- ======= Somabay Case Study Section ======= -->
    <section id="case-study" class="section-bg">
      <div class="container">
        <div class="section-title">
          <h2>From Transportation Operation to Connected Mobility Network</h2>
          <p>How Electrify grew out of powering SomaRide at Somabay.</p>
        </div>
        <div class="row">
          <div class="col-lg-4 mb-4">
            <h4>The Challenge</h4>
            <p>Somabay operates a private destination with guests, homeowners, employees, destination-owned vehicles, and destination-managed drivers across multiple service requirements. Private mobility operations of this type often rely on fragmented workflows and limited real-time visibility.</p>
          </div>
          <div class="col-lg-4 mb-4">
            <h4>The Solution</h4>
            <p>Electrify provided a passenger application, driver application, operations dashboard, live vehicle tracking, ride management, payments, notifications, reporting, service-zone controls, and administrative tools.</p>
          </div>
          <div class="col-lg-4 mb-4">
            <h4>The Results</h4>
            <div class="trust-figure" style="font-size: 40px;">70,000+</div>
            <div class="trust-label">Completed rides — and the operational learning behind Electrify's scalable platform.</div>
          </div>
        </div>
        <div class="text-center mt-3">
          <a href="#contact" class="cta-btn scrollto">Build a Similar Network</a>
        </div>
      </div>
    </section><!-- End Somabay Case Study Section -->

    <!-- ======= Industries Section ======= -->
    <section id="industries">
      <div class="container">
        <div class="section-title">
          <h2>Built for Destinations That Operate Their Own Mobility</h2>
        </div>
        <div class="mc-grid">
          <div class="mc-card">
            <div class="mc-icon"><i class="bi bi-umbrella-fill"></i></div>
            <h4>Resorts &amp; Destination Communities</h4>
            <p>Provide guests, homeowners, employees, and visitors with a branded mobility experience across the destination.</p>
          </div>
          <div class="mc-card">
            <div class="mc-icon"><i class="bi bi-house-lock"></i></div>
            <h4>Gated Communities</h4>
            <p>Manage resident transportation, internal shuttles, service vehicles, and on-demand mobility.</p>
          </div>
          <div class="mc-card">
            <div class="mc-icon"><i class="bi bi-mortarboard"></i></div>
            <h4>Universities &amp; Campuses</h4>
            <p>Coordinate student, staff, visitor, and inter-campus transportation through one platform.</p>
          </div>
          <div class="mc-card">
            <div class="mc-icon"><i class="bi bi-buildings"></i></div>
            <h4>Business &amp; Industrial Parks</h4>
            <p>Improve employee transportation, internal logistics, and fleet utilization across large sites.</p>
          </div>
          <div class="mc-card mc-card--muted">
            <div class="mc-icon"><i class="bi bi-airplane"></i></div>
            <h4>Airports</h4>
            <p>Manage passenger transfers, staff transportation, airside mobility, and dedicated vehicle fleets.</p>
          </div>
          <div class="mc-card mc-card--muted">
            <div class="mc-icon"><i class="bi bi-geo-alt"></i></div>
            <h4>Tourism Destinations</h4>
            <p>Create integrated, branded mobility experiences across attractions, hotels, beaches, marinas, and transport hubs.</p>
          </div>
          <div class="mc-card mc-card--muted">
            <div class="mc-icon"><i class="bi bi-diagram-3"></i></div>
            <h4>Smart Cities &amp; Mixed-Use Developments</h4>
            <p>Connect multiple mobility services, operators, vehicles, users, and infrastructure within one digital layer.</p>
          </div>
        </div>
      </div>
    </section><!-- End Industries Section -->
```

- [ ] **Step 2: Verify anchors and content**

Run: `grep -n 'id="case-study"\|id="industries"' Electrify/index.html` — expect both present.
Run: `grep -n "70,000+" Electrify/index.html` — expect at least 2 matches now (Trust section + Case Study).

- [ ] **Step 3: Validate HTML syntax**

Run: `tidy -q -e Electrify/index.html 2>&1 | grep -i error`
Expected: no output.

- [ ] **Step 4: Commit**

```bash
cd "$(git rev-parse --show-toplevel)"
git add Electrify/index.html
git commit -m "Add Somabay Case Study and Industries sections to Electrify homepage

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_0158E8s6fyrLmUi6j5bj7L4R"
```

---

### Task 10: Add Benefits and Why Electrify sections

**Files:**
- Modify: `Electrify/index.html` — insert two new sections after the Industries section (Task 9) and before the Team section

**Interfaces:**
- Consumes: `.mc-grid`/`.mc-card`/`.mc-icon` classes (Task 3).
- Produces: nothing later tasks structurally depend on.

- [ ] **Step 1: Insert the Benefits and Why Electrify sections**

Insert directly after `</section><!-- End Industries Section -->` and before `<!-- ======= Our Team Section ======= -->`:

```html
    <!-- ======= Benefits Section ======= -->
    <section id="benefits" class="section-bg">
      <div class="container">
        <div class="section-title">
          <h2>Built for Operational Results</h2>
        </div>
        <div class="mc-grid">
          <div class="mc-card">
            <div class="mc-icon"><i class="bi bi-diagram-2"></i></div>
            <h4>Centralize Operations</h4>
            <p>Manage vehicles, drivers, trips, users, payments, and reporting from one system.</p>
          </div>
          <div class="mc-card">
            <div class="mc-icon"><i class="bi bi-speedometer2"></i></div>
            <h4>Improve Fleet Utilization</h4>
            <p>Understand where vehicles are, how they're being used, and where capacity is being wasted.</p>
          </div>
          <div class="mc-card">
            <div class="mc-icon"><i class="bi bi-emoji-smile"></i></div>
            <h4>Improve Passenger Experience</h4>
            <p>Give passengers real-time tracking, arrival updates, and a consistent branded service.</p>
          </div>
          <div class="mc-card">
            <div class="mc-icon"><i class="bi bi-palette"></i></div>
            <h4>Deliver a Branded Experience</h4>
            <p>Offer mobility under the destination's own brand rather than relying on third-party ride-hailing apps.</p>
          </div>
          <div class="mc-card">
            <div class="mc-icon"><i class="bi bi-car-front"></i></div>
            <h4>Support Multiple Vehicle Types</h4>
            <p>Manage cars, shuttles, golf carts, EVs, scooters, and other fleet types from one platform.</p>
          </div>
          <div class="mc-card">
            <div class="mc-icon"><i class="bi bi-bar-chart-line"></i></div>
            <h4>Turn Operations Into Data</h4>
            <p>Turn every ride and vehicle movement into useful operational insight.</p>
          </div>
        </div>
      </div>
    </section><!-- End Benefits Section -->

    <!-- ======= Why Electrify Section ======= -->
    <section id="why-electrify">
      <div class="container">
        <div class="section-title">
          <h2>Why Electrify</h2>
        </div>
        <div class="mc-grid">
          <div class="mc-card">
            <div class="mc-icon"><i class="bi bi-tag"></i></div>
            <h4>White-Label by Design</h4>
            <p>The platform launches under the customer's own identity, brand, operating rules, and service model.</p>
          </div>
          <div class="mc-card">
            <div class="mc-icon"><i class="bi bi-shield-lock"></i></div>
            <h4>Built for Private Networks</h4>
            <p>Designed for controlled destinations with their own vehicles, drivers, users, and operational policies — not a public marketplace.</p>
          </div>
          <div class="mc-card">
            <div class="mc-icon"><i class="bi bi-truck"></i></div>
            <h4>Vehicle-Agnostic</h4>
            <p>Support conventional, electric, shared, and specialized vehicle types through the same operating layer.</p>
          </div>
          <div class="mc-card">
            <div class="mc-icon"><i class="bi bi-boxes"></i></div>
            <h4>Modular</h4>
            <p>Start with ride operations and add payments, fleet intelligence, EV infrastructure, IoT, and integrations over time.</p>
          </div>
          <div class="mc-card">
            <div class="mc-icon"><i class="bi bi-cloud-arrow-up"></i></div>
            <h4>Asset-Light</h4>
            <p>Customers use their existing vehicles and drivers while Electrify provides the software layer.</p>
          </div>
          <div class="mc-card">
            <div class="mc-icon"><i class="bi bi-plug-fill"></i></div>
            <h4>Integration-Ready</h4>
            <p>Connect with destination systems, payment providers, telematics, charging equipment, and operational infrastructure.</p>
          </div>
        </div>
      </div>
    </section><!-- End Why Electrify Section -->
```

- [ ] **Step 2: Verify no quantified benefit claims were introduced**

Run: `grep -n -E "[0-9]+%|[0-9]+x faster|reduce[sd]? .* by [0-9]" Electrify/index.html`
Expected: no matches (brief forbids unverified quantified improvement claims).

- [ ] **Step 3: Validate HTML syntax**

Run: `tidy -q -e Electrify/index.html 2>&1 | grep -i error`
Expected: no output.

- [ ] **Step 4: Commit**

```bash
cd "$(git rev-parse --show-toplevel)"
git add Electrify/index.html
git commit -m "Add Benefits and Why Electrify sections to Electrify homepage

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_0158E8s6fyrLmUi6j5bj7L4R"
```

---

### Task 11: Add EV, Battery & IoT section

**Files:**
- Modify: `Electrify/index.html` — insert one new section after Why Electrify (Task 10) and before the Team section

**Interfaces:**
- Consumes: `.mc-grid`/`.mc-card`/`.mc-icon` classes (Task 3).
- Produces: nothing later tasks structurally depend on.

- [ ] **Step 1: Insert the EV, Battery & IoT section**

Insert directly after `</section><!-- End Why Electrify Section -->` and before `<!-- ======= Our Team Section ======= -->`:

```html
    <!-- ======= EV, Battery & IoT Section ======= -->
    <section id="ev-iot" class="section-bg">
      <div class="container">
        <div class="section-title">
          <h2>From Digital Mobility to Electric Mobility</h2>
          <p>Electrify can connect electric vehicles, charging points, battery-swapping stations, battery telemetry, and other connected infrastructure to the same platform used to manage everyday mobility operations.</p>
        </div>
        <div class="mc-grid">
          <div class="mc-card">
            <div class="mc-icon"><i class="bi bi-battery-charging"></i></div>
            <h4>Battery &amp; Charging Status</h4>
            <p>Monitor battery state and charging status across the fleet.</p>
          </div>
          <div class="mc-card">
            <div class="mc-icon"><i class="bi bi-arrow-repeat"></i></div>
            <h4>Swap-Station Monitoring</h4>
            <p>Track swap-station activity, battery assignment, and battery lifecycle history.</p>
          </div>
          <div class="mc-card">
            <div class="mc-icon"><i class="bi bi-broadcast"></i></div>
            <h4>Vehicle &amp; IoT Telemetry</h4>
            <p>Bring energy usage and connected-infrastructure alerts into the same operations dashboard.</p>
          </div>
        </div>
        <p class="text-center fw-bold mt-4">Digitize → Optimize → Electrify</p>
      </div>
    </section><!-- End EV, Battery & IoT Section -->
```

- [ ] **Step 2: Verify this section doesn't dominate the page**

Run: `grep -n 'id="ev-iot"' Electrify/index.html` — expect one match. Confirm by reading the surrounding structure that this is one section among many (not the hero/lead section) — the brief's core requirement is that EV/battery content stays a supporting layer, not the homepage's primary identity.

- [ ] **Step 3: Validate HTML syntax**

Run: `tidy -q -e Electrify/index.html 2>&1 | grep -i error`
Expected: no output.

- [ ] **Step 4: Commit**

```bash
cd "$(git rev-parse --show-toplevel)"
git add Electrify/index.html
git commit -m "Add EV, Battery & IoT section to Electrify homepage

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_0158E8s6fyrLmUi6j5bj7L4R"
```

---

### Task 12: Relocate and rewrite About, restyle Team

**Files:**
- Modify: `Electrify/index.html` — delete the current `<section id="about" class="about">...</section><!-- End About Us Section -->` block (near the top), insert a new `id="about"` section directly before `<!-- ======= Our Team Section ======= -->`, and restyle (not rewrite) the Team member cards
- Modify: `Electrify/assets/css/style.css:1156-1230` (approximate — the `.team` block) — light restyle only, no new classes needed beyond what's already there

**Interfaces:**
- Consumes: nothing new.
- Produces: `id="about"` anchor at its new location (Task 5's nav already links to `#about`).

- [ ] **Step 1: Delete the old About Us section from its current position**

Find and delete the block from `<!-- ======= About Us Section ======= -->` through `</section><!-- End About Us Section -->` (currently right after the header, before what was the Counts section).

- [ ] **Step 2: Insert the new About section directly before Team**

Insert immediately before `<!-- ======= Our Team Section ======= -->`:

```html
    <!-- ======= About Section ======= -->
    <section id="about" class="about">
      <div class="container">
        <div class="section-title">
          <h2>About Electrify</h2>
        </div>
        <div class="row justify-content-center">
          <div class="col-lg-8 text-center">
            <p>Electrify is building the software infrastructure behind private mobility networks.</p>
            <p>We help destinations launch and manage branded transportation systems using their own vehicles, drivers, operating rules, and customer experience.</p>
            <p>Our platform connects passengers, drivers, vehicles, payments, operations, analytics, and electric mobility infrastructure through one system.</p>
            <p class="fw-bold mt-4">Our vision is to make private mobility networks as measurable, connected, and scalable as modern digital platforms.</p>
          </div>
        </div>
      </div>
    </section><!-- End About Section -->
```

- [ ] **Step 3: Lighten the Team card visual weight to match the new card system**

In `Electrify/assets/css/style.css`, find the `.team .member` rule block (search for `.team .member {`). Add `border-radius: 10px;` and `overflow: hidden;` if not already present, and confirm the block visually matches the new restrained palette — this is a light touch, not a rewrite; if the existing team card styling already looks reasonable next to the new `.mc-card` styling, no CSS change is needed here at all. Use judgment during the Task 14 visual pass rather than guessing changes blind; skip this step if the existing team cards already look acceptable.

- [ ] **Step 4: Verify only one `id="about"` exists, in the new location**

Run: `grep -n 'id="about"' Electrify/index.html`
Expected: exactly one match, appearing after `id="ev-iot"` and before `id="team"` in the file.

- [ ] **Step 5: Validate HTML syntax**

Run: `tidy -q -e Electrify/index.html 2>&1 | grep -i error`
Expected: no output.

- [ ] **Step 6: Commit**

```bash
cd "$(git rev-parse --show-toplevel)"
git add Electrify/index.html Electrify/assets/css/style.css
git commit -m "Relocate and rewrite About section below product/proof content, ahead of Team

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_0158E8s6fyrLmUi6j5bj7L4R"
```

---

### Task 13: Final CTA, footer cleanup, and contact section copy

**Files:**
- Modify: `Electrify/index.html` — insert a Final CTA section between Team and Contact; update the Contact section's intro copy (keep the 4-field form as-is); fix stale footer links

**Interfaces:**
- Consumes: existing `.cta` CSS class (already defined in `style.css`, previously used by the now-deleted "Schedule a Call" section — Task 8 deleted its HTML but not its CSS, so it's still available here).
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Insert the Final CTA section between Team and Contact**

Insert directly after `</section><!-- End Our Team Section -->` and before `<!-- ======= Contact Us Section ======= -->`:

```html
    <!-- ======= Final Cta Section ======= -->
    <section class="cta">
      <div class="container">
        <div class="text-center">
          <h3>See Electrify on Your Own Network</h3>
          <p>Tell us about your destination, fleet, and mobility operation. Our team will show you how Electrify can be configured for your use case.</p>
          <a class="cta-btn scrollto" href="#contact">Book a Demo</a>
        </div>
      </div>
    </section><!-- End Final Cta Section -->
```

- [ ] **Step 2: Update the Contact section's intro copy**

Find (inside `<section id="contact" class="contact section-bg">`):

```html
        <div class="section-title">
          <h2>Contact Us</h2>
          <p>We always love to connect with everyone that's interested in partnering with us, or just curios! Please feel free to reach out to us at any time.</p>
        </div>
```

Replace with:

```html
        <div class="section-title">
          <h2>Book a Demo</h2>
          <p>Tell us about your destination, fleet, and mobility operation. Our team will show you how Electrify can be configured for your use case.</p>
        </div>
```

Leave the rest of the contact section (info blocks, the 4-field form, its `action`/`method`/classes) unchanged — this phase keeps the current field set per the design spec's scope decision.

- [ ] **Step 3: Fix stale placeholder footer links**

Find (in the footer's "Useful Links" column):

```html
              <li><i class="bx bx-chevron-right"></i> <a href="#">Home</a></li>
              <li><i class="bx bx-chevron-right"></i> <a href="#">About us</a></li>
              <li><i class="bx bx-chevron-right"></i> <a href="#">Services</a></li>
```

Replace with:

```html
              <li><i class="bx bx-chevron-right"></i> <a href="#hero" class="scrollto">Home</a></li>
              <li><i class="bx bx-chevron-right"></i> <a href="#about" class="scrollto">About</a></li>
              <li><i class="bx bx-chevron-right"></i> <a href="#platform" class="scrollto">Platform</a></li>
```

- [ ] **Step 4: Verify no dead `href="#"` links remain in the footer's Useful Links list**

Run: `grep -n 'href="#">' Electrify/index.html`
Expected: no matches inside the footer-links block (matches elsewhere in the file, if any, are pre-existing and out of scope — only the footer's Useful Links list is this task's target).

- [ ] **Step 5: Validate HTML syntax**

Run: `tidy -q -e Electrify/index.html 2>&1 | grep -i error`
Expected: no output.

- [ ] **Step 6: Commit**

```bash
cd "$(git rev-parse --show-toplevel)"
git add Electrify/index.html
git commit -m "Add Final CTA section, update contact intro copy, fix stale footer links

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_0158E8s6fyrLmUi6j5bj7L4R"
```

---

### Task 14: Full-page QA pass

**Files:**
- Read/verify only: `Electrify/index.html`, `Electrify/assets/css/style.css`, `Electrify/assets/img/slide/Slide3.jpg`

**Interfaces:**
- Consumes: the complete rewritten page from all prior tasks.
- Produces: the final, pushed state of `electrify-redesign`.

- [ ] **Step 1: Sweep for banned/stale language**

Run:
```bash
grep -n -i "35,000\|85,000\|Recharging the Future\|BNPL\|2- and 3-wheel\|retrofit" Electrify/index.html
```
Expected: no matches. If any appear, fix them inline (they indicate a section task above missed something) and re-run.

- [ ] **Step 2: Verify every nav anchor resolves to a real section id**

Run:
```bash
for anchor in hero platform industries case-study about contact; do
  count=$(grep -c "id=\"$anchor\"" Electrify/index.html)
  echo "$anchor: $count"
done
```
Expected: every anchor prints `1`. If any prints `0`, find the nav link referencing it and fix the mismatch; if any prints `2+`, remove the duplicate `id`.

- [ ] **Step 3: Verify heading hierarchy**

Run: `grep -n "<h1\|<h2\|<h3\|<h4\|<h5" Electrify/index.html`
Expected: no `<h1>` (the hero `<h2>` is intentionally the top-level visible heading per this template's existing pattern — don't introduce a competing `<h1>`), and no jump from an `<h2>` directly to an `<h5>` skipping `<h3>`/`<h4>` — read the output and confirm levels only ever step down by one at a time within each section.

- [ ] **Step 4: Verify no image is missing alt text**

Run: `grep -n 'alt=""' Electrify/index.html`
Expected: no matches. Every `<img>` should have a real, descriptive `alt` value (the hero uses CSS `background-image`, not `<img>`, so it's exempt from this check by construction — but the logo, About imagery if any, and all Team photos must have real alt text). Fix any remaining `alt=""` found (this most likely means the Team member `<img>` tags from the original template, e.g. `<img src="assets/img/team/abdelrhman.png" ... alt="">` — set each to the person's name and role, e.g. `alt="Abdelrhman Hatem, Chief Executive Officer"`).

- [ ] **Step 5: Validate full-file HTML syntax one more time**

Run: `tidy -q -e Electrify/index.html 2>&1`
Expected: zero `Error` lines. Read through any `Warning` lines and confirm none were newly introduced by this redesign (compare against what `git show main:Electrify/index.html | tidy -q -e 2>&1` reports for the pre-redesign baseline, if you want a clean diff of warnings).

- [ ] **Step 6: Re-check the Slide3.jpg baked-text mitigation decision point**

Open `Electrify/assets/img/slide/Slide3.jpg` (or view it live in the browser check below) and judge: is the center "ELECTRIC MOBILITY FOR A CLEANER TOMORROW" sign or the bottom-left "PEOPLE PLACES" plaque still clearly legible? If yes, this is a real open decision, not something to silently ship or silently "fix" — stop and flag it to the user with the three options from the design spec (accept as a minor deviation, request a replacement source photo, or drop to a 2-slide hero) rather than guessing which they'd prefer.

- [ ] **Step 7: Full browser walkthrough**

Run: `cd Electrify && python3 -m http.server 8000` (background), then load `http://localhost:8000/` in a browser (or via the claude-in-chrome tool) and check: all 3 hero slides read clearly; every nav link scrolls to the correct section; the Platform, Industries, Benefits, and Why Electrify card grids lay out correctly at desktop width and stack cleanly at a narrow (mobile) width; the architecture diagram stacks vertically on mobile; the contact form's required-field browser validation still fires on empty submit; no JavaScript errors appear in the console (check via the browser's dev tools or the claude-in-chrome console-reading tool). Stop the server afterward.

- [ ] **Step 8: Confirm nothing unrelated got swept in**

Run: `cd "$(git rev-parse --show-toplevel)" && git status --porcelain=v1 -uall`
Expected: the only pending changes are the unrelated ones already known from before this work started (root `GeeKTech/index.html`, the Techne Cairo files, `Electrify/Electrify Website Edits.md`) — nothing from this redesign should be uncommitted at this point.

- [ ] **Step 9: Push the branch**

```bash
cd "$(git rev-parse --show-toplevel)"
git push origin electrify-redesign
```

- [ ] **Step 10: Report**

Summarize for the user: files changed (list them), the deliberate nav "Solutions" omission (see File Structure section above), the Slide3.jpg baked-text mitigation outcome from Step 6, and the outstanding follow-up to test real contact-form email delivery on the live host (no PHP runtime was available to test this locally).

---

## Self-Review Notes

**Spec coverage:** every numbered section of the design spec (visual system, information architecture, hero carousel, product architecture, content sections, contact form, technical/UX pass, git workflow) maps to at least one task above (Task 3 → §1; Task 5 → §2/§3; Task 8 → §4; Tasks 6/7/9/10/11 → §5/§6; Task 13 → §6/§7; Task 14 → §8; branch discipline is in Global Constraints and every task's commit step → §10).

**Placeholder scan:** no task above defers content to "later" or says "similar to Task N" without repeating the actual markup — every insert/replace step contains complete, final HTML/CSS/JS.

**Type/anchor consistency:** nav hrefs added in Task 5 (`#platform`, `#industries`, `#case-study`, `#about`, `#contact`) are checked against the exact `id` values produced by Tasks 7, 9, 9, 12, and the pre-existing contact section respectively — Task 14 Step 2 re-verifies all five mechanically rather than trusting this by inspection alone.
