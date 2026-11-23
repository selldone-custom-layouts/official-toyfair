<!--
  Toy Fair: the footer (design toy-fair, shared/toy-fair.js fairFooter()) in the brand colour: the glyph and the
  shop's own wordmark with "Find something fun" and the gift finder; four columns of links (Shop, Help & delivery,
  Your account, the shop itself, its pages); the shop's social links; the Theme row (the kit's ThemeSwitcherRow,
  only on the showcase shop: the owner's rule of 10 November 2026); the legal row with Selldone's cookie settings,
  the copyright and a small "made with" credit. A shop with custom footer code keeps Selldone's (StorefrontLayout).
-->
<template>
  <div class="ly ly-ftrwrap tf-ftrwrap">
    <footer class="ftr tf-ftr">
      <div class="wrap tf-ftr-top">
        <router-link :aria-label="t('ly.logo.homeOf', '{name}, home', { name: shopName })" :to="{ path: '/' }" class="tf-brand">
          <span aria-hidden="true" class="tf-glyph"><ly-icon name="sparkle" /></span>
          <ly-logo :to="null" />
        </router-link>
        <div class="tf-ftr-say">
          <h2>{{ t("tf.ftr.fun", "Find something fun") }}</h2>
          <p>{{ t("tf.ftr.funP", "Browse toys, play ideas and gifts for every age.") }}</p>
        </div>
        <router-link :to="tfTo(TF.GIFT)" class="btn tf-on-brand">{{ t("tf.ftr.tryGift", "Try the gift finder") }}</router-link>
      </div>
      <div class="wrap tf-ftr-main">
        <nav :aria-label="t('tf.ftr.shopNav', 'Browse toys')">
          <h2>{{ t("ly.ftr.shop", "Shop") }}</h2>
          <router-link :to="shopTo">{{ t("tf.ftr.allToys", "All toys") }}</router-link>
          <router-link :to="dealsTo">{{ t("tf.ftr.offers", "Offers") }}</router-link>
          <router-link :to="blogTo">{{ t("tf.ftr.guides", "Play guides") }}</router-link>
          <router-link :to="tfTo(TF.GIFT)">{{ t("tf.hdr.gift", "Gift finder") }}</router-link>
        </nav>
        <nav :aria-label="t('tf.ftr.helpNav', 'Delivery and returns')">
          <h2>{{ t("tf.ftr.help", "Help & delivery") }}</h2>
          <router-link :to="tfTo(TF.HELP)">{{ t("tf.hdr.helpCentre", "Help centre") }}</router-link>
          <router-link :to="tfTo(TF.DELIVERY)">{{ t("tf.ftr.shipping", "Shipping & delivery") }}</router-link>
          <router-link :to="tfTo(TF.PICKUPS)">{{ t("tf.ftr.pickups", "Pickup locations") }}</router-link>
          <router-link :to="tfTo(TF.RETURNS)">{{ t("tf.ftr.returns", "Returns") }}</router-link>
        </nav>
        <nav :aria-label="t('tf.ftr.accountNav', 'Your account')">
          <h2>{{ t("tf.ftr.account", "Your account") }}</h2>
          <router-link :to="{ name: 'KalioAccountHome' }">{{ t("tf.ftr.overview", "Account overview") }}</router-link>
          <router-link :to="tfTo(TF.TRACK)">{{ t("tf.hdr.track", "Track an order") }}</router-link>
          <router-link :to="{ name: r.USER_FAVORITES_PAGE }">{{ t("tf.hdr.saved", "Saved toys") }}</router-link>
          <router-link :to="{ name: r.COMPARISON_PAGE }">{{ t("tf.hdr.compare", "Compare toys") }}</router-link>
        </nav>
        <nav :aria-label="shopName">
          <h2><bdi>{{ shopName }}</bdi></h2>
          <router-link :to="{ name: r.SHOP_PROFILE_PAGE_ABOUT_US }">{{ t("tf.ftr.about", "About us") }}</router-link>
          <router-link :to="{ name: r.SHOP_CONTACT_US }">{{ t("ly.ftr.contactPage", "Contact") }}</router-link>
          <router-link :to="tfTo(TF.PAYMENT)">{{ t("tf.ftr.payment", "Payment options") }}</router-link>
          <router-link :to="tfTo(TF.NOTICES)">{{ t("tf.ftr.notices", "Product notices") }}</router-link>
          <router-link :to="faqTo">{{ t("ly.ftr.faq", "FAQ") }}</router-link>
        </nav>
      </div>

      <!-- The theme switcher (the owner, 10 November 2026: in the footer on
           every Layout), only on the Layout's showcase shop. -->
      <div v-if="theme.enabled" class="dts-row">
        <div class="wrap dts-in"><theme-switcher-row /></div>
      </div>

      <div class="ftr-bot">
        <div class="wrap fb-in">
          <span class="tf-copy">© {{ year }} <bdi>{{ shopName }}</bdi></span>
          <nav :aria-label="t('ly.ftr.legal', 'Legal')">
            <router-link :to="{ name: r.SHOP_PROFILE_PAGE_TERMS }">{{ t("ly.ftr.terms", "Terms") }}</router-link>
            <router-link :to="{ name: r.SHOP_PROFILE_PAGE_PRIVACY }">{{ t("ly.ftr.privacy", "Privacy") }}</router-link>
            <s-footer-section-gdpr class="ly-gdpr"></s-footer-section-gdpr>
          </nav>
          <div class="fb-end">
            <s-storefront-social-buttons class="ly-social"></s-storefront-social-buttons>
            <s-footer-section-selldone class="ly-made"></s-footer-section-selldone>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import LyLogo from "../LyLogo.vue";
import LyIcon from "../LyIcon.vue";
import ThemeSwitcherRow from "../../theme-switcher/ThemeSwitcherRow.vue";
import { themeState } from "../../theme-switcher/theme-switcher";
import SStorefrontSocialButtons from "@selldone/components-vue/storefront/social/SStorefrontSocialButtons.vue";
import SFooterSectionGdpr from "@selldone/components-vue/storefront/footer/section/gdpr/SFooterSectionGdpr.vue";
import SFooterSectionSelldone from "@selldone/components-vue/storefront/footer/section/selldone/SFooterSectionSelldone.vue";
import { catTitle, catTo, loadDm, openLine as openLineOf, ly, shopFacts } from "../ly";
import { journalRoute } from "../../kalio/pages/kalio-journal";
import { t } from "../../kalio/i18n/kalio-i18n";
import { catalogueRoute, dealsRoute } from "../../kalio/kalio-catalog";
import { TF, tfTo } from "../toyfair/tf";

/* A US state's two letters for the address line ("CA"). */
const US = { California: "CA", "New York": "NY", Texas: "TX", Washington: "WA", Illinois: "IL", Florida: "FL", Massachusetts: "MA", Oregon: "OR" };

export default {
  name: "LyFooter",
  components: { LyLogo, LyIcon, ThemeSwitcherRow, SStorefrontSocialButtons, SFooterSectionGdpr, SFooterSectionSelldone },
  data: () => ({ theme: themeState, ly, TF }),
  computed: {
    shop() {
      return this.$store.getters.getShop;
    },
    r() {
      return window.$storefront.routes;
    },
    facts() {
      return shopFacts(this.shop);
    },
    shopName() {
      const n = this.shop?.title || "";
      return n.charAt(0).toUpperCase() + n.slice(1);
    },
    year() {
      return new Date().getFullYear();
    },
    cats() {
      return this.ly.cats;
    },
    shopTo() {
      return catalogueRoute({});
    },
    dealsTo() {
      return dealsRoute();
    },
    blogTo() {
      return journalRoute();
    },
    faqTo() {
      return this.$router.hasRoute("ShopFAQ") ? { name: "ShopFAQ" } : { name: this.r.SHOP_CONTACT_US };
    },
    /* "Come to the counter, or let the courier come to you." From the shop's ways. */
    line() {
      const f = this.facts;
      if (f.pickup && f.courier) return t("ly.ftr.lineBoth", "Come to the counter, or let the courier come to you.");
      if (f.courier) return t("ly.ftr.lineCourier", "Let the courier come to you.");
      if (f.pickup) return t("ly.ftr.linePickup", "Come to the counter.");
      if (f.shipping) return t("ly.ftr.lineShip", "Sold one by one, shipped to your door.");
      return t("ly.ftr.lineNone", "Sold one by one.");
    },
    /* The street; city, state and postcode; the country. */
    addressLines() {
      const f = this.facts;
      const p = f.pickupPoint;
      const street = p?.address || String(f.address || "").split(",")[0];
      const region = US[f.region] || f.region || "";
      const cityLine = [f.city, [region, f.postal].filter(Boolean).join(" ")].filter(Boolean).join(", ");
      return [street, cityLine, f.country].filter(Boolean);
    },
    openLine() {
      return openLineOf(this.facts);
    },
  },
  created() {
    loadDm();
  },
  methods: { t, tfTo, catTitle, catTo },
};
</script>
