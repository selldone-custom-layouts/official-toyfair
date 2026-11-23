<!--
  Toy Fair: the pickup finder (route TfPickupFinder, design toy-fair stores.html) and one pickup point's page (route
  TfPickupPoint, design store.html). Only the shop's own pickup points (every enabled Pickup way's points): their
  name, address, phone and the merchant's own message, as written. Opening hours show only when the point's own
  words carry them; "How collection works" says only what checkout does. A shop without pickup points, or an
  unknown point, gets an honest empty state.
-->
<template>
  <div class="ly tf-page tf-rt">
    <!-- ━━━━━━━━━━━━ One pickup point ━━━━━━━━━━━━ -->
    <template v-if="isPoint">
      <ly-pt :crumbs="[{ label: finderTitle, to: finderTo }, { label: pointTitle }]" :lead="pointLead" :title="pointTitle" cls="compact" />
      <div class="wrap">
        <div v-if="point" class="tf-rt-point">
          <article class="tf-rt-panel tf-rt-pick">
            <span class="tf-sym"><ly-icon name="pin" /></span>
            <div class="tf-rt-pick-tx">
              <h2 class="tf-rt-pick-h"><bdi>{{ point.name }}</bdi></h2>
              <p v-if="point.where"><bdi>{{ point.where }}</bdi></p>
            </div>
            <div v-if="point.phone" class="tf-rt-pick-acts">
              <a :href="'tel:' + point.tel" class="btn quiet"><ly-icon name="phone" /><bdi dir="ltr">{{ point.phone }}</bdi></a>
            </div>
          </article>
          <section v-if="point.hours" aria-labelledby="tf-rt-hours-h" class="tf-rt-panel">
            <h2 id="tf-rt-hours-h" class="tf-rt-box-h">{{ t("tf.rt.pk.hoursH", "Opening hours") }}</h2>
            <dl class="tf-rt-hours">
              <div v-if="point.days">
                <dt>{{ t("tf.rt.pk.days", "Pickup days") }}</dt>
                <dd class="tf-rt-wrap">{{ point.days }}</dd>
              </div>
              <div>
                <dt>{{ t("tf.rt.pk.hours", "Hours") }}</dt>
                <dd><bdi dir="ltr">{{ point.hours }}</bdi></dd>
              </div>
            </dl>
          </section>
          <section v-if="point.message" aria-labelledby="tf-rt-msg-h" class="tf-rt-panel">
            <h2 id="tf-rt-msg-h" class="tf-rt-box-h">{{ t("tf.rt.pk.msgH", "From the shop") }}</h2>
            <p class="tf-rt-own"><bdi>{{ point.message }}</bdi></p>
          </section>
          <section aria-labelledby="tf-rt-how-h" class="tf-rt-panel">
            <h2 id="tf-rt-how-h" class="tf-rt-box-h">{{ t("tf.rt.pk.howH", "How collection works") }}</h2>
            <ol class="tf-rt-steps">
              <li>{{ t("tf.rt.pk.step1", "Add the toys you want to your basket and go to checkout.") }}</li>
              <li>{{ t("tf.rt.pk.step2", "Choose Pickup as the way to get your order, then this pickup point.") }}</li>
              <li>{{ t("tf.rt.pk.step3", "Your order page shows the pickup point and your order's status.") }}</li>
            </ol>
            <router-link :to="collectTo" class="tf-more">{{ t("tf.rt.pk.more", "More about pickup") }}<ly-icon name="arrow" /></router-link>
          </section>
        </div>
        <div v-else class="tf-rt-panel">
          <ly-empty v-if="points.length" :text="unknownText" :title="unknownTitle" cls="tf-rt-empty" icon="pin" tag="h2">
            <template #acts>
              <router-link :to="finderTo" class="btn sm">{{ t("tf.rt.pk.all", "See all pickup points") }}</router-link>
            </template>
          </ly-empty>
          <ly-empty v-else :text="noneText" :title="noneTitle" cls="tf-rt-empty" icon="pin" tag="h2">
            <template #acts>
              <router-link :to="deliveryTo" class="btn sm">{{ t("tf.rt.svc.delivery", "Delivery options") }}</router-link>
              <router-link :to="allTo" class="btn sm quiet">{{ t("tf.rt.svc.allToys", "Browse all toys") }}</router-link>
            </template>
          </ly-empty>
        </div>
      </div>
    </template>

    <!-- ━━━━━━━━━━━━ The finder ━━━━━━━━━━━━ -->
    <template v-else>
      <ly-pt :crumbs="[{ label: finderTitle }]" :lead="t('tf.rt.pk.lead', 'Search pickup points by city or ZIP code.')" :title="finderTitle" cls="compact" />
      <div class="wrap">
        <template v-if="points.length">
          <div class="tf-rt-panel tf-rt-search" role="search">
            <label class="tf-rt-lbl" for="tf-rt-pq">{{ t("tf.rt.pk.qLabel", "City or ZIP code") }}</label>
            <input id="tf-rt-pq" v-model="q" :placeholder="t('tf.rt.pk.qHint', 'Search pickup points')" autocomplete="off" class="tf-rt-in" type="search" />
          </div>
          <ul class="tf-rt-picks">
            <li v-for="p in shown" :key="p.key">
              <article class="tf-rt-panel tf-rt-pick">
                <span class="tf-sym"><ly-icon name="pin" /></span>
                <div class="tf-rt-pick-tx">
                  <h2 class="tf-rt-pick-h"><bdi>{{ p.name }}</bdi></h2>
                  <p v-if="p.where"><bdi>{{ p.where }}</bdi></p>
                </div>
                <div class="tf-rt-pick-acts">
                  <router-link :aria-label="t('tf.rt.pk.detailsOf', 'View details of {name}', { name: p.name })" :to="p.to" class="btn quiet">{{ t("tf.rt.pk.details", "View details") }}</router-link>
                </div>
              </article>
            </li>
          </ul>
          <p v-if="!shown.length" class="tf-rt-panel tf-rt-none">{{ t("tf.rt.pk.noMatch", "No pickup points match that search.") }}</p>
          <p class="sr" role="status">{{ q.trim() ? t("tf.rt.pk.count", { one: "{n} pickup point", other: "{n} pickup points" }, { n: shown.length }) : "" }}</p>
        </template>
        <div v-else class="tf-rt-panel">
          <ly-empty :text="noneText" :title="noneTitle" cls="tf-rt-empty" icon="pin" tag="h2">
            <template #acts>
              <router-link :to="deliveryTo" class="btn sm">{{ t("tf.rt.svc.delivery", "Delivery options") }}</router-link>
              <router-link :to="allTo" class="btn sm quiet">{{ t("tf.rt.svc.allToys", "Browse all toys") }}</router-link>
            </template>
          </ly-empty>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import LyIcon from "../../LyIcon.vue";
import LyPt from "../../ui/LyPt.vue";
import LyEmpty from "../../ui/LyEmpty.vue";
import { hoursFrom, loadDm } from "../../ly";
import { TF, catalogueRoute, pickupPoints, tfTo } from "../tf";
import { locale, t } from "../../../kalio/i18n/kalio-i18n";

const WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function listOf(items) {
  try {
    return new Intl.ListFormat(locale(), { style: "long", type: "conjunction" }).format(items);
  } catch {
    return items.join(", ");
  }
}

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
  name: "TfPickups",
  components: { LyIcon, LyPt, LyEmpty },
  data: () => ({ q: "" }),
  computed: {
    shop() {
      return this.$store.getters.getShop;
    },
    isPoint() {
      return this.$route.name === TF.PICKUP;
    },
    /** The shop's pickup points, each with the words the pages show (all from the point itself). */
    points() {
      return pickupPoints(this.shop).map((p, i) => {
        const key = String(p.id ?? i + 1);
        const message = String(p.message || "").trim();
        const hours = hoursFrom(message);
        const days = (p._way?.days || []).filter((d) => WEEK.includes(d));
        return {
          key,
          name: String(p.title || p.name || "").trim() || t("tf.rt.pk.unnamed", "Pickup point"),
          where: pointWhere(p),
          city: String(p.city || "").trim(),
          phone: String(p.phone || "").trim(),
          tel: String(p.phone || "").replace(/[^\d+]/g, ""),
          message,
          hours,
          /* the Pickup way's own days (Selldone's days for that way), shown beside the hours the point's words give */
          days: !days.length ? "" : days.length >= 7 ? t("tf.rt.pk.everyDay", "Every day") : listOf(WEEK.filter((d) => days.includes(d)).map(dayName)),
          search: [p.title, p.name, p.address, p.city, p.state, p.postal, p.country].filter(Boolean).join(" ").toLowerCase(),
          to: tfTo(TF.PICKUP, undefined, { point_id: key }),
        };
      });
    },
    shown() {
      const q = this.q.trim().toLowerCase();
      if (!q) return this.points;
      const words = q.split(/\s+/);
      return this.points.filter((p) => words.every((w) => p.search.includes(w)));
    },
    point() {
      const id = String(this.$route.params.point_id || "");
      return this.points.find((p) => p.key === id) || null;
    },
    pointLead() {
      if (!this.point) return "";
      return this.point.city ? t("tf.rt.pk.inCity", "Pickup point in {city}.", { city: this.point.city }) : "";
    },
    finderTitle() {
      return t("tf.rt.pk.title", "Find a pickup point");
    },
    pointTitle() {
      return this.point ? this.point.name : t("tf.rt.pk.unnamed", "Pickup point");
    },
    unknownTitle() {
      return t("tf.rt.pk.unknownH", "We couldn't find that pickup point");
    },
    unknownText() {
      return t("tf.rt.pk.unknownP", "It isn't one of the shop's pickup points. Choose one of them instead.");
    },
    noneTitle() {
      return t("tf.rt.pk.noneH", "No pickup points yet");
    },
    noneText() {
      return t("tf.rt.cl.emptyP", "This shop has no pickup points yet; your order can be delivered instead.");
    },
    finderTo() {
      return tfTo(TF.PICKUPS);
    },
    collectTo() {
      return tfTo(TF.COLLECT);
    },
    deliveryTo() {
      return tfTo(TF.DELIVERY);
    },
    allTo() {
      return catalogueRoute({});
    },
  },
  created() {
    loadDm();
  },
  methods: { t },
};
</script>
