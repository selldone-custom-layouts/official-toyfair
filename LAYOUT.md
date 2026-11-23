# Toy Fair Superstore — release notes

**Toy Fair Superstore** (package `toy-fair-superstore`) is a Layout of the Selldone shop **Toychi** (xapi `toychi-KX4iQgu0`), built for **toyfair.selldone.shop**. It is a skin of the Layout base (see [`BASE.md`](BASE.md)): everything that makes it this Layout is `skins/toyfair/skin.json` and `skins/toyfair/photos/`; the code, the flows and the checks are the base's.

## Setup

| Area | What is set |
| --- | --- |
| Repo | `toyfair-layout`, branch `main`; remote `upstream` (selldone/storefront, fetch only, push disabled); `origin` = `selldone-custom-layouts/official-toyfair` once published (`scripts/publish-github.sh`) |
| Names | `manifest.json` and `selldone-layout.json` from the skin (`package` is permanent after the first upload; the `description` must be right on the FIRST upload, Selldone keeps it) |
| Dev server | port **9178**, shop `toychi-KX4iQgu0` (`.env`); `npm run serve` (launch entry `toyfair-layout`) |
| Skin | Lagoon, Coral, Bluebell, Amber (brand `lagoon`), DM Sans over DM Sans, radius 12 / 8 px, basket word "basket" |
| Layout id | (after the first upload) |

## Home

1. **hero** (split): The shop's name and line on the left; the counter photo bleeding to the right edge of the frame, a framed inset across the seam with the best seller, the three most-ordered collections set large on the photo's dark corner (from Pralino).
2. **collections** (cards): The same four as a 2 × 2 grid of cards, the photo on top inside the card (Domino).
3. **journal** (photo, tint band): The four newest posts beside a tall photo with the big word 'Journal' (from Pralino; best last).

## Photos

| Slot | File | Size | In the build |
| --- | --- | --- | --- |
| hero | `skins/toyfair/photos/hero.webp` | 1440 × 960 | yes |
| build | `skins/toyfair/photos/build.webp` | 1040 × 780 | yes |
| together | `skins/toyfair/photos/together.webp` | 1040 × 780 | yes |
| each collection | `skins/toyfair/photos/col-<slug of its title>.webp` | 1040 × 780 | 0 file(s); a collection without one shows its best sellers on a plate |

## Checks

<!-- CHECKS:START -->
(none yet)
<!-- CHECKS:END -->

## Releases

| Version | Date | Layout | Deploy | What |
| --- | --- | --- | --- | --- |
