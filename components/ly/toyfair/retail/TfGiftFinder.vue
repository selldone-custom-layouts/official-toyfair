<!--
  Toy Fair: Find a gift (design toy-fair gift-finder.html): the title band; a panel with a photo (the first department
  with its own photo, else the skin's hero, else none) and three choices, all from the live catalogue: Age (every age
  the toys' specification uses), Budget (round amounts from the live prices) and Department (the shop's own). "Show
  matching toys" opens the listing filtered by them. Below: "Browse by age" pills. A choice with nothing to offer is
  left out.
-->
<template>
  <div class="ly tf-page tf-rt">
    <ly-pt :crumbs="[{ label: title }]" :lead="t('tf.rt.gf.lead', 'Choose an age, a budget or a department.')" :title="title" cls="compact" />
    <div class="wrap">
      <div :class="['tf-rt-panel', 'tf-rt-gift', { 'no-ph': !photo }]">
        <div v-if="photo" class="tf-rt-gift-ph"><img :src="photo" alt="" decoding="async" height="700" width="1365" /></div>
        <form class="tf-rt-form tf-rt-gift-form" @submit.prevent="go">
          <div v-if="ageList.length" class="tf-rt-field">
            <label class="tf-rt-lbl" for="tf-rt-age">{{ t("tf.rt.gf.age", "Age") }}</label>
            <span class="tf-rt-sel">
              <select id="tf-rt-age" v-model="age">
                <option value="">{{ t("tf.rt.gf.anyAge", "Any age") }}</option>
                <option v-for="a in ageList" :key="a" :value="a">{{ a }}</option>
              </select>
              <ly-icon name="down" />
            </span>
          </div>
          <div v-if="budgetList.length" class="tf-rt-field">
            <label class="tf-rt-lbl" for="tf-rt-budget">{{ t("tf.rt.gf.budget", "Budget") }}</label>
            <span class="tf-rt-sel">
              <select id="tf-rt-budget" v-model="max">
                <option value="">{{ t("tf.rt.gf.anyBudget", "Any budget") }}</option>
                <option v-for="b in budgetList" :key="b" :value="String(b)">{{ t("tf.rt.gf.upTo", "Up to {amount}", { amount: money(b, true) }) }}</option>
              </select>
              <ly-icon name="down" />
            </span>
          </div>
          <div v-if="cats.length" class="tf-rt-field">
            <label class="tf-rt-lbl" for="tf-rt-dept">{{ t("tf.rt.gf.dept", "Department") }}</label>
            <span class="tf-rt-sel">
              <select id="tf-rt-dept" v-model="cat">
                <option value="">{{ t("tf.rt.gf.anyDept", "All departments") }}</option>
                <option v-for="c in cats" :key="c.id" :value="String(c.id)">{{ catTitle(c) }}</option>
              </select>
              <ly-icon name="down" />
            </span>
          </div>
          <div class="tf-rt-acts">
            <button class="btn" type="submit">{{ t("tf.rt.gf.go", "Show matching toys") }}</button>
          </div>
        </form>
      </div>

      <section v-if="ageList.length" aria-labelledby="tf-rt-ages-h" class="tf-rt-ages">
        <h2 id="tf-rt-ages-h" class="tf-rt-ages-h">{{ t("tf.rt.gf.byAge", "Browse by age") }}</h2>
        <ul :style="{ '--n': Math.min(ageList.length, 7) }" class="tf-ages">
          <li v-for="a in ageList" :key="a">
            <router-link :to="ageTo(a)"><bdi>{{ a }}</bdi></router-link>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
import LyIcon from "../../LyIcon.vue";
import LyPt from "../../ui/LyPt.vue";
import { catTitle, loadDm, ly, money } from "../../ly";
import { collectionPhoto, slotPhoto } from "../../ly-photos";
import { ages, budgets, catalogueRoute } from "../tf";
import { t } from "../../../kalio/i18n/kalio-i18n";
import { currentCurrency } from "../../../region-switcher/region";

export default {
  name: "TfGiftFinder",
  components: { LyIcon, LyPt },
  data: () => ({ age: "", max: "", cat: "" }),
  computed: {
    shop() {
      return this.$store.getters.getShop;
    },
    title() {
      return t("tf.rt.gf.title", "Find a gift");
    },
    cats() {
      return ly.cats || [];
    },
    ageList() {
      void ly.products.length;
      return ages();
    },
    budgetList() {
      void ly.products.length;
      void currentCurrency();
      return budgets(this.shop);
    },
    photo() {
      for (const c of this.cats) {
        const u = collectionPhoto(c);
        if (u) return u;
      }
      return slotPhoto("hero");
    },
  },
  created() {
    loadDm();
  },
  methods: {
    t,
    money,
    catTitle,
    ageTo(a) {
      return catalogueRoute({ spec: "age:" + a });
    },
    go() {
      const query = {};
      if (this.age) query.spec = "age:" + this.age;
      if (this.max) query.price = "0-" + this.max;
      const c = this.cats.find((x) => String(x.id) === this.cat);
      this.$router.push(c ? { name: window.$storefront.routes.SHOP_CATEGORY_PAGE, params: { category_name: c.name }, query } : catalogueRoute(query));
    },
  },
};
</script>
