<!--
  Toy Fair: the superstore header (design toy-fair, shared/toy-fair.js fairHeader()):

  - the top strip on the family-dark band: "Playtime offers" when the shop has live offers (else "Explore the toy
    shop") and "Find a gift by age or budget";
  - the header body in the brand colour: Account and Track an order on the left, the pickup finder and the
    language & currency pill on the right; the mast: the glyph and the shop's own wordmark, the wide search bar
    (suggestions from the live catalogue while typing, Enter opens every result), saved toys and the basket with its
    word and count; the department row: "Departments" (a panel with every department, its own image and line), the
    departments that fit on one row (the rest stay in the panel), and the gift finder;
  - the service strip: delivery options, pickup (only when the shop has a pickup point) or order tracking, and help.
  - phone (≤800px): the menu button, the wordmark, saved toys and the basket; the search bar under them; the menu is
    a panel from the start side ("Explore <shop>": all toys, deals, the first 6 departments then "Show N more",
    the guides, saved toys, compare, track an order, help, sign in, language & currency). No bottom tab bar.

  Every layer opens on a click and closes on a second click, Esc, a click outside or a page change (ly.ts layers).
  A shop with custom header code keeps Selldone's header (StorefrontLayout).
-->
<template>
  <div v-if="!$store.getters.getIsNative" class="ly ly-hdrwrap tf-hdrwrap">
    <a class="skip" href="#main" @click.prevent="skip">{{ t("ly.hdr.skip", "Skip to content") }}</a>

    <div class="tf-strip">
      <div class="wrap tf-strip-in">
        <router-link v-if="hasOffers" :to="dealsTo">{{ t("tf.hdr.offers", "Playtime offers") }}</router-link>
        <router-link v-else :to="shopTo">{{ t("tf.hdr.explore", "Explore the toy shop") }}</router-link>
        <router-link :to="tfTo(TF.GIFT)">{{ t("tf.hdr.giftLine", "Find a gift by age or budget") }}</router-link>
      </div>
    </div>

    <header id="hdr" class="hdr tf-hdr">
      <div class="wrap tf-util">
        <nav :aria-label="t('tf.hdr.accountNav', 'Account')">
          <router-link :to="accountTo">{{ t("ly.hdr.account", "Account") }}</router-link>
          <router-link :to="tfTo(TF.TRACK)">{{ t("tf.hdr.track", "Track an order") }}</router-link>
        </nav>
        <nav :aria-label="t('tf.hdr.servicesNav', 'Shop services')">
          <router-link v-if="collect" :to="tfTo(TF.PICKUPS)">{{ t("tf.hdr.pickupFinder", "Pickup finder") }}</router-link>
          <button
            v-if="regionOn"
            :key="regionKey"
            :aria-expanded="is('rgp') ? 'true' : 'false'"
            :aria-label="t('ly.hdr.regionAria', 'Language and currency: {value}', { value: regionShort })"
            aria-controls="rgp"
            class="tf-region rs-pick__btn"
            type="button"
            @click="toggle('rgp', $event)"
          >
            <ly-icon name="globe" /><span dir="ltr">{{ regionShort }}</span>
          </button>
        </nav>
      </div>

      <div class="wrap tf-mast">
        <div class="tf-mark">
          <button
            :aria-expanded="is('menu') ? 'true' : 'false'"
            :aria-label="t('ly.hdr.menu', 'Menu')"
            aria-controls="menu"
            class="tf-ib menu-btn"
            type="button"
            @click="toggle('menu', $event)"
          >
            <ly-icon name="menu" />
          </button>
          <router-link :aria-label="t('ly.logo.homeOf', '{name}, home', { name: shopName })" :to="{ path: '/' }" class="tf-brand">
            <span aria-hidden="true" class="tf-glyph"><ly-icon name="sparkle" /></span>
            <ly-logo :to="null" />
          </router-link>
        </div>

        <!-- Search: suggestions while typing (the live catalogue); Enter opens every result. -->
        <div id="srch" :class="['tf-search', { open: is('srch') && !!query }]" role="search">
          <form class="tf-sf" @submit.prevent="submit()">
            <label class="sr" for="tf-q">{{ t("ly.hdr.searchLabel", "Search the toys") }}</label>
            <input
              id="tf-q"
              ref="q"
              :placeholder="searchPlaceholder"
              :value="q"
              autocomplete="off"
              enterkeyhint="search"
              type="search"
              @focus="onFocus"
              @input="onInput($event.target.value)"
              @keydown.down.prevent="move(1)"
              @keydown.up.prevent="move(-1)"
            />
            <button :aria-label="t('ly.hdr.search', 'Search')" class="tf-sgo" type="submit"><ly-icon name="search" /></button>
          </form>
          <div v-if="is('srch') && query" class="tf-sout">
            <ul v-if="hits.length" class="srch-list" role="listbox">
              <li v-for="(p, i) in hits" :key="p.id">
                <router-link :class="{ hl: i === cursor }" :to="productTo(p)" role="option">
                  <span class="th"><img :src="thumb(p)" alt="" /></span>
                  <span class="tx"
                    ><b>{{ p.title }}</b><small><bdi>{{ catTitle(catOf(p.category_id)) }}</bdi></small></span
                  >
                  <span class="ly money">{{ money(priceView(shop, p).now) }}</span>
                </router-link>
              </li>
            </ul>
            <p v-if="!hits.length" class="srch-hint">{{ t("ly.hdr.noMatch", "Nothing matches “{q}”. Try another word.", { q: query }) }}</p>
            <router-link v-else :to="searchTo(query)" class="srch-all">{{ t("ly.hdr.allFor", "See every result for “{q}”", { q: query }) }}<ly-icon name="arrow" /></router-link>
          </div>
        </div>

        <div class="tf-acts">
          <router-link :aria-label="t('tf.hdr.saved', 'Saved toys')" :title="t('tf.hdr.saved', 'Saved toys')" :to="savedTo" class="tf-ib tf-save"><ly-icon name="heart" /></router-link>
          <button
            :aria-expanded="is('drawer') ? 'true' : 'false'"
            :aria-label="t('ly.hdr.bagAria', { one: 'Bag, {n} piece', other: 'Bag, {n} pieces' }, { n: units })"
            aria-controls="drawer"
            class="tf-bag bag-btn"
            type="button"
            @click="toggle('drawer', $event)"
          >
            <ly-icon name="cart" /><span class="tf-bag-w">{{ basketWord }}</span><span v-if="units" class="count">{{ units > 99 ? "99+" : units }}</span>
          </button>
        </div>
      </div>

      <nav :aria-label="t('tf.hdr.depts', 'Shop departments')" class="tf-nav">
        <div class="wrap tf-nav-in">
          <button :aria-expanded="is('dd-shop') ? 'true' : 'false'" aria-controls="dd-shop" class="tf-dept-btn" type="button" @click="toggle('dd-shop', $event)">
            <ly-icon name="grid" />{{ t("tf.hdr.departments", "Departments") }}
          </button>
          <div ref="row" class="tf-row">
            <router-link v-for="c in cats" :key="c.id" :aria-current="onCat(c) ? 'page' : undefined" :to="catTo(c)"><bdi>{{ catTitle(c) }}</bdi></router-link>
          </div>
          <router-link :to="tfTo(TF.GIFT)" class="tf-gift">{{ t("tf.hdr.gift", "Gift finder") }}</router-link>
        </div>
        <!-- Departments: every department with its own image (the category's icon) and its line. -->
        <div id="dd-shop" :class="['dd', 'tf-dd', { open: is('dd-shop') }]">
          <div class="wrap tf-dd-in">
            <div class="tf-dd-h">
              <p class="dd-h">{{ t("tf.hdr.allDepts", "All departments") }}</p>
              <router-link :to="shopTo" class="tf-more">{{ t("tf.hdr.allToys", "Shop all toys") }}<ly-icon name="arrow" /></router-link>
            </div>
            <ul class="tf-dd-list">
              <li v-for="c in cats" :key="c.id">
                <router-link :to="catTo(c)">
                  <span class="dd-th"><img v-if="catImg(c)" :src="catImg(c)" alt="" loading="lazy" /></span>
                  <span class="dd-tx"
                    ><b><bdi>{{ catTitle(c) }}</bdi></b><small v-if="fromPrice(c)">{{ t("ly.hdr.from", "From {price}", { price: fromPrice(c) }) }}</small></span
                  >
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <nav :aria-label="t('tf.hdr.svcNav', 'Delivery and customer help')" class="tf-svc">
        <div class="wrap tf-svc-in">
          <router-link :to="tfTo(TF.DELIVERY)"><ly-icon name="truck" />{{ t("tf.hdr.delivery", "Delivery options") }}</router-link>
          <router-link v-if="collect" :to="tfTo(TF.COLLECT)"><ly-icon name="pin" />{{ t("tf.hdr.collect", "Order online and collect") }}</router-link>
          <router-link v-else :to="tfTo(TF.TRACK)"><ly-icon name="box" />{{ t("tf.hdr.trackLine", "Track your order") }}</router-link>
          <router-link :to="tfTo(TF.HELP)"><ly-icon name="message" />{{ t("tf.hdr.help", "How can we help?") }}</router-link>
        </div>
      </nav>
    </header>

    <teleport to="body">
      <div :dir="rtl ? 'rtl' : 'ltr'" class="ly ly-layers">
        <!-- Language and currency (the region-switcher kit's chips; its class
             names stay on the pill, panel and sheet so its checks find them). -->
        <div v-if="regionOn" id="rgp" ref="rgp" :aria-label="t('region.title', 'Language & currency')" :class="['rgp', 'rs-pop', { open: is('rgp') }]" :style="rgpPos" role="dialog">
          <p class="dd-h">{{ regionTitle }}</p>
          <region-chips :key="regionKey" @picked="closeLayer()" />
          <p v-if="regionNote" class="rgp-note">{{ regionNote }}</p>
        </div>

        <!-- The phone menu: a panel from the start side. -->
        <nav id="menu" :aria-label="t('ly.hdr.menu', 'Menu')" :class="['panel', 'menu', 'tf-menu', { open: is('menu') }]">
          <div class="pn-hd">
            <span class="pn-t">{{ t("tf.hdr.explore2", "Explore {shop}", { shop: shopName }) }}</span>
            <button :aria-label="t('ly.hdr.closeMenu', 'Close menu')" class="ibtn x" type="button" @click="closeLayer()"><ly-icon name="close" /></button>
          </div>
          <div class="tf-menu-top">
            <router-link :to="shopTo" class="btn sm">{{ t("tf.hdr.allToys", "Shop all toys") }}</router-link>
            <router-link :to="dealsTo" class="btn sm quiet">{{ t("ly.hdr.deals", "Deals") }}</router-link>
          </div>
          <ul class="pn-list tf-menu-cats">
            <li v-for="c in menuCats" :key="c.id">
              <router-link :to="catTo(c)">
                <span class="th"><img v-if="catImg(c)" :src="catImg(c)" alt="" loading="lazy" /></span><span><bdi>{{ catTitle(c) }}</bdi></span><ly-icon cls="chev" name="right" />
              </router-link>
            </li>
            <li v-if="menuRest.length">
              <button :aria-expanded="moreOpen ? 'true' : 'false'" class="pn-more" type="button" @click="moreOpen = !moreOpen">
                <span class="th"><ly-icon :name="moreOpen ? 'up' : 'down'" /></span
                ><span>{{ moreOpen ? t("ly.hdr.fewer", "Show fewer") : t("ly.hdr.more", "Show {n} more", { n: menuRest.length }) }}</span>
              </button>
            </li>
          </ul>
          <ul class="tf-menu-links">
            <li><router-link :to="blogTo">{{ t("tf.hdr.guides", "Play guides") }}</router-link></li>
            <li><router-link :to="savedTo">{{ t("tf.hdr.saved", "Saved toys") }}</router-link></li>
            <li><router-link :to="compareTo">{{ t("tf.hdr.compare", "Compare toys") }}</router-link></li>
            <li><router-link :to="tfTo(TF.TRACK)">{{ t("tf.hdr.track", "Track an order") }}</router-link></li>
            <li><router-link :to="tfTo(TF.HELP)">{{ t("tf.hdr.helpCentre", "Help centre") }}</router-link></li>
            <li><router-link :to="tfTo(TF.GIFT)">{{ t("tf.hdr.gift", "Gift finder") }}</router-link></li>
            <li><router-link :to="accountTo">{{ signedIn ? t("ly.hdr.account", "Account") : t("tf.hdr.signIn", "Sign in") }}</router-link></li>
          </ul>
          <button v-if="regionOn" :key="regionKey" aria-controls="langsheet" class="pn-rg rs-row tf-menu-rg" type="button" @click="openLayer('langsheet', $event.currentTarget)">
            <ly-icon name="globe" /><span>{{ t("region.title", "Language & currency") }}</span><span class="pn-rg-v" dir="ltr">{{ regionShort }}</span><ly-icon cls="chev" name="right" />
          </button>
        </nav>

        <!-- The language & currency sheet (phone). -->
        <div v-if="regionOn" id="langsheet" :aria-label="t('region.title', 'Language & currency')" :class="['ly-sheet', 'rs-sheet', { open: is('langsheet') }]" aria-modal="true" role="dialog">
          <div class="pn-hd">
            <h2 class="pn-t">{{ t("region.title", "Language & currency") }}</h2>
            <button :aria-label="t('ly.hdr.close', 'Close')" class="ibtn x" type="button" @click="closeLayer()"><ly-icon name="close" /></button>
          </div>
          <div class="sh-body">
            <region-chips :key="regionKey" />
            <p v-if="regionNote" class="rgp-note">{{ regionNote }}</p>
            <button class="btn block" type="button" @click="closeLayer()">{{ t("region.done", "Done") }}</button>
          </div>
        </div>

        <div :class="['scrim', { open: scrim }]" @click="closeLayer()"></div>
        <ly-bag-drawer />
      </div>
      <ly-quick-view />
    </teleport>
  </div>
</template>

<script>
import LyLogo from "../LyLogo.vue";
import LyIcon from "../LyIcon.vue";
import LyBagDrawer from "./LyBagDrawer.vue";
import LyQuickView from "../ui/LyQuickView.vue";
import RegionChips from "../../region-switcher/RegionChips.vue";
import { EventBus } from "@selldone/components-vue/utils/events/EventBus.ts";
import { catalogueRoute, dealsRoute, percentOff } from "../../kalio/kalio-catalog";
import { journalRoute } from "../../kalio/pages/kalio-journal";
import { currencies, currentCurrency, currentLanguage, hasChoice, isRtl, regionState, showLanguages } from "../../region-switcher/region";
import {
  catImage,
  catOf,
  catTitle,
  catTo,
  closeLayer,
  closeOnRoute,
  ly,
  inCat,
  isModal,
  layer,
  loadDm,
  money,
  openLayer,
  priceView,
  productImage,
  productTo,
  toggleLayer,
  wireLayers,
} from "../ly";
import { t } from "../../kalio/i18n/kalio-i18n";
import { TF, canCollect, tfTo } from "../toyfair/tf";

export default {
  name: "LyHeader",
  components: { LyLogo, LyIcon, LyBagDrawer, LyQuickView, RegionChips },
  props: {
    showSearch: { type: Boolean, default: true },
  },
  emits: ["search", "clear"],

  data: () => ({ q: "", cursor: -1, moreOpen: false, rgpPos: {}, layer, ly, region: regionState, TF }),

  computed: {
    shop() {
      return this.$store.getters.getShop;
    },
    rtl() {
      void this.region.language;
      return isRtl();
    },
    cats() {
      return this.ly.cats;
    },
    collect() {
      return canCollect(this.shop);
    },
    hasOffers() {
      void this.region.currency;
      return this.ly.products.some((p) => percentOff(this.shop, p) > 0);
    },
    signedIn() {
      return !!this.$store.getters.getUser;
    },
    units() {
      return this.getBaskets().reduce((sum, b) => sum + (b?.items || []).reduce((n, it) => n + (it.count || 0), 0), 0);
    },
    basketWord() {
      void this.region.language;
      return t("tf.hdr.basket", "Basket");
    },
    scrim() {
      return !!this.layer.open && isModal(this.layer.open);
    },
    /* The region package reads its words when it draws. */
    regionKey() {
      return t("region.title", "Language & currency") + this.region.words;
    },
    regionOn() {
      void this.shop;
      return hasChoice();
    },
    /* "EN · USD": the language and the currency, also with one of each. */
    regionShort() {
      void this.region.currency;
      void this.region.language;
      void this.shop;
      return `${currentLanguage().toUpperCase()} · ${currentCurrency()}`;
    },
    regionTitle() {
      void this.shop;
      return showLanguages() ? t("region.title", "Language & currency") : t("region.currency", "Currency");
    },
    regionNote() {
      void this.shop;
      if (currencies().length <= 1 && !showLanguages()) return "";
      return t("region.note", "Prices everywhere change at once: cards, filters, bag and checkout.");
    },
    shopName() {
      const n = this.shop?.title || "";
      return n.charAt(0).toUpperCase() + n.slice(1);
    },
    menuCats() {
      return this.cats.length <= 8 || this.moreOpen ? this.cats : this.cats.slice(0, 6);
    },
    menuRest() {
      return this.cats.length <= 8 ? [] : this.cats.slice(6);
    },
    /* "Search 10 departments: toys, games…" from the shop's own departments. */
    searchPlaceholder() {
      const names = this.cats.slice(0, 2).map((c) => catTitle(c).toLowerCase());
      return names.length ? t("tf.hdr.searchPh", "Search toys, games and gifts") : t("ly.hdr.searchPh0", "Search the shop…");
    },
    query() {
      return this.q.trim();
    },
    hits() {
      const q = this.query.toLowerCase();
      if (!q) return [];
      const words = q.split(/\s+/).filter(Boolean);
      const score = (p) => {
        const title = String(p.title || "").toLowerCase();
        const hay = (title + " " + catTitle(catOf(p.category_id)) + " " + Object.values(p.spec || {}).flat().join(" ")).toLowerCase();
        let s = 0;
        for (const w of words) {
          if (title.includes(w)) s += 3;
          else if (hay.includes(w)) s += 1;
          else return 0;
        }
        return s;
      };
      return this.ly.products
        .map((p) => ({ p, s: score(p) }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s || (b.p.sells || 0) - (a.p.sells || 0))
        .slice(0, 6)
        .map((x) => x.p);
    },
    r() {
      return window.$storefront.routes;
    },
    dealsTo() {
      return dealsRoute();
    },
    shopTo() {
      return catalogueRoute({});
    },
    blogTo() {
      return journalRoute();
    },
    savedTo() {
      return { name: this.r.USER_FAVORITES_PAGE };
    },
    compareTo() {
      return { name: this.r.COMPARISON_PAGE };
    },
    accountTo() {
      return { name: "KalioAccountHome" };
    },
  },

  watch: {
    "layer.open"(id) {
      if (id === "rgp") this.$nextTick(() => this.place());
      if (id !== "menu" && id !== "langsheet") this.moreOpen = false;
    },
    query() {
      this.cursor = -1;
    },
    cats() {
      this.$nextTick(() => this.fitRow());
    },
    "$route.query.search": {
      handler(v) {
        this.q = v ? String(v) : "";
      },
      immediate: true,
    },
  },

  created() {
    loadDm();
    wireLayers();
    closeOnRoute(this.$router);
  },

  mounted() {
    this.onResize = () => {
      if (this.layer.open === "rgp") this.place();
      this.fitRow();
    };
    window.addEventListener("resize", this.onResize, { passive: true });
    document.fonts?.ready?.then(() => this.fitRow());
    this.$nextTick(() => this.fitRow());
    /* Any part of the page can open the basket. */
    this.openBag = () => openLayer("drawer");
    EventBus.$on("bakini:open-cart", this.openBag);
    EventBus.$on("ly:open-bag", this.openBag);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
    EventBus.$off("bakini:open-cart", this.openBag);
    EventBus.$off("ly:open-bag", this.openBag);
  },

  methods: {
    t,
    tfTo,
    money,
    priceView,
    catTitle,
    catTo,
    catOf,
    productTo,
    openLayer,
    closeLayer,
    is(id) {
      return this.layer.open === id;
    },
    toggle(id, e) {
      toggleLayer(id, e?.currentTarget || null);
    },
    onCat(c) {
      return this.$route?.params?.category_name === c.name;
    },
    /* The department's own image (its category icon), else its best seller's thumbnail. */
    catImg(c) {
      const own = catImage(c, 128);
      if (own) return own;
      const top = inCat(c.id).sort((a, b) => (b.sells || 0) - (a.sells || 0))[0];
      return top ? productImage(top, 128) : null;
    },
    /* The department's lowest price now, in the visitor's currency. */
    fromPrice(c) {
      void this.region.currency;
      const list = inCat(c.id);
      if (!list.length) return "";
      return money(Math.min(...list.map((p) => priceView(this.shop, p).now)));
    },
    thumb(p) {
      return productImage(p, 128);
    },
    /* Links past the first row of the department row are hidden by CSS: also out of the tab order. */
    fitRow() {
      const row = this.$refs.row;
      if (!row) return;
      const links = [...row.children];
      for (const a of links) {
        a.style.visibility = "";
        a.removeAttribute("tabindex");
        a.removeAttribute("aria-hidden");
      }
      const top = links[0]?.offsetTop ?? 0;
      for (const a of links)
        if (a.offsetTop > top) {
          a.style.visibility = "hidden";
          a.setAttribute("tabindex", "-1");
          a.setAttribute("aria-hidden", "true");
        }
    },
    onFocus() {
      if (this.query && this.layer.open !== "srch") openLayer("srch", this.$refs.q);
    },
    onInput(v) {
      this.q = v;
      if (this.query && this.layer.open !== "srch") openLayer("srch", this.$refs.q);
    },
    /* Under the pill, its end edge on the pill's, never within 12px of an edge. */
    place() {
      const btn = document.querySelector('[aria-controls="rgp"]');
      const el = this.$refs.rgp;
      if (!btn || !el) return;
      const r = btn.getBoundingClientRect();
      const w = el.offsetWidth || 300;
      const left = Math.max(12, Math.min(window.innerWidth - w - 12, r.right - w));
      this.rgpPos = { top: `${r.bottom + 8}px`, left: `${left}px` };
    },
    move(d) {
      const n = this.hits.length;
      if (!n) return;
      if (this.layer.open !== "srch") openLayer("srch", this.$refs.q);
      this.cursor = (this.cursor + d + n) % n;
    },
    searchTo(q) {
      return { name: this.r.SHOP_PAGE, query: { search: q } };
    },
    submit() {
      if (this.cursor >= 0 && this.hits[this.cursor]) {
        this.$router.push(productTo(this.hits[this.cursor]));
        return;
      }
      const text = this.query;
      closeLayer(true);
      this.$refs.q?.blur();
      if (!text) return this.$emit("clear");
      this.$emit("search", { search: text, search_type: null });
    },
    skip() {
      const m = document.getElementById("main") || document.querySelector("main");
      if (m) {
        m.setAttribute("tabindex", "-1");
        m.focus();
      }
    },
  },
};
</script>
