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

`/gift-finder`, `/pickup-points`, `/pickup-points/:id`, `/track-order`, `/register`, `/help`, `/help/delivery`, `/help/pickup`, `/help/returns`, `/help/stock`, `/help/pre-orders`, `/help/gift-cards`, `/help/payment`, `/help/product-notices`. All from the shop's live delivery ways, pickup points and gateways; an honest empty state where the shop has none.

Toychi since 24 Nov 2026: one pickup point, **Toychi Pickup · Bryant Park** (6th Avenue at West 42nd Street, New York 10018), and a **Truck** way (no distance limit, free, cash on delivery) beside the courier in town (30 km). The finder lists the point with its address and the shop's note; the point's page shows it on a map (its own location, Selldone's map service, LyMap) with directions, when to collect (the Pickup way's own days and windows) and the shop's note. A way's name comes from its kind when the shop gave none: the courier "Toychi courier", the truck "Toychi truck delivery", the point by its own name ("Pickup at <name>" when the name does not say pickup); "No distance limit" for Selldone's 99999 km. A pickup point is where orders wait, not the shop's address: About and the FAQ do not call the shop "at Bryant Park"; Contact shows the point as "Pickup point" with its map when the shop has no address of its own. At checkout, before an address only Pickup is offered and the Delivery card says the ways to the door come with the address; the bag says so only while there is no address: with one it lists the ways to the door that reach it by name and price ("Delivers to Los Angeles: Toychi truck delivery · Free"), and when none does it says door delivery doesn't reach the address and names the pickup point (the courier's 30 km are around the shop's warehouse in Memphis: New York and Los Angeles get the truck and pickup, Memphis the courier too); the answer to an older basket update that comes back after a newer one left is dropped (it could put back the delivery it was sent with).

## Tablets (768, 820, 1024, 1180)

Checked at each width in light and dark, every page, drawer, sheet, the filters, checkout and the account, beside the design. No card is left alone in a row: the home's shelves, similar toys and good finds stay four to a row on every tablet (two by two on a phone); a listing whose last row would hold one card takes one column more or fewer; departments in two even rows; seven ages in one row (on a phone the odd last one takes the row); the help topics, the journal's posts, About's collections and a product's "why they'll love it" never leave one alone. A card photo never shrinks below a phone's (six-toy rows three to a row up to 1200px; the save heart smaller on a small card). The bag, checkout and account pages keep two columns down to 621px, as the design (the order page stays one column below 980px); a bag line narrower than 560px takes the phone's two rows. Compare fits its three toys and the add slot from 980 to 1300px. The page stops scrolling behind a side panel or a sheet (Selldone's own `html { overflow: auto !important }` beat the inline lock: `html.ly-lock`), so no page scroll bar beside the bag; a panel that does scroll has a thin track in the family's line colour.

## Photos

| Slot | File | Size | In the build |
| --- | --- | --- | --- |
| hero | `skins/toyfair/photos/hero.webp` | 1440 × 960 | yes |
| col-building-toys-blocks | `skins/toyfair/photos/col-building-toys-blocks.webp` | 1040 × 780 | yes (promo, gift finder) |
| col-board-card-games | `skins/toyfair/photos/col-board-card-games.webp` | 1040 × 780 | yes (promo) |

The photos are the design set's own (Toychi Layout Mockups, `shared/art`: fair-playroom, fair-build, fair-together).

## Checks

<!-- CHECKS:START -->
The fast runner (`new-shop-kits/fast-checks`, config `scripts/fast-checks.config.mjs`; widths 1440, 1024, 820 and 390 since 1.0.4) on https://toyfair.selldone.shop, 24 Nov 2026, on 1.0.5: TOTAL 0, every check type (ring, card-edge, corner, circle, contrast for every palette and the custom colours in light and dark, cart, currency, box, i18n with forced Arabic, text-col, shape, underline, variant). The guest checkout walks (`scripts/checkout-walk.mjs`, nothing ordered, at 1440, 820 and 390): `WALK_PLACE="Los Angeles" WALK_WAY=truck` (the address searched in the sheet first; the courier's 30 km is out, "Toychi truck delivery" and the pickup point are offered; Place order opens Selldone's payment window, cash on delivery, $49.00) WALK OK; `WALK_WAY=pickup` (no address; "Toychi Pickup · Bryant Park" with a window; the payment window, $49.00) WALK OK. The tablet pass (768, 820, 1024, 1180, light and dark, every page, drawer, sheet, the filters, checkout and the account, a scripted audit of lone cards, card photo widths, buttons over photos, scroll tracks and overflow, then each screenshot beside the design) and 390 and 1440 after it: no lone card, no page overflow, no stray track (the filter drawer and the address form scroll on purpose, with the thin family track). Test inputs: product 741339 and 741344, category /cars-trains-vehicles-category, search "rover", article /blog/build-a-town-from-blocks-36427, compare p741339_p741344_p741313.
<!-- CHECKS:END -->

## Releases

| Version | Date | Layout | Deploy | What |
| --- | --- | --- | --- | --- |
| 1.0.0 | 2026-11-24 | 53 | 810 | First release: the superstore header and footer, the ten home sections, the listing with the Filters drawer, the product page with the sticky buy box and accordions, the commerce flows in Toy Fair dress, the retail service pages from live settings, toy words and line art in English and Arabic. PROD-CHECK OK through toyfair.selldone.shop (no Layout pinned yet: the default storefront in its loader pointed at the build); 272 files; server copy verified (extracting false, error null, js and css match). Pinned on domain 1280 by the coordinator. |
| 1.0.1 | 2026-11-24 | 53 | 819 | The design's white panels on account, orders, addresses, the order page and messages, contact and FAQ; checkout steps as dots and lines, the order progress as small dots; the sign-in sheet with the Toy Fair wordmark; the Delivery card says to add the address first; the Theme and legal rows white on the brand footer; the article's cover under its title; round search button; cash on delivery in the Layout's words; shape-check on the skin's 12/8 scale. PROD-CHECK OK; server copy verified; pinned on domain 1280. Live checks on 1.0.1: every type 0 but shape 84 (the hero photo's square inner corners, the journal search's focus ring); guest checkout walk OK at 1440 and 390 (address first, Toychi courier, Selldone's payment window with cash on delivery, no order). |
| 1.0.2 | 2026-11-24 | 53 | 822 | Shape: the hero photo an inner-radius box in its panel, the journal search keeps its focus ring and is a pill; compare in one white panel; the address sheet's buttons as sentence-case pills. PROD-CHECK OK; server copy verified; pinned on domain 1280. |
| 1.0.3 | 2026-11-24 | 53 | 825 | Compare without the white panel (its sticky heads and label column read as square boxes: shape 80 → 0); `/blog/<article id>-<slug>` (an article id or a blog id) opens the post and becomes its own address; the Arabic wordmark keeps its own direction. PROD-CHECK OK (the third try: Selldone's storefront hosting was down twice); server copy verified; pinned on domain 1280. Live on 1.0.3: the full suite TOTAL 0, every type. |
| 1.0.4 | 2026-11-24 | 53 | 829 | Tablets 768, 820, 1024, 1180 in light and dark (see Tablets): no card alone in a row, photos at least a phone's, two-column bag, checkout, account and order pages, compare fits, no page scroll bar beside a panel. The shop's new delivery: the pickup point's map, directions, days and windows; "Toychi truck delivery"; the pickup point is not the shop's address; the ways to the door come with the address; an older basket update's answer dropped. 820 added to the checks and the walk; the walk takes WALK_PLACE and WALK_WAY. PROD-CHECK OK; 273 files; server copy verified; pinned on domain 1280 (the first pin call answered 500, the second took). On the live domain the walks were OK but the suite found 135: on a phone the listing three 110px columns (the tablet's grid rule out-ranked the phone's; text-col) and the save heart 6px from a small card's edge (card-edge 133); fixed in 1.0.5. |
| 1.0.5 | 2026-11-24 | 53 | 830 | Phones: the listing two to a row again; the save heart 8px from the card's edge; three guides one to a row. PROD-CHECK OK; 273 files; server copy verified; pinned on domain 1280. Live on 1.0.5: the full suite TOTAL 0 at 1440, 1024, 820 and 390; both walks OK at 1440, 820 and 390. |
