<!--
  Toy Fair home: "Help with your order" (design fair-help-grid): delivery, pickup points (only when the shop has a
  pickup point; otherwise payment options) and order tracking, each a row to its service page.
-->
<template>
  <section aria-labelledby="tf-helprow-h" :class="['tf-sec', 'tf-helprow', { band }]">
    <div class="wrap">
      <div class="tf-top">
        <h2 id="tf-helprow-h">{{ t("tf.home.helpH", "Help with your order") }}</h2>
        <router-link :to="tfTo(TF.HELP)" class="tf-more">{{ t("tf.hdr.helpCentre", "Help centre") }}<ly-icon name="arrow" /></router-link>
      </div>
      <ul class="tf-help-grid">
        <li v-for="x in rows" :key="x.to.name">
          <router-link :to="x.to" class="tf-help-a">
            <span class="tf-sym"><ly-icon :name="x.icon" /></span><strong>{{ x.label }}</strong><ly-icon cls="chev" name="right" />
          </router-link>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import LyIcon from "../../LyIcon.vue";
import TfHome from "./tf-home";
import { canCollect } from "../tf";

export default {
  name: "TfHelpRow",
  components: { LyIcon },
  mixins: [TfHome],
  computed: {
    rows() {
      const TF = this.TF;
      return [
        { to: this.tfTo(TF.DELIVERY), icon: "truck", label: this.t("tf.home.helpDelivery", "Delivery") },
        canCollect(this.shop)
          ? { to: this.tfTo(TF.PICKUPS), icon: "pin", label: this.t("tf.home.helpPickup", "Find a pickup point") }
          : { to: this.tfTo(TF.PAYMENT), icon: "card", label: this.t("tf.ftr.payment", "Payment options") },
        { to: this.tfTo(TF.TRACK), icon: "box", label: this.t("tf.hdr.track", "Track an order") },
      ];
    },
  },
};
</script>
