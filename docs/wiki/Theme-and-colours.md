# Theme and colours

Toyfair runs the **shared theme switcher** (`components/theme-switcher/`), the same code as the other custom Layouts. Toyfair's palettes are in `components/ly/ly-theme.ts`, the **colour family** that paints every ground from the palette in `components/ly/ly-family.ts`, and the brand palette's values for the first paint (with the type and the shape scale) in `style/ly-skin.gen.scss`, all from the palettes of `skins/toyfair/skin.json`; the **one file a merchant edits** is `components/ly/ly-theme.settings.ts`.

## One colour family

Toyfair is drawn in one colour family: every colour on the page comes from the palette's hue, plus white and the family's near-black. Switching the palette, or picking a custom colour, re-tints the bands, the plates, the lines, the words, the dark top bar and footer, the chips, the map pin and the buttons at once; the browser's own theme colour follows the top bar.

`ly-family.ts` builds the family from the palette's colour in OKLCH, keeping its hue and capping its chroma, at fixed lightnesses:

| Part | Light mode | Dark mode |
| --- | --- | --- |
| Page | white | L .17 |
| Bands, soft tint | L .985 | L .195 |
| Cards | L .985, or white | L .225 |
| Plates under the pastries | L .966 | L .26 |
| Deeper tint (drawings, lines) | L .925 and .86 | L .31 |
| The dark top bar and footer | L .24 | L .15 |

Ink, muted words and field edges are then walked until they reach their contrast: ink 7:1 on the deeper tint, muted words 4.6:1, a field's edge 3:1; words on the dark bars use the hue at 7:1. The theme switcher writes only the action colour (`--ly-act`, `--ly-act-deep`, `--ly-act-on`, `--ly-act-text`) and Vuetify's primary on top, and `ly-family.ts` also repaints Vuetify's own dialogs, menus and fields from the same family.

## Toyfair's colours

Toyfair paints every action with **one colour**, Lagoon `#087865` (white words 5.41:1) on every button, chosen state and link; on the dark top bar and footer the family's light shade (`--ly-act-dk`, `#5fbba5`) marks the hover. The Lagoon family is built from the seed `#087865`.

Around it, in the light mode: a white page `#ffffff` with soft tint bands and cards `#f2fdfa`, plates `#e8f8f3`, a deeper tint `#c8f1e5`, near-black ink `#172521`, muted words `#52615d`, lines `#cfe5df`; a dark top bar and footer in the family's darkest shade `#0a251f` with words `#edfaf6`. These are the Lagoon values: with another palette or a custom colour every one of them takes that colour's hue. In the dark mode, the family's night: the page and header `#0a110f`, bands and fields `#0e1715`, cards `#131f1b`, plates `#132923`, words `#e6f4f0`, muted words `#b1c2bd`, lines `#23312d`, the top bar and footer `#000f0b`, the action colour `#087865` with white words and links `#66c1ac`. Every colour is a token (`--ly-…`): `style/ly-skin.gen.scss` holds the brand palette's values (`:root` is light, `html.ly-dark` is dark) and `ly-family.ts` rewrites them for the palette on the page.

The mode from the settings file (light by default) is painted before the first paint on every shop, so the other mode never flashes.

## On Toyfair's showcase shop

![The footer's Theme row](https://raw.githubusercontent.com/selldone-custom-layouts/official-toyfair/main/docs/screenshots/desktop-theme.jpg)

The **Theme** row sits in the footer, in a band of its own above the legal row, on the family's dark in both modes. It is never in the header. It holds:

- **Colour:** Lagoon, Coral, Bluebell, Amber (Lagoon is the default), and **Custom colour** (any colour from the browser's colour picker; the whole family is built from it and its action colour is made readable in light and dark against Toyfair's own surfaces, with a note "Adjusted for readability" when it had to change).
- **Mode:** Light or Dark.

One click changes the whole site at once, with no reload: Toyfair's colour family, the Kalio base, Vuetify's theme and Selldone's own parts (the buy button, prices, the bag drawer, the checkout sheets, dialogs). The choice is kept in the browser (key `toyfair-theme`; dark mode is the class `pr-dark` on `<html>`) and painted before the first paint, so the default never flashes. The arrow keys (and Home / End) move between the swatches.

| Light (the default) | Dark |
| --- | --- |
| ![Toyfair in light mode](https://raw.githubusercontent.com/selldone-custom-layouts/official-toyfair/main/docs/screenshots/desktop-home.jpg) | ![Toyfair in dark mode](https://raw.githubusercontent.com/selldone-custom-layouts/official-toyfair/main/docs/screenshots/desktop-dark.jpg) |
| ![Light on a phone](https://raw.githubusercontent.com/selldone-custom-layouts/official-toyfair/main/docs/screenshots/phone-home.jpg) | ![Dark on a phone](https://raw.githubusercontent.com/selldone-custom-layouts/official-toyfair/main/docs/screenshots/phone-dark.jpg) |

## On your own shop

The visitor switcher is a **showcase** feature. With `themeSwitcher: "showcase"` it shows only on the Layout's own showcase shops (listed in `showcaseShops` in `components/ly/ly-theme.ts`; Toyfair's is Toychi, 16144). On any other shop it is not shown, nothing is read from or written to the browser's storage, and Toyfair shows the theme from the settings file:

```ts
export const THEME_SETTINGS: ThemeSettings = {
  palette: "lagoon",            // one of `lagoon`, `coral`, `bluebell`, `amber`
  // brandColor: "#F5C400",  // any colour; replaces palette (the whole page takes its family)
  mode: "light",             // "light" | "dark"
  themeSwitcher: "showcase", // "showcase" | "on" (your visitors get it) | "off"
  textOnBrand: "auto",       // with brandColor: "auto" (a light brand keeps dark words) | "white"
};
```

| Setting | Allowed values |
| --- | --- |
| `palette` | `lagoon`, `coral`, `bluebell`, `amber` (`lagoon` is the brand and the default) |
| `brandColor` | any `"#RRGGBB"`; when set it replaces `palette`, and the whole page (bands, plates, lines, words, the dark bars) takes this colour's family |
| `mode` | `"light"` (white and the soft tint; the default) or `"dark"` (the family's night) |
| `themeSwitcher` | `"showcase"` (the visitor switcher shows only on the Layout's own showcase shops; the default), `"on"` (your visitors get the Theme row in the footer), `"off"` |
| `textOnBrand` | only with `brandColor`: `"auto"` (a light brand such as yellow keeps its colour, with dark words on it) or `"white"` (white words; a light colour is darkened) |

Every colour is made readable automatically: buttons, links, chosen states and dark mode.

## Examples

Change only these lines; leave the rest of the file as it is.

| You want | Set |
| --- | --- |
| "Use the rose theme" | `palette: "rose"` |
| "Use the yellow theme" | No palette is yellow, so use a brand colour: `brandColor: "#F5C400", textOnBrand: "auto"` |
| "My brand colour is #F5C400" | `brandColor: "#F5C400", textOnBrand: "auto"`; use `textOnBrand: "white"` for white words (the colour is then darkened) |
| "Make it dark" | `mode: "dark"` |
| "Let visitors switch themes" | `themeSwitcher: "on"` |
| "Remove the switcher" | `themeSwitcher: "off"` (on your own shop it is already hidden with `"showcase"`) |
| "Go back to the original colours" | remove `brandColor`, set `palette: "lagoon", mode: "light"` |

Then build and upload a new version and put it live:

```bash
LAYOUT_ID=<your Layout id> PW=<path>/node_modules/playwright/index.js SELLDONE_CLI_SRC=<cli clone> \
  bash scripts/release.sh <new version> desk
```

See [Build and Upload](Build-and-Upload) and [Go Live](Go-Live).

## Contrast

| Palette | Seed of the family | Light: action colour, white words on it | Light: link colour on the tint band / the plate | Dark: action colour, white words on it | Dark: link colour on the card |
| --- | --- | --- | --- | --- | --- |
| Lagoon | `#087865` | `#087865` 5.41:1 | 5.20:1 / 4.93:1 | `#087865` 5.41:1 | `#66c1ac` on `#131f1b` 7.90:1 |
| Coral | `#a4404a` | `#a4404a` 6.16:1 | 5.87:1 / 5.56:1 | `#b04b54` 5.28:1 | `#fd9096` on `#241819` 7.88:1 |
| Bluebell | `#3a59a7` | `#3a59a7` 6.63:1 | 6.35:1 / 6.02:1 | `#496ab9` 5.19:1 | `#8cafff` on `#181c24` 7.88:1 |
| Amber | `#855614` | `#855614` 6.29:1 | 6.02:1 / 5.69:1 | `#926224` 5.26:1 | `#d9a669` on `#211a13` 7.86:1 |

Each figure is worked out from the colours `scripts/skin-apply.mjs` gives each palette (the same maths as `ly-family-core.ts`). A custom or brand colour goes through `paletteFromColor()`, which moves only its lightness until each role reads against the Layout's surfaces; its family is built from the same colour. The contrast audit must pass with `TOTAL 0` for every palette and for the custom colours `#ffff00`, `#00ffff` and `#111111`, in light and dark.

## Checks

Run these from the repository root after a theme change. They need Playwright; set `PW` to your install (`PW=<path>/node_modules/playwright`), because the default path in the scripts is not yours. `".pr .ftr"` is Toyfair's footer, which every page shows once it is ready. Run one at a time: Selldone limits how many requests one address may send in a minute.

1. **Contrast** on the live shop, at desktop and phone width. It must print `TOTAL 0`:
   ```sh
   PAGES="home=/,category=/<a category>,product=/product/<id>" \
     node components/theme-switcher/tools/contrast-audit.cjs https://<your shop> ".pr .ftr"
   ```
   To test one palette and mode, add `STORAGE='{"toyfair-theme":"{\"palette\":\"lagoon\",\"mode\":\"dark\"}"}'` (this works where the switcher is shown).
2. **Bag drawer, bag page and address sheet.** It must print `TOTAL 0`. It fills a bag in the browser only and blocks every order request. The palette argument is a palette id, or `custom:#rrggbb` for a custom colour:
   ```sh
   SHOP=<your shop's xapi name> STORAGE_KEY=toyfair-theme WAIT=".pr .ftr" CART=".bag-btn" \
     node components/theme-switcher/tools/cart-audit.cjs https://<your shop> lagoon light
   ```
3. **Underlines, boxes and shapes.** No line under any word or icon (a post's own links aside), at rest or on hover; photos never on words, icon rows aligned; every edge a circle, 8 px or 4 px, focus keeping its shape, nothing past the window. Each must print `TOTAL 0`:
   ```sh
   PAGES="home=/,category=/<a category>,product=/product/<id>" node scripts/underline-check.cjs https://<your shop> ".pr .ftr"
   SHOP=<your shop's xapi name> PAGES="home=/,category=/<a category>,product=/product/<id>" \
     node scripts/box-check.cjs https://<your shop> ".pr .ftr"
   PAGES="home=/,category=/<a category>,product=/product/<id>" node scripts/shape-check.cjs https://<your shop> ".pr .ftr"
   ```
   All three default to the showcase shop's pages, so always pass `PAGES` (and `SHOP` for the box check, which also opens the menus, a quick view and the bag).
4. **Colour maths:** `node components/theme-switcher/theme-color.test.mjs` (Node 22.6 or newer).

On Toyfair's showcase shop the same checks run with `https://toyfair.selldone.shop` (or the dev server, `http://localhost:9178`), `SHOP=toychi-KX4iQgu0`, `PAGES="home=/,category=/croissants-category,product=/product/720375"`, for each palette in light and dark. `scripts/run-checks.sh <base> <log folder>` is the full set that produced 1.0.0's test table, one browser at a time; a few of its checks (the ring, corner and circle checks and one card-edge check) come from a shared check kit that is not part of this repository, so on your own copy run the checks above.
