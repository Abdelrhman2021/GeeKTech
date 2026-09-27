# Electrify Redesign — Answers

## 1. Slide 3 hero image — baked-in signage

> **D. Retouch/clone out the sign text in the existing image.**

Keep the image and composition, but remove the baked-in signage cleanly. The image works for the Electrification story; the visible text is the problem, not the visual itself.

The final image should look natural and should not appear obviously retouched.

---

## 2. Push and merge

> **A. Push the branch now and open a PR for review.**

Push `electrify-redesign` to origin and open a PR. Do not merge it into `main` yet.

I want to review the redesigned site in its complete state before it replaces the current production version.

---

## 3. Remaining sections — how far to push the redesign

> **A. Leave them.**

Uniform cards are fine where the content represents genuinely parallel concepts.

The goal isn't to eliminate cards everywhere; it's to stop the entire website from feeling like a sequence of interchangeable card grids. Since Platform Overview, Trust/Proof, and the hero now establish stronger structural variation, the remaining grids can provide useful visual rhythm.

Do a final consistency pass for spacing, typography, responsive behavior, and hierarchy, but don't structurally redesign those sections just for the sake of making them different.

---

## 4. The `--clay` terracotta accent

> **A. Yes — use it on the Case Study stat.**

Use the terracotta selectively on the `70,000+ completed rides` figure.

It should function as a rare emphasis color rather than becoming another general-purpose accent. The number represents real-world proof and deserves to visually interrupt the otherwise teal-led system.

Do not start distributing `--clay` across other cards, icons, or CTAs just to use the palette.

---

## 5. Contact form — email header injection

> **A. Fix it now.**

Sanitize the `name` and `email` inputs before constructing any mail headers, including stripping CR/LF characters that could enable header injection.

Also validate the email field properly before using it in `Reply-To`.

Keep this as a small security fix rather than turning it into a larger contact-form rewrite.

---

## 6. Somabay name/logo permission

> Keep the Somabay/SomaRide references for now, but do not introduce the Somabay logo unless we explicitly confirm permission.

We can reference SomaRide as a project/case study and use factual information about our work, including `70,000+ completed rides`.

For now, avoid presenting Somabay branding in a way that implies endorsement, partnership marketing approval, or formal authorization beyond the factual case study.

If an actual Somabay logo is currently used, replace it with a text treatment until we confirm permission.

---

## 7. Inner pages

> Fix the navigation links now, but leave the larger redesign/content rewrite for a later phase.

No production-facing page should contain navigation links pointing to anchors that no longer exist.

Update the shared navigation/header behavior so links from inner pages correctly reach the relevant current homepage sections.

Do **not** expand the scope into redesigning all five inner pages right now. We can handle their old battery-first copy and visual redesign as Phase 2 after the main homepage is approved.

If any old copy creates a direct contradiction with the new positioning — particularly language that defines Electrify primarily as a battery-swapping company — flag those instances for me rather than silently rewriting the pages.

---

## 8. Live host for `og:image` / `og:url`

> Yes, `https://electrify.geektech.software/` is the domain we're currently using for the Electrify website.

Keep the Open Graph configuration pointed there.

Before merging, verify that the final `og:image` resolves using an absolute production URL and that the metadata correctly reflects the new positioning.

---

## Final instructions

Once these changes are complete:

1. Push `electrify-redesign`.
2. Open the PR.
3. Do not merge to `main`.
4. Give me the PR link and a concise list of anything that still needs a decision from me.
5. Flag any remaining copy anywhere in the repository that materially contradicts the new positioning:

**Electrify is a vehicle-agnostic Mobility OS for destinations and private mobility networks, expanding toward an Energy OS as those fleets electrify.**

Do not reposition Electrify as a battery-swapping company, scooter company, golf-cart company, or ride-hailing operator.