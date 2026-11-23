/*
 * Toy Fair: the home's shared reads (every section in this folder mixes it in on top of the base's home-data).
 * All from the live shop: offers only while a product's discount window is open, best sellers by Selldone's
 * `sells`, ages from the products' own specification, budgets from the live prices, posts from the shop's blog.
 */
import HomeData from "../../home/home-data";
import { bySells, catImage, catTitle, catTo, inCat, mixed, productImage, priceView } from "../../ly";
import { catalogueRoute, dealsRoute, percentOff } from "../../../kalio/kalio-catalog";
import { TF, ageOf, ages, budgets, tfTo, underTo } from "../tf";
import { t } from "../../../kalio/i18n/kalio-i18n";

export default {
  mixins: [HomeData],
  data: () => ({ TF }),
  computed: {
    offers() {
      void this.currency;
      return this.products
        .filter((p) => percentOff(this.shop, p) > 0 && p.quantity !== 0)
        .sort((a, b) => percentOff(this.shop, b) - percentOff(this.shop, a) || a.id - b.id);
    },
    /* the best sellers, one department after another (a row never shows one kind only) */
    favourites() {
      return mixed(bySells(this.products.filter((p) => p.quantity !== 0)));
    },
    allTo() {
      return catalogueRoute({});
    },
    dealsTo() {
      return dealsRoute();
    },
    ageList() {
      void this.products.length;
      return ages();
    },
    budgetList() {
      void this.currency;
      void this.products.length;
      return budgets(this.shop);
    },
  },
  methods: {
    t,
    tfTo,
    catTo,
    catTitle,
    underTo,
    ageOf,
    deptImg(c: any) {
      const own = catImage(c, 256);
      if (own) return own;
      const top = bySells(inCat(c.id))[0];
      return top ? productImage(top, null) : null;
    },
    ageTo(a: string) {
      return catalogueRoute({ spec: "age:" + a });
    },
    pvNow(p: any) {
      return priceView(this.shop, p).now;
    },
  },
};
