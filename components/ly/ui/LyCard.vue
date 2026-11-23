<!--
  Toy Fair: the product card (design toy-fair, shared/toy-fair.js fairCard()): a bordered card; the photo on a white
  plate in a fixed box (the cut-out contained), the save heart in its top corner; "Save n%" only while the product's
  own discount window is open; the name (two lines), the price with its cents raised and the was-price struck; the
  age from the product's own specification; real ratings only (none: no line); then "Add", which turns into
  − n in basket + in place (LyAdd), and the quick view. Nothing names a product, price or age: all live.
-->
<template>
  <article :class="['pc', 'tf-card', cls]" :style="delay != null ? { '--d': delay + 'ms' } : null">
    <div class="tf-pic">
      <router-link :to="to" aria-hidden="true" class="tf-ph" tabindex="-1">
        <img
          :loading="eager ? 'eager' : 'lazy'"
          :src="img"
          :srcset="srcset"
          alt=""
          decoding="async"
          draggable="false"
          height="640"
          sizes="(max-width: 600px) 46vw, (max-width: 1100px) 30vw, 300px"
          width="640"
          @error="dropSrcset"
        />
      </router-link>
      <button
        :aria-label="isSaved ? t('tf.card.unsave', 'Remove {name} from saved toys', { name: product.title }) : t('tf.card.save', 'Save {name}', { name: product.title })"
        :aria-pressed="isSaved ? 'true' : 'false'"
        :title="isSaved ? t('tf.card.saved', 'Saved') : t('tf.card.saveShort', 'Save')"
        class="tf-heart"
        type="button"
        @click.prevent.stop="save"
      >
        <ly-icon name="heart" />
      </button>
    </div>
    <div class="tf-info">
      <span v-if="pv.off > 0" class="tf-deal">{{ t("tf.card.saveOff", "Save {off}%", { off: pv.off }) }}</span>
      <h3 class="pc-t">
        <router-link :to="to">{{ product.title }}</router-link>
      </h3>
      <p class="tf-price">
        <tf-money :amount="pv.now" class="now" /><template v-if="pv.was">{{ " " }}<s class="was money">{{ money(pv.was) }}</s></template>
      </p>
      <p v-if="rated" class="tf-rate">
        <ly-icon name="star" /><b>{{ rate }}</b><span>({{ product.rate_count }})</span>
      </p>
      <p v-if="age" class="tf-age">{{ age }}</p>
      <p v-else-if="!noCat && catName" class="tf-age"><bdi>{{ catName }}</bdi></p>
    </div>
    <div class="tf-buy pc-add">
      <ly-add :label="t('tf.card.add', 'Add')" :product="product" icon="cart" say />
      <button :aria-label="t('ly.card.quick', 'Quick view: {name}', { name: product.title })" aria-controls="qv" class="tf-qv" type="button" @click="quick($event)">
        <ly-icon name="search" />
      </button>
    </div>
  </article>
</template>

<script>
import LyIcon from "../LyIcon.vue";
import LyAdd from "../LyAdd.vue";
import TfMoney from "../toyfair/TfMoney.vue";
import { catOf, catTitle, money, openQuick, priceView, productImage, productTo } from "../ly";
import { dropSrcset, productSrcset } from "../../kalio/kalio-catalog";
import { currentCurrency } from "../../region-switcher/region";
import { saved, toggleSaved } from "../../bakini/bakini";
import { ageOf } from "../toyfair/tf";
import { t } from "../../kalio/i18n/kalio-i18n";

export default {
  name: "LyCard",
  components: { LyIcon, LyAdd, TfMoney },
  props: {
    product: { type: Object, required: true },
    noCat: Boolean,
    eager: Boolean,
    cls: { type: [String, Array, Object], default: "" },
    delay: { type: Number, default: null },
  },
  data: () => ({ saved }),
  computed: {
    shop() {
      return this.$store.getters.getShop;
    },
    pv() {
      void currentCurrency();
      return priceView(this.shop, this.product);
    },
    to() {
      return productTo(this.product);
    },
    img() {
      return productImage(this.product);
    },
    srcset() {
      return productSrcset(this.product);
    },
    age() {
      return ageOf(this.product);
    },
    catName() {
      return catTitle(catOf(this.product.category_id));
    },
    rated() {
      return Number(this.product.rate_count) > 0 && Number(this.product.rate) > 0;
    },
    rate() {
      return (Math.round(Number(this.product.rate) * 10) / 10).toFixed(1);
    },
    isSaved() {
      return this.saved[this.product.id] ?? !!this.product.wishlist;
    },
  },
  methods: {
    t,
    money,
    dropSrcset,
    quick(e) {
      openQuick(this.product, e.currentTarget);
    },
    save() {
      toggleSaved(this, this.product);
    },
  },
};
</script>
