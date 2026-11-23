/*
 * Toy Fair: the Layout's own routes (the retail service pages) and the few facts its pages share, all read live from
 * the shop (its delivery ways, pickup points, payment gateways, catalogue). Nothing here names this shop's products,
 * categories, prices, addresses or hours: a shop without pickup points, discounts or a blog gets an honest empty state.
 */
import { catTitle, deliveryWays, ly, priceView, shopFacts, specValue } from "../ly";
import { catalogueRoute, dealsRoute } from "../../kalio/kalio-catalog";

/** The retail service pages (router/StorefrontRouter.ts registers them under these names). */
export const TF = {
  GIFT: "TfGiftFinder",
  PICKUPS: "TfPickupFinder",
  PICKUP: "TfPickupPoint",
  TRACK: "TfTrackOrder",
  REGISTER: "TfRegister",
  HELP: "TfHelp",
  DELIVERY: "TfDelivery",
  COLLECT: "TfCollect",
  RETURNS: "TfReturns",
  STOCK: "TfStock",
  PREORDER: "TfPreorders",
  GIFTCARDS: "TfGiftCards",
  PAYMENT: "TfPayment",
  NOTICES: "TfNotices",
} as const;

export function tfTo(name: string, query?: Record<string, any>, params?: Record<string, any>) {
  return { name, ...(query ? { query } : {}), ...(params ? { params } : {}) };
}

export { catalogueRoute, dealsRoute };

/** Every product the shop shows (live catalogue). */
export function products(): any[] {
  return ly.products || [];
}

/** The shop's pickup points, from every enabled Pickup way (none when the shop has none). */
export function pickupPoints(shop: any): any[] {
  const out: any[] = [];
  for (const w of deliveryWays(shop)) {
    if (!w.pickup) continue;
    for (const p of w.pickups || []) if (p && !out.some((x) => x.id === p.id)) out.push({ ...p, _way: w });
  }
  return out;
}

/** Delivery ways that can be chosen at checkout: couriers and post; pickup only with a pickup point. */
export function homeWays(shop: any) {
  return deliveryWays(shop).filter((w) => !w.pickup);
}
export function canCollect(shop: any): boolean {
  return pickupPoints(shop).length > 0;
}

/** The shop's enabled payment gateways. */
export function gateways(shop: any): any[] {
  return shopFacts(shop).gateways || [];
}

/* ━━━━━━━━━━━━ Ages, from the products' own specification ━━━━━━━━━━━━ */

const AGE_KEYS = ["Suggested Age", "Age", "Age range", "Ages", "Recommended Age", "Age Range"];

/** The product's age line ("5–7 years"), from its spec; "" when it has none. */
export function ageOf(p: any): string {
  for (const k of AGE_KEYS) {
    const v = specValue(p, k);
    if (v) return v;
  }
  return "";
}

/** A sortable number for an age value ("6–12 months" → 0.5, "3–4 years" → 3, "13+ years" → 13). */
export function ageRank(v: string): number {
  const m = String(v).match(/(\d+(?:\.\d+)?)/);
  const n = m ? parseFloat(m[1]) : 99;
  return /month/i.test(v) ? n / 12 : n;
}

/** Every age value the catalogue uses, youngest first (the "Shop by age" chips and the gift finder). */
export function ages(): string[] {
  const set = new Set<string>();
  for (const p of products()) {
    const a = ageOf(p);
    if (a) set.add(a);
  }
  return [...set].sort((a, b) => ageRank(a) - ageRank(b) || a.localeCompare(b));
}

/* ━━━━━━━━━━━━ Budgets, from the live prices ━━━━━━━━━━━━ */

const STEPS = [5, 10, 15, 20, 25, 30, 40, 50, 75, 100, 125, 150, 200, 250, 300, 400, 500, 750, 1000, 1500, 2000, 2500, 5000];

/** Up to four round "Under X" amounts that split the catalogue's live prices (in the base currency). */
export function budgets(shop: any): number[] {
  const prices = products()
    .map((p) => priceView(shop, p).now)
    .filter((n) => n > 0)
    .sort((a, b) => a - b);
  if (prices.length < 4) return [];
  const out: number[] = [];
  for (const q of [0.25, 0.5, 0.75, 0.95]) {
    const v = prices[Math.min(prices.length - 1, Math.floor(prices.length * q))];
    const step = STEPS.find((s) => s >= v) || Math.ceil(v / 1000) * 1000;
    if (!out.includes(step)) out.push(step);
  }
  return out;
}

/** The catalogue route for "under X" (the listing reads ?price=). */
export function underTo(max: number) {
  return catalogueRoute({ price: `0-${max}` });
}

/* ━━━━━━━━━━━━ Short names ━━━━━━━━━━━━ */

/** A department's name as the shop wrote it. */
export function deptName(c: any): string {
  return catTitle(c);
}
