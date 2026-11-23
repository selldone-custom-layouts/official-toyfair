<!--
  The top of the product page (design/product-b.html,
  src/pages-product.js productRender()): the gallery on the left (the pastry
  on its plate with the −25% roundel, one row of thumbnails: Selldone's own
  photos of the product); the buy column on the right, which stays in view
  while the page scrolls: the collection, the name, "Per <unit> · No
  reviews yet" (the reviews' count once there are some; never stars without
  reviews), the price with the struck was-price and "Save $x · n%", the
  deal's own clock only when the deal has a real end date (Selldone's rule),
  the stock, the options (only when the product has real variants: tiles
  with their own photo, the chosen one ringed inside and tinted, no tick;
  Selldone's own picker in the same dress when the variants differ in more
  than one way), "Add to bag" (then − n + in place) beside Compare, and the
  shop's delivery, pickup and payment lines with their icons on one edge.

  On a phone, once the Add box has scrolled away, a buy bar at the foot.

  Every behaviour is Selldone's SProductOverview (through Kalio's): the
  chosen variant, the store, the basket line. A product that needs more than
  a count (a service, a valuation form, extra pricing, a subscription) keeps
  Selldone's own buy section here.
-->
<!--
  Toy Fair: the product page (design toy-fair, shared/toy-fair.js fairProduct()): the name across the top (real
  reviews only; the item number when the product has one); the gallery with its thumbnails down the side (Selldone's
  own photos of the product, white plate, contained); the sticky buy box: "Save n%" only while the discount runs, the
  price with its cents raised, the stock, the options (only when the product really has variants), delivery and
  Click & Collect cards from the shop's own ways (Click & Collect only with a pickup point), "Add to basket" (then
  − n in basket +) beside the save heart, the recommended age from the product's spec, Delivery & returns and Compare;
  under the gallery, the details (LyProductTabs: key features, product details, age, reviews). On a phone, once the Add
  box has scrolled away, a buy bar at the foot. Every behaviour is Selldone's SProductOverview (through Kalio's).
-->
<template>
  <section :aria-label="$product.title" class="pd tf-pd">
    <div class="wrap">
      <header class="tf-pd-title">
        <div>
          <h1 class="pd-h">{{ $product.title }}</h1>
          <p class="tf-pd-rev">
            <template v-if="rated"><ly-icon name="star" /><b>{{ rate }}</b>{{ " " }}</template><a href="#tf-reviews" @click.prevent="goReviews">{{ reviewsWord }}</a>
          </p>
        </div>
        <span v-if="$product.sku" class="tf-sku">{{ t("tf.pd.item", "Item {sku}", { sku: $product.sku }) }}</span>
      </header>

      <div class="tf-pd-body">
        <div class="tf-gal">
          <ul v-if="photos.length > 1" :aria-label="t('ly.pd.photos', 'Photos')" class="tf-thumbs">
            <li v-for="(ph, i) in photos" :key="ph.src">
              <button :aria-label="t('ly.pd.photoN', 'Photo {n} of {total}', { n: i + 1, total: photos.length })" :aria-pressed="i === at ? 'true' : 'false'" type="button" @click="at = i">
                <img :src="ph.thumb" alt="" loading="eager" />
              </button>
            </li>
          </ul>
          <div class="tf-stage">
            <img v-if="photo" :key="photo.src" :alt="photo.alt" :src="photo.src" decoding="async" height="640" loading="eager" width="640" />
          </div>
        </div>

        <aside :aria-label="t('tf.pd.buy', 'Buy {name}', { name: $product.title })" class="tf-buybox">
          <div v-if="isSubscription" class="opts ly-sd-sub">
            <s-subscription-price-select v-model="selected_subscription_price" :disabled="!$product.quantity" :subscription-prices="subscription_prices" return-object></s-subscription-price-select>
          </div>
          <div v-else class="tf-buy-price">
            <span v-if="pv.off > 0" class="tf-deal">{{ t("tf.card.saveOff", "Save {off}%", { off: pv.off }) }}</span>
            <p class="tf-price"><tf-money :amount="pv.now" class="now" /><s v-if="pv.was" class="was money">{{ money(pv.was) }}</s></p>
            <p v-if="dealEndsAt" class="pd-stock ly-pd-deal"><ly-icon name="clock" />{{ t("ly.pd.dealEnds", "Deal ends in") }}{{ " " }}<bakini-deal-clock :end="dealEndsAt" mode="bare" /></p>
          </div>
          <s-product-section-tax></s-product-section-tax>
          <p v-if="!has_original_warranty" class="pd-u">{{ $t("product_info.fake") }}</p>

          <!-- Options: only for a product that really has them. -->
          <div v-if="tiles.length" class="opts">
            <p class="opts-l">
              {{ dimWord }}<span v-if="currentLabel" class="opts-v">{{ currentLabel }}</span>
            </p>
            <div :aria-label="dimWord" class="opts-g" role="radiogroup">
              <button
                v-for="tl in tiles"
                :key="tl.v.id"
                :aria-checked="current_variant && current_variant.id === tl.v.id ? 'true' : 'false'"
                :class="['opt', { '-out': !(tl.v.quantity > 0) }]"
                role="radio"
                type="button"
                @click="current_variant = tl.v"
              >
                <span class="opt-ph"><img v-if="tl.img" :src="tl.img" alt="" loading="eager" /><i v-else-if="tl.swatch" :style="{ background: tl.swatch }" aria-hidden="true" class="ly-opt-sw"></i></span>
                <span class="opt-n">{{ tl.label }}</span>
                <small v-if="tl.price !== null" class="opt-p money">{{ money(tl.price) }}</small>
              </button>
            </div>
          </div>
          <div v-else-if="product_variants.length" class="opts ly-sd-variants">
            <s-product-section-variants v-model:current-variant="current_variant" v-model:filter="filter" v-model:selection-values="selection_values"></s-product-section-variants>
          </div>

          <!-- How it reaches you: the shop's own ways (Click & Collect only with a pickup point). -->
          <ul class="tf-ful">
            <li v-if="homeWays.length || !collect" class="tf-ful-o">
              <ly-icon name="truck" />
              <span>
                <b>{{ t("tf.pd.delivery", "Delivery") }}</b>
                <small :class="['tf-stock', { out: stock <= 0 }]">{{ stock <= 0 ? t("tf.pd.outOfStock", "Out of stock") : t("tf.pd.inStock", "In stock") }}</small>
                <small v-if="homeWays.length">{{ waysLine }}</small>
              </span>
            </li>
            <li v-if="collect" class="tf-ful-o">
              <ly-icon name="pin" />
              <span>
                <b>{{ t("tf.pd.collect", "Click & Collect") }}</b>
                <small class="tf-stock">{{ pickupFee }}</small>
                <router-link :to="tfTo(TF.PICKUPS)" class="tf-more">{{ t("tf.pd.choosePoint", "See the pickup points") }}</router-link>
              </span>
            </li>
          </ul>

          <div class="ly-sd-more">
            <s-product-section-service v-model:preferences="preferences"></s-product-section-service>
            <s-product-section-valuation v-if="preferences && preferences.valuation" :correspondingBasketItem="corresponding_basket_item" :current-variant="current_variant" :preferences="preferences"></s-product-section-valuation>
            <s-product-section-extra-pricings
              :current-variant="current_variant"
              :preferences="preferences"
              :quantity="corresponding_basket_item?.count"
              :selected-vendor-product="selected_vendor_product"
              @select="(val) => $refs.buy_section?.triggerBuyButton(val.min)"
            ></s-product-section-extra-pricings>
          </div>

          <div id="pd-acts" ref="add" class="pd-acts tf-acts-row">
            <div class="pd-add">
              <ly-pd-add v-if="simple" :needs-choice="needsChoice" :product="$product" :variant="current_variant" />
              <s-product-section-buy-button
                v-else
                ref="buy_section"
                :can-buy="canBuy"
                :current-variant="current_variant"
                :hss-sticky-but-button="hssStickyButButton"
                :preferences="preferences"
                :quick-buy-mode="quickBuyMode"
                :selected-subscription-price="selected_subscription_price"
                :selected-vendor-product="selected_vendor_product"
                class="ly-sd-buy"
              ></s-product-section-buy-button>
            </div>
            <button
              :aria-label="isSaved ? t('tf.card.unsave', 'Remove {name} from saved toys', { name: $product.title }) : t('tf.card.save', 'Save {name}', { name: $product.title })"
              :aria-pressed="isSaved ? 'true' : 'false'"
              class="tf-heart tf-heart-lg"
              type="button"
              @click="save"
            >
              <ly-icon name="heart" />
            </button>
          </div>
          <p v-if="age" class="tf-buy-meta"><ly-icon name="user" />{{ t("tf.pd.age", "Recommended age · {age}", { age }) }}</p>
          <div class="tf-buy-links">
            <router-link :to="tfTo(TF.DELIVERY)" class="tf-more">{{ t("tf.pd.deliveryReturns", "Delivery & returns") }}</router-link>
            <button class="tf-more cmpb" type="button" @click="compareNow">{{ comparing ? t("tf.pd.viewCompare", "View comparison") : t("tf.pd.compare", "Compare toy") }}</button>
          </div>
        </aside>

        <div class="tf-pd-details">
          <ly-product-tabs ref="tabs" :product="$product" />
        </div>
      </div>
    </div>
    <!-- The phone's buy bar, once the Add box has scrolled away. -->
    <teleport to="body">
      <div class="ly ly-layers">
        <div :aria-hidden="barOn ? undefined : 'true'" :class="['buybar', { on: barOn }]">
          <div class="wrap bb-in">
            <span class="bb-pl"><img v-if="photos[0]" :src="photos[0].thumb" alt="" /></span>
            <span class="bb-tx"
              ><b>{{ $product.title }}</b
              ><span
                ><span class="now money">{{ money(pv.now) }}</span><template v-if="pv.was">{{ " " }}<s class="was money">{{ money(pv.was) }}</s></template></span
              ></span
            >
            <div class="bb-a">
              <ly-pd-add v-if="simple" :needs-choice="needsChoice" :product="$product" :variant="current_variant" />
              <button v-else class="btn sm" type="button" @click="toAdd">{{ t("ly.add.add", "Add to bag") }}</button>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </section>
</template>

<script>
import KalioProductOverview from "../../kalio/product/KalioProductOverview.vue";
import BakiniDealClock from "../../bakini/BakiniDealClock.vue";
import LyIcon from "../LyIcon.vue";
import LyIcLine from "../ui/LyIcLine.vue";
import LyPdAdd from "./LyPdAdd.vue";
import LyProductTabs from "./LyProductTabs.vue";
import TfMoney from "../toyfair/TfMoney.vue";
import { TF, ageOf, canCollect, homeWays, pickupPoints, tfTo } from "../toyfair/tf";
import { saved, toggleSaved } from "../../bakini/bakini";
import { catOf, catTitle, catTo, ly, money, priceView, unitOf } from "../ly";
import { deliveryLines, galleryOf, isEnglish, plural } from "./pd";
import { colourName, dealEnd, moneyOf, swatchBg, variantDimension } from "../../bakini/bakini";
import { currentCurrency } from "../../region-switcher/region";
import { fitInCircle } from "../../bakini/fit-in-circle";
import { fitOnResize } from "../ly-fit";
import { t } from "../../kalio/i18n/kalio-i18n";

export default {
  name: "LyProductOverview",
  extends: KalioProductOverview,
  components: { BakiniDealClock, LyIcon, LyIcLine, LyPdAdd, LyProductTabs, TfMoney },
  emits: ["reviews"],

  data() {
    return { at: 0, barOn: false, ly, saved, TF };
  },

  computed: {
    currency() {
      return currentCurrency();
    },
    cat() {
      return this.$product?.category || catOf(this.$product?.category_id);
    },
    catName() {
      return catTitle(this.cat);
    },
    unit() {
      return unitOf(this.$product);
    },
    pv() {
      void this.currency;
      return priceView(this.shop || this.$shop, this.$product, this.current_variant);
    },
    dealEndsAt() {
      return dealEnd(this.$product, this.current_variant);
    },
    photos() {
      return galleryOf(this.$product, this.current_variant);
    },
    photo() {
      return this.photos[Math.min(this.at, this.photos.length - 1)] || null;
    },
    stock() {
      const n = this.current_variant ? this.current_variant.quantity : this.$product.quantity;
      return Number(n) || 0;
    },
    stockLine() {
      const n = this.stock;
      if (isEnglish()) return t("ly.pd.inStockUnits", "In stock · {n} {units} ready", { n, units: plural(this.unit, n) });
      return t("ly.pd.inStockN", "In stock · {n} ready", { n });
    },
    reviewsWord() {
      const n = Number(this.$product.rate_count) || 0;
      return n ? t("ly.pd.reviewsN", { one: "{n} review", other: "{n} reviews" }, { n }) : t("ly.pd.noReviews", "No reviews yet");
    },
    rated() {
      return Number(this.$product.rate_count) > 0 && Number(this.$product.rate) > 0;
    },
    rate() {
      return (Math.round(Number(this.$product.rate) * 10) / 10).toFixed(1);
    },
    age() {
      return ageOf(this.$product);
    },
    isSaved() {
      return this.saved[this.$product.id] ?? !!this.$product.wishlist;
    },
    homeWays() {
      return homeWays(this.shop || this.$shop);
    },
    collect() {
      return canCollect(this.shop || this.$shop);
    },
    /* "Toychi courier or Post, chosen at checkout": the shop's own home ways */
    waysLine() {
      const names = [...new Set(this.homeWays.map((w) => w.title))];
      let list = names.join(", ");
      try {
        list = new Intl.ListFormat(document.documentElement.lang || "en", { style: "long", type: "disjunction" }).format(names);
      } catch {
        /* older browsers */
      }
      return t("tf.pd.waysLine", "{ways}, chosen at checkout", { ways: list });
    },
    pickupFee() {
      const w = pickupPoints(this.shop || this.$shop)[0]?._way;
      if (!w) return "";
      return w.free || !w.fee ? t("tf.pd.freePickup", "Free pickup") : t("tf.pd.pickupFee", "Pickup {fee}", { fee: money(w.fee) });
    },
    lines() {
      return deliveryLines(this.shop || this.$shop);
    },
    enabledVariants() {
      return this.product_variants.filter((v) => v.enable !== false && v.enable !== 0);
    },
    dimension() {
      return variantDimension(this.enabledVariants);
    },
    dimWord() {
      const k = this.dimension?.key;
      if (k === "color") return t("ly.pd.colour", "Colour");
      const w = this.dimension?.word || t("ly.pd.option", "Option");
      return w.charAt(0).toUpperCase() + w.slice(1);
    },
    /* One dimension: a tile per variant with its own photo and price. */
    tiles() {
      const d = this.dimension;
      if (!d || d.key === "mixed") return [];
      return this.enabledVariants.map((v) => {
        const own = v.pricing && v.price != null;
        return {
          v,
          img: v.image ? window.CDN.GET_SHOP_IMAGE_PATH(v.image, 128) : d.key === "color" ? null : window.CDN.GET_SHOP_IMAGE_PATH(this.$product.icon, 128),
          swatch: d.key === "color" ? swatchBg(v.color) : null,
          label: d.key === "color" ? colourName(v.color) || t("ly.pd.colour", "Colour") : v[d.key],
          price: own ? moneyOf(this.shop, this.$product, v, this.currency).now : null,
        };
      });
    },
    currentLabel() {
      const x = this.tiles.find((y) => this.current_variant && y.v.id === this.current_variant.id);
      return x ? x.label : "";
    },
    needsChoice() {
      return this.product_variants.length > 0 && !this.current_variant;
    },
    /* A plain product: the add box; anything Selldone's own button knows
       more about keeps that button. */
    simple() {
      const p = this.$product;
      if (!p || this.isSubscription) return false;
      if ((p.type || "PHYSICAL") !== "PHYSICAL") return false;
      if (this.preferences && (this.preferences.valuation || this.preferences.service)) return false;
      if (p.valuation || (p.extra_pricings && p.extra_pricings.length)) return false;
      return true;
    },
    comparing() {
      return (this.$store.getters.getProductsComparison || []).some((p) => p.id === this.$product.id);
    },
  },

  watch: {
    "$product.id"() {
      this.at = 0;
    },
    "current_variant.id"() {
      this.at = 0;
    },
    "pv.off"() {
      this.$nextTick(() => fitInCircle(this.$refs.off));
    },
  },

  mounted() {
    this.unfit = fitOnResize(() => fitInCircle(this.$refs.off));
    document.documentElement.classList.add("ly-buybar");
    this.$nextTick(() => fitInCircle(this.$refs.off));
    document.fonts?.ready?.then(() => fitInCircle(this.$refs.off));
    if (typeof IntersectionObserver !== "undefined" && this.$refs.add) {
      this.io = new IntersectionObserver(
        (entries) => {
          const e = entries[entries.length - 1];
          this.barOn = !!e && !e.isIntersecting;
        },
        /* the box counts as "in view" while it is anywhere below the top of the window, so the bar
           shows only once it has scrolled away above, and hides again on the way back up */
        { threshold: 0, rootMargin: "0px 0px 100000px 0px" },
      );
      this.io.observe(this.$refs.add);
    }
  },

  beforeUnmount() {
    this.unfit?.();
    document.documentElement.classList.remove("ly-buybar");
    this.io?.disconnect();
  },

  methods: {
    t,
    tfTo,
    money,
    catTo,
    goReviews() {
      this.$refs.tabs?.open("rev");
    },
    save() {
      toggleSaved(this, this.$product);
    },
    /* Add this pastry to Selldone's comparison and open the Layout's compare
       page: what the shopper already compares, else this with two of its own
       collection's best sellers. */
    compareNow() {
      if (!this.comparing) this.addToProductComparison(this.$product, this.current_variant, true);
      const stored = (this.$store.getters.getProductsComparison || []).map((p) => ({ p: p.id, v: p.variant?.id || null }));
      let refs = stored.filter((r) => r.p !== this.$product.id);
      refs.unshift({ p: this.$product.id, v: this.current_variant?.id || null });
      if (refs.length < 2) {
        const mates = this.ly.products
          .filter((p) => p.category_id === this.$product.category_id && p.id !== this.$product.id)
          .sort((a, b) => (b.sells || 0) - (a.sells || 0))
          .slice(0, 2);
        refs = refs.concat(mates.map((p) => ({ p: p.id, v: null })));
      }
      const list = refs
        .slice(0, 4)
        .map((r) => `p${r.p}${r.v ? `v${r.v}` : ""}`)
        .join("_");
      this.$router.push({ name: window.$storefront.routes.COMPARISON_PAGE, query: { list } });
    },
    toAdd() {
      this.$refs.add?.scrollIntoView({ behavior: "smooth", block: "center" });
    },
  },
};
</script>
