<!--
  Toy Fair: the product's details as the design's accordions (shared/toy-fair.js fairProduct() details): Key features
  (the first rows of the product's own specification), Product details (the product's own article, its pros and the
  specification in the shop's own groups), Age suitability (from the spec), Reviews (real reviews only; none: an honest
  "No reviews yet" with the rating criteria the shop set, each "No score yet"; writing one needs a signed-in buyer).
-->
<template>
  <section :aria-label="t('tf.pd.about', 'About this toy')" class="tf-details">
    <details v-if="keys.length" class="tf-acc" open>
      <summary>{{ t("tf.pd.keyFeatures", "Key features") }}<ly-icon cls="chev" name="down" /></summary>
      <ul class="tf-keys">
        <li v-for="r in keys" :key="r[0]"><b>{{ r[0] }}</b> · {{ r[1] }}</li>
      </ul>
    </details>
    <details class="tf-acc" open>
      <summary>{{ t("tf.pd.details", "Product details") }}<ly-icon cls="chev" name="down" /></summary>
      <div v-if="articleBody" class="ly-pd-article tf-article" v-html="articleBody"></div>
      <template v-if="pros.length">
        <h3 class="pd-sub">{{ t("tf.pd.love", "Why they’ll love it") }}</h3>
        <ul class="pros">
          <li v-for="(x, i) in pros" :key="i">
            <span class="ck"><ly-icon name="check" /></span>
            <div>
              <b>{{ x[0] }}</b>
              <p v-if="x[1]">{{ x[1] }}</p>
            </div>
          </li>
        </ul>
      </template>
      <div v-if="groups.length || product.sku" class="tf-spec">
        <div v-for="g in groups" :key="g.group" class="tf-spec-g">
          <h3 v-if="g.group">{{ g.group }}</h3>
          <dl>
            <div v-for="r in g.rows" :key="r[0]">
              <dt>{{ r[0] }}</dt>
              <dd>{{ r[1] }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </details>
    <details v-if="ageText" class="tf-acc">
      <summary>{{ t("tf.pd.ageH", "Age suitability") }}<ly-icon cls="chev" name="down" /></summary>
      <p class="tf-acc-p">{{ t("tf.pd.ageP", "Suggested for {age}. Check the packaging for safety notes.", { age: ageText }) }}</p>
    </details>
    <section id="tf-reviews" class="tf-acc tf-rev">
      <button id="tb-rev" :aria-expanded="revOpen ? 'true' : 'false'" aria-controls="tf-rev-panel" class="tf-acc-btn" type="button" @click="revOpen = !revOpen">
        {{ rated ? t("ly.pd.tabRev", "Reviews ({n})", { n: Number(product.rate_count) || 0 }) : t("tf.pd.reviews", "Reviews") }}<ly-icon cls="chev" name="down" />
      </button>
      <div v-show="revOpen" id="tf-rev-panel" class="tf-rev-in">
        <div v-if="!rated" :class="['revs', { 'ly-solo': !criteria.length }]">
          <ly-empty :text="noReviewsText" :title="t('ly.pd.noReviewsT', 'No reviews yet')" icon="star">
            <template v-if="!writing" #acts>
              <button class="btn sm" type="button" @click="write">{{ user ? t("ly.pd.writeFirst", "Write the first review") : t("ly.pd.signInReview", "Sign in to write a review") }}</button>
            </template>
          </ly-empty>
          <div v-if="criteria.length" class="crit">
            <h3 class="pd-sub">{{ t("ly.pd.willScore", "What reviews will score") }}</h3>
            <ul>
              <li v-for="c in criteria" :key="c">
                <span>{{ c }}</span><span aria-hidden="true" class="crit-bar"></span><span class="crit-v">{{ t("ly.pd.noScore", "No score yet") }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div v-if="rated || writing" class="ly-rv-sd"><kalio-reviews /></div>
      </div>
    </section>
  </section>
</template>

<script>
import LyIcon from "../LyIcon.vue";
import LyEmpty from "../ui/LyEmpty.vue";
import KalioReviews from "../../kalio/product/KalioReviews.vue";
import { percentOff } from "../../kalio/kalio-catalog";
import { prosOf, ratingNames, specGroups, specValue, unitOf } from "../ly";
import { numberWord } from "./pd";
import { ageOf } from "../toyfair/tf";
import { EventBus } from "@selldone/components-vue/utils/events/EventBus.ts";
import { t } from "../../kalio/i18n/kalio-i18n";

export default {
  name: "LyProductTabs",
  components: { LyIcon, LyEmpty, KalioReviews },
  props: { product: { type: Object, required: true } },
  data: () => ({ cur: "desc", writing: false, revOpen: false }),
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    rated() {
      return Number(this.product.rate_count) > 0;
    },
    criteria() {
      return ratingNames(this.product);
    },
    pros() {
      return prosOf(this.product).filter((x) => x[0] || x[1]);
    },
    groups() {
      return specGroups(this.product);
    },
    ageText() {
      return ageOf(this.product);
    },
    /* the first six rows of the spec, the age left for its own section */
    keys() {
      const rows = this.groups.flatMap((g) => g.rows).filter((r) => r[1] && !/(^|\s)age(\s|$)/i.test(r[0]));
      return rows.slice(0, 6);
    },
    tabs() {
      return [
        { k: "desc", label: t("ly.pd.tabDesc", "Description") },
        { k: "info", label: t("ly.pd.tabInfo", "Additional information") },
        { k: "rev", label: t("ly.pd.tabRev", "Reviews ({n})", { n: Number(this.product.rate_count) || 0 }) },
      ];
    },
    /* The lead: the finish, "Sold as one <unit>, and good with <pairing>",
       the saving. Words the product's own spec gives; nothing invented. */
    lead() {
      const p = this.product;
      const out = [];
      const finish = specValue(p, "Visual Finish") || specValue(p, "Surface");
      if (finish) out.push(finish.charAt(0).toUpperCase() + finish.slice(1).replace(/\.?$/, "."));
      const pairing = specValue(p, "Suggested Pairing");
      const unit = unitOf(p).toLowerCase();
      const off = percentOff(this.$store.getters.getShop, p);
      const sold = pairing ? t("ly.pd.soldPair", "Sold as one {unit}, and good with {pairing}.", { unit, pairing: pairing.toLowerCase() }) : t("ly.pd.sold", "Sold as one {unit}.", { unit });
      out.push(off > 0 ? `${sold} ${t("ly.pd.offIn", "{off}% off, already in the price.", { off })}` : sold);
      return out;
    },
    articleBody() {
      const body = this.product?.articles?.[0]?.body || this.product?.article_pack?.article?.body;
      return body && String(body).replace(/<[^>]*>/g, "").trim() ? body : null;
    },
    noReviewsText() {
      const n = this.criteria.length;
      if (!n) return t("ly.pd.noReviewsP0", "Be the first to review the {name}.", { name: this.product.title });
      return t("ly.pd.noReviewsP", "Be the first to review the {name}. Reviews are scored on the {n} points beside this note.", { name: this.product.title, n: numberWord(n).toLowerCase() });
    },
  },
  watch: {
    "product.id"() {
      this.cur = "desc";
      this.writing = false;
      this.revOpen = false;
    },
  },
  methods: {
    t,
    /* "No reviews yet" in the buy column opens the Reviews tab. */
    open(k) {
      this.cur = k;
      if (k === "rev") this.revOpen = true;
      this.$nextTick(() => {
        document.getElementById(k === "rev" ? "tf-reviews" : "tabs")?.scrollIntoView({ behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ? "auto" : "smooth", block: "start" });
        document.getElementById("tb-" + k)?.focus({ preventScroll: true });
      });
    },
    keys(e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const ks = this.tabs.map((x) => x.k);
      const i = ks.indexOf(this.cur);
      const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
      const step = (e.key === "ArrowRight") !== rtl ? 1 : -1;
      this.cur = ks[(i + step + ks.length) % ks.length];
      this.$nextTick(() => document.getElementById("tb-" + this.cur)?.focus());
      e.preventDefault();
    },
    write() {
      if (!this.user) {
        EventBus.$emit("need-login", true);
        return;
      }
      this.writing = true;
      this.revOpen = true;
    },
  },
};
</script>
