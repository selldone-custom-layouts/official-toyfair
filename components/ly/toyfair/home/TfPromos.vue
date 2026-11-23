<!--
  Toy Fair home: two photo promos (design fair-promo-grid): the first two departments that have their own photo in
  the skin (col-<slug>.webp), each a large photo card with the department's name and an arrow. Hidden when fewer
  than two departments have a photo (a cloned shop with other departments shows no stranger's photo).
-->
<template>
  <section v-if="promos.length === 2" :aria-label="t('tf.home.promosAria', 'Featured departments')" :class="['tf-sec', 'tf-promos', { band }]">
    <div class="wrap tf-promo-grid">
      <router-link v-for="x in promos" :key="x.c.id" :to="catTo(x.c)" class="tf-promo">
        <span class="tf-promo-ph"><img :src="x.photo" alt="" loading="lazy" /></span>
        <span class="tf-promo-tx"><strong><bdi>{{ catTitle(x.c) }}</bdi></strong><ly-icon name="arrow" /></span>
      </router-link>
    </div>
  </section>
</template>

<script>
import LyIcon from "../../LyIcon.vue";
import TfHome from "./tf-home";
import { collectionPhoto } from "../../ly-photos";

export default {
  name: "TfPromos",
  components: { LyIcon },
  mixins: [TfHome],
  computed: {
    promos() {
      return this.cats
        .map((c) => ({ c, photo: collectionPhoto(c) }))
        .filter((x) => x.photo)
        .slice(0, 2);
    },
  },
};
</script>
