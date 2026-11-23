<!--
  Toy Fair: an amount with its cents raised ("$176⁰⁰", the design's fairPrice()), in the visitor's currency. The whole
  amount stays one left-to-right piece (formatMoney's isolate) and its spoken label is the plain amount.
-->
<template>
  <span :aria-label="text" class="money tf-money" role="text"
    ><span aria-hidden="true">{{ parts.main }}<sup v-if="parts.cents">{{ parts.cents }}</sup>{{ parts.tail }}</span></span
  >
</template>

<script>
import { money } from "../ly";
import { currentCurrency } from "../../region-switcher/region";

export default {
  name: "TfMoney",
  props: { amount: { type: Number, default: 0 } },
  computed: {
    text() {
      void currentCurrency();
      return money(this.amount);
    },
    parts() {
      const s = this.text;
      const m = s.match(/^(.*?\d)[.,](\d{2})(\D*)$/);
      if (!m) return { main: s, cents: "", tail: "" };
      return { main: m[1], cents: m[2], tail: m[3] };
    },
  },
};
</script>
