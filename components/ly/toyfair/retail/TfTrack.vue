<!--
  Toy Fair: Track an order (design toy-fair order-lookup.html): one field, the order number ("SM-123" or "123"),
  that opens the order's own page (Selldone's MyPhysicalOrderInfoPage). A guest can open an order placed on this
  device; signing in shows every order. The number is checked here and what is wrong is said under the field.
-->
<template>
  <div class="ly tf-page tf-rt">
    <ly-pt :crumbs="[{ label: title }]" :lead="t('tf.rt.tr.lead', 'Enter your order number to open the order and see where it is.')" :title="title" cls="compact" />
    <div class="wrap">
      <form class="tf-rt-panel tf-rt-narrow tf-rt-form" novalidate @submit.prevent="go">
        <label class="tf-rt-lbl" for="tf-rt-order">{{ t("tf.rt.tr.label", "Order number") }}</label>
        <input
          id="tf-rt-order"
          v-model="num"
          :aria-describedby="err ? 'tf-rt-order-err tf-rt-order-hint' : 'tf-rt-order-hint'"
          :aria-invalid="err ? 'true' : 'false'"
          autocapitalize="characters"
          autocomplete="off"
          class="tf-rt-in"
          enterkeyhint="go"
          placeholder="SM-1234"
          spellcheck="false"
          type="text"
          @input="err = ''"
        />
        <p id="tf-rt-order-hint" class="tf-rt-hint">{{ t("tf.rt.tr.hint", "You'll find it in your order confirmation, for example SM-1234.") }}</p>
        <p v-if="err" id="tf-rt-order-err" class="tf-rt-err" role="alert">{{ err }}</p>
        <div class="tf-rt-acts">
          <button class="btn" type="submit">{{ t("tf.rt.tr.go", "Open order") }}</button>
        </div>
        <p class="tf-rt-note">
          {{ user ? t("tf.rt.tr.noteIn", "Every order you've placed is listed in your account.") : t("tf.rt.tr.note", "As a guest you can open an order placed on this device. Sign in to see every order you've placed.") }}
        </p>
        <div class="tf-rt-links">
          <router-link v-if="user" :to="ordersTo" class="tf-more">{{ t("tf.rt.svc.orders", "Your orders") }}<ly-icon name="arrow" /></router-link>
          <button v-else class="tf-more" type="button" @click="signIn">{{ t("tf.rt.tr.signIn", "Sign in") }}<ly-icon name="arrow" /></button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import LyIcon from "../../LyIcon.vue";
import LyPt from "../../ui/LyPt.vue";
import { loadDm } from "../../ly";
import { t } from "../../../kalio/i18n/kalio-i18n";
import { EventBus } from "@selldone/components-vue/utils/events/EventBus.ts";

export default {
  name: "TfTrack",
  components: { LyIcon, LyPt },
  data: () => ({ num: "", err: "" }),
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    title() {
      return t("tf.rt.tr.title", "Track an order");
    },
    ordersTo() {
      return { name: window.$storefront.routes.HISTORY_ORDERS_PHYSICAL };
    },
  },
  created() {
    loadDm();
  },
  methods: {
    t,
    /** "SM-123", "sm 123", "#123" or "123" → 123; null when it is not an order number. */
    parse(raw) {
      const s = String(raw || "")
        .trim()
        .replace(/^#/, "")
        .replace(/\s+/g, "");
      const m = s.match(/^(?:SM-?)?(\d{1,12})$/i);
      return m && Number(m[1]) > 0 ? Number(m[1]) : null;
    },
    go() {
      if (!this.num.trim()) {
        this.err = t("tf.rt.tr.errEmpty", "Enter your order number.");
      } else {
        const id = this.parse(this.num);
        if (id) {
          this.$router.push({ name: "MyPhysicalOrderInfoPage", params: { basket_id: id } });
          return;
        }
        this.err = t("tf.rt.tr.errBad", "That isn't an order number. Use its digits, for example SM-1234 or 1234.");
      }
      this.$nextTick(() => document.getElementById("tf-rt-order")?.focus());
    },
    signIn() {
      EventBus.$emit("need-login", true);
    },
  },
};
</script>
