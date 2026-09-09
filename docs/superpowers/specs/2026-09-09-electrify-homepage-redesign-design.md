# Electrify Homepage Redesign — Design

**Status:** Approved, ready for implementation planning
**Scope:** `Electrify/index.html` only (homepage). No other Electrify pages (`inner-page.html`, `schedule-call.html`, `privacypolicy.html`, `termsofservice.html`, `portfolio-details.html`) are touched in this phase.
**Branch:** `electrify-redesign` (existing branch, 2 commits ahead of `main`; this is the dev branch for all work in this spec — do not commit to `main`).
**Source of truth for content/positioning:** `Electrify/Electrify Website Brief.md` (2026-09-08, consolidated). It explicitly supersedes `Electrify Website Edits.md` and `Refresh Requirements.md`, including the traction figure — use **70,000+ completed rides**, never 35,000+/85,000+. Where this spec doesn't repeat brief content verbatim, the brief is authoritative for copy/section requirements; this spec covers the structural, visual, and technical decisions the brief leaves open.

---

## 1. Problem / current state

`Electrify/index.html` (883 lines) is a battery-swapping/EV-retrofit/BNPL pitch end to end: hero carousel ("Recharging the Future, One Battery Swap at a Time" narrative), services cards for "Battery Swapping"/"BNPL Options"/"EV Retrofitting," an FAQ about EV conversions, meta description calling Electrify an EV-conversion company. None of this matches the brief's target positioning ("the operating system for private mobility networks"). This is a full content and structural rewrite of one file, not a patch.

## 2. Visual system — moderate restyle

Keep the existing stack: Bootstrap 5, AOS scroll animations, `Electrify/assets/css/style.css`, `Electrify/assets/js/main.js`. Do not introduce a new CSS framework or rebuild the build pipeline.

Within that stack, redefine:
- **Type scale:** larger hero/section headline sizes than the current template default — the current look reads as small-template-generic, brief wants enterprise-confident.
- **Spacing rhythm:** more vertical whitespace between the ~14 homepage sections than the current tightly-packed template sections.
- **Palette:** keep Electrify's existing brand accent color; pull back the bright "startup icon-box" treatment (`bx bx-wrench`, `bx bx-battery` icon tiles) in favor of a more restrained enterprise card style.
- **Shared card component:** one card pattern (icon or label, heading, 1–2 line description) reused for Platform Overview, Industries, and Benefits sections instead of three separately-styled card layouts. Reduces new CSS surface and keeps the page visually coherent.

This is a CSS/markup-level restyle inside the existing files — not a rewrite of `style.css` from scratch.

## 3. Information architecture

**Navigation** (replaces current About Us/Services/Team nav):
`Platform · Solutions · Industries · Case Study · About · Contact`, all same-page anchors (`#platform`, `#industries`, etc. — no separate pages exist yet), plus a `Book a Demo` primary CTA button in the nav. Do not create links to pages that don't exist.

**Homepage section order** (per brief §8/§18, both agree on this order):
1. Navigation
2. Hero carousel
3. Trust / deployment proof
4. Customer problem
5. Platform overview
6. Product architecture (diagram)
7. How it works
8. Somabay case study
9. Industries
10. Operational benefits
11. Why Electrify
12. EV, Battery & IoT
13. Team
14. Final CTA
15. Footer

Each section is a self-contained `<section id="...">` block using the shared card component where applicable, so a later dedicated Platform/Industries/Case-Study page can lift a section out without restructuring (brief §30 asks for this).

## 4. Hero carousel

Rebuild in place using the **existing** `#heroCarousel` Bootstrap fade-carousel mechanism (`carousel slide carousel-fade`, `data-bs-ride`, indicators, prev/next controls) — this already has working responsive/aspect-ratio behavior, so the brief's "preserve existing carousel behavior" instruction is satisfied by keeping the mechanism and only changing slide content/images.

Per-slide markup changes from current (`<h2>` + `<p>` + icon row) to: eyebrow line, headline, body copy, single CTA — matching brief §10 exactly:

| Slide | Eyebrow | Headline | CTA |
|---|---|---|---|
| 1 — Destination | PRIVATE MOBILITY, REIMAGINED | The operating system for private mobility. | Discover Electrify |
| 2 — Intelligence | ONE PLATFORM. EVERY JOURNEY. | Run the whole network from one place. | Explore the Platform |
| 3 — Electrification | BUILT FOR WHAT COMES NEXT | Smarter mobility. Ready for electric. | Build Your Network |

**Image mapping** (banner photos supplied in `Electrify/banner/`, to be moved into `Electrify/assets/img/slide/` replacing current `Slide1/2/3.png`):
- `banner/3.png` → `Slide1.png` (Destination: coastal resort road, golf carts, open sky — natural negative space for copy)
- `banner/2.png` → `Slide2.png` (Intelligence: operations control room, desk monitors with maps/dashboards)
- `banner/1.png` → `Slide3.png` (Electrification: battery-swap station, e-scooters, EV golf cart, golden hour)

`banner/1.png` has marketing text baked into physical signage in the shot ("SWAP RIDE EXPLORE...", "ELECTRIC MOBILITY FOR A CLEANER TOMORROW"), which brief §10 explicitly forbids ("Never bake logos, headlines, paragraphs... into them"). Decision: keep the image; use CSS `object-position` and a darker gradient overlay to push the baked text toward a frame edge and reduce its legibility, rather than sourcing a replacement photo. Add a consistent dark gradient overlay across all three slides for text contrast (all three currently have none).

Copy stays live HTML on all three slides — never baked into the images, per brief.

## 5. Product architecture diagram

Brief §14 gives this only as an ASCII diagram. Build it as an **HTML/CSS box-and-arrow layout** (nested flex/grid divs with connecting lines via CSS borders/pseudo-elements), not a flattened raster image or hand-authored SVG. This keeps it theme-consistent with the rest of the page, accessible (real text in real DOM nodes, not image alt-text), and naturally responsive (stacks vertically on mobile instead of needing a second mobile-specific image asset).

## 6. Content sections

Copy and structure for these sections come directly from the brief (§12–§21) — this spec doesn't restate it, only the component/pattern decision:
- **Trust/Proof:** Somabay proof point + "70,000+ completed rides" + optional "10 million m² destination" context. **No logo strip** — no customer/partner logos are cleared to publish; add one later only once approved assets exist.
- **Platform Overview:** 7 cards (Passenger App, Driver App, Operations Dashboard, Fleet Intelligence, Payments & Revenue, Integrations & APIs, EV/Battery/IoT) using the shared card component from §2.
- **How It Works:** 4 numbered steps (Configure/Integrate/Deploy/Operate & Optimize).
- **Somabay Case Study:** Challenge/Solution/Results structure per brief §6, results using only the 70,000+ figure — no other numbers.
- **Industries:** 7 cards, visually prioritize the first 4 (Resorts, Gated Communities, Campuses, Business/Industrial Parks + Airports) over the remaining 3, per brief's "do not make every vertical appear equally important."
- **Benefits / Why Electrify:** short outcome-oriented list items, no quantified claims without evidence.
- **EV, Battery & IoT:** reframed as one capability layer (brief §19), same card component, not a dedicated hero-level section.
- **Team:** existing team card markup (`Electrify/assets/img/team/*`) restyled to match the new card pattern, not rebuilt from scratch; moved lower in page order (already last content section before final CTA).
- **Final CTA / Footer:** single "Book a Demo" CTA; footer content largely unchanged unless it contains stale battery-first copy.

## 7. Contact form

`Electrify/forms/contact.php` is a simple custom PHP `mail()` script (not the broken BootstrapMade-library pattern found elsewhere in the GeeKTech monorepo) — structurally fine as-is. Work needed:
- Add client-side validation (required fields already marked `required`, but brief wants explicit success/error UI states, which the current form's `.loading`/`.error-message`/`.sent-message` divs exist for but need JS wiring — check `main.js` for whether this already works via the template's AJAX submit pattern before rewriting).
- **Test actual delivery** (submit the form for real) rather than assuming `mail()` works on this host — PHP `mail()` without SPF/DKIM is a common silent-failure point even when the code is correct.
- **Field set stays at the current 4 fields** (name/email/subject/message) for this phase — brief §30 says not to expand scope unnecessarily, and the full lead-qualification field set (Company, Job title, Country, fleet size, etc.) is listed under the brief's future dedicated Contact page, not required for the homepage phase. Update the CTA copy above the form to the brief's suggested line ("Tell us about your destination, fleet, and mobility operation...") without changing the fields themselves.

## 8. Technical / UX pass

Per brief §28: semantic HTML and correct heading hierarchy through the rewrite, descriptive alt text on all images (including the 3 hero images and diagram), visible focus states, `prefers-reduced-motion` respected (AOS already supports disabling via media query — verify it's wired), lazy-load below-the-fold images (`loading="lazy"`), optimize the 3 new hero PNGs (they're ~2.3–2.6MB each — need compression/resizing before shipping, not used at source resolution), update `<title>`/meta description/keywords and add Open Graph tags per brief §27, keep favicon as-is (already Electrify-branded). Final sweep for stray `35,000`/`85,000`/battery-first language across the whole file after the rewrite (brief §29 "after implementation" checklist).

## 9. Open items for the implementation plan (not decided here)

- Exact copy for any brief sections that offer multiple phrasing options (e.g., alternative CTA copy, alternative case-study heading) — pick one consistent option during implementation rather than shipping both.
- Image compression tooling/targets for the 3 hero PNGs.

## 10. Git workflow

All commits for this work land on the existing `electrify-redesign` branch and get pushed to `origin` (`github.com/Abdelrhman2021/GeeKTech.git`) — not `main`. Before staging, always check `git status` and stage only paths relevant to this redesign; the working tree has unrelated in-flight changes (root `GeeKTech/index.html` edits, a "Techne Cairo" logo/announcement image under `assets/img/`) that belong to other work and must not be swept into these commits.
