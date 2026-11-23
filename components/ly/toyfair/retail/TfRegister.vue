<!--
  Toy Fair: Create an account (design toy-fair register.html): a centred panel with the shop's wordmark, one line and
  the button that opens Selldone's own sign-in / sign-up sheet; "Track an order as a guest" and "Sign in instead"
  under it. Signed in: "You're signed in" and the way to the account.
-->
<template>
  <div class="ly tf-page tf-rt">
    <ly-pt :crumbs="[{ label: title }]" :lead="lead" :title="title" cls="compact" />
    <div class="wrap">
      <div class="tf-rt-panel tf-rt-narrow tf-rt-login">
        <span class="tf-brand tf-rt-brand">
          <span aria-hidden="true" class="tf-glyph"><ly-icon name="sparkle" /></span>
          <ly-logo :to="null" />
        </span>
        <template v-if="user">
          <p class="tf-rt-login-p">{{ t("tf.rt.rg.inP", "Your orders, addresses and saved toys are in your account.") }}</p>
          <div class="tf-rt-acts">
            <router-link :to="{ name: 'KalioAccountHome' }" class="btn">{{ t("tf.rt.rg.account", "Go to your account") }}</router-link>
          </div>
        </template>
        <template v-else>
          <p class="tf-rt-login-p">{{ t("tf.rt.rg.p", "One account keeps your orders, saved addresses and favourite toys together.") }}</p>
          <div class="tf-rt-acts">
            <button class="btn" type="button" @click="signIn">{{ t("tf.rt.rg.create", "Create account") }}</button>
          </div>
          <div class="tf-rt-links">
            <router-link :to="trackTo" class="tf-more">{{ t("tf.rt.rg.guest", "Track an order as a guest") }}<ly-icon name="arrow" /></router-link>
            <button class="tf-more" type="button" @click="signIn">{{ t("tf.rt.rg.signIn", "Sign in instead") }}<ly-icon name="arrow" /></button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import LyIcon from "../../LyIcon.vue";
import LyLogo from "../../LyLogo.vue";
import LyPt from "../../ui/LyPt.vue";
import { loadDm } from "../../ly";
import { TF, tfTo } from "../tf";
import { t } from "../../../kalio/i18n/kalio-i18n";
import { EventBus } from "@selldone/components-vue/utils/events/EventBus.ts";

export default {
  name: "TfRegister",
  components: { LyIcon, LyLogo, LyPt },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    title() {
      return this.user ? t("tf.rt.rg.inH", "You're signed in") : t("tf.rt.rg.title", "Create an account");
    },
    lead() {
      return this.user ? "" : t("tf.rt.rg.lead", "Save your addresses and follow your orders.");
    },
    trackTo() {
      return tfTo(TF.TRACK);
    },
  },
  created() {
    loadDm();
  },
  methods: {
    t,
    signIn() {
      EventBus.$emit("need-login", true);
    },
  },
};
</script>
