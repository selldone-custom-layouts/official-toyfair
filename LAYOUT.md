# Toy Fair Superstore — release notes

**Toy Fair Superstore** (package `toy-fair-superstore`) is a Layout of the Selldone shop **Toychi** (xapi `toychi-KX4iQgu0`), built for **toyfair.selldone.shop**. It is a skin of the Layout base (see [`BASE.md`](BASE.md)): everything that makes it this Layout is `skins/toyfair/skin.json` and `skins/toyfair/photos/`; the code, the flows and the checks are the base's.

## Setup

| Area | What is set |
| --- | --- |
| Repo | `toyfair-layout`, branch `main`; remote `upstream` (selldone/storefront, fetch only, push disabled); `origin` = `selldone-custom-layouts/official-toyfair` once published (`scripts/publish-github.sh`) |
| Names | `manifest.json` and `selldone-layout.json` from the skin (`package` is permanent after the first upload; the `description` must be right on the FIRST upload, Selldone keeps it) |
| Dev server | port **9178**, shop `toychi-KX4iQgu0` (`.env`); `npm run serve` (launch entry `toyfair-layout`) |
| Skin | Lagoon, Coral, Bluebell, Amber (brand `lagoon`), DM Sans over DM Sans, radius 12 / 8 px, basket word "basket" |
| Layout id | **53** |

## Home

1. **tf-hero** (panel): big words on a soft family-tint panel with two pills (the live offers, else the featured toys; the gift finder) beside the hero photo; on a phone the photo first.
2. **tf-shelf** (featured, family-dark band): four toys: the live offers (biggest saving first) titled "<shop> offers", else the best sellers across departments.
3. **tf-depts** (tiles): every department with toys as a picture tile with the category's own image; a scrolling row on a phone.
4. **tf-shelf** (favourites): the next four best sellers, departments mixed.
5. **tf-promos** (photos): the first two departments that have their own photo (`col-<slug>.webp`) as large photo cards; hidden on a shop whose departments have no photo.
6. **tf-ages** (pills, tint band): every age the toys' own specification uses, youngest first; each opens the catalogue with `?spec=age:<value>`.
7. **tf-shelf** (department): four toys of the department with the most toys after the first, under its own name.
8. **tf-budget** (pills): four round "Under X" amounts that split the live prices; each opens the catalogue with `?price=0-X`.
9. **tf-guides** (cards): the four newest posts of the shop's blog.
10. **tf-help** (rows): delivery, pickup points (only with a pickup point; else payment options), order tracking.

## Retail service pages (`components/ly/toyfair/retail/`)

`/gift-finder`, `/pickup-points`, `/pickup-points/:id`, `/track-order`, `/register`, `/help`, `/help/delivery`, `/help/pickup`, `/help/returns`, `/help/stock`, `/help/pre-orders`, `/help/gift-cards`, `/help/payment`, `/help/product-notices`. All from the shop's live delivery ways, pickup points and gateways; an honest empty state where the shop has none (Toychi today: no pickup point).

## Photos

| Slot | File | Size | In the build |
| --- | --- | --- | --- |
| hero | `skins/toyfair/photos/hero.webp` | 1440 × 960 | yes |
| col-building-toys-blocks | `skins/toyfair/photos/col-building-toys-blocks.webp` | 1040 × 780 | yes (promo, gift finder) |
| col-board-card-games | `skins/toyfair/photos/col-board-card-games.webp` | 1040 × 780 | yes (promo) |

The photos are the design set's own (Toychi Layout Mockups, `shared/art`: fair-playroom, fair-build, fair-together).

## Checks

<!-- CHECKS:START -->
(none yet)
<!-- CHECKS:END -->

## Releases

| Version | Date | Layout | Deploy | What |
| --- | --- | --- | --- | --- |
| 1.0.0 | 2026-11-24 | 53 | 810 | First release: the superstore header and footer, the ten home sections, the listing with the Filters drawer, the product page with the sticky buy box and accordions, the commerce flows in Toy Fair dress, the retail service pages from live settings, toy words and line art in English and Arabic. PROD-CHECK OK through toyfair.selldone.shop (no Layout pinned yet: the default storefront in its loader pointed at the build); 272 files; server copy verified (extracting false, error null, js and css match). Pinned on domain 1280 by the coordinator. |
| 1.0.1 | 2026-11-24 | 53 | 819 | The design's white panels on account, orders, addresses, the order page and messages, contact and FAQ; checkout steps as dots and lines, the order progress as small dots; the sign-in sheet with the Toy Fair wordmark; the Delivery card says to add the address first; the Theme and legal rows white on the brand footer; the article's cover under its title; round search button; cash on delivery in the Layout's words; shape-check on the skin's 12/8 scale. PROD-CHECK OK; server copy verified; pinned on domain 1280. |
