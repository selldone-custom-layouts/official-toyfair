<!--
  Toy Fair home: "Shop by age" on the family tint (design fairAgeNav): every age the toys' own specification uses,
  youngest first, as pills that open the catalogue filtered to that age. Hidden when no toy names an age.
-->
<template>
  <section v-if="ageList.length" aria-labelledby="tf-ages-h" :class="['tf-sec', 'tf-ages-band', { band }]">
    <div class="wrap">
      <div class="tf-top">
        <h2 id="tf-ages-h">{{ t("tf.home.agesH", "Shop by age") }}</h2>
        <router-link :to="tfTo(TF.GIFT)" class="tf-more">{{ t("tf.home.openGift", "Open gift finder") }}<ly-icon name="arrow" /></router-link>
      </div>
      <ul :style="{ '--n': Math.min(ageList.length, 7) }" class="tf-ages">
        <li v-for="a in ageList" :key="a"><router-link :to="ageTo(a)"><bdi>{{ a }}</bdi></router-link></li>
      </ul>
    </div>
  </section>
</template>

<script>
import LyIcon from "../../LyIcon.vue";
import TfHome from "./tf-home";

export default { name: "TfAges", components: { LyIcon }, mixins: [TfHome] };
</script>
