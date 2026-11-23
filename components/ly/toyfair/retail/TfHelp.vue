<!--
  Toy Fair: the Help centre (design toy-fair help.html, fairHelpTopics): a grid of topic panels, each a symbol, a title,
  one line and a chevron, opening its service page. The pickup topic shows only when the shop has a pickup point;
  nothing here names a policy, a time or a place the shop has not set.
-->
<template>
  <div class="ly tf-page tf-rt">
    <ly-pt :crumbs="[{ label: t('tf.rt.help.title', 'Help centre') }]" :lead="t('tf.rt.help.lead', 'Find the right place to get help with your order.')" :title="t('tf.rt.help.title', 'Help centre')" cls="compact" />
    <div class="wrap">
      <ul class="tf-rt-topics">
        <li v-for="x in topics" :key="x.key">
          <router-link :to="x.to" class="tf-rt-topic">
            <span class="tf-sym"><ly-icon :name="x.icon" /></span>
            <span class="tf-rt-topic-tx">
              <h2 class="tf-rt-topic-h">{{ x.title }}</h2>
              <span class="tf-rt-topic-p">{{ x.text }}</span>
            </span>
            <ly-icon cls="tf-rt-chev" name="right" />
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import LyIcon from "../../LyIcon.vue";
import LyPt from "../../ui/LyPt.vue";
import { loadDm } from "../../ly";
import { TF, canCollect, tfTo } from "../tf";
import { t } from "../../../kalio/i18n/kalio-i18n";
import { BRAND } from "../../../kalio/kalio-brand";

export default {
  name: "TfHelp",
  components: { LyIcon, LyPt },
  computed: {
    shop() {
      return this.$store.getters.getShop;
    },
    /* the shop's name in a sentence: its own title, first letter capital (as the delivery way names it) */
    shopName() {
      const raw = String(BRAND.name || this.shop?.title || "").trim();
      return raw.charAt(0).toUpperCase() + raw.slice(1);
    },
    topics() {
      const out = [
        { key: "delivery", to: tfTo(TF.DELIVERY), icon: "truck", title: t("tf.rt.help.delivery", "Home delivery"), text: t("tf.rt.help.deliveryP", "How the shop delivers, and what delivery costs.") },
      ];
      if (canCollect(this.shop))
        out.push({ key: "collect", to: tfTo(TF.COLLECT), icon: "pin", title: t("tf.rt.help.collect", "Pickup"), text: t("tf.rt.help.collectP", "Pickup points and how collection works.") });
      out.push(
        { key: "returns", to: tfTo(TF.RETURNS), icon: "box", title: t("tf.rt.help.returns", "Returns"), text: t("tf.rt.help.returnsP", "How to ask for a return from your order.") },
        { key: "track", to: tfTo(TF.TRACK), icon: "search", title: t("tf.rt.help.track", "Track an order"), text: t("tf.rt.help.trackP", "Open an order with its order number.") },
        { key: "stock", to: tfTo(TF.STOCK), icon: "check", title: t("tf.rt.help.stock", "Stock availability"), text: t("tf.rt.help.stockP", "Where to see whether a toy is available.") },
        { key: "preorder", to: tfTo(TF.PREORDER), icon: "box", title: t("tf.rt.help.preorder", "Pre-orders"), text: t("tf.rt.help.preorderP", "What happens when a toy is out of stock.") },
        { key: "giftcards", to: tfTo(TF.GIFTCARDS), icon: "card", title: t("tf.rt.help.giftcards", "Gift cards"), text: t("tf.rt.help.giftcardsP", "Your gift cards, and help choosing a gift.") },
        { key: "payment", to: tfTo(TF.PAYMENT), icon: "card", title: t("tf.rt.help.payment", "Payment options"), text: t("tf.rt.help.paymentP", "The ways you can pay at this shop.") },
        { key: "notices", to: tfTo(TF.NOTICES), icon: "message", title: t("tf.rt.help.notices", "Product notices"), text: t("tf.rt.help.noticesP", "Ages, specifications and questions about a toy.") },
        { key: "faq", to: { name: "ShopFAQ" }, icon: "book", title: t("tf.rt.help.faq", "Frequently asked questions"), text: t("tf.rt.help.faqP", "Answers about the shop and your account.") },
        {
          key: "contact",
          to: { name: window.$storefront.routes.SHOP_CONTACT_US },
          icon: "mail",
          title: t("tf.rt.help.contact", "Contact"),
          text: this.shopName ? t("tf.rt.help.contactP", "Send a message to {shop}.", { shop: this.shopName }) : t("tf.rt.help.contactAny", "Send the shop a message."),
        },
      );
      return out;
    },
  },
  created() {
    loadDm();
  },
  methods: { t },
};
</script>
