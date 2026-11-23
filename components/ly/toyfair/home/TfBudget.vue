<!--
  Toy Fair home: "Shop by budget" (design fair-budget): four round "Under X" amounts that split the shop's live
  prices (tf.ts budgets()), in the visitor's currency, each opening the catalogue up to that price.
-->
<template>
  <section v-if="budgetList.length" aria-labelledby="tf-budget-h" :class="['tf-sec', 'tf-budget', { band }]">
    <div class="wrap">
      <div class="tf-top">
        <h2 id="tf-budget-h">{{ t("tf.home.budgetH", "Shop by budget") }}</h2>
        <router-link :to="tfTo(TF.GIFT)" class="tf-more">{{ t("tf.hdr.gift", "Gift finder") }}<ly-icon name="arrow" /></router-link>
      </div>
      <ul :style="{ '--n': budgetList.length }" class="tf-budgets">
        <li v-for="b in budgetList" :key="b">
          <router-link :to="underTo(b)"><strong>{{ t("tf.home.under", "Under {price}", { price: money(b, true) }) }}</strong><ly-icon name="arrow" /></router-link>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import LyIcon from "../../LyIcon.vue";
import TfHome from "./tf-home";
import { money } from "../../ly";

export default { name: "TfBudget", components: { LyIcon }, mixins: [TfHome], methods: { money } };
</script>
