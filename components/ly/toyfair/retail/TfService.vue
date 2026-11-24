<!--
  Toy Fair: one retail service page (design toy-fair shipping.html, fairService()): the title band with Home › Help
  centre › page, an article panel of sections and a "Next steps" panel of pill buttons. Which page is the route's
  meta.tf: delivery | collect | returns | stock | preorder | giftcards | payment | notices.

  Every fact comes from the live shop: its delivery ways (fee, free-over amount, reach, pay on delivery, windows,
  days), its pickup points, its payment gateways. Nothing names a delivery time, a returns window, a hold time or a
  policy the shop has not set; a shop without delivery ways, pickup points or gateways gets an honest empty state.
-->
<template>
  <div class="ly tf-page tf-rt">
    <ly-pt :crumbs="crumbs" :lead="page.lead" :title="page.title" cls="compact" />
    <div class="wrap tf-rt-svc">
      <article class="tf-rt-panel tf-rt-art">
        <ly-empty v-if="page.empty" :icon="page.empty.icon" :text="page.empty.text" :title="page.empty.title" cls="tf-rt-empty" tag="h2">
          <template v-if="page.empty.acts" #acts>
            <router-link v-for="(a, i) in page.empty.acts" :key="i" :class="['btn', 'sm', { quiet: i > 0 }]" :to="a.to">{{ a.label }}</router-link>
          </template>
        </ly-empty>
        <section v-for="s in page.sections" v-else :key="s.key" class="tf-rt-sec">
          <h2 class="tf-rt-sec-h">
            <bdi v-if="s.own">{{ s.h }}</bdi><template v-else>{{ s.h }}</template>
          </h2>
          <p v-if="s.p" :class="{ 'tf-rt-own': s.own }">
            <bdi v-if="s.own">{{ s.p }}</bdi><template v-else>{{ s.p }}</template>
          </p>
          <ul v-if="s.tags && s.tags.length" class="tf-rt-tags">
            <li v-for="g in s.tags" :key="g" class="tf-rt-tag">{{ g }}</li>
          </ul>
          <ul v-if="s.facts && s.facts.length" class="tf-rt-facts">
            <li v-for="f in s.facts" :key="f.k"><ly-icon :name="f.icon" /><span>{{ f.text }}</span></li>
          </ul>
          <ul v-if="s.points" class="tf-rt-plist">
            <li v-for="pt in s.points" :key="pt.key">
              <router-link :to="pt.to" class="tf-rt-prow">
                <span class="tf-sym"><ly-icon name="pin" /></span>
                <span class="tf-rt-prow-tx">
                  <strong><bdi>{{ pt.name }}</bdi></strong>
                  <small v-if="pt.where"><bdi>{{ pt.where }}</bdi></small>
                </span>
                <ly-icon cls="tf-rt-chev" name="right" />
              </router-link>
            </li>
          </ul>
          <router-link v-if="s.more" :to="s.more.to" class="tf-more">{{ s.more.label }}<ly-icon name="arrow" /></router-link>
        </section>
      </article>
      <aside :aria-labelledby="'tf-rt-next-' + kind" class="tf-rt-panel tf-rt-next">
        <h2 :id="'tf-rt-next-' + kind" class="tf-rt-next-h">{{ t("tf.rt.svc.next", "Next steps") }}</h2>
        <router-link v-for="(n, i) in page.next" :key="i" :to="n.to" class="btn quiet">{{ n.label }}</router-link>
      </aside>
    </div>
  </div>
</template>

<script>
import LyIcon from "../../LyIcon.vue";
import LyPt from "../../ui/LyPt.vue";
import LyEmpty from "../../ui/LyEmpty.vue";
import { isLocalWay, loadDm, money } from "../../ly";
import { windowWord } from "../../buy/ly-cart";
import { TF, canCollect, catalogueRoute, gateways, homeWays, pickupPoints, tfTo } from "../tf";
import { locale, t } from "../../../kalio/i18n/kalio-i18n";
import { BRAND } from "../../../kalio/kalio-brand";
import { currentCurrency } from "../../../region-switcher/region";

const WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** "Morning, Evening or Night" in the visitor's language. */
function listOf(items, type = "conjunction") {
  try {
    return new Intl.ListFormat(locale(), { style: "long", type }).format(items);
  } catch {
    return items.join(", ");
  }
}

/** A weekday's name ("Monday") in the visitor's language. */
function dayName(day) {
  const i = WEEK.indexOf(day);
  if (i < 0) return day;
  try {
    return new Intl.DateTimeFormat(locale(), { weekday: "long", timeZone: "UTC" }).format(new Date(Date.UTC(2025, 0, 5 + i)));
  } catch {
    return day;
  }
}

/** A pickup point's one-line address: street, city, state and postal code as the shop wrote them. */
function pointWhere(p) {
  const street = [p.address, p.no, p.unit].filter(Boolean).join(" ");
  return [street, p.city, [p.state, p.postal].filter(Boolean).join(" ")].filter((x) => String(x || "").trim()).join(", ");
}

export default {
  name: "TfService",
  components: { LyIcon, LyPt, LyEmpty },
  computed: {
    shop() {
      return this.$store.getters.getShop;
    },
    user() {
      return this.$store.getters.getUser;
    },
    kind() {
      return String(this.$route.meta?.tf || "delivery");
    },
    /* the shop's name in a sentence: its own title, first letter capital (as the delivery way names it) */
    shopName() {
      const raw = String(BRAND.name || this.shop?.title || "").trim();
      return raw.charAt(0).toUpperCase() + raw.slice(1);
    },
    crumbs() {
      return [{ label: t("tf.rt.help.title", "Help centre"), to: tfTo(TF.HELP) }, { label: this.page.title }];
    },
    /* the routes the pages link to */
    to() {
      const R = window.$storefront.routes;
      return {
        basket: { name: R.BASKET_PAGE, params: { type: "PHYSICAL" } },
        orders: { name: R.HISTORY_ORDERS_PHYSICAL },
        returns: { name: R.USER_RETURN_REQUESTS },
        giftcards: { name: R.USER_GIFTCARDS_PAGE },
        contact: { name: R.SHOP_CONTACT_US },
        faq: { name: "ShopFAQ" },
        all: catalogueRoute({}),
      };
    },
    page() {
      void currentCurrency();
      const fn = this["page_" + this.kind];
      return fn ? fn.call(this) : this.page_delivery();
    },
  },
  created() {
    loadDm();
  },
  methods: {
    t,
    /* ━━━━━━━━━━━━ Home delivery ━━━━━━━━━━━━ */
    page_delivery() {
      const ways = homeWays(this.shop);
      const title = t("tf.rt.dl.title", "Home delivery");
      const next = [
        { label: t("tf.rt.svc.basket", "Go to your basket"), to: this.to.basket },
        { label: t("tf.rt.svc.track", "Track an order"), to: tfTo(TF.TRACK) },
      ];
      if (!ways.length) {
        const acts = canCollect(this.shop) ? [{ label: t("tf.rt.svc.findPickup", "Find a pickup point"), to: tfTo(TF.PICKUPS) }] : [];
        acts.push({ label: t("tf.rt.svc.contact", "Contact the shop"), to: this.to.contact });
        return {
          title,
          lead: t("tf.rt.dl.lead", "How your order can reach you, and what delivery costs."),
          empty: { icon: "truck", title: t("tf.rt.dl.emptyH", "No home delivery yet"), text: t("tf.rt.dl.emptyP", "This shop doesn't deliver to an address at the moment."), acts },
          sections: [],
          next,
        };
      }
      const sections = ways.map((w) => ({ key: "w" + w.id, own: true, h: w.title, facts: this.wayFacts(w) }));
      sections.push(
        { key: "checkout", h: t("tf.rt.dl.checkoutH", "At checkout"), p: t("tf.rt.dl.checkoutP", "Enter your address at checkout to see the ways that reach it and the delivery fee before you pay.") },
        { key: "progress", h: t("tf.rt.dl.progressH", "Order progress"), p: t("tf.rt.dl.progressP", "Your order page shows the delivery status and the address your order goes to.") },
      );
      return { title, lead: t("tf.rt.dl.lead", "How your order can reach you, and what delivery costs."), sections, next };
    },
    /** One delivery way's facts, each from its own settings. */
    wayFacts(w) {
      const raw = (this.shop?.transportations || []).find((x) => x && x.id === w.id) || {};
      const byAddress = ["distance_cof", "weight_cof", "price_cof", "distance_weight_cof"].some((k) => Number(raw[k]) > 0);
      const out = [];
      if (w.free) out.push({ k: "fee", icon: "tag", text: t("tf.rt.dl.free", "Free delivery") });
      else if (byAddress)
        out.push({
          k: "fee",
          icon: "tag",
          text: w.fee ? t("tf.rt.dl.feeFrom", "From {fee}; your address and order set the rest", { fee: money(w.fee) }) : t("tf.rt.dl.feeByAddress", "The fee depends on your address and order"),
        });
      else out.push({ k: "fee", icon: "tag", text: w.fee ? t("tf.rt.dl.fee", "Delivery fee {fee}", { fee: money(w.fee) }) : t("tf.rt.dl.free", "Free delivery") });
      if (w.freeOver) out.push({ k: "over", icon: "gift", text: t("tf.rt.dl.freeOver", "Free on orders over {amount}", { amount: money(w.freeOver, true) }) });
      if (w.distance > 0 && !["Global", "Post"].includes(w.type))
        out.push({ k: "km", icon: "pin", text: isLocalWay(w) ? t("tf.rt.dl.within", "Within {n} km of the shop", { n: w.distance }) : t("tf.rt.dl.anyDistance", "No distance limit") });
      if (w.cod) out.push({ k: "cod", icon: "cash", text: t("tf.rt.dl.cod", "Pay on delivery available") });
      if (w.windows.length) out.push({ k: "win", icon: "clock", text: t("tf.rt.dl.windows", "Delivery windows: {list}", { list: listOf(w.windows.map(windowWord)) }) });
      if (w.days.length)
        out.push({
          k: "days",
          icon: "cal",
          text: w.days.length >= 7 ? t("tf.rt.dl.everyDay", "Delivers every day") : t("tf.rt.dl.days", "Delivers on {days}", { days: listOf(WEEK.filter((d) => w.days.includes(d)).map(dayName)) }),
        });
      return out;
    },
    /* ━━━━━━━━━━━━ Pickup ━━━━━━━━━━━━ */
    page_collect() {
      const points = pickupPoints(this.shop);
      const title = t("tf.rt.cl.title", "Pickup");
      const lead = t("tf.rt.cl.lead", "Collect your order in person from one of the shop's pickup points.");
      if (!points.length)
        return {
          title,
          lead,
          empty: {
            icon: "pin",
            title: t("tf.rt.cl.emptyH", "No pickup points yet"),
            text: t("tf.rt.cl.emptyP", "This shop has no pickup points yet; your order can be delivered instead."),
            acts: [{ label: t("tf.rt.svc.delivery", "Delivery options"), to: tfTo(TF.DELIVERY) }],
          },
          sections: [],
          next: [
            { label: t("tf.rt.svc.delivery", "Delivery options"), to: tfTo(TF.DELIVERY) },
            { label: t("tf.rt.svc.track", "Track an order"), to: tfTo(TF.TRACK) },
          ],
        };
      return {
        title,
        lead,
        sections: [
          {
            key: "points",
            h: t("tf.rt.cl.pointsH", "Pickup points"),
            points: points.map((p, i) => ({
              key: String(p.id ?? i + 1),
              name: p.title || p.name || t("tf.rt.pk.unnamed", "Pickup point"),
              where: pointWhere(p),
              to: tfTo(TF.PICKUP, undefined, { point_id: String(p.id ?? i + 1) }),
            })),
          },
          { key: "order", h: t("tf.rt.cl.orderH", "Place your order"), p: t("tf.rt.cl.orderP", "Add toys to your basket, then choose Pickup at checkout and the point that suits you.") },
          { key: "check", h: t("tf.rt.cl.checkH", "Check your order"), p: t("tf.rt.cl.checkP", "Your order page shows the pickup point you chose and the order's status.") },
        ],
        next: [
          { label: t("tf.rt.svc.findPickup", "Find a pickup point"), to: tfTo(TF.PICKUPS) },
          { label: t("tf.rt.svc.track", "Track an order"), to: tfTo(TF.TRACK) },
        ],
      };
    },
    /* ━━━━━━━━━━━━ Returns ━━━━━━━━━━━━ */
    page_returns() {
      return {
        title: t("tf.rt.rt.title", "Returns"),
        lead: t("tf.rt.rt.lead", "How to ask the shop to take an item back."),
        sections: [
          { key: "ask", h: t("tf.rt.rt.askH", "Request a return"), p: t("tf.rt.rt.askP", "Once your order has been delivered, open it from your orders and ask for a return of the item from the order page.") },
          {
            key: "follow",
            h: t("tf.rt.rt.followH", "Follow your request"),
            p: t("tf.rt.rt.followP", "Your return requests and their status are listed in your account. The shop reviews each request, and its answer shows there."),
            more: { label: t("tf.rt.rt.requests", "Your return requests"), to: this.to.returns },
          },
        ],
        next: [
          { label: t("tf.rt.svc.orders", "Your orders"), to: this.to.orders },
          { label: t("tf.rt.svc.track", "Track an order"), to: tfTo(TF.TRACK) },
        ],
      };
    },
    /* ━━━━━━━━━━━━ Stock ━━━━━━━━━━━━ */
    page_stock() {
      return {
        title: t("tf.rt.st.title", "Stock availability"),
        lead: t("tf.rt.st.lead", "See whether a toy is available before you order."),
        sections: [
          { key: "page", h: t("tf.rt.st.pageH", "On each toy's page"), p: t("tf.rt.st.pageP", "Each toy's page shows whether it is available to order.") },
          { key: "card", h: t("tf.rt.st.cardH", "On the toy cards"), p: t("tf.rt.st.cardP", "A toy's card says when it is out of stock, and it can't be added to the basket until it is back.") },
        ],
        next: [
          { label: t("tf.rt.svc.allToys", "Browse all toys"), to: this.to.all },
          canCollect(this.shop)
            ? { label: t("tf.rt.svc.findPickup", "Find a pickup point"), to: tfTo(TF.PICKUPS) }
            : { label: t("tf.rt.pr.title", "Pre-orders"), to: tfTo(TF.PREORDER) },
        ],
      };
    },
    /* ━━━━━━━━━━━━ Pre-orders ━━━━━━━━━━━━ */
    page_preorder() {
      return {
        title: t("tf.rt.pr.title", "Pre-orders"),
        lead: t("tf.rt.pr.lead", "What happens when a toy is out of stock."),
        sections: [
          { key: "out", h: t("tf.rt.pr.outH", "Out-of-stock toys"), p: t("tf.rt.pr.outP", "A toy that is out of stock can't be ordered until the shop restocks it. Its page says when it is unavailable.") },
          { key: "other", h: t("tf.rt.pr.otherH", "Find another toy"), p: t("tf.rt.pr.otherP", "Browse the departments and filters to find a similar toy that is in stock.") },
        ],
        next: [
          { label: t("tf.rt.svc.allToys", "Browse all toys"), to: this.to.all },
          { label: t("tf.rt.st.title", "Stock availability"), to: tfTo(TF.STOCK) },
        ],
      };
    },
    /* ━━━━━━━━━━━━ Gift cards ━━━━━━━━━━━━ */
    page_giftcards() {
      return {
        title: t("tf.rt.gc.title", "Gift cards"),
        lead: t("tf.rt.gc.lead", "Your gift cards, and help choosing a gift."),
        sections: [
          {
            key: "yours",
            h: t("tf.rt.gc.yoursH", "Your gift cards"),
            p: t("tf.rt.gc.yoursP", "Gift cards you hold are listed in your account, with their balance."),
            more: { label: t("tf.rt.gc.open", "Open your gift cards"), to: this.to.giftcards },
          },
          { key: "choose", h: t("tf.rt.gc.chooseH", "Choose a toy"), p: t("tf.rt.gc.chooseP", "The gift finder narrows the toys by age, budget and department.") },
        ],
        next: [
          { label: t("tf.rt.svc.giftFinder", "Open gift finder"), to: tfTo(TF.GIFT) },
          { label: t("tf.rt.svc.allToys", "Browse all toys"), to: this.to.all },
        ],
      };
    },
    /* ━━━━━━━━━━━━ Payment ━━━━━━━━━━━━ */
    page_payment() {
      const title = t("tf.rt.pay.title", "Payment options");
      const lead = t("tf.rt.pay.lead", "The ways you can pay at this shop.");
      const next = [
        { label: t("tf.rt.svc.basket", "Go to your basket"), to: this.to.basket },
        { label: t("tf.rt.help.title", "Help centre"), to: tfTo(TF.HELP) },
      ];
      const list = gateways(this.shop);
      if (!list.length)
        return {
          title,
          lead,
          empty: {
            icon: "card",
            title: t("tf.rt.pay.emptyH", "This shop isn't taking payments right now"),
            text: t("tf.rt.pay.emptyP", "Please check back soon, or send the shop a message."),
            acts: [{ label: t("tf.rt.svc.contact", "Contact the shop"), to: this.to.contact }],
          },
          sections: [],
          next,
        };
      /* one section per way to pay; the same gateway in several currencies is one section */
      const groups = [];
      for (const g of list) {
        const name = String(g.name || g.code || "").trim();
        if (!name) continue;
        const desc = String(g.description || "").trim();
        let grp = groups.find((x) => x.name === name && x.desc === desc);
        if (!grp) groups.push((grp = { name, desc, cod: false, cur: [] }));
        grp.cod = grp.cod || !!(g.cod || g.type === "cod");
        if (g.currency && !grp.cur.includes(g.currency)) grp.cur.push(g.currency);
      }
      const multi = new Set(list.map((g) => g.currency).filter(Boolean)).size > 1;
      const sections = groups.map((g, i) => ({
        key: "g" + i,
        own: true,
        h: g.name,
        p: g.desc,
        tags: [g.cod ? t("tf.rt.pay.cod", "Pay on delivery") : "", multi && g.cur.length ? g.cur.join(" · ") : ""].filter(Boolean),
      }));
      sections.push({ key: "total", h: t("tf.rt.pay.totalH", "Review the total"), p: t("tf.rt.pay.totalP", "Checkout shows your items, the delivery fee and the total before you pay.") });
      return { title, lead, sections, next };
    },
    /* ━━━━━━━━━━━━ Product notices ━━━━━━━━━━━━ */
    page_notices() {
      return {
        title: t("tf.rt.nt.title", "Product notices"),
        lead: t("tf.rt.nt.lead", "Product details, and where to ask about a toy."),
        sections: [
          { key: "details", h: t("tf.rt.nt.detailsH", "Age and product details"), p: t("tf.rt.nt.detailsP", "Each toy's page shows its suggested age and specifications, as the shop gives them.") },
          {
            key: "ask",
            h: t("tf.rt.nt.askH", "Questions about a toy"),
            p: this.shopName ? t("tf.rt.nt.askP", "Send {shop} a message with the toy's name and your question.", { shop: this.shopName }) : t("tf.rt.nt.askAny", "Send the shop a message with the toy's name and your question."),
          },
        ],
        next: [
          { label: t("tf.rt.svc.allToys", "Browse all toys"), to: this.to.all },
          { label: t("tf.rt.svc.contact", "Contact the shop"), to: this.to.contact },
          { label: t("tf.rt.svc.faq", "Questions & answers"), to: this.to.faq },
        ],
      };
    },
  },
};
</script>
