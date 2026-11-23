<!--
  Toy Fair home: the hero (design fairHero): a soft panel in the family's light tint with big words and two pills
  (the live offers when the shop has some, else the featured toys; the gift finder) beside the skin's hero photo
  (photo slot "hero"; without it, the best sellers on a white plate). On a phone the photo goes first, the words
  under it, never over it.
-->
<template>
  <section aria-labelledby="tf-hero-h" class="tf-hero">
    <div class="wrap">
      <div class="tf-hero-in">
        <div class="tf-hero-copy">
          <h1 id="tf-hero-h">{{ t("tf.home.heroH", "Make room for play.") }}</h1>
          <p>{{ t("tf.home.heroP", "Build a new world, race to the finish or find the gift they’ll open first.") }}</p>
          <div class="tf-hero-acts">
            <router-link v-if="offers.length" :to="dealsTo" class="btn">{{ t("tf.home.shopOffers", "Shop offers") }}</router-link>
            <a v-else class="btn" href="#tf-featured" @click.prevent="toFeatured">{{ t("tf.home.shopFeatured", "Shop featured toys") }}</a>
            <router-link :to="tfTo(TF.GIFT)" class="btn quiet">{{ t("tf.home.giftIdeas", "Browse gift ideas") }}</router-link>
          </div>
        </div>
        <ly-photo :alt="t('tf.home.heroAlt', 'Children playing together')" class="tf-hero-art" eager name="hero">
          <template #fallback>
            <div class="tf-hero-cuts">
              <img v-for="p in favourites.slice(0, 3)" :key="p.id" :src="img(p)" alt="" loading="eager" />
            </div>
          </template>
        </ly-photo>
      </div>
    </div>
  </section>
</template>

<script>
import LyPhoto from "../../LyPhoto.vue";
import TfHome from "./tf-home";
import { productImage, scrollBehavior } from "../../ly";

export default {
  name: "TfHero",
  components: { LyPhoto },
  mixins: [TfHome],
  methods: {
    img(p) {
      return productImage(p, null);
    },
    toFeatured() {
      document.getElementById("tf-featured")?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
    },
  },
};
</script>
