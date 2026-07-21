# Electrify Homepage Refresh — Requirements Needed From You

Companion to `Electrify Website Edits.md`. That file specifies *what the new homepage should say and how it should be structured*. This file lists what I still need from you — real content, assets, and a few decisions — before the rewrite (content + visual refresh) can be finished rather than left full of placeholders.

Already decided, no action needed:
- Phase scope: homepage only for now. The 6 new subpages (Platform, Solutions, Industries, Case Studies, About, Contact) are a later phase.
- Visual scope: this phase includes a visual refresh, not just copy/structure changes.
- All work happens on the `electrify-redesign` branch; nothing merges to `main` until you approve.
- Contact form backend already works (plain PHP `mail()` to `support@geektech.software`) — no backend fix needed, just adding fields.

---

## A. Verified Metrics (do not fabricate — brief is explicit about this)

Only one figure is currently verified. Everything else will render as a visible placeholder until you supply a real number, or tell me to drop that stat entirely.

- [ ] Somabay: number of vehicles
- [ ] Somabay: number of drivers
- [ ] Somabay: number of active/registered users
- [ ] Somabay: platform uptime %
- [ ] Somabay: monthly ride volume (if different from the 35,000+ total)
- [ ] Somabay: any response-time / operational-improvement % worth citing
- [ ] Confirmed: **35,000+ completed rides** ✅ (already verified, will be used as-is)
- [ ] Any other real customer/deployment besides Somabay to feature?

## B. Logos & Permissions

- [ ] Somabay logo file (for the case-study section) — do you have written/verbal permission to display it?
- [ ] Any technology/accelerator/ecosystem partner logos to feature, and confirm permission for each
- [ ] Confirm current logo files in `assets/img/` (`Electrify.png`, `electrify-circle.png`, `electrify-landscape.png`) are the ones to keep using, or is there a newer logo?

## C. Product Screenshots (for hero, platform overview, architecture visual)

None currently exist in the repo. Pick one per item:

- [ ] Live fleet map — real screenshot, or generic/mockup placeholder for now?
- [ ] Operations dashboard — real screenshot, or placeholder?
- [ ] Driver app — real screenshot, or placeholder?
- [ ] Passenger app / booking flow — real screenshot, or placeholder?
- [ ] If any of these products don't actually exist yet in built form, say so — changes what "placeholder" should look like (mockup vs. "coming soon" treatment).

## D. Visual Design Direction (since this phase includes a refresh, not just reuse)

- [ ] Keep the current color scheme, or move to something new? If new, any preference (or should I propose options)?
- [ ] Any reference sites/competitors whose visual style you like (enterprise SaaS feel, etc.)?
- [ ] Real photography available (destinations, drivers, vehicles at Somabay or elsewhere), or should imagery lean on abstract/UI-driven visuals instead of photos for now?

## E. Copy Confirmation

The brief gives specific recommended copy. Confirm as-is, or flag edits:

- [ ] Hero headline: "The Operating System for Private Mobility Networks" — use as-is?
- [ ] Primary CTA label: "Book a Demo" — confirmed, and should it link to the existing `schedule-call.html` page?
- [ ] Secondary CTA "View Our Deployment" scrolling to Somabay section — confirmed?
- [ ] Positioning statement: lead with "The Operating System for Private Mobility Networks" or the alternative "A white-label mobility operating system for destinations that operate their own vehicles and drivers"?

## F. Navigation for This Phase

Since Platform/Solutions/Industries/Case Study/About are separate *pages* in the brief but this phase is homepage-only:

- [ ] Should those nav items link to same-page anchor sections for now (e.g. `#platform`, `#industries`), to be swapped for real pages in Phase 2?
- [ ] Or should the nav stay closer to the current structure until Phase 2 actually adds those pages?

## G. Contact Form Fields

Brief recommends replacing the current 4-field form (name, email, subject, message) with a longer qualification form:

- [ ] Confirm the full field list: full name, work email, company, job title, country, type of destination, current fleet size, number of drivers, mobility challenge, expected deployment timeline
- [ ] Anything to drop from that list, or add?
- [ ] Recipient stays `support@geektech.software`?

---

Fill in what you can (inline, or however's easiest) and send it back — anything left blank just means it ships as a clearly labeled placeholder for this round, per the brief's own rule against inventing content.
