<!--
  Toy Fair home: a shelf of four toys (design fairShelf and the featured band). Variants:
  - featured: on the family-dark band; the live offers (biggest saving first) titled "<shop> offers", else the best
    sellers across departments, "Featured toys";
  - favourites: the next best sellers ("Playroom favourites");
  - department: the department with the most toys not already the first one's, titled by its own name.
  The shelf hides itself when the shop has nothing for it.
-->
<template>
  <section v-if="items.length" :id="variant === 'featured' ? 'tf-featured' : null" :aria-labelledby="hid" :class="['tf-sec', 'tf-shelf', { 'tf-dark': variant === 'featured', band }]">
    <div class="wrap">
      <div class="tf-top">
        <h2 :id="hid"><bdi>{{ title }}</bdi></h2>
        <router-link :to="moreTo" class="tf-more">{{ moreLabel }}<ly-icon name="arrow" /></router-link>
      </div>
      <div class="tf-grid">
        <ly-card v-for="p in items" :key="p.id" :product="p" />
      </div>
    </div>
  </section>
</template>

<script>
import LyIcon from "../../LyIcon.vue";
import LyCard from "../../ui/LyCard.vue";
import TfHome from "./tf-home";

export default {
  name: "TfShelf",
  components: { LyIcon, LyCard },
  mixins: [TfHome],
  computed: {
    hid() {
      return "tf-shelf-" + this.variant;
    },
    dept() {
      /* the department with the most toys after the best-selling one */
      const ranked = this.rank.filter((x) => x.ps.some((p) => p.quantity !== 0));
      return (ranked[1] || ranked[0] || null)?.c || null;
    },
    items() {
      if (this.variant === "featured") return (this.offers.length ? this.offers : this.favourites).slice(0, 4);
      if (this.variant === "favourites") return this.favourites.slice(this.offers.length ? 0 : 4, (this.offers.length ? 0 : 4) + 4);
      if (this.variant === "department" && this.dept) return this.rank.find((x) => x.c.id === this.dept.id).ps.filter((p) => p.quantity !== 0).slice(0, 4);
      return [];
    },
    title() {
      if (this.variant === "featured") return this.offers.length ? this.t("tf.home.offersH", "{shop} offers", { shop: this.shopName }) : this.t("tf.home.featuredH", "Featured toys");
      if (this.variant === "favourites") return this.t("tf.home.favouritesH", "Playroom favourites");
      return this.dept ? this.catTitle(this.dept) : "";
    },
    moreTo() {
      if (this.variant === "featured" && this.offers.length) return this.dealsTo;
      if (this.variant === "department" && this.dept) return this.catTo(this.dept);
      return this.allTo;
    },
    moreLabel() {
      if (this.variant === "featured" && this.offers.length) return this.t("tf.home.allOffers", "See all offers");
      if (this.variant === "department") return this.t("tf.home.seeDept", "See the department");
      return this.variant === "featured" ? this.t("tf.home.seeAll", "See all toys") : this.t("tf.home.shopAll", "Shop all toys");
    },
  },
};
</script>
