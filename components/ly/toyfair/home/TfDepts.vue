<!--
  Toy Fair home: "Shop by department" (design fairCollectionTiles): every department with toys as a picture tile,
  its own image (the category's icon; without one, its best seller), its name. One row of up to ten on a desktop;
  a scrolling row on a phone.
-->
<template>
  <section v-if="depts.length" aria-labelledby="tf-depts-h" :class="['tf-sec', 'tf-depts', { band }]">
    <div class="wrap">
      <div class="tf-top">
        <h2 id="tf-depts-h">{{ t("tf.home.deptsH", "Shop by department") }}</h2>
        <router-link :to="allTo" class="tf-more">{{ t("tf.home.browseAll", "Browse all") }}<ly-icon name="arrow" /></router-link>
      </div>
      <ul :style="{ '--n': Math.min(depts.length, 10), '--half': Math.ceil(Math.min(depts.length, 10) / 2) }" class="tf-dept-tiles">
        <li v-for="c in depts" :key="c.id">
          <router-link :to="catTo(c)">
            <span class="tf-dt-ph"><img v-if="deptImg(c)" :src="deptImg(c)" alt="" loading="lazy" /></span>
            <strong><bdi>{{ catTitle(c) }}</bdi></strong>
          </router-link>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import LyIcon from "../../LyIcon.vue";
import TfHome from "./tf-home";
import { inCat } from "../../ly";

export default {
  name: "TfDepts",
  components: { LyIcon },
  mixins: [TfHome],
  computed: {
    depts() {
      return this.cats.filter((c) => inCat(c.id).length);
    },
  },
};
</script>
